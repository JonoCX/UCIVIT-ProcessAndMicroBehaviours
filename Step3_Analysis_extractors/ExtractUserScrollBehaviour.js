/**
 * Prints userScrollBehaviours
 *
 * To run it:
 * mongo localhost/testdb ExtractUserScrollBehaviour.js > scrollFeatures.json
 *
 */

 /**
  * Extra function to check if a json object is empty or not.
  * It will help printing out empty objects which break the csv transformation
  */
 function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true;
}

/**
 * This function will retrieve the scrollStatistics, inject the userId, and then print it out.
 * Best way to use it is:
 * mongo localhost/testdb --eval "load('ExtractUserScrollBehaviour.js');printScrollStatistics();" > scrollStatistics.json
 */
function printScrollStatistics(){

	//////We need to load the constants file
	load("../MapReduceConstants.js");

	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.scrollBehaviour.find().toArray();

	print("[");
	for (var i = 0; i < userBehaviourList.length; i++){
		scrollBehaviourItem = userBehaviourList[i];

		var scrollStatistics = scrollBehaviourItem.value.scrollStatistics;

		scrollStatistics.sid = scrollBehaviourItem._id.sid;
		scrollStatistics.url = scrollBehaviourItem._id.url;

		scrollStatistics.sessionstartms = scrollBehaviourItem.value.generalStatistics.previousvalueObject.sessionstartms;

		if (!isEmpty(scrollStatistics)){
			printjson(scrollStatistics);
			print(",");
		}

	}
	print("]");
}

function printScrollStatisticsBatchedPerUser(startPercent,endPercent){

	//////We need to load the constants file
	load("../MapReduceConstants.js");

	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.scrollBehaviour.find().toArray();

	startIndex = (userBehaviourList.length/100) * startPercent;
	startIndex = Math.floor(startIndex);

	endIndex = (userBehaviourList.length/100) * endPercent;
	endIndex = Math.floor(endIndex);

	print("[");
	for (var i = startIndex; i < endIndex; i++){
		scrollBehaviourItem = userBehaviourList[i];

		var scrollStatistics = scrollBehaviourItem.value.scrollStatistics;

		scrollStatistics.sid = scrollBehaviourItem._id.sid;
		scrollStatistics.url = scrollBehaviourItem._id.url;

		scrollStatistics.sessionstartms = scrollBehaviourItem.value.generalStatistics.previousvalueObject.sessionstartms;

		if (!isEmpty(scrollStatistics)){
			printjson(scrollStatistics);
			print(",");
		}

	}
	print("]");
}


function printScrollEpisodeDuration(){

	//////We need to load the constants file
	load("../MapReduceConstants.js");

	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.scrollBehaviour.find().toArray();

	print("[");
	for (var i = 0; i < userBehaviourList.length; i++){
		scrollBehaviourItem = userBehaviourList[i];

		var episodeDuration = {
			sid:scrollBehaviourItem._id.sid,
			url : scrollBehaviourItem._id.url,
			episodeDurationms:scrollBehaviourItem.value.episodeDurationms,

			sdSessionCounter : scrollBehaviourItem.value.scrollStatistics.sdSessionCounter,
			sdTimeSinceLastSession : scrollBehaviourItem.value.scrollStatistics.sdTimeSinceLastSession,
			urlSessionCounter : scrollBehaviourItem.value.scrollStatistics.urlSessionCounter,
			urlSinceLastSession : scrollBehaviourItem.value.scrollStatistics.urlSinceLastSession,
			urlEpisodeLength: scrollBehaviourItem.value.scrollStatistics.urlEpisodeLength,
		};

		if (!isEmpty(episodeDuration)){
			printjson(episodeDuration);
			print(",");
		}
	}
	print("]");
}


function printScrollEpisodeDurationBatchedPerUser(startPercent,endPercent){

	//////We need to load the constants file
	load("../MapReduceConstants.js");

	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.scrollBehaviour.find().toArray();

	startIndex = (userBehaviourList.length/100) * startPercent;
	startIndex = Math.floor(startIndex);

	endIndex = (userBehaviourList.length/100) * endPercent;
	endIndex = Math.floor(endIndex);

	print("[");
	for (var i = startIndex; i < endIndex; i++){
		scrollBehaviourItem = userBehaviourList[i];

		var episodeDuration = {
			sid:scrollBehaviourItem._id.sid,
			url : scrollBehaviourItem._id.url,
			episodeDurationms:scrollBehaviourItem.value.episodeDurationms,

			sdSessionCounter : scrollBehaviourItem.value.scrollStatistics.sdSessionCounter,
			sdTimeSinceLastSession : scrollBehaviourItem.value.scrollStatistics.sdTimeSinceLastSession,
			urlSessionCounter : scrollBehaviourItem.value.scrollStatistics.urlSessionCounter,
			urlSinceLastSession : scrollBehaviourItem.value.scrollStatistics.urlSinceLastSession,
			urlEpisodeLength: scrollBehaviourItem.value.scrollStatistics.urlEpisodeLength,
		};

		if (!isEmpty(episodeDuration)){
			printjson(episodeDuration);
			print(",");
		}
	}
	print("]");
}


///////////START OF SCROLL BEHAVIOURS SUMMARIES (One per episode)//////////
function printControlledScrollSummary(){

	//////We need to load the constants file
	load("../MapReduceConstants.js");

	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.scrollBehaviour.find().toArray();

	print("[");
	for (var i = 0; i < userBehaviourList.length; i++){
		scrollBehaviourSummaryItem = userBehaviourList[i].value.controlledScrollSummary;

		if (!isEmpty(scrollBehaviourSummaryItem)){
			printjson(scrollBehaviourSummaryItem);
			print(",");
		}
	}
	print("]");
}

function printControlledScrollSummaryBatchedPerUser(startPercent,endPercent){

	//////We need to load the constants file
	load("../MapReduceConstants.js");

	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.scrollBehaviour.find().toArray();

	startIndex = (userBehaviourList.length/100) * startPercent;
	startIndex = Math.floor(startIndex);

	endIndex = (userBehaviourList.length/100) * endPercent;
	endIndex = Math.floor(endIndex);

	print("[");
	for (var i = startIndex; i < endIndex; i++){
		scrollBehaviourSummaryItem = userBehaviourList[i].value.controlledScrollSummary;

		if (!isEmpty(scrollBehaviourSummaryItem)){
			printjson(scrollBehaviourSummaryItem);
			print(",");
		}
	}
	print("]");
}


function printFastMouseScrollCycleSummary(){

	//////We need to load the constants file
	load("../MapReduceConstants.js");

	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.scrollBehaviour.find().toArray();

	print("[");
	for (var i = 0; i < userBehaviourList.length; i++){
		scrollBehaviourSummaryItem = userBehaviourList[i].value.fastMouseScrollCycleSummary;

		if (!isEmpty(scrollBehaviourSummaryItem)){
			printjson(scrollBehaviourSummaryItem);
			print(",");
		}
	}
	print("]");
}


function printFastMouseScrollCycleSummaryBatchedPerUser(startPercent,endPercent){

	//////We need to load the constants file
	load("../MapReduceConstants.js");

	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.scrollBehaviour.find().toArray();

	startIndex = (userBehaviourList.length/100) * startPercent;
	startIndex = Math.floor(startIndex);

	endIndex = (userBehaviourList.length/100) * endPercent;
	endIndex = Math.floor(endIndex);

	print("[");
	for (var i = startIndex; i < endIndex; i++){
		scrollBehaviourSummaryItem = userBehaviourList[i].value.fastMouseScrollCycleSummary;

		if (!isEmpty(scrollBehaviourSummaryItem)){
			printjson(scrollBehaviourSummaryItem);
			print(",");
		}
	}
	print("]");
}


function printFastSingleDirectionMouseScrollSummary(){

	//////We need to load the constants file
	load("../MapReduceConstants.js");

	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.scrollBehaviour.find().toArray();

	print("[");
	for (var i = 0; i < userBehaviourList.length; i++){
		scrollBehaviourSummaryItem = userBehaviourList[i].value.fastSingleDirectionMouseScrollSummary;

		if (!isEmpty(scrollBehaviourSummaryItem)){
			printjson(scrollBehaviourSummaryItem);
			print(",");
		}
	}
	print("]");
}


function printFastSingleDirectionMouseScrollSummaryBatchedPerUser(startPercent,endPercent){

	//////We need to load the constants file
	load("../MapReduceConstants.js");

	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.scrollBehaviour.find().toArray();

	startIndex = (userBehaviourList.length/100) * startPercent;
	startIndex = Math.floor(startIndex);

	endIndex = (userBehaviourList.length/100) * endPercent;
	endIndex = Math.floor(endIndex);

	print("[");
	for (var i = startIndex; i < endIndex; i++){
		scrollBehaviourSummaryItem = userBehaviourList[i].value.fastSingleDirectionMouseScrollSummary;

		if (!isEmpty(scrollBehaviourSummaryItem)){
			printjson(scrollBehaviourSummaryItem);
			print(",");
		}
	}
	print("]");
}






///////////START OF SCROLL BEHAVIOURS LIST//////////
function printControlledScroll(){

	//////We need to load the constants file
	load("../MapReduceConstants.js");

	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.scrollBehaviour.find().toArray();

	print("[");
	for (var i = 0; i < userBehaviourList.length; i++){
		scrollBehaviourItemList = userBehaviourList[i].value.controlledScroll;

		for (var j = 0; j < scrollBehaviourItemList.length; j++){
			scrollBehaviourItem = scrollBehaviourItemList[j];
			printjson(scrollBehaviourItem);
			print(",");
		}
	}
	print("]");
}

function printControlledScrollBatchedPerUser(startPercent,endPercent){

	//////We need to load the constants file
	load("../MapReduceConstants.js");

	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.scrollBehaviour.find().toArray();

	startIndex = (userBehaviourList.length/100) * startPercent;
	startIndex = Math.floor(startIndex);

	endIndex = (userBehaviourList.length/100) * endPercent;
	endIndex = Math.floor(endIndex);

	print("[");
	for (var i = startIndex; i < endIndex; i++){
		scrollBehaviourItemList = userBehaviourList[i].value.controlledScroll;

		for (var j = 0; j < scrollBehaviourItemList.length; j++){
			scrollBehaviourItem = scrollBehaviourItemList[j];
			printjson(scrollBehaviourItem);
			print(",");
		}
	}
	print("]");
}


function printFastMouseScrollCycle(){

	//////We need to load the constants file
	load("../MapReduceConstants.js");

	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.scrollBehaviour.find().toArray();

	print("[");
	for (var i = 0; i < userBehaviourList.length; i++){
		scrollBehaviourItemList = userBehaviourList[i].value.fastMouseScrollCycle;

		for (var j = 0; j < scrollBehaviourItemList.length; j++){
			scrollBehaviourItem = scrollBehaviourItemList[j];
			printjson(scrollBehaviourItem);
			print(",");
		}
	}
	print("]");
}


function printFastMouseScrollCycleBatchedPerUser(startPercent,endPercent){

	//////We need to load the constants file
	load("../MapReduceConstants.js");

	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.scrollBehaviour.find().toArray();

	startIndex = (userBehaviourList.length/100) * startPercent;
	startIndex = Math.floor(startIndex);

	endIndex = (userBehaviourList.length/100) * endPercent;
	endIndex = Math.floor(endIndex);

	print("[");
	for (var i = startIndex; i < endIndex; i++){
		scrollBehaviourItemList = userBehaviourList[i].value.fastMouseScrollCycle;

		for (var j = 0; j < scrollBehaviourItemList.length; j++){
			scrollBehaviourItem = scrollBehaviourItemList[j];
			printjson(scrollBehaviourItem);
			print(",");
		}
	}
	print("]");
}


function printFastSingleDirectionMouseScroll(){

	//////We need to load the constants file
	load("../MapReduceConstants.js");

	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.scrollBehaviour.find().toArray();

	print("[");
	for (var i = 0; i < userBehaviourList.length; i++){
		scrollBehaviourItemList = userBehaviourList[i].value.fastSingleDirectionMouseScroll;

		for (var j = 0; j < scrollBehaviourItemList.length; j++){
			scrollBehaviourItem = scrollBehaviourItemList[j];

			printjson(scrollBehaviourItem);
			print(",");
		}
	}
	print("]");
}


function printFastSingleDirectionMouseScrollBatchedPerUser(startPercent,endPercent){

	//////We need to load the constants file
	load("../MapReduceConstants.js");

	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.scrollBehaviour.find().toArray();

	startIndex = (userBehaviourList.length/100) * startPercent;
	startIndex = Math.floor(startIndex);

	endIndex = (userBehaviourList.length/100) * endPercent;
	endIndex = Math.floor(endIndex);

	print("[");
	for (var i = startIndex; i < endIndex; i++){
		scrollBehaviourItemList = userBehaviourList[i].value.fastSingleDirectionMouseScroll;

		for (var j = 0; j < scrollBehaviourItemList.length; j++){
			scrollBehaviourItem = scrollBehaviourItemList[j];

			printjson(scrollBehaviourItem);
			print(",");
		}
	}
	print("]");
}




function printRegularScrollListBatchedPerUser(startPercent,endPercent){

	//////We need to load the constants file
	load("../MapReduceConstants.js");

	/*OLD connection system
	 * var db = connect(mongoPath);
	db.auth(mongoUser,mongoPass);*/
	db = connectAndValidate();


	var userBehaviourList = db.scrollBehaviour.find().toArray();

	startIndex = (userBehaviourList.length/100) * startPercent;
	startIndex = Math.floor(startIndex);

	endIndex = (userBehaviourList.length/100) * endPercent;
	endIndex = Math.floor(endIndex);

	print("[");
	for (var i = startIndex; i < endIndex; i++){
		scrollBehaviourItemList = userBehaviourList[i].value.regularScrollList;

		for (var j = 0; j < scrollBehaviourItemList.length; j++){
			scrollBehaviourItem = scrollBehaviourItemList[j];

			printjson(scrollBehaviourItem);
			print(",");
		}
	}
	print("]");
}
