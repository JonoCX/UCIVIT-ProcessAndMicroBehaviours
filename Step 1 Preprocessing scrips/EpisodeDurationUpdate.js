/**
 * 
 * This script updates the active users, and adds a "episodeDuration" which gives the length of the episode
 * in which that event is contained.
 * 
 * 
 * IT SHOULD BE RUN AFTER SessionCounterUpdate.js!!
 *  
 * 
 * To run it:
 * mongo localhost/testdb EpisodeDurationUpdate.js > EpisodeDurationUpdate.txt
 * 
 * 
 * 
 * 
 * 
 */
//////We need to load the constants file
load("MapReduceConstants.js");

/*OLD connection system
 * var db = connect(mongoPath);
db.auth(mongoUser,mongoPass);*/
db = connectAndValidate();

print("Running EpisodeDurationUpdate function at:" + datestamp());


var consoleIndent = "   ";

var timeToUpdate = "Update started at: " + datestamp();

print("Updating records at:" + datestamp());
setEpisodeLengthInDB();
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

function setEpisodeLengthInDB(){
	
	var userList = db.activeUsers.distinct("sid",{"sd" : websiteId});

	var userCounter = 0;
	
	var userListLength = userList.length;
	
	userList.forEach(function(userItem) {
		userCounter ++;
		print("Updating user " + userItem + ", " + userCounter + " of " + userListLength + ", at:" + datestamp());
		
		print(consoleIndent + "UpdatingUrlsEpisodeLengths at:" + datestamp());
		updateUrlEpisodeLength(userItem);

		print(consoleIndent + "UpdatingSDEpisodeLenghts at:" + datestamp());
		updateEventsWithSdSession(userItem);

		//print(consoleIndent + "UpdatingTrimmedUrlEpisodeLengths at:" + datestamp());
		//updateEventsWithUrlTrimmedSession(userItem);
		
	});
}

function updateUrlEpisodeLength(userItem){

	var urlListForUser = db.events.distinct("url",{"sid":userItem, "sd" : websiteId,"sessionstartms" : { "$exists" : true}});
	
	urlListForUser.forEach(function(urlItem) {
		
		//For each episodeCounter
		var urlEpisodeCountList = db.events.distinct("urlSessionCounter", { "sid": userItem, "sd" : websiteId, "url":urlItem,"sessionstartms" : { "$exists" : true}});

		urlEpisodeCountList.forEach(function(urlEpisodeCounter) {
			//Get the first and last event for that episode, and store the difference as the episode duration
			//var userUrlEventList = db.events.find( { "sid": userItem, "sd" : websiteId, "url":urlItem,"urlSessionCounter":urlEpisodeCounter,"sessionstartms" : { "$exists" : true}}).sort({"timestamp":1}).toArray();
			var userUrlEventList = db.events.find( { "sid": userItem, "sd" : websiteId, "url":urlItem,"urlSessionCounter":urlEpisodeCounter,"sessionstartms" : { "$exists" : true}}).toArray();
			
			userUrlEventList = userUrlEventList.sort(compareParsedTS);
			userUrlEventList.sort(compareParsedTS);
			
			var firstEventInEpi = parseDateToMs(userUrlEventList[0].timestamp);
			var lastEventInEpi = parseDateToMs(userUrlEventList[userUrlEventList.length-1].timestamp);
			
			var episodeLength = lastEventInEpi - firstEventInEpi;
			
			//We also get the total active time in that episode, calculating the aggregated active time between the first and the last episode
			//In case the first value is null, I will set a loop until a value is discovered, or a threshold is met (no active times at all would be weird....
			var firstEventInEpiActive = userUrlEventList[0].calculatedActiveTime;
			
			var eventIndexTemp = 0;
			while (firstEventInEpiActive == null && eventIndexTemp < userUrlEventList.length-1){
				eventIndexTemp ++;
				firstEventInEpiActive = userUrlEventList[eventIndexTemp].calculatedActiveTime;
			}
			
			var lastEventInEpiActive = userUrlEventList[userUrlEventList.length-1].calculatedActiveTime;
			eventIndexTemp = userUrlEventList.length-1;
			while (lastEventInEpiActive == null && eventIndexTemp > 0){
				eventIndexTemp --;
				lastEventInEpiActive = userUrlEventList[eventIndexTemp].calculatedActiveTime;
			}
			
			var episodeUrlActivity = -1;
			if (lastEventInEpiActive != null && firstEventInEpiActive != null){
				episodeUrlActivity = lastEventInEpiActive - firstEventInEpiActive;
			}
			else{
				print("ERROR: null active times found, firstEventInEpiActive: "+firstEventInEpiActive+", lastEventInEpiActive: " + lastEventInEpiActive 
				+ "; for user " + userItem + ",website " + websiteId + ", url " + urlItem 
				+ ", urlSessionCounter " + urlEpisodeCounter + ", at " + datestamp());
			}
			
			//Update events in episode with episodeLength
			db.events.update(
					{"sid": userItem, "sd" : websiteId, "url":urlItem,"urlSessionCounter":urlEpisodeCounter,"sessionstartms" : { "$exists" : true}},
					{$set: {
						"urlEpisodeLength": episodeLength,
						"episodeUrlActivity": episodeUrlActivity
						}},
					{multi: true }
				);
		});
	});
}

function updateEventsWithSdSession(userItem){
	
	//For each episodeCounter
	var sdEpisodeCountList = db.events.distinct("sdSessionCounter", { "sid": userItem, "sd" : websiteId, "sessionstartms" : { "$exists" : true}});

	sdEpisodeCountList.forEach(function(sdEpisodeCounter) {
		//Get the first and last event for that episode, and store the difference as the episode duration
		//var userSdEventList = db.events.find( { "sid": userItem, "sd" : websiteId, "sdSessionCounter":sdEpisodeCounter,"sessionstartms" : { "$exists" : true}}).sort({"timestamp":1}).toArray();
		var userSdEventList = db.events.find( { "sid": userItem, "sd" : websiteId, "sdSessionCounter":sdEpisodeCounter,"sessionstartms" : { "$exists" : true}}).toArray();
		
		userSdEventList = userSdEventList.sort(compareParsedTS);
		userSdEventList.sort(compareParsedTS);
			
		var firstEventInEpiTS = parseDateToMs(userSdEventList[0].timestamp);
		var lastEventInEpiTS = parseDateToMs(userSdEventList[userSdEventList.length-1].timestamp);
		
		var episodeLength = lastEventInEpiTS - firstEventInEpiTS;
					
		//We also get the total active time in that episode, calculating the aggregated active time between the first and the last episode
		//In case the first value is null, I will set a loop until a value is discovered, or a threshold is met (no active times at all would be weird....
		var firstEventInEpiActive = userSdEventList[0].sdCalculatedActiveTime;
		
		var eventIndexTemp = 0;
		while (firstEventInEpiActive == null && eventIndexTemp < userSdEventList.length-1){
			eventIndexTemp ++;
			firstEventInEpiActive = userSdEventList[eventIndexTemp].sdCalculatedActiveTime;
		}
		
		var lastEventInEpiActive = userSdEventList[userSdEventList.length-1].sdCalculatedActiveTime;
		eventIndexTemp = userSdEventList.length-1;
		while (lastEventInEpiActive == null && eventIndexTemp > 0){
			eventIndexTemp --;
			lastEventInEpiActive = userSdEventList[eventIndexTemp].sdCalculatedActiveTime;
		}
		
		var episodeSdActivity = -1;
		if (lastEventInEpiActive != null && firstEventInEpiActive != null){
			episodeSdActivity = lastEventInEpiActive - firstEventInEpiActive;
		}
		else{
			print("ERROR: null active times found, firstEventInEpiActive: "+firstEventInEpiActive +", lastEventInEpiActive: " + lastEventInEpiActive 
			+ "; for user " + userItem + ",website " + websiteId + ", sdCounter " + sdEpisodeCounter +" at " + datestamp());
		}
			
			
		
		//Update events in episode with episodeLength
		db.events.update(
				{"sid": userItem, "sd" : websiteId, "sdSessionCounter":sdEpisodeCounter,"sessionstartms" : { "$exists" : true}},
				{$set: {
					"sdEpisodeLength": episodeLength,
					"episodeSdActivity": episodeSdActivity
					}},
				{multi: true }
			);
	});
}


function updateEventsWithUrlTrimmedSession(userItem){


	var urlTrimmedListForUser = db.events.distinct("urlTrimmed",{"sid":userItem, "sd" : websiteId,"sessionstartms" : { "$exists" : true}});
	
	urlTrimmedListForUser.forEach(function(urlTrimmedItem) {
		
		//For each episodeCounter
		var urlTrimmedEpisodeCountList = db.events.distinct("urlTrimmedSessionCounter", { "sid": userItem, "sd" : websiteId, "urlTrimmed":urlTrimmedItem,"sessionstartms" : { "$exists" : true}});

		urlTrimmedEpisodeCountList.forEach(function(urlTrimmedEpisodeCounter) {
			//Get the first and last event for that episode, and store the difference as the episode duration
			//var userUrlEventList = db.events.find( { "sid": userItem, "sd" : websiteId, "urlTrimmed":urlTrimmedItem,"urlTrimmedSessionCounter":urlTrimmedEpisodeCounter,"sessionstartms" : { "$exists" : true}}).sort({"timestamp":1}).toArray();
			var userUrlEventList = db.events.find( { "sid": userItem, "sd" : websiteId, "urlTrimmed":urlTrimmedItem,"urlTrimmedSessionCounter":urlTrimmedEpisodeCounter,"sessionstartms" : { "$exists" : true}}).toArray();
			
			userUrlEventList = userUrlEventList.sort(compareParsedTS);
			userUrlEventList.sort(compareParsedTS);
			
			var firstEventInEpi = parseDateToMs(userUrlEventList[0].timestamp);
			var lastEventInEpi = parseDateToMs(userUrlEventList[userUrlEventList.length-1].timestamp);
			
			var episodeLength = lastEventInEpi - firstEventInEpi;

			//Update events in episode with episodeLength
			db.events.update(
					{"sid": userItem, "sd" : websiteId, "urlTrimmed":urlTrimmedItem,"urlTrimmedSessionCounter":urlTrimmedEpisodeCounter,"sessionstartms" : { "$exists" : true}},
					{$set: {
						"urlTrimmedEpisodeLength": episodeLength
						}
						},
					{multi: true }
				);
		});
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
