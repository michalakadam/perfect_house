# maintenance

**Narzędzia przejściowe.** Powstały w Etapie 0, żeby domknąć skutki awarii z 21.08.2026
i przestać być ślepym na kolejne. Znikają razem ze skryptami bash w Etapie 4 —
patrz [ROADMAP.md](../ROADMAP.md). Nie są rutyną i nie wpinamy ich w crona,
z jednym wyjątkiem (`watchdog.sh`).

## watchdog.sh — zostaje do Etapu 2

Dead man's switch. Cron `*/15` na **VPS** (`/etc/cron.d/perfect-watchdog`).
Milczy, gdy jest dobrze; przy problemie wysyła maila przez `msmtp`.

Alarmuje, gdy: plik zalega w `public_ftp` > 30 min (ta sama awaria co 21.08),
brak przetworzonej paczki > 72 h, albo nie da się połączyć z Zenboxem.
Powtórzenia najwyżej raz na 6 h.

Świadomie **nie** alarmuje przy samej ciszy od Galactiki — ona nie wysyła codziennie,
a alert dzwoniący bez powodu przestaje być czytany.

```
./watchdog.sh --status   # co widzi, bez wysyłki
./watchdog.sh --test     # wymusza alert, do sprawdzenia ścieżki maila
```

Konfiguracja w `/root/perfect/watchdog.conf` (poza repo): `ALERT_TO`, `ALERT_FROM`.
Wysyłka wymaga `msmtp` z kontem na domenie — poczta z gołego IP VPS-a do Gmaila
nie dolatuje.

## export_photo_refs.sh + gc_offer_photos.sh + verify_photos.sh — jeszcze jeden przebieg

GC osieroconych zdjęć. Uruchomione raz w Etapie 0. **Ostatni przebieg wypada
w Etapie 3**, tuż przed przeniesieniem zdjęć do MinIO — żeby nie migrować śmieci.
Potem niepotrzebne, bo ingest z Etapu 2 nie produkuje już sierot.

Kolejność: `export_photo_refs.sh` (VPS) → `scp photo_refs.txt` na Zenbox →
`gc_offer_photos.sh` (dry-run, potem `--apply`) → `verify_photos.sh`.

**Nazwa pliku na dysku to `ofe_<ID załącznika>.jpg`, nie pole `plik`.** Lista referencji
zbudowana z `plik` daje zerowe przecięcie z katalogiem, czyli „wszystko jest osierocone" —
tak raz już skasowano komplet zdjęć. `gc_offer_photos.sh` przerywa, gdy mniej niż 90%
referencji odnajduje się na dysku, przenosi do kwarantanny zamiast kasować i domyślnie
robi dry-run. `verify_photos.sh` sprawdza potem, niezależnie i po stronie Zenboxa,
czy każde zdjęcie żądane przez stronę nadal istnieje.
