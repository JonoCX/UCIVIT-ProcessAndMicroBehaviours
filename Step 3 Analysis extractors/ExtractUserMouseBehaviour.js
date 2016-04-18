/**
 * Prints user MouseBehaviours
 * 
 * To run it:
 * mongo localhost/testdb ExtractUserMouseBehaviour.js > scrollFeatures.json
 * 
 */ 

/**
 * This function will retrieve the mouseStatistics, inject the userId, and then print it out.
 * Best way to use it is:
 * mongo localhost/testdb --eval "load('ExtractUserMouseBehaviour.js');printScrollStatistics();" > mouseStatistics.json
 */
function printMouseStatistics(){
	
	//////We need to load the constants file
	load("MapReduceConstants.js");
	
	var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);


	var userBehaviourList = db.mouseBehaviour.find().toArray();
	
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


function printMouseEpisodeDuration(){
	
	//////We need to load the constants file
	load("MapReduceConstants.js");
	
	var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);

	var userBehaviourList = db.mouseBehaviour.find().toArray();
	
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
	
	var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);

	var userBehaviourList = db.mouseBehaviour.find().toArray();
	
	print("[");
	for (var i = 0; i < userBehaviourList.length; i++){
		mouseBehaviourItemList = userBehaviourList[i].value.clickSpeed;
		
		var sid = userBehaviourList[i]._id.sid;
		var url = userBehaviourList[i]._id.url;

		for (var j = 0; j < mouseBehaviourItemList.length; j++){
			mouseBehaviourItem = mouseBehaviourItemList[j];
			
			mouseBehaviourItem.sid = sid;
			mouseBehaviourItem.url = url;
			
			printjson(mouseBehaviourItem);
			print(",");
		}
	}
	print("]");
}


function printMouseIdleTime(){
	
	//////We need to load the constants file
	load("MapReduceConstants.js");
	
	var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);

	var userBehaviourList = db.mouseBehaviour.find().toArray();
	
	print("[");
	for (var i = 0; i < userBehaviourList.length; i++){
		mouseBehaviourItemList = userBehaviourList[i].value.mouseIdleTime;
		
		var sid = userBehaviourList[i]._id.sid;
		var url = userBehaviourList[i]._id.url;
		
		for (var j = 0; j < mouseBehaviourItemList.length; j++){
			mouseBehaviourItem = mouseBehaviourItemList[j];
			
			mouseBehaviourItem.sid = sid;
			mouseBehaviourItem.url = url;
			
			printjson(mouseBehaviourItem);
			print(",");
		}
	}
	print("]");
}


function printTimeToClick(){
	
	//////We need to load the constants file
	load("MapReduceConstants.js");
	
	var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);

	var userBehaviourList = db.mouseBehaviour.find().toArray();
	
	print("[");
	for (var i = 0; i < userBehaviourList.length; i++){
		mouseBehaviourItemList = userBehaviourList[i].value.timeToClick;
		
		var sid = userBehaviourList[i]._id.sid;
		var url = userBehaviourList[i]._id.url;
		
		for (var j = 0; j < mouseBehaviourItemList.length; j++){
			mouseBehaviourItem = mouseBehaviourItemList[j];		

			mouseBehaviourItem.sid = sid;
			mouseBehaviourItem.url = url;
			
			printjson(mouseBehaviourItem);
			print(",");
		}
	}
	print("]");
}


function printHoveringOver(){
	
	//////We need to load the constants file
	load("MapReduceConstants.js");
	
	var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);

	var userBehaviourList = db.mouseBehaviour.find().toArray();
	
	print("[");
	for (var i = 0; i < userBehaviourList.length; i++){
		mouseBehaviourItemList = userBehaviourList[i].value.hoveringOver;
		
		var sid = userBehaviourList[i]._id.sid;
		var url = userBehaviourList[i]._id.url;
		
		for (var j = 0; j < mouseBehaviourItemList.length; j++){
			mouseBehaviourItem = mouseBehaviourItemList[j];		

			mouseBehaviourItem.sid = sid;
			mouseBehaviourItem.url = url;
			
			printjson(mouseBehaviourItem);
			print(",");
		}
	}
	print("]");
}


function printUnintentionalMousemovement(){
	
	//////We need to load the constants file
	load("MapReduceConstants.js");
	
	var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);

	var userBehaviourList = db.mouseBehaviour.find().toArray();
	
	print("[");
	for (var i = 0; i < userBehaviourList.length; i++){
		mouseBehaviourItemList = userBehaviourList[i].value.unintentionalMousemovement;
		
		var sid = userBehaviourList[i]._id.sid;
		var url = userBehaviourList[i]._id.url;
		
		for (var j = 0; j < mouseBehaviourItemList.length; j++){
			mouseBehaviourItem = mouseBehaviourItemList[j];		

			mouseBehaviourItem.sid = sid;
			mouseBehaviourItem.url = url;
			
			printjson(mouseBehaviourItem);
			print(",");
		}
	}
	print("]");
}


function printFailToClick(){
	
	//////We need to load the constants file
	load("MapReduceConstants.js");
	
	var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);

	var userBehaviourList = db.mouseBehaviour.find().toArray();
	
	print("[");
	for (var i = 0; i < userBehaviourList.length; i++){
		mouseBehaviourItemList = userBehaviourList[i].value.failToClick;
		
		var sid = userBehaviourList[i]._id.sid;
		var url = userBehaviourList[i]._id.url;
		
		for (var j = 0; j < mouseBehaviourItemList.length; j++){
			mouseBehaviourItem = mouseBehaviourItemList[j];		

			mouseBehaviourItem.sid = sid;
			mouseBehaviourItem.url = url;
			
			printjson(mouseBehaviourItem);
			print(",");
		}
	}
	print("]");
}



function printIdleAfterClick(){
	
	//////We need to load the constants file
	load("MapReduceConstants.js");
	
	var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);

	var userBehaviourList = db.mouseBehaviour.find().toArray();
	
	print("[");
	for (var i = 0; i < userBehaviourList.length; i++){
		mouseBehaviourItemList = userBehaviourList[i].value.idleAfterClick;
		
		var sid = userBehaviourList[i]._id.sid;
		var url = userBehaviourList[i]._id.url;
		
		for (var j = 0; j < mouseBehaviourItemList.length; j++){
			mouseBehaviourItem = mouseBehaviourItemList[j];		

			mouseBehaviourItem.sid = sid;
			mouseBehaviourItem.url = url;
			
			printjson(mouseBehaviourItem);
			print(",");
		}
	}
	print("]");
}


function printLackOfMousePrecision(){
	
	//////We need to load the constants file
	load("MapReduceConstants.js");
	
	var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);

	var userBehaviourList = db.mouseBehaviour.find().toArray();
	
	print("[");
	for (var i = 0; i < userBehaviourList.length; i++){
		mouseBehaviourItemList = userBehaviourList[i].value.lackOfMousePrecision;
		
		var sid = userBehaviourList[i]._id.sid;
		var url = userBehaviourList[i]._id.url;
		
		for (var j = 0; j < mouseBehaviourItemList.length; j++){
			mouseBehaviourItem = mouseBehaviourItemList[j];		

			mouseBehaviourItem.sid = sid;
			mouseBehaviourItem.url = url;
			
			printjson(mouseBehaviourItem);
			print(",");
		}
	}
	print("]");
}


function printRepeatedClicks(){
	
	//////We need to load the constants file
	load("MapReduceConstants.js");
	
	var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);

	var userBehaviourList = db.mouseBehaviour.find().toArray();
	
	print("[");
	for (var i = 0; i < userBehaviourList.length; i++){
		mouseBehaviourItemList = userBehaviourList[i].value.repeatedClicks;
		
		var sid = userBehaviourList[i]._id.sid;
		var url = userBehaviourList[i]._id.url;
		
		for (var j = 0; j < mouseBehaviourItemList.length; j++){
			mouseBehaviourItem = mouseBehaviourItemList[j];		

			mouseBehaviourItem.sid = sid;
			mouseBehaviourItem.url = url;
			
			printjson(mouseBehaviourItem);
			print(",");
		}
	}
	print("]");
}



function printFailToClickDiffNode(){
	
	//////We need to load the constants file
	load("MapReduceConstants.js");
	
	var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);

	var userBehaviourList = db.mouseBehaviour.find().toArray();
	
	print("[");
	for (var i = 0; i < userBehaviourList.length; i++){
		mouseBehaviourItemList = userBehaviourList[i].value.failToClickDiffNode;
		
		var sid = userBehaviourList[i]._id.sid;
		var url = userBehaviourList[i]._id.url;
		
		for (var j = 0; j < mouseBehaviourItemList.length; j++){
			mouseBehaviourItem = mouseBehaviourItemList[j];		

			mouseBehaviourItem.sid = sid;
			mouseBehaviourItem.url = url;
			
			printjson(mouseBehaviourItem);
			print(",");
		}
	}
	print("]");
}


function printFailToClickIgnoreNode(){
	
	//////We need to load the constants file
	load("MapReduceConstants.js");
	
	var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);

	var userBehaviourList = db.mouseBehaviour.find().toArray();
	
	print("[");
	for (var i = 0; i < userBehaviourList.length; i++){
		mouseBehaviourItemList = userBehaviourList[i].value.failToClickIgnoreNode;
		
		var sid = userBehaviourList[i]._id.sid;
		var url = userBehaviourList[i]._id.url;
		
		for (var j = 0; j < mouseBehaviourItemList.length; j++){
			mouseBehaviourItem = mouseBehaviourItemList[j];		

			mouseBehaviourItem.sid = sid;
			mouseBehaviourItem.url = url;
			
			printjson(mouseBehaviourItem);
			print(",");
		}
	}
	print("]");
}
