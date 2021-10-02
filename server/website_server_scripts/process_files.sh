#!/bin/bash

domain_folder_path=/home/perfect/domains/perfect.stronazen.pl
temp_folder_path=$domain_folder_path/temp
# There are many patterns for offers jpg file names.
offer_jpgs_path=$temp_folder_path/*.jpg
offers_xml_path=$temp_folder_path/oferty.xml
server_credentials=root@51.77.195.170

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
      }' $offers_xml_path > $domain_folder_path/to_be_converted/offers.xml
    sed -i '1s/^/<Oferty>\n/' $domain_folder_path/to_be_converted/offers.xml
    echo "</Oferty>" >> $domain_folder_path/to_be_converted/offers.xml 
  fi
}

function extract_removed_xml {
  if [[ -z "$(grep --max-count=1 "<Usuniete />" $offers_xml_path)" ]]; then
    sed -n '/<Usuniete/{n
      :a
      p
      n
      /<\/Usuniete>/!ba
      }' $offers_xml_path > $domain_folder_path/to_be_converted/removed.xml
    sed -i '1s/^/<Usuniete>\n/' $domain_folder_path/to_be_converted/removed.xml
    echo "</Usuniete>" >> $domain_folder_path/to_be_converted/removed.xml 
  fi
}

copy_offer_jpgs
extract_offers_xml
extract_removed_xml
rm $offers_xml_path

zip $temp_folder_path/to_be_converted.zip to_be_converted/*
rm $domain_folder_path/to_be_converted/*
scp $temp_folder_path/to_be_converted.zip $server_credentials:/root/perfect/temp
rm $temp_folder_path/to_be_converted.zip
ssh $server_credentials '/root/perfect/convert_xml_to_json.sh'
