#/bin/bash

git checkout master
git pull origin master

ng build
# Remove test data so that does not override prod data.
rm -r ~/Documents/perfect_house/frontend/dist/perfecthouse/agents
rm -r ~/Documents/perfect_house/frontend/dist/perfecthouse/offers

scp -r ~/Documents/perfect_house/frontend/dist/perfecthouse/* perfect@s38.zenbox.pl:/home/perfect/domains/perfect.stronazen.pl/public_html

