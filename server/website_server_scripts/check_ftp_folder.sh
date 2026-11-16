#!/bin/bash

domain_folder_path=/home/perfect/domains/perfect.stronazen.pl
ftp_folder_path=$domain_folder_path/public_ftp

# Gdyby przebieg trwal dluzej niz 15 min, nastepny z crona nie moze wejsc mu w droge -
# obaj pisaliby do tego samego temp/. Zawieszony przebieg trzyma blokade, paczki
# zaczynaja zalegac w public_ftp i po 30 min alarmuje watchdog na VPS.
exec 9> "$domain_folder_path/check_ftp_folder.lock"
if ! flock --nonblock 9; then
  echo "$(date '+%F %T') poprzedni przebieg wciaz trwa - pomijam"
  exit 0
fi

function check_file_copied_fully {
  store_file_sizes_for_comparison
  while [[ "$old_size" -lt "$new_size" ]]
  do
    store_file_sizes_for_comparison
  done
}

function store_file_sizes_for_comparison {
  old_size=$(wc --bytes < $offers_file_path)
  sleep 5
  new_size=$(wc --bytes < $offers_file_path)
}

# Galactica bywa, ze wysyla kilka paczek w jednym oknie crona (np. 15.11.2026: 22:07,
# 22:11). Kiedys `offers_file_name="$(ls ...)"` sklejalo je w jedna zmienna i lancuch
# blokowal sie trwale. Teraz kazda paczka idzie osobno, od najstarszej - to aktualizacje
# przyrostowe, wiec kolejnosc jest wymogiem poprawnosci. Nazwy oferty_RRRRMMDD_GGMM.zip
# sortuja sie chronologicznie.
for offers_file_name in $(ls "$ftp_folder_path" | LC_ALL=C sort); do
  offers_file_path=$ftp_folder_path/$offers_file_name

  check_file_copied_fully
  unzip $ftp_folder_path/$offers_file_name -d $domain_folder_path/temp
  mv $ftp_folder_path/$offers_file_name $domain_folder_path/offers_archive/$offers_file_name
  $domain_folder_path/process_files.sh
done
