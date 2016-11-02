/***
 * This script will fix the urls from some events that don't have them.
 * It will use the urls from the same tab, which have the same url, if there is more than one distinct url,
 * it will look for the closest event.
 * 
 * I remember having problems using mapReduce grouping by user and sessionstartms, as the resulting document
 * was too big. I'll have to run it in a non-parallel way, as I cannot rely on urls (which is what I am trying to fix!)
 * I only fix events  which comply to "sessionstartms" : { "$exists" : true}"
 * 
 * For each user
 * 	 Look for url missing events
 *   For each url missing event
 * 	   Look for distinct urls in its sessionstartms
 *     If unique url for sessionstartms --> update event with that url
 *     Else
 *       Look for closest event? --> At the moment, I will just report it.
 * 
 * To run it:
 * mongo localhost/testdb UrlFixer.js >UrlFixer.txt
 */ 
//////We need to load the constants file
load("../MapReduceConstants.js");

/*OLD connection system
 * var db = connect(mongoPath);
db.auth(mongoUser,mongoPass);*/
db = connectAndValidate();

print("Running UrlFixer function at:" + datestamp());


var consoleIndent = "   ";

fixUrls()

print("UrlFixer function finished at:" + datestamp());

function fixUrls(){
	
	print("Querying for distinct users at:" + datestamp());

	//var userList = db.events.distinct("sid",{"sd" : websiteId});
	//var userList = ["yhndx6L4y4BC"];
	var userList = db.activeUsers.distinct("sid",{"sd" : websiteId});
	
	print(userList.length +" users found at:" + datestamp());
	
	userCounter = 0;
	//For each user
	userList.forEach(function(userItem) {
		userCounter++;
		print(consoleIndent + "Processing user "+ userItem + ", " + userCounter + " out of " + userList.length + " at:" + datestamp());

		//Look for url missing events
		var urlMissingEventList = db.events.find({"sid":userItem,"sd" : websiteId, "url":{$exists:false}
				,"sessionstartms" : { "$exists" : true}}).toArray();
		print(consoleIndent + consoleIndent + urlMissingEventList.length + "events without url found at:" + datestamp());

		//For each url missing event
		for (var i = 0; i < urlMissingEventList.length; i++){
			var urlMissingEvent = urlMissingEventList[i];
			
			//print(JSON.stringify(urlMissingEvent));
			//Look for distinct urls in its sessionstartms
			var urlsForSession = db.events.distinct("url",{"sid":userItem,"sd" : websiteId,"sessionstartms":urlMissingEvent.sessionstartms});
			if (urlsForSession.length > 0)
				print(consoleIndent + consoleIndent + consoleIndent + 
						urlsForSession.length + "urls found for event " + i + " at:" + datestamp());

			//If unique url for sessionstartms --> update event with that url
			if (urlsForSession.length == 1)
			{
				db.events.update(
				    { "_id":urlMissingEvent._id},
					{$set: {"url": urlsForSession[0]} }
				);
			}
			//Else --> At the moment, I will just report it.
			else{
				print(consoleIndent + consoleIndent + consoleIndent + 
					"More than one url found for single session: " + JSON.stringify(urlMissingEventList[i]));
				fixMultipleUrlEpisode(userItem, urlMissingEvent.sessionstartms);
			}
		}
	});
}


/**
 * This function will take the sessionstartms and sid, and will update events which don't have a url set, but are surrounded by
 *  events the url of which is the same.
 * In the following example, event2 and event3 will be set to the same url as event1 and event4
 * event1: www.url1.com
 * event2: ?
 * event3: ?
 * event4: www.url1.com
 * 
 * I will have to be cautious with multiple useless callings to these method. If it has been run for a give sid and
 * sessionstartmsValue, it should not do anything.
 */
 
 function fixMultipleUrlEpisode(sidValue, sessionstartmsValue){
	 print(consoleIndent + consoleIndent + consoleIndent + consoleIndent 
			+"Start of fixMultipleUrlEpisode for " + sidValue + " in " + sessionstartmsValue +" at:" + datestamp());
	 //Important! it MUST be cronologically sorted
	var eventList = db.events.find({"sid":sidValue, "sessionstartms":sessionstartmsValue}).sort({"timestamp":1}).toArray();
	
	//What if the first event doesn't have a url??
	lastUrl = eventList[0].url;
	print(consoleIndent + consoleIndent + consoleIndent + consoleIndent +
			eventList.length +" events found, starting with url:" + lastUrl);
	
	//We will keep a list of the events to be updated with the 
	var eventsToUpdate = new Array();

	for (var eventIndex = 1; eventIndex < eventList.length; eventIndex++){
		//We test if event being processed has url
		if (typeof(eventList[eventIndex].url) !== 'undefined'){
			
			//If there is any event in the list, then we need to update it!
			if (eventsToUpdate.length != 0){
				//was the previous and this url the same?
				if (lastUrl==eventList[eventIndex].url){
					//if so, we can just update all events stored so far
					print(consoleIndent + consoleIndent + consoleIndent + consoleIndent 
						+ " Updating " + eventsToUpdate.length + "events with url:" + lastUrl);
					for (var updateEventIndex = 0; updateEventIndex < eventsToUpdate.length; updateEventIndex++){
						db.events.update(
						    { "_id":eventsToUpdate[updateEventIndex]._id},
							{$set: {"url": lastUrl}});
					}
				}
				//if not, there is nothing we can do so far, apart from reporting it.
				else{
					print(consoleIndent + consoleIndent + consoleIndent + consoleIndent 
						+ " urls were different:"+lastUrl +" vs " + eventList[eventIndex].url + ", events after the following could not be updated:" + JSON.stringify(eventsToUpdate[0]));
				}
				//updated or not, we need to reset the array
				eventsToUpdate = new Array();
			}
			
			//remember to update current url
			lastUrl = eventList[eventIndex].url;

		}
		else{
			//If not, we may have to update it with a proper url at the end of the "non-url" events section
			eventsToUpdate.push(eventList[eventIndex])
		}
		
	}	
	print(consoleIndent + consoleIndent + consoleIndent + consoleIndent 
		+"End of fixMultipleUrlEpisode for " + sidValue + " in " + sessionstartmsValue +" at:" + datestamp());
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
