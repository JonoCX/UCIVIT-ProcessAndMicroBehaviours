//////We need to load the constants file
load("../MapReduceConstants.js");

/*OLD connection system
 * var db = connect(mongoPath);
db.auth(mongoUser,mongoPass);*/
db = connectAndValidate();

db.events.ensureIndex( {"url": 1} )
db.events.ensureIndex( {"sid": 1} )
db.events.ensureIndex( {"sd": 1} )
db.events.ensureIndex( {"timestamp": 1} )

db.events.ensureIndex( {"sid": 1, "url": 1} )
db.events.ensureIndex( {"sid": 1, "sd": 1} )
db.events.ensureIndex( {"sid": 1, "sd": 1, "timestamp": 1} )
db.events.ensureIndex( {"sid": 1, "url": 1, "timestamp": 1} )
db.events.ensureIndex( {"sid": 1, "sd": 1, "sessionstartms": 1} )

db.domchanges.ensureIndex( {"sid": 1, "sd": 1} )
db.dommilestones.ensureIndex( {"sid": 1, "sd": 1} )
db.domtempmilestones.ensureIndex( {"sid": 1, "sd": 1} )
db.idleTimes.ensureIndex( {"sid": 1, "sd": 1} )
db.idleTimesForSd.ensureIndex( {"sid": 1, "sd": 1} )
