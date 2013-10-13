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
    	// console.log(classString);
        var classArr = classString.split(' ');
        var i;

        classString = '';
        for (i = 0; i < classArr.length; i++) {
            classArr[i] = classArr[i].trim();
            if(classArr[i].length > 0) {
                classString += '.' + classArr[i];
            }
        }
        // console.log(classString);
        return classString;
    },

    getLowerCaseTag: function ($el) {
    	return $el.prop('tagName').toLowerCase();
    },

    constructId: function ($el) {
    	var elId = $el.attr('id');
        if(that.doesAttributeValueExist(elId)) {
            return '#' + elId;
        } else {
            return '';
        }
    },

    constructClass: function ($el) {
    	elClass = $el.attr('class')
        if(that.doesAttributeValueExist(elClass)) {
            return that.constructValidClassString(elClass);
        } else {
            return '';
        } 
    },

    uniqueId: function (elArr, parentArr) {
    	parentArr = parentArr || undefined;
        var elAllIds = elArr.join('');

		if (parentArr === undefined) {		
	        for (i = 0; i < elArr.length; i++) {
	            if (that.$frame.find(elArr[i]).length === 1) {
	            	console.log('1', elArr[i]);
	                return elArr[i];
	            } 
	        }
	        if (that.$frame.find(elAllIds).length === 1) {
	        	console.log('2', elAllIds);
	        	return elAllIds;
	        }
		} else {
	        for (i = 0; i < parentArr.length - 2; i++) {
	            if (that.$frame.find(parentArr[i].elName + parentArr[i].elId + parentArr[i].elClass + ' ' + elAllIds).length === 1) {
	            	console.log('4', parentArr[i].elName + parentArr[i].elId + parentArr[i].elClass + ' ' + elAllIds);
	                return parentArr[i].elName + parentArr[i].elId + parentArr[i].elClass + ' ' + elAllIds;
	            } 
	        }
		}

    	return '';
    },

    createUniqueIdentifier: function() {
        var i;
        var $element = $(that.currentElement);
        var tagName = that.getLowerCaseTag($element);
        var elementId = that.constructId($element);
        var elementClass = that.constructClass($element);
        var elementAttrArr = [tagName, elementId, elementClass];

        var parentElementsAttrs = $element.parents().map(function() {
					    			return {
						    				elName: that.getLowerCaseTag($(this)),
						    				elId: that.constructId($(this)),
						    				elClass: that.constructClass($(this))
					        				}; 
								});

        if (that.uniqueId(elementAttrArr).length > 0) return that.uniqueId(elementAttrArr);
        if (that.uniqueId(elementAttrArr, parentElementsAttrs).length > 0) return that.uniqueId(elementAttrArr, parentElementsAttrs);








   //      for (i = 0; i < aPE.length - 2; i++) {
   //      	// console.log('11', aPE[i].elName + ' ' + elementAllIds);
   //      	// console.log('15', that.$frame.find(aPE[i].elName + ' ' + elementAllIds));
   //      	if (that.$frame.find(aPE[i].elName + ' ' + elementAllIds).length === 1) {
   //      		// console.log('3', aPE[i].elName);
   //      	}

   //      	// console.log('12', aPE[i].elClass + ' ' + elementAllIds);
   //      	if (that.$frame.find(aPE[i].elClass + ' ' + elementAllIds).length === 1) {
   //      		// console.log('4', aPE[i].elClass);
   //      	}

   //      	// console.log('13', aPE[i].elId + ' ' + elementAllIds);
   //      	if (that.$frame.find(aPE[i].elId + ' ' + elementAllIds).length === 1) {
   //      		// console.log('5', aPE[i].elId);
   //      	}
			// // console.log('6', aPE[i].elName + aPE[i].elClass);
   //      	if (that.$frame.find(elementAllIds, aPE[i].elName + aPE[i].elClass).length === 1) {
   //      		// console.log('7', aPE[i].elName + aPE[i].elClass);
   //      	}

   //      	if (that.$frame.find(elementAllIds, aPE[i].elName + aPE[i].elId + aPE[i].elClass).length === 1) {
   //      		// console.log('9', aPE[i].elName + aPE[i].elId + aPE[i].elClass);
   //      	}

   //      	if (that.$frame.find(elementAllIds, aPE[i+1].elName + aPE[i+1].elId + aPE[i+1].elClass + ' ' + aPE[i].elName + aPE[i].elId + aPE[i].elClass).length === 1) {
   //      		// console.log('10', aPE[i].elName + aPE[i].elId + aPE[i].elClass);
   //      	}

   //      }

        // console.log(allParentElements);

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

        // console.log(that.savedCss);

    },

    updateElementCss: function() {
        var cssObj = {};
        $('input', '#dialog').on('keyup', function() {

        	cssObj = {};
        	cssObj[$('label', '#dialog').html()] = $(this).val();
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
// option to set maximum or minimum specifity
