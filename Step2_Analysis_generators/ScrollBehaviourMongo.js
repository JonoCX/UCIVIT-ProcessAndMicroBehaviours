
//conn = new Mongo();
//db = conn.getDB("myDatabase");
//Additionally, youluesList.concat(currentEvent.delta can use the connect() method to connect to the MongoDB instance. The following example connects to the MongoDB instance that is running on localhost with the non-default port 27020 and set the global db variable:

//////We need to load the constants file
load("../MapReduceConstants.js");

db = connectAndValidate();


print("Running ScrollBehaviourMongo function at:" + datestamp());

//query to be used to filter out all IP addresses and unwanted data:
//"$nor" : { "sd" : "10006" , "$nor" : [ { "ip" : "130.88.193.26"} , { "ip" : "IP1"} , { "ip" : "IP2"}] , "sessionstartms" : { "$exists" : true}}

//list of events to be processed, this will speed up the query, as only the relevant events will be considered
var eventList = [mouseWheelEvent,loadEvent,resizeEvent];
var userList = db.activeUsers.distinct("sid",{"sd" : websiteId});

db.events.mapReduce(
	mapFunction,
	reduceFunction,
	{
		out: { replace: "scrollBehaviour" },
		query: {
			"sd" : websiteId
			, "sid" : {$in: userList }
			//,"$nor" :  bannedIPlist
			, "ip": {$nin: bannedIPlist }
			, "delta": {$exists: true}
			, "event": { $in: eventList }
			,"sessionstartms" : { "$exists" : true}
			},
		//I add a scope with all the required variables.
		scope : scopeObject,
		finalize:finalizeFunction
	}
);

print("ScrollBehaviourMongo function finished at:" + datestamp());

/**
 * This function filters out all unwanted events.
 * It gets executed for each object, and gives access to internal variables via "this".
 **/
function mapFunction () {

	//list of events that are relevant for the behaviour to be found
	//var eventArray = ["mousewheel"];//"scroll","mouseup","keydown"];

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
							sid:this.sid,
							event:this.event,
							timestamp:this.timestamp,
							timestampms:this.timestampms,
							ip:this.ip,
							url:this.url,
							delta: this.delta,
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
							count:1
						}
					]
				}
			);
	//}
};



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
};

/**
 * This function is called at the end, with the reduced values for each "key" object.
 * This is the function that has access to ALL data, and this is the step in which events can be ordered and processed
 */
function finalizeFunction (key, reduceOutput) {

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
	//////////////////////////START OF ControlledBehaviourAnalysis/////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////

	function ControlledBehaviourAnalysis(){

		//static threshold defining variables
		// maximum time between the scrolls in ms
		this.betweenMousewheelThreshold = 6000;//2000;//10000;

		//This will be a list containing all the behaviours.
		this.controlledBehaviourList =[];
		//previous occurrence of a mousewheel event
		this.previousMousewheel = null;

		this.currentbehaviour = null;
	}

	ControlledBehaviourAnalysis.prototype.startBehaviour = function(currentEvent,pageSize) {

		//this.currentbehaviour.userId = currentEvent.sid;
		//this.currentbehaviour.webAppId = currentEvent.sd;
		this.currentbehaviour = new Object();
		this.currentbehaviour.sid = currentEvent.sid;
		this.currentbehaviour.behaviour = "controlledScroll";

		if (currentEvent.hasOwnProperty("url"))
			this.currentbehaviour.url = currentEvent.url;

		this.currentbehaviour = addInfoToBehaviour(this.currentbehaviour,currentEvent);

		this.currentbehaviour.numberOfMousewheels = 1;

		//I used this workaround because at some point JavaScript started considering this variable as a String
	/*	if (parseFloat(currentEvent.delta)=="NaN"){
			this.currentbehaviour.totalDelta = 0;
		}
		else{*/
		this.currentbehaviour.totalDelta = parseFloat(currentEvent.delta);

		this.currentbehaviour.totalDeltaAbs = Math.abs(currentEvent.delta);

		this.currentbehaviour.firstMousewheelTime = currentEvent.timestamp;
		this.currentbehaviour.firstMousewheelTimems = currentEvent.timestampms;
		this.currentbehaviour.lastMousewheelTime = currentEvent.timestamp;
		this.currentbehaviour.lastMousewheelTimems = currentEvent.timestampms;

		this.currentbehaviour.pageSize = currentEvent.pageSize;

	//	this.currentbehaviour.lastScrollTimems = currentEvent.timestampms;

		//this.currentbehaviour.nodeInfoList = "";

		//we need to define pos/neg deltas beforehand, so there is something to add values to.
		this.currentbehaviour.positiveDelta = 0;
		this.currentbehaviour.negativeDelta = 0;

		// we increase positive or delta values
		// accordingly
		if (parseFloat(currentEvent.delta) > 0)
			this.currentbehaviour.positiveDelta += parseFloat(currentEvent.delta);
		else
			this.currentbehaviour.negativeDelta += parseFloat(currentEvent.delta);

		// we start the first element of the list
		this.currentbehaviour.mousewheelList = "[(0," + currentEvent.delta + ")";

		this.previousMousewheel = currentEvent;

		/*
		 * NOT AVAILABLE AT THE MOMENT
		 * We will store the list of nodes, in case they change over time
		 */
		//this.nodeInfoList += event.getNodeInfo().getNodeDom();
	}

	ControlledBehaviourAnalysis.prototype.processMousewheel = function(currentEvent,pageSize) {
		//if this is the first mousewheel we find
		if (this.previousMousewheel==null){
			this.startBehaviour(currentEvent,pageSize);
			return ("##PROCESS: new Behvaiour started");
		}
		/*
		 * if not, compare timestamps, if it's within the defined time, add it to the behaviour and update the previousMousewheel with currentEvent
		 */
		else if ((currentEvent.timestampms - this.previousMousewheel.timestampms) < this.betweenMousewheelThreshold){
				// we increase positive or delta values
				// accordingly
				if (parseFloat(currentEvent.delta) > 0)
					this.currentbehaviour.positiveDelta += parseFloat(currentEvent.delta);
				else
					this.currentbehaviour.negativeDelta += parseFloat(currentEvent.delta);

				this.currentbehaviour.numberOfMousewheels++;

				this.currentbehaviour.totalDelta +=  parseFloat(currentEvent.delta);
				this.currentbehaviour.totalDeltaAbs += Math.abs(currentEvent.delta);

				// we add the scroll to the list
				var timedifference = currentEvent.timestampms - this.currentbehaviour.lastMousewheelTimems;

				this.currentbehaviour.mousewheelList += ",(" + (currentEvent.timestampms - this.currentbehaviour.lastMousewheelTimems) + "," + currentEvent.delta + ")";

				this.currentbehaviour.lastMousewheelTime = currentEvent.timestamp;
				this.currentbehaviour.lastMousewheelTimems = currentEvent.timestampms;

				if (currentEvent.hasOwnProperty("url"))
					this.currentbehaviour.url = currentEvent.url;

				this.previousMousewheel = currentEvent;

				return ("##PROCESS: mousewheel within previous one found");

				/*
				 * NOT AVAILABLE AT THE MOMENT
				 * We will store the list of nodes, in case they change over time
				 */
				//this.currentbehaviour.nodeInfoList += currentEvent.getNodeInfo().getNodeDom() + ",";
		}
		//if they are too far away, we need to finish current behaviour and start a new one
		else{

			this.endBehaviour();
			this.startBehaviour(currentEvent);
			return ("##PROCESS: mousewheel too far away:"+currentEvent.timestampms +" was too far from" + this.previousMousewheel.timestampms
			 + " with threshold=" + this.betweenMousewheelThreshold);
		}
	}

	ControlledBehaviourAnalysis.prototype.endBehaviour = function(currentEvent) {
		if ((this.currentbehaviour.lastMousewheelTimems
				- this.currentbehaviour.firstMousewheelTimems) != 0) {
			this.currentbehaviour.speed = (this.currentbehaviour.totalDelta * 1000)
					/ (this.currentbehaviour.lastMousewheelTimems - this.currentbehaviour.firstMousewheelTimems);

			this.currentbehaviour.speedAbs = (this.currentbehaviour.totalDeltaAbs * 1000)
					/ (this.currentbehaviour.lastMousewheelTimems - this.currentbehaviour.firstMousewheelTimems);
			this.currentbehaviour.duration = (this.currentbehaviour.lastMousewheelTimems - this.currentbehaviour.firstMousewheelTimems);

			// end the scrolls list
			this.currentbehaviour.mousewheelList += "]";

			//add the behaviour to the final list of behaviours
			this.controlledBehaviourList.push(this.currentbehaviour);

			return ("##END: new behaviour stored");


		} else {
			this.previousMousewheel = null;
			return ("##END: behaviour discarded");
		}
	}

	ControlledBehaviourAnalysis.prototype.outputResult = function() {
		//return ("##OUTPUT: outputting " + this.controlledBehaviourList.length +" elements");

		return this.controlledBehaviourList;
	}

	ControlledBehaviourAnalysis.prototype.outputSummary = function() {
		this.currentbehaviour = new Object();
		if (this.controlledBehaviourList.length > 0){

			// I need to create averages of all the metrics available for each behaviour occurrence
			this.currentbehaviour.sid = this.controlledBehaviourList[0].sid;

			this.currentbehaviour.url = this.controlledBehaviourList[0].url;
			this.currentbehaviour.sessionstartms = this.controlledBehaviourList[0].sessionstartms;

			this.currentbehaviour.firstMousewheelTime = this.controlledBehaviourList[0].firstMousewheelTime;
			this.currentbehaviour.firstMousewheelTimems = this.controlledBehaviourList[0].firstMousewheelTimems;
			this.currentbehaviour.lastMousewheelTime = this.controlledBehaviourList[this.controlledBehaviourList.length-1].lastMousewheelTime;
			this.currentbehaviour.lastMousewheelTimems = this.controlledBehaviourList[this.controlledBehaviourList.length-1].lastMousewheelTimems;

			this.currentbehaviour.visitCounter = 0;
			this.currentbehaviour.visitDuration = 0;

			this.currentbehaviour.idleTime = 0;
			this.currentbehaviour.calculatedActiveTime = 0;
			this.currentbehaviour.idleTimeSoFar = 0;

			this.currentbehaviour.positiveDelta = 0;
			this.currentbehaviour.negativeDelta = 0;
			this.currentbehaviour.numberOfMousewheels = 0;
			this.currentbehaviour.totalDelta = 0;
			this.currentbehaviour.totalDeltaAbs = 0;
			this.currentbehaviour.speed = 0;
			this.currentbehaviour.speedAbs = 0;
			this.currentbehaviour.duration = 0;

			//Looping through all elements to add them
			for (var i = 0; i < this.controlledBehaviourList.length; i++){
				this.currentbehaviour.visitCounter += this.controlledBehaviourList[i].visitCounter;
				this.currentbehaviour.visitDuration += this.controlledBehaviourList[i].visitDuration;

				this.currentbehaviour.idleTime += this.controlledBehaviourList[i].idleTime;
				this.currentbehaviour.calculatedActiveTime += this.controlledBehaviourList[i].calculatedActiveTime;
				this.currentbehaviour.idleTimeSoFar += this.controlledBehaviourList[i].idleTimeSoFar;

				this.currentbehaviour.positiveDelta += this.controlledBehaviourList[i].positiveDelta;
				this.currentbehaviour.negativeDelta += this.controlledBehaviourList[i].negativeDelta;
				this.currentbehaviour.numberOfMousewheels += this.controlledBehaviourList[i].numberOfMousewheels;
				this.currentbehaviour.totalDelta += this.controlledBehaviourList[i].totalDelta;
				this.currentbehaviour.totalDeltaAbs += this.controlledBehaviourList[i].totalDeltaAbs;
				this.currentbehaviour.speed += this.controlledBehaviourList[i].speed;
				this.currentbehaviour.speedAbs += this.controlledBehaviourList[i].speedAbs;
				this.currentbehaviour.duration += this.controlledBehaviourList[i].duration;
			}

			//Dividing all of them to get the average
			this.currentbehaviour.visitCounter /= this.controlledBehaviourList.length;
			this.currentbehaviour.visitDuration /= this.controlledBehaviourList.length;

			this.currentbehaviour.idleTime /= this.controlledBehaviourList.length;
			this.currentbehaviour.calculatedActiveTime /= this.controlledBehaviourList.length;
			this.currentbehaviour.idleTimeSoFar /= this.controlledBehaviourList.length;

			this.currentbehaviour.positiveDelta /= this.controlledBehaviourList.length;
			this.currentbehaviour.negativeDelta /= this.controlledBehaviourList.length;
			this.currentbehaviour.numberOfMousewheels /= this.controlledBehaviourList.length;
			this.currentbehaviour.totalDelta /= this.controlledBehaviourList.length;
			this.currentbehaviour.totalDeltaAbs /= this.controlledBehaviourList.length;
			this.currentbehaviour.speed /= this.controlledBehaviourList.length;
			this.currentbehaviour.speedAbs /= this.controlledBehaviourList.length;
			this.currentbehaviour.duration /= this.controlledBehaviourList.length;

			return this.currentbehaviour;
		}
		else
			return {};
	}
	///////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////END OF ControlledBehaviourAnalysis/////////////////////////////


	//////////////////////////START OF FastMouseScrollCycle/////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////
	function FastMouseScrollCycle(){

		//static threshold defining variables
		// maximum time between the scrolls in ms
		this.betweenMousewheelThreshold = 2000;

		this.totalScrollDistance = 7;
		this.endingScrollResult = 3;

		//This will be a list containing all the behaviours.
		this.fastMouseCycleBehaviourList =[];
		//previous occurrence of a mousewheel event
		this.previousMousewheel = null;

		this.currentbehaviour = null;
	}

	FastMouseScrollCycle.prototype.startBehaviour = function(currentEvent) {

		//this.currentbehaviour.userId = currentEvent.sid;
		//this.currentbehaviour.webAppId = currentEvent.sd;
		this.currentbehaviour = new Object();

		this.currentbehaviour.sid = currentEvent.sid;
		this.currentbehaviour.behaviour = "fastMouseScrollCycle";

		if (currentEvent.hasOwnProperty("url"))
			this.currentbehaviour.url = currentEvent.url;

		this.currentbehaviour.sessionstartms = currentEvent.sessionstartms;

		this.currentbehaviour.numberOfMousewheels = 1;

		this.currentbehaviour.totalDelta = parseFloat(currentEvent.delta);
		this.currentbehaviour.totalDeltaAbs = Math.abs(currentEvent.delta);

		this.currentbehaviour.firstMousewheelTime = currentEvent.timestamp;
		this.currentbehaviour.firstMousewheelTimems = currentEvent.timestampms;
		this.currentbehaviour.lastMousewheelTime = currentEvent.timestamp;
		this.currentbehaviour.lastMousewheelTimems = currentEvent.timestampms;

		this.currentbehaviour = addInfoToBehaviour(this.currentbehaviour,currentEvent);

		this.currentbehaviour.pageSize = currentEvent.pageSize;


		//we need to define pos/neg deltas beforehand, so there is something to add values to.
		this.currentbehaviour.positiveDelta = 0;
		this.currentbehaviour.negativeDelta = 0;

		// we increase positive or delta values
		// accordingly
		if (parseFloat(currentEvent.delta) > 0)
			this.currentbehaviour.positiveDelta += parseFloat(currentEvent.delta);
		else
			this.currentbehaviour.negativeDelta += parseFloat(currentEvent.delta);

		// we start the first element of the list
		this.currentbehaviour.mousewheelList = "[(0," + currentEvent.delta + ")";

		this.previousMousewheel = currentEvent;
	}

	FastMouseScrollCycle.prototype.processMousewheel = function(currentEvent,pageSize) {
		//if this is the first mousewheel we find
		if (this.previousMousewheel==null){
			this.startBehaviour(currentEvent,pageSize);
			return ("##PROCESS: new Behvaiour started");
		}
		/*
		 * if not, compare timestamps, if it's within the defined time, add it to the behaviour and update the previousMousewheel with currentEvent
		 */
		else if ((currentEvent.timestampms - this.previousMousewheel.timestampms) < this.betweenMousewheelThreshold){
				// we increase positive or delta values
				// accordingly
				if (parseFloat(currentEvent.delta) > 0)
					this.currentbehaviour.positiveDelta += parseFloat(currentEvent.delta);
				else
					this.currentbehaviour.negativeDelta += parseFloat(currentEvent.delta);

				this.currentbehaviour.numberOfMousewheels++;

				this.currentbehaviour.totalDelta +=  parseFloat(currentEvent.delta);
				this.currentbehaviour.totalDeltaAbs += Math.abs( currentEvent.delta);

				// we add the scroll to the list
				var timedifference = currentEvent.timestampms - this.currentbehaviour.lastMousewheelTimems;

				this.currentbehaviour.mousewheelList += ",(" + (currentEvent.timestampms - this.currentbehaviour.lastMousewheelTimems) + "," + currentEvent.delta + ")";

				this.currentbehaviour.lastMousewheelTime = currentEvent.timestamp;
				this.currentbehaviour.lastMousewheelTimems = currentEvent.timestampms;

				if (currentEvent.hasOwnProperty("url"))
					this.currentbehaviour.url = currentEvent.url;

				this.previousMousewheel = currentEvent;

				return ("##PROCESS: mousewheel within previous one found");
		}
		//if they are too far away, we need to finish current behaviour and start a new one
		else{

			this.endBehaviour();
			this.startBehaviour(currentEvent);
			return ("##PROCESS: mousewheel too far away:"+currentEvent.timestampms +" was too far from" + this.previousMousewheel.timestampms
			 + " with threshold=" + this.betweenMousewheelThreshold);
		}
	}

	FastMouseScrollCycle.prototype.endBehaviour = function(currentEvent) {

		if ((Math.abs(this.currentbehaviour.positiveDelta)
					+ Math.abs(this.currentbehaviour.negativeDelta) > this.totalScrollDistance)
				&& Math.abs((Math.abs(this.currentbehaviour.negativeDelta)
					- Math.abs(this.currentbehaviour.positiveDelta))) < this.endingScrollResult) {

			this.currentbehaviour.speed = (this.currentbehaviour.totalDelta * 1000)
					/ (this.currentbehaviour.lastMousewheelTimems - this.currentbehaviour.firstMousewheelTimems);

			this.currentbehaviour.speedAbs = (this.currentbehaviour.totalDeltaAbs * 1000)
					/ (this.currentbehaviour.lastMousewheelTimems - this.currentbehaviour.firstMousewheelTimems);
			this.currentbehaviour.duration = (this.currentbehaviour.lastMousewheelTimems - this.currentbehaviour.firstMousewheelTimems);

			// end the scrolls list
			this.currentbehaviour.mousewheelList += "]";

			//add the behaviour to the final list of behaviours
			this.fastMouseCycleBehaviourList.push(this.currentbehaviour);

			return ("##END: new behaviour stored");

		} else {
			this.previousMousewheel = null;
			return ("##END: behaviour discarded");
		}
	}

	FastMouseScrollCycle.prototype.outputResult = function() {
		//return ("##OUTPUT: outputting " + this.controlledBehaviourList.length +" elements");

		return this.fastMouseCycleBehaviourList;
	}

	FastMouseScrollCycle.prototype.outputSummary = function() {
		this.currentbehaviour = new Object();

		if (this.fastMouseCycleBehaviourList.length > 0){

			// I need to create averages of all the metrics available for each behaviour occurrence
			this.currentbehaviour.sid = this.fastMouseCycleBehaviourList[0].sid;

			this.currentbehaviour.url = this.fastMouseCycleBehaviourList[0].url;
			this.currentbehaviour.sessionstartms = this.fastMouseCycleBehaviourList[0].sessionstartms;

			this.currentbehaviour.firstMousewheelTime = this.fastMouseCycleBehaviourList[0].firstMousewheelTime;
			this.currentbehaviour.firstMousewheelTimems = this.fastMouseCycleBehaviourList[0].firstMousewheelTimems;
			this.currentbehaviour.lastMousewheelTime = this.fastMouseCycleBehaviourList[this.fastMouseCycleBehaviourList.length-1].lastMousewheelTime;
			this.currentbehaviour.lastMousewheelTimems = this.fastMouseCycleBehaviourList[this.fastMouseCycleBehaviourList.length-1].lastMousewheelTimems;

			this.currentbehaviour.visitCounter = 0;
			this.currentbehaviour.visitDuration = 0;

			this.currentbehaviour.idleTime = 0;
			this.currentbehaviour.calculatedActiveTime = 0;
			this.currentbehaviour.idleTimeSoFar = 0;

			this.currentbehaviour.positiveDelta = 0;
			this.currentbehaviour.negativeDelta = 0;
			this.currentbehaviour.numberOfMousewheels = 0;
			this.currentbehaviour.totalDelta = 0;
			this.currentbehaviour.totalDeltaAbs = 0;
			this.currentbehaviour.speed = 0;
			this.currentbehaviour.speedAbs = 0;
			this.currentbehaviour.duration = 0;

			//Looping through all elements to add them
			for (var i = 0; i < this.fastMouseCycleBehaviourList.length; i++){
				this.currentbehaviour.visitCounter += this.fastMouseCycleBehaviourList[i].visitCounter;
				this.currentbehaviour.visitDuration += this.fastMouseCycleBehaviourList[i].visitDuration;

				this.currentbehaviour.idleTime += this.fastMouseCycleBehaviourList[i].idleTime;
				this.currentbehaviour.calculatedActiveTime += this.fastMouseCycleBehaviourList[i].calculatedActiveTime;
				this.currentbehaviour.idleTimeSoFar += this.fastMouseCycleBehaviourList[i].idleTimeSoFar;

				this.currentbehaviour.positiveDelta += this.fastMouseCycleBehaviourList[i].positiveDelta
				this.currentbehaviour.negativeDelta += this.fastMouseCycleBehaviourList[i].negativeDelta
				this.currentbehaviour.numberOfMousewheels += this.fastMouseCycleBehaviourList[i].numberOfMousewheels
				this.currentbehaviour.totalDelta += this.fastMouseCycleBehaviourList[i].totalDelta
				this.currentbehaviour.totalDeltaAbs += this.fastMouseCycleBehaviourList[i].totalDeltaAbs
				this.currentbehaviour.speed += this.fastMouseCycleBehaviourList[i].speed
				this.currentbehaviour.speedAbs += this.fastMouseCycleBehaviourList[i].speedAbs
				this.currentbehaviour.duration += this.fastMouseCycleBehaviourList[i].duration
			}

			//Dividing all of them to get the average
			this.currentbehaviour.visitCounter /= this.fastMouseCycleBehaviourList.length;
			this.currentbehaviour.visitDuration /= this.fastMouseCycleBehaviourList.length;

			this.currentbehaviour.idleTime /= this.fastMouseCycleBehaviourList.length;
			this.currentbehaviour.calculatedActiveTime /= this.fastMouseCycleBehaviourList.length;
			this.currentbehaviour.idleTimeSoFar /= this.fastMouseCycleBehaviourList.length;

			this.currentbehaviour.positiveDelta /= this.fastMouseCycleBehaviourList.length;
			this.currentbehaviour.negativeDelta /= this.fastMouseCycleBehaviourList.length;
			this.currentbehaviour.numberOfMousewheels /= this.fastMouseCycleBehaviourList.length;
			this.currentbehaviour.totalDelta /= this.fastMouseCycleBehaviourList.length;
			this.currentbehaviour.totalDeltaAbs /= this.fastMouseCycleBehaviourList.length;
			this.currentbehaviour.speed /= this.fastMouseCycleBehaviourList.length;
			this.currentbehaviour.speedAbs /= this.fastMouseCycleBehaviourList.length;
			this.currentbehaviour.duration /= this.fastMouseCycleBehaviourList.length;

			return this.currentbehaviour;
		}
		else
			return {};
	}
	///////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////END OF FastMouseScrollCycle/////////////////////////////




	//////////////////////////START OF FastSingleDirectionMouseScroll/////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////
	function FastSingleDirectionMouseScroll(){

		//static threshold defining variables
		// maximum time between the scrolls in ms
		this.betweenMousewheelThreshold = 2000;

		this.totalScrollDistance = 5;
		this.endingScrollResult = 2;

		//This will be a list containing all the behaviours.
		this.fastSingleDirectionScrollBehaviourList =[];
		//previous occurrence of a mousewheel event
		this.previousMousewheel = null;

		this.currentbehaviour = null;
	}

	FastSingleDirectionMouseScroll.prototype.startBehaviour = function(currentEvent) {

		//this.currentbehaviour.userId = currentEvent.sid;
		//this.currentbehaviour.webAppId = currentEvent.sd;
		this.currentbehaviour = new Object();

		this.currentbehaviour.sid = currentEvent.sid;
		this.currentbehaviour.behaviour = "fastSingleDirectionMouseScroll";

		if (currentEvent.hasOwnProperty("url"))
			this.currentbehaviour.url = currentEvent.url;

		this.currentbehaviour.sessionstartms = currentEvent.sessionstartms;

		this.currentbehaviour.numberOfMousewheels = 1;

		this.currentbehaviour.totalDelta = parseFloat(currentEvent.delta);
		this.currentbehaviour.totalDeltaAbs = Math.abs(currentEvent.delta);

		this.currentbehaviour.firstMousewheelTime = currentEvent.timestamp;
		this.currentbehaviour.firstMousewheelTimems = currentEvent.timestampms;
		this.currentbehaviour.lastMousewheelTime = currentEvent.timestamp;
		this.currentbehaviour.lastMousewheelTimems = currentEvent.timestampms;

		this.currentbehaviour.sortingtimestampms = currentEvent.timestampms;
		this.currentbehaviour.visitCounter = currentEvent.visitCounter;
		this.currentbehaviour.visitDuration = currentEvent.visitDuration;

		this.currentbehaviour.idleTime = currentEvent.idleTime;
		this.currentbehaviour.calculatedActiveTime = currentEvent.calculatedActiveTime;
		this.currentbehaviour.idleTimeSoFar = currentEvent.idleTimeSoFar;

		this.currentbehaviour.sdSessionCounter = currentEvent.sdSessionCounter;
		this.currentbehaviour.sdTimeSinceLastSession = currentEvent.sdTimeSinceLastSession;
		this.currentbehaviour.urlSessionCounter = currentEvent.urlSessionCounter;
		this.currentbehaviour.urlSinceLastSession = currentEvent.urlSinceLastSession;
		this.currentbehaviour.pageSize = currentEvent.pageSize;


		//we need to define pos/neg deltas beforehand, so there is something to add values to.
		this.currentbehaviour.positiveDelta = 0;
		this.currentbehaviour.negativeDelta = 0;

		// we increase positive or delta values
		// accordingly
		if (parseFloat(currentEvent.delta) > 0)
			this.currentbehaviour.positiveDelta += parseFloat(currentEvent.delta);
		else
			this.currentbehaviour.negativeDelta += parseFloat(currentEvent.delta);

		// we start the first element of the list
		this.currentbehaviour.mousewheelList = "[(0," + currentEvent.delta + ")";

		this.previousMousewheel = currentEvent;
	}

	FastSingleDirectionMouseScroll.prototype.processMousewheel = function(currentEvent,pageSize) {
		//if this is the first mousewheel we find
		if (this.previousMousewheel==null){
			this.startBehaviour(currentEvent,pageSize);
			return ("##PROCESS: new Behvaiour started");
		}
		/*
		 * if not, compare timestamps, if it's within the defined time, add it to the behaviour and update the previousMousewheel with currentEvent
		 */
		else if ((currentEvent.timestampms - this.previousMousewheel.timestampms) < this.betweenMousewheelThreshold){
				// we increase positive or delta values
				// accordingly
				if (parseFloat(currentEvent.delta) > 0)
					this.currentbehaviour.positiveDelta += parseFloat(currentEvent.delta);
				else
					this.currentbehaviour.negativeDelta += parseFloat(currentEvent.delta);

				this.currentbehaviour.numberOfMousewheels++;

				this.currentbehaviour.totalDelta +=  parseFloat(currentEvent.delta);
				this.currentbehaviour.totalDeltaAbs += Math.abs(currentEvent.delta);

				// we add the scroll to the list
				var timedifference = currentEvent.timestampms - this.currentbehaviour.lastMousewheelTimems;

				this.currentbehaviour.mousewheelList += ",(" + (currentEvent.timestampms - this.currentbehaviour.lastMousewheelTimems) + "," + currentEvent.delta + ")";

				this.currentbehaviour.lastMousewheelTime = currentEvent.timestamp;
				this.currentbehaviour.lastMousewheelTimems = currentEvent.timestampms;

				if (currentEvent.hasOwnProperty("url"))
					this.currentbehaviour.url = currentEvent.url;

				this.previousMousewheel = currentEvent;

				return ("##PROCESS: mousewheel within previous one found");
		}
		//if they are too far away, we need to finish current behaviour and start a new one
		else{

			this.endBehaviour();
			this.startBehaviour(currentEvent);
			return ("##PROCESS: mousewheel too far away:"+currentEvent.timestampms +" was too far from" + this.previousMousewheel.timestampms
			 + " with threshold=" + this.betweenMousewheelThreshold);
		}
	}

	FastSingleDirectionMouseScroll.prototype.endBehaviour = function(currentEvent) {

		if ((Math.abs(this.currentbehaviour.positiveDelta)
					+ Math.abs(this.currentbehaviour.negativeDelta) > this.totalScrollDistance)
				&& Math.abs((Math.abs(this.currentbehaviour.negativeDelta)
					- Math.abs(this.currentbehaviour.positiveDelta))) > this.endingScrollResult) {

			this.currentbehaviour.speed = (this.currentbehaviour.totalDelta * 1000)
					/ (this.currentbehaviour.lastMousewheelTimems - this.currentbehaviour.firstMousewheelTimems);

			this.currentbehaviour.speedAbs = (this.currentbehaviour.totalDeltaAbs * 1000)
					/ (this.currentbehaviour.lastMousewheelTimems - this.currentbehaviour.firstMousewheelTimems);
			this.currentbehaviour.duration = (this.currentbehaviour.lastMousewheelTimems - this.currentbehaviour.firstMousewheelTimems);

			// end the scrolls list
			this.currentbehaviour.mousewheelList += "]";

			//add the behaviour to the final list of behaviours
			this.fastSingleDirectionScrollBehaviourList.push(this.currentbehaviour);

			return ("##END: new behaviour stored");

		} else {
			this.previousMousewheel = null;
			return ("##END: behaviour discarded");
		}
	}

	FastSingleDirectionMouseScroll.prototype.outputResult = function() {
		//return ("##OUTPUT: outputting " + this.controlledBehaviourList.length +" elements");

		return this.fastSingleDirectionScrollBehaviourList;
	}

	FastSingleDirectionMouseScroll.prototype.outputSummary = function() {
		this.currentbehaviour = new Object();

		if (this.fastSingleDirectionScrollBehaviourList.length > 0){

			// I need to create averages of all the metrics available for each behaviour occurrence
			this.currentbehaviour.sid = this.fastSingleDirectionScrollBehaviourList[0].sid;

			this.currentbehaviour.url = this.fastSingleDirectionScrollBehaviourList[0].url;
			this.currentbehaviour.sessionstartms = this.fastSingleDirectionScrollBehaviourList[0].sessionstartms;

			this.currentbehaviour.firstMousewheelTime = this.fastSingleDirectionScrollBehaviourList[0].firstMousewheelTime;
			this.currentbehaviour.firstMousewheelTimems = this.fastSingleDirectionScrollBehaviourList[0].firstMousewheelTimems;
			this.currentbehaviour.lastMousewheelTime = this.fastSingleDirectionScrollBehaviourList[this.fastSingleDirectionScrollBehaviourList.length-1].lastMousewheelTime;
			this.currentbehaviour.lastMousewheelTimems = this.fastSingleDirectionScrollBehaviourList[this.fastSingleDirectionScrollBehaviourList.length-1].lastMousewheelTimems;

			this.currentbehaviour.visitCounter = 0;
			this.currentbehaviour.visitDuration = 0;

			this.currentbehaviour.idleTime = 0;
			this.currentbehaviour.calculatedActiveTime = 0;
			this.currentbehaviour.idleTimeSoFar = 0;

			this.currentbehaviour.positiveDelta = 0;
			this.currentbehaviour.negativeDelta = 0;
			this.currentbehaviour.numberOfMousewheels = 0;
			this.currentbehaviour.totalDelta = 0;
			this.currentbehaviour.totalDeltaAbs = 0;
			this.currentbehaviour.speed = 0;
			this.currentbehaviour.speedAbs = 0;
			this.currentbehaviour.duration = 0;

			//Looping through all elements to add them
			for (var i = 0; i < this.fastSingleDirectionScrollBehaviourList.length; i++){
				this.currentbehaviour.visitCounter += this.fastSingleDirectionScrollBehaviourList[i].visitCounter;
				this.currentbehaviour.visitDuration += this.fastSingleDirectionScrollBehaviourList[i].visitDuration;

				this.currentbehaviour.idleTime += this.fastSingleDirectionScrollBehaviourList[i].idleTime;
				this.currentbehaviour.calculatedActiveTime += this.fastSingleDirectionScrollBehaviourList[i].calculatedActiveTime;
				this.currentbehaviour.idleTimeSoFar += this.fastSingleDirectionScrollBehaviourList[i].idleTimeSoFar;

				this.currentbehaviour.positiveDelta += this.fastSingleDirectionScrollBehaviourList[i].positiveDelta
				this.currentbehaviour.negativeDelta += this.fastSingleDirectionScrollBehaviourList[i].negativeDelta
				this.currentbehaviour.numberOfMousewheels += this.fastSingleDirectionScrollBehaviourList[i].numberOfMousewheels
				this.currentbehaviour.totalDelta += this.fastSingleDirectionScrollBehaviourList[i].totalDelta
				this.currentbehaviour.totalDeltaAbs += this.fastSingleDirectionScrollBehaviourList[i].totalDeltaAbs
				this.currentbehaviour.speed += this.fastSingleDirectionScrollBehaviourList[i].speed
				this.currentbehaviour.speedAbs += this.fastSingleDirectionScrollBehaviourList[i].speedAbs
				this.currentbehaviour.duration += this.fastSingleDirectionScrollBehaviourList[i].duration
			}

			//Dividing all of them to get the average
			this.currentbehaviour.visitCounter /= this.fastSingleDirectionScrollBehaviourList.length;
			this.currentbehaviour.visitDuration /= this.fastSingleDirectionScrollBehaviourList.length;

			this.currentbehaviour.idleTime /= this.fastSingleDirectionScrollBehaviourList.length;
			this.currentbehaviour.calculatedActiveTime /= this.fastSingleDirectionScrollBehaviourList.length;
			this.currentbehaviour.idleTimeSoFar /= this.fastSingleDirectionScrollBehaviourList.length;

			this.currentbehaviour.positiveDelta /= this.fastSingleDirectionScrollBehaviourList.length;
			this.currentbehaviour.negativeDelta /= this.fastSingleDirectionScrollBehaviourList.length;
			this.currentbehaviour.numberOfMousewheels /= this.fastSingleDirectionScrollBehaviourList.length;
			this.currentbehaviour.totalDelta /= this.fastSingleDirectionScrollBehaviourList.length;
			this.currentbehaviour.totalDeltaAbs /= this.fastSingleDirectionScrollBehaviourList.length;
			this.currentbehaviour.speed /= this.fastSingleDirectionScrollBehaviourList.length;
			this.currentbehaviour.speedAbs /= this.fastSingleDirectionScrollBehaviourList.length;
			this.currentbehaviour.duration /= this.fastSingleDirectionScrollBehaviourList.length;

			return this.currentbehaviour;
		}
		else
			return {};
	}
	///////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////END OF FastSingleDirectionMouseScroll/////////////////////////////



	//////////////////////////START OF UpDownMouseScrollBehaviour/////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////
	function UpDownMouseScrollBehaviour(){
		//Most of this code will be quite similar to fastmousescrollcycle

		//static threshold defining variables
		// maximum time between the scrolls in ms
		//I won't use time... if the user scrolls a lot, then I will record his behaviour throughout the entire episode
		//this.betweenMousewheelThreshold = 2000;

		//The "totalscrolldistance" will simply act as a filter, so I only store the scrolling behaviour of
		//users who actually scrolled something
		this.totalScrollDistance = 7;

		this.directionChangeThreshold = 3;

		//previous occurrence of a mousewheel event
		this.previousMousewheel = null;

		this.currentbehaviour = null;
	}

	UpDownMouseScrollBehaviour.prototype.startBehaviour = function(currentEvent) {

		//this.currentbehaviour.userId = currentEvent.sid;
		//this.currentbehaviour.webAppId = currentEvent.sd;
		this.currentbehaviour = new Object();

		this.currentbehaviour.sid = currentEvent.sid;
		this.currentbehaviour.behaviour = "UpDownMouseScrollBehaviour";

		if (currentEvent.hasOwnProperty("url"))
			this.currentbehaviour.url = currentEvent.url;

		this.currentbehaviour.sessionstartms = currentEvent.sessionstartms;

		this.currentbehaviour.numberOfMousewheels = 1;

		this.currentbehaviour.totalDelta = parseFloat(currentEvent.delta);
		this.currentbehaviour.totalDeltaAbs = Math.abs(currentEvent.delta);

		this.currentbehaviour.firstMousewheelTime = currentEvent.timestamp;
		this.currentbehaviour.firstMousewheelTimems = currentEvent.timestampms;
		this.currentbehaviour.lastMousewheelTime = currentEvent.timestamp;
		this.currentbehaviour.lastMousewheelTimems = currentEvent.timestampms;

		this.currentbehaviour = addInfoToBehaviour(this.currentbehaviour,currentEvent);

		this.currentbehaviour.pageSize = currentEvent.pageSize;


		//we need to define pos/neg deltas beforehand, so there is something to add values to.
		this.currentbehaviour.positiveDelta = 0;
		this.currentbehaviour.negativeDelta = 0;

		// we increase positive or delta values
		// accordingly
		if (parseFloat(currentEvent.delta) > 0)
			this.currentbehaviour.positiveDelta += parseFloat(currentEvent.delta);
		else
			this.currentbehaviour.negativeDelta += parseFloat(currentEvent.delta);

		//This will be a list containing all the behaviours.
		//one list will contain the scroll values
		this.currentbehaviour.scrollValuesList = currentEvent.delta + ",";
		//the other list will contain the time values
		this.currentbehaviour.scrollTimesList = 0 + ",";

		// we start the first element of the list
		this.currentbehaviour.mousewheelList = "[(0," + currentEvent.delta + ")";

		//I will keep a "direction changing" counter, which will increase each time the scroll changes direction
		this.currentbehaviour.directionChangeCounter = 0;

		this.previousMousewheel = currentEvent;
	}

	UpDownMouseScrollBehaviour.prototype.processMousewheel = function(currentEvent,pageSize) {
		//if this is the first mousewheel we find
		if (this.previousMousewheel==null){
			this.startBehaviour(currentEvent,pageSize);
			return ("##PROCESS: new Behvaiour started");
		}
		/*
		 * if not, there is no need to compare timestamps, we will record the entire behaviour, and then check
		 * if the scrolling activity was enough
		 */
		else{
			// we increase positive or delta values
			// accordingly
			if (parseFloat(currentEvent.delta) > 0)
				this.currentbehaviour.positiveDelta += parseFloat(currentEvent.delta);
			else
				this.currentbehaviour.negativeDelta += parseFloat(currentEvent.delta);

			this.currentbehaviour.numberOfMousewheels++;

			this.currentbehaviour.totalDelta +=  parseFloat(currentEvent.delta);
			this.currentbehaviour.totalDeltaAbs += Math.abs( currentEvent.delta);

			// we add the scroll to the list
			var timedifference = currentEvent.timestampms - this.currentbehaviour.lastMousewheelTimems;

			this.currentbehaviour.scrollValuesList = this.scrollValuesList.concat(currentEvent.delta + ",");
			this.currentbehaviour.scrollTimesList = this.scrollValuesList.concat(timedifference + ",");

			this.currentbehaviour.mousewheelList += ",(" + (currentEvent.timestampms - this.currentbehaviour.lastMousewheelTimems) + "," + currentEvent.delta + ")";

			this.currentbehaviour.lastMousewheelTime = currentEvent.timestamp;
			this.currentbehaviour.lastMousewheelTimems = currentEvent.timestampms;

			if (currentEvent.hasOwnProperty("url"))
				this.currentbehaviour.url = currentEvent.url;

			//exclusive OR between previous and current delta values
			if ((parseFloat(currentEvent.delta) > 0) && !(parseFloat(this.previousMousewheel.delta) > 0)
				|| !(parseFloat(currentEvent.delta) > 0) && (parseFloat(this.previousMousewheel.delta) > 0)){

				this.currentbehaviour.directionChangeCounter ++;
			}

			this.previousMousewheel = currentEvent;

		}
	}

	UpDownMouseScrollBehaviour.prototype.endBehaviour = function(currentEvent) {

		/**
		 * IF
		 * the TOTAL scroll distance is bigger than a given threshold
		 * AND
		 * the number of direction changes is high enough
		 *
		 * That means the user scrolled up and down
		 */
		if ((Math.abs(this.currentbehaviour.positiveDelta)
					+ Math.abs(this.currentbehaviour.negativeDelta) > this.totalScrollDistance)
				&& this.currentbehaviour.directionChangeCounter > this.directionChangeThreshold) {

			this.currentbehaviour.speed = (this.currentbehaviour.totalDelta * 1000)
					/ (this.currentbehaviour.lastMousewheelTimems - this.currentbehaviour.firstMousewheelTimems);

			this.currentbehaviour.speedAbs = (this.currentbehaviour.totalDeltaAbs * 1000)
					/ (this.currentbehaviour.lastMousewheelTimems - this.currentbehaviour.firstMousewheelTimems);
			this.currentbehaviour.duration = (this.currentbehaviour.lastMousewheelTimems - this.currentbehaviour.firstMousewheelTimems);

			// end the scrolls list
			this.currentbehaviour.mousewheelList += "]";

			//add the behaviour to the final list of behaviours
			this.upDownMouseScrollBehaviourList.push(this.currentbehaviour);

			return ("##END: new behaviour stored");

		} else {
			this.previousMousewheel = null;
			return ("##END: behaviour discarded");
		}
	}

	UpDownMouseScrollBehaviour.prototype.outputResult = function() {
		//return ("##OUTPUT: outputting " + this.controlledBehaviourList.length +" elements");

		return this.upDownMouseScrollBehaviourList;
	}

	UpDownMouseScrollBehaviour.prototype.outputSummary = function() {
		this.currentbehaviour = new Object();

		if (this.upDownMouseScrollBehaviourList.length > 0){

			// I need to create averages of all the metrics available for each behaviour occurrence
			this.currentbehaviour.sid = this.upDownMouseScrollBehaviourList[0].sid;

			this.currentbehaviour.url = this.upDownMouseScrollBehaviourList[0].url;
			this.currentbehaviour.sessionstartms = this.upDownMouseScrollBehaviourList[0].sessionstartms;

			this.currentbehaviour.firstMousewheelTime = this.upDownMouseScrollBehaviourList[0].firstMousewheelTime;
			this.currentbehaviour.firstMousewheelTimems = this.upDownMouseScrollBehaviourList[0].firstMousewheelTimems;
			this.currentbehaviour.lastMousewheelTime = this.upDownMouseScrollBehaviourList[this.upDownMouseScrollBehaviourList.length-1].lastMousewheelTime;
			this.currentbehaviour.lastMousewheelTimems = this.upDownMouseScrollBehaviourList[this.upDownMouseScrollBehaviourList.length-1].lastMousewheelTimems;

			this.currentbehaviour.visitCounter = 0;
			this.currentbehaviour.visitDuration = 0;

			this.currentbehaviour.idleTime = 0;
			this.currentbehaviour.calculatedActiveTime = 0;
			this.currentbehaviour.idleTimeSoFar = 0;

			this.currentbehaviour.positiveDelta = 0;
			this.currentbehaviour.negativeDelta = 0;
			this.currentbehaviour.numberOfMousewheels = 0;
			this.currentbehaviour.totalDelta = 0;
			this.currentbehaviour.totalDeltaAbs = 0;
			this.currentbehaviour.speed = 0;
			this.currentbehaviour.speedAbs = 0;
			this.currentbehaviour.duration = 0;

			//Looping through all elements to add them
			for (var i = 0; i < this.upDownMouseScrollBehaviourList.length; i++){
				this.currentbehaviour.visitCounter += this.upDownMouseScrollBehaviourList[i].visitCounter;
				this.currentbehaviour.visitDuration += this.upDownMouseScrollBehaviourList[i].visitDuration;

				this.currentbehaviour.idleTime += this.upDownMouseScrollBehaviourList[i].idleTime;
				this.currentbehaviour.calculatedActiveTime += this.upDownMouseScrollBehaviourList[i].calculatedActiveTime;
				this.currentbehaviour.idleTimeSoFar += this.upDownMouseScrollBehaviourList[i].idleTimeSoFar;

				this.currentbehaviour.positiveDelta += this.upDownMouseScrollBehaviourList[i].positiveDelta
				this.currentbehaviour.negativeDelta += this.upDownMouseScrollBehaviourList[i].negativeDelta
				this.currentbehaviour.numberOfMousewheels += this.upDownMouseScrollBehaviourList[i].numberOfMousewheels
				this.currentbehaviour.totalDelta += this.upDownMouseScrollBehaviourList[i].totalDelta
				this.currentbehaviour.totalDeltaAbs += this.upDownMouseScrollBehaviourList[i].totalDeltaAbs
				this.currentbehaviour.speed += this.upDownMouseScrollBehaviourList[i].speed
				this.currentbehaviour.speedAbs += this.upDownMouseScrollBehaviourList[i].speedAbs
				this.currentbehaviour.duration += this.upDownMouseScrollBehaviourList[i].duration
			}

			//Dividing all of them to get the average
			this.currentbehaviour.visitCounter /= this.upDownMouseScrollBehaviourList.length;
			this.currentbehaviour.visitDuration /= this.upDownMouseScrollBehaviourList.length;

			this.currentbehaviour.idleTime /= this.upDownMouseScrollBehaviourList.length;
			this.currentbehaviour.calculatedActiveTime /= this.upDownMouseScrollBehaviourList.length;
			this.currentbehaviour.idleTimeSoFar /= this.upDownMouseScrollBehaviourList.length;

			this.currentbehaviour.positiveDelta /= this.upDownMouseScrollBehaviourList.length;
			this.currentbehaviour.negativeDelta /= this.upDownMouseScrollBehaviourList.length;
			this.currentbehaviour.numberOfMousewheels /= this.upDownMouseScrollBehaviourList.length;
			this.currentbehaviour.totalDelta /= this.upDownMouseScrollBehaviourList.length;
			this.currentbehaviour.totalDeltaAbs /= this.upDownMouseScrollBehaviourList.length;
			this.currentbehaviour.speed /= this.upDownMouseScrollBehaviourList.length;
			this.currentbehaviour.speedAbs /= this.upDownMouseScrollBehaviourList.length;
			this.currentbehaviour.duration /= this.upDownMouseScrollBehaviourList.length;

			return this.currentbehaviour;
		}
		else
			return {};
	}
	///////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////END OF UpDownMouseScrollBehaviour/////////////////////////////




	//////////////////////////START OF ScrollList/////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////
	function ScrollList(){

		//This will be a list containing all the behaviours.
		this.scrollBehaviourList =[];

		this.currentbehaviour = null;
	}

	ScrollList.prototype.startBehaviour = function(currentEvent) {


	}

	ScrollList.prototype.processMousewheel = function(currentEvent,pageSize) {
		this.currentbehaviour = new Object();

		this.currentbehaviour.sid = currentEvent.sid;
		this.currentbehaviour.behaviour = "scrollList";

		if (currentEvent.hasOwnProperty("url"))
			this.currentbehaviour.url = currentEvent.url;

		this.currentbehaviour.sessionstartms = currentEvent.sessionstartms;

		this.currentbehaviour.totalDelta = parseFloat(currentEvent.delta);
		this.currentbehaviour.totalDeltaAbs = Math.abs(currentEvent.delta);

		this.currentbehaviour.firstMousewheelTime = currentEvent.timestamp;
		this.currentbehaviour.firstMousewheelTimems = currentEvent.timestampms;
		this.currentbehaviour.lastMousewheelTime = currentEvent.timestamp;
		this.currentbehaviour.lastMousewheelTimems = currentEvent.timestampms;

		this.currentbehaviour = addInfoToBehaviour(this.currentbehaviour,currentEvent);

		this.currentbehaviour.pageSize = currentEvent.pageSize;

		this.scrollBehaviourList.push(this.currentbehaviour);
	}

	ScrollList.prototype.endBehaviour = function(currentEvent) {

	}

	ScrollList.prototype.outputResult = function() {
		//return ("##OUTPUT: outputting " + this.controlledBehaviourList.length +" elements");

		return this.scrollBehaviourList;
	}

	ScrollList.prototype.outputSummary = function() {
			return {};
	}
	///////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////END OF ScrollList/////////////////////////////



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

		//general variables for general scroll statistics per episode
		var scrollStatistics = new Object();
			scrollStatistics.positiveScroll = 0;
			scrollStatistics.negativeScroll = 0;
			scrollStatistics.totalScroll = 0;
			scrollStatistics.numberOfMousewheel = 0;
		//We add what urlSession this object refers to. Depending on the mapReduce emit function, sdSession OR urlSession will remain the same.
		scrollStatistics.sdSessionCounter = 0;
		scrollStatistics.sdTimeSinceLastSession = 0;
		scrollStatistics.urlSessionCounter = 0;
		scrollStatistics.urlSinceLastSession = 0;
		scrollStatistics.calculatedActiveTimeMedian = 0;
		scrollStatistics.sessionstartmsMedian = 0;
		scrollStatistics.sdCalculatedActiveTimeMedian = 0;
		scrollStatistics.urlEpisodeLength = 0;

		var sessionstartmsList = [];
		var calculatedActiveTimeList = [];

		var sdCalculatedActiveTimeList = [];

var testList =[]

		//Controlled scroll behaviour data
		var controlledScroll = new ControlledBehaviourAnalysis();

		//Controlled scroll behaviour data
		var fastMouseScrollCycle = new FastMouseScrollCycle();

		//Controlled scroll behaviour data
		var fastSingleDirectionMouseScroll = new FastSingleDirectionMouseScroll();

		//list of all scrolls
		var regularScroll = new ScrollList();

		//Up&Down scroll behaviour data
		//var upDownMouseScrollBehaviour = new UpDownMouseScrollBehaviour();

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

			/////////////END OF CODE TO OBTAIN THE HTML SIZE!////////////

			//We add what urlSession this object refers to. Depending on the mapReduce emit function, sdSession OR urlSession will remain the same.
			if (scrollStatistics.sdSessionCounter == 0){
				scrollStatistics.sdSessionCounter = valueObject.sdSessionCounter;
				scrollStatistics.sdTimeSinceLastSession = valueObject.sdTimeSinceLastSession;
				scrollStatistics.urlSessionCounter = valueObject.urlSessionCounter;
				scrollStatistics.urlSinceLastSession = valueObject.urlSinceLastSession;
				scrollStatistics.urlEpisodeLength = valueObject.urlEpisodeLength;
				scrollStatistics.episodeUrlActivity = valueObject.episodeUrlActivity;
				scrollStatistics.episodeSdActivity = valueObject.episodeSdActivity;
			}
			else{
				//If any of them is different, store -1 (this will always happen with at least one of them
				if (scrollStatistics.sdSessionCounter != valueObject.sdSessionCounter) {scrollStatistics.sdSessionCounter=-1;}
				if (scrollStatistics.sdTimeSinceLastSession != valueObject.sdTimeSinceLastSession) {scrollStatistics.sdTimeSinceLastSession=-1;}
				if (scrollStatistics.urlSessionCounter != valueObject.urlSessionCounter) {scrollStatistics.urlSessionCounter=-1;}
				if (scrollStatistics.urlSinceLastSession != valueObject.urlSinceLastSession) {scrollStatistics.urlSinceLastSession=-1;}
				if (scrollStatistics.episodeUrlActivity != valueObject.episodeUrlActivity) {scrollStatistics.episodeUrlActivity=-1;}
				if (scrollStatistics.episodeSdActivity != valueObject.episodeSdActivity) {scrollStatistics.episodeSdActivity=-1;}
			}

			//Getting the episode timestamp and active time medians
			if (incorrectActTimeEvents.indexOf(valueObject.event)<0){
				calculatedActiveTimeList.push(parseInt(valueObject.calculatedActiveTime));
				scrollStatistics.calculatedActiveTimeMedian = median(calculatedActiveTimeList);

				sessionstartmsList.push(parseInt(valueObject.sessionstartms));
				scrollStatistics.sessionstartmsMedian = median(sessionstartmsList);

				sdCalculatedActiveTimeList.push(parseInt(valueObject.sdCalculatedActiveTime));
				scrollStatistics.sdCalculatedActiveTimeMedian = median(sdCalculatedActiveTimeList);
			}



			if (valueObject.event == mouseWheelEvent){
				if (valueObject.delta != "null" && Math.abs(valueObject.delta) >0){
					if (valueObject.delta>0)
						scrollStatistics.positiveScroll += parseFloat(valueObject.delta);
					else
						scrollStatistics.negativeScroll += parseFloat(valueObject.delta);
				}
				if (valueObject.delta == null)
					debugLog += "it was null";
				else
					debugLog += valueObject.delta;

				scrollStatistics.totalScroll += parseFloat(valueObject.delta);

				scrollStatistics.numberOfMousewheel ++;

				//ControlledBehaviour analysis
				//debugLog +=
				controlledScroll.processMousewheel(valueObject, pageSize);
				fastMouseScrollCycle.processMousewheel(valueObject, pageSize);
				fastSingleDirectionMouseScroll.processMousewheel(valueObject, pageSize);
				regularScroll.processMousewheel(valueObject, pageSize);
				//upDownMouseScrollBehaviour.processMousewheel(valueObject, pageSize);

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
		controlledScroll.endBehaviour();
		fastMouseScrollCycle.endBehaviour();
		fastSingleDirectionMouseScroll.endBehaviour();
		//upDownMouseScrollBehaviour.endBehaviour();

		//return "" + count + "," + isArrayOrdered;
		//return "" + isArrayOrdered + ";count=" + count + ";" + timeDifference;
		return{
				generalStatistics:generalStatistics,
				scrollStatistics:scrollStatistics,

				controlledScroll:controlledScroll.outputResult(),
				controlledScrollSummary: controlledScroll.outputSummary(),
				controlledScrollCounter:controlledScroll.outputResult().length,

				fastMouseScrollCycle:fastMouseScrollCycle.outputResult(),
				fastMouseScrollCycleSummary: fastMouseScrollCycle.outputSummary(),
				fastMouseScrollCycleCounter:fastMouseScrollCycle.outputResult().length,

				fastSingleDirectionMouseScroll:fastSingleDirectionMouseScroll.outputResult(),
				fastSingleDirectionMouseScrollSummary: fastSingleDirectionMouseScroll.outputSummary(),
				fastSingleDirectionMouseScrollCounter:fastSingleDirectionMouseScroll.outputResult().length,

				regularScrollList:regularScroll.outputResult(),
				regularScrollCounter:regularScroll.outputResult().length,

				/*upDownMouseScrollBehaviour:upDownMouseScrollBehaviour.outputResult(),
				upDownMouseScrollBehaviourSummary: upDownMouseScrollBehaviour.outputSummary(),
				upDownMouseScrollBehaviourCounter:upDownMouseScrollBehaviour.outputResult().length,
			*/
				behaviourCounter: controlledScroll.outputResult().length
									+ fastMouseScrollCycle.outputResult().length
									+ fastSingleDirectionMouseScroll.outputResult().length,
									//+ upDownMouseScrollBehaviour.outputResult().length,

				episodeStartms : fixEventTS(valuesArraySorted[0]).timestampms,
				episodeEndms : fixEventTS(valuesArraySorted[valuesArraySorted.length-1]).timestampms,

				episodeDurationms: Number(fixEventTS(valuesArraySorted[valuesArraySorted.length-1]).timestampms)- Number(fixEventTS(valuesArraySorted[0]).timestampms),

				debugLog:debugLog
				/*positiveScroll:positiveScroll,
				negativeScroll:negativeScroll,
				totalScroll:totalScroll,
				numberOfMousewheel:numberOfMousewheel
		*/
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
