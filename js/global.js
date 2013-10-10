rudeFish = {};

rudeFish.pType = {

    $frame: '',
    prevElement: '',
    currentElement: '',

    detectCurrentElement: function () {
        // reference: http://stackoverflow.com/questions/4698259/jquery-highlight-element-under-mouse-cursor
        prevElement = null;
        document.getElementById('rude_iframe').contentDocument.addEventListener('mousemove', function(e) {
                var elem = e.target || e.srcElement;
                if (prevElement != null) {
                    $(prevElement).css('outline-width', '0');
                }
                $(elem).css('outline', '#ff0000 solid 1px');
                prevElement = elem;
                currentElement = e.srcElement;
        }, true);
        // end reference: http://stackoverflow.com/questions/4698259/jquery-highlight-element-under-mouse-cursor
    },

    rightClickMenu: function() {
    	// console.log(that);
        //https://github.com/mar10/jquery-ui-contextmenu
        $frame.contextmenu({
            delegate: "*",
            menu: [{title: 'dummy'}],
			beforeOpen: function (event, ui){
				var elementAttributes = $(currentElement).get(0);
	            var id = elementAttributes.id;
	            var classes = elementAttributes.classList;

				var style = window.getComputedStyle(elementAttributes);
	            var backgroundColour = style.backgroundColor;
	            var colour = style.color;
	            var width = style.width;
	            var height = style.height;

	            $frame.contextmenu('setEntry', 'cut', 'CUT');
	            newMenu = [
	            	{title: 'id: ' + id},
	            	{title: 'classes: ' + classes},
	            	{title: 'background-color: ' + backgroundColour},
	            	{title: 'color: ' + colour},
	            	{title: 'width: ' + style.width},
	            	{title: 'height: ' + style.height}
	            ]

	            $frame.contextmenu('replaceMenu', newMenu);

			}
        });

    },    

    init: function ($extframe) {
        $frame = $extframe.contents();
        this.detectCurrentElement();
        this.rightClickMenu();
    }
};

$(document).ready(function () {

    $('#dialog').dialog({
    	autoOpen: false
    });

})
$('#rude_iframe').load(function () {
    $extSite = $('#rude_iframe');
    rudeFish.pType.init($extSite);
    // $('#rude_iframe').contents().getMenu();
});

    
