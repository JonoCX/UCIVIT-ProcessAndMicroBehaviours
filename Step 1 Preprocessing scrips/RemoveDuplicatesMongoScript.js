/**
 * 
 * This script will look for duplicates in the events collection. It will create the collection
 * "duplicateValues", in which each event will have a count of how many time it was found in 
 * the collection
 * To run it
 * mongo localhost/testdb RemoveDuplicatesMongoScript.js
 */ 

//////We need to load the constants file
load("../MapReduceConstants.js");

var db = connect(mongoPath);
db.auth(mongoUser,mongoPass);


print("Running RemoveDuplicatesMongoScript function at:" + datestamp());


db.events.mapReduce(mapFunction,reduceFunction, { out : "duplicateValues" });


var totalDuplicates = db.duplicateValues.find({value: {$gt: 1}}).count();
var duplicateIndex = 1;

db.duplicateValues.find({value: {$gt: 1}}).addOption(DBQuery.Option.noTimeout).forEach(
    function(obj) {
		print("Duplicate "+duplicateIndex + " out of " + totalDuplicates);
		duplicateIndex ++;
	    var cur = db.events.find({
			"sid":obj._id.sid,
			"sessionstartms":obj._id.sessionstartms,
			"event":obj._id.event,
			"ip":obj._id.ip,
			"timestamp":obj._id.timestamp,
			"timestampms":obj._id.timestampms,
			"usertimezoneoffset":obj._id.usertimezoneoffset,
			"sd":obj._id.sd,
			//"url":obj._id.url,
			//"platform":obj._id.platform,
			//"browser":obj._id.browser
		});
	    var first = true;
	    while (cur.hasNext()) {
	        var doc = cur.next();
	        if (first) {first = false; continue;}
			db.events.remove({ _id: doc._id });
	    }
})

print("RemoveDuplicatesMongoScript function finished at" + datestamp() 
	+ " finding "+totalDuplicates+" duplicates, and removing " + duplicateIndex);

function mapFunction () {
    emit({
			sid:this.sid,
			sessionstartms:this.sessionstartms,
			event:this.event,
			ip:this.ip,
			timestamp:this.timestamp,
			timestampms:this.timestampms,
			usertimezoneoffset:this.usertimezoneoffset,
			sd:this.sd,
			//url:this.url,
			//platform:this.platform,
			//browser:this.browser
		}
		,1);
}

function reduceFunction (key, values) {
    return Array.sum(values);
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
