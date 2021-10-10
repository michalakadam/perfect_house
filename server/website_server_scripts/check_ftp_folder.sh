#!/bin/bash

domain_folder_path=/home/perfect/domains/perfect.stronazen.pl
ftp_folder_path=$domain_folder_path/public_ftp

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

offers_file_name="$(ls $ftp_folder_path)"

if [[ ! -z "$offers_file_name" ]]; then
  offers_file_path=$ftp_folder_path/$offers_file_name
  
  check_file_copied_fully  
  unzip $ftp_folder_path/$offers_file_name -d $domain_folder_path/temp
  mv $ftp_folder_path/$offers_file_name $domain_folder_path/offers_archive/$offers_file_name
  $domain_folder_path/process_files.sh
fi
