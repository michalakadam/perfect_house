#!/bin/bash
# KROK 3 - uruchamiany na Zenboxie PO gc_offer_photos.sh --apply.
#
# Sprawdza, czy KAZDE zdjecie, o ktore poprosi strona, nadal lezy na dysku.
# Zrodlem jest offers.json faktycznie serwowany uzytkownikom - czyli dokladnie
# to, czego przegladarka bedzie szukac. To jest niezalezne od bazy na VPS-ie,
# wiec stanowi drugie, osobne potwierdzenie.
#
# Zielony wynik = mozesz od razu usunac kwarantanne, nie ma na co czekac.
set -uo pipefail

domain_folder_path=${DOMAIN_FOLDER_PATH:-/home/perfect/domains/perfect.stronazen.pl}
photos_dir="$domain_folder_path/public_html/offers"
served_json="${1:-$photos_dir/offers.json}"

command -v python3 >/dev/null || { echo "BLAD: brak python3"; exit 1; }
[[ -s "$served_json" ]] || { echo "BLAD: brak lub pusty $served_json"; exit 1; }

echo "Zrodlo:  $served_json"
echo "Katalog: $photos_dir"
echo "Wiek pliku JSON: $(( ( $(date +%s) - $(stat -c %Y "$served_json") ) / 86400 )) dni"
echo

python3 - "$served_json" "$photos_dir" <<'PY'
import json, os, sys

served, photos_dir = sys.argv[1], sys.argv[2]

with open(served, encoding="utf-8") as fh:
    offers = json.load(fh)
if isinstance(offers, dict):
    offers = offers.get("offers", [])
if not offers:
    sys.exit("BLAD: serwowany JSON nie zawiera ofert")

def attachments(offer):
    photos = (offer.get("Zdjecia") or {}).get("Foto")
    if photos is None:
        return []
    return photos if isinstance(photos, list) else [photos]

# Katalog czytamy raz, z porownaniem po rdzeniu nazwy bez wielkosci liter -
# tak samo jak robi to gc_offer_photos.sh.
on_disk = set()
for name in os.listdir(photos_dir):
    stem, _, _ = name.lower().rpartition(".")
    on_disk.add(stem or name.lower())

brakujace = []
razem = 0
for offer in offers:
    for att in attachments(offer):
        if not isinstance(att, dict) or not att.get("ID"):
            continue
        razem += 1
        if ("ofe_%s" % att["ID"]).lower() not in on_disk:
            brakujace.append((offer.get("ID"), offer.get("Symbol"), "ofe_%s.jpg" % att["ID"]))

print("ofert w serwowanym JSON: %d" % len(offers))
print("zdjec, o ktore poprosi strona: %d" % razem)
print("brakujacych na dysku: %d" % len(brakujace))
print()

if not brakujace:
    print("WYNIK: OK - kazde zdjecie, ktorego strona zazada, jest na dysku.")
    print("Mozesz usunac kwarantanne.")
    sys.exit(0)

print("WYNIK: BRAKI - NIE usuwaj kwarantanny.")
print("Przywroc pliki z kwarantanny i ustal przyczyne przed kolejna proba.")
print()
print("Brakujace (do 30):")
for offer_id, symbol, plik in brakujace[:30]:
    print("  oferta %-10s %-16s -> %s" % (offer_id, symbol or "-", plik))
sys.exit(1)
PY
