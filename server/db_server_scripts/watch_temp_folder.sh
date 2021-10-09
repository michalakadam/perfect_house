#!/bin/bash

perfect_folder_path=/root/perfect
temp_folder_path=$perfect_folder_path/temp

function check_file_copied_fully {
  store_file_sizes_for_comparison
  while [[ "$old_size" -lt "$new_size" ]]
  do
    store_file_sizes_for_comparison
  done
}

function store_file_sizes_for_comparison {
  old_size=$(wc --bytes < $offers_file_path)
  sleep 1
  new_size=$(wc --bytes < $offers_file_path)
}

while true
do
  offers_file_name="$(ls $temp_folder_path)"

  if [[ ! -z "$offers_file_name" ]]; then
    offers_file_path=$temp_folder_path/$offers_file_name

    check_file_copied_fully
    $perfect_folder_path/convert_xml_to_json.sh
  fi
  sleep 60
done
