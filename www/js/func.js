$(document).ready(function(){
	$("#source_language").change(function(){
		$("#INPUT").val("");
		updateOptions();
		optionChangeHelper();
	});

	updateOptions();
	optionChangeHelper();

	$("#TRANSLATE").click(function(){
	
		//Disable all option
		toggleLoader();
		toggleInputState();

		//Submit Translation Job
		var current_translation_id = null;

		//When being used only inside the IIIT network
		// var baseURL_post = "http://10.4.8.55/samparkapi/web/restapi.php/query/translate";
		// var baseURL_get = "http://10.4.8.55/samparkapi/web/restapi.php/query/translation";

		//When being used outside the IIIT network, and will also work inside the IIIT network without the proxy
		var baseURL_post = "http://web.iiit.ac.in/SAMPARK//samparkapi/web/restapi.php/query/translate";
		var baseURL_get = "http://web.iiit.ac.in/SAMPARK/samparkapi/web/restapi.php/query/translation";

		var waitString = "   ";

		var count=0;
		var intervalVariable;
		function checkResult(){
			console.log("Sending GET request to :: "+baseURL_get+"?transId="+current_translation_id);
			$.get(baseURL_get+"?transId="+current_translation_id, function(data){
				console.log("Received GET request now");
				console.log(data);

				//Update Input Box by data
				$("#INPUT").val(data.translation.tgtText==""?waitString:data.translation.tgtText);

				if(data.translation.status=="complete"){
				//Remove the periodic GET request
				window.clearInterval(intervalVariable);

				//Enable controls
				toggleLoader();
				toggleInputState();

				}
			});
		}

		$.post(baseURL_post, {
			srcLang:$("#source_language").val(), 
			tgtLang:$("#target_language").val(),
			text : $("#INPUT").val()
			},function(data){
				//Call back function after POST success
				current_translation_id = data.translation.id;
				console.log(current_translation_id);

				//Start the timer event which checks for result every 1.5 second
				intervalVariable = window.setInterval(checkResult, 2000);
				
				//Replace the default string by some waitString. In a future version, the waitString could be something in target language
				$("#INPUT").val(waitString);

				//Make the target language as source language
				$("#source_language").val($("#target_language").val());
				$("#source_language").selectmenu("refresh",true);
				updateOptions();
				optionChangeHelper();
			});

		//Keep Querying the server till status complete
		
		//on Status complete
		//	**Enable controls
		//	Replace INPUT with the translated text
		//	select source_language as previous target language

	});

	toggleLoader();
});