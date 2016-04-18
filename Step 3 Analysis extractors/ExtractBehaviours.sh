###This script extracts all behaviours into files.
#To run it:
# sh ExtractBehaviours.sh > ExtractBehavioursLog.txt

# Define a timestamp function
timestamp() {
  date +"%T"
}

. ./shellVariables.sh

echo today is $(timestamp)

#START of commented code
#if false
#then

##################SCROLL BEHAVIOURS

echo Printing Out User SCROLL to file at $(timestamp)

######START OF BATCHED scroll statistics
echo Printing Out User scroll statistics to file at $(timestamp)

echo Printing Out User scroll statistics 0-25 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserScrollBehaviour.js');printScrollStatisticsBatchedPerUser(0,25);" > data/scrollStatistics_0-25.json

echo Printing Out User scroll statistics 25-50 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserScrollBehaviour.js');printScrollStatisticsBatchedPerUser(25,50);" > data/scrollStatistics_25-50.json

echo Printing Out User scroll statistics 50-75 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserScrollBehaviour.js');printScrollStatisticsBatchedPerUser(50,75);" > data/scrollStatistics_50-75.json

echo Printing Out User scroll statistics 75-100 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserScrollBehaviour.js');printScrollStatisticsBatchedPerUser(75,100);" > data/scrollStatistics_75-100.json
######END OF BATCHED scroll statistics

######START OF BATCHED scroll episode durations
echo Printing Out User scroll episode durations to file at $(timestamp)

echo Printing Out User scroll episode durations 0-25 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserScrollBehaviour.js');printScrollEpisodeDurationBatchedPerUser(0,25);" > data/scrollEpisodeDuration_0-25.json

echo Printing Out User scroll episode durations 25-50 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserScrollBehaviour.js');printScrollEpisodeDurationBatchedPerUser(25,50);" > data/scrollEpisodeDuration_25-50.json

echo Printing Out User scroll episode durations 50-75 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserScrollBehaviour.js');printScrollEpisodeDurationBatchedPerUser(50,75);" > data/scrollEpisodeDuration_50-75.json

echo Printing Out User scroll episode durations 75-100 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserScrollBehaviour.js');printScrollEpisodeDurationBatchedPerUser(75,100);" > data/scrollEpisodeDuration_75-100.json
######END OF BATCHED scroll episode durations



######START OF BATCHED scroll ControlledScroll
echo Printing Out User scroll ControlledScroll to file at $(timestamp)

echo Printing Out User scroll ControlledScroll 0-25 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserScrollBehaviour.js');printControlledScrollBatchedPerUser(0,25);" > data/scrollControlledScrollBehaviour_0-25.json

echo Printing Out User scroll ControlledScroll 25-50 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserScrollBehaviour.js');printControlledScrollBatchedPerUser(25,50);" > data/scrollControlledScrollBehaviour_25-50.json

echo Printing Out User scroll ControlledScroll 50-75 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserScrollBehaviour.js');printControlledScrollBatchedPerUser(50,75);" > data/scrollControlledScrollBehaviour_50-75.json

echo Printing Out User scroll ControlledScroll 75-100 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserScrollBehaviour.js');printControlledScrollBatchedPerUser(75,100);" > data/scrollControlledScrollBehaviour_75-100.json
######END OF BATCHED scroll ControlledScroll



######START OF BATCHED scroll ControlledScrollSummary
echo Printing Out User scroll ControlledScrollSummary to file at $(timestamp)


echo Printing Out User scroll ControlledScrollSummary 0-25 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserScrollBehaviour.js');printControlledScrollSummaryBatchedPerUser(0,25);" > data/scrollControlledScrollBehaviourSummary_0-25.json

echo Printing Out User scroll ControlledScrollSummary 25-50 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserScrollBehaviour.js');printControlledScrollSummaryBatchedPerUser(25,50);" > data/scrollControlledScrollBehaviourSummary_25-50.json

echo Printing Out User scroll ControlledScrollSummary 50-75 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserScrollBehaviour.js');printControlledScrollSummaryBatchedPerUser(50,75);" > data/scrollControlledScrollBehaviourSummary_50-75.json

echo Printing Out User scroll ControlledScrollSummary 75-100 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserScrollBehaviour.js');printControlledScrollSummaryBatchedPerUser(75,100);" > data/scrollControlledScrollBehaviourSummary_75-100.json
######END OF BATCHED scroll ControlledScrollSummary


######START OF BATCHED scroll FastMouseScrollCycle
echo Printing Out User scroll FastMouseScrollCycle to file at $(timestamp)

echo Printing Out User scroll FastMouseScrollCycle 0-25 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserScrollBehaviour.js');printFastMouseScrollCycleBatchedPerUser(0,25);" > data/scrollFastMouseScrollCycleBehaviour_0-25.json

echo Printing Out User scroll FastMouseScrollCycle 25-50 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserScrollBehaviour.js');printFastMouseScrollCycleBatchedPerUser(25,50);" > data/scrollFastMouseScrollCycleBehaviour_25-50.json

echo Printing Out User scroll FastMouseScrollCycle 50-75 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserScrollBehaviour.js');printFastMouseScrollCycleBatchedPerUser(50,75);" > data/scrollFastMouseScrollCycleBehaviour_50-75.json

echo Printing Out User scroll FastMouseScrollCycle 75-100 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserScrollBehaviour.js');printFastMouseScrollCycleBatchedPerUser(75,100);" > data/scrollFastMouseScrollCycleBehaviour_75-100.json
######END OF BATCHED scroll FastMouseScrollCycle


######START OF BATCHED scroll FastMouseScrollCycleSummary
echo Printing Out User scroll FastMouseScrollCycleSummary to file at $(timestamp)

echo Printing Out User scroll FastMouseScrollCycleSummary 0-25 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserScrollBehaviour.js');printFastMouseScrollCycleSummaryBatchedPerUser(0,25);" > data/scrollFastMouseScrollCycleBehaviourSummary_0-25.json

echo Printing Out User scroll FastMouseScrollCycleSummary 25-50 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserScrollBehaviour.js');printFastMouseScrollCycleSummaryBatchedPerUser(25,50);" > data/scrollFastMouseScrollCycleBehaviourSummary_25-50.json

echo Printing Out User scroll FastMouseScrollCycleSummary 50-75 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserScrollBehaviour.js');printFastMouseScrollCycleSummaryBatchedPerUser(50,75);" > data/scrollFastMouseScrollCycleBehaviourSummary_50-75.json

echo Printing Out User scroll FastMouseScrollCycleSummary 75-100 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserScrollBehaviour.js');printFastMouseScrollCycleSummaryBatchedPerUser(75,100);" > data/scrollFastMouseScrollCycleBehaviourSummary_75-100.json
######END OF BATCHED scroll FastMouseScrollCycleSummary


######START OF BATCHED scroll FastSingleDirectionMouseScroll
echo Printing Out User scroll FastSingleDirectionMouseScroll to file at $(timestamp)

echo Printing Out User scroll FastSingleDirectionMouseScroll 0-25 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserScrollBehaviour.js');printFastSingleDirectionMouseScrollBatchedPerUser(0,25);" > data/scrollFastSingleDirectionMouseScroll_0-25.json

echo Printing Out User scroll FastSingleDirectionMouseScroll 25-50 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserScrollBehaviour.js');printFastSingleDirectionMouseScrollBatchedPerUser(25,50);" > data/scrollFastSingleDirectionMouseScroll_25-50.json

echo Printing Out User scroll FastSingleDirectionMouseScroll 50-75 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserScrollBehaviour.js');printFastSingleDirectionMouseScrollBatchedPerUser(50,75);" > data/scrollFastSingleDirectionMouseScroll_50-75.json

echo Printing Out User scroll FastSingleDirectionMouseScroll 75-100 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserScrollBehaviour.js');printFastSingleDirectionMouseScrollBatchedPerUser(75,100);" > data/scrollFastSingleDirectionMouseScroll_75-100.json
######END OF BATCHED scroll FastSingleDirectionMouseScroll

######START OF BATCHED scroll FastSingleDirectionMouseScrollSummary
echo Printing Out User scroll FastSingleDirectionMouseScrollSummary to file at $(timestamp)

echo Printing Out User scroll FastSingleDirectionMouseScrollSummary 0-25 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserScrollBehaviour.js');printFastSingleDirectionMouseScrollSummaryBatchedPerUser(0,25);" > data/scrollFastSingleDirectionMouseScrollSummary_0-25.json

echo Printing Out User scroll FastSingleDirectionMouseScrollSummary 25-50 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserScrollBehaviour.js');printFastSingleDirectionMouseScrollSummaryBatchedPerUser(25,50);" > data/scrollFastSingleDirectionMouseScrollSummary_25-50.json

echo Printing Out User scroll FastSingleDirectionMouseScrollSummary 50-75 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserScrollBehaviour.js');printFastSingleDirectionMouseScrollSummaryBatchedPerUser(50,75);" > data/scrollFastSingleDirectionMouseScrollSummary_50-75.json

echo Printing Out User scroll FastSingleDirectionMouseScrollSummary 75-100 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserScrollBehaviour.js');printFastSingleDirectionMouseScrollSummaryBatchedPerUser(75,100);" > data/scrollFastSingleDirectionMouseScrollSummary_75-100.json
######END OF BATCHED scroll FastSingleDirectionMouseScrollSummary


#fi
##################MOUSE BEHAVIOURS
echo Printing Out User MOUSE to file at $(timestamp)

######START OF BATCHED mouse statistics
echo Printing Out User mouse statistics to file at $(timestamp)

echo Printing Out User mouse statistics 0-25 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printMouseStatisticsBatchedPerUser(0,25);" > data/mouseStatistics_0-25.json

echo Printing Out User mouse statistics 25-50 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printMouseStatisticsBatchedPerUser(25,50);" > data/mouseStatistics_25-50.json

echo Printing Out User mouse statistics 50-75 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printMouseStatisticsBatchedPerUser(50,75);" > data/mouseStatistics_50-75.json

echo Printing Out User mouse statistics 75-100 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printMouseStatisticsBatchedPerUser(75,100);" > data/mouseStatistics_75-100.json
######END OF BATCHED mouse statistics


######START OF BATCHED mouse episode durations
echo Printing Out User mouse episode durations to file at $(timestamp)

echo Printing Out User mouse episode durations 0-25 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printMouseEpisodeDurationBatchedPerUser(0,25);" > data/mouseEpisodeDuration_0-25.json

echo Printing Out User mouse episode durations 25-50 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printMouseEpisodeDurationBatchedPerUser(25,50);" > data/mouseEpisodeDuration_25-50.json

echo Printing Out User mouse episode durations 50-75 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printMouseEpisodeDurationBatchedPerUser(50,75);" > data/mouseEpisodeDuration_50-75.json

echo Printing Out User mouse episode durations 75-100 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printMouseEpisodeDurationBatchedPerUser(75,100);" > data/mouseEpisodeDuration_75-100.json
######END OF BATCHED mouse episode durations

######START OF BATCHED mouse ClickSpeed
echo Printing Out User mouse ClickSpeed to file at $(timestamp)

echo Printing Out User mouse ClickSpeed 0-25 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printClickSpeedBatchedPerUser(0,25);" > data/mouseClickSpeed_0-25.json

echo Printing Out User mouse ClickSpeed 25-50 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printClickSpeedBatchedPerUser(25,50);" > data/mouseClickSpeed_25-50.json

echo Printing Out User mouse ClickSpeed 50-75 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printClickSpeedBatchedPerUser(50,75);" > data/mouseClickSpeed_50-75.json

echo Printing Out User mouse ClickSpeed 75-100 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printClickSpeedBatchedPerUser(75,100);" > data/mouseClickSpeed_75-100.json
######END OF BATCHED mouse ClickSpeed


#echo Printing Out User mouse IdleTime to file at $(timestamp)
#mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printMouseIdleTime();" > data/mouseIdleTime.json
#fi

######START OF BATCHED MOUSE IDLE TIME
echo Printing Out User mouse IdleTime 0-25 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printMouseIdleTimeBatchedPerUser(0,25);" > data/mouseIdleTime_0-25.json

echo Printing Out User mouse IdleTime 25-50 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printMouseIdleTimeBatchedPerUser(25,50);" > data/mouseIdleTime_25-50.json

echo Printing Out User mouse IdleTime 50-75 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printMouseIdleTimeBatchedPerUser(50,75);" > data/mouseIdleTime_50-75.json

echo Printing Out User mouse IdleTime 75-100 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printMouseIdleTimeBatchedPerUser(75,100);" > data/mouseIdleTime_75-100.json
######END OF BATCHED MOUSE IDLE TIME

#if false
#then


######START OF BATCHED mouse TimeToClick
echo Printing Out User mouse TimeToClick to file at $(timestamp)

echo Printing Out User mouse TimeToClick 0-25 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printTimeToClickBatchedPerUser(0,25);" > data/mouseTimeToClick_0-25.json

echo Printing Out User mouse TimeToClick 25-50 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printTimeToClickBatchedPerUser(25,50);" > data/mouseTimeToClick_25-50.json

echo Printing Out User mouse TimeToClick 50-75 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printTimeToClickBatchedPerUser(50,75);" > data/mouseTimeToClick_50-75.json

echo Printing Out User mouse TimeToClick 75-100 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printTimeToClickBatchedPerUser(75,100);" > data/mouseTimeToClick_75-100.json
######END OF BATCHED mouse TimeToClick


#echo Printing Out User mouse HoveringOver to file at $(timestamp)
#mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printHoveringOver();" > data/mouseHoveringOver.json

#echo Printing Out User mouse UnintentionalMousemovement to file at $(timestamp)
#mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printUnintentionalMousemovement();" > data/mouseUnintentionalMousemovement.json


######START OF BATCHED mouse FailToClick
echo Printing Out User mouse FailToClick to file at $(timestamp)

echo Printing Out User mouse FailToClick 0-25 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printFailToClickBatchedPerUser(0,25);" > data/mouseFailToClick_0-25.json

echo Printing Out User mouse FailToClick 25-50 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printFailToClickBatchedPerUser(25,50);" > data/mouseFailToClick_25-50.json

echo Printing Out User mouse FailToClick 50-75 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printFailToClickBatchedPerUser(50,75);" > data/mouseFailToClick_50-75.json

echo Printing Out User mouse FailToClick 75-100 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printFailToClickBatchedPerUser(75,100);" > data/mouseFailToClick_75-100.json
######END OF BATCHED mouse FailToClick

######START OF BATCHED mouse IdleAfterClick
echo Printing Out User mouse IdleAfterClick to file at $(timestamp)

echo Printing Out User mouse IdleAfterClick 0-25 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printIdleAfterClickBatchedPerUser(0,25);" > data/mouseIdleAfterClick_0-25.json

echo Printing Out User mouse IdleAfterClick 25-50 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printIdleAfterClickBatchedPerUser(25,50);" > data/mouseIdleAfterClick_25-50.json

echo Printing Out User mouse IdleAfterClick 50-75 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printIdleAfterClickBatchedPerUser(50,75);" > data/mouseIdleAfterClick_50-75.json

echo Printing Out User mouse IdleAfterClick 75-100 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printIdleAfterClickBatchedPerUser(75,100);" > data/mouseIdleAfterClick_75-100.json
######END OF BATCHED mouse IdleAfterClick



######START OF BATCHED mouse LackOfMousePrecision
echo Printing Out User mouse LackOfMousePrecision to file at $(timestamp)

echo Printing Out User mouse LackOfMousePrecision 0-25 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printLackOfMousePrecisionBatchedPerUser(0,25);" > data/mouseLackOfMousePrecision_0-25.json

echo Printing Out User mouse LackOfMousePrecision 25-50 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printLackOfMousePrecisionBatchedPerUser(25,50);" > data/mouseLackOfMousePrecision_25-50.json

echo Printing Out User mouse LackOfMousePrecision 50-75 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printLackOfMousePrecisionBatchedPerUser(50,75);" > data/mouseLackOfMousePrecision_50-75.json

echo Printing Out User mouse LackOfMousePrecision 75-100 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printLackOfMousePrecisionBatchedPerUser(75,100);" > data/mouseLackOfMousePrecision_75-100.json
######END OF BATCHED mouse LackOfMousePrecision


######START OF BATCHED mouse RepeatedClicks
echo Printing Out User mouse RepeatedClicks to file at $(timestamp)

echo Printing Out User mouse RepeatedClicks 0-25 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printRepeatedClicksBatchedPerUser(0,25);" > data/mouseRepeatedClicks_0-25.json

echo Printing Out User mouse RepeatedClicks 25-50 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printRepeatedClicksBatchedPerUser(25,50);" > data/mouseRepeatedClicks_25-50.json

echo Printing Out User mouse RepeatedClicks 50-75 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printRepeatedClicksBatchedPerUser(50,75);" > data/mouseRepeatedClicks_50-75.json

echo Printing Out User mouse RepeatedClicks 75-100 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printRepeatedClicksBatchedPerUser(75,100);" > data/mouseRepeatedClicks_75-100.json
######END OF BATCHED mouse RepeatedClicks


######START OF BATCHED mouse FailToClickDiffNode
echo Printing Out User mouse FailToClickDiffNode to file at $(timestamp)

echo Printing Out User mouse FailToClickDiffNode 0-25 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printFailToClickDiffNodeBatchedPerUser(0,25);" > data/mouseFailToClickDiffNode_0-25.json

echo Printing Out User mouse FailToClickDiffNode 25-50 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printFailToClickDiffNodeBatchedPerUser(25,50);" > data/mouseFailToClickDiffNode_25-50.json

echo Printing Out User mouse FailToClickDiffNode 50-75 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printFailToClickDiffNodeBatchedPerUser(50,75);" > data/mouseFailToClickDiffNode_50-75.json

echo Printing Out User mouse FailToClickDiffNode 75-100 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printFailToClickDiffNodeBatchedPerUser(75,100);" > data/mouseFailToClickDiffNode_75-100.json
######END OF BATCHED mouse FailToClickDiffNode

######START OF BATCHED mouse FailToClickIgnoreNode
echo Printing Out User mouse FailToClickIgnoreNode to file at $(timestamp)

echo Printing Out User mouse FailToClickIgnoreNode 0-25 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printFailToClickIgnoreNodeBatchedPerUser(0,25);" > data/mouseFailToClickIgnoreNode_0-25.json

echo Printing Out User mouse FailToClickIgnoreNode 25-50 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printFailToClickIgnoreNodeBatchedPerUser(25,50);" > data/mouseFailToClickIgnoreNode_25-50.json

echo Printing Out User mouse FailToClickIgnoreNode 50-75 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printFailToClickIgnoreNodeBatchedPerUser(50,75);" > data/mouseFailToClickIgnoreNode_50-75.json

echo Printing Out User mouse FailToClickIgnoreNode 75-100 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printFailToClickIgnoreNodeBatchedPerUser(75,100);" > data/mouseFailToClickIgnoreNode_75-100.json
######END OF BATCHED mouse FailToClickIgnoreNode

######START OF BATCHED mouse ClickAfterLoad
echo Printing Out User mouse ClickAfterLoad to file at $(timestamp)

echo Printing Out User mouse ClickAfterLoad 0-25 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printClickAfterLoadBatchedPerUser(0,25);" > data/mouseClickAfterLoad_0-25.json

echo Printing Out User mouse ClickAfterLoad 25-50 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printClickAfterLoadBatchedPerUser(25,50);" > data/mouseClickAfterLoad_25-50.json

echo Printing Out User mouse ClickAfterLoad 50-75 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printClickAfterLoadBatchedPerUser(50,75);" > data/mouseClickAfterLoad_50-75.json

echo Printing Out User mouse ClickAfterLoad 75-100 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseBehaviourSkinny.js');printClickAfterLoadBatchedPerUser(75,100);" > data/mouseClickAfterLoad_75-100.json
######END OF BATCHED mouse ClickAfterLoad



############MOUSEMOVE BEHAVIOURS
echo Printing Out User MOUSEMOVE to file at $(timestamp)

######START OF BATCHED mouse move statistics
echo Printing Out User mouse move statistics to file at $(timestamp)

echo Printing Out User mouse move statistics 0-25 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseMoveBehaviour.js');printMouseMoveStatisticsBatchedPerUser(0,25);" > data/mouseMoveStatistics_0-25.json

echo Printing Out User mouse move statistics 25-50 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseMoveBehaviour.js');printMouseMoveStatisticsBatchedPerUser(25,50);" > data/mouseMoveStatistics_25-50.json

echo Printing Out User mouse move statistics 50-75 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseMoveBehaviour.js');printMouseMoveStatisticsBatchedPerUser(50,75);" > data/mouseMoveStatistics_50-75.json

echo Printing Out User mouse move statistics 75-100 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseMoveBehaviour.js');printMouseMoveStatisticsBatchedPerUser(75,100);" > data/mouseMoveStatistics_75-100.json
######END OF BATCHED mouse move statistics

######START OF BATCHED mouse move episode durations
echo Printing Out User mouse move episode durations to file at $(timestamp)

echo Printing Out User mouse move episode durations 0-25 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseMoveBehaviour.js');printMouseMoveEpisodeDurationBatchedPerUser(0,25);" > data/mouseMoveEpisodeDuration_0-25.json

echo Printing Out User mouse move episode durations 25-50 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseMoveBehaviour.js');printMouseMoveEpisodeDurationBatchedPerUser(25,50);" > data/mouseMoveEpisodeDuration_25-50.json

echo Printing Out User mouse move episode durations 50-75 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseMoveBehaviour.js');printMouseMoveEpisodeDurationBatchedPerUser(50,75);" > data/mouseMoveEpisodeDuration_50-75.json

echo Printing Out User mouse move episode durations 75-100 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseMoveBehaviour.js');printMouseMoveEpisodeDurationBatchedPerUser(75,100);" > data/mouseMoveEpisodeDuration_75-100.json
######END OF BATCHED mouse move episode durations

######START OF BATCHED mouse Move behaviour
echo Printing Out User mouse Move behaviour to file at $(timestamp)

echo Printing Out User mouse Move behaviour 0-25 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseMoveBehaviour.js');printMouseMoveBatchedPerUser(0,25);" > data/mouseMove_0-25.json

echo Printing Out User mouse Move behaviour 25-50 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseMoveBehaviour.js');printMouseMoveBatchedPerUser(25,50);" > data/mouseMove_25-50.json

echo Printing Out User mouse Move behaviour 50-75 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseMoveBehaviour.js');printMouseMoveBatchedPerUser(50,75);" > data/mouseMove_50-75.json

echo Printing Out User mouse Move behaviour 75-100 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUserMouseMoveBehaviour.js');printMouseMoveBatchedPerUser(75,100);" > data/mouseMove_75-100.json
######END OF BATCHED mouse Move behaviour

#fi

######START OF BATCHED URL METRICS
echo Printing Out User URL METRICS to file at $(timestamp)

echo Printing Out User URL METRICS 0-25 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUrlMetrics.js');printUrlMetricsBatchedPerUser(0,25);" > data/urlMetrics_0-25.json

echo Printing Out User URL METRICS 25-50 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUrlMetrics.js');printUrlMetricsBatchedPerUser(25,50);" > data/urlMetrics_25-50.json

echo Printing Out User URL METRICS 50-75 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUrlMetrics.js');printUrlMetricsBatchedPerUser(50,75);" > data/urlMetrics_50-75.json

echo Printing Out User URL METRICS 75-100 to file at $(timestamp)
mongo $mongoPath -u "$mongoUser" -p "$mongoPass" --authenticationDatabase $mongoAuthenticateDB  --eval "load('ExtractUrlMetrics.js');printUrlMetricsBatchedPerUser(75,100);" > data/urlMetrics_75-100.json
######END OF BATCHED URL METRICS

###POSTPROCESSING OF FILES
for i in data/*.json;
do
	echo "postprocessing $i";
	##sed to format the output files. the \ is used as scape character.
	#sed -i '/pattern to match/d' ./infile
	#sed -i '/MongoDB shell version: 2.4.10/d' $i
	sed -i '/MongoDB shell version: .*/d' $i
	sed -i '/connecting to: localhost\/testdb/d' $i
	sed -i '/connecting to: 130.88.193.33\/testdb/d' $i
	sed -i '/connecting to: 130.88.193.33\/testdb/d' $i
	sed -i '/connecting to: localhost\/kupballtrainingdb/d' $i
	sed -i '/connecting to: localhost\/alltrainingdb/d' $i
	sed -i '/connecting to: localhost\/alltrainingdb/d' $i
	sed -i '/connecting to: localhost\/.*/d' $i
	sed -i '/connecting to: alltrainingdb/d' $i
	sed -i '/Error: 18 .*/d' $i

	
	#Remove empty json objects
	sed -i '/{ }/d' $i
	
	#Now I need to delete all the extra ,\n] generated.
	#N; indicates to keep the reading opened even if new line is provided, both "," "n" and "]" need scape characters
	#sed -i 'N;s/\,\n\]/\]/' $i
	
	#Changed my mind, it didn't work many times. I will just get the number of lines and remove the one before the last one.
	
	NUMBER_OF_LINES=$(wc -l < $i)
	echo $NUMBER_OF_LINES
	LINE_TO_DELETE=`expr ${NUMBER_OF_LINES} - 1`
	
	echo "deleting line $LINE_TO_DELETE out of $NUMBER_OF_LINES from $i";
	sed -i ${LINE_TO_DELETE}d $i
	
	#wc -l scrollFastSingleDirectionMouseScroll.json
done


#TRANSFORM INTO CSV
# Using in2csv from https://github.com/onyxfish/csvkit, which I found from post http://jeroenjanssens.com/2013/09/19/seven-command-line-tools-for-data-science.html
#Installed it using instructions from http://csvkit.readthedocs.org/en/0.7.3/
#1) sudo apt-get install python-pip
#2) sudo pip install csvkit
#3) There was a "The installed version of lxml is too old to be used with openpyxl" warning:
#		sudo apt-get build-dep python-lxml

for i in data/*.json;
do
	echo "transforming $i to csv";
	in2csv $i > $i.csv
done

#RENAMING .json.csv to .csv.
#It would be simpler to put this code intos the previous loop, but I don't have that many files
#having them in two functions makes it easier to reuse this code
for i in data/*.json.csv;
do
	echo "changing extension of $i";
	#The command basename gives the name of the file without the given extension
	base=`basename $i .json.csv`
	mv $i data/$base.csv
done


#fi

###############PROCESSING COMBINED CSV
#If the size of the returned values is too big, we'll split them into 4 separate CSVs.
#We combine them here

###MouseIdleTime from data/mouseIdleTime*.csv to data/mouseIdleTime.csv
mkdir -p data/combinedCSV


nawk 'FNR==1 && NR!=1{next;}{print}' data/scrollStatistics_*.csv > data/combinedCSV/scrollStatistics.csv
nawk 'FNR==1 && NR!=1{next;}{print}' data/scrollEpisodeDuration_*.csv > data/combinedCSV/scrollEpisodeDuration.csv
nawk 'FNR==1 && NR!=1{next;}{print}' data/scrollControlledScrollBehaviour_*.csv > data/combinedCSV/scrollControlledScrollBehaviour.csv
nawk 'FNR==1 && NR!=1{next;}{print}' data/scrollControlledScrollBehaviourSummary_*.csv > data/combinedCSV/scrollControlledScrollBehaviourSummary.csv
nawk 'FNR==1 && NR!=1{next;}{print}' data/scrollFastMouseScrollCycleBehaviour_*.csv > data/combinedCSV/scrollFastMouseScrollCycleBehaviour.csv
nawk 'FNR==1 && NR!=1{next;}{print}' data/scrollFastMouseScrollCycleBehaviourSummary_*.csv > data/combinedCSV/scrollFastMouseScrollCycleBehaviourSummary.csv
nawk 'FNR==1 && NR!=1{next;}{print}' data/scrollFastSingleDirectionMouseScroll_*.csv > data/combinedCSV/scrollFastSingleDirectionMouseScroll.csv
nawk 'FNR==1 && NR!=1{next;}{print}' data/scrollFastSingleDirectionMouseScrollSummary_*.csv > data/combinedCSV/scrollFastSingleDirectionMouseScrollSummary.csv


nawk 'FNR==1 && NR!=1{next;}{print}' data/mouseStatistics_*.csv > data/combinedCSV/mouseStatistics.csv
nawk 'FNR==1 && NR!=1{next;}{print}' data/mouseEpisodeDuration_*.csv > data/combinedCSV/mouseEpisodeDuration.csv
nawk 'FNR==1 && NR!=1{next;}{print}' data/mouseClickSpeed_*.csv > data/combinedCSV/mouseClickSpeed.csv
nawk 'FNR==1 && NR!=1{next;}{print}' data/mouseIdleTime_*.csv > data/combinedCSV/mouseIdleTime.csv
nawk 'FNR==1 && NR!=1{next;}{print}' data/mouseTimeToClick_*.csv > data/combinedCSV/mouseTimeToClick.csv
nawk 'FNR==1 && NR!=1{next;}{print}' data/mouseFailToClick_*.csv > data/combinedCSV/mouseFailToClick.csv
nawk 'FNR==1 && NR!=1{next;}{print}' data/mouseIdleAfterClick_*.csv > data/combinedCSV/mouseIdleAfterClick.csv
nawk 'FNR==1 && NR!=1{next;}{print}' data/mouseLackOfMousePrecision_*.csv > data/combinedCSV/mouseLackOfMousePrecision.csv
nawk 'FNR==1 && NR!=1{next;}{print}' data/mouseRepeatedClicks_*.csv > data/combinedCSV/mouseRepeatedClicks.csv
nawk 'FNR==1 && NR!=1{next;}{print}' data/mouseFailToClickDiffNode_*.csv > data/combinedCSV/mouseFailToClickDiffNode.csv
nawk 'FNR==1 && NR!=1{next;}{print}' data/mouseFailToClickIgnoreNode_*.csv > data/combinedCSV/mouseFailToClickIgnoreNode.csv


nawk 'FNR==1 && NR!=1{next;}{print}' data/mouseMoveStatistics_*.csv > data/combinedCSV/mouseMoveStatistics.csv
nawk 'FNR==1 && NR!=1{next;}{print}' data/mouseMoveEpisodeDuration_*.csv > data/combinedCSV/mouseMoveEpisodeDuration.csv
nawk 'FNR==1 && NR!=1{next;}{print}' data/mouseMove_*.csv > data/combinedCSV/mouseMove.csv

nawk 'FNR==1 && NR!=1{next;}{print}' data/urlMetrics_*.csv > data/combinedCSV/urlMetrics.csv
