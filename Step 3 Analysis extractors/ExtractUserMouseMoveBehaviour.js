/**
 * Prints user MouseBehaviours
 *
 * To run it:
 * mongo localhost/testdb ExtractUserMouseMoveBehaviour.js > mouseMoveFeatures.json
 *
 */

/**
 * This function will retrieve the MouseMoveBehaviour, inject the userId, and then print it out.
 * Best way to use it is:
 * mongo localhost/testdb --eval "load('ExtractUserMouseMoveBehaviour.js');printMouseMoveStatistics();" > mouseMoveStatistics.json
 */
function printMouseMoveStatistics(){

	//////We need to load the constants file
	load("../MapReduceConstants.js");

	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.mouseMoveBehaviour.find().toArray();

	print("[");
	for (var i = 0; i < userBehaviourList.length; i++){
		mouseMoveBehaviourItem = userBehaviourList[i];

		var mouseMoveStatistics = mouseMoveBehaviourItem.value.mouseStatistics;

		mouseMoveStatistics.sid = mouseMoveBehaviourItem._id.sid;
		mouseMoveStatistics.url = mouseMoveBehaviourItem._id.url;

		printjson(mouseMoveStatistics);
		print(",");

	}
	print("]");
}

function printMouseMoveStatisticsBatchedPerUser(startPercent,endPercent){

	//////We need to load the constants file
	load("../MapReduceConstants.js");

	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.mouseMoveBehaviour.find().toArray();

	startIndex = (userBehaviourList.length/100) * startPercent;
	startIndex = Math.floor(startIndex);

	endIndex = (userBehaviourList.length/100) * endPercent;
	endIndex = Math.floor(endIndex);

	print("[");
	for (var i = startIndex; i < endIndex; i++){
		mouseMoveBehaviourItem = userBehaviourList[i];

		var mouseMoveStatistics = mouseMoveBehaviourItem.value.mouseStatistics;

		mouseMoveStatistics.sid = mouseMoveBehaviourItem._id.sid;
		mouseMoveStatistics.url = mouseMoveBehaviourItem._id.url;

		printjson(mouseMoveStatistics);
		print(",");

	}
	print("]");
}


function printMouseMoveEpisodeDuration(){

	//////We need to load the constants file
	load("../MapReduceConstants.js");

	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.mouseMoveBehaviour.find().toArray();

	print("[");
	for (var i = 0; i < userBehaviourList.length; i++){
		mouseMoveBehaviourItem = userBehaviourList[i];

		var episodeDuration = {
			sid : mouseMoveBehaviourItem._id.sid,
			url : mouseMoveBehaviourItem._id.url,
			episodeDurationms : mouseMoveBehaviourItem.value.episodeDurationms,

			sdSessionCounter : mouseMoveBehaviourItem.value.mouseStatistics.sdSessionCounter,
			sdTimeSinceLastSession : mouseMoveBehaviourItem.value.mouseStatistics.sdTimeSinceLastSession,
			urlSessionCounter : mouseMoveBehaviourItem.value.mouseStatistics.urlSessionCounter,
			urlSinceLastSession : mouseMoveBehaviourItem.value.mouseStatistics.urlSinceLastSession,
			urlEpisodeLength: mouseMoveBehaviourItem.value.mouseStatistics.urlEpisodeLength,

		};

		printjson(episodeDuration);
		print(",");
	}
	print("]");
}


function printMouseMoveEpisodeDurationBatchedPerUser(startPercent,endPercent){

	//////We need to load the constants file
	load("../MapReduceConstants.js");

	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.mouseMoveBehaviour.find().toArray();

	startIndex = (userBehaviourList.length/100) * startPercent;
	startIndex = Math.floor(startIndex);

	endIndex = (userBehaviourList.length/100) * endPercent;
	endIndex = Math.floor(endIndex);

	print("[");
	for (var i = startIndex; i < endIndex; i++){
		mouseMoveBehaviourItem = userBehaviourList[i];

		var episodeDuration = {
			sid : mouseMoveBehaviourItem._id.sid,
			url : mouseMoveBehaviourItem._id.url,
			episodeDurationms : mouseMoveBehaviourItem.value.episodeDurationms,

			sdSessionCounter : mouseMoveBehaviourItem.value.mouseStatistics.sdSessionCounter,
			sdTimeSinceLastSession : mouseMoveBehaviourItem.value.mouseStatistics.sdTimeSinceLastSession,
			urlSessionCounter : mouseMoveBehaviourItem.value.mouseStatistics.urlSessionCounter,
			urlSinceLastSession : mouseMoveBehaviourItem.value.mouseStatistics.urlSinceLastSession,
			urlEpisodeLength: mouseMoveBehaviourItem.value.mouseStatistics.urlEpisodeLength,

		};

		printjson(episodeDuration);
		print(",");
	}
	print("]");
}

///////////START OF MOUSE MOVE BEHAVIOURS//////////
function printMouseMove(){

	//////We need to load the constants file
	load("../MapReduceConstants.js");

	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.mouseMoveBehaviour.find().toArray();

	print("[");
	for (var i = 0; i < userBehaviourList.length; i++){

		mouseMoveBehaviourItem = userBehaviourList[i];

		var mouseMoveBehaviour = mouseMoveBehaviourItem.value.mouseMoveBehaviour;

		mouseMoveBehaviour.sid = mouseMoveBehaviourItem._id.sid;
		mouseMoveBehaviour.url = mouseMoveBehaviourItem._id.url;
		mouseMoveBehaviour.urlSessionCounter = mouseMoveBehaviourItem._id.urlSessionCounter;

		delete mouseMoveBehaviour.mouseMoveTimeList;

		printjson(mouseMoveBehaviour);
		print(",");
	}
	print("]");
}
function printMouseMoveBatchedPerUser(startPercent,endPercent){

	//////We need to load the constants file
	load("../MapReduceConstants.js");

	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.mouseMoveBehaviour.find().toArray();

	startIndex = (userBehaviourList.length/100) * startPercent;
	startIndex = Math.floor(startIndex);

	endIndex = (userBehaviourList.length/100) * endPercent;
	endIndex = Math.floor(endIndex);

	print("[");
	for (var i = startIndex; i < endIndex; i++){

		mouseMoveBehaviourItem = userBehaviourList[i];

		var mouseMoveBehaviour = mouseMoveBehaviourItem.value.mouseMoveBehaviour;

		mouseMoveBehaviour.sid = mouseMoveBehaviourItem._id.sid;
		mouseMoveBehaviour.url = mouseMoveBehaviourItem._id.url;
		mouseMoveBehaviour.urlSessionCounter = mouseMoveBehaviourItem._id.urlSessionCounter;

		delete mouseMoveBehaviour.mouseMoveTimeList;

		printjson(mouseMoveBehaviour);
		print(",");
	}
	print("]");
}


function printMouseMoveTimeListBatchedPerUser(startPercent,endPercent){

	//////We need to load the constants file
	load("../MapReduceConstants.js");

	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.mouseMoveBehaviour.find().toArray();

	startIndex = (userBehaviourList.length/100) * startPercent;
	startIndex = Math.floor(startIndex);

	endIndex = (userBehaviourList.length/100) * endPercent;
	endIndex = Math.floor(endIndex);

	print("[");
	for (var i = startIndex; i < endIndex; i++){

		var mouseMoveBehaviourItem = userBehaviourList[i];

		var mouseMoveBehaviour = mouseMoveBehaviourItem.value.mouseMoveBehaviour;

		var mouseMoveTimeList = mouseMoveBehaviour.mouseMoveTimeList;
/*
		print("mouseOverCount:", mouseMoveBehaviour.mouseOverCount);
		print("mouseMoveCount:", mouseMoveBehaviour.mouseMoveCount);
		printjson(mouseMoveBehaviour);
*/

		if (mouseMoveTimeList.length > 0)
			var previousMouseMoveTime = mouseMoveTimeList[0];

		for (var j=0; j < mouseMoveTimeList.length; j++){
				var mouseMoveTimeObject = {
					sid: mouseMoveBehaviourItem._id.sid,
					url: mouseMoveBehaviourItem._id.url,
					urlSessionCounter: mouseMoveBehaviourItem._id.urlSessionCounter,
					timestamp: mouseMoveTimeList[j],
					diffTime: mouseMoveTimeList[j] - previousMouseMoveTime
				};
				previousMouseMoveTime =  mouseMoveTimeList[j];
				printjson(mouseMoveTimeObject);
				print(",");
		}
	}
	print("]");
}
