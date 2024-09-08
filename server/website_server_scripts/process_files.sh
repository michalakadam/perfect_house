#!/bin/bash

domain_folder_path=/home/perfect/domains/perfect.stronazen.pl
temp_folder_path=$domain_folder_path/temp
# There are many patterns for offers jpg file names.
offer_jpgs_path=$temp_folder_path/*.jpg
offers_xml_path=$temp_folder_path/oferty.xml
extracted_offers_xml_path=$domain_folder_path/to_be_converted/offers.xml
extracted_removed_offers_xml_path=$domain_folder_path/to_be_converted/removed.xml
db_server_credentials=root@51.77.195.170
db_server_xml_folder_path=/root/perfect/temp

function copy_offer_jpgs {
  set -- $offer_jpgs_path
  if [[ -f "$1" ]]; then
    mv $offer_jpgs_path $domain_folder_path/public_html/offers
  fi
}

function extract_offers_xml {
  if [[ -z "$(grep --max-count=1 "<Oferty />" $offers_xml_path)" ]]; then
    sed -n '/<Oferty/{n
      :a
      p
      n
      /<\/Oferty>/!ba
      }' $offers_xml_path > $extracted_offers_xml_path
    sed -i '1s/^/<Oferty>\n/' $extracted_offers_xml_path
    echo "</Oferty>" >> $extracted_offers_xml_path
  fi
}

function extract_removed_xml {
  if [[ -z "$(grep --max-count=1 "<Usuniete />" $offers_xml_path)" ]]; then
    sed -n '/<Usuniete/{n
      :a
      p
      n
      /<\/Usuniete>/!ba
      }' $offers_xml_path > $extracted_removed_offers_xml_path
    sed -i '1s/^/<Usuniete>\n/' $extracted_removed_offers_xml_path
    echo "</Usuniete>" >> $extracted_removed_offers_xml_path 
  fi
}

function trigger_db_server {
  scp $extracted_offers_xml_path $db_server_credentials:$db_server_xml_folder_path
  rm $extracted_offers_xml_path
  scp $extracted_removed_offers_xml_path $db_server_credentials:$db_server_xml_folder_path
  rm $extracted_removed_offers_xml_path
  ssh $db_server_credentials "/root/perfect/convert_xml_to_json.sh"
}

copy_offer_jpgs
extract_offers_xml
extract_removed_xml
rm $offers_xml_path
trigger_db_server
