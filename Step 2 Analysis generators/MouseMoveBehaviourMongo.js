
//conn = new Mongo();
//db = conn.getDB("myDatabase");
//Additionally, you can use the connect() method to connect to the MongoDB instance. The following example connects to the MongoDB instance that is running on localhost with the non-default port 27020 and set the global db variable:

//////We need to load the constants file
load("../MapReduceConstants.js");

db = connectAndValidate();


print("Running MouseMoveBehaviour function at:" + datestamp());

//query to be used to filter out all IP addresses and unwanted data:
//"$nor" : { "sd" : "10006" , "$nor" : [ { "ip" : "130.88.193.26"} , { "ip" : "IP1"} , { "ip" : "IP2"}] , "sessionstartms" : { "$exists" : true}}


//list of events to be processed, this will speed up the query, as only the relevant events will be considered
var eventList = [mouseOverEvent,mouseMoveEvent];

var userList = db.activeUsers.distinct("sid",{"sd" : websiteId});



db.events.mapReduce(
	mapFunction,
	reduceFunction,
	{
		out: { replace: "mouseMoveBehaviour" },
		query: {
			"sd" : websiteId
			, "sid" : {$in: userList }
			, "ip": {$nin: bannedIPlist }
			, "event": { $in: eventList }
			,"sessionstartms" : { "$exists" : true}
			},
		//I add a scope with all the required variables.
		scope : scopeObject,
		finalize:finalizeFunction
		//,sort: {sid:1, url:1, urlSessionCounter:1}
	}
);

print("MouseMoveBehaviour function finished at:" + datestamp());

/**
 * This function filters out all unwanted events.
 * It gets executed for each object, and gives access to internal variables via "this".
 **/
function mapFunction () {

	//list of events that are relevant for the behaviour to be found
	//var eventArray = ["mousewheel"];//"scroll",mouseUpEvent,"keydown"];

	//we filter out the events we don't want to consider
	//if (eventArray.indexOf(this.event) > -1){
		/*
		 * "emit" function takes two arguments: 1) the key on which to group the data, 2) data itself to group. Both of them can be objects ({this.id, this.userId},{this.time, this.value}) for example
		 */
		//emit({sid:this.sid, sessionstartms:this.sessionstartms, url:this.url, urlSessionCounter:this.urlSessionCounter},
		emit({sid:this.sid, url:this.url, urlSessionCounter:this.urlSessionCounter},
				{ "episodeEvents":
					[
						{
							event:this.event,
							timestamp:this.timestamp,
							timestampms:this.timestampms,
							sid:this.sid,
							ip:this.ip,
							url:this.url,
							sessionstartms:this.sessionstartms,
							sessionstartparsed:this.sessionstartparsed,
							visitCounter:this.visitCounter,
							visitDuration:this.visitDuration,

							sdSessionCounter:this.sdSessionCounter,
							sdTimeSinceLastSession:this.sdTimeSinceLastSession,
							urlSessionCounter:this.urlSessionCounter,
							urlSinceLastSession:this.urlSinceLastSession,
							urlEpisodeLength:this.urlEpisodeLength,

							episodeUrlActivity: this.episodeUrlActivity,
							episodeSdActivity: this.episodeSdActivity,


							htmlSize : this.htmlSize,
							resolution : this.resolution,
							size : this.size,
							usableSize : this.usableSize,

							idleTime:this.idleTime,
							calculatedActiveTime:this.calculatedActiveTime,
							idleTimeSoFar:this.idleTimeSoFar,
							sdCalculatedActiveTime:this.sdCalculatedActiveTime,

							usertimezoneoffset:this.usertimezoneoffset,
							mouseCoordinates:this.mouseCoordinates,
							nodeInfo:this.nodeInfo,
							count:1
						}
					]
				}
			);
	//}
}



/**
 *
 * Aggregates different values for each given key. It will take each key, and all the values from Map step, and process them one by one.
 * It takes two parameters: 1) Key 2) array of values (number of values outputted from Map step)
 * Reduce function should just put values in the same list, as it doesn't have access to "all" data, only to a certain batch

 */
function reduceFunction (key, values) {
	var reduced = {"episodeEvents":[]};
		for (var i in values)
		{
			var inter = values[i];
			for (var j in inter.episodeEvents)
			{
				reduced.episodeEvents.push(inter.episodeEvents[j]);
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

	/**
	 * This function will "fix" the events, by overriding the given timestampms, which doesn't exist in some of them,
	 * with the result of parseDateToMs on the regular timestamp
	 */

	 function fixEventTS(event){
		event.timestampms = parseDateToMs(event.timestamp);
		return event;
	 }

	 /**
	 * Same as fixEventTS, but it will fix an entire array of events
	 */
	function fixEventArrayTS(eventArray){

		for(var i in eventArray)
		{
			eventArray[i].timestampms = parseDateToMs(eventArray[i].timestamp);
		}
		return eventArray;
	 }
 	/**
	 * This function just returns the median of a given array of numbers
	 */
	function median(values) {

	    values.sort( function(a,b) {return a - b;} );

	    var half = Math.floor(values.length/2);

	    if(values.length % 2)
	        return values[half];
	    else
	        return (values[half-1] + values[half]) / 2.0;
	}



	/**
	 * This function will just augmentate the object with the extra information I get from the
	 * eventObject
	 */

	 function addInfoToBehaviour(behaviourObject, eventObject){

		behaviourObject.timestamp = eventObject.timestamp;

		behaviourObject.timestampms = eventObject.timestampms;
		behaviourObject.sortingtimestampms = eventObject.timestampms;

		behaviourObject.sessionstartms = eventObject.sessionstartms;
		behaviourObject.sessionstartparsed = eventObject.sessionstartparsed;
		behaviourObject.visitCounter = eventObject.visitCounter;
		behaviourObject.visitDuration = eventObject.visitDuration;

		behaviourObject.sdSessionCounter = eventObject.sdSessionCounter;
		behaviourObject.sdTimeSinceLastSession = eventObject.sdTimeSinceLastSession;
		behaviourObject.urlSessionCounter = eventObject.urlSessionCounter;
		behaviourObject.urlSinceLastSession = eventObject.urlSinceLastSession;
		behaviourObject.urlEpisodeLength = eventObject.urlEpisodeLength;

		behaviourObject.htmlSize  = eventObject.htmlSize;
		behaviourObject.resolution  = eventObject.resolution;
		behaviourObject.size  = eventObject.size;
		behaviourObject.usableSize  = eventObject.usableSize;

		behaviourObject.idleTime = eventObject.idleTime;
		behaviourObject.calculatedActiveTime = eventObject.calculatedActiveTime;
		behaviourObject.idleTimeSoFar = eventObject.idleTimeSoFar;
		behaviourObject.sdCalculatedActiveTime = eventObject.sdCalculatedActiveTime;

		return behaviourObject
	 }
	///////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////END OF Auxiliary Functions/////////////////////////////

	//////////////////////////START OF MouseMoveBehaviour/////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * This behaviour will be a single behaviour per user and episode, that's why
	 * I don't need to add the usual "currentBehaviour" object
	 */
	function MouseMoveBehaviour(){

		this.totalDistance = 0;
		this.mouseOverCount = 0;
		this.mouseMoveCount = 0;
		this.startTimems = 0;
		this.endTimems = 0;
		this.lastCoordinateX = null;
		this.lastCoordinateY = null;

		this.incorrectMouseOverCount = 0;
		this.incorrectMouseMoveCount = 0;

		this.mouseMoveTimeList =[];

	}

	//We call this function when either mousedown or mouseup are found.
	MouseMoveBehaviour.prototype.processEvent = function(currentEvent, pageSize) {

		//If mousemove or over, process the coordinates
		if (currentEvent.event==mouseOverEvent || currentEvent.event==mouseMoveEvent){

			//is this the first coordinate obtained?
			if (this.lastCoordinateX == null){

				if (currentEvent.mouseCoordinates==null){
					if (currentEvent.event==mouseOverEvent)
						this.incorrectMouseOverCount ++;
					else if (currentEvent.event==mouseMoveEvent)
						this.incorrectMouseMoveCount ++;
				}
				else{
					this.lastCoordinateX = currentEvent.mouseCoordinates.coordX;
					this.lastCoordinateY = currentEvent.mouseCoordinates.coordY;

					this.startTimems = currentEvent.timestampms;
				}
			}
			else{
				if (currentEvent.mouseCoordinates==null){
					if (currentEvent.event==mouseOverEvent)
						this.incorrectMouseOverCount ++;
					else if (currentEvent.event==mouseMoveEvent)
						this.incorrectMouseMoveCount ++;
				}
				else{
					var xCoordDiff = Math.pow(currentEvent.mouseCoordinates.coordX - this.lastCoordinateX,2)
					var yCoordDiff = Math.pow(currentEvent.mouseCoordinates.coordY - this.lastCoordinateY,2)

					var newDistance = Math.sqrt(xCoordDiff + yCoordDiff);
					this.totalDistance += newDistance;
				}
			}

			//Count the current event
			if (currentEvent.event==mouseOverEvent)
				this.mouseOverCount ++;

			else if (currentEvent.event==mouseMoveEvent)
				this.mouseMoveCount ++;

			this.endTime = currentEvent.timestamp;
			this.endTimems = currentEvent.timestampms;

			this.mouseMoveTimeList.push(currentEvent.timestampms);


		}

	}
	/**
	 * We really don't need to do anything in this function, but I will leave it for consistency
	 */
	MouseMoveBehaviour.prototype.endBehaviour = function(currentEvent) {

	}

	MouseMoveBehaviour.prototype.outputResult = function()
	{

		return this;
	}

	///////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////END OF MouseMoveBehaviour/////////////////////////////


	////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////START OF FUNCTION//////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////
		var valuesArray = reduceOutput.episodeEvents;

		valuesArray = fixEventArrayTS(valuesArray);


		valuesArraySorted = valuesArray.sort(compare);
		valuesArraySorted.sort(compare);


		var debugLog = "";

		//general statistics and error control, such as number of events processed, and correct sorting test
		var generalStatistics = new Object();
			generalStatistics.count = 0;
			generalStatistics.isArrayOrdered = 0;
			generalStatistics.previousvalueObject = 0;
			generalStatistics.timeDifference = 0;
			generalStatistics.valuesBiggerThanPrevious = 0;
			generalStatistics.valuesSmallerThanPrevious = 0;

		//general variables for generalstatistics per episode
		var mouseStatistics = new Object();

		//We add what urlSession this object refers to. Depending on the mapReduce emit function, sdSession OR urlSession will remain the same.
		mouseStatistics.sdSessionCounter = 0;
		mouseStatistics.sdTimeSinceLastSession = 0;
		mouseStatistics.urlSessionCounter = 0;
		mouseStatistics.urlSinceLastSession = 0;
		mouseStatistics.calculatedActiveTimeMedian = 0;
		mouseStatistics.sessionstartmsMedian = 0;
		mouseStatistics.sdCalculatedActiveTimeMedian = 0;
		mouseStatistics.urlEpisodeLength = 0;

		var calculatedActiveTimeList = [];
		var sessionstartmsList = [];

		var sdCalculatedActiveTimeList = [];

		//Behaviour Objects
		var mouseMoveBehaviour = new MouseMoveBehaviour();

		/////////////HTML SIZE variables
		var pageSize = new Object();
			pageSize.htmlSize = "";
			pageSize.resolution = "";
			pageSize.size = "";
			pageSize.usableSize = "";
			pageSize.isPageSizeEstimated = "";
		var resizeEvent = "resize";
		var loadEvent = "load";


		for(var i in valuesArraySorted)
		{
			valueObject = valuesArraySorted[i];

			//Overwrite the timestampms with the parseDateToMs(regularTimestamp)
			//valueObject = fixEventTS(valueObject);

			generalStatistics.count++;

			/////////////CODE TO OBTAIN THE HTML SIZE!////////////
/*
			if (valueObject.event == loadEvent || valueObject.event == resizeEvent){
				pageSize.htmlSize = valueObject.htmlSize;
				pageSize.resolution = valueObject.resolution;
				pageSize.size = valueObject.size;
				pageSize.usableSize = valueObject.usableSize;
				pageSize.isPageSizeEstimated = false;
			}

			//if we don't have an htmlsize yet, loop until you find the first next one
			if (pageSize.htmlSize == ""){
				var j = i;

				while (pageSize.htmlSize == "" && j < valuesArraySorted.length){
					if (valuesArraySorted[i].event == loadEvent || valuesArraySorted[i].event == resizeEvent){
						pageSize.htmlSize = valueObject.htmlSize;
						pageSize.resolution = valueObject.resolution;
						pageSize.size = valueObject.size;
						pageSize.usableSize = valueObject.usableSize;
						pageSize.isPageSizeEstimated = true;
					}
					j++;
				}
			}
	*/
			/////////////END OF CODE TO OBTAIN THE HTML SIZE!////////////

			mouseMoveBehaviour.processEvent(valueObject, pageSize);


			//We add what urlSession this object refers to. Depending on the mapReduce emit function, sdSession OR urlSession will remain the same.
			if (mouseStatistics.sdSessionCounter == 0){
				mouseStatistics.sdSessionCounter = valueObject.sdSessionCounter;
				mouseStatistics.sdTimeSinceLastSession = valueObject.sdTimeSinceLastSession;
				mouseStatistics.urlSessionCounter = valueObject.urlSessionCounter;
				mouseStatistics.urlSinceLastSession = valueObject.urlSinceLastSession;
				mouseStatistics.urlEpisodeLength = valueObject.urlEpisodeLength;
				mouseStatistics.episodeUrlActivity = valueObject.episodeUrlActivity;
				mouseStatistics.episodeSdActivity = valueObject.episodeSdActivity;
			}
			else{
				//If any of them is different, store -1 (this will always happen with at least one of them
				if (mouseStatistics.sdSessionCounter != valueObject.sdSessionCounter) {mouseStatistics.sdSessionCounter=-1;}
				if (mouseStatistics.sdTimeSinceLastSession != valueObject.sdTimeSinceLastSession) {mouseStatistics.sdTimeSinceLastSession=-1;}
				if (mouseStatistics.urlSessionCounter != valueObject.urlSessionCounter) {mouseStatistics.urlSessionCounter=-1;}
				if (mouseStatistics.urlSinceLastSession != valueObject.urlSinceLastSession) {mouseStatistics.urlSinceLastSession=-1;}
				if (mouseStatistics.episodeUrlActivity != valueObject.episodeUrlActivity) {mouseStatistics.episodeUrlActivity=-1;}
				if (mouseStatistics.episodeSdActivity != valueObject.episodeSdActivity) {mouseStatistics.episodeSdActivity=-1;}
			}

			//Getting the episode timestamp and active time medians
			if (incorrectActTimeEvents.indexOf(valueObject.event) < 0){
				calculatedActiveTimeList.push(parseInt(valueObject.calculatedActiveTime));
				mouseStatistics.calculatedActiveTimeMedian = median(calculatedActiveTimeList);

				sessionstartmsList.push(parseInt(valueObject.sessionstartms));
				mouseStatistics.sessionstartmsMedian = median(sessionstartmsList);

				sdCalculatedActiveTimeList.push(parseInt(valueObject.sdCalculatedActiveTime));
				mouseStatistics.sdCalculatedActiveTimeMedian = median(sdCalculatedActiveTimeList);

			}

			/***
			 * SORTING TEST
			 */
			//if it's not the first element
			if (generalStatistics.previousvalueObject!=0){
				//previous object's timestamp should be smaller that current's

				var previousTimeNumber = Number(generalStatistics.previousvalueObject.timestampms);
				var currentTimeNumber = Number(valueObject.timestampms);

				if (previousTimeNumber > currentTimeNumber){
					generalStatistics.isArrayOrdered = -1;
					//timeDifference +="##" + previousTimeNumber +" is BIGGER than " + currentTimeNumber+"##";
					generalStatistics.valuesBiggerThanPrevious++;
				}
				else{
					//timeDifference += "##" + previousTimeNumber+" is SMALLER than " + currentTimeNumber+"##";
					//timeDifference += valueObject+",";
					generalStatistics.valuesSmallerThanPrevious++;
					generalStatistics.timeDifference += currentTimeNumber-previousTimeNumber;
				}
			}
			generalStatistics.previousvalueObject = valueObject;
		}

		//debugLog +=

		mouseMoveBehaviour.endBehaviour();


		return{
			generalStatistics:generalStatistics,
			mouseStatistics:mouseStatistics,

			mouseMoveBehaviour:mouseMoveBehaviour.outputResult(),

			episodeStartms : fixEventTS(valuesArraySorted[0]).timestampms,
			episodeEndms : fixEventTS(valuesArraySorted[valuesArraySorted.length-1]).timestampms,

			episodeDurationms: Number(fixEventTS(valuesArraySorted[valuesArraySorted.length-1]).timestampms)- Number(fixEventTS(valuesArraySorted[0]).timestampms),

			eventsInEpisodeCounter : valuesArraySorted.length,

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
