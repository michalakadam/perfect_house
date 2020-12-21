#!/bin/bash

site_path=/home/adam/Documents/mock_backend
raw_offers_path=$site_path/unpacked/offers.xml
converter_path=$site_path/backend/converter.jar
converted_agents_path=$site_path/public_html/data/agents.json
converted_offers_path=$site_path/public_html/data/offers.json

# Split oferty.xml file into smaller pieces.
agents_xml=$(sed -n '/<Agenci/{n;:a;p;n;/<\/Agenci>/!ba;}' $raw_offers_path)
offers_xml=$(sed -n '/<Oferty/{n;:a;p;n;/<\/Oferty>/!ba;}' $raw_offers_path)

# Convert xml files to json and copy to the project's data folder.
echo $(java -jar $converter_path "$agents_xml") > converted_agents_path
echo $(head -n -1 $converted_offers_path ; echo $(java -jar $converter_path "$offers_xml") ; tail -1 $converted_offers_path) > $converted_offers_path

