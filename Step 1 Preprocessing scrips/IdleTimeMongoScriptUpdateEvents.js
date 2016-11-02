/**
 * 
 * This script updates only a certain amount of users from the "idleTimes" collection.
 * IT DOESN'T create any idle periods!
 * 
 * It currently looks for the most common users from scrollBehavioursPerUser, and updates them
 * 
 * 
 * To run it:
 * mongo localhost/testdb IdleTimeMongoScriptUpdateEvents.js
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


print("Running IdleTimeMongoScriptUpdateEvents function at:" + datestamp());


//Threshold value that indicates when an Idle episode will be considered as "big", in ms
var idleTimeThreshold = sessionTimeout;//Can be found in the constants

var consoleIndent = "   ";

var timeToUpdate = "Update started at: " + datestamp();

print("Updating records at:" + datestamp());
setIdleTimesInDB()
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

function setIdleTimesInDB(){
	
	//var userList = db.idleTimes.distinct("sid");
	
	//var userList = db.scrollBehaviourStatsPerUser.find({},{"_id.sid":1}).sort({'value.controlledScrollCounter':-1});
	//var userList = db.idleTimes.distinct("sid");
	var userList = db.activeUsers.distinct("sid",{"sd" : websiteId});
	//var userList = ["yhndx6L4y4BC"];

	
	var userCounter = 0;
	
	var userListLength = userList.length;
	
	/*
	///ONE TIME MODIFICATION!!/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	print(userList.indexOf("esA3UJP6TBIP"));

	userCounter = userList.indexOf("esA3UJP6TBIP")-1;
	//The script broke in midexecution, so I update the userlist to include only the ones hadn't been processed
	var userList = userList.slice(userList.indexOf("esA3UJP6TBIP"),userList.length);

	/////////////////////////////////////////////////////////////////////////////////////////////////
	///END OF ONE TIME MODIFICATION/////////////////////////////////////////////////////////////////////////////////////////////////
	*/
	
	//var updateTime = 0;
	
	/*userList.forEach(function(userObject) {
		userItem = userObject._id.sid;*/
	userList.forEach(function(userItem) {
		userCounter ++;
		print("Updating user " + userItem + ", " + userCounter + " of " + userListLength + ", at:" + datestamp());
		
		print("UpdatingUrls");

		var idleUrlListForUser = db.idleTimes.distinct("url",{"sid":userItem});
		print("Updating" + idleUrlListForUser.length + "urls");
		updateEventsWithIdleUrl(userItem,idleUrlListForUser);
		
		//In reality, this should just return a single value.
		var idleSdListForUser = db.idleTimesForSd.distinct("sd",{"sid":userItem});
		print("Updating" + idleSdListForUser.length + "sds");
		updateEventsWithIdleSd(userItem,idleSdListForUser);

		
	});
}

function updateEventsWithIdleUrl(userItem,idleUrlListForUser){
	var urlCounter = 0;

	/*
	 * Before updating events taking into account idle times, we'll
	 * update events from urls that are not included in the idleTimes.
	 * These are outliers, as they mean they are events from one-time users
	 * that never had any idle times.
	 */
	 var urlListForUser = db.events.distinct("url",{"sid":userItem});
	/*
	 * We check the list of unique urls for that user, and see if they are
	 * contained in the urls in the idlePeriods. If not, we will update its
	 * event in the regular non-idle way
	 */
	urlListForUser.forEach(function(urlItem) {
		//if currentUrl cannot be found in the idlePeriods
		if (idleUrlListForUser.indexOf(urlItem) < 0){
			
			//var userUrlEventList = db.events.find( { "sid": userItem, "url":urlItem,"sessionstartms" : { "$exists" : true}}).sort({"timestamp":1}).toArray();
			var userUrlEventList = db.events.find( { "sid": userItem, "url":urlItem,"sessionstartms" : { "$exists" : true}}).toArray();
			
			
			userUrlEventList = userUrlEventList.sort(compareParsedTS);
			userUrlEventList.sort(compareParsedTS);
	

			print(consoleIndent + "No idlePeriods found for url " + urlItem + ", updating " + userUrlEventList.length + " events, at:" + datestamp());			

			//We get the first event, from the sorted query
			/*(there was a problem with some strange urls, which were recognised as urls, but the events of which 
			 * could not be retrieved. This resulted in getting a count of 0 events, causing a nullpointer 
			 * if we don't detect this situation
			 */
			if (userUrlEventList.length>0)
				var firstEventTS = parseDateToMs(userUrlEventList[0].timestamp);

			for (var i = 0; i < userUrlEventList.length; i++){
				eventObject = userUrlEventList[i];
/*
				print(consoleIndent + consoleIndent + consoleIndent + consoleIndent + "Updating event with id:" + eventObject._id + "and time: " + eventObject.timestamp
					+ " with values: 0, "+ (parseDateToMs(eventObject.timestamp) - firstEventTS) + ", 0");
*/
				db.events.update(
				    { "_id":eventObject._id},
					{$set: {
						"idleTime": 0,
						"calculatedActiveTime": parseDateToMs(eventObject.timestamp) - firstEventTS,
						"idleTimeSoFar": 0
						}
					}
				);
			}
		}
	});


	
	idleUrlListForUser.forEach(function(idleUrlItem) {
		urlCounter++;
		print(consoleIndent + "Updating url " + idleUrlItem + ", " + urlCounter + " of " + idleUrlListForUser.length + ", at:" + datestamp());
		
		//var idlePeriodUserUrlList = db.idleTimes.find({"sid":userItem, "url":idleUrlItem}).sort({"timestamp":1}).toArray();
		var idlePeriodUserUrlList = db.idleTimes.find({"sid":userItem, "url":idleUrlItem}).toArray();
		var userUrlEventList = db.events.find( { "sid": userItem, "url":idleUrlItem,"sessionstartms" : { "$exists" : true}}).toArray();
		
		idlePeriodUserUrlList = idlePeriodUserUrlList.sort(compareParsedTS);
		idlePeriodUserUrlList.sort(compareParsedTS);

		var idleTimeSoFar = 0;
		var idlePeriodCounter = 0;
					
		
		////////////////////Updating events using idleTimes
		for (var i = 0; i < idlePeriodUserUrlList.length; i++){
			idlePeriodCounter++;
			print(consoleIndent + consoleIndent + "Updating idlePeriod " + idlePeriodCounter + " of " + idlePeriodUserUrlList.length);

			var idlePeriodUserUrl = idlePeriodUserUrlList[i];
			var firstEventTS = parseDateToMs(idlePeriodUserUrl.firstEventForUserUrl.timestamp);
			var currentIdleTime = idlePeriodUserUrl.idleTime;
			idleTimeSoFar += currentIdleTime;

			var timeToSubstractFromTS = firstEventTS + idleTimeSoFar;
			
			if (i==0){
				//We first need to update all the "first" events, for which idle time will be '0'
				print(consoleIndent + consoleIndent + consoleIndent + "Updating all items with following attributes:" 
						+ "sid:" +  userItem +  ",url:" + idleUrlItem
						+ " AND BEFORE " + idlePeriodUserUrl.startTimestamp);

				//We loop through ALL events for user/url, and update the ones within our time constraints
				
				//var userUrlEventList = db.events.find( { "sid": userItem, "url":idleUrlItem,"sessionstartms" : { "$exists" : true}}).toArray();

				for (var j = 0; j < userUrlEventList.length; j++){
					var eventObject = userUrlEventList[j];
					
				//userUrlEventList.forEach(function(eventObject) {
					
					//updates the events BEFORE (<=) the start of the idle period, including the event just before it
					if (parseDateToMs(eventObject.timestamp) <= parseDateToMs(idlePeriodUserUrl.startTimestamp)){
						/*
						print(consoleIndent + consoleIndent + consoleIndent + consoleIndent + "Updating event with id:" + eventObject._id + "and time: " + eventObject.timestamp
							+ " with values:" +  currentIdleTime +  "," 
							+ (parseDateToMs(eventObject.timestamp) - firstEventTS) + ","
							+ idleTimeSoFar);
*/
						// save the updated document
						
						//updateTime = new Date().getTime();

						db.events.update(
						    { "_id":eventObject._id},
							{$set: {
								"idleTime": 0,
								"calculatedActiveTime": parseDateToMs(eventObject.timestamp) - firstEventTS,
								"idleTimeSoFar": 0
								}
							}
						);
						//print ("Update took: " + (new Date().getTime() - updateTime));
					}
				}
			}
					
			
			
			/*
			 * we'll update all events until the start event of the next idle time (included).
			 * If there is not next idle, set no upper boundary
			 */
			
			var nextIdlePeriodStart = null;
			if (i < idlePeriodUserUrlList.length-1){
				nextIdlePeriodStart = idlePeriodUserUrlList[i+1].startTimestamp;
			}
			
			//If there is no Next idlePeriod, we update all remaining events
			if (nextIdlePeriodStart === null){
				print(consoleIndent + consoleIndent + consoleIndent + "Updating all items with following attributes at "+ datestamp() +":" 
					+ "sid:" +  userItem +  ",url:" + idleUrlItem
					+ " AND AFTER " + idlePeriodUserUrl.startTimestamp);
				
				//var userUrlEventList = db.events.find( { "sid": userItem, "url":idleUrlItem,"sessionstartms" : { "$exists" : true}});
				
				for (var j = 0; j < userUrlEventList.length; j++){
					var eventObject = userUrlEventList[j];
					
				//userUrlEventList.forEach(function(eventObject) {
					
					//updates the events AFTER (<) the start of the idle period
					if (parseDateToMs(idlePeriodUserUrl.startTimestamp) < parseDateToMs(eventObject.timestamp)){
						/*
						print(consoleIndent + consoleIndent + consoleIndent + consoleIndent + "Updating event with id:" + eventObject._id + "and time: " + eventObject.timestamp
							+ " with values:" +  currentIdleTime +  "," 
							+ (parseDateToMs(eventObject.timestamp) - timeToSubstractFromTS) + ","
							+ idleTimeSoFar);
*/
						// save the updated document
						
						//updateTime = new Date().getTime();

						db.events.update(
						    { "_id":eventObject._id},
							{$set: {
								"idleTime": currentIdleTime,
								"calculatedActiveTime": parseDateToMs(eventObject.timestamp) - timeToSubstractFromTS,
								"idleTimeSoFar": idleTimeSoFar
								}
							}
						);
						//print ("Update took: " + (new Date().getTime() - updateTime));

					}
				}
				
			}
			else{
				
				print(consoleIndent + consoleIndent + consoleIndent + "Updating all items with following attributes:" 
					+ "sid:" +  userItem +  ",url:" + idleUrlItem
					+ " AND between " + idlePeriodUserUrl.startTimestamp + " and " + nextIdlePeriodStart);
			
				//var userUrlEventList = db.events.find( { "sid": userItem, "url":idleUrlItem,"sessionstartms" : { "$exists" : true}});

				for (var j = 0; j < userUrlEventList.length; j++){
					var eventObject = userUrlEventList[j];
				//userUrlEventList.forEach(function(eventObject) {
					
					/*Updates all events Between AFTER the idle period took place (<) and INCLUDES the first event that
					 * starts the next idle time (<=)
					 */ 
					if ((parseDateToMs(idlePeriodUserUrl.startTimestamp) < parseDateToMs(eventObject.timestamp))
						&& (parseDateToMs(eventObject.timestamp) <= parseDateToMs(nextIdlePeriodStart))){
					/*
						print(consoleIndent + consoleIndent + consoleIndent + consoleIndent + "Updating event with id:" + eventObject._id + "and time: " + eventObject.timestamp
							+ " with values:" +  currentIdleTime +  "," 
							+ (parseDateToMs(eventObject.timestamp) - timeToSubstractFromTS) + ","
							+ idleTimeSoFar);
						*/// save the updated document
						
						//updateTime = new Date().getTime();
						
						db.events.update(
						    { "_id":eventObject._id},
							{$set: {
								"idleTime": currentIdleTime,
								"calculatedActiveTime": parseDateToMs(eventObject.timestamp) - timeToSubstractFromTS,
								"idleTimeSoFar": idleTimeSoFar
								}
							}
						);
						//print ("Update took: " + (new Date().getTime() - updateTime));
					}
				}
			}
		}
	});
}



function updateEventsWithIdleSd(userItem,idleSdListForUser){
	var sdCounter=0;
	/*
	 * As with the urls, we will first look for the sds not included in the list, although this will only happen
	 * if there was no idle time at all.
	 */
	var sdListForUser = db.events.distinct("sd",{"sid":userItem});
	
	sdListForUser.forEach(function(sdItem) {
		//if currentSd cannot be found in the idlePeriods
		if (idleSdListForUser.indexOf(sdItem) < 0){
			
			//var userSdEventList = db.events.find( { "sid": userItem, "sd":sdItem,"sessionstartms" : { "$exists" : true}}).sort({"timestamp":1}).toArray();
			var userSdEventList = db.events.find( { "sid": userItem, "sd":sdItem,"sessionstartms" : { "$exists" : true}}).toArray();
			
			userSdEventList = userSdEventList.sort(compareParsedTS);
			userSdEventList.sort(compareParsedTS);

			print(consoleIndent + "No idlePeriods found for sd " + sdItem + ", updating " + userSdEventList.length + " events");			

			if (userSdEventList.length>0)
				var firstEventTS = parseDateToMs(userSdEventList[0].timestamp);

			for (var i = 0; i < userSdEventList.length; i++){
				eventObject = userSdEventList[i];
/*
				print(consoleIndent + consoleIndent + consoleIndent + consoleIndent 
					+ "Updating event with id:" + eventObject._id + "and time: " + eventObject.timestamp
					+ " with values: 0, "+ (parseDateToMs(eventObject.timestamp) - firstEventTS) + ", 0");
*/
				db.events.update(
				    { "_id":eventObject._id},
					{$set: {
						"sdIdleTime": 0,
						"sdCalculatedActiveTime": parseDateToMs(eventObject.timestamp) - firstEventTS,
						"sdIdleTimeSoFar": 0,
						
						"latestSdIdleTimeLength":0,
						"latestSdIdleTimeTS": userSdEventList[0].timestamp,
						"latestSdIdleTimeTSms": firstEventTS
						}
					}
				);
			}
		}
	});


	
	idleSdListForUser.forEach(function(idleSdItem) {
		sdCounter++;
		print(consoleIndent + "Updating sd " + idleSdItem + ", " + sdCounter + " of " + idleSdListForUser.length);
		
		//var idlePeriodUserSdList = db.idleTimesForSd.find({"sid":userItem, "sd":idleSdItem}).sort({"timestamp":1}).toArray();
		var idlePeriodUserSdList = db.idleTimesForSd.find({"sid":userItem, "sd":idleSdItem}).toArray();
		var userSdEventList = db.events.find( { "sid": userItem, "sd":idleSdItem,"sessionstartms" : { "$exists" : true}}).toArray();
		
		idlePeriodUserSdList = idlePeriodUserSdList.sort(compareParsedTS);
		idlePeriodUserSdList.sort(compareParsedTS);
			
		var sdIdleTimeSoFar = 0;
		var idlePeriodCounter = 0;
		
		
		/////////////////LAST IDLE TIME ATTRIBUTES///////////
		//I need to keep track of the latest Idle time, so it can be properly updated
		//Every time we find an idle period time greater than 3 minutes, these values will be updated!!
		//The events taking place before the first Idletime will have '0's as values.
		var latestSdIdleTimeLength = 0;
		var latestSdIdleTimeTS = 0;
		var latestSdIdleTimeTSms = 0;
		
		////////////////////Updating events using idleTimes
		for (var i = 0; i < idlePeriodUserSdList.length; i++){
			idlePeriodCounter++;
			print(consoleIndent + consoleIndent + "Updating idlePeriod " + idlePeriodCounter + " of " + idlePeriodUserSdList.length);

			var idlePeriodUserSd = idlePeriodUserSdList[i];
			var firstEventTS = parseDateToMs(idlePeriodUserSd.firstEventForUserSd.timestamp);
			var currentSdIdleTime = idlePeriodUserSd.idleTime;
			sdIdleTimeSoFar += currentSdIdleTime;

			var timeToSubstractFromTS = firstEventTS + sdIdleTimeSoFar;
			
			if (i==0){
				//We first need to update all the "first" events, for which idle time will be '0'
				print(consoleIndent + consoleIndent + consoleIndent + "Updating all items with following attributes:" 
						+ "sid:" +  userItem +  ",sd:" + idleSdItem
						+ " AND BEFORE " + idlePeriodUserSd.startTimestamp);

				//We loop through ALL events for user/sd, and update the ones within our time constraints

				//var userSdEventList = db.events.find( { "sid": userItem, "sd":idleSdItem,"sessionstartms" : { "$exists" : true}}).toArray();

				for (var j = 0; j < userSdEventList.length; j++){
					var eventObject = userSdEventList[j];
				//userSdEventList.forEach(function(eventObject) {
					
					//updates the events BEFORE (<=) the start of the idle period, including the event just before it
					if (parseDateToMs(eventObject.timestamp) <= parseDateToMs(idlePeriodUserSd.startTimestamp)){
						
						/*print(consoleIndent + consoleIndent + consoleIndent + consoleIndent 
							+ "Updating event with id:" + eventObject._id + "and time: " + eventObject.timestamp
							+ " with values:" +  currentSdIdleTime +  "," 
							+ (parseDateToMs(eventObject.timestamp) - firstEventTS) + ","
							+ idleTimeSoFar);
*/
						// save the updated document
						
						//updateTime = new Date().getTime();

						db.events.update(
						    { "_id":eventObject._id},
							{$set: {
								"sdIdleTime": 0,
								"sdCalculatedActiveTime": parseDateToMs(eventObject.timestamp) - firstEventTS,
								"sdIdleTimeSoFar": 0,
									
								"latestSdIdleTimeLength":latestSdIdleTimeLength,
								"latestSdIdleTimeTS": latestSdIdleTimeTS,
								"latestSdIdleTimeTSms": latestSdIdleTimeTSms
								}
							}
						);
						//print ("Update took: " + (new Date().getTime() - updateTime));
					}
				}
			}
			
			/*
			 * We now update the latestIdlePeriod values
			 */
			if (idlePeriodUserSd.idleTime > idleTimeThreshold){
				latestSdIdleTimeLength = idlePeriodUserSd.idleTime;
				latestSdIdleTimeTS = idlePeriodUserSd.startTimestamp;
				latestSdIdleTimeTSms = parseDateToMs(idlePeriodUserSd.startTimestamp)
			}
			
			
			/*
			 * we'll update all events until the start event of the next idle time (included).
			 * If there is not next idle, set no upper boundary
			 */
			
			var nextIdlePeriodStart = null;
			if (i < idlePeriodUserSdList.length-1){
				nextIdlePeriodStart = idlePeriodUserSdList[i+1].startTimestamp;
			}
			
			//If there is no Next idlePeriod, we update all remaining events
			if (nextIdlePeriodStart === null){
				print(consoleIndent + consoleIndent + consoleIndent 
					+ "Updating all items with following attributes at "+ datestamp() +":" 
					+ "sid:" +  userItem +  ",sd:" + idleSdItem
					+ " AND AFTER " + idlePeriodUserSd.startTimestamp);
				
				//var userSdEventList = db.events.find( { "sid": userItem, "sd":idleSdItem,"sessionstartms" : { "$exists" : true}});

				//userSdEventList.forEach(function(eventObject) {
				for (var j = 0; j < userSdEventList.length; j++){
					var eventObject = userSdEventList[j];
					
					//updates the events AFTER (<) the start of the idle period
					if (parseDateToMs(idlePeriodUserSd.startTimestamp) < parseDateToMs(eventObject.timestamp)){
						/*
						print(consoleIndent + consoleIndent + consoleIndent + consoleIndent 
							+ "Updating event with id:" + eventObject._id + "and time: " + eventObject.timestamp
							+ " with values:" +  currentSdIdleTime +  "," 
							+ (parseDateToMs(eventObject.timestamp) - timeToSubstractFromTS) + ","
							+ sdIdleTimeSoFar);
*/
						db.events.update(
						    { "_id":eventObject._id},
							{$set: {
								"sdIdleTime": currentSdIdleTime,
								"sdCalculatedActiveTime": parseDateToMs(eventObject.timestamp) - timeToSubstractFromTS,
								"sdIdleTimeSoFar": sdIdleTimeSoFar,
									
								"latestSdIdleTimeLength":latestSdIdleTimeLength,
								"latestSdIdleTimeTS": latestSdIdleTimeTS,
								"latestSdIdleTimeTSms": latestSdIdleTimeTSms

								}
							}
						);
						//print ("Update took: " + (new Date().getTime() - updateTime));

					}
				}
				
			}
			else{
				
				print(consoleIndent + consoleIndent + consoleIndent + "Updating all items with following attributes:" 
					+ "sid:" +  userItem +  ",sd:" + idleSdItem
					+ " AND between " + idlePeriodUserSd.startTimestamp + " and " + nextIdlePeriodStart);
			
				//var userSdEventList = db.events.find( { "sid": userItem, "sd":idleSdItem,"sessionstartms" : { "$exists" : true}});
				
				//userSdEventList.forEach(function(eventObject) {
				for (var j = 0; j < userSdEventList.length; j++){
					var eventObject = userSdEventList[j];
					
					/*Updates all events Between AFTER the idle period took place (<) and INCLUDES the first event that
					 * starts the next idle time (<=)
					 */ 
					if ((parseDateToMs(idlePeriodUserSd.startTimestamp) < parseDateToMs(eventObject.timestamp))
						&& (parseDateToMs(eventObject.timestamp) <= parseDateToMs(nextIdlePeriodStart))){
					/*
						print(consoleIndent + consoleIndent + consoleIndent + consoleIndent + "Updating event with id:" + eventObject._id + "and time: " + eventObject.timestamp
							+ " with values:" +  currentSdIdleTime +  "," 
							+ (parseDateToMs(eventObject.timestamp) - timeToSubstractFromTS) + ","
							+ sdIdleTimeSoFar);
						*/// save the updated document
						
						//updateTime = new Date().getTime();
						
						db.events.update(
						    { "_id":eventObject._id},
							{$set: {
								"sdIdleTime": currentSdIdleTime,
								"sdCalculatedActiveTime": parseDateToMs(eventObject.timestamp) - timeToSubstractFromTS,
								"sdIdleTimeSoFar": sdIdleTimeSoFar,
									
								"latestSdIdleTimeLength":latestSdIdleTimeLength,
								"latestSdIdleTimeTS": latestSdIdleTimeTS,
								"latestSdIdleTimeTSms": latestSdIdleTimeTSms
								}
							}
						);
						//print ("Update took: " + (new Date().getTime() - updateTime));
					}
				}
			}
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
