/**
 * 
 * This script will look for "lazy users" in the events collection. It will create the collection
 * "lazyUsers", in which users whose first and last event take place within the same 24 hours are listed.
 * it will also create the "activeUsers" collection, from which the rest of the events can query
 * 
 * All users include the websiteIndex, so other scripts can query for site specific active users.
 * 
 * To run it
 * mongo localhost/testdb CountLazyUsers.js
 */ 

//////We need to load the constants file
load("../MapReduceConstants.js");

/*OLD connection system
 * var db = connect(mongoPath);
db.auth(mongoUser,mongoPass);*/
db = connectAndValidate();

var consoleIndent = "   ";

print("Running CountLazyUsers function at:" + datestamp());

var ignoredEvents = [mobileGyroscopeEvent,mouseOverEvent,resizeEvent];



//Time determining what is the threshold between first and last event that will determine if a user is a "lazy user"
//I will start with one day
//var timeThreshold = 15 * 60* 1000;//15min
var timeThreshold = 1 * 24 * 60 * 60 * 1000;//1 day

//we only remove the elements from the website we are going to insert
db.lazyUsers.remove({"sd": websiteId});
db.activeUsers.remove({"sd": websiteId});
db.userList.remove({"sd": websiteId});



createLazyUsersList();
 
var totalLazyUsers = db.lazyUsers.find({"sd": websiteId}).count();
var totalActiveUsers = db.activeUsers.find({"sd": websiteId}).count();


print("CountLazyUsers function finished at" + datestamp() 
	+ " finding "+totalLazyUsers+" lazy users and "
	+ totalActiveUsers + " active users");

function createLazyUsersList(){
	//We first get ALL users from the Web application to be analysed.
	print("START of retrieving ALL user list:" + datestamp());
	var userList = db.events.distinct("sid",
		{
			"sd" : websiteId
			,"sessionstartms" : { "$exists" : true}
		});

	var totalUserCount = userList.length;
	print("END of retrieving " + totalUserCount + " users:" + datestamp());
	

	
	var userIndex = 0;
	var lazyUserCount = 0;
	var lazyUserList = [];
	
	var activeUserCount = 0;
	var activeUserList = [];
	
	var allUserList = []


	indexToDelete = userList.indexOf("null");
	
	if(indexToDelete!=-1){
		print("Setting null users to lazy at " + datestamp());
		userList.splice(indexToDelete, 1);
		
		totalUserCount --;
		
		lazyUserCount++;
		lazyUserList.push({
			sid:"null",
			sd:websiteId
		});
	}
	
	//For each user, get the first and last event and compare them
	userList.forEach(function(userItem) {
		//I will report progress every 100 users processed
		userIndex++;
		if ((userIndex % 1001)==1000){
			var progress = userIndex/totalUserCount * 100;
			print("Processing user " + userIndex + ", " + progress + "% at:" + datestamp());
			print(lazyUserCount + " out of 1000 users were lazy");
			lazyUserCount = 0;
		}
		
		var firstEvent = db.events.find({"sd":websiteId,"sid":userItem}).sort({"timestamp":1}).limit(10);
		var firstEventIndex = 0;
		var lastEvent = db.events.find({"sd":websiteId,"sid":userItem}).sort({"timestamp":-1}).limit(10);
		var lastEventIndex = 0;
	
		while (typeof firstEvent[firstEventIndex].timestamp == 'undefined' && firstEventIndex < 10){
			print("UNDEFINED FIRST EVENT from user " + userItem + " at:" + datestamp());
			print("user " + userItem + " has " + firstEvent.length);
			printjson(firstEvent[firstEventIndex]);
			firstEventIndex++;

		}
			
		while (typeof lastEvent[lastEventIndex].timestamp == 'undefined' && lastEventIndex < 10){
			print("UNDEFINED LAST EVENT from user " + userItem + " at:" + datestamp());
			printjson(lastEvent[lastEventIndex]);
			lastEventIndex++;
		}
		
		//Either lazy or not, we will keep the ALL users in a single list
		allUserList.push({
				sid:userItem,
				sd:websiteId,
				timeBetweenEvents:timeBetweenEvents,
				firstEvent:firstEvent[firstEventIndex].timestamp,
				firstEventms:firstEvent[firstEventIndex].timestampms,
				lastEvent:lastEvent[lastEventIndex].timestamp,
				lastEventms:lastEvent[lastEventIndex].timestampms
			});

		
		
		var timeBetweenEvents = parseDateToMs(lastEvent[lastEventIndex].timestamp) - parseDateToMs(firstEvent[firstEventIndex].timestamp);
		//If the time between the first and last event is less than the threshold:
		if (timeBetweenEvents < timeThreshold){
			//print(consoleIndent + "user " + userItem + " is a lazy user");
			lazyUserCount++;
			lazyUserList.push({
				sid:userItem,
				sd:websiteId,
				timeBetweenEvents:timeBetweenEvents,
				firstEvent:firstEvent[firstEventIndex].timestamp,
				firstEventms:firstEvent[firstEventIndex].timestampms,
				lastEvent:lastEvent[lastEventIndex].timestamp,
				lastEventms:lastEvent[lastEventIndex].timestampms
			});
		}
		//if  not, this user could be considered "active"
		else{
			activeUserCount++;
			activeUserList.push({
				sid:userItem,
				sd:websiteId,
				timeBetweenEvents:timeBetweenEvents,
				firstEvent:firstEvent[firstEventIndex].timestamp,
				firstEventms:firstEvent[firstEventIndex].timestampms,
				lastEvent:lastEvent[lastEventIndex].timestamp,
				lastEventms:lastEvent[lastEventIndex].timestampms
			});
		}
	});
	
	print("START of creating lazy and active users collection at:" + datestamp());
	if (allUserList.length > 0)
		db.userList.insert(allUserList);
	if (lazyUserList.length > 0)
		db.lazyUsers.insert(lazyUserList);
	if (activeUserList.length > 0)
		db.activeUsers.insert(activeUserList);
	print("END of creating lazy and active users collection at:" + datestamp());
}

/**
 * Returns current date in a readable format
 */ 
function datestamp() {
	var currentDate 	= new Date();
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
 * Parse a date in "yyyy-mm-dd,HH:mm:ss:SSS" format, and return the ms.
 * I will do it manually to avoid problems with implementation dependant functions
 * new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
 * 2013-07-05,09:25:53:970
 */ 
function parseDateToMs(input) {
	try {
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
	catch(err) {
		print("ERROR: parseDateToMs(). Following input cause an error:" + input);
		throw new Error("Something went badly wrong!");
	}
	
}
