###This script extracts all behaviours into files.
#To run it:
# sh ExtractScrollMouseTimes.sh > ExtractScrollMouseTimes.txt

# Define a timestamp function
timestamp() {
  date +"%T"
}

. ../shellVariables.sh

echo today is $(timestamp)

#START of commented code
#if false
#then

if false; then

  ######START OF BATCHED mouse time list
  echo Printing Out User mouse time list to file at $(timestamp)

  echo Printing Out mouse time list 0-10 to file at $(timestamp)
  mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseMoveBehaviour.js');printMouseMoveTimeListBatchedPerUser(0,10);" > data/mouseTimeList_0-10.json

  echo Printing Out mouse time list 10-20 to file at $(timestamp)
  mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseMoveBehaviour.js');printMouseMoveTimeListBatchedPerUser(10,20);" > data/mouseTimeList_10-20.json

  echo Printing Out mouse time list 20-30 to file at $(timestamp)
  mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseMoveBehaviour.js');printMouseMoveTimeListBatchedPerUser(20,30);" > data/mouseTimeList_20-30.json

  echo Printing Out mouse time list 30-40 to file at $(timestamp)
  mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseMoveBehaviour.js');printMouseMoveTimeListBatchedPerUser(30,40);" > data/mouseTimeList_30-40.json

  echo Printing Out mouse time list 40-50 to file at $(timestamp)
  mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseMoveBehaviour.js');printMouseMoveTimeListBatchedPerUser(40,50);" > data/mouseTimeList_40-50.json

  echo Printing Out mouse time list 50-60 to file at $(timestamp)
  mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseMoveBehaviour.js');printMouseMoveTimeListBatchedPerUser(50,60);" > data/mouseTimeList_50-60.json

  echo Printing Out mouse time list 60-70 to file at $(timestamp)
  mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseMoveBehaviour.js');printMouseMoveTimeListBatchedPerUser(60,70);" > data/mouseTimeList_60-70.json

  echo Printing Out mouse time list 70-80 to file at $(timestamp)
  mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseMoveBehaviour.js');printMouseMoveTimeListBatchedPerUser(70,80);" > data/mouseTimeList_70-80.json

  echo Printing Out mouse time list 80-90 to file at $(timestamp)
  mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseMoveBehaviour.js');printMouseMoveTimeListBatchedPerUser(80,90);" > data/mouseTimeList_80-90.json

  echo Printing Out mouse time list 90-100 to file at $(timestamp)
  mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseMoveBehaviour.js');printMouseMoveTimeListBatchedPerUser(90,100);" > data/mouseTimeList_90-100.json
  ######END OF BATCHED mouse time list
	fi

######START OF BATCHED scroll time lists
echo Printing Out User regular scroll episode durations to file at $(timestamp)

echo Printing Out scroll time list 0-10 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserScrollBehaviour.js');printRegularScrollListBatchedPerUser(0,10);" > data/scrollTimeList_0-10.json

echo Printing Out scroll time list 10-20 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserScrollBehaviour.js');printRegularScrollListBatchedPerUser(10,20);" > data/scrollTimeList_10-20.json

echo Printing Out scroll time list 20-30 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserScrollBehaviour.js');printRegularScrollListBatchedPerUser(20,30);" > data/scrollTimeList_20-30.json

echo Printing Out scroll time list 30-40 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserScrollBehaviour.js');printRegularScrollListBatchedPerUser(30,40);" > data/scrollTimeList_30-40.json

echo Printing Out scroll time list 40-50 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserScrollBehaviour.js');printRegularScrollListBatchedPerUser(40,50);" > data/scrollTimeList_40-50.json

echo Printing Out scroll time list 50-60 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserScrollBehaviour.js');printRegularScrollListBatchedPerUser(50,60);" > data/scrollTimeList_50-60.json

echo Printing Out scroll time list 60-70 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserScrollBehaviour.js');printRegularScrollListBatchedPerUser(60,70);" > data/scrollTimeList_60-70.json

echo Printing Out scroll time list 70-80 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserScrollBehaviour.js');printRegularScrollListBatchedPerUser(70,80);" > data/scrollTimeList_70-80.json

echo Printing Out scroll time list 80-90 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserScrollBehaviour.js');printRegularScrollListBatchedPerUser(80,90);" > data/scrollTimeList_80-90.json

echo Printing Out scroll time list 90-100 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserScrollBehaviour.js');printRegularScrollListBatchedPerUser(90,100);" > data/scrollTimeList_90-100.json
######END OF BATCHED scroll time lists



###POSTPROCESSING OF FILES
for i in data/*.json;
do
	echo "postprocessing $i";
	##sed to format the output files. the \ is used as scape character.
	#sed -i '/pattern to match/d' ./infile
	#sed -i '/MongoDB shell version: 2.4.10/d' $i
	sed -i '/MongoDB shell version: .*/d' $i
	sed -i '/connecting to: localhost\/testdb/d' $i
	sed -i '/connecting to: 130.88.193.33\/testdb/d' $i
	sed -i '/connecting to: 130.88.193.33\/testdb/d' $i
	sed -i '/connecting to: localhost\/kupballtrainingdb/d' $i
	sed -i '/connecting to: localhost\/alltrainingdb/d' $i
	sed -i '/connecting to: localhost\/alltrainingdb/d' $i
	sed -i '/connecting to: localhost\/.*/d' $i
	sed -i '/connecting to: alltrainingdb/d' $i
	sed -i '/Error: 18 .*/d' $i


	#Remove empty json objects
	sed -i '/{ }/d' $i

	#Now I need to delete all the extra ,\n] generated.
	#N; indicates to keep the reading opened even if new line is provided, both "," "n" and "]" need scape characters
	#sed -i 'N;s/\,\n\]/\]/' $i

	#Changed my mind, it didn't work many times. I will just get the number of lines and remove the one before the last one.

	NUMBER_OF_LINES=$(wc -l < $i)
	echo $NUMBER_OF_LINES
	LINE_TO_DELETE=`expr ${NUMBER_OF_LINES} - 1`

	echo "deleting line $LINE_TO_DELETE out of $NUMBER_OF_LINES from $i";
	sed -i ${LINE_TO_DELETE}d $i

	#wc -l scrollFastSingleDirectionMouseScroll.json
done


#TRANSFORM INTO CSV
# Using in2csv from https://github.com/onyxfish/csvkit, which I found from post http://jeroenjanssens.com/2013/09/19/seven-command-line-tools-for-data-science.html
#Installed it using instructions from http://csvkit.readthedocs.org/en/0.7.3/
#1) sudo apt-get install python-pip
#2) sudo pip install csvkit
#3) There was a "The installed version of lxml is too old to be used with openpyxl" warning:
#		sudo apt-get build-dep python-lxml

for i in data/*.json;
do
	echo "transforming $i to csv";
	in2csv $i > $i.csv
done

#RENAMING .json.csv to .csv.
#It would be simpler to put this code intos the previous loop, but I don't have that many files
#having them in two functions makes it easier to reuse this code
for i in data/*.json.csv;
do
	echo "changing extension of $i";
	#The command basename gives the name of the file without the given extension
	base=`basename $i .json.csv`
	mv $i data/$base.csv
done


#fi

###############PROCESSING COMBINED CSV
#If the size of the returned values is too big, we'll split them into 4 separate CSVs.
#We combine them here

###MouseIdleTime from data/mouseIdleTime*.csv to data/mouseIdleTime.csv
mkdir -p data/combinedCSV

#nawk 'FNR==1 && NR!=1{next;}{print}' data/mouseTimeList_*.csv > data/combinedCSV/mouseTimeList.csv
nawk 'FNR==1 && NR!=1{next;}{print}' data/scrollTimeList_*.csv > data/combinedCSV/scrollTimeList.csv
