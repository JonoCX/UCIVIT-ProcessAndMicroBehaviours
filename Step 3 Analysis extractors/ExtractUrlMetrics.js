
/**
 * This function will retrieve the urlMetrics and print it out.
 * Best way to use it is:
 * sh ExtractUrlMetricsToCsv.sh
 * 
 * */ 

function printUrlMetrics(){
	
	load("MapReduceConstants.js");

	var db = connectAndValidate();

	var urlMetricsList = db.urlMetrics.find().toArray();
	
	print("[");
	for (var i = 0; i < urlMetricsList.length; i++){

		var jsonObject = urlMetricsList[i]
			
		jsonObject.sizeCount = jsonObject.widthHeightObject.sizeCount;
		jsonObject.sizeHeightAvg = jsonObject.widthHeightObject.sizeHeightAvg;
		jsonObject.sizeWidthAvg = jsonObject.widthHeightObject.sizeWidthAvg;
		jsonObject.sizeHeightMedian = jsonObject.widthHeightObject.sizeHeightMedian;
		jsonObject.sizeWidthMedian = jsonObject.widthHeightObject.sizeWidthMedian;
		jsonObject.htmlSizeCount = jsonObject.widthHeightObject.htmlSizeCount;
		jsonObject.htmlSizeHeightAvg = jsonObject.widthHeightObject.htmlSizeHeightAvg;
		jsonObject.htmlSizeWidthAvg = jsonObject.widthHeightObject.htmlSizeWidthAvg;
		jsonObject.htmlSizeHeightMedian = jsonObject.widthHeightObject.htmlSizeHeightMedian;
		jsonObject.htmlSizeWidthMedian = jsonObject.widthHeightObject.htmlSizeWidthMedian;
		jsonObject.usableSizeCount = jsonObject.widthHeightObject.usableSizeCount;
		jsonObject.usableSizeHeightAvg = jsonObject.widthHeightObject.usableSizeHeightAvg;
		jsonObject.usableSizeWidthAvg = jsonObject.widthHeightObject.usableSizeWidthAvg;
		jsonObject.usableSizeHeightMedian = jsonObject.widthHeightObject.usableSizeHeightMedian;
		jsonObject.usableSizeWidthMedian = jsonObject.widthHeightObject.usableSizeWidthMedian;

		delete urlMetricsList[i]._id;
		delete jsonObject.widthHeightObject;
		
		
		printjson(jsonObject);
		//needed to use a custom json printing code, so the internal object could be printed
		
		
	/*
		print("{");
		
		var keyIndex = 0;
		var totalKeys = Object.keys(jsonObject).length;
		
		for (var key in jsonObject) {
			//tackling the last comma problem
			keyIndex++;
			
			if (jsonObject.hasOwnProperty(key)) {
				if (key == "widthHeightObject"){
					widthHeightObject = jsonObject[key];
					for (var widthHeightKey in widthHeightObject) {
						if (keyIndex == totalKeys){
							print("\"" + widthHeightKey + "\"" + " : " + "\"" 
								+ widthHeightObject[widthHeightKey].replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"); + "\"" );
						}
						else{
							print("\"" + widthHeightKey + "\"" + " : " + "\"" + widthHeightObject[widthHeightKey] + "\"," );
						}
					}
				}
				else{
					if (keyIndex == totalKeys){
						print("\"" + key + "\"" + " : " + "\"" + jsonObject[key] + "\"");
					}
					else{
						print("\"" + key + "\"" + " : " + "\"" + jsonObject[key] + "\",");
					}
				}
			}
		}
		
		//we print it in two different lines so the last comma can be easily removed
		print("}");*/
		print(",");

	}
	print("]");
}

