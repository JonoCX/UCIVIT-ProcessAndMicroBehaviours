/**
 * Prints certain values to the standard output. The best way to call this script is by piping it to a file:
 * 
 * To run it:
 * mongo localhost/testdb ExtractUserFeatures.js > scrollFeatures.json
 * 
 */ 
 
//////We need to load the constants file
load("../MapReduceConstants.js");

var db = connect(mongoPath);
db.auth(mongoUser,mongoPass);

extractControlledScrollTotDelta();

function extractControlledScrollTotDelta(){

	//var userBehaviourList = db.scrollBehaviourStatsPerUser.find().limit(10000).sort({'value.controlledScrollCounter':-1}).limit(100);
	
	var userBehaviourList = db.scrollBehaviourStatsPerUser.find().sort({'value.controlledScrollCounter':-1});
	
	//var userBehaviourList = db.scrollBehaviourStatsPerUser.find().sort({'value.fastSingleDirectionMouseScrollCounter':-1}).limit(100);
	//var userBehaviourList = db.scrollBehaviourStatsPerUser.find().sort({'value.fastMouseScrollCycleCounter':-1}).limit(100);
	//fastSingleDirectionMouseScrollCounter

	userBehaviourList.forEach(function(behaviourItem) {

		/*behaviourItem.value.controlledScrollSummaryList.forEach(function(controlledScrollSummary) {
			printjson(controlledScrollSummary);
			print(",");
		});*/
		behaviourItem.value.controlledScrollAggregated.forEach(function(controlledScroll) {
			printjson(controlledScroll);
			print(",");
		});
		
		/*behaviourItem.value.fastSingleDirectionMouseScrollSummaryList.forEach(function(fastSingleDirectionMouseScrollSummary) {
			printjson(fastSingleDirectionMouseScrollSummary);
			print(",");
		});*/
/*	
		behaviourItem.value.fastMouseScrollCycleSummaryList.forEach(function(fastMouseScrollCycleSummary) {
			printjson(fastMouseScrollCycleSummary);
			print(",");
		});*/
	});
}
