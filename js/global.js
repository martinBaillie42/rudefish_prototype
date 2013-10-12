var rudeFish = {};

rudeFish.pType = {

    detectHighlightedElement: function () {
        // reference: http://stackoverflow.com/questions/4698259/jquery-highlight-element-under-mouse-cursor
        that.prevElement = null;
        document.getElementById('rude_iframe').contentDocument.addEventListener('mousemove', function(e) {
                var elem = e.target || e.srcElement;
                if (that.prevElement != null) {
                    $(that.prevElement).css('outline-width', '0');
                }
                $(elem).css('outline', '#ff0000 solid 1px');
                that.prevElement = elem;
                that.highlightedElement = e.srcElement;
        }, true);
        // end reference: http://stackoverflow.com/questions/4698259/jquery-highlight-element-under-mouse-cursor
    },

    rightClickMenu: function() {
        //https://github.com/mar10/jquery-ui-contextmenu
        that.$frame.contextmenu({
            delegate: "*",
            menu: [{title: 'dummy'}],
			beforeOpen: function (event, ui){
				that.currentElement = $(that.highlightedElement).get(0);
	            var id = that.currentElement.id;
	            var classes = that.currentElement.classList;

                // loop through the css to get the styles

                // loop throught the attributes doing the same

				var style = window.getComputedStyle(that.currentElement);
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
                    cssInput = cssInput.replace('rgba', '')
                    	.replace('rgb', '')
                    	.replace('(', '')
                    	.replace(')', '')
                    	.replace(' ', '');
                    cssInputArray = cssInput.split(',');

                    cssInput = '#';
                    for (i = 0; i < cssInputArray.length; i++) {
                        colorNumber = cssInputArray[i];
                        colorNumber = parseInt(colorNumber);
                        colorNumber = colorNumber.toString(16);
                        cssInput += colorNumber;
                    }
                }

				// generate form for elements dynamically
                $('label', '#dialog').html(cssLabel);
                $('input', '#dialog').val(cssInput);
                $( "#dialog" ).dialog( "open" );

			},
        });

    },   

    updateElementCss: function() {
        $('input', '#dialog').on('keyup', function() {
            $(that.currentElement).css($('label', '#dialog').html(), $(this).val());
            that.recordChangedCss();
        });
    }, 

    recordChangedCss: function() {
        // console.log($(that.currentElement));

        // deal with undefineds () ? :
        var $changedEl = $(that.currentElement)
        var changedElId = $changedEl.attr('id');
        var changedElClass = $changedEl.attr('class');
        var cssObject = {};

        changedElId = '#' + changedElId;
        changedElClass = '.' + changedElClass.replace(' ', '.');

        console.log(changedElClass);
        var cssLabel = $('label', '#dialog').html();
        var cssValue = $('input', '#dialog').val();

        // need to validate css before recording it

        // this whole thing could be a 'test for unique' method

        // this block can be a separate function called many times for different combinations of values
        //  id, classes, element and classes, parent element and classes, etc
        if (that.$frame.find(changedElId).length === 1) {
            console.log(changedElId);
            that.cssObject[cssLabel] = cssValue;
            that.savedCss[changedElId] = that.cssObject;
                             
        }

        console.log(that.savedCss);
        // console.log({element: {cssLabel: cssValue}})
        // $('').css({color: #fff, width: 100px})
        // {$obj: {color: #fff, width: 100px}}
    },

    init: function ($extframe) {
    	that = this;
        that.$frame = $extframe.contents();
        that.prevElement;
        that.highlightedElement;
        that.currentElement;
        that.savedCss = {};
        that.cssObject = {};

        that.detectHighlightedElement();
        that.rightClickMenu();
        that.updateElementCss();
    }
};

$(document).ready(function () {

    $('#dialog').dialog({
    	autoOpen: false
    });

});

$('#rude_iframe').load(function () {

    $extSite = $('#rude_iframe');
    rudeFish.pType.init($extSite);

});

// html atributes and css styling separate.
// translate colours to hex. Include sliders.
// display changes in realtime, maybe on the form then maybe watch the input and
// adjust accordingly in realtime.
// move UP or down the dom
// show html
