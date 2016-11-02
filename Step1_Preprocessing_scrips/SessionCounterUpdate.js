/**
 * 
 * This script updates the active users, and adds a "session Counter" which identifies each session for that user.
 * There will be two session counters sessionCounterSd and sessionCounterUrl, with obvious differences.
 * The session tiemout is determined in the constants
 *  
 * 
 * To run it:
 * mongo localhost/testdb SessionCounterUpdate.js > SessionCounterUpdateLog.txt
 * 
 * 
 * 
 * 
 * 
 */
  
//////We need to load the constants file
load("../MapReduceConstants.js");

/*OLD connection system
 * var db = connect(mongoPath);
db.auth(mongoUser,mongoPass);*/
db = connectAndValidate();

print("Running SessionCounterUpdate function at:" + datestamp());



//Threshold value that indicates when an Idle episode will be considered as "big", in ms
var idleTimeThreshold = sessionTimeout;//40 minutes in ms

var consoleIndent = "   ";

var timeToUpdate = "Update started at: " + datestamp();

print("Updating records at:" + datestamp());
setSessionCounterInDB()
print("Finished updating records at:" + datestamp());

print(timeToUpdate + "and finished at" + datestamp());


/**
 * Parse a date in "yyyy-mm-dd,HH:mm:ss:SSS" format, and return the ms.
 * I will do it manually to avoid problems with implementation dependant functions
 * new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
 * 2013-07-05,09:25:53:970
 */ 
function parseDateToMs(input) {

	var dateString = input;
	var parts = dateString.split(',');
	
	var date = parts[0].split('-');
	/*var year = date[0];
	var month = date[1];
	var day = date[2];*/
	
	var time = parts[1].split(':');
	/*var hour = time[0];
	var minute = time[1];
	var secs = time[2];
	var millisecs = time[3];*/
	// new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
	return new Date(date[0], date[1]-1, date[2], time[0],time[1],time[2],time[3]).getTime();
	// Note: we use  date[1]-1 because months are 0-based
}

function setSessionCounterInDB(){
	
	var userList = db.activeUsers.distinct("sid",{"sd" : websiteId});

	var userCounter = 0;
	
	var userListLength = userList.length;
	
	userList.forEach(function(userItem) {
		userCounter ++;
		print("Updating user " + userItem + ", " + userCounter + " of " + userListLength + ", at:" + datestamp());
		
		print(consoleIndent + "UpdatingUrls at:" + datestamp());

		updateEventsWithUrlSession(userItem);

		print(consoleIndent + "UpdatingSD at:" + datestamp());
		updateEventsWithSdSession(userItem);

/*
		print(consoleIndent + "UpdatingTrimmedUrls at:" + datestamp());
		updateEventsWithUrlTrimmedSession(userItem);
		* */
		
	});
}

function updateEventsWithUrlSession(userItem){

	var urlListForUser = db.events.distinct("url",{"sid":userItem,"sessionstartms" : { "$exists" : true}});
	
	urlListForUser.forEach(function(urlItem) {
		
		var urlSessionCounter = 1;
		var urlTimeSinceLastSession = 0;
		var urlTimeDifference = 0;
		
		//var userUrlEventList = db.events.find( { "sid": userItem, "url":urlItem,"sessionstartms" : { "$exists" : true}}).sort({"timestamp":1}).toArray();
		var userUrlEventList = db.events.find( { "sid": userItem, "url":urlItem,"sessionstartms" : { "$exists" : true}}).toArray();
		
		userUrlEventList = userUrlEventList.sort(compareParsedTS);
		userUrlEventList.sort(compareParsedTS);
		
		print(consoleIndent + consoleIndent + userUrlEventList.length + "events found for url"+urlItem + " at:" + datestamp());

		if (userUrlEventList.length>0)
			var lastEventTS = parseDateToMs(userUrlEventList[0].timestamp);

		for (var i = 0; i < userUrlEventList.length; i++){
			//We calculate the time between current and last event
			urlTimeDifference = (parseDateToMs(userUrlEventList[i].timestamp)-lastEventTS);
			
			lastEventTS = parseDateToMs(userUrlEventList[i].timestamp);
			
			//if the time between events is too big, we will start a new session
			if (urlTimeDifference>sessionTimeout){
				urlSessionCounter++;
				urlTimeSinceLastSession = urlTimeDifference;
			}
		
			//Update current event with whatever current sessionCounter value is
			db.events.update(
				{ "_id":userUrlEventList[i]._id},
					{$set: {
						"urlSessionCounter": urlSessionCounter,
						"urlSinceLastSession": urlTimeSinceLastSession,
						}
					}
				);
		}
	});
}

function updateEventsWithSdSession(userItem){

	var sdSessionCounter = 1;
	var sdTimeSinceLastSession = 0;
	var sdTimeDifference = 0;


	//var userSdEventList = db.events.find( { "sid": userItem, "sd":websiteId, "sessionstartms" : { "$exists" : true}}).sort({"timestamp":1}).toArray();
	var userSdEventList = db.events.find( { "sid": userItem, "sd":websiteId, "sessionstartms" : { "$exists" : true}}).toArray();
	
	userSdEventList = userSdEventList.sort(compareParsedTS);
	userSdEventList.sort(compareParsedTS);
	
	print(consoleIndent + consoleIndent + userSdEventList.length + "events found for at:" + datestamp());

	if (userSdEventList.length>0)
		var lastEventTS = parseDateToMs(userSdEventList[0].timestamp);

	for (var i = 0; i < userSdEventList.length; i++){
		//We calculate the time between current and last event
		sdTimeDifference = (parseDateToMs(userSdEventList[i].timestamp)-lastEventTS);
		
		lastEventTS = parseDateToMs(userSdEventList[i].timestamp);
		
		//if the time between events is too big, we will start a new session
		if (sdTimeDifference > sessionTimeout){
			sdSessionCounter++;
			sdTimeSinceLastSession = sdTimeDifference;
		}
	
		//Update current event with whatever current sessionCounter value is
		db.events.update(
			{ "_id":userSdEventList[i]._id},
				{$set: {
					"sdSessionCounter": sdSessionCounter,
					"sdTimeSinceLastSession": sdTimeSinceLastSession,
					}
				}
			);
	}
}


function updateEventsWithUrlTrimmedSession(userItem){

	var urlTrimmedListForUser = db.events.distinct("urlTrimmed",{"sid":userItem,"sessionstartms" : { "$exists" : true}});
	
	urlTrimmedListForUser.forEach(function(urlTrimmedItem) {
		
		var urlTrimmedSessionCounter = 1;
		var urlTrimmedTimeSinceLastSession = 0;
		var urlTrimmedTimeDifference = 0;
		
		//var userUrlTrimmedEventList = db.events.find( { "sid": userItem, "urlTrimmed":urlTrimmedItem,"sessionstartms" : { "$exists" : true}}).sort({"timestamp":1}).toArray();
		var userUrlTrimmedEventList = db.events.find( { "sid": userItem, "urlTrimmed":urlTrimmedItem,"sessionstartms" : { "$exists" : true}}).toArray();
		
		userUrlTrimmedEventList = userUrlTrimmedEventList.sort(compareParsedTS);
		userUrlTrimmedEventList.sort(compareParsedTS);
	
		print(consoleIndent + consoleIndent + userUrlTrimmedEventList.length + "events found for urlTrimmed"+urlTrimmedItem + " at:" + datestamp());

		if (userUrlTrimmedEventList.length>0)
			var lastEventTS = parseDateToMs(userUrlTrimmedEventList[0].timestamp);

		for (var i = 0; i < userUrlTrimmedEventList.length; i++){
			//We calculate the time between current and last event
			urlTrimmedTimeDifference = (parseDateToMs(userUrlTrimmedEventList[i].timestamp)-lastEventTS);
			
			lastEventTS = parseDateToMs(userUrlTrimmedEventList[i].timestamp);
			
			//if the time between events is too big, we will start a new session
			if (urlTrimmedTimeDifference>sessionTimeout){
				urlTrimmedSessionCounter++;
				urlTrimmedTimeSinceLastSession = urlTrimmedTimeDifference;
			}
		
			//Update current event with whatever current sessionCounter value is
			db.events.update(
				{ "_id":userUrlTrimmedEventList[i]._id},
					{$set: {
						"urlTrimmedSessionCounter": urlTrimmedSessionCounter,
						"urlTrimmedTimeSinceLastSession": urlTrimmedTimeSinceLastSession,
						}
					}
				);
		}
	});
}


/**
 * Returns current date in a readable format
 */ 
function datestamp() {
	var currentDate = new Date();
	return currentDate.getFullYear() + "-" + completeDateVals(currentDate.getMonth()+1) + "-"
	  + completeDateVals(currentDate.getDate()) + "," + completeDateVals(currentDate.getHours())
	  + ":" + completeDateVals(currentDate.getMinutes())
	  + ":" + completeDateVals(currentDate.getSeconds())
	  + ":" + completeDateValsMilliseconds(currentDate.getMilliseconds());
	  
}

/** Completes single-digit numbers by a "0"-prefix
 *  */
function completeDateVals(dateVal) {
	var dateVal = "" + dateVal;
	if (dateVal.length<2) return "0" + dateVal;
	else return dateVal;
}

/** Completes single-digit numbers by a "0"-prefix
 * This is a special case for milliseconds, in which we will add up to two zeros 
 * */
function completeDateValsMilliseconds(dateVal) {
	var dateVal = "" + dateVal;
	if (dateVal.length<2) return "00" + dateVal;
	if (dateVal.length<3) return "0" + dateVal;
	else return dateVal;
}

/**
* We need our own compare function in order to be able to sort the array according to the timestamp
* 		idlePeriodUserUrlList = idlePeriodUserUrlList.sort(compareParsedTS);
		idlePeriodUserUrlList.sort(compareParsedTS);
*/ 
function compareParsedTS(objectA,objectB) {
	
	var objectATime = objectA.timestamp;
	var objectBTime = objectB.timestamp;
			
	if (objectATime < objectBTime){
		//timeDifference += "##" + objectATime+ "is SMALLER than " + objectBTime;
		return -1;
	}
	if (objectATime > objectBTime){
		//timeDifference += "##" + objectATime+ "is BIGGER than " + objectBTime;
		return 1;
	}
	//timeDifference += "##" + objectATime+ "is EQUALS to " + objectBTime;
	return 0;
}

