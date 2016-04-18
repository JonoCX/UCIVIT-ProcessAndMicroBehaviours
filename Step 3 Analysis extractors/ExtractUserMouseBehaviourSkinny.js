/**
 * Prints user MouseBehaviours
 * 
 * To run it:
 * mongo localhost/testdb ExtractUserMouseBehaviourSkinny.js > mouseFeatures.json
 * 
 */ 

/**
 * This function will retrieve the mouseStatistics, inject the userId, and then print it out.
 * Best way to use it is:
 * mongo localhost/testdb --eval "load('ExtractUserMouseBehaviourSkinny.js');printMouseStatistics();" > mouseStatistics.json
 */
function printMouseStatistics(){
	
	//////We need to load the constants file
	load("MapReduceConstants.js");
	
	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.mouseBehaviourSkinny.find().toArray();
	
	print("[");
	for (var i = 0; i < userBehaviourList.length; i++){
		mouseBehaviourItem = userBehaviourList[i];
		
		var mouseStatistics = mouseBehaviourItem.value.mouseStatistics;
		
		mouseStatistics.sid = mouseBehaviourItem._id.sid;
		mouseStatistics.url = mouseBehaviourItem._id.url;
		
		printjson(mouseStatistics);
		print(",");

	}
	print("]");
}

function printMouseStatisticsBatchedPerUser(startPercent,endPercent){
	
	//////We need to load the constants file
	load("MapReduceConstants.js");
	
	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.mouseBehaviourSkinny.find().toArray();
	
	startIndex = (userBehaviourList.length/100) * startPercent;
	startIndex = Math.floor(startIndex);
	
	endIndex = (userBehaviourList.length/100) * endPercent;
	endIndex = Math.floor(endIndex);
	
	print("[");
	for (var i = startIndex; i < endIndex; i++){
		mouseBehaviourItem = userBehaviourList[i];
		
		var mouseStatistics = mouseBehaviourItem.value.mouseStatistics;
		
		mouseStatistics.sid = mouseBehaviourItem._id.sid;
		mouseStatistics.url = mouseBehaviourItem._id.url;
		
		printjson(mouseStatistics);
		print(",");

	}
	print("]");
}


function printMouseEpisodeDuration(){
	
	//////We need to load the constants file
	load("MapReduceConstants.js");
	
	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.mouseBehaviourSkinny.find().toArray();
	
	print("[");
	for (var i = 0; i < userBehaviourList.length; i++){
		mouseBehaviourItem = userBehaviourList[i];

		var episodeDuration = {
			sid : mouseBehaviourItem._id.sid,
			url : mouseBehaviourItem._id.url,
			episodeDurationms : mouseBehaviourItem.value.episodeDurationms,
			
			sdSessionCounter : mouseBehaviourItem.value.mouseStatistics.sdSessionCounter,
			sdTimeSinceLastSession : mouseBehaviourItem.value.mouseStatistics.sdTimeSinceLastSession,
			urlSessionCounter : mouseBehaviourItem.value.mouseStatistics.urlSessionCounter,
			urlSinceLastSession : mouseBehaviourItem.value.mouseStatistics.urlSinceLastSession,
			urlEpisodeLength: mouseBehaviourItem.value.mouseStatistics.urlEpisodeLength,

		};
		
		printjson(episodeDuration);
		print(",");
	}
	print("]");
}

function printMouseEpisodeDurationBatchedPerUser(startPercent,endPercent){
	
	//////We need to load the constants file
	load("MapReduceConstants.js");
	
	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.mouseBehaviourSkinny.find().toArray();
	
	startIndex = (userBehaviourList.length/100) * startPercent;
	startIndex = Math.floor(startIndex);
	
	endIndex = (userBehaviourList.length/100) * endPercent;
	endIndex = Math.floor(endIndex);
	
	print("[");
	for (var i = startIndex; i < endIndex; i++){
		mouseBehaviourItem = userBehaviourList[i];

		var episodeDuration = {
			sid : mouseBehaviourItem._id.sid,
			url : mouseBehaviourItem._id.url,
			episodeDurationms : mouseBehaviourItem.value.episodeDurationms,
			
			sdSessionCounter : mouseBehaviourItem.value.mouseStatistics.sdSessionCounter,
			sdTimeSinceLastSession : mouseBehaviourItem.value.mouseStatistics.sdTimeSinceLastSession,
			urlSessionCounter : mouseBehaviourItem.value.mouseStatistics.urlSessionCounter,
			urlSinceLastSession : mouseBehaviourItem.value.mouseStatistics.urlSinceLastSession,
			urlEpisodeLength: mouseBehaviourItem.value.mouseStatistics.urlEpisodeLength,

		};
		
		printjson(episodeDuration);
		print(",");
	}
	print("]");
}

///////////START OF MOUSE BEHAVIOURS//////////
function printClickSpeed(){
	
	//////We need to load the constants file
	load("MapReduceConstants.js");
	
	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.mouseBehaviourSkinny.find().toArray();
	
	print("[");
	for (var i = 0; i < userBehaviourList.length; i++){
		mouseBehaviourItemList = userBehaviourList[i].value.clickSpeed;
		
		var sid = userBehaviourList[i]._id.sid;
		var url = userBehaviourList[i]._id.url;
		var urlSessionCounter = userBehaviourList[i]._id.urlSessionCounter;


		for (var j = 0; j < mouseBehaviourItemList.length; j++){
			mouseBehaviourItem = mouseBehaviourItemList[j];
			
			mouseBehaviourItem.sid = sid;
			mouseBehaviourItem.url = url;
			mouseBehaviourItem.urlSessionCounter = urlSessionCounter;
			
			printjson(mouseBehaviourItem);
			print(",");
		}
	}
	print("]");
}

function printClickSpeedBatchedPerUser(startPercent,endPercent){
	
	//////We need to load the constants file
	load("MapReduceConstants.js");
	
	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.mouseBehaviourSkinny.find().toArray();
	
	startIndex = (userBehaviourList.length/100) * startPercent;
	startIndex = Math.floor(startIndex);
	
	endIndex = (userBehaviourList.length/100) * endPercent;
	endIndex = Math.floor(endIndex);
	
	print("[");
	for (var i = startIndex; i < endIndex; i++){
		mouseBehaviourItemList = userBehaviourList[i].value.clickSpeed;
		
		var sid = userBehaviourList[i]._id.sid;
		var url = userBehaviourList[i]._id.url;
		var urlSessionCounter = userBehaviourList[i]._id.urlSessionCounter;


		for (var j = 0; j < mouseBehaviourItemList.length; j++){
			mouseBehaviourItem = mouseBehaviourItemList[j];
			
			mouseBehaviourItem.sid = sid;
			mouseBehaviourItem.url = url;
			mouseBehaviourItem.urlSessionCounter = urlSessionCounter;
			
			printjson(mouseBehaviourItem);
			print(",");
		}
	}
	print("]");
}


function printMouseIdleTime(){
	
	//////We need to load the constants file
	load("MapReduceConstants.js");
	
	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.mouseBehaviourSkinny.find().toArray();
	
	print("[");
	for (var i = 0; i < userBehaviourList.length; i++){
		mouseBehaviourItemList = userBehaviourList[i].value.idleTime;
		
		var sid = userBehaviourList[i]._id.sid;
		var url = userBehaviourList[i]._id.url;
		var urlSessionCounter = userBehaviourList[i]._id.urlSessionCounter;
		
		for (var j = 0; j < mouseBehaviourItemList.length; j++){
			mouseBehaviourItem = mouseBehaviourItemList[j];
			
			mouseBehaviourItem.sid = sid;
			mouseBehaviourItem.url = url;
			mouseBehaviourItem.urlSessionCounter = urlSessionCounter;
			
			printjson(mouseBehaviourItem);
			print(",");
		}
	}
	print("]");
}

/**
 * This is a slower alternative to printMouseIdleTime, but makes sure we don't run out of memory.
 * 
 * IMPORTANT!!! The paremeters are percentages, calling this function as (0,25) will print the first quarter of users
 */ 
function printMouseIdleTimeBatchedPerUser(startPercent,endPercent){
	
	//////We need to load the constants file
	load("MapReduceConstants.js");
	
	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.mouseBehaviourSkinny.find().toArray();
	
	
	startIndex = (userBehaviourList.length/100) * startPercent;
	startIndex = Math.floor(startIndex);
	
	endIndex = (userBehaviourList.length/100) * endPercent;
	endIndex = Math.floor(endIndex);

	
	print("[");
	for (var i = startIndex; i < endIndex; i++){
		
		

		mouseBehaviourItemList = userBehaviourList[i].value.idleTime;
		
		var sid = userBehaviourList[i]._id.sid;
		var url = userBehaviourList[i]._id.url;
		var urlSessionCounter = userBehaviourList[i]._id.urlSessionCounter;
		
		for (var j = 0; j < mouseBehaviourItemList.length; j++){
			mouseBehaviourItem = mouseBehaviourItemList[j];
			
			mouseBehaviourItem.sid = sid;
			mouseBehaviourItem.url = url;
			mouseBehaviourItem.urlSessionCounter = urlSessionCounter;
			
			printjson(mouseBehaviourItem);
			print(",");
		}
	}
	print("]");
}

function printTimeToClick(){
	
	//////We need to load the constants file
	load("MapReduceConstants.js");
	
	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.mouseBehaviourSkinny.find().toArray();
	
	print("[");
	for (var i = 0; i < userBehaviourList.length; i++){
		mouseBehaviourItemList = userBehaviourList[i].value.timeToClick;
		
		var sid = userBehaviourList[i]._id.sid;
		var url = userBehaviourList[i]._id.url;
		var urlSessionCounter = userBehaviourList[i]._id.urlSessionCounter;
		
		for (var j = 0; j < mouseBehaviourItemList.length; j++){
			mouseBehaviourItem = mouseBehaviourItemList[j];		

			mouseBehaviourItem.sid = sid;
			mouseBehaviourItem.url = url;
			mouseBehaviourItem.urlSessionCounter = urlSessionCounter;
			
			printjson(mouseBehaviourItem);
			print(",");
		}
	}
	print("]");
}

function printTimeToClickBatchedPerUser(startPercent,endPercent){
	
	//////We need to load the constants file
	load("MapReduceConstants.js");
	
	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.mouseBehaviourSkinny.find().toArray();
	
	startIndex = (userBehaviourList.length/100) * startPercent;
	startIndex = Math.floor(startIndex);
	
	endIndex = (userBehaviourList.length/100) * endPercent;
	endIndex = Math.floor(endIndex);
	
	print("[");
	for (var i = startIndex; i < endIndex; i++){
		mouseBehaviourItemList = userBehaviourList[i].value.timeToClick;
		
		var sid = userBehaviourList[i]._id.sid;
		var url = userBehaviourList[i]._id.url;
		var urlSessionCounter = userBehaviourList[i]._id.urlSessionCounter;
		
		for (var j = 0; j < mouseBehaviourItemList.length; j++){
			mouseBehaviourItem = mouseBehaviourItemList[j];		

			mouseBehaviourItem.sid = sid;
			mouseBehaviourItem.url = url;
			mouseBehaviourItem.urlSessionCounter = urlSessionCounter;
			
			printjson(mouseBehaviourItem);
			print(",");
		}
	}
	print("]");
}


function printHoveringOver(){
	
	//////We need to load the constants file
	load("MapReduceConstants.js");
	
	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.mouseBehaviourSkinny.find().toArray();
	
	print("[");
	for (var i = 0; i < userBehaviourList.length; i++){
		mouseBehaviourItemList = userBehaviourList[i].value.hoveringOver;
		
		var sid = userBehaviourList[i]._id.sid;
		var url = userBehaviourList[i]._id.url;
		var urlSessionCounter = userBehaviourList[i]._id.urlSessionCounter;
		
		for (var j = 0; j < mouseBehaviourItemList.length; j++){
			mouseBehaviourItem = mouseBehaviourItemList[j];		

			mouseBehaviourItem.sid = sid;
			mouseBehaviourItem.url = url;
			mouseBehaviourItem.urlSessionCounter = urlSessionCounter;
			
			printjson(mouseBehaviourItem);
			print(",");
		}
	}
	print("]");
}


function printUnintentionalMousemovement(){
	
	//////We need to load the constants file
	load("MapReduceConstants.js");
	
	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.mouseBehaviourSkinny.find().toArray();
	
	print("[");
	for (var i = 0; i < userBehaviourList.length; i++){
		mouseBehaviourItemList = userBehaviourList[i].value.unintentionalMousemovement;
		
		var sid = userBehaviourList[i]._id.sid;
		var url = userBehaviourList[i]._id.url;
		var urlSessionCounter = userBehaviourList[i]._id.urlSessionCounter;
		
		for (var j = 0; j < mouseBehaviourItemList.length; j++){
			mouseBehaviourItem = mouseBehaviourItemList[j];		

			mouseBehaviourItem.sid = sid;
			mouseBehaviourItem.url = url;
			mouseBehaviourItem.urlSessionCounter = urlSessionCounter;
			
			printjson(mouseBehaviourItem);
			print(",");
		}
	}
	print("]");
}
function printUnintentionalMousemovementBatchedPerUser(startPercent,endPercent){
	
	//////We need to load the constants file
	load("MapReduceConstants.js");
	
	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.mouseBehaviourSkinny.find().toArray();
	
	startIndex = (userBehaviourList.length/100) * startPercent;
	startIndex = Math.floor(startIndex);
	
	endIndex = (userBehaviourList.length/100) * endPercent;
	endIndex = Math.floor(endIndex);
	
	print("[");
	for (var i = startIndex; i < endIndex; i++){
		mouseBehaviourItemList = userBehaviourList[i].value.unintentionalMousemovement;
		
		var sid = userBehaviourList[i]._id.sid;
		var url = userBehaviourList[i]._id.url;
		var urlSessionCounter = userBehaviourList[i]._id.urlSessionCounter;
		
		for (var j = 0; j < mouseBehaviourItemList.length; j++){
			mouseBehaviourItem = mouseBehaviourItemList[j];		

			mouseBehaviourItem.sid = sid;
			mouseBehaviourItem.url = url;
			mouseBehaviourItem.urlSessionCounter = urlSessionCounter;
			
			printjson(mouseBehaviourItem);
			print(",");
		}
	}
	print("]");
}


function printFailToClick(){
	
	//////We need to load the constants file
	load("MapReduceConstants.js");
	
	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.mouseBehaviourSkinny.find().toArray();
	
	print("[");
	for (var i = 0; i < userBehaviourList.length; i++){
		mouseBehaviourItemList = userBehaviourList[i].value.failToClick;
		
		var sid = userBehaviourList[i]._id.sid;
		var url = userBehaviourList[i]._id.url;
		var urlSessionCounter = userBehaviourList[i]._id.urlSessionCounter;
		
		for (var j = 0; j < mouseBehaviourItemList.length; j++){
			mouseBehaviourItem = mouseBehaviourItemList[j];		

			mouseBehaviourItem.sid = sid;
			mouseBehaviourItem.url = url;
			mouseBehaviourItem.urlSessionCounter = urlSessionCounter;
			
			printjson(mouseBehaviourItem);
			print(",");
		}
	}
	print("]");
}

function printFailToClickBatchedPerUser(startPercent,endPercent){
	
	//////We need to load the constants file
	load("MapReduceConstants.js");
	
	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.mouseBehaviourSkinny.find().toArray();
	
	startIndex = (userBehaviourList.length/100) * startPercent;
	startIndex = Math.floor(startIndex);
	
	endIndex = (userBehaviourList.length/100) * endPercent;
	endIndex = Math.floor(endIndex);
	
	print("[");
	for (var i = startIndex; i < endIndex; i++){
		mouseBehaviourItemList = userBehaviourList[i].value.failToClick;
		
		var sid = userBehaviourList[i]._id.sid;
		var url = userBehaviourList[i]._id.url;
		var urlSessionCounter = userBehaviourList[i]._id.urlSessionCounter;
		
		for (var j = 0; j < mouseBehaviourItemList.length; j++){
			mouseBehaviourItem = mouseBehaviourItemList[j];		

			mouseBehaviourItem.sid = sid;
			mouseBehaviourItem.url = url;
			mouseBehaviourItem.urlSessionCounter = urlSessionCounter;
			
			printjson(mouseBehaviourItem);
			print(",");
		}
	}
	print("]");
}



function printIdleAfterClick(){
	
	//////We need to load the constants file
	load("MapReduceConstants.js");
	
	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.mouseBehaviourSkinny.find().toArray();
	
	print("[");
	for (var i = 0; i < userBehaviourList.length; i++){
		mouseBehaviourItemList = userBehaviourList[i].value.idleAfterClick;
		
		var sid = userBehaviourList[i]._id.sid;
		var url = userBehaviourList[i]._id.url;
		var urlSessionCounter = userBehaviourList[i]._id.urlSessionCounter;
		
		for (var j = 0; j < mouseBehaviourItemList.length; j++){
			mouseBehaviourItem = mouseBehaviourItemList[j];		

			mouseBehaviourItem.sid = sid;
			mouseBehaviourItem.url = url;
			mouseBehaviourItem.urlSessionCounter = urlSessionCounter;
			
			printjson(mouseBehaviourItem);
			print(",");
		}
	}
	print("]");
}

function printIdleAfterClickBatchedPerUser(startPercent,endPercent){
	
	//////We need to load the constants file
	load("MapReduceConstants.js");
	
	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.mouseBehaviourSkinny.find().toArray();
	
	startIndex = (userBehaviourList.length/100) * startPercent;
	startIndex = Math.floor(startIndex);
	
	endIndex = (userBehaviourList.length/100) * endPercent;
	endIndex = Math.floor(endIndex);
	
	print("[");
	for (var i = startIndex; i < endIndex; i++){
		mouseBehaviourItemList = userBehaviourList[i].value.idleAfterClick;
		
		var sid = userBehaviourList[i]._id.sid;
		var url = userBehaviourList[i]._id.url;
		var urlSessionCounter = userBehaviourList[i]._id.urlSessionCounter;
		
		for (var j = 0; j < mouseBehaviourItemList.length; j++){
			mouseBehaviourItem = mouseBehaviourItemList[j];		

			mouseBehaviourItem.sid = sid;
			mouseBehaviourItem.url = url;
			mouseBehaviourItem.urlSessionCounter = urlSessionCounter;
			
			printjson(mouseBehaviourItem);
			print(",");
		}
	}
	print("]");
}


function printLackOfMousePrecision(){
	
	//////We need to load the constants file
	load("MapReduceConstants.js");
	
	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.mouseBehaviourSkinny.find().toArray();
	
	print("[");
	for (var i = 0; i < userBehaviourList.length; i++){
		mouseBehaviourItemList = userBehaviourList[i].value.lackOfMousePrecision;
		
		var sid = userBehaviourList[i]._id.sid;
		var url = userBehaviourList[i]._id.url;
		var urlSessionCounter = userBehaviourList[i]._id.urlSessionCounter;
		
		for (var j = 0; j < mouseBehaviourItemList.length; j++){
			mouseBehaviourItem = mouseBehaviourItemList[j];		

			mouseBehaviourItem.sid = sid;
			mouseBehaviourItem.url = url;
			mouseBehaviourItem.urlSessionCounter = urlSessionCounter;
			
			printjson(mouseBehaviourItem);
			print(",");
		}
	}
	print("]");
}

function printLackOfMousePrecisionBatchedPerUser(startPercent,endPercent){
	
	//////We need to load the constants file
	load("MapReduceConstants.js");
	
	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.mouseBehaviourSkinny.find().toArray();
	
	startIndex = (userBehaviourList.length/100) * startPercent;
	startIndex = Math.floor(startIndex);
	
	endIndex = (userBehaviourList.length/100) * endPercent;
	endIndex = Math.floor(endIndex);
	
	print("[");
	for (var i = startIndex; i < endIndex; i++){
		mouseBehaviourItemList = userBehaviourList[i].value.lackOfMousePrecision;
		
		var sid = userBehaviourList[i]._id.sid;
		var url = userBehaviourList[i]._id.url;
		var urlSessionCounter = userBehaviourList[i]._id.urlSessionCounter;
		
		for (var j = 0; j < mouseBehaviourItemList.length; j++){
			mouseBehaviourItem = mouseBehaviourItemList[j];		

			mouseBehaviourItem.sid = sid;
			mouseBehaviourItem.url = url;
			mouseBehaviourItem.urlSessionCounter = urlSessionCounter;
			
			printjson(mouseBehaviourItem);
			print(",");
		}
	}
	print("]");
}


function printRepeatedClicks(){
	
	//////We need to load the constants file
	load("MapReduceConstants.js");
	
	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.mouseBehaviourSkinny.find().toArray();
	
	print("[");
	for (var i = 0; i < userBehaviourList.length; i++){
		mouseBehaviourItemList = userBehaviourList[i].value.repeatedClicks;
		
		var sid = userBehaviourList[i]._id.sid;
		var url = userBehaviourList[i]._id.url;
		var urlSessionCounter = userBehaviourList[i]._id.urlSessionCounter;
		
		for (var j = 0; j < mouseBehaviourItemList.length; j++){
			mouseBehaviourItem = mouseBehaviourItemList[j];		

			mouseBehaviourItem.sid = sid;
			mouseBehaviourItem.url = url;
			mouseBehaviourItem.urlSessionCounter = urlSessionCounter;
			
			printjson(mouseBehaviourItem);
			print(",");
		}
	}
	print("]");
}


function printRepeatedClicksBatchedPerUser(startPercent,endPercent){
	
	//////We need to load the constants file
	load("MapReduceConstants.js");
	
	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.mouseBehaviourSkinny.find().toArray();
	
	startIndex = (userBehaviourList.length/100) * startPercent;
	startIndex = Math.floor(startIndex);
	
	endIndex = (userBehaviourList.length/100) * endPercent;
	endIndex = Math.floor(endIndex);
	
	print("[");
	for (var i = startIndex; i < endIndex; i++){
		mouseBehaviourItemList = userBehaviourList[i].value.repeatedClicks;
		
		var sid = userBehaviourList[i]._id.sid;
		var url = userBehaviourList[i]._id.url;
		var urlSessionCounter = userBehaviourList[i]._id.urlSessionCounter;
		
		for (var j = 0; j < mouseBehaviourItemList.length; j++){
			mouseBehaviourItem = mouseBehaviourItemList[j];		

			mouseBehaviourItem.sid = sid;
			mouseBehaviourItem.url = url;
			mouseBehaviourItem.urlSessionCounter = urlSessionCounter;
			
			printjson(mouseBehaviourItem);
			print(",");
		}
	}
	print("]");
}



function printFailToClickDiffNode(){
	
	//////We need to load the constants file
	load("MapReduceConstants.js");
	
	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.mouseBehaviourSkinny.find().toArray();
	
	print("[");
	for (var i = 0; i < userBehaviourList.length; i++){
		mouseBehaviourItemList = userBehaviourList[i].value.failToClickDiffNode;
		
		var sid = userBehaviourList[i]._id.sid;
		var url = userBehaviourList[i]._id.url;
		var urlSessionCounter = userBehaviourList[i]._id.urlSessionCounter;
		
		for (var j = 0; j < mouseBehaviourItemList.length; j++){
			mouseBehaviourItem = mouseBehaviourItemList[j];		

			mouseBehaviourItem.sid = sid;
			mouseBehaviourItem.url = url;
			mouseBehaviourItem.urlSessionCounter = urlSessionCounter;
			
			printjson(mouseBehaviourItem);
			print(",");
		}
	}
	print("]");
}

function printFailToClickDiffNodeBatchedPerUser(startPercent,endPercent){
	
	//////We need to load the constants file
	load("MapReduceConstants.js");
	
	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.mouseBehaviourSkinny.find().toArray();
	
	startIndex = (userBehaviourList.length/100) * startPercent;
	startIndex = Math.floor(startIndex);
	
	endIndex = (userBehaviourList.length/100) * endPercent;
	endIndex = Math.floor(endIndex);
	
	print("[");
	for (var i = startIndex; i < endIndex; i++){
		mouseBehaviourItemList = userBehaviourList[i].value.failToClickDiffNode;
		
		var sid = userBehaviourList[i]._id.sid;
		var url = userBehaviourList[i]._id.url;
		var urlSessionCounter = userBehaviourList[i]._id.urlSessionCounter;
		
		for (var j = 0; j < mouseBehaviourItemList.length; j++){
			mouseBehaviourItem = mouseBehaviourItemList[j];		

			mouseBehaviourItem.sid = sid;
			mouseBehaviourItem.url = url;
			mouseBehaviourItem.urlSessionCounter = urlSessionCounter;
			
			printjson(mouseBehaviourItem);
			print(",");
		}
	}
	print("]");
}


function printFailToClickIgnoreNode(){
	
	//////We need to load the constants file
	load("MapReduceConstants.js");
	
	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.mouseBehaviourSkinny.find().toArray();
	
	print("[");
	for (var i = 0; i < userBehaviourList.length; i++){
		mouseBehaviourItemList = userBehaviourList[i].value.failToClickIgnoreNode;
		
		var sid = userBehaviourList[i]._id.sid;
		var url = userBehaviourList[i]._id.url;
		var urlSessionCounter = userBehaviourList[i]._id.urlSessionCounter;
		
		for (var j = 0; j < mouseBehaviourItemList.length; j++){
			mouseBehaviourItem = mouseBehaviourItemList[j];		

			mouseBehaviourItem.sid = sid;
			mouseBehaviourItem.url = url;
			mouseBehaviourItem.urlSessionCounter = urlSessionCounter;
			
			printjson(mouseBehaviourItem);
			print(",");
		}
	}
	print("]");
}

function printFailToClickIgnoreNodeBatchedPerUser(startPercent,endPercent){
	
	//////We need to load the constants file
	load("MapReduceConstants.js");
	
	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.mouseBehaviourSkinny.find().toArray();
	
	startIndex = (userBehaviourList.length/100) * startPercent;
	startIndex = Math.floor(startIndex);
	
	endIndex = (userBehaviourList.length/100) * endPercent;
	endIndex = Math.floor(endIndex);
	
	print("[");
	for (var i = startIndex; i < endIndex; i++){
		mouseBehaviourItemList = userBehaviourList[i].value.failToClickIgnoreNode;
		
		var sid = userBehaviourList[i]._id.sid;
		var url = userBehaviourList[i]._id.url;
		var urlSessionCounter = userBehaviourList[i]._id.urlSessionCounter;
		
		for (var j = 0; j < mouseBehaviourItemList.length; j++){
			mouseBehaviourItem = mouseBehaviourItemList[j];		

			mouseBehaviourItem.sid = sid;
			mouseBehaviourItem.url = url;
			mouseBehaviourItem.urlSessionCounter = urlSessionCounter;
			
			printjson(mouseBehaviourItem);
			print(",");
		}
	}
	print("]");
}


function printClickAfterLoad(){
	
	//////We need to load the constants file
	load("MapReduceConstants.js");
	
	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.mouseBehaviourSkinny.find().toArray();
	
	print("[");
	for (var i = 0; i < userBehaviourList.length; i++){
		mouseBehaviourItemList = userBehaviourList[i].value.clickAfterLoad;
		
		var sid = userBehaviourList[i]._id.sid;
		var url = userBehaviourList[i]._id.url;
		var urlSessionCounter = userBehaviourList[i]._id.urlSessionCounter;
		
		for (var j = 0; j < mouseBehaviourItemList.length; j++){
			mouseBehaviourItem = mouseBehaviourItemList[j];		

			mouseBehaviourItem.sid = sid;
			mouseBehaviourItem.url = url;
			mouseBehaviourItem.urlSessionCounter = urlSessionCounter;
			
			printjson(mouseBehaviourItem);
			print(",");
		}
	}
	print("]");
}


function printClickAfterLoadBatchedPerUser(startPercent,endPercent){
	
	//////We need to load the constants file
	load("MapReduceConstants.js");
	
	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.mouseBehaviourSkinny.find().toArray();
	
	startIndex = (userBehaviourList.length/100) * startPercent;
	startIndex = Math.floor(startIndex);
	
	endIndex = (userBehaviourList.length/100) * endPercent;
	endIndex = Math.floor(endIndex);
	
	print("[");
	for (var i = startIndex; i < endIndex; i++){
		mouseBehaviourItemList = userBehaviourList[i].value.clickAfterLoad;
		
		var sid = userBehaviourList[i]._id.sid;
		var url = userBehaviourList[i]._id.url;
		var urlSessionCounter = userBehaviourList[i]._id.urlSessionCounter;
		
		for (var j = 0; j < mouseBehaviourItemList.length; j++){
			mouseBehaviourItem = mouseBehaviourItemList[j];		

			mouseBehaviourItem.sid = sid;
			mouseBehaviourItem.url = url;
			mouseBehaviourItem.urlSessionCounter = urlSessionCounter;
			
			printjson(mouseBehaviourItem);
			print(",");
		}
	}
	print("]");
}
