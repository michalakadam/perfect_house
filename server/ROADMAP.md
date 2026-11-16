# Roadmapa przepisania back-endu

Dokument roboczy. Stan na 2026-11-16 (pierwotna wersja: 2026-09-05).

Cel: zastąpić obecny łańcuch skryptów jednym serwisem Spring Boot, który serwuje oferty,
agentów i zdjęcia, i który da się monitorować oraz wdrażać powtarzalnie.

`README.md` w tym katalogu opisuje architekturę **obecną** i jest częściowo nieaktualny
(wspomina `fetch_converted_offers.sh` jako proces ciągły — ten model zniknął w commicie
`4285f68`). Nie poprawiamy go; zostanie zastąpiony po Etapie 2.

---

## 1. Dlaczego przepisujemy

Awaria z 21.08.2026 (15 dni bez aktualizacji ofert) nie wynikała z tego, że oferty leżą
w pliku JSON zamiast za API. Wynikała z tego, że łańcuch ingestu **nie ma jak zgłosić, że
się wywalił**: 5 skryptów bash i aplikacja Node rozrzucone po dwóch serwerach, spięte
`scp` i `ssh`, bez `set -e`, z `>> /dev/null` na cronie.

Bezpośrednia przyczyna: `check_ftp_folder.sh` czyta `offers_file_name="$(ls $ftp_folder_path)"`,
co przy dwóch plikach daje jedną zmienną z dwiema nazwami. `wc` zwraca `ambiguous redirect`,
`unzip` nie rozpakowuje, `mv` nie archiwizuje — a `process_files.sh` i tak się odpala i wysyła
puste XML-e na serwer bazy. Ponieważ pliki nie znikają z `public_ftp`, przy kolejnym przebiegu
jest ich jeszcze więcej. Zakleszczenie trwałe. Wyzwalacz: Galactica wysłała dwie paczki
w odstępie 7 minut, wewnątrz jednego okna crona `*/15`.

Wniosek, który kształtuje całą roadmapę: **samo API tego nie naprawia.** Gdyby Spring Boot
był karmiony tym samym łańcuchem, awaria wyglądałaby identycznie. Dlatego kolejność etapów
jest podporządkowana redukcji ryzyka, a nie atrakcyjności technologii.

## 2. Stan faktyczny (pomiary z 2026-09-05)

| | |
|---|---|
| Oferty | 329, wszystkie ze statusem `Aktualna` (313 sprzedaż / 16 wynajem) |
| Zdjęcia | 3 499 (~10,6 na ofertę) |
| `offers.json` | 1,78 MB, pobierane w całości przy pierwszym wejściu na stronę |
| — z tego `UwagiOpis` | 640 KB (36%), potrzebne tylko na stronie szczegółów |
| — z tego `Zdjecia` | 305 KB (17%), na kartę potrzebne jedno zdjęcie |
| Po minifikacji + gzip | 346 KB |
| Lokalizacje | 16 województw, 195 miejscowości |

Do klienta lecą surowe nazwy pól z Galactiki (`Przedmiot`, `UwagiOpis`, `Wynajem` jako
string `"False"`) oraz mongowe `_id`. `offers-converter.service.ts` to 18 KB kodu
w przeglądarce, którego jedynym zadaniem jest tłumaczenie schematu CRM na model domenowy.

### Infrastruktura

- **Zenbox** (`perfect@2.57.137.38`, perfect.stronazen.pl) — hosting **współdzielony**.
  Brak roota, cron przez formularz w panelu. Nie uruchomi Dockera ani Spring Boota.
  Docelowa rola: hosting statycznych plików Angulara + skrzynka FTP na paczki z Galactiki.
- **VPS** (`root@51.77.195.170`, OVH) — root, MongoDB, node przez nvm.
  Docelowa rola: cały back-end w Dockerze.

  Pomiary z 2026-11-16: **1 vCPU, 1,9 GB RAM, brak swapu**, dysk 20 GB (9,5 GB wolne).
  Ubuntu 20.04 i MongoDB 4.2.18 — oba poza wsparciem. Dockera nie ma. nginx + certbot
  serwują na 80/443 prywatną stronę `adam-michalak.site` (statyczny build, 2,1 MB,
  `/var/www/mysite/dist`). Na porcie 21 działał `vsftpd` z gołym FTP (`ssl_enable=NO`).
  Nie należy do łańcucha ofert, a w logach nie ma ani jednego udanego logowania, tylko
  skanery. **Wyłączony 2026-11-16** (`systemctl disable --now vsftpd`, pakiet
  zostaje, więc można go przywrócić).

  **Decyzja 2026-11-16: nowy back-end dostaje nowy VPS.** Obecny zostaje tylko dla
  strony prywatnej, do czasu jej przeniesienia na serwer domowy, a potem zostanie
  zlikwidowany. Jego ograniczenia nie wpływają więc na architekturę.

- **Nowy VPS pod API** — OVH VPS-1: 2 vCore, 4 GB RAM, 40 GB NVMe, ok. 20 zł brutto
  miesięcznie, dzienny backup w cenie, Ubuntu 24.04. Wystarcza na Spring, bazę, MinIO
  i reverse proxy. Zdjęcia (~1 GB plus miniatury) mieszczą się z dużym zapasem.
  Archiwum ZIP-ów zostaje na Zenboxie.

## 3. Ustalenia

| Decyzja | Uzasadnienie |
|---|---|
| Bez SSR/prerenderu | Ruch idzie z portali (Otodom/OLX), oferty nie muszą być indeksowane. Wycina największy pojedynczy kawałek pracy. SPA zostaje. |
| Skala docelowa: setki ofert | Paginacja i indeksy to kwestia higieny, nie wydajności. Nie optymalizujemy na zapas. |
| Wszystko na własnym VPS, bez chmury | Brak kosztów stałych. Storage plików: MinIO w kontenerze. |
| Ingest **pull**, nie push | Patrz niżej — najważniejsza decyzja architektoniczna. |
| Filtrowanie po stronie API | Nie dla wydajności (329 rekordów filtruje się w ułamku ms), tylko dla payloadu i modelu domenowego. |
| Galactica: brak API | Potwierdzone u dostawcy. FTP + ZIP to jedyny kanał, na stałe. |
| Bez CQRS, heksagonu, kolejek, cache'a | Jeden klient, 329 rekordów. Największa pokusa przy przepisywaniu na Springa to architektura pod skalę, której nie będzie. |
| Spring Boot 4.x | Linia 3.x wychodzi ze wsparcia; nowy serwis nie zaczyna od migracji. Prototyp z 2023 (`origin/feat/offers_api`, Boot 3.1, push przez `POST /upload`) nie jest bazą — najwyżej źródłem DTO dla XML-a z Galactiki. |
| Etapy 1–4 najpierw lokalnie | Cały nowy back-end powstaje i jest testowany lokalnie (docker compose) na kopii danych produkcyjnych. Wdrożenie na VPS to osobny krok po Etapie 4, nie część każdego etapu. Produkcja do tego czasu działa na starym łańcuchu. |
| Agenci: jednorazowy seed | Lista agentów się nie zmienia i nie przychodzi w paczkach. Ładowana raz, przy pierwszym imporcie, z `frontend/src/agents/agents.json` (10 rekordów + zdjęcia `user_*.jpg`). Ingest jej nie dotyka. |

### Odwrócenie kierunku przepływu

Dziś Zenbox **pcha** dane na VPS: cron w panelu → bash → `scp` → `ssh`. Zenbox jest
w łańcuchu ingestu, mimo że nie ma tam roota, monitoringu, sensownych logów ani sposobu
na obsłużenie błędu. Wszystkie dotychczasowe awarie mieszkają w tym kawałku.

Docelowo **VPS sam sięga po pliki** — Spring łączy się po SFTP do Zenboxa i zaciąga nowe ZIP-y.
Konsekwencje:

- na Zenboxie nie zostaje ani jeden skrypt i ani jeden cron,
- awaria jest widoczna tam, gdzie są logi i alerty, a nie na końcu łańcucha `ssh`,
- retry jest trywialny — plik źródłowy leży nietknięty do potwierdzonego zapisu,
- działa niezależnie od tego, czy Galactica kiedykolwiek zmieni sposób dostarczania.

## 4. Architektura docelowa

```
Galactica ──FTP──> Zenbox: public_ftp/          (skrzynka, nic więcej)
                            │
                            │  SFTP pull (Spring, scheduled)
                            ▼
                   VPS 51.77.195.170 (docker compose)
                   ├── api          Spring Boot: ingest + REST
                   ├── db           baza ofert i agentów
                   └── minio        zdjęcia (wolumen na dysku hosta)
                            │
                            │  HTTPS
                            ▼
                   Zenbox: public_html/          (statyczny Angular)
```

---

## Etap 0 — Widoczność i sprzątanie ✅ ZROBIONE 2026-09-06

**Nie czekało na Springa. Zrobione na obecnym systemie.**

Cel: przestać być ślepym i odzyskać miejsce na dysku Zenboxa.

1. **Dead man's switch** ✅ — `maintenance/watchdog.sh`, cron `*/15` na VPS.

   Kryterium **nie** brzmi „brak danych od 24 h", jak zakładał pierwotny plan. Galactica
   nie wysyła codziennie (realne przerwy 21.08→23.08, 27.08→29.08), więc taki alert
   dzwoniłby bez powodu — a alert dzwoniący bez powodu przestaje być czytany i nie
   zadziała wtedy, kiedy trzeba. To gorsze niż brak alertu.

   Właściwe kryterium: **plik zalega w `public_ftp` dłużej niż 30 min.** Cisza od
   Galactiki to pusty folder, czyli stan zdrowy — zero fałszywych alarmów. Awarię
   z 21.08 wykryłby w pół godziny zamiast w 15 dni. Do tego alarm zapasowy (brak
   przetworzonej paczki od 72 h) i trzeci przypadek: nieudany kontakt z Zenboxem —
   cisza byłaby tu najgorszą odpowiedzią.

   Stoi na VPS, nie na Zenboxie: **strażnik nie może mieszkać wewnątrz tego, co pilnuje.**
   Wysyłka przez `msmtp` i skrzynkę na domenie — poczta z gołego IP VPS-a do Gmaila nie
   dolatuje (brak SPF i reverse DNS). Powtórzenia ograniczone do jednego na 6 h.
   Adresy w `/root/perfect/watchdog.conf`, poza repozytorium.

2. **Logi crona** ✅ — `>> /dev/null 2>&1` zastąpione plikiem `logs/cron.log`.

   Watchdog mówi *co* („coś zalega"), log mówi *dlaczego*. 21 sierpnia pipeline nie
   milczał — co 15 minut wypluwał `ambiguous redirect`, `unzip: cannot find zipfile
   directory` i `mv: target is not a directory`, czyli gotową diagnozę. Wszystkie
   ~1 440 kopii poszły do `/dev/null`.

   Pole „Wysyłaj wynik powiadomień cron na E-Mail" w panelu zostaje **puste**: `unzip`
   wypisuje coś przy każdym *udanym* przebiegu, więc mailowałoby ~96 razy dziennie
   i zostałoby wyciszone w tydzień — razem z jedynym kanałem ostrzegania.

3. **Dumpów bazy nie ma — za to repozytorium rozjechało się z produkcją.**

   Pierwotne założenie (kilka tysięcy timestampowanych eksportów, kilkanaście GB)
   opierało się na zacommitowanym `db_server_scripts/update_db.sh` i **było błędne**.
   Na produkcji nie ma ani jednego takiego pliku.

   Produkcyjny `update_db.sh` różni się od repo w dwóch miejscach:

   | | repo | produkcja |
   |---|---|---|
   | cel `scp` | `.../public_html/offers` — katalog, więc nazwa timestampowana | `.../public_html/offers/offers.json` — stała nazwa, nadpisywana |
   | `mongoexport` | `--pretty` | `--pretty --jsonArray` |

   Druga różnica jest krytyczna: bez `--jsonArray` mongoexport produkuje NDJSON, którego
   `httpClient.get()` we froncie nie sparsuje. Czyli **skrypty w repo nie są zdatne do
   uruchomienia** — ktoś łatał je bezpośrednio na serwerze i nie wrócił z tym do repo.

   Konsekwencja dla Etapów 1–2: **punktem odniesienia przy przepisywaniu są skrypty
   z serwera, nie z repozytorium.** Przed każdym etapem trzeba je pobrać i zdiffować.

4. **GC osieroconych zdjęć** ✅ — `maintenance/export_photo_refs.sh` (VPS) +
   `maintenance/gc_offer_photos.sh` (Zenbox). `copy_offer_jpgs` robi wyłącznie `mv`
   do środka i nic nigdy nie kasuje; sieroty to zdjęcia usuniętych ofert oraz podmienione
   zdjęcia ofert zaktualizowanych, narastająco od 2021.

   **Skrypt jest idempotentny**, więc można go puścić ponownie bez ryzyka — ale nie jest
   to rutyna do wpinania w crona. To narzędzie przejściowe: ostatni przebieg wypada
   w Etapie 3, przy przenoszeniu zdjęć, a potem znika razem ze skryptami bash.

   **Pułapka, która raz już skasowała wszystkie zdjęcia.** Załącznik w bazie ma pole `plik`
   (np. `"2.jpg"`) i pole `ID`. Nazwa na dysku to `ofe_<ID>.jpg` — patrz
   `offers-converter.service.ts:460`. Pole `plik` to wewnętrzna nazwa z Galactiki, nie
   odpowiada niczemu na dysku i nie jest unikalne (`2.jpg` występuje w 95 ofertach).
   Lista referencji zbudowana z `plik` daje **zerowe przecięcie** z katalogiem, czyli
   „wszystko jest osierocone".

   Dalsze miny potwierdzone w danych: `Zdjecia.Foto` bywa **obiektem zamiast listy**
   (3 oferty z 329) — iterowanie po nim daje klucze, nie załączniki; `Foto` zawiera też
   `Rzut` (75) i `Filmy` (4), więc filtrowanie po `typ == "Zdjecie"` skasowałoby rzuty.

   Bezpieczniki w `gc_offer_photos.sh`, wszystkie przetestowane na Linuksie:

   | Bezpiecznik | Po co |
   |---|---|
   | **≥ 90% referencji musi istnieć na dysku** | Główny. Wykrywa zepsutą logikę nazw, zanim cokolwiek ruszy — przy błędzie z `plik` wskaźnik spada do 0%. |
   | Minimum 1000 referencji | Łapie pustą lub obciętą listę z bazy. |
   | Format `ofe_*` przy wczytywaniu | Lista w złej konwencji jest odrzucana od razu. |
   | Kwarantanna zamiast `rm` | Operacja odwracalna. Miejsce zwalnia się dopiero przy ręcznym usunięciu kwarantanny. |
   | Dry-run domyślnie, `--apply` świadomie | Nic się nie dzieje przypadkiem. |
   | Tylko pliki `ofe_*` z rozszerzeniem obrazka | JSON-y i pliki spoza konwencji są raportowane, nigdy ruszane. |
   | Pominięcie plików < 48 h | Paczka mogła jeszcze nie zostać zaingestowana. |

**Świadomie nie wplatamy stałego mechanizmu czyszczenia w istniejące skrypty bash.**
Jednorazowe sprzątanie jest pilne, bo kończy się dysk. Mechanizm ciągły należy do Etapu 2 —
inwestowanie w skrypty, które i tak znikają, to podwójna praca.

**Stan po zamknięciu etapu.** Alert działa i został przetestowany end-to-end (`--test`).
Logi crona spływają do pliku. Osierocone zdjęcia sprzątnięte, miejsce odzyskane.

**Przeciek zdjęć trwa dalej** — `copy_offer_jpgs` nadal robi wyłącznie `mv` do środka.
Nie planujemy jednak cyklicznego sprzątania: Etap 2 usuwa przyczynę, a jedyna
pozostała czystka wypada w Etapie 3. Tempo przecieku (kilkadziesiąt–kilkaset MB
miesięcznie) nie wymaga reagowania w międzyczasie.

## Etap 1 — API read-only nad obecną Mongo

Cel: postawić serwis i kontrakt, bez dotykania ingestu.

- `docker-compose` na VPS: kontener `api` obok istniejącej Mongo (host networking).
- Endpointy `/api/offers` (z filtrami jako query params), `/api/offers/{id}`, `/api/agents`.
- Mapowanie CRM → model domenowy **przenosi się z przeglądarki na serwer**.
  Front przestaje widzieć `Przedmiot`, `Wynajem: "False"` i `_id`.
- Lista zwraca tylko pola karty (bez `UwagiOpis`) — 1,78 MB spada do rzędu 50–100 KB.
- Front: zmiana w `offers-dao.service.ts` i `agents-dao.service.ts`. Reszta NgRx zostaje.
  `offers-converter.service.ts` znika.
- HTTPS + subdomena dla API, CORS pod domenę strony.

**Baza celowo zostaje na Mongo.** Dopóki stary łańcuch bash jest źródłem prawdy, musi mieć
gdzie pisać. Postgres w tym etapie oznaczałby albo bazę, która się nie aktualizuje między
Etapem 1 a 2, albo dwuzapis — jedno i drugie gorsze niż repozytorium do wyrzucenia.

**Ryzyko:** niskie. `offers.json` dalej leży na dysku, rollback to powrót do starego URL-a.

**Kryterium ukończenia:** strona działa wyłącznie na API, stary `offers.json` nietknięty
jako plan B.

## Etap 2 — Ingest w Springu (+ decyzja o bazie)

Cel: usunąć cały bash i wyprowadzić Zenbox z łańcucha ingestu.

- Scheduled job: SFTP pull nowych ZIP-ów → rozpakowanie → parsowanie XML →
  zapis transakcyjny → log wyniku.
- **Idempotencja** po nazwie pliku (tabela przetworzonych paczek) — powtórka nie duplikuje.
- **Kolejność chronologiczna** paczek jest wymogiem poprawności, nie optymalizacją:
  to update'y przyrostowe.
- Wiele paczek w jednym przebiegu — warunek brzegowy, który wywalił stary system.
- **Ciągłe czyszczenie osieroconych zdjęć** — mechanizm z Etapu 0 jako stały element
  po każdym udanym imporcie.
- Znika: 5 skryptów, aplikacja `offers_updater`, `scp`, `ssh`, cron w panelu Zenboxa,
  timestampowane dumpy w `public_html`.

**Jeśli Postgres, to tutaj.** Warstwa zapisu i tak powstaje od zera, więc migracja jest
w tym momencie darmowa; robiona później oznacza pisanie jej dwa razy. Za Postgresem:
45 płaskich pól, filtrowanie po zakresach, JOIN do agentów, `pg_dump` w cronie jako backup.
Dopuszczalne jest też zostanie przy Mongo — decyzja po Etapie 1, na podstawie tego, jak
wygląda warstwa zapytań.

**Kryterium ukończenia:** na Zenboxie nie działa żaden skrypt ani cron; oferty aktualizują
się same; wymuszone powtórzenie paczki nie tworzy duplikatów.

## Etap 3 — Zdjęcia: MinIO + miniatury

Cel: własny storage z API S3 i realna oszczędność transferu.

- **MinIO w compose**, dane na wolumenie hosta (np. `/var/lib/minio/data`),
  `restart: unless-stopped`, `systemctl enable docker` — przeżywa restart VPS-a.
- **Ostatnia czystka zdjęć** — `gc_offer_photos.sh` tuż przed migracją. Do MinIO jadą
  wyłącznie pliki żywe; sieroty zostają i nie zaśmiecają nowego storage'u. Po tym kroku
  problem znika u źródła, bo ingest z Etapu 2 nowych sierot już nie produkuje.
- **Miniatury generowane w ingescie.** Dziś karuzela ładuje pełne zdjęcia jako miniatury;
  to wymierny koszt dla użytkownika na komórce i jedyna twarda korzyść wydajnościowa
  tego etapu. Warianty: miniatura (karuzela/karta) + pełny (galeria).
- Zmiana URL-i zdjęć we froncie. MinIO bez własnej subdomeny: reverse proxy wystawia
  zdjęcia pod `api.e-perfecthouse.pl`, na osobnej ścieżce.

**Trwałość — czego MinIO w tej konfiguracji nie daje.** Jeden węzeł, jeden dysk, brak
redundancji. Restart VPS-a przeżyje (to kwestia wolumenu, nie MinIO), ale awaria dysku nie.

Pierwotny plan zakładał, że zdjęcia są odtwarzalne z `offers_archive`. **To nieprawda**
(sprawdzone 2026-11-16): archiwum zaczyna się 2026-01-02, a oferty wystawione wcześniej
mają zdjęcia wyłącznie w `public_html/offers`. Potrzebny jest więc osobny backup zdjęć —
np. jednorazowy snapshot żywych zdjęć przy migracji do MinIO plus okresowy `mc mirror`
poza VPS. Archiwum ZIP-ów (18 GB, przyrost ~1,7 GB/mies.) nie zmieści się na VPS-ie
i zostaje na Zenboxie.

Zdjęcia po GC z Etapu 0: 4 128 plików, 983 MB — mieszczą się w 9,5 GB wolnego miejsca
na VPS-ie z zapasem na miniatury.
MinIO jest na AGPL v3 — dla własnego serwisu bez redystrybucji bez znaczenia; lżejszą
alternatywą z tym samym API jest Garage.

**Kryterium ukończenia:** zdjęcia serwowane z VPS-a, karuzela ładuje miniatury,
`docker compose down && up` nie gubi plików.

## Etap 4 — Porządki

- Usunięcie `website_server_scripts/`, `db_server_scripts/`, `offers_updater/`.
- Przepisanie `README.md` pod nową architekturę.
- Zenbox: tylko statyczny front + skrzynka FTP.

---

## Do zweryfikowania

- [x] ~~Czy produkcyjne `update_db.sh` różni się od repo~~ — **tak, w dwóch miejscach.**
      Patrz Etap 0 pkt 3. `offers.json` jest nadpisywany pod stałą nazwą.
- [x] ~~Pobrać produkcyjne wersje wszystkich skryptów i zdiffować z repo~~ — zrobione
      2026-11-16. Rozjazd jest tylko w `update_db.sh` (dwie znane różnice).
      `check_ftp_folder.sh` różni się wyłącznie białymi znakami; `process_files.sh`
      i `convert_xml_to_json.sh` są identyczne; `offers_updater/src` ma jeden nieużywany
      import więcej (produkcja uruchamia skompilowany `dist/` z 2021). **Specyfikacją
      dla Etapu 2 są skrypty z repo + poprawiony `update_db.sh`.**
- [x] ~~`du -sh` na `public_html/offers`~~ — zrobione przy GC zdjęć.
- [x] ~~Wolne miejsce na VPS-ie pod MinIO~~ — 9,5 GB z 20 GB. Zdjęcia (983 MB) się
      mieszczą, archiwum ZIP-ów (18 GB) nie.
- [x] ~~Czy `offers_archive` jest kompletne od 2021~~ — **nie.** 943 paczki od
      2026-01-02. Nie jest backupem zdjęć — patrz Etap 3.
- [x] ~~Czy Zenbox udostępnia SFTP~~ — tak, `s38.zenbox.pl:22`, logowanie kluczem.
      VPS już ma dostęp (`update_db.sh` robi tam `scp`), więc pull w Etapie 2 nie
      wymaga zmian po stronie Zenboxa.
- [ ] **DNS domeny `e-perfecthouse.pl` jest u Galactiki** (`ns1–3.galactica.pl`)
      i przeniesienie go nie wchodzi w grę. Potrzebny jest **jeden** rekord A:
      `api.e-perfecthouse.pl` → IP nowego VPS-a. Zdjęcia z MinIO też idą pod tę
      nazwę, przez ścieżkę w reverse proxy, więc Galacticę prosimy tylko raz.
      CAA domeny dopuszcza `letsencrypt.org`, więc certyfikat da się wystawić bez
      zmian po ich stronie. Zapytanie wysyłamy po zakupie VPS-a, kiedy znamy już IP.
      Nie blokuje pracy lokalnej.
- [ ] Zgodność sterownika MongoDB z Boot 4 z serwerem 4.2.18 — ważne tylko przy
      wdrożeniu Etapu 1 na produkcyjną Mongo.

## Zatory wróciły (2026-11)

Awaria z sierpnia powtarza się: Galactica coraz częściej wysyła kilka paczek w jednym
oknie crona (np. 15.11 o 22:07, 22:11 i 22:16). `check_ftp_folder.sh` nadal czyta
`$(ls public_ftp)` i blokuje się trwale. Watchdog zadziałał zgodnie z planem (alert
16.11 rano), zator został rozładowany ręcznie, paczka po paczce. Katalog roboczy
`fix_20261109` wskazuje, że nie był to pierwszy raz w listopadzie.

Skoro nowy back-end trafi na produkcję dopiero po Etapie 4, stary łańcuch będzie
działał jeszcze tygodnie. Dlatego zrobiony został wyjątek od zasady „nie inwestujemy
w bash”. **Poprawka wdrożona 2026-11-16 18:09** (kopia poprzedniej wersji:
`check_ftp_folder.sh.bak_20261116` na Zenboxie):

- `check_ftp_folder.sh` przetwarza **wszystkie** paczki z `public_ftp` w jednym
  przebiegu, każdą osobno, od najstarszej (nazwy sortują się chronologicznie).
  To odtwarza ręczną procedurę rozładowywania zatoru.
- `flock` na `check_ftp_folder.lock`: jeśli poprzedni przebieg jeszcze trwa, kolejny
  wypisuje komunikat do `cron.log` i kończy się. Zawieszony przebieg trzyma blokadę,
  więc paczki zaczynają zalegać i po 30 minutach alarmuje watchdog.

Rozważany był wariant „jedna, najstarsza paczka na przebieg”. Odrzucono go po
symulacji na 943 paczkach z archiwum. Paczki z 13.11 (15:05, 15:09, 15:14, 15:32,
15:36) czekałyby do 39 minut, a watchdog dwa razy zgłosiłby fałszywy zator.
Przy przetwarzaniu wszystkich paczek naraz najdłuższe czekanie to jeden tick crona.

Przetestowane w sandboksie na Zenboxie, na prawdziwych paczkach z 15.11. Kolejność
została zweryfikowana sumami kontrolnymi `oferty.xml`, a pominięcie przebiegu przy
zajętej blokadzie sprawdzone osobno.
