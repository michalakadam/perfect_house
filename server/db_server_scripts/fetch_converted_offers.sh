#!/bin/bash

domain_server_credentials=perfect@s38.zenbox.pl
to_be_converted_folder_path=/home/perfect/domains/perfect.stronazen.pl/to_be_converted

perfect_folder_path=/root/perfect
temp_folder_path=$perfect_folder_path/temp

FALSE=0
TRUE=1

is_converted=$FALSE

function fetch_offers {
  file_path=$to_be_converted_folder_path/$file_name
  if ssh $domain_server_credentials "test -e $file_path"
  then
    scp $domain_server_credentials:$file_path $temp_folder_path
    ssh $domain_server_credentials "rm $file_path"
    is_converted=$TRUE
  fi
}

while true
do
  file_name=offers.xml
  fetch_offers
  file_name=removed.xml
  fetch_offers
  sleep 5

  if [ $is_converted -eq $TRUE ]
  then
    is_converted=$FALSE
    $perfect_folder_path/convert_xml_to_json.sh
  fi
  sleep 900
done