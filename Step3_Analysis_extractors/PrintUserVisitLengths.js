/**
 * Prints certain values to the standard output. The best way to call this script is by piping it to a file:
 * 
 * To run it:
 * mongo localhost/testdb PrintUserVisitLengths.js > PrintUserVisitLengths.txt
 * 
 */ 
 
//////We need to load the constants file
load("../MapReduceConstants.js");

var db = connect(mongoPath);
db.auth(mongoUser,mongoPass);


printUserVisitLengths();

function printUserVisitLengths(){
	
	var userList = db.userList.find();

	//For each user list, print its data
	userList.forEach(function(userObject) {
		printjson(userObject);
	});
}
