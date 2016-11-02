/**
 * Prints certain values to the standard output. The best way to call this script is by piping it to a file:
 * 
 * To run it:
 * mongo localhost/testdb ExtractUrlFeatures.js > scrollFeatures.json
 * 
 */ 
 
//////We need to load the constants file
load("../MapReduceConstants.js");

var db = connect(mongoPath);
db.auth(mongoUser,mongoPass);

extractControlledScrollTotDelta();

function extractControlledScrollTotDelta(){

	//var userBehaviourList = db.scrollBehaviourStatsPerUrl.find().limit(10000).sort({'value.controlledScrollCounter':-1}).limit(100);
	
	//var userBehaviourList = db.scrollBehaviourStatsPerUrl.find().sort({'value.controlledScrollCounter':-1});
	
	var urlBehaviourList = db.scrollBehaviourStatsPerUrl.find().sort({'value.controlledScrollCounter':-1}).limit(100);
	//var userBehaviourList = db.scrollBehaviourStatsPerUrl.find().sort({'value.fastMouseScrollCycleCounter':-1}).limit(100);
	//fastSingleDirectionMouseScrollCounter

	urlBehaviourList.forEach(function(behaviourItem) {

		behaviourItem.value.controlledScrollAggregated.forEach(function(controlledScrollAggregated) {
			printjson(controlledScrollAggregated);
			print(",");
		});
		
	/*	
		behaviourItem.value.fastSingleDirectionMouseScrollSummaryList.forEach(function(fastSingleDirectionMouseScrollSummary) {
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
