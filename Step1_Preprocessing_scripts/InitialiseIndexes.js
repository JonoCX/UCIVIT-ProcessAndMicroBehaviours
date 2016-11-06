//////We need to load the constants file
load("../MapReduceConstants.js");

/*OLD connection system
 * var db = connect(mongoPath);
db.auth(mongoUser,mongoPass);*/
db = connectAndValidate();

db.events.ensureIndex( {"url": 1} )
print("1 out of 15 indexes created at:" + datestamp());
db.events.ensureIndex( {"sid": 1} )
print("2 out of 15 indexes created at:" + datestamp());
db.events.ensureIndex( {"sd": 1} )
print("3 out of 15 indexes created at:" + datestamp());
db.events.ensureIndex( {"timestamp": 1} )
print("4 out of 15 indexes created at:" + datestamp());
db.events.ensureIndex( {"sid": 1, "url": 1} )
print("5 out of 15 indexes created at:" + datestamp());
db.events.ensureIndex( {"sid": 1, "sd": 1} )
print("6 out of 15 indexes created at:" + datestamp());
db.events.ensureIndex( {"sid": 1, "sd": 1, "timestamp": 1} )
print("7 out of 15 indexes created at:" + datestamp());
db.events.ensureIndex( {"sid": 1, "url": 1, "timestamp": 1} )
print("8 out of 15 indexes created at:" + datestamp());
db.events.ensureIndex( {"sid": 1, "sd": 1, "sessionstartms": 1} )
print("10 out of 15 indexes created at:" + datestamp());

db.domchanges.ensureIndex( {"sid": 1, "sd": 1} )
print("11 out of 15 indexes created at:" + datestamp());
db.dommilestones.ensureIndex( {"sid": 1, "sd": 1} )
print("12 out of 15 indexes created at:" + datestamp());
db.domtempmilestones.ensureIndex( {"sid": 1, "sd": 1} )
print("13 out of 15 indexes created at:" + datestamp());
db.idleTimes.ensureIndex( {"sid": 1, "sd": 1} )
print("14 out of 15 indexes created at:" + datestamp());
db.idleTimesForSd.ensureIndex( {"sid": 1, "sd": 1} )
print("15 out of 15 indexes created at:" + datestamp());

print("Finished creating indexes at:" + datestamp());

print("Indexes created for collection events");
print(db.events.getIndexes().length-1);

print("Indexes created for collection domchanges");
print(db.domchanges.getIndexes().length-1);

print("Indexes created for collection dommilestones");
print(db.dommilestones.getIndexes().length-1);

print("Indexes created for collection domtempmilestones");
print(db.domtempmilestones.getIndexes().length-1);

print("Indexes created for collection idleTimes");
print(db.idleTimes.getIndexes().length-1);

print("Indexes created for collection idleTimesForSd");
print(db.idleTimesForSd.getIndexes().length-1);
