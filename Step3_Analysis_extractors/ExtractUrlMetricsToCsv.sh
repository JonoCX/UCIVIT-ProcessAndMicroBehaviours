
mongo localhost/testdb --eval "load('ExtractUrlMetrics.js');printUrlMetrics();" > ExtractUrlMetrics.json

sed -i '/MongoDB shell version: .*/d' ExtractUrlMetrics.json
sed -i '/connecting to: localhost\/testdb/d' ExtractUrlMetrics.json
sed -i '/connecting to: 130.88.193.33\/testdb/d' ExtractUrlMetrics.json
sed -i '/connecting to: 130.88.193.33\/testdb/d' ExtractUrlMetrics.json
sed -i '/connecting to: localhost\/kupballtrainingdb/d' ExtractUrlMetrics.json
sed -i '/connecting to: localhost\/alltrainingdb/d' ExtractUrlMetrics.json
sed -i '/connecting to: localhost\/alltrainingdb/d' ExtractUrlMetrics.json
sed -i '/connecting to: localhost\/.*/d' ExtractUrlMetrics.json
sed -i '/connecting to: alltrainingdb/d' ExtractUrlMetrics.json
sed -i '/Error: 18 .*/d' ExtractUrlMetrics.json
sed -i '/{ }/d' ExtractUrlMetrics.json

NUMBER_OF_LINES=$(wc -l < ExtractUrlMetrics.json)
echo $NUMBER_OF_LINES
LINE_TO_DELETE=`expr ${NUMBER_OF_LINES} - 1`

echo "deleting line $LINE_TO_DELETE out of $NUMBER_OF_LINES from ExtractUrlMetrics.json";
sed -i ${LINE_TO_DELETE}d ExtractUrlMetrics.json

in2csv ExtractUrlMetrics.json > urlMetrics.csv
