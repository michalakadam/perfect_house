#/bin/bash

git checkout master
git pull origin master

ng build --configuration production
# Remove test data so that does not override prod data.
rm -r ~/Documents/perfecthouse/dist/perfecthouse/agents
rm -r ~/Documents/perfecthouse/dist/perfecthouse/offers

scp -r ~/Documents/perfecthouse/dist/perfecthouse/* perfect@s38.zenbox.pl:/home/perfect/domains/perfect.stronazen.pl/public_html

