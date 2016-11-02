/**
 * 
 * It looks for ACTIVE users without idle times, and reports them
 * 
 * 
 * To run it:
 * mongo localhost/testdb NullIdleFinder.js > FoundNullIdle.txt
 * 
 * 
 * 
 * 
 * 
 */
  
//////We need to load the constants file
load("../MapReduceConstants.js");

var db = connect(mongoPath);
db.auth(mongoUser,mongoPass);


print("Running NullIdleFinder function at:" + datestamp());


var consoleIndent = "   ";
var userList = db.activeUsers.distinct("sid",{"sd" : websiteId});
userList.forEach(function(userItem) {
	if (userList.indexOf(userItem)%100==0){
		print(userList.indexOf(userItem) + " out of " + userList.length)
	}
	var nonIdleCount = db.events.find({
		"sid":userItem,
		"idleTime":{$exists:false},
		"sessionstartms":{$exists:true}}).count();
	if (nonIdleCount > 0){
		print ("user " + userItem + " in position "+userList.indexOf(userItem) +" has "+nonIdleCount + " occurrences of undefined idleTime");
	}
});


print("NullIdleFinder finished at:" + datestamp());

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
