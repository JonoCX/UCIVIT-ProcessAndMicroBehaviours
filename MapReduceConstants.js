

///////////////////////////////////IMPORTANT!!! CHANGE BEFORE RUNNING SCRIPTS///////////////////////////////////


///MongoDB connection info
var mongoPath = "localhost/ucivitdb"//SERVERIP/DATABASENAME
var mongoAuthenticateDB = "admin"//DO NOT CHANGE
var mongoQueryDB = "ucivitdb"
var mongoUser = "DBUSERNAME";
var mongoPass = "DBPASSWORD";

//web site to be analysed, determined by its "sd" value. 10002 is kupb, 10006 is CS
var websiteId = "WEBSITEID";


/** Connects to the database, authenticates the connection against the correspondent 
 * */
function connectAndValidate() {
	connect(mongoPath);

	if (mongoUser !== "" || mongoUser !== "DBUSERNAME"){
		db = db.getSiblingDB(mongoAuthenticateDB);
		db.auth(mongoUser,mongoPass);
		db = db.getSiblingDB(mongoQueryDB);
	}
	return db;
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


/////////////////////////////////////////////START OF CONSTANTS/////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var scopeObject ={};

//list of banned IP addresses
//var bannedIPlist = [ { "ip" : "130.88.193.26"} , { "ip" : "IP1"} , { "ip" : "IP2"}];
var bannedIPlist = ["130.88.193.26", "IP1", "IP2"];
//the following query tests that the sid related with the ip 130.88.193.26 are filtered (it should be empty).
//db.map_reduce_example.find({"_id.sid":{$in:["8hgYRPR2x1Jz", "7O25l3TPWVkp", "1l8yDX2ehiEv", "ZrZ2OrGb6fAY", "qptygSdE0H1z", "uAWrwKFf00rY", "5ZGlnqS1CPAE", "EVJZCfwAXF7j", "01v2m0HonZ3r", "pSaMH85B0Adz", "dzJnQXxQBKJT", "Qcs4OFkpPIbB", "x8UVE8L4598v", "4YWnL6iA0UpF"]}});

scopeObject["bannedIPlist"] = bannedIPlist;


//These events should be ignored when calculating active times.
var incorrectActTimeEvents = ["mobileGyroscopeEvent","mouseOverEvent","resizeEvent"]
scopeObject["incorrectActTimeEvents"] = incorrectActTimeEvents;

///////////List of events
var loadEvent = "load";
scopeObject["loadEvent"] = loadEvent;

var mouseWheelEvent = "mousewheel";
scopeObject["mouseWheelEvent"] = mouseWheelEvent;

var mouseDownEvent = "mousedown";
scopeObject["mouseDownEvent"] = mouseDownEvent;

var mouseUpEvent = "mouseup";
scopeObject["mouseUpEvent"] = mouseUpEvent;

var mouseOverEvent = "mouseover";
scopeObject["mouseOverEvent"] = mouseOverEvent;

var mouseOutEvent = "mouseout";
scopeObject["mouseOutEvent"] = mouseOutEvent;

var mouseMoveEvent = "mousemove";
scopeObject["mouseMoveEvent"] = mouseMoveEvent;

var dblclickEvent = "dblclick";
scopeObject["dblclickEvent"] = dblclickEvent;

var mobileGyroscopeEvent = "mobileGyroscope";
scopeObject["mobileGyroscope"] = mobileGyroscopeEvent;

var scrollEvent = "scroll";
scopeObject["scrollEvent"] = scrollEvent;

var resizeEvent = "resize";
scopeObject["resize"] = resizeEvent;


//////Session timeout
var sessionTimeout = 40*60*1000;//40 mintues
scopeObject["sessionTimeout"] = sessionTimeout;


////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////END OF CONSTANTS/////////////////////////////////////////////////



/////////////////////////////////////////////START OF CONSTANTS/////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Parse a date in "yyyy-mm-dd,HH:mm:ss:SSS" format, and return the ms.
 * I will do it manually to avoid problems with implementation dependant functions
 * new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
 * 2013-07-05,09:25:53:970
 */ 
function parseDateToMs2(input) {
	var parts = input.split(',');
	
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
	return new Date(date[0], date[1]-1, date[2], time[0],time[1],time[2],time[3]).getTime(); // Note: months are 0-based
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


////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////END OF CONSTANTS/////////////////////////////////////////////////
