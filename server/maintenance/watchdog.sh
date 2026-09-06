#!/bin/bash
# Dead man's switch - uruchamiany z crona na VPS (root@51.77.195.170).
#
# Stoi CELOWO na VPS, a nie na Zenboxie: straznik nie moze mieszkac wewnatrz tego,
# co pilnuje. Gdyby padl cron w panelu Zenboxa, alert padlby razem z nim.
#
# Milczy, gdy jest dobrze. Przy problemie wysyla maila sam, przez konto z
# /root/perfect/watchdog.conf (ALERT_TO, ALERT_FROM). Gdy wysylka sie nie uda,
# tresc trafia na stdout - wtedy podejmie ja MAILTO crona, o ile jest MTA.
#
# Kryterium NIE brzmi "brak danych od 24h" - Galactica nie wysyla codziennie
# (realne przerwy 21.08->23.08, 27.08->29.08), wiec taki alert dzwonilby bez powodu,
# a alert dzwoniacy bez powodu przestaje byc czytany.
# Kryterium brzmi "plik zalega w public_ftp" - cisza od Galactiki to pusty folder,
# czyli stan zdrowy. Awarie z 21.08 wykrylby w pol godziny zamiast w 15 dni.
#
# Uzycie:
#   ./watchdog.sh           # cichy przy zdrowym stanie
#   ./watchdog.sh --test    # wymusza alert, do sprawdzenia calej sciezki maila
#   ./watchdog.sh --status  # wypisuje stan zawsze, nic nie wysyla
set -uo pipefail

zenbox=perfect@2.57.137.38
domain_folder_path=/home/perfect/domains/perfect.stronazen.pl
state_file=/root/perfect/watchdog.state

# Plik lezacy w public_ftp dluzej niz tyle minut = pipeline stoi.
# Cron pipeline'u chodzi co 15 min, wiec 30 daje zapas na jeden przebieg.
stuck_minutes=30
# Brak jakiejkolwiek przetworzonej paczki od tylu godzin = zapasowy alarm
# na wypadek, gdyby Galactica przestala wysylac w ogole.
quiet_hours=72
# Gdy problem trwa, nie powtarzaj alertu czesciej niz co tyle godzin.
# Bez tego cron mailowalby co 15 minut i alert szybko trafilby do kosza.
repeat_hours=6

# Adresy i konto SMTP trzymamy POZA repozytorium - ten plik tworzysz na VPS.
# Wzor w komentarzu instalacyjnym; wymagane: ALERT_TO, ALERT_FROM.
config_file=/root/perfect/watchdog.conf
[[ -f "$config_file" ]] && . "$config_file"
alert_to=${ALERT_TO:-}
alert_from=${ALERT_FROM:-watchdog@localhost}

mode=${1:-}

# Probuje wyslac maila samodzielnie. Zwraca 1, gdy sie nie da - wtedy tresc
# ladnie wypada na stdout i moze ja podjac MAILTO crona, jesli jest MTA.
mail_error=""
send_mail() {
  local subject=$1 body=$2
  [[ -n "$alert_to" ]] || { mail_error="brak ALERT_TO w $config_file"; return 1; }
  local message
  message=$(printf 'To: %s\nFrom: %s\nSubject: %s\n\n%s\n' \
                   "$alert_to" "$alert_from" "$subject" "$body")
  # stderr przechwytujemy, zeby powod nieudanej wysylki nie zginal - inaczej
  # nie odroznisz "bylo dobrze, wiec cisza" od "alert padl po drodze".
  if command -v msmtp >/dev/null 2>&1; then
    mail_error=$(printf '%s' "$message" | msmtp "$alert_to" 2>&1) && return 0
  elif [[ -x /usr/sbin/sendmail ]]; then
    mail_error=$(printf '%s' "$message" | /usr/sbin/sendmail -t 2>&1) && return 0
  elif command -v mail >/dev/null 2>&1; then
    mail_error=$(printf '%s\n' "$body" | mail -s "$subject" "$alert_to" 2>&1) && return 0
  else
    mail_error="brak msmtp, sendmail i mail na tym hoscie"
  fi
  return 1
}

# Wysyla mailem, a gdy sie nie uda - wypisuje na stdout (przechwyci cron).
emit() {
  local subject=$1 body=$2
  if send_mail "$subject" "$body"; then
    [[ "$mode" == "--test" ]] && echo "Wyslano do $alert_to przez $(command -v msmtp || echo sendmail/mail)."
    return 0
  fi
  printf '%s\n\n%s\n' "$subject" "$body"
  echo
  echo "UWAGA: nie udalo sie wyslac maila. Powod: ${mail_error:-nieznany}"
}

probe() {
  # Do testow: WATCHDOG_FAKE_PROBE wskazuje plik z podstawiona odpowiedzia.
  if [[ -n "${WATCHDOG_FAKE_PROBE:-}" ]]; then
    cat "$WATCHDOG_FAKE_PROBE"
    return $?
  fi
  ssh -o BatchMode=yes -o ConnectTimeout=20 "$zenbox" \
      "DOMAIN='$domain_folder_path' STUCK_MIN='$stuck_minutes' bash -s" <<'REMOTE'
ftp="$DOMAIN/public_ftp"
archive="$DOMAIN/offers_archive"
[[ -d "$ftp" ]]     || { echo "ERROR:brak katalogu $ftp"; exit 3; }
[[ -d "$archive" ]] || { echo "ERROR:brak katalogu $archive"; exit 3; }
echo "PENDING:$(find "$ftp" -maxdepth 1 -type f | wc -l)"
echo "STUCK:$(find "$ftp" -maxdepth 1 -type f -mmin +"$STUCK_MIN" | wc -l)"
echo "STUCK_NAMES:$(find "$ftp" -maxdepth 1 -type f -mmin +"$STUCK_MIN" -printf '%f ' | head -c 300)"
newest=$(find "$archive" -maxdepth 1 -type f -name '*.zip' -printf '%T@\n' | sort -rn | head -1)
if [[ -z "$newest" ]]; then
  echo "ARCHIVE_AGE_H:-1"
else
  echo "ARCHIVE_AGE_H:$(( ( $(date +%s) - ${newest%.*} ) / 3600 ))"
fi
REMOTE
}

problems=()

if [[ "$mode" == "--test" ]]; then
  problems+=("TO JEST TEST (--test). Jesli czytasz to w mailu, sciezka alertu dziala.")
else
  output=$(probe 2>&1)
  probe_rc=$?

  if (( probe_rc != 0 )); then
    # Nieudany kontakt z Zenboxem to tez awaria - moze byc padnietym hostem,
    # wygaslym kluczem albo zmiana IP. Cisza bylaby tu najgorsza odpowiedzia.
    problems+=("Nie moge sprawdzic Zenboxa (ssh rc=$probe_rc).
Odpowiedz: ${output:-brak}")
  else
    get() { sed -n "s/^$1://p" <<<"$output" | head -1; }
    stuck=$(get STUCK)
    pending=$(get PENDING)
    archive_age=$(get ARCHIVE_AGE_H)

    if [[ -z "$stuck" || -z "$archive_age" ]]; then
      problems+=("Nieczytelna odpowiedz z Zenboxa:
$output")
    else
      if (( stuck > 0 )); then
        problems+=("W public_ftp zalega $stuck plik(ow) dluzej niz $stuck_minutes min.
Pipeline nie zabiera paczek - to ta sama awaria co 21.08.2026.
Pliki: $(get STUCK_NAMES)
Sprawdz: ssh $zenbox 'ls -la $domain_folder_path/public_ftp'")
      fi
      if (( archive_age < 0 )); then
        problems+=("offers_archive jest puste - nie moge ustalic, kiedy cokolwiek przetworzono.")
      elif (( archive_age > quiet_hours )); then
        problems+=("Od $archive_age h nie przetworzono zadnej paczki (prog: $quiet_hours h).
W public_ftp czeka teraz: $pending plik(ow).
Jesli public_ftp jest puste, to prawdopodobnie Galactica nic nie wysyla.")
      fi
    fi
  fi
fi

# --- raport na zadanie, bez wysylki -----------------------------------------
if [[ "$mode" == "--status" ]]; then
  echo "sprawdzono: $(date '+%F %T')"
  [[ -n "${output:-}" ]] && echo "$output"
  if (( ${#problems[@]} == 0 )); then echo "STAN: OK"; else
    echo "STAN: PROBLEM"; printf '%s\n' "${problems[@]}"; fi
  exit 0
fi

# --- decyzja, czy sie odezwac ------------------------------------------------
previous_status=OK
last_alert=0
if [[ -f "$state_file" ]]; then
  previous_status=$(sed -n 's/^status=//p' "$state_file" | head -1)
  last_alert=$(sed -n 's/^last_alert=//p' "$state_file" | head -1)
fi
: "${previous_status:=OK}"
: "${last_alert:=0}"
now=$(date +%s)

if (( ${#problems[@]} == 0 )); then
  printf 'status=OK\nlast_alert=%s\n' "$last_alert" > "$state_file"
  # Powrot do normy warto odnotowac - inaczej nie wiadomo, czy problem minal.
  if [[ "$previous_status" == "PROBLEM" ]]; then
    emit "[perfect-house] Pipeline znowu dziala" \
         "Pipeline ofert wrocil do normy $(date '+%F %T')."
  fi
  exit 0
fi

should_alert=false
[[ "$previous_status" == "OK" ]] && should_alert=true
(( now - last_alert > repeat_hours * 3600 )) && should_alert=true

if [[ "$should_alert" == true ]]; then
  printf 'status=PROBLEM\nlast_alert=%s\n' "$now" > "$state_file"
  emit "[perfect-house] PIPELINE OFERT - PROBLEM" \
"$(printf '%s\n\n' "${problems[@]}")
Sprawdzono: $(date '+%F %T')
Kolejne przypomnienie nie wczesniej niz za $repeat_hours h."
else
  printf 'status=PROBLEM\nlast_alert=%s\n' "$last_alert" > "$state_file"
fi
exit 0
