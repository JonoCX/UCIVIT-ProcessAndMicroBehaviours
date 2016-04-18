/**
 * 
 * This script will create a new collection: "idleTimes". There will be a list for each user/url, 
 * with the found idleTimeperiods, as well as the first event for that user in that url.

 * A later script will use this times, and update all events using the timedifference 
 * between the event and the first event, minus the accumulated idleTime.
 * (currentEventTS - firstEventTS) - idleTimeTillThatPoint
 * 
 * 
 * 
 * To run it:
 * mongo localhost/testdb IdleTimeMongoScriptV2.js
 * 
 * 
 * 
 * 
 * 
 */

var consoleIndent = "   ";

//////We need to load the constants file
load("MapReduceConstants.js");

/*OLD connection system
 * var db = connect(mongoPath);
db.auth(mongoUser,mongoPass);*/
db = connectAndValidate();


print("Running IdleTimeMongoScriptV2 function at:" + datestamp());


var ignoredEvents = [mobileGyroscopeEvent,mouseOverEvent,resizeEvent];

///idleTimeThreshold
var idleThreshold = 50000;

print("Deleting previous idleTimes collection at:" + datestamp());
db.idleTimes.remove({});
db.idleTimesForSd.remove({});

var idleCreation = "idleCreation started at: " + datestamp();

print("Running nonparallel algorithm at:" + datestamp());
createIdleTimesList();
print("Nonparallel finished at:" + datestamp());

idleCreation += " and finished at: " + datestamp();

print("IdleTimeMongoScriptV2 function finished at:" + datestamp());
print(idleCreation);

function createIdleTimesList(){
	
	//We first get ALL users from the Web application to be analysed.
	print("START of retrieving ALL user list:" + datestamp());
	/*var userList = db.events.distinct("sid",
		{ 
			"sd" : websiteId
			, "event": {$nin: ignoredEvents}
			,"sessionstartms" : { "$exists" : true}
		});
		*/
	var userList = db.activeUsers.distinct("sid",{"sd" : websiteId});
	//var userList = db.userList.distinct("sid");
	
	print("END of retrieving ALL user list:" + datestamp());

	print(userList.length + " users found at:" + datestamp());
	var userIndex  = 1;

	userList.forEach(function(userItem) {

		print(consoleIndent + "Looking for " + userItem + ", user " + userIndex +" of " + userList.length);
		userIndex++;
		
		//get all urls the user has ever accessed
		//print(consoleIndent + "START of retrieving url's for user "+ userItem + ":" + datestamp());

		var urlListForUser = db.events.distinct("url",
			{
				"sid":userItem
				, "sd" : websiteId
				, "event": {$nin: ignoredEvents}
				,"sessionstartms" : { "$exists" : true}
			});
		
		//print(consoleIndent + "END of retrieving url's for user "+ userItem + ":" + datestamp());

		//For each url, we will look for idle times between its SORTED events.
		urlListForUser.forEach(function(urlItem) {
			//print(consoleIndent + consoleIndent + "START of retrieving events for user|url "+ userItem + "|"+urlItem + ":" + datestamp());

			var eventListFromDB = db.events.find(
				{
					"url":urlItem
					, "sid":userItem
					, "sd" : websiteId
					, "event": {$nin: ignoredEvents}
					,"sessionstartms" : { "$exists" : true}
				}).sort({"timestamp":1});
				
			//print(consoleIndent + consoleIndent + "END of retrieving events for user|url "+ userItem + "|"+urlItem + ":" + datestamp());

			var previousEvent = null;
			var listOfIdleTimes = [];
			var idleTimeTemp = 0;
			
			eventList = eventListFromDB.toArray();
			
			var firstEventForUserUrl = eventList[0];
	
			for (var i in eventList){
				if (previousEvent !== null){
					
					idleTimeTemp = parseDateToMs(eventList[i].timestamp) - parseDateToMs(previousEvent.timestamp);
	
					//if idle time is big enough, we report it
					if (idleTimeTemp > idleThreshold){
						listOfIdleTimes.push({
							sid:eventList[i].sid,
							sessionstartms:eventList[i].sessionstartms,
							firstEventForUserUrl:firstEventForUserUrl,
							url:eventList[i].url,
							startTimestamp:previousEvent.timestamp,
							startTimestampms:previousEvent.timestampms,
							endTimestamp:eventList[i].timestamp,
							endTimestampms:eventList[i].timestampms,
							usertimezoneoffset : eventList[i].usertimezoneoffset,
							timestampms:previousEvent.timestampms,
							timestamp:previousEvent.timestamp,
							idleTime:idleTimeTemp});
					}
				}
	
				previousEvent = eventList[i];
			}
			if (listOfIdleTimes.length > 0){
				print("Inserting " + listOfIdleTimes.length +" idle occurrences for user " + listOfIdleTimes[0].sid
							+ " in url " + listOfIdleTimes[0].url);
				//After each user we flush the list into Mongo, to avoid having a list which is too long
				db.idleTimes.insert(listOfIdleTimes);
			}
		});
		
		///////////////START OF SD IDLE TIMES/////////////
		//We will now loop through ALL user events, to get the idle times for the Web site in general
		print(consoleIndent + "START of retrieving events for user "+ userItem + ":" + datestamp());

		var eventListFromDB = db.events.find(
			{
				"sid":userItem
				, "sd" : websiteId
				, "event": {$nin: ignoredEvents}
				,"sessionstartms" : { "$exists" : true}
			}).sort({"timestamp":1});
		print(consoleIndent + "END of retrieving events for user "+ userItem + ":" + datestamp());

		var previousEvent = null;
		var listOfIdleTimes = [];
		var idleTimeTemp = 0;
		
		eventList = eventListFromDB.toArray();
		
		var firstEventForUserSd = eventList[0];

		for (var i in eventList){
			if (previousEvent !== null){
				
				idleTimeTemp = parseDateToMs(eventList[i].timestamp) - parseDateToMs(previousEvent.timestamp);

				//if idle time is big enough, we report it
				if (idleTimeTemp > idleThreshold){
					listOfIdleTimes.push({
						sid:eventList[i].sid,
						sd:eventList[i].sd,
						sessionstartms:eventList[i].sessionstartms,
						firstEventForUserSd:firstEventForUserSd,
						url:eventList[i].url,
						startTimestamp:previousEvent.timestamp,
						startTimestampms:previousEvent.timestampms,
						endTimestamp:eventList[i].timestamp,
						endTimestampms:eventList[i].timestampms,
						usertimezoneoffset : eventList[i].usertimezoneoffset,

						timestampms:previousEvent.timestampms,
						timestamp:previousEvent.timestamp,
						idleTime:idleTimeTemp});
				}
			}

			previousEvent = eventList[i];
		}
		if (listOfIdleTimes.length > 0){
			print("Inserting " + listOfIdleTimes.length +" idle occurrences for user " + listOfIdleTimes[0].sid
						+ " in SD " + listOfIdleTimes[0].sd);
			//After each user we flush the list into Mongo, to avoid having a list which is too long
			db.idleTimesForSd.insert(listOfIdleTimes);
		}
		
		///////////////END OF SD IDLE TIMES/////////////
	});
}



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
