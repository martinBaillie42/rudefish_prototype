// this is a stand-in for the client.js file
$(document).ready(function() {
	whichMvt = $.cookie('rudefishmvt');
	if(whichMvt === null) {	
		whichMvt = Math.floor((Math.random()*2)+1);
		$.cookie('rudefishmvt', whichMvt, {expires: 90});
	} 

	// insert auto generated code below

	// insert auto generated code above

});