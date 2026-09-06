#!/bin/bash
# KROK 2 z 2 - uruchamiany na Zenboxie, tam gdzie leza zdjecia.
#
# Przenosi do kwarantanny pliki 'ofe_*', do ktorych nie odwoluje sie zadna oferta.
# NIC NIE KASUJE - kwarantanne usuwasz recznie, gdy sprawdzisz, ze strona dziala.
#
# Domyslnie dry-run. Zeby faktycznie przeniesc pliki, dodaj --apply.
#
# Uzycie:
#   ./gc_offer_photos.sh                 # raport, zero zmian
#   ./gc_offer_photos.sh --apply         # przeniesienie do kwarantanny
set -uo pipefail

domain_folder_path=${DOMAIN_FOLDER_PATH:-/home/perfect/domains/perfect.stronazen.pl}
photos_dir="$domain_folder_path/public_html/offers"
refs_file="$domain_folder_path/photo_refs.txt"
quarantine_dir="$domain_folder_path/photos_quarantine_$(date +%Y%m%d_%H%M%S)"

# --- progi bezpieczenstwa -----------------------------------------------------
# Ponizej tylu referencji lista jest podejrzana (dzis oferty maja ~3500 zdjec).
min_refs=1000
# Jaki % referencji MUSI istniec na dysku, zeby uznac dopasowanie za poprawne.
# To jest glowny bezpiecznik: przy zlej logice budowania nazw spada do ~0.
min_match_percent=90
# Nie ruszamy plikow mlodszych niz tyle godzin - paczka moze czekac na ingest.
min_age_hours=48
# -----------------------------------------------------------------------------

apply=false
[[ "${1:-}" == "--apply" ]] && apply=true

work_dir=$(mktemp -d)
trap 'rm -rf "$work_dir"' EXIT

abort() { echo; echo "PRZERWANE: $*"; echo "Nie ruszono zadnego pliku."; exit 1; }

# Rdzen nazwy = nazwa bez rozszerzenia, malymi literami.
# Porownanie po rdzeniu chroni przed roznica ofe_1.jpg / ofe_1.JPG.
stems() { sed -E 's/\.[^.]+$//' | tr '[:upper:]' '[:lower:]'; }

img_filter=( \( -iname 'ofe_*.jpg' -o -iname 'ofe_*.jpeg' -o -iname 'ofe_*.png' \) )

# --- walidacja wejscia --------------------------------------------------------
[[ -d "$photos_dir" ]] || abort "brak katalogu ze zdjeciami: $photos_dir"
[[ -s "$refs_file"  ]] || abort "brak lub pusty plik referencji: $refs_file"

grep -oE '^ofe_[A-Za-z0-9_.-]+' "$refs_file" | stems | sort -u > "$work_dir/refs"

refs_count=$(wc -l < "$work_dir/refs")
(( refs_count >= min_refs )) || abort \
  "lista referencji ma $refs_count pozycji, minimum to $min_refs. Plik jest niepelny albo zbudowany ze zlego pola."

find "$photos_dir" -maxdepth 1 -type f "${img_filter[@]}" -printf '%f\n' | sort > "$work_dir/all_files"
find "$photos_dir" -maxdepth 1 -type f "${img_filter[@]}" -mmin +$(( min_age_hours * 60 )) \
     -printf '%f\n' | sort > "$work_dir/old_files"

stems < "$work_dir/all_files" | sort -u > "$work_dir/disk"
disk_count=$(wc -l < "$work_dir/disk")
(( disk_count > 0 )) || abort "w $photos_dir nie ma zadnego pliku 'ofe_*' - sprawdz sciezke"

# --- GLOWNY BEZPIECZNIK -------------------------------------------------------
# Ile referencji faktycznie istnieje na dysku. Jesli logika budowania nazw jest
# zepsuta (np. lista zbudowana z pola 'plik' zamiast z ID zalacznika), wskaznik
# spada do ~0 i skrypt staje ZANIM cokolwiek ruszy.
present=$(comm -12 "$work_dir/refs" "$work_dir/disk" | wc -l)
match_percent=$(( present * 100 / refs_count ))

echo "referencji w bazie:        $refs_count"
echo "plikow 'ofe_*' na dysku:   $disk_count"
echo "referencji obecnych:       $present ($match_percent%)"
echo

(( match_percent >= min_match_percent )) || abort \
"tylko $match_percent% referencji odnalazlo sie na dysku (wymagane $min_match_percent%).
  To NIE znaczy, ze pliki sa osierocone - to znaczy, ze dopasowanie nazw nie dziala.
  Najczestsza przyczyna: lista zbudowana z pola 'plik' zamiast 'ofe_<ID>.jpg'."

# --- kandydaci ----------------------------------------------------------------
comm -13 "$work_dir/refs" "$work_dir/disk" > "$work_dir/orphan_stems"

# rdzen<TAB>nazwa, posortowane po rdzeniu - do zlaczenia z lista osieroconych.
index() { awk '{ s=tolower($0); sub(/\.[^.]+$/,"",s); print s "\t" $0 }' | sort -t "$(printf '\t')" -k1,1; }
index < "$work_dir/all_files" > "$work_dir/all_by_stem"
index < "$work_dir/old_files" > "$work_dir/old_by_stem"

join -t "$(printf '\t')" "$work_dir/orphan_stems" "$work_dir/all_by_stem" | cut -f2 > "$work_dir/orphan_files"
join -t "$(printf '\t')" "$work_dir/orphan_stems" "$work_dir/old_by_stem" | cut -f2 > "$work_dir/candidates"

orphan_stems_count=$(wc -l < "$work_dir/orphan_stems")
orphan_files_count=$(wc -l < "$work_dir/orphan_files")
candidates_count=$(wc -l < "$work_dir/candidates")
skipped=$(( orphan_files_count - candidates_count ))

# Pliki graficzne NIE pasujace do konwencji - raportowane, nigdy nie ruszane.
other_images=$(find "$photos_dir" -maxdepth 1 -type f \
  \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' \) ! -iname 'ofe_*' | wc -l)

echo "osieroconych rdzeni:          $orphan_stems_count"
echo "osieroconych plikow:          $orphan_files_count"
echo "  - do przeniesienia:         $candidates_count"
echo "  - pominietych (< ${min_age_hours}h):    $skipped"
echo "obrazkow spoza konwencji 'ofe_*': $other_images  (NIE ruszane, do przejrzenia recznie)"

if (( candidates_count == 0 )); then
  echo; echo "Nie ma czego przenosic."; exit 0
fi

echo
echo -n "Laczny rozmiar do przeniesienia: "
( cd "$photos_dir" && tr '\n' '\0' < "$work_dir/candidates" \
  | du -ch --files0-from=- 2>/dev/null | tail -1 | cut -f1 )
echo
echo "Przyklady (do 20):"
head -20 "$work_dir/candidates" | sed 's/^/  /'

if [[ "$apply" != true ]]; then
  cp "$work_dir/candidates" "$domain_folder_path/gc_candidates_$(date +%Y%m%d_%H%M%S).txt" 2>/dev/null \
    && echo && echo "Pelna lista zapisana w $domain_folder_path/gc_candidates_*.txt"
  echo
  echo "To byl DRY-RUN - nie ruszono zadnego pliku."
  echo "Zeby przeniesc do kwarantanny, uruchom ponownie z --apply"
  exit 0
fi

# --- przeniesienie ------------------------------------------------------------
mkdir -p "$quarantine_dir" || abort "nie moge utworzyc $quarantine_dir"

moved=0 failed=0
while IFS= read -r file; do
  [[ -z "$file" ]] && continue
  if mv "$photos_dir/$file" "$quarantine_dir/$file" 2>/dev/null; then
    moved=$(( moved + 1 ))
  else
    failed=$(( failed + 1 ))
    echo "  nie udalo sie przeniesc: $file"
  fi
done < "$work_dir/candidates"

cp "$refs_file" "$quarantine_dir/photo_refs_uzyte.txt" 2>/dev/null || true

echo
echo "Przeniesiono: $moved   Bledow: $failed"
echo "Kwarantanna:  $quarantine_dir"
echo
echo "DALEJ:"
echo "  1. Otworz strone i sprawdz kilka ofert - czy zdjecia sie laduja."
echo "  2. Jesli czegos brakuje: mv $quarantine_dir/* $photos_dir/"
echo "  3. Dopiero gdy przez tydzien nic nie zgloszono: rm -rf $quarantine_dir"
echo "     (miejsce na dysku zwalnia sie dopiero w tym kroku)"
