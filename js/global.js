rudeFish = {
    theElement: ''
};

rudeFish.display = (function() {

    return {
        currentCss: function(element) {
            var style = window.getComputedStyle($(element).get(0));
            // console.log($(element).get(0));
            // console.log(style);
            var id = $(element).get(0).id;
            var backgroundColour = style.backgroundColor;
            var height = style.height;
            var classList = $(element).get(0).classList;



            $('#currentElementDisplay').html(
                'id: ' + id + '<br />' +
                'background-color: ' + backgroundColour + '<br />' +
                'height: ' + height + '<br />' +
                'classList: ' + classList
            );   
        }
    }
})();

rudeFish.selector = (function() {

	var $currentElement;

    function highlightCurrentElement(element, $frame) {
        $frame.find('*').css('outline-width', '0');
        $(element).css('outline', '#ff0000 solid 1px');
    }

    function detectCurrentElement($frame) {

        // reference: http://stackoverflow.com/questions/4698259/jquery-highlight-element-under-mouse-cursor
        prevElement = null;
        document.getElementById('rude_iframe').contentDocument.addEventListener('mousemove', function(e) {
                var elem = e.target || e.srcElement;
                if (prevElement != null) {
                    $(prevElement).css('outline-width', '0');
                }
                $(elem).css('outline', '#ff0000 solid 1px');
                prevElement = elem;
                $currentElement = e.srcElement;
                rudeFish.display.currentCss(e.srcElement);

        }, true);
        // end reference: http://stackoverflow.com/questions/4698259/jquery-highlight-element-under-mouse-cursor
    }

    function displayCss(element) {
        
    }

    return {
        init: function($frame) {
            detectCurrentElement($frame);
        },

        getCurrentElement: function() {
        	return $currentElement
        }
    };

})();
rudeFish.contextMenu = (function () {

    function listener($frame) {
        //https://github.com/mar10/jquery-ui-contextmenu
        var $currentElement;
        $($frame).contextmenu({
            delegate: "*",
            menu: [
                    {title: 'background-color', action: function (event, ui) {
    						var style = window.getComputedStyle($($currentElement).get(0));
    						var backgroundColour = style.backgroundColor;
    						var id = ui.target.get(0).id;
    						$('*', '#dialog').remove();
    						$('#dialog').append('<span>' + backgroundColour + '<span>');
    						$( "#dialog" ).dialog( "open" );
    					}
                	},
                ],
				  beforeOpen: function (event, ui){
					$currentElement = rudeFish.selector.getCurrentElement();
				  }
        });

    }

    return {
        init: function($frame) {
            listener($frame);
        }
    }
})();

$('#rude_iframe').load(function () {
    var $rudeFrame = $('#rude_iframe').contents();
    
    rudeFish.selector.init($rudeFrame);
    rudeFish.contextMenu.init($rudeFrame);

});

$(document).ready(function () {	
    $('#dialog').dialog({
    	autoOpen: false
    });
})


