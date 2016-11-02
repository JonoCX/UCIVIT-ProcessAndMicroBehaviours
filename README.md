# UCIVIT - ProcessAndMicroBehaviours

This set of scripts process low-level interaction data in a scalable way. Making use of MongoDB and the MapReduce paradigm, data captured over extended periods of time using the UCIVIT-WebIntCap tool can be processed.


## Test run

1. Download supplied anonymised data and uncompress it.
1. Import it into your MongoDB installation, running the following command from the same folder.

```script
mongorestore /mongodump-2013-06-26/
```

1. 

## How do I get set up?

1. This set of scripts relies on an existing MongoDB installation, and data captured using the UCIVIT-WebIntCap tool.
1. Each folder corresponds to a different step of the analysis, so they need to be run in order
1. Before running any of the steps, the files *shellVariables.sh* and *MapreduceConstants* need to be filled with the information concerning the database installation.
1. The different steps provide different functionalities, which requires different ways of execution.

## Step 1

Prepares the data for analysis. Non-recurrent users are removed, temporal features relating episodes within same users are created, etc.

### How to run

1. Complete the *shellVariables.sh* and *MapreduceConstants* with the information of the database.
1. The *ScratchStartv2.sh* script can be run, so all necessary scripts are run sequentially. Depending on the size of the database, this script can take a long time to run. In the case of analysis an entire year of interaction data, from thousands of users, it can take up to 3 days.
1. The result of the processing is the augmentation of the events with temporal features, so the analysis in step 2 is possible.

## Step 2

Creates additional document collections with a given set of micro behaviours.

Micro behaviours are small comparable units of user interaction. These units support scalable analysis of low-level interaction without disregarding its fine-grained nature.

### How to run

1. Complete the *MapreduceConstants* with the information of the database.
1. The *RunBehaviourAnalysis.sh* script can be run to extract the micro behaviours defined in each file.
1. The result is an additional set of collections in the database, containing the extracted micro behaviours for each user and episode.

## Step 3

Extracts constructed micro behaviours and transforms the resulting JSON files into CSV documents to support a posterior analysis.
Resulting data has been used as input for the UCIVIT-LongitudinalVis project. In this project longitudinal analysis of interaction data is supported through the use of descriptive statistics and regression models, such as mixed linear models.

### How to run

1. Complete the *shellVariables.sh* and *MapreduceConstants* with the information of the database.
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