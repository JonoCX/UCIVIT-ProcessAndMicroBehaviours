# UCIVIT - ProcessAndMicroBehaviours

This set of scripts process low-level interaction data in a scalable way. Making use of MongoDB and the MapReduce paradigm, data captured over extended periods of time using the UCIVIT-WebIntCap tool can be processed.


## Test run

*OPTIONAL* If there is any kind of data to be removed from previous tests, run the following code to erase it. **WARNING** it will delete the entire ucivitdb database.

```script
mongo
use ucivitdb
db.dropDatabase();
```

### Importing test data

1. If you are using a virtual machine, please make sure you allocate at least 40 GB to download, extract and restore the provided test data
1. Download [this anonymised data](http://www.cs.man.ac.uk/~apaolaza/ucivit/ucivit_exampledataset.zip) and uncompress it.
1. Look for the *ucivitdb_testdata* folder, and import it into your MongoDB installation running the following command. *mongorestore* is a utility from mongoDB (for more information you can check the [mongorestore information page](https://docs.mongodb.com/manual/reference/program/mongorestore/)) so it can be run from the command line in the same way as the *mongo* command.

   ```script
   mongorestore ucivit_testdata
   ```

1. Once it has finished, run the following script to see the imported collections:

   ```script
   mongo
   show dbs
   use ucivitdb
   show collections
   ```
1. The following collections should be listed

   ```script
   domchanges
   dommilestones
   domtempmilestones
   events
   ```

### Configuring scripts

1. The *MapreduceConstants.js* contains the information to access the database. The default configuration accesses to the *ucivitdb* database in the local installation of MongoDB. The *websiteid* indicates which Web site's information will be analysed. It has been set to *10006*, as it corresponds to the provided test data. If the username is not changed, the scripts will try to access the database using no credentials.

   **OPTIONAL**: if an administrator account has been configured, the default username and password can be overwritten. If the username has been changed, the scripts will use the provided user (*mongoUser*) and password (*mongoPass*) to gain access to the configured authentication database (*mongoAuthenticateDB*). All queries will be run against the *mongoQueryDB* database.

   ```script
   var mongoPath = "localhost/ucivitdb"//SERVERIP/DATABASENAME
   var mongoAuthenticateDB = "admin"//DO NOT CHANGE
   var mongoQueryDB = "ucivitdb"
   var mongoUser = "DBUSERNAME";
   var mongoPass = "DBPASSWORD";
   var websiteId = "10006";
   ```

1. The *shellVariables.sh* script contains the same information as *MapreduceConstants.js*. The *websiteId* variable needs to be set to the same one as in *MapreduceConstants.js*. As mentioned before, it has been set to *10006*.

   **OPTIONAL**: the use of an administrator access requires the same configuration as for *MapreduceConstants.js*.

   ```script
   mongoPath="localhost/ucivitdb"
   mongoUser="USERNAME"
   mongoPass="PASSWORD"
   mongoAuthenticateDB="admin"
   mongoDB="ucivitdb"
   websiteId="10006";
   ```

### Running scripts

For each script, an approximate execution time is given. This time was the result of executing the scripts natively (no virtual boxes) with the given test data in a laptop with an i7 processor, and an SSD hard disk.

#### Step 1

Once the configuration files have been set up, open a console in the *Step1_Preprocessing_scripts* folder, and run the *ScratchStartv2.sh* script. The following line of code will generate a file with the log of all operations. Please be aware that this code might take a few hours to run. With the provided test data, it took slightly over 4 hours to run this code.

```script
sh ScratchStartv2.sh > ScratchStartv2.log
```

This script prepares the data for analysis. Non-recurrent users are removed, temporal features relating episodes within same users are created, etc.

All necessary scripts are run sequentially. Depending on the size of the database, this script can take a long time to run. In the case of analysis an entire year of interaction data, from thousands of users, it can take up to 3 days.
The result of the processing is the augmentation of the events with temporal features, so the analysis in step 2 is possible.

After running this code, the following collections are created:

```script
activeUsers
domchanges
dommilestones
domtempmilestones
events
idleTimes
idleTimesForSd
lazyUsers
userList
```

Events have also been augmented with additional temporal information. For example, the amount of time the user has been interacting with the Web page up to that point is stored as *calculatedActiveTime*. To see the resulting augmented events you can use the following query. The first two lines of code are only necessary if you need to connect to the database again.

```script
mongo
use ucivitdb
db.events.find().sort({"timestamp":-1}).limit(10).pretty()
```

The following is an example event that should be displayed after running the query:

```json
{
      "_id" : ObjectId("571ffe4ae4b03378cbf3863f"),
      "mouseCoordinates" : {
            "coordX" : 709,
            "coordY" : 68,
            "offsetX" : 501,
            "offsetY" : 48
      },
      "nodeInfo" : {
            "nodeId" : "Title",
            "nodeDom" : "id(\"Title\")",
            "nodeType" : "DIV",
            "nodeTextContent" : "\n\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t",
            "nodeTextValue" : "undefined"
      },
      "timestampms" : "1461714500123",
      "timestamp" : "2016-04-27,00:48:20:123",
      "sessionstartms" : "1461714273507",
      "sessionstartparsed" : "2016-04-27,00:44:33:507",
      "usertimezoneoffset" : "300",
      "sd" : "10006",
      "sid" : "cbeGkGBLDfvB",
      "event" : "mousemove",
      "url" : "http://www.cs.manchester.ac.uk/study/undergraduate/courses/computer-systems-engineering/?code=03352&pg=options",
      "idleTime" : 126787,
      "calculatedActiveTime" : 311188,
      "idleTimeSoFar" : 2318925041,
      "sdIdleTime" : 126787,
      "sdCalculatedActiveTime" : 1814253,
      "sdIdleTimeSoFar" : 2317832269,
      "latestSdIdleTimeLength" : 1713854119,
      "latestSdIdleTimeTS" : "2016-04-07,03:18:03:768",
      "latestSdIdleTimeTSms" : 1459995483768,
      "urlSessionCounter" : 3,
      "urlSinceLastSession" : 1718789762,
      "sdSessionCounter" : 3,
      "sdTimeSinceLastSession" : 1713854119,
      "urlEpisodeLength" : 227660,
      "episodeUrlActivity" : 100873,
      "sdEpisodeLength" : 5163303,
      "episodeSdActivity" : 768662
}
```

#### Step 2

Creates additional document collections with a given set of micro behaviours. Micro behaviours are small comparable units of user interaction. These units support scalable analysis of low-level interaction without disregarding its fine-grained nature.

Once the Step 1 has been completed, this second step can be run with the following code. The *RunBehaviourAnalysis.sh* script can be run to extract the micro behaviours defined in each file. Running this script took around 15 minutes.

   ```script
   sh RunBehaviourAnalysis.sh > RunBehaviourAnalysis.log
   ```
If you list the collections again, you will see there are two new collections: mouseBehaviourSkinny and mouseMoveBehaviour. Each collection contains the resulting micro behaviours discovered for each *user/url/visit* pair.

Run the following query to obtain an example of a set of micro behaviours related to mouse interaction:

```script
db.mouseBehaviourSkinny.find().limit(1).pretty()
```

In the resulting json, inside the value array, a collection can be found for each micro behaviour. For example, *value.clickspeed* contains the time it took for the user to click, and reports the HTML node where the mouse was when the user clicked (mousedown), as well as the node where the mouse was the user released the mouse button (mouseup).

#### Step 3

Extracts constructed micro behaviours and transforms the resulting JSON files into CSV documents to support a posterior analysis.
Resulting data has been used as input for the UCIVIT-LongitudinalVis project. In this project longitudinal analysis of interaction data is supported through the use of descriptive statistics and regression models, such as mixed linear models.

In order to make the script scalable, the data is first extracted in 4 JSON files for each micro behaviour into a folder called *data* (created during execution if it doesn't exist). These files are then transformed into CSV and then combined into the *combinedCSV* folder. To do this the function *nawk* from Linux has been employed. The execution of the script took around 15 minutes.

To transform the files from json to csv, the *in2csv* function is used, from <https://github.com/onyxfish/csvkit>. It can be easily installed using the following instructions in the command line:

```script
sudo apt-get install python-pip
sudo pip install csvkit
```

NOTE: if the following error occurs: "The installed version of lxml is too old to be used with openpyxl" use the following command:

```script
sudo apt-get build-dep python-lxml
```

The script to extract the behaviours can be run with this command:

```script
sh ExtractBehaviours.sh > ExtractBehaviours.log
```

A series of folders will be created. The folder /data/combinedCSV contains the resulting CSV files ready for analysis. Some of the files might be empty. This is normal, and indicates that the corresponding micro behaviour for that CSV could not be found in the provided data.

## Contact

For questions, or help using this tool, contact Aitor Apaolaza (aitor.apaolaza@manchester.ac.uk)

## Publications

The design of this tool supported the following publications:

* *Understanding users in the wild* in the Proceedings of the 10th International Cross-Disciplinary Conference on Web Accessibility.
* *Identifying emergent behaviours from longitudinal web use* in the Proceedings of the adjunct publication of the 26th annual ACM symposium on User interface software and technology
* *Longitudinal analysis of low-level Web interaction through micro behaviours* in the Proceedings of the 26th ACM Conference on Hypertext & Social Media

## Acknowledgements

This work was supported by the Engineering and Physical Sciences Research Council [EP/I028099/1].


## TODOs for section

1. Add mock data
1. Test that everything works
1. I need to add examples of what collections are created in Step 2
