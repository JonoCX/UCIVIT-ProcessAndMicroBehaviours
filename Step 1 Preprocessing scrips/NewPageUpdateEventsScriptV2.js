/**
 * Updates the events in the collection with two new attributes: visitCounter and visitDuration.
 * Uses the collection "revisitCounter" created by NewPageMongoScriptV2.js
 * 
 * To run it:
 * mongo localhost/testdb NewPageUpdateEventsScriptV2.js
 * 
 */ 
//////We need to load the constants file
load("MapReduceConstants.js");

var db = connect(mongoPath);
db.auth(mongoUser,mongoPass);


print("Running NewPageUpdateEventsScriptV2 function at:" + datestamp());

updateEventsInDB();

//we have an unclosed cursor, so we need to manually close the connection.
//db.close();

print("NewPageUpdateEventsScriptV2 finished at:" + datestamp());

function updateEventsInDB(){
	
	var userListCounter = db.revisitCounter.find().count();
	//we need the noTimeout option to prevent the cursor from autoclosing itself after 10 minutes
	var userList = db.revisitCounter.find().addOption(DBQuery.Option.noTimeout);
	var userIndex = 1;

	print(userList.count() + " user items found at:" + datestamp());
	
	userList.forEach(function(userItem) {
		var userId = userItem._id.sid;
		print("USER " + userIndex + " OUT OF " + userListCounter);
		userIndex++;
		
		var pageCounterList = userItem.value.userEpisodePageCounterList;
		
		pageCounterList.forEach(function(pageCounterItem) {
			
			var sessionstartms = pageCounterItem.sessionstartms;
			var url = pageCounterItem.url;
			var visitCounter = pageCounterItem.visitCounter;
			var visitDuration = pageCounterItem.visitDuration;
			
			var dateLowerBound = pageCounterItem.firstTimestamp;
			var dateLowerBoundms = parseDateToMs(dateLowerBound);
			var dateUpperBound = pageCounterItem.lastTimestamp;
		   
			print("updating all items with following attributes:" 
				+ "sid:" +  userId +  ",sessionstartms:" + sessionstartms +  ",url:" + url);
			/*db.events.update(
			    { "sd":websiteId, "sid": userId, "sessionstartms":sessionstartms, "url":url,
			    "timestamp":{$gte: dateLowerBound, $lte: dateUpperBound}},
				{$set: {
					"visitCounter": visitCounter,
					"visitDuration": visitDuration + (parseDateToMs(timestamp) - sessionstartms);
					}
				},
				{ multi: true }
				);
				*/
				
			db.events.find({ "sd":websiteId, "sid": userId, "sessionstartms":sessionstartms, "url":url,
			    "timestamp":{$gte: dateLowerBound, $lte: dateUpperBound}}).forEach(
					function (e) {
						
						/*print("updating the item with TS:" + e.timestamp +"; visitDuration will be: " 
							+ visitDuration + " + "  + (parseDateToMs(e.timestamp) - e.sessionstartms));*/
						e.visitCounter = visitCounter;
						e.visitDuration = visitDuration + (parseDateToMs(e.timestamp) - dateLowerBoundms);
					
						// save the updated document
						db.events.save(e);
					}
				);
		});
	});
}
