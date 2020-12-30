#!/bin/bash

domain_folder_path=/home/adam/Documents/oferty
temp_folder_path=$domain_folder_path/temp
agent_jpgs_path=$temp_folder_path/user_*.jpg
# There are many patterns for offers jpg file names.
offer_jpgs_path=$temp_folder_path/*.jpg
offers_xml_path=$temp_folder_path/oferty.xml
server_credentials=root@51.77.195.170

# https://serverfault.com/a/103569
exec 3>&1 4>&2
trap 'exec 2>&4 1>&3' 0 1 2 3
log_file_path=$1
exec 1>>$log_file_path 2>&1

function copy_agent_jpgs {
  set -- $agent_jpgs_path
  if [[ -f "$1" ]]; then
    cp $agent_jpgs_path $domain_folder_path/public_html/agents
    rm $agent_jpgs_path
  fi
}

function copy_offer_jpgs {
  set -- $offer_jpgs_path
  if [[ -f "$1" ]]; then
    mv $offer_jpgs_path $domain_folder_path/public_html/offers
  fi
}

function extract_agents_xml {
  if [[ -z "$(grep --max-count=1 "<Agenci />" $offers_xml_path)" ]]; then
    sed -n '/<Agenci/{n;:a;p;n;/<\/Agenci>/!ba;}' $offers_xml_path > $domain_folder_path/requiring_conversion/agents.xml
    sed -i '1s/^/<Agenci>\n/' $domain_folder_path/requiring_conversion/agents.xml
    echo "</Agenci>" >> $domain_folder_path/requiring_conversion/agents.xml 
  fi
}

function extract_offers_xml {
  if [[ -z "$(grep --max-count=1 "<Oferty />" $offers_xml_path)" ]]; then
    sed -n '/<Oferty/{n;:a;p;n;/<\/Oferty>/!ba;}' $offers_xml_path > $domain_folder_path/requiring_conversion/offers.xml
    sed -i '1s/^/<Oferty>\n/' $domain_folder_path/requiring_conversion/offers.xml
    echo "</Oferty>" >> $domain_folder_path/requiring_conversion/offers.xml 
  fi
}

function extract_removed_xml {
  if [[ -z "$(grep --max-count=1 "<Usuniete />" $offers_xml_path)" ]]; then
    sed -n '/<Usuniete/{n;:a;p;n;/<\/Usuniete>/!ba;}' $offers_xml_path > $domain_folder_path/requiring_conversion/removed.xml
    sed -i '1s/^/<Usuniete>\n/' $domain_folder_path/requiring_conversion/removed.xml
    echo "</Usuniete>" >> $domain_folder_path/requiring_conversion/removed.xml 
  fi
}

rm $temp_folder_path/odz_*.jpg
copy_agent_jpgs
copy_offer_jpgs
extract_agents_xml
extract_offers_xml
extract_removed_xml
rm $offers_xml_path

# cp $domain_folder_path/public_html/offers/offers.json $domain_folder_path/requiring_conversion/offers.json
zip -r $temp_folder_path/to_be_converted.zip $domain_folder_path/requiring_conversion
rm $domain_folder_path/requiring_conversion/*
scp $temp_folder_path/to_be_converted.zip $server_credentials:/root/perfect/temp
rm $temp_folder_path/to_be_converted.zip
ssh $server_credentials '/root/perfect/convert_xml_to_json.sh'

