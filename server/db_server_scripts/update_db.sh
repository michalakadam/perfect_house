log_file_name=$1
project_folder_path=/root/perfect
logs_path=/root/perfect/logs
updater_log_file_name="$log_file_name"-updater.log
offers_file_name=offers"$log_file_name".json
archived_offers_path=/root/perfect/archive/$offers_file_name
offers_updater_path=$project_folder_path/offers_updater

function backup_offers {
    /usr/bin/mongoexport --db perfecthouse --collection offers --pretty --out $archived_offers_path
    scp $archived_offers_path perfect@2.57.137.38:/home/perfect/domains/perfect.stronazen.pl/public_html/offers
    rm $archived_offers_path
}

cd $offers_updater_path
/root/.nvm/versions/node/v14.16.0/bin/node dist/index.js
mv updater.log $logs_path/$updater_log_file_name
rm $project_folder_path/temp/offers.json
rm $project_folder_path/temp/removed.json
backup_offers
