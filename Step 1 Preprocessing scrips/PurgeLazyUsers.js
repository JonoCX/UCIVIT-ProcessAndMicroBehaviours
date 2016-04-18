/**
 * IMPORTANT!! THIS SCRIPT MAKES OPERATIONS THAT CANNOT BE UNDONE!!
 * It can take a long time, last time, deleting 39035 users it took almost an entire day.
 * 
 * This script will use the lazyUsers collection and purge those users from the DB.
 * 
 * To run it
 * mongo localhost/testdb PurgeLazyUsers.js > PurgeLazyUsersLog.txt
 */ 

//////We need to load the constants file
load("MapReduceConstants.js");

/*OLD connection system
 * var db = connect(mongoPath);
db.auth(mongoUser,mongoPass);*/
db = connectAndValidate();

var consoleIndent = "   ";

print("Running PurgeLazyUsers function at:" + datestamp());

purgeLazyUsers();
 
var totalLazyUsers = db.lazyUsers.find({"sd" : websiteId}).count();
var totalActiveUsers = db.activeUsers.find({"sd" : websiteId}).count();


print("PurgeLazyUsers function finished at" + datestamp() 
	+ " deleting "+totalLazyUsers+" lazy users");

function purgeLazyUsers(){
	
	//We first get ALL lazy users
	print("START of retrieving ALL lazy users user list:" + datestamp());
	
	var userList = db.lazyUsers.distinct("sid",{"sd" : websiteId});

	var totalUserCount = userList.length;
	print("END of retrieving " + totalUserCount + " users:" + datestamp());
	
	var userIndex = 0;

	//For each user, delete all its events from the DB
	userList.forEach(function(userItem) {
		//I will report progress every 100 users processed
		userIndex++;
		if ((userIndex % 1001)==1000){
			var progress = userIndex/totalUserCount * 100;
			print("Processing user " + userIndex + ", " + progress + "% at:" + datestamp());
		}
		
		print("DELETING user:" + userItem + " at " + datestamp());

		db.events.remove({"sid":userItem,"sd" : websiteId});
		db.domchanges.remove({"sid":userItem,"sd" : websiteId});
		db.dommilestones.remove({"sid":userItem,"sd" : websiteId});
		db.domtempmilestones.remove({"sid":userItem,"sd" : websiteId});
		db.idleTimes.remove({"sid":userItem,"sd" : websiteId});
		db.idleTimesForSd.remove({"sid":userItem,"sd" : websiteId});
		
		print("user:" + userItem + " deleted at " + datestamp());
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
