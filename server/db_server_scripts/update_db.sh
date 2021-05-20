log_file_name=$1
project_folder_path=/root/perfect
logs_path=/root/perfect/logs
updater_log_file_name="$log_file_name"-updater.log
offers_file_name=offers"$log_file_name".json
archived_offers_path=/root/perfect/archive/$offers_file_name
offers_updater_path=$project_folder_path/offers_updater

function backup_offers {
    mongoexport --db perfect --collection offers --pretty --out $archived_offers_path
    scp $archived_offers_path perfect@2.57.137.38:/home/perfect/offers_archive/$offers_file_name
    rm $archived_offers_path
}

cd $offers_updater_path
npm run start
mv updater.log $logs_path/$updater_log_file_name
backup_offers
