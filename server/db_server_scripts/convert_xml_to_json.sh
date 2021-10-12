#!/bin/bash

perfect_folder_path=/root/perfect

# https://serverfault.com/a/103569
exec 3>&1 4>&2
trap 'exec 2>&4 1>&3' 0 1 2 3
log_file_name="$(date "+%Y_%m_%d_%H_%M")"
log_file_path=$perfect_folder_path/logs/$log_file_name
touch $log_file_path
exec 1>$log_file_path 2>&1

if [[ -f $perfect_folder_path/temp/offers.xml ]]; then
  cat $perfect_folder_path/temp/offers.xml | xq . | sed -e 's/"@/"/' -e 's/"#/"/' > $perfect_folder_path/temp/offers.json
  rm $perfect_folder_path/temp/offers.xml
fi

if [[ -f $perfect_folder_path/temp/removed.xml ]]; then
  cat $perfect_folder_path/temp/removed.xml | xq . | sed 's/\"@/\"/' > $perfect_folder_path/temp/removed.json
  rm $perfect_folder_path/temp/removed.xml
fi

$perfect_folder_path/update_db.sh $log_file_name
