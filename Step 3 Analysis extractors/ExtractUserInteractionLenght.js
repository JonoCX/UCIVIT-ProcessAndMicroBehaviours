/**
 * Prints certain values to the standard output. The best way to call this script is by piping it to a file:
 * 
 * To run it:
 * mongo localhost/testdb ExtractUserInteractionLenght.js > UserInteractionLenght.json
 * 
 */

//////We need to load the constants file
load("MapReduceConstants.js");

var db = connect(mongoPath);
db.auth(mongoUser,mongoPass);

extractUserInteractionLenght();

function extractUserInteractionLenght(){

	db.TESTactiveUsers.find().forEach(function(interactionLengthItem) {
		printjson(interactionLengthItem);
		print(",");
	});
	
	db.TESTlazyUsers.find().forEach(function(interactionLengthItem) {
		printjson(interactionLengthItem);
		print(",");
	});
}
