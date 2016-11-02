# UCIVIT - ProcessAndMicroBehaviours

This set of scripts process low-level interaction data in a scalable way. Making use of MongoDB and the MapReduce paradigm, data captured over extended periods of time using the UCIVIT-WebIntCap tool can be processed.


## Test run

### Importing test data

1. Download supplied anonymised data and uncompress it.
1. Import it into your MongoDB installation, running the following command from the same folder.

    ```script
    mongorestore /mongodump_testdata/
    ```

### Configuring scripts

1. The *MapreduceConstants.js* contains the information to access the database. The default configuration accesses to the *ucivitdb* database in the local installation of MongoDB. The *websiteid* needs to be changed, as it indicates which Web site's information will be analysed. If the username is not changed, the scripts will try to access the database using no credentials.

    **OPTIONAL**: if an administrator account has been configured, the default username and password can be overwritten. If the username has been changed, the scripts will use the provided user (*mongoUser*) and password (*mongoPass*) to gain access to the configured authentication database (*mongoAuthenticateDB*). All queries will be run against the *mongoQueryDB* database.

    ```script
    var mongoPath = "localhost/ucivitdb"//SERVERIP/DATABASENAME
    var mongoAuthenticateDB = "admin"//DO NOT CHANGE
    var mongoQueryDB = "ucivitdb"
    var mongoUser = "DBUSERNAME";
    var mongoPass = "DBPASSWORD";
    var websiteId = "WEBSITEID";
    ```

1. The *shellVariables.sh* script contains the same information as *MapreduceConstants.js*. The *websiteId* variable needs to be set to the same one as in *MapreduceConstants.js*.

    **OPTIONAL**: the use of an administrator access requires the same configuration as for *MapreduceConstants.js*.

    ```script
    mongoPath="localhost/ucivitdb"
    mongoUser="USERNAME"
    mongoPass="PASSWORD"
    mongoAuthenticateDB="admin"
    mongoDB="ucivitdb"
    websiteId="WEBSITEID";
    ```

### Running scripts

#### Step 1

Once the configuration files have been set up, open a console in the *Step1_Preprocessing_scripts* folder, and run the *ScratchStartv2.sh* script.

```script
sh ScratchStartv2.sh
```

This script prepares the data for analysis. Non-recurrent users are removed, temporal features relating episodes within same users are created, etc.

All necessary scripts are run sequentially. Depending on the size of the database, this script can take a long time to run. In the case of analysis an entire year of interaction data, from thousands of users, it can take up to 3 days.
The result of the processing is the augmentation of the events with temporal features, so the analysis in step 2 is possible.

#### Step 2

Creates additional document collections with a given set of micro behaviours. Micro behaviours are small comparable units of user interaction. These units support scalable analysis of low-level interaction without disregarding its fine-grained nature.

1. The *RunBehaviourAnalysis.sh* script can be run to extract the micro behaviours defined in each file.

    ```script
    sh RunBehaviourAnalysis.sh
    ```

1. The result is an additional set of collections in the database, containing the extracted micro behaviours for each user and episode.



#### Step 3

Extracts constructed micro behaviours and transforms the resulting JSON files into CSV documents to support a posterior analysis.
Resulting data has been used as input for the UCIVIT-LongitudinalVis project. In this project longitudinal analysis of interaction data is supported through the use of descriptive statistics and regression models, such as mixed linear models.


1. The *ExtractBehaviours.sh* script can be run to extract the micro behaviours defined in each file and transform the resulting data into CSV files.
1. In order to make the script scalable, the data is first extracted in 4 JSON files for each micro behaviour into a folder called *data* (created during execution if it doesn't exist). These files are then transformed into CSV and then combined into the *combinedCSV* folder.

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
