/**
 * Prints certain values to the standard output. The best way to call this script is by piping it to a file:
 * 
 * extractUrlIdleTimes() will extract the idle times pertaining to "http://www.cs.manchester.ac.uk/"
 * 
 * To run it:
 * mongo localhost/testdb ExtractIdleTimes.js > sdIdleTimesActiveUsers.json
 * mongo localhost/testdb ExtractIdleTimes.js > urlIdleTimesActiveUsers.json
 * 
 */ 

//////We need to load the constants file
load("../MapReduceConstants.js");

var db = connect(mongoPath);
db.auth(mongoUser,mongoPass);

//extractSdIdleTimes();
extractUrlIdleTimes();

function extractSdIdleTimes(){
	print("Starting extractSdIdleTimes");
	
	var activeUserList = db.activeUsers.distinct("sid",{"sd":websiteId});
	
	activeUserList.forEach(function(userItem) {
		
		db.idleTimesForSd.find({"sid":userItem},
			{
				"sid":1,
				"sessionstartms" :1,
				"url":1,
				"idleTime" : 1,
				"usertimezoneoffset" : 1,
				"startTimestamp":1,
				"startTimestampms":1,
				"endTimestamp":1,
				"endTimestampms":1
				}).sort({"timestamp":1}).forEach(function(idleItem) {
					printjson(idleItem);
					print(",");
				});
	});
	print("Ending extractSdIdleTimes");
}


function extractUrlIdleTimes(){
	print("Starting extractUrlIdleTimes");
	
	var activeUserList = db.activeUsers.distinct("sid",{"sd":websiteId});
	
	activeUserList.forEach(function(userItem) {
	
		db.idleTimes.find({"sid":userItem,"url" : "http://www.cs.manchester.ac.uk/"},
			{
				"sid":1,
				"sessionstartms" :1,
				"url":1,
				"idleTime" : 1,
				"usertimezoneoffset" : 1,
				"startTimestamp":1,
				"startTimestampms":1,
				"endTimestamp":1,
				"endTimestampms":1
				}).sort({"timestamp":1}).forEach(function(idleItem) {
					printjson(idleItem);
					print(",");
				});
	});
	print("Ending extractUrlIdleTimes");
}
