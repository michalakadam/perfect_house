#!/bin/bash

domain_folder_path=/home/perfect/domains/perfect.stronazen.pl
ftp_folder_path=$domain_folder_path/public_ftp

# https://serverfault.com/a/103569
exec 3>&1 4>&2
trap 'exec 2>&4 1>&3' 0 1 2 3

function start_logging {
  log_file_name="$(date "+%Y_%m_%d_%H_%M")" 
  log_file_path=$domain_folder_path/logs/$log_file_name
  touch $log_file_path
  exec 1>$log_file_path 2>&1
}

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

while true
do 
  offers_file_name="$(ls $ftp_folder_path)"

  if [[ ! -z "$offers_file_name" ]]; then
    offers_file_path=$ftp_folder_path/$offers_file_name
    
    start_logging
    check_file_copied_fully  
    unzip $ftp_folder_path/$offers_file_name -d $domain_folder_path/temp
    mv $ftp_folder_path/$offers_file_name $domain_folder_path/offers_archive/$offers_file_name
    $domain_folder_path/backend/process_files.sh $log_file_path
  fi
  sleep 10
done
