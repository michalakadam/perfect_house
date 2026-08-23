#!/usr/bin/env python3
"""
Usuwa zdjęcia ofert z frontend/src/offers, które nie są już przywoływane
przez żadną ofertę w offers.json (np. zdjęcia ofert archiwalnych).

Nazewnictwo plików odpowiada logice aplikacji (zobacz:
frontend/src/app/offers/state-management/offers-converter.service.ts,
metoda convertPhotos): każde zdjęcie oferty ma nazwę `ofe_<Foto.ID>.jpg`,
gdzie `Foto.ID` pochodzi z offer.Zdjecia.Foto[].ID w offers.json.

WAŻNE: skrypt celowo NIE opiera się o pole "plik" z offers.json - to pole
zawiera oryginalną nazwę pliku ze źródła danych i nie odpowiada plikom
faktycznie zapisanym na dysku (potwierdzone: zero pokrycia między wartościami
"plik" a plikami w folderze). Właściwym identyfikatorem jest "ID" wpisu Foto.

Skrypt dotyka WYŁĄCZNIE plików pasujących do wzorca `ofe_<cyfry>.jpg` -
inne pliki w folderze (zdjęcia agentów `user_*.jpg`, miniatury `ww_intro_*.jpg`,
`odz_244.jpg`, sam `offers.json` itd.) są zawsze pomijane.

Użycie:
    python3 cleanup_offer_images.py                  # dry run (domyślnie)
    python3 cleanup_offer_images.py --delete          # faktyczne usuwanie
    python3 cleanup_offer_images.py --list-file out.txt   # zapisz pełną listę do pliku

Domyślnie skrypt zakłada, że jest uruchamiany z repo w standardowym układzie
(frontend/scripts/cleanup_offer_images.py obok frontend/src/offers/offers.json).
Można to nadpisać przez --offers-dir / --json-file.
"""

import argparse
import json
import os
import re
import sys

FILENAME_RE = re.compile(r"^ofe_(\d+)\.jpg$", re.IGNORECASE)

DEFAULT_OFFERS_DIR = os.path.normpath(
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "src", "offers")
)

# Zabezpieczenie przed katastrofalnym usunięciem wszystkiego (np. gdyby
# offers.json miał inny format niż oczekiwany i referenced_ids wyszło puste
# albo prawie puste). Można podnieść przez --max-delete-percent.
DEFAULT_MAX_DELETE_PERCENT = 95.0


def collect_referenced_photo_ids(offers_data) -> set:
    """Odtwarza dokładnie logikę convertPhotos() z offers-converter.service.ts:
    dla każdej oferty bierzemy offer.Zdjecia.Foto[].ID (bez filtrowania po typ,
    tak jak robi to frontend)."""
    referenced_ids = set()
    for offer in offers_data:
        if not isinstance(offer, dict):
            continue
        zdjecia = offer.get("Zdjecia")
        if not isinstance(zdjecia, dict):
            continue
        foto = zdjecia.get("Foto")
        if isinstance(foto, dict):
            foto = [foto]
        elif not isinstance(foto, list):
            continue
        for entry in foto:
            if isinstance(entry, dict) and entry.get("ID"):
                referenced_ids.add(str(entry["ID"]))
    return referenced_ids


def scan_disk_photos(offers_dir: str):
    """Zwraca (dict id -> filename, liczba innych plików pominiętych)."""
    disk_photos = {}
    other_files = 0
    for filename in os.listdir(offers_dir):
        full_path = os.path.join(offers_dir, filename)
        if not os.path.isfile(full_path):
            continue
        match = FILENAME_RE.match(filename)
        if match:
            disk_photos[match.group(1)] = filename
        else:
            other_files += 1
    return disk_photos, other_files


def human_size(num_bytes: float) -> str:
    for unit in ("B", "KB", "MB", "GB"):
        if num_bytes < 1024:
            return f"{num_bytes:.1f} {unit}"
        num_bytes /= 1024
    return f"{num_bytes:.1f} TB"


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument(
        "--offers-dir",
        default=DEFAULT_OFFERS_DIR,
        help=f"Folder ze zdjęciami ofert (domyślnie: {DEFAULT_OFFERS_DIR})",
    )
    parser.add_argument(
        "--json-file",
        default=None,
        help="Ścieżka do offers.json (domyślnie: <offers-dir>/offers.json)",
    )
    parser.add_argument(
        "--delete",
        action="store_true",
        help="Faktycznie usuń osierocone pliki. Bez tej flagi skrypt tylko raportuje (dry run).",
    )
    parser.add_argument(
        "--list-file",
        default=None,
        help="Zapisz pełną listę plików do usunięcia do wskazanego pliku tekstowego.",
    )
    parser.add_argument(
        "--max-delete-percent",
        type=float,
        default=DEFAULT_MAX_DELETE_PERCENT,
        help=f"Zabezpieczenie: jeśli odsetek plików do usunięcia przekroczy tę wartość, "
        f"skrypt przerywa działanie bez usuwania (domyślnie {DEFAULT_MAX_DELETE_PERCENT}%%).",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Zignoruj zabezpieczenie --max-delete-percent.",
    )
    args = parser.parse_args()

    offers_dir = os.path.abspath(args.offers_dir)
    json_file = args.json_file or os.path.join(offers_dir, "offers.json")

    if not os.path.isdir(offers_dir):
        print(f"BŁĄD: folder nie istnieje: {offers_dir}", file=sys.stderr)
        sys.exit(1)

    if not os.path.isfile(json_file):
        print(f"BŁĄD: nie znaleziono pliku JSON: {json_file}", file=sys.stderr)
        sys.exit(1)

    try:
        with open(json_file, "r", encoding="utf-8") as f:
            offers_data = json.load(f)
    except Exception as e:
        print(f"BŁĄD: nie udało się odczytać/sparsować {json_file}: {e}", file=sys.stderr)
        sys.exit(1)

    if not isinstance(offers_data, list):
        print(f"BŁĄD: oczekiwano listy ofert w {json_file}, otrzymano {type(offers_data).__name__}", file=sys.stderr)
        sys.exit(1)

    referenced_ids = collect_referenced_photo_ids(offers_data)

    # Twardy stop: jeśli nie znaleziono ŻADNYCH referencji, to prawdopodobnie
    # format offers.json się zmienił i dalsze działanie usunęłoby wszystko.
    if not referenced_ids:
        print(
            "BŁĄD: nie znaleziono żadnych odniesień do zdjęć (offer.Zdjecia.Foto[].ID) "
            "w offers.json. To wygląda na zmianę formatu danych, a nie faktyczny brak "
            "zdjęć - przerywam, żeby nic nie skasować.",
            file=sys.stderr,
        )
        sys.exit(1)

    disk_photos, other_files = scan_disk_photos(offers_dir)

    disk_ids = set(disk_photos.keys())
    orphaned_ids = sorted(disk_ids - referenced_ids, key=int)
    missing_ids = sorted(referenced_ids - disk_ids, key=int)

    total_matched = len(disk_ids)
    orphaned_count = len(orphaned_ids)
    delete_percent = (orphaned_count / total_matched * 100) if total_matched else 0.0

    print(f"Folder ze zdjęciami:        {offers_dir}")
    print(f"Plik offers.json:           {json_file}")
    print(f"Unikalnych odniesień ID:    {len(referenced_ids)}")
    print(f"Plików 'ofe_<id>.jpg':      {total_matched}")
    print(f"Innych plików (pominięte):  {other_files}")
    print(f"Referencje bez pliku:       {len(missing_ids)}")
    print(f"Osierocone pliki:           {orphaned_count} ({delete_percent:.1f}% wszystkich dopasowanych)")
    print()

    if args.list_file:
        with open(args.list_file, "w", encoding="utf-8") as f:
            for oid in orphaned_ids:
                f.write(disk_photos[oid] + "\n")
        print(f"Pełna lista zapisana do: {args.list_file}")

    sample = orphaned_ids[:10]
    if sample:
        print("Przykładowe osierocone pliki:")
        for oid in sample:
            print(f"  {disk_photos[oid]}")
        if orphaned_count > len(sample):
            print(f"  ... i {orphaned_count - len(sample)} więcej")
        print()

    if orphaned_count == 0:
        print("Brak plików do usunięcia. Koniec.")
        return

    if delete_percent > args.max_delete_percent and not args.force:
        print(
            f"PRZERWANO: {delete_percent:.1f}% plików kwalifikuje się do usunięcia, "
            f"co przekracza próg bezpieczeństwa {args.max_delete_percent}%. "
            "Jeśli to oczekiwany wynik, uruchom ponownie z --force albo podnieś "
            "--max-delete-percent.",
            file=sys.stderr,
        )
        sys.exit(2)

    if not args.delete:
        total_size = sum(
            os.path.getsize(os.path.join(offers_dir, disk_photos[oid])) for oid in orphaned_ids
        )
        print(f"DRY RUN: nic nie zostało usunięte. Zwolniono by ok. {human_size(total_size)}.")
        print("Uruchom z flagą --delete, żeby faktycznie skasować te pliki.")
        return

    deleted = 0
    freed_bytes = 0
    for oid in orphaned_ids:
        path = os.path.join(offers_dir, disk_photos[oid])
        try:
            freed_bytes += os.path.getsize(path)
            os.remove(path)
            deleted += 1
        except OSError as e:
            print(f"Nie udało się usunąć {path}: {e}", file=sys.stderr)

    print(f"Usunięto {deleted} plików, zwolniono ok. {human_size(freed_bytes)}.")


if __name__ == "__main__":
    main()
