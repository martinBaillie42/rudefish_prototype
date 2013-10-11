var rudeFish = {};

rudeFish.pType = {

    // $frame: '',
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
        that.$frame.contextmenu({
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

	            newMenu = [
	            	{title: 'id: ' + id},
	            	{title: 'class: ' + classes},
	            	{title: 'background-color: ' + backgroundColour},
	            	{title: 'color: ' + colour},
	            	{title: 'width: ' + width},
	            	{title: 'height: ' + height}
	            ]

	            that.$frame.contextmenu('replaceMenu', newMenu);

			},
			select: function (event, ui) {
				var cssText = $(ui.item.get(0)).find('a').html();
                var cssLabel = cssText.split(':')[0];
                var cssInput = cssText.split(':')[1].replace(' ','');

                if(cssLabel === 'color' || cssLabel === 'background-color') {
                    cssInput = cssInput.replace('rgba', '');
                    cssInput = cssInput.replace('rgb', '');
                    cssInput = cssInput.replace('(', '');
                    cssInput = cssInput.replace(')', '');
                    cssInput = cssInput.replace(' ', '');
                    cssInputArray = cssInput.split(',');

                    cssInput = '#';
                    for (i = 0; i < cssInputArray.length; i++) {
                        console.log(cssInputArray[i]);
                        colorNumber = 255;
                        colorNumber = cssInputArray[i];
                        colorNumber = parseInt(colorNumber);
                        // colorNumber.toString(16);
                        colorNumber = colorNumber.toString(16);
                        cssInput += colorNumber;
                    }
                    // console.log(cssInputArray[0]);
                }


                $('label', '#dialog').html(cssLabel);
				$('input', '#dialog').val(cssInput);
				$( "#dialog" ).dialog( "open" );
				// generate form for elements dynamically
			},
        });

    },   

    updateElementCss: function() {
        $('input', '#dialog').on('keyup', function() {
            $(currentElement).css($('label', '#dialog').html(), $(this).val());
            // var changeCss = window.getComputedStyle($(currentElement).get(0));
            // changeCss.width = '10px';
        });
    }, 

    init: function ($extframe) {
    	that = this;
        that.$frame = $extframe.contents();
        that.detectCurrentElement();
        that.rightClickMenu();
        that.updateElementCss();
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
    // console.log($frame);

    // $('input', '#dialog').on('keyup', function() {
    //     console.log(1);
    // })

});

// html atributes and css styling separate.
// translate colours to hex. Include sliders.
// display changes in realtime, maybe on the form then maybe watch the input and
// adjust accordingly in realtime.
// move UP or down the dom
// show html
