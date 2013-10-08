rudeFish = {
    theElement: ''
};
// singleton - see PJSDP p73
rudeFish.color = (function () {
    // private members
    var privateAttribute = true;

    function privateMethod1() {
        // console.log('hello');
    }

    function privateMethod2() {

    }

    return { // public members
        publicAttribute1: true,
        publicAttribute2: true,

        init: function () {
            privateMethod1();
        },

        publicMethod2: function () {

        }
    };
})();

// rudeFish.selectedElement = (function() {

//     function createLogger(name) {
//         return function(_, a) {
//             // Skip the first argument (event object) but log the name and other args.
//             theElement = a;
//             style = window.getComputedStyle($(theElement).get(0));
//             console.log(style);
//             backgroundColour = style.backgroundColor;
//             height = style.height;


//             $('#currentElementDisplay').html(
//                 'id: ' + $(theElement).get(0).attributes.id.value + '<br />' +
//                 'background-color: ' + backgroundColour + '<br />' +
//                 'height: ' + height
//             );

//             // h = height.replace('px', '');
//             // $(theElement).css('height', h + 100 + 'px');
//         };
//     }

//     function subscribe() {
//         $.subscribe('currentElement', createLogger('currentElement'));
//     }

//     return {
//         init: function() {
//             subscribe();
//         }
//     }

// })();

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
                    // prevElement.classList.remove('mouse_on');
                    $(prevElement).css('outline-width', '0');
                }
                // elem.classList.add('mouse_on');
                $(elem).css('outline', '#ff0000 solid 1px');
                prevElement = elem;
                // console.log(e);
                $currentElement = e.srcElement;
                rudeFish.display.currentCss(e.srcElement);

        }, true);
        // end reference: http://stackoverflow.com/questions/4698259/jquery-highlight-element-under-mouse-cursor
        // console.log(document);

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

    // function menuContents(event, ui) {
    //     var contents = [];
    //     $currentElement = rudeFish.selector.getCurrentElement();
    //     console.log($currentElement);
    //     return contents;
    // }

    function listener($frame) {
        // function listener($frame) {
        //https://github.com/mar10/jquery-ui-contextmenu
        var $currentElement;
        $($frame).contextmenu({
            delegate: "*",
            menu: [
                    {title: 'background-color', action: function (event, ui) {
                        console.log('1', $currentElement);
                    										var style = window.getComputedStyle($($currentElement).get(0));
                    										var backgroundColour = style.backgroundColor;
                    										var id = ui.target.get(0).id;
                    										// console.log(window.getComputedStyle($(event.target)));
                    										$('*', '#dialog').remove();
                    										$('#dialog').append('<span>' + backgroundColour + '<span>');
                    										$( "#dialog" ).dialog( "open" );
                    									}
                	},
                ],
				  beforeOpen: function (event, ui){
					$currentElement = rudeFish.selector.getCurrentElement();
					console.log($currentElement);
					// $(this).contextmenu('replaceMenu', [{title: '8', cmd: ''}]);

				  }/*,
          		select: function(event, ui) {
	                var style = window.getComputedStyle(ui.target.get(0));
		            // console.log(style);
		            var backgroundColour = style.backgroundColor;
        		    // alert("select " + ui.cmd + " on " + ui.target.text() + " background-color " + backgroundColour);
        		}*/
        });
        // $($frame).contextmenu({
        //     delegate: "*",
        //     menu: [
        //         {title: "Copy", cmd: "copy", uiIcon: "ui-icon-copy"},
        //         {title: "----"},
        //         {title: "More", children: [
        //             {title: "Sub 1", cmd: "sub1"},
        //             {title: "Sub 2", cmd: "sub1"}
        //             ]}
        //         ],
        //     select: function(event, ui) {
        //         alert("select " + ui.cmd + " on " + ui.target.text());

        // });
    }

    return {
        init: function($frame) {
            listener($frame);
            // listener($frame);
        }
    }
})();

$('#rude_iframe').load(function () {
    var $rudeFrame = $('#rude_iframe').contents();

    // rudeFish.selectedElement.init();
    rudeFish.selector.init($rudeFrame);
    rudeFish.contextMenu.init($rudeFrame);

});

$(document).ready(function () {	
    $('#dialog').dialog({
    	autoOpen: false
    });
})


