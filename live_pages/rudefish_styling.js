$(document).ready(function() {
	whichMvt = $.cookie('rudefishmvt');
	if(whichMvt === undefined) {	
		whichMvt = Math.floor((Math.random()*2)+1);
		$.cookie('rudefishmvt', whichMvt, {expires: 90});
	} 

	// insert auto generated code below

	// insert auto generated code above

});