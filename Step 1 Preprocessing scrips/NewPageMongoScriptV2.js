/**
 * This script will use the "sampleEventsFromEpisodeUrl" collection to create the "revisitCounter" collection.
 * It's based on the execution of SampleCreatorMongoScriptV2.js
 * 
 * revisitCounter collection contains a list of the visit counter that should be set for all events of a particular user, 
 * in a particular session with a particular url AND between certain dates. It has the following structure:
 * 
 * 
 * {
		"_id" : {
		"sid" : "yAubjmZKSRd9"
	},
	"value" : {
		"userEpisodePageCounterList" : [
			{
				"sessionstartms" : "1371472132494",
				"url" : "http://www.kupkb.org/",
				"visitCounter" : 1,
				"visitDuration" : 0,
				"firstTimestamp" : "2013-06-17,13:29:12:292",
				"lastTimestamp" : "2013-06-17,13:29:12:295"
			},
			{
				"sessionstartms" : "1371472132494",
				"url" : "http://www.kupkb.org/tab0",
				"visitCounter" : 1,
				"visitDuration" : 0,
				"firstTimestamp" : "2013-06-17,13:30:09:189",
				"lastTimestamp" : "2013-06-17,13:30:10:970"
			},
			{
				"sessionstartms" : "1371472132494",
				"url" : "http://www.kupkb.org/tab2",
				"visitCounter" : 1,
				"visitDuration" : 0,
				"firstTimestamp" : "2013-06-17,13:30:10:995",
				"lastTimestamp" : "2013-06-17,15:08:44:701"
			},
			{
				"sessionstartms" : "1371477549546",
				"url" : "http://www.kupkb.org/tab0",
				"visitCounter" : 2,
				"visitDuration" : 1781,
				"firstTimestamp" : "2013-06-17,14:59:29:088",
				"lastTimestamp" : "2013-06-17,14:59:37:198"
			},

		]
	}

 * 
 * 
 * To run it:
 * mongo localhost/testdb NewPageMongoScriptV2.js
 * 
 * 
 * 
 */ 
 
//////We need to load the constants file
load("MapReduceConstants.js");

var db = connect(mongoPath);
db.auth(mongoUser,mongoPass);


print("Running NewPageMongoScriptV2 function at:" + datestamp());


db.sampleEventsFromEpisodeUrl.mapReduce(
	mapFunction,
	reduceFunction,
	{
		out: { replace: "revisitCounter" }, 
		//I add a scope with all the required variables.
		scope : scopeObject,
		finalize:finalizeFunction
	}
);

print("NewPageMongoScriptV2 function finished at:" + datestamp());

/**
 * This function filters out all unwanted events.
 * It gets executed for each object, and gives access to internal variables via "this".
 **/
function mapFunction () {


	/*
	 * "emit" function takes two arguments: 
	 * 1) the key on which to group the data,
	 * 2) data itself to group. Both of them can be objects ({this.id, this.userId},{this.time, this.value}) for example
	 */ 
	emit({sid:this._id.sid},
			{ "virtualEpisodes":this.value.virtualEpisodes}
		);
}
	
/**
 * 
 * Aggregates different values for each given key. It will take each key, and all the values from Map step, and process them one by one.
 * It takes two parameters: 1) Key 2) array of values (number of values outputted from Map step)
 * Reduce function should just put values in the same list, as it doesn't have access to "all" data, only to a certain batch
 
 */ 
function reduceFunction (key, values) {
	var reduced = {"virtualEpisodes":[]};
	for (var i in values)
	{
		var inter = values[i];
		for (var j in inter.virtualEpisodes) 
		{
			reduced.virtualEpisodes.push(inter.virtualEpisodes[j]);
		}
	}
	return reduced;
}

/**
 * This function is called at the end, with the reduced values for each "key" object.
 * This is the function that has access to ALL data, and this is the step in which events can be ordered and processed
 */ 
function finalizeFunction (key, reduceOutput) {
	
	
	//////////////////////////START OF Auxiliary Functions/////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////
	/**
	* We need our own compare function in order to be able to sort the array according to the timestamp
	*/ 
	function compare(objectA,objectB) {
		
		var objectATime = Number(objectA.timestampms);
		var objectBTime = Number(objectB.timestampms);
				
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
	 * Function to compare nodeInfos
	 * My first approach was going to be the following, but I think using this function is more secure
	 * if (JSON.stringify(currentEvent.nodeInfo) == JSON.stringify(this.lackOfMousePrecisionList[i].nodeInfo)){
	 */ 
	function getNodeInfo(nodeInfo){
		return("NodeInfo [nodeId=" + nodeInfo.nodeId + ", nodeName=" + nodeInfo.nodeName
			+ ", nodeDom=" + nodeInfo.nodeDom + ", nodeImg=" + nodeInfo.nodeImg
			+ ", nodeLink=" + nodeInfo.nodeLink + ", nodeText=" + nodeInfo.nodeText
			+ ", nodeType=" + nodeInfo.nodeType + ", nodeTextContent="
			+ nodeInfo.nodeTextContent + ", nodeTextValue=" + nodeInfo.nodeTextValue + "]");
	}
	
		
		
	/**
	 * Parse a date in "yyyy-mm-dd,HH:mm:ss:SSS" format, and return the ms.
	 * I will do it manually to avoid problems with implementation dependant functions
	 * new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
	 * 2013-07-05,09:25:53:970
	 */ 
	function parseDateToMs(input) {
		var parts = input.split(',');
		
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
		return new Date(date[0], date[1]-1, date[2], time[0],time[1],time[2],time[3]).getTime(); // Note: months are 0-based
	}
	
	///////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////END OF Auxiliary Functions/////////////////////////////
	
	
	////////////////////////////////////START OF NEW PAGE FUNCTION///////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	function NewPageForUserFunction(){
		
		//We'll keep a counter of visits for each page
		this.visitCounterPerPageHash = []; // New object
	}
	
	/**
	 * This function will check the position for the url given, to see if the given 
	 * Web page is in the list of visitedPages so far.
	 * If found, return visit counter.
	 * If not, add it to the list and return '1' as current visitCounter.
	 */ 
	NewPageForUserFunction.prototype.isNewPage = function(url){
		//Check if given url has been visited before
		if(this.visitCounterPerPageHash[url] === undefined){
			//if not, create new entry with visitCounter 1
			this.visitCounterPerPageHash[url] = 1;
			return 1;
		}
		//url has been visited before, return the INCREASED counter
		else{
			this.visitCounterPerPageHash[url] ++;
			return this.visitCounterPerPageHash[url];
		}
	}
	/////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////END OF NEW PAGE FUNCTION///////////////////////////////////
	


	////////////////////////////////////START OF PAGE DURATION FUNCTION///////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	function PageDurationFunction(){
		
		this.pageDurationHash = []; // New object
	}
	
	/**
	 * This function will check the position for the url given, to see if the given 
	 * Web page is in the list of visitedPages so far.
	 * If found, 
	 *   compare timestamp given with currentLast timestamp, if given is smaller, return given - first.
	 *   If given is bigger tahn currentLast, increase duration with the difference between currentLast and currentFirst, and update current values with given.
	 * If not, add it to the list
	 */ 
	PageDurationFunction.prototype.getDuration = function(url, firstTSUnparsed, lastTSUnparsed){

		var firstTS = parseDateToMs (firstTSUnparsed);
		var lastTS = parseDateToMs (lastTSUnparsed);
		//Check if given url has been visited before
		if(this.pageDurationHash[url] === undefined){
			//if not, create new entry with duration 0

			this.pageDurationHash[url] = {
				currentFirstTS : firstTS,
				currentLastTS : lastTS,
				totalDuration : 0
			};
			return 0;
		}
		//url has been visited before
		else{

			//Do I need to test for firstTS being smaller than currentFirst? That should never happen, they should come sorted.
			if (firstTS < this.pageDurationHash[url].currentLastTS){
				/*
				 * If firstTS was smaller than currentLast, that means there was some kind of overlapping.
				 * Update currentLast to given, and return the difference between given first and current
				 */
				this.pageDurationHash[url].currentLastTS = lastTS;
				return (firstTS - this.pageDurationHash[url].currentFirstTS);
			}
			//if first is bigger than current Last, these are non-overlapping episodes
			else{
				//update duration, change both startTS and endTS and return new duration
				this.pageDurationHash[url].totalDuration += (this.pageDurationHash[url].currentLastTS 
								- this.pageDurationHash[url].currentFirstTS);
				
				this.pageDurationHash[url].currentLastTS = lastTS;
				this.pageDurationHash[url].currentFirstTS = firstTS;
				return (this.pageDurationHash[url].totalDuration);
			}
			
		}
	}
	/////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////END OF NEW PAGE FUNCTION///////////////////////////////////
	




	//We will return a list of this object, which will be a list of sessionstarttime/newPage list 
	function UserEpisodeNewPage(sessionstartms, url, visitCounter, visitDuration, timestamp){
		this.sessionstartms = sessionstartms;
		this.url = url;
		this.visitCounter = visitCounter;
		this.visitDuration = visitDuration;
		this.timestamp = timestamp;
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////START OF FUNCTION//////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////
		
	var valuesArray = reduceOutput.virtualEpisodes;
	var userId = key.sid;

	valuesArraySorted = valuesArray.sort(compareParsedTS);
	valuesArraySorted.sort(compareParsedTS);
	
	///////////////////////New page calculation//////////////////////////////
	
	var newPageFunction = new NewPageForUserFunction();
	
	var pageDurationFunction = new PageDurationFunction();

	
	/*
	 * List of episodes checked so far, if it has been checked before, 
	 * there is no need to check it again, it has already been added to the list
	*/
	var checkedEpisodeList = [];
	
	//List of objects to be returned
	var userEpisodePageCounterList = [];
	
	var tempUrlEpisodeString = "";
	
	var debugLog = "";
	var previousTS=0;
	
	for(var i in valuesArraySorted)
	{
		valueObject = valuesArraySorted[i];
		
		if (parseDateToMs(valuesArraySorted[i].timestamp) < previousTS){
			debugLog += "array was not ordered:" + parseDateToMs(valuesArraySorted[i].timestamp) + " is smaller than " + previousTS + ";";
		}
		//debugLog +=parseDateToMs(valuesArraySorted[i].timestamp) +";";
		previousTS =  parseDateToMs(valuesArraySorted[i].timestamp);
		
		var pageVisitCounter = newPageFunction.isNewPage(valueObject.url);
		
		var pageVisitDuration = pageDurationFunction.getDuration(valueObject.url, valueObject.firstEvent.timestamp,
																	valueObject.lastEvent.timestamp)

		//checkedEpisodeList.push(tempUrlEpisodeString);
		userEpisodePageCounterList.push({
			sessionstartms : valueObject.sessionstartms,
			url : valueObject.url,
			visitCounter : pageVisitCounter,
			visitDuration : pageVisitDuration,
			firstTimestamp : valueObject.firstEvent.timestamp,
			lastTimestamp: valueObject.lastEvent.timestamp
		});
	}
			
	return{
		userEpisodePageCounterList:userEpisodePageCounterList,
		debugLog:debugLog
	}
		
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

