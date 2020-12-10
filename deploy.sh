#/bin/bash

git checkout master
git pull origin master

ng build --prod

scp -r ~/Documents/perfecthouse/dist/perfecthouse/* perfect@s38.zenbox.pl:/home/perfect/domains/perfect.stronazen.pl/public_html

