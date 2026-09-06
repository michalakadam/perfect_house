#!/bin/bash
# KROK 1 z 2 - uruchamiany na VPS (root@51.77.195.170).
# Buduje liste nazw plikow zdjec, do ktorych odwoluja sie oferty w bazie.
# Wynik przerzucasz na Zenbox i podajesz do gc_offer_photos.sh.
#
# UWAGA: nazwa pliku na dysku to 'ofe_<ID zalacznika>.jpg', a NIE pole 'plik'.
# Pole 'plik' to wewnetrzna nazwa z Galactiki (np. "2.jpg", uzywana przez 95 roznych
# ofert) i nie odpowiada niczemu na dysku. Lista zbudowana z 'plik' da zerowe
# przeciecie z katalogiem, czyli "wszystko jest osierocone".
set -uo pipefail

db_name=perfecthouse
collection=offers
out_file=${1:-/root/perfect/photo_refs.txt}
tmp_json=$(mktemp)
trap 'rm -f "$tmp_json"' EXIT

command -v mongoexport >/dev/null || { echo "BLAD: brak mongoexport"; exit 1; }
command -v python3     >/dev/null || { echo "BLAD: brak python3";     exit 1; }

echo "Eksportuje kolekcje $db_name.$collection ..."
mongoexport --db "$db_name" --collection "$collection" --jsonArray --quiet --out "$tmp_json" || {
  echo "BLAD: mongoexport nie powiodl sie - NIE generuje listy referencji"; exit 1; }

python3 - "$tmp_json" "$out_file" <<'PY'
import json, sys

src, dst = sys.argv[1], sys.argv[2]
with open(src, encoding="utf-8") as fh:
    offers = json.load(fh)

if not isinstance(offers, list) or not offers:
    sys.exit("BLAD: baza zwrocila pusta liste ofert - przerywam, "
             "zeby nie zbudowac pustej listy referencji")

def attachments(offer):
    photos = (offer.get("Zdjecia") or {}).get("Foto")
    if photos is None:
        return []
    # Konwersja XML->JSON zwraca pojedynczy zalacznik jako OBIEKT, nie liste.
    # Iterowanie po nim dalo by klucze ("ID", "plik", ...) zamiast zalacznikow.
    return photos if isinstance(photos, list) else [photos]

refs, bez_id = set(), 0
for offer in offers:
    for att in attachments(offer):
        if not isinstance(att, dict):
            continue
        att_id = att.get("ID")
        # Celowo BEZ filtrowania po 'typ' - Rzut i Filmy tez maja pliki na dysku.
        if att_id:
            refs.add("ofe_%s.jpg" % att_id)
        else:
            bez_id += 1

if not refs:
    sys.exit("BLAD: zero referencji do zdjec - przerywam")

with open(dst, "w", encoding="utf-8") as fh:
    fh.write("\n".join(sorted(refs)) + "\n")

print("ofert:               %d" % len(offers))
print("referencji do zdjec: %d" % len(refs))
if bez_id:
    print("UWAGA: zalacznikow bez ID (pominietych): %d" % bez_id)
print("zapisano: %s" % dst)
PY
