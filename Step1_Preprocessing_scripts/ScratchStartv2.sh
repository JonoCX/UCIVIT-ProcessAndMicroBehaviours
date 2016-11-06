#To run it "sh ScratchStartv2.sh > ScratchStartv2Out.txt"
# Define a timestamp function
timestamp() {
  date +"%T"
}

#Loading shell variables
. ../shellVariables.sh
echo "The following is the database information to be used for the scripts."

echo "DB path:" $mongoPath
echo "DB user:" $mongoUser
echo "DB pass:" $mongoPass
echo "DB authentication:" $mongoAuthenticateDB
echo "DB db:" $mongoDB
echo "Website ID:" $websiteId

echo "   "
echo "   "
echo "REMEMBER TO CHECK THAT THE INFO IN MapReduceConstants IS THE SAME!!!"
echo "   "
echo "   "


##Do we need to restore the data?
#mongorestore --db '$mongoDB' /home/aitor/Mongo/TestingDB/2014-02-13--2014-05-07/2014-03-31/testdb
#mongorestore --db '$mongoDB' /home/aitor/Mongo/TestingDB/2014-02-13--2014-05-07/2014-05-07/testdb
#mongorestore --db '$mongoDB' /home/aitor/Mongo/TestingDB/2014-05-07--2014-06-09/2014-06-09/testdb
#mongorestore --db '$mongoDB' /home/aitor/Mongo/TestingDB/2014-09-04/testdb
#mongorestore --db '$mongoDB' /home/aitor/Mongo/TestingDB/2014-11-13_NEW/testdb
#mongorestore --db '$mongoDB' /home/aitor/Mongo/TestingDB/2015-02-26/testdb


echo "Initialising indexes" at $(timestamp)
echo "Depending on the size of the database this step can take a while"
mongo InitialiseIndexes.js

##So both authentication and no authentication are supported, a username check is done
#and the corespondent version of the script is run  
if [ "$mongoUser" = "USERNAME" ] || [ "$mongoUser" = "" ];then 
  echo "No authentication will be used for the scripts"
else
  echo "The following credentials will be used:"
  echo "DB user:" $mongoUser
  echo "DB pass:" $mongoPass
fi;

if [ "$mongoUser" = "USERNAME" ] || [ "$mongoUser" = "" ];then 
  echo $mongoPath --eval "db.events.remove({'sd':{\$ne:'$websiteId'}});"
  mongo $mongoPath --eval "db.events.remove({'sd':{\$ne:'$websiteId'}});"
else
  echo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB --eval "db.events.remove({'sd':{\$ne:'$websiteId'}});"
  mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB --eval "db.events.remove({'sd':{\$ne:'$websiteId'}});"  
fi;


###Remove data not corresponding to our desired db?
if [ "$mongoUser" = "USERNAME" ] || [ "$mongoUser" = "" ];then 
  echo $mongoPath --eval "db.events.remove({'sd':{\$ne:'$websiteId'}});"
  mongo $mongoPath --eval "db.events.remove({'sd':{\$ne:'$websiteId'}});"
else
  echo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB --eval "db.events.remove({'sd':{\$ne:'$websiteId'}});"
  mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB --eval "db.events.remove({'sd':{\$ne:'$websiteId'}});"  
fi;


##only 8 were found from million of events
echo "Check for null timestamps" at $(timestamp)
echo "The following number of events were found without timestamp and will be deleted" at $(timestamp)
if [ "$mongoUser" = "USERNAME" ] || [ "$mongoUser" = "" ];then 
  echo $mongoPath --eval "db.events.find({'timestamp':{\$exists:false}}).count();"
  mongo $mongoPath --eval "db.events.find({'timestamp':{\$exists:false}}).count();"
else
  echo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB --eval "db.events.find({'timestamp':{\$exists:false}}).count();"
  mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB --eval "db.events.find({'timestamp':{\$exists:false}}).count();"
fi;

if [ "$mongoUser" = "USERNAME" ] || [ "$mongoUser" = "" ];then 
  echo $mongoPath --eval "db.events.remove({'timestamp':{\$exists:false}});"
  mongo $mongoPath --eval "db.events.remove({'timestamp':{\$exists:false}});"
else
  echo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB --eval "db.events.remove({'timestamp':{\$exists:false}});"
  mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB --eval "db.events.remove({'timestamp':{\$exists:false}});"
fi;


#only 2 were found
echo "Check for empty timestamps (i.e. '') " at $(timestamp)
echo "The following number of events were found with empty timestamp and will be deleted" at $(timestamp)
if [ "$mongoUser" = "USERNAME" ] || [ "$mongoUser" = "" ];then 
  echo $mongoPath --eval "db.events.find({'timestamp':''}).count();"
  mongo $mongoPath --eval "db.events.find({'timestamp':''}).count();"
else
  echo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB --eval "db.events.find({'timestamp':''}).count();"
  mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB --eval "db.events.find({'timestamp':''}).count();"
fi;

if [ "$mongoUser" = "USERNAME" ] || [ "$mongoUser" = "" ];then 
  echo $mongoPath --eval "db.events.remove({'timestamp':''});"
  mongo $mongoPath --eval "db.events.remove({'timestamp':''});"
else
  echo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB --eval "db.events.remove({'timestamp':''});"
  mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB --eval "db.events.remove({'timestamp':''});"
fi;


#echo "Are there any duplicates? Check duplicateValues collection"
#mongo $mongoPath RemoveDuplicatesMongoScript.js

echo "Get active users list" at $(timestamp)
mongo CountLazyUsers.js

echo "Purging lazy users list" at $(timestamp)
mongo PurgeLazyUsers.js

echo "Fixes urls, if an event without url is found, between other events with the same url, that url is set to the events in the middle" at $(timestamp)
mongo UrlFixer.js

##NEVER RUN!!! IT TAKES WAY TOO LONG!!
#echo "Creates the attribute urlTrimmed, without the url after the '?'" at $(timestamp)
#mongo $mongoPath UrlTrimmer.js
#echo "Add the urlTrimmed indexes"
#mongo $mongoPath --eval "db.auth('$mongoUser','$mongoPass');db.events.ensureIndex( {'sid': 1, 'urlTrimmed': 1} );" at $(timestamp)

echo "Create the idle times" at $(timestamp)
mongo IdleTimeMongoScriptV2.js
echo "Add the idleTime indexes" at $(timestamp)

if [ "$mongoUser" = "USERNAME" ] || [ "$mongoUser" = "" ];then 
  echo $mongoPath --eval "db.idleTimes.ensureIndex({'sid': 1});"
  mongo $mongoPath --eval "db.idleTimes.ensureIndex({'sid': 1});"
else
  echo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB --eval "db.idleTimes.ensureIndex({'sid': 1});"
  mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB --eval "db.idleTimes.ensureIndex({'sid': 1});"
fi;

if [ "$mongoUser" = "USERNAME" ] || [ "$mongoUser" = "" ];then 
  echo $mongoPath --eval "db.idleTimes.ensureIndex({'url': 1});"
  mongo $mongoPath --eval "db.idleTimes.ensureIndex({'url': 1});"
else
  echo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB --eval "db.idleTimes.ensureIndex({'url': 1});"
  mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB --eval "db.idleTimes.ensureIndex({'url': 1});"  
fi;

if [ "$mongoUser" = "USERNAME" ] || [ "$mongoUser" = "" ];then 
  echo $mongoPath --eval "db.idleTimes.ensureIndex({'timestamp':1});"
  mongo $mongoPath --eval "db.idleTimes.ensureIndex({'timestamp':1});"
else
  echo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB --eval "db.idleTimes.ensureIndex({'timestamp':1});"
  mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB --eval "db.idleTimes.ensureIndex({'timestamp':1});"  
fi;

echo "Using the idle times, create all the active times values." at $(timestamp)
mongo IdleTimeMongoScriptUpdateEvents.js

echo "Add episode counters" at $(timestamp)
mongo SessionCounterUpdate.js

echo "Add episode durations" at $(timestamp)
mongo EpisodeDurationUpdate.js
