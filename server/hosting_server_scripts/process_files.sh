#!/bin/bash

domain_folder_path=/home/adam/Documents/oferty
agent_jpgs_path=$domain_folder_path/temp/user_*.jpg
offer_jpgs_path=$domain_folder_path/temp/ofe_*.jpg
offers_xml_path=$domain_folder_path/temp/oferty.xml

set -- $agent_jpgs_path
if [[ -f "$1" ]]; then
  rm $domain_folder_path/public_html/agents/user_*.jpg
  cp $agent_jpgs_path $domain_folder_path/public_html/agents
fi

set -- $offer_jpgs_path
if [[ -f "$1" ]]; then
  cp $offer_jpgs_path $domain_folder_path/public_html/offers
fi

if [[ "$(grep --quiet --max-count=1 "<Agenci />" $offers_xml_path)" -eq "0" ]]; then
  touch $domain_folder_path/requiring_conversion/agents.xml
else
  sed -n '/<Agenci/{n;:a;p;n;/<\/Agenci>/!ba;}' $offers_xml_path > $domain_folder_path/requiring_conversion/agents.xml
fi

if [[ "$(grep --quiet --max-count=1 "<Oferty />" $offers_xml_path)" -eq "0" ]]; then
  touch $domain_folder_path/requiring_conversion/offers.xml
else
  sed -n '/<Oferty/{n;:a;p;n;/<\/Oferty>/!ba;}' $offers_xml_path > $domain_folder_path/requiring_conversion/offers.xml
fi

if [[ "$(grep --quiet --max-count=1 "<Usuniete />" $offers_xml_path)" -eq "0" ]]; then
  touch $domain_folder_path/requiring_conversion/removed.xml
else
  sed -n '/<Usuniete/{n;:a;p;n;/<\/Usuniete>/!ba;}' $offers_xml_path > $domain_folder_path/requiring_conversion/removed.xml
fi

