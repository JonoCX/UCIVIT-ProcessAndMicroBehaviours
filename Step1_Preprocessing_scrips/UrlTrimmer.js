/***
 * This script will trim the urls, removing all text after a "?".
 * This way pages such as search, will be all the same.
 
 * To run it:
 * mongo localhost/testdb UrlTrimmer.js >UrlTrimmer.txt
 */ 
//////We need to load the constants file
load("../MapReduceConstants.js");

var db = connect(mongoPath);
db.auth(mongoUser,mongoPass);

print("Running UrlTrimmer function at:" + datestamp());

var consoleIndent = "   ";

trimUrls()

print("UrlTrimmer function finished at:" + datestamp());

function trimUrls(){
	
	print("Querying for distinct urls at:" + datestamp());

	//var userList = db.events.distinct("sid",{"sd" : websiteId});
	//var userList = ["yhndx6L4y4BC"];
	var urlList = db.events.distinct("url",{"sd" : websiteId,"urlTrimmed":{$exists:false}});
	
	print(urlList.length +" urls found at:" + datestamp());
	
	urlCounter = 0;
	//For each url
	urlList.forEach(function(urlItem) {
		urlCounter++;
		print(consoleIndent + "Processing url "+ urlItem + ", " + urlCounter + " out of " + urlList.length + " at:" + datestamp());

		//For each url we will update its urltrimmed attribute
		var urlTrimmed = urlItem.split("?")[0];
		db.events.update(
				    { "url":urlItem},
					{$set: {"urlTrimmed": urlTrimmed} },
					{ multi: true}
				);
	});
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
