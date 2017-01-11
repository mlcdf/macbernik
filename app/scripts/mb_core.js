/**
 * Created by hikingyo on 10/01/17.
 */

(function ($, window, document, undefined) {

    // here we go!
    $.MB_Core = function (element, options) {

        // plugin's default options
        // this is private property and is  accessible only from inside the plugin
        let defaults = {
        };

        // to avoid confusions, use "self" to reference the
        // current instance of the object
        let self = this;

        // this will hold the merged default, and user-provided options
        // plugin's properties will be available through this object like:
        // plugin.settings.propertyName from inside the plugin or
        // element.data('MB_Core').settings.propertyName from outside the plugin,
        // where "element" is the element the plugin is attached to;
        self.settings = {};

        //list of registered plugin name
        let registeredPlugins = [];

        // list of registered events
        let registeredEvents = {};

        // the "constructor" method that gets called when the object is created
        self.init = function () {

            // the plugin's final properties are the merged default and
            // user-provided options (if any)
            self.settings = $.extend({}, defaults, options);
        };

        /** Plugin register
         * To simply pluginRegister all plugin in a giffy.
         * @param {string} pluginName
         * @param {string} [selector] the css selector of the DOM element
         * @param {string|array} [options]  the options for the plugin
         */
        self.pluginRegister = function (pluginName, selector, options) {
            if (self.pluginName === undefined) {
                if (selector === undefined) {
                    self[pluginName] = eval('$.' + pluginName + '(' + options + ')');
                } else {
                    self[pluginName] = eval('$(selector).' + pluginName + '(' + options + ')');
                }
                registeredPlugins.push(pluginName);
            }

        };

        /**
         * Event registrery
         * @param {string} eventName
         * @param {string} listener The plugin to listen event
         */
        self.eventRegister = function (eventName, listener) {
            if (registeredEvents.eventName === undefined) {
                registeredEvents[eventName] = [listener];
            }
            else {
                registeredEvents[eventName].push(listener);
            }

        };

        // Events
        /* eslint-disable no-unused-vars */
        self.onEvent = function (eventName, param) {
            if (registeredEvents.hasOwnProperty(eventName)) {
                registeredEvents[eventName].forEach(function (listener) {
                    eval('self.' + listener + '.' + eventName + '(param)');
                });
            }

        };
        /* eslint-enable no-unused-vars */

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
            if (undefined == $(this).data('MB_Core')) {

                plugin = new $.MB_Core(this, options);

                $(this).data('MB_Core', plugin);

            }

        });

        return plugin;
    };

})(jQuery, window, document);
