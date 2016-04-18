//Get all urls
/**
 * 
 * This script will create a new collection: "urlMetrics". It will list each url, with different page metrics. 
 * At the moment these will include: number of images, visible links, and words; height and width of the page.
 * 
 * At the moment the query "distinct(url)" takes 17 minutes, even if I added indexes... The problem is that it's only using the sd index.
 * To run it:
 * mongo localhost/testdb WebPageMetrics.js
 * mongo WebPageMetrics.js
 * 
 */

//////We need to load the constants file
load("MapReduceConstants.js");

var consoleIndent = "   ";
db = connectAndValidate();

print("Running WebPageMetrics function at:" + datestamp());

print("Removing urlMetrics START at:" + datestamp());
db.urlMetrics.remove({});
print("Removing urlMetrics STOP at:" + datestamp());


createUrlMetrics();

print("WebPageMetrics function finished at:" + datestamp());

function createUrlMetrics(){
	
	var listOfUrlMetrics = [];

	print("Querying for distinct urls at:" + datestamp());

	//For each url for that Web site
	//var urlList = db.events.distinct("url",{"sd" : websiteId});
	
	//This query will return a list of urlObjects, which will contain "_id" and "url" attributes.
	print("Querying urlList START at:" + datestamp());
	var allUrlList = db.events.find({"sd":websiteId},{"url":1}).addOption(DBQuery.Option.noTimeout);

	print("Querying urlList STOP at:" + datestamp());
		
	/*
	var dupUrlList = [];

	for (i in allUrlList){
		dupUrlList.push(allUrlList.url);
	}
	
	var urlList = dupUrlList.unique();
	* */
	//var allUrlList = [{url:"http://www.cs.manchester.ac.uk/"}]
	
	var processedUrlList = [];

	print("ALL urls found at:" + datestamp());
	//As soon as the count is queried, it forces the database to loop through all results, taking a long time.
	//print(allUrlList.count() +" urls in total at:" + datestamp());
	 

	var urlCounter = 0;
	var duplicateUrlCounter = 0;
	
	//page metric variable initialisation	
	var numImages = 0;
	var numLinks = 0;
	var numWords = 0;
	var numBlockElements = 0;

	var complexityMetric = 0;
	
	allUrlList.forEach(function(urlObject) {
		urlItem = urlObject.url;
		
		if (typeof urlItem == 'undefined')
			print("UNDEFINED FOUND");
		
		else if (processedUrlList.indexOf(urlItem) ==-1){
			//It's the first time we see this url, process it.
			urlCounter++;
			processedUrlList.push(urlItem);
			
			print("Processing " + urlItem + ", url" + urlCounter + "out of " + duplicateUrlCounter + "duplicate urls");
	
			//Find height/width
			widthHeightObject = findHeightAndWidth(urlItem);
			
			print(consoleIndent + "resulting heighxwidth avg was:" + widthHeightObject.sizeHeight 
				+ "x" + widthHeightObject.sizeWidth);
			
			print(consoleIndent + "Obtaining the DOM properties");
			
			//even if we query for a single object, we still have to process it as a list!
			//var urlDOMObject = db.dommilestones.find({"url":urlItem}).sort({"timestamp":-1}).limit(1);

			print("Querying DOM objects START at:" + datestamp());
			var urlDOMObjectList = db.dommilestones.find({"url":urlItem}).toArray();
			print("Querying DOM objects STOP at:" + datestamp());

			if (urlDOMObjectList.length ==0){
				print(consoleIndent + "THIS PAGE HAD NOT DOM MILESTONES: storing width height");
				listOfUrlMetrics.push({
								url:urlItem,
								numImagesAvg:-1,
								numImagesMedian:-1,
								numLinksAvg:-1,
								numLinksMedian:-1,
								numWordsAvg:-1,
								numWordsMedian:-1,
								numBlockElementsAvg:-1,
								numBlockElementsMedian:-1,
								widthHeightObject:widthHeightObject,
								complexityMetricAvg:-1,
								complexityMetricMedian:-1
								
							});
			}
			else{
				try{
	
					domContent = urlDOMObjectList[0].domContent;
	
					var numImages = [];
					var numLinks = [];
					var numWords = [];
					var numBlockElements = [];
					var complexityMetric = [];
					
					var numImagesSum = 0;
					var numLinksSum = 0;
					var numWordsSum = 0;
					var numBlockElementsSum = [];
					var complexityMetricSum = 0;
					
					print(consoleIndent + urlDOMObjectList.length + " DOM elements found")
					
					var domCounter = 0;
					for(domIndex = 0; domIndex < urlDOMObjectList.length; domIndex ++){
					//urlDOMObjectList.forEach(function(urlDOMObject){
						domCounter++;
						//print("DOM number " + domCounter);
						
						//print("Processing Dom item number:" + domCounter);
						
						var urlDOMItem = urlDOMObjectList[domIndex].domContent;//urlDOMObject.domContent;

						//find #images
						numImages.push(countImages(urlDOMItem));
						numLinks.push(countLinks(urlDOMItem));
						numWords.push(countWords(urlDOMItem));
						numBlockElements.push(countBlockElements(urlDOMItem));
						complexityMetric.push((countImages(urlDOMItem) + countWords(urlDOMItem))/widthHeightObject.sizeHeight);
						

						//Due to very strange memory leak problems, I had to delete the source of the domContent
						//This problem only occurred when processing the CS homepage
						urlDOMObjectList[domIndex].domContent = null;

					}
					//});				
					numImagesSum = numImages.reduce(function(a, b) { return a + b });
					var numImagesAvg = numImagesSum / numImages.length;
					var numImagesMedian = median(numImages);
					//print(consoleIndent + "resulting number of images was:" + numImagesAvg);
	
					numLinksSum = numLinks.reduce(function(a, b) { return a + b });
					var numLinksAvg = numLinksSum / numLinks.length;
					var numLinksMedian = median(numLinks);

					//print(consoleIndent + "resulting number of links was:" + numLinksAvg);
					
					numWordsSum = numWords.reduce(function(a, b) { return a + b });
					var numWordsAvg = numWordsSum / numWords.length;
					var numWordsMedian = median(numWords);
					
					numBlockElementsSum = numBlockElements.reduce(function(a, b) { return a + b });
					var numBlockElementsAvg = numBlockElementsSum / numBlockElements.length;
					var numBlockElementsMedian = median(numBlockElements);

					//print(consoleIndent + "resulting number of words was:" + numWordsAvg);
	
					complexityMetricSum = complexityMetric.reduce(function(a, b) { return a + b });
					var complexityMetricAvg = complexityMetricSum / complexityMetric.length;
					var complexityMetricMedian = median(complexityMetric);

					//print(consoleIndent + "resulting complexity metric was:" + complexityMetricAvg);
					
					listOfUrlMetrics.push({
								url:urlItem,
								numImagesAvg:numImagesAvg,
								numImagesMedian:numImagesMedian,
								numLinksAvg:numLinksAvg,
								numLinksMedian:numLinksMedian,
								numWordsAvg:numWordsAvg,
								numWordsMedian:numWordsMedian,
								numBlockElementsAvg:numBlockElementsAvg,
								numBlockElementsMedian:numBlockElementsMedian,
								widthHeightObject:widthHeightObject,
								complexityMetricAvg:complexityMetricAvg,
								complexityMetricMedian:complexityMetricMedian
							});
	
					/*domContent = urlDOMObject[0].domContent;
					//find #images
					numImages = countImages(domContent);
					print(consoleIndent + "resulting number of images was:" + numImages);
			
					numLinks = countLinks(domContent);
					print(consoleIndent + "resulting number of links was:" + numLinks);
					
					numWords = countWords(domContent);
					print(consoleIndent + "resulting number of words was:" + numWords);
					
					complexityMetric = (numImages + numWords)/heightAvg;
					print(consoleIndent + "resulting complexity metric was:" + complexityMetric);
					* */
				}catch(err){
					//Some urls may not have a dommilestone, for some reason... record all links to -1
					print("THERE WAS AN ERROR!!! The message was the following:");
					print(err.message);
					var numImages = -1;
					var numLinks = -1;
					var numWords = -1;
					var complexityMetric = -1;
					
					listOfUrlMetrics.push({
								url:urlItem,
								numImagesAvg:-1,
								numImagesMedian:-1,
								numLinksAvg:-1,
								numLinksMedian:-1,
								numWordsAvg:-1,
								numWordsMedian:-1,
								numBlockElementsAvg:-1,
								numBlockElementsMedian:-1,
								widthHeightObject:widthHeightObject,
								complexityMetricAvg:-1,
								complexityMetricMedian:-1
							});
							
				}
			}
			
			/*listOfUrlMetrics.push({
							url:urlItem,
							numImages:numImages,
							numLinks:numLinks,
							numWords:numWords,
							heightAvg:heightAvg,
							widthAvg:widthAvg,
							complexityMetric:complexityMetric
						});*/
		}
		else{
			//Else, do nothing, the processed url had been processed already, count as duplicate
			duplicateUrlCounter++;
		}
	});
	
	if (listOfUrlMetrics.length > 0){
		print("Inserting " + listOfUrlMetrics.length +" urlMetrics");
		
		print("Inserting urlMetrics object START at:" + datestamp());
		db.urlMetrics.insert(listOfUrlMetrics);
		print("Inserting urlMetrics object STOP at:" + datestamp());

	}

}

function findHeightAndWidth(urlItem){
	//Look for load and resize events, and get the htmlSize.
	
	var eventList = [loadEvent,resizeEvent];

	print("Querying load and resize events START at:" + datestamp());
	var eventList = db.events.find( { "url": urlItem, "event": { $in: eventList }}).toArray();
	print("Querying load and resize events STOP at:" + datestamp());

	print(consoleIndent + "Number of load events for " + urlItem + " were " + eventList.length);
	
	var sizeCount = 0;
	var totalSizeHeight = [];
	var totalSizeWidth = [];
	
	var htmlSizeCount = 0;
	var totalHtmlSizeHeight = [];
	var totalHtmlSizeWidth = [];
	
	var usableSizeCount = 0;
	var totalUsableSizeHeight = [];
	var totalUsableSizeWidth = [];
	
	//In case there is a casting error...
	var errorCounter = 0;
	
	for (var i = 0; i < eventList.length; i++){
		//htmlSize looks like "width x height"
		//printjson(eventList[i]);
		
		try{
			//For each attribute, we'll test for its values
			var eventSize = eventList[i].size;
			var eventHtmlSize = eventList[i].htmlSize;
			var eventUsableSize = eventList[i].usableSize;
			
			if (typeof eventSize != 'undefined'){
				sizeCount ++;
				totalSizeWidth.push(parseInt(eventSize.split("x")[0]));
				totalSizeHeight.push(parseInt(eventSize.split("x")[1]));
				
				//print("Size was:" + eventSize.split("x")[0] + "x" + eventSize.split("x")[1]);
				//print("total size is:" + totalSizeHeight + "x" + totalSizeWidth);

			}
			
			if (typeof eventHtmlSize != 'undefined'){
				htmlSizeCount ++;
				totalHtmlSizeWidth.push(parseInt(eventHtmlSize.split("x")[0]));
				totalHtmlSizeHeight.push(parseInt(eventHtmlSize.split("x")[1]));
				/*print("HTML SIZE FOUND!!!")
				print("Size was:" + eventHtmlSize.split("x")[0] + "x" + eventHtmlSize.split("x")[1]);
				print("total size is:" + totalHtmlSizeHeight + "x" + totalHtmlSizeWidth);
				* */
			}
			
			if (typeof eventUsableSize != 'undefined'){
				usableSizeCount ++;
				totalUsableSizeWidth.push(parseInt(eventUsableSize.split("x")[0]));
				totalUsableSizeHeight.push(parseInt(eventUsableSize.split("x")[1]));
				/*print("USABLE SIZE FOUND!!!")
				print("Size was:" + eventUsableSize.split("x")[0] + "x" + eventUsableSize.split("x")[1]);
				print("total size is:" + totalUsableSizeHeight + "x" + totalUsableSizeWidth);
				*/
			}
			
			//totalWidth += Number(eventList[i].htmlSize.split("x")[0]);
			//totalHeigth += Number(eventList[i].htmlSize.split("x")[1]);
		}
		catch(err){
			errorCounter++;
		}
	}

	//print("Total height was " + totalHeigth + "; and total width was " + totalWidth + "; and there were " + errorCounter + " errors");

//To simplify the code, I'll apply the following code to all "sizes"
		//var numImagesSum = numImages.reduce(function(a, b) { return a + b });
		//var numImagesAvg = numImagesSum / numImages.length;
//I also use shorthand conditions: var x = y !== undefined ? y : 1;
//If the length of the array is different than '0', then we apply the reduce function, otherwise, it will just be -1				
	return {
		sizeCount : sizeCount,
		sizeHeightAvg : totalSizeHeight.length !=0 ? (totalSizeHeight.reduce(function(a, b) { return a + b })/sizeCount) : -1,
		sizeWidthAvg : totalSizeWidth.length !=0 ? (totalSizeWidth.reduce(function(a, b) { return a + b })/sizeCount) : -1,
		sizeHeightMedian : median(totalSizeHeight), 
		sizeWidthMedian : median(totalSizeWidth),

		htmlSizeCount : htmlSizeCount,
		htmlSizeHeightAvg : totalHtmlSizeHeight.length !=0 ? (totalHtmlSizeHeight.reduce(function(a, b) { return a + b })/htmlSizeCount) : -1,
		htmlSizeWidthAvg : totalHtmlSizeWidth.length !=0 ? (totalHtmlSizeWidth.reduce(function(a, b) { return a + b })/htmlSizeCount) : -1,
		htmlSizeHeightMedian : median(totalHtmlSizeHeight), 
		htmlSizeWidthMedian : median(totalHtmlSizeWidth),
		
		usableSizeCount : usableSizeCount,
		usableSizeHeightAvg : totalUsableSizeHeight.length !=0 ? (totalUsableSizeHeight.reduce(function(a, b) { return a + b })/usableSizeCount) : -1,
		usableSizeWidthAvg : totalUsableSizeWidth.length !=0 ? (totalUsableSizeWidth.reduce(function(a, b) { return a + b })/usableSizeCount) : -1,
		usableSizeHeightMedian : median(totalUsableSizeHeight), 
		usableSizeWidthMedian : median(totalUsableSizeWidth),
		
		
		//"heightAvg":(totalHeigth/(eventList.length-errorCounter)),
		//"widthAvg":(totalWidth/(eventList.length-errorCounter))
	}
}

function domProcessing(domString){
	
	//The DOM was encoded so we need to replace  /" with just "
	var domString = domString.replace("/\"");

	var doctype = document.implementation.createDocumentType( 'html', '', '');
	
	var dom = document.implementation.createDocument('', 'html', doctype);

	dom.documentElement.innerHTML = domString;
	
	//var div = document.createElement('div');
	//div.innerHTML = domString;
	//div can now be processed as an HTML DOM
	var textContent = dom.documentElement.getElementsByTagName("body")[0].textContent;
	
	var numWords = countWords(textContent);
	
	//Loop through visible items
	//$(dom.documentElement+":visible").each(....);
	
	
}

//Count words algorithm from http://www.mediacollege.com/internet/javascript/text/count-words.html
function countWords(inputString){
	s = inputString;
	s = s.replace(/(^\s*)|(\s*$)/gi,"");
	s = s.replace(/[ ]{2,}/gi," ");
	s = s.replace(/\n /,"\n");
	//document.getElementById("wordcount").value = s.split(' ').length;
	return s.split(' ').length;
}

//Count visible links. At the moment it just counts the number of href's
function countLinks(inputString){
	//It will also count texts including "href" in their content...
	return (inputString.split(' href').length - 1);
}

//Count number of images. At the moment it counts the number of <img> elements
function countImages(inputString){
	//I can look for entire "<img" strings, as a "< img" would not work in HTML
	return (inputString.split('<img').length - 1);
}

function countBlockElements(inputString){
	//list of all block elements
	//from https://developer.mozilla.org/en/docs/Web/HTML/Block-level_elements
	//unadulterated list: <address>, <article>, <aside>, <audio>, <blockquote>, <canvas>, <dd>, <div>, <dl>, <fieldset>, <figcaption>, <figure>, <footer>, <form>, <h1>, <h2>, <h3>, <h4>, <h5>, <h6>, <header>, <hgroup>, <hr>, <main>, <nav>, <noscript>, <ol>, <output>, <p>, <pre>, <section>, <table>, <tfoot>, <ul>, <video>
	blockElemList = ["<address", "<article", "<aside", "<audio", "<blockquote", "<canvas", "<dd", "<div", "<dl", "<fieldset", "<figcaption", "<figure", "<footer", "<form", "<h1", "<h2", "<h3", "<h4", "<h5", "<h6", "<header", "<hgroup", "<hr", "<main", "<nav", "<noscript", "<ol", "<output", "<p", "<pre", "<section", "<table", "<tfoot", "<ul", "<video"];
	
	blockElemCount = 0;
	
	for (var blockElemIndex = 0; blockElemIndex < blockElemList.length; blockElemIndex++){
		blockElemCount += inputString.split(blockElemList[blockElemIndex]).length - 1;
	}
	
	return (blockElemCount);
}


Array.prototype.unique = function() {
    var arr = [];
    for(var i = 0; i < this.length; i++) {
        if(arr.indexOf(this[i]) == -1) {
            arr.push(this[i]);
        }
    }
    return arr; 
}

function median(values) {
 
    values.sort( function(a,b) {return a - b;} );
 
    var half = Math.floor(values.length/2);
 
    if(values.length % 2)
        return values[half];
    else
        return (values[half-1] + values[half]) / 2.0;
}
