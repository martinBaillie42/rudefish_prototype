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
                var cssProperty = cssText.split(':')[0];
                var cssInput = cssText.split(':')[1].replace(' ','');

                if(cssProperty === 'color' || cssProperty === 'background-color') {
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
                $('label', '#dialog').html(cssProperty);
                $('input', '#dialog').val(cssInput);
                $( "#dialog" ).dialog( "open" );

			},
        });

    },

    doesAttributeValueExist: function (attribute) {        
        if (attribute === undefined) {
            return false;
        } else if (attribute.length === 0){
            return false;
        } 
        return true;
    },

    constructValidClassString: function (classString) {
        var classArr = classString.split(' ');
        var i;

        classString = '';
        for (i = 0; i < classArr.length; i++) {
            classArr[i] = classArr[i].trim();
            if(classArr[i].length > 0) {
                classString += '.' + classArr[i];
            }
        }
        console.log(classString);
        return classString;
    },

    createUniqueIdentifier: function() {
        var $element = $(that.currentElement);
        var tagName = $element.prop('tagName').toLowerCase();
        var elementId = $element.attr('id');
        var elementClass = $element.attr('class');
        var elementAttrArr = [];
        var i;

        if(that.doesAttributeValueExist(elementId)) {
            elementId = '#' + elementId;
        } else {
            elementId = '';
        }

        if(that.doesAttributeValueExist(elementClass)) {
            elementClass = that.constructValidClassString(elementClass);
        } else {
            elementClass = '';
        }     

        elementAttrArr = [tagName, elementId, elementClass];
        for (i = 0; i < elementAttrArr.length; i++) {
            if (that.$frame.find(elementAttrArr[i]).length === 1) {
                return elementAttrArr[i];
            } 
        } 

        console.log('no unique identifier found');
        return undefined;
    },

    constructUniqueIdAndCssObject: function (uniqueId) {
        var cssProperty = $('label', '#dialog').html();
        var cssValue = $('input', '#dialog').val();
        var cssObject = {};
        
        cssObject[cssProperty] = cssValue;

        if (that.savedCss[uniqueId] === undefined) {
            cssObject[cssProperty] = cssValue;
        } else {
            cssObject = that.savedCss[uniqueId];
            cssObject[cssProperty] = cssValue;
        }

        return cssObject;
    },

    recordChangedCss: function() {
        var uniqueIdentifier = that.createUniqueIdentifier();

        if (uniqueIdentifier !== undefined) {
            that.savedCss[uniqueIdentifier] = that.constructUniqueIdAndCssObject(uniqueIdentifier);
        }

        console.log(that.savedCss);

    },

    updateElementCss: function() {
        var cssObj = {};
        $('input', '#dialog').on('keyup', function() {
        	cssObj = {};
        	cssObj[$('label', '#dialog').html()] = $(this).val();
            // $(that.currentElement).css($('label', '#dialog').html(), $(this).val());
            $(that.currentElement).animate(cssObj, 200);
            that.recordChangedCss();
        });
    }, 


    init: function ($extframe) {
        that = this;
        that.$frame = $extframe.contents();
        that.prevElement;
        that.highlightedElement;
        that.currentElement;
        that.savedCss = {};

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
