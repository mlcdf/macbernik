/**
 * Created by hikingyo on 10/01/17.
 */
 /* eslint-disable */
(function ($) {

    // here we go!
    $.MB_Core = function (element, options) {

        // plugin's default options
        // this is private property and is  accessible only from inside the plugin
        var defaults = {

            foo: "bar",

            // if your plugin is event-driven, you may provide callback capabilities
            // for its events. execute these functions before or after events of your
            // plugin, so that users may customize those particular events without
            // changing the plugin's code
            onFoo: function () {
            }

        };

        // to avoid confusions, use "self" to reference the
        // current instance of the object
        var self = this;

        // this will hold the merged default, and user-provided options
        // plugin's properties will be available through this object like:
        // plugin.settings.propertyName from inside the plugin or
        // element.data('MB_Core').settings.propertyName from outside the plugin,
        // where "element" is the element the plugin is attached to;
        self.settings = {};

        var $element = $(element), // reference to the jQuery version of DOM element
            element = element;    // reference to the actual DOM element

        // the "constructor" method that gets called when the object is created
        self.init = function () {

            // the plugin's final properties are the merged default and
            // user-provided options (if any)
            self.settings = $.extend({}, defaults, options);

            // code goes here

        };



        // public methods
        // these methods can be called like:
        // plugin.methodName(arg1, arg2, ... argn) from inside the plugin or
        // element.data('MB_Core').publicMethod(arg1, arg2, ... argn) from outside
        // the plugin, where "element" is the element the plugin is attached to;

        // a public method. for demonstration purposes only - remove it!
        self.foo_public_method = function () {

            console.log("yolo");

        };

        // private methods
        // these methods can be called only from inside the plugin like:
        // methodName(arg1, arg2, ... argn)

        // a private method. for demonstration purposes only - remove it!
        var foo_private_method = function () {

            console.log("Hello");

        };

        // fire up the plugin!
        // call the "constructor" method
        self.init();

        return self;

    };

    // add the plugin to the jQuery.fn object
    $.fn.MB_Core = function (options) {
        var plugin = null;
        // iterate through the DOM elements we are attaching the plugin to
        this.each(function () {

            // if plugin has not already been attached to the element
            if (undefined == $(this).data("MB_Core")) {

                // create a new instance of the plugin
                // pass the DOM element and the user-provided options as arguments
                plugin = new $.MB_Core(this, options);

                // in the jQuery version of the element
                // store a reference to the plugin object
                // you can later access the plugin and its methods and properties like
                // element.data('MB_Core').publicMethod(arg1, arg2, ... argn) or
                // element.data('MB_Core').settings.propertyName
                $(this).data("MB_Core", plugin);

            }

        });

        return plugin;
    };

})(jQuery);
