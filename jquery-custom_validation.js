/*
 *      jQuery Custom Validation Plugin
 *      jQuery Plugin
 *      
 *      Author: Donald R Jones
 *      
 *      Requests jQuery 1.9.1 or greater
 *
 *      This plugin will validate a given input based on a HTML required attriubte (specified in settings)
 *      and by using a RegEx to test if the given input matches the data type attribute specified for 
 *      the input.
*/

(function ($) {

    var defaultSpanClass;
    var requiredClass;
    var requiredAttribute;

    $.fn.validate = function (options) {

        // default options
        var settings = $.extend({
            // These are the defaults.
            
            defaultSpanClass: true,
            requiredClass: undefined,
            
            // HTML input attribute to signal required field
            requiredAttribute: 'data-val-required',
            
            // submit function to be called on valid result
            success: function () { },
            failure: function () { },
            
            
        }, options);
        
        defaultSpanClass = settings.defaultSpanClass;
        requiredClass = settings.requiredClass;
        requiredAttribute = settings.requiredAttribute;
        
        //validity flag
        var isValid = true;

        // validity function, can take individual elements or entire form
        // as input
        var valid = function(item) {
            var returnValue = true;
            if ($(item).is('input') || $(item).is('textarea') || $(item).is('select')) {
                returnValue = validateField(item);
            }else {
                $(item).find(':input').each(function () {
                    if (!validateField(this)) {
                        returnValue = false;
                        return false;
                    }
                });
            }
            return returnValue;
        };

        // performs validation on a particular field
        // adds and removes error CSS styling
        var validateField = function (t) {
            var returnValid = true;
            var field = $(t).val();
            var fieldcontainer = $(t);
            var required = fieldcontainer.attr(settings.requiredAttribute);
            if (settings.requiredClass) {
                required = fieldcontainer.hasClass(settings.requiredClass);
            }
            var spanClass = $('span[data-valmsg-for=' + "'" + fieldcontainer.attr('name') + "']");
            if (!settings.defaultSpanClass) {
                if (!fieldcontainer.next().is('span')) {
                    fieldcontainer.after('<span class=\'val\' />');
                    spanClass = fieldcontainer.next();
                } else {
                    spanClass = fieldcontainer.next();
                }
            }
            if (required) {
                if ($.trim(field) == "" || $.trim(field) == "0") {
                    returnValid = false;
                    fieldcontainer.addClass("input-validation-error");
                    var requiredMessage = fieldcontainer.attr('data-val-required');
                    if (!requiredMessage) {
                        requiredMessage = "This field is required.";
                    }
                    spanClass.html(requiredMessage).show();
                    spanClass.css('color', 'red');
                    return returnValid;
                } else {
                    fieldcontainer.removeClass("input-validation-error");
                    try {
                        spanClass.hide();
                    }
                    catch (e) {
                        
                    }
                }
            }
            var attr = fieldcontainer.attr('type');
            switch (attr) {
                case "number":
                    if (isNaN(field)) {
                        returnValid = false;
                    }
                    break;
                case "tel":
                    //var phoneReg = /^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/;
                    var phoneReg = /^(\d{3})([-]{0,1})(\d{3})([-]{0,1})(\d{4})$/;
                    if (!phoneReg.test(field) && field != "") {
                        returnValid = false;
                    }
                    break;
                case "email":
                    var emailReg = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
                    if (!emailReg.test(field) && field != "") {
                        returnValid = false;
                    }
                    break;
                case "zip":
                    var zipReg = /(^(?!0{5})(\d{5})(?!-?0{4})(-?\d{4})?$)/;
                    if (!zipReg.test(field)) {
                        returnValid = false;
                    }
                    break;
                case "date":
                    var dateReg = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
                    var dateReg2 = /^[0-9]{4}-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|(02-(0[1-9]|[1-2][0-9]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30)))$/;
                    if (!dateReg.test(field)) {
                        if (!(field === "")) {
                            if (!dateReg2.test(field)) {
                                returnValid = false;
                            }
                        }
                    }
                    break;
            }
            if (!returnValid) {
                fieldcontainer.addClass("input-validation-error");
                spanClass.html("Invalid Field").show();
                spanClass.css('color', 'red');
            } else {
                fieldcontainer.removeClass("input-validation-error");
                try {
                    spanClass.hide();
                }
                catch (e) {

                }
            }
            return returnValid;
        };

        // attach browser hook to test on focus loss for
        // each form input
        $(this).find(':input').not("[type='date']").each(function () {
            try {
                $(this).focusout(function () {
                    valid(this);
                }); 
            }catch (e) {
                
            }
            
        });

        // attach a browser hook to the form to catch the
        // submit event
        this.submit(function (e) {
            isValid = valid(this);
            e.preventDefault();
            if (isValid) settings.success();
            if (!isValid) settings.failure();
        });
    };

    $.fn.resetForm = function () {
        $(this).off();
        $(this).find(':input').each(function () {
            $(this).val('');
            $(this).removeClass('input-validation-error');
            if ($(this).next().is('span')) {
                var spanClass = $(this).next();
                if (spanClass.hasClass('val') || spanClass.attr('data-valmsg-for')) {
                    spanClass.hide();
                }
            }
        });
    };

}(jQuery));