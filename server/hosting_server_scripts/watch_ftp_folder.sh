#!/bin/bash

domain_folder_path=/home/adam/Documents/oferty

function check_file_copied_fully {
  store_file_sizes_for_comparison $1 
  while [[ "$old_size" -lt "$new_size" ]]
  do
    store_file_sizes_for_comparison $1 
  done
}

function store_file_sizes_for_comparison {
  old_size=$(wc -c <$1)
  sleep 5
  new_size=$(wc -c <$1)
}

while true
do 
  offers_file_name=$(ls)
  if [[ "$offers_file_name"  ]]; then
    log_file_path=$domain_folder_path/logs/"$(date "+%Y_%m_%d_%H_%M")"
    touch log_file_path
    echo "New file arrived." > $log_file_path
    check_file_copied_fully  $offers_file_name
    echo "$(ls -l $domain_folder_path/public_ftp)" >> $log_file_path
    unzip $offers_file_name -d $domain_folder_path/temp
    mv $offers_file_name $domain_folder_path/offers_archive/$offers_file_name
    echo "File $offers_file_name unzipped to temp folder and moved to archives." >> "$log_file_path"
    $domain_folder_path/backend/process_files.sh
  fi
  sleep 10
done
