/**
 * Created by hikingyo on 10/01/17.
 */
/* eslint-disable no-unused-vars */
(function ($, window, document, undefined) {

    // here we go!
    $.MB_AudioManager = function (element, options) {

        // plugin's default options
        // this is private property and is  accessible only from inside the plugin
        let defaults = {};

        // to avoid confusions, use "self" to reference the
        // current instance of the object
        let self = this;

        const $audio = $(element);

        self.am_settings = {};

        const theme = 'theme.mp3';



        // the "constructor" method that gets called when the object is created
        self.init = function () {

            // the plugin's final properties are the merged default and
            // user-provided options (if any)
            self.am_settings = $.extend({}, defaults, options);

            mbCore.eventRegister('onPlayAudio', 'MB_AudioManager');
            mbCore.eventRegister('onStopFadeOutAudio', 'MB_AudioManager');
        };

        // public methods

        let _displayAudio = function(source){
            $audio.volume = 0;
            $audio.attr('src', '/audio/' + source + '.mp3');
            $audio.attr('type', 'audio/mpeg');
            $audio.trigger('play');
            $audio.animate({volume: 1}, 300);
        };

        let _fadeOutStop = function(){
            $audio.animate({volume: 0}, 300);
            $audio.trigger('pause');
            $audio.prop("currentTime",0);
        };
        // Events

        self.onPlayAudio = function (src){
            _displayAudio(src);
        };

        self.onStopFadeOutAudio = function (){
            _fadeOutStop();
        };

        // fire up the plugin!
        // call the "constructor" method
        self.init();

        return self;

    };

    // add the plugin to the jQuery.fn object
    $.fn.MB_AudioManager = function (options) {
        let plugin = null;
        // iterate through the DOM elements we are attaching the plugin to
        this.each(function () {

            // if plugin has not already been attached to the element
            if (undefined == $(this).data("MB_AudioManager")) {

                // create a new instance of the plugin
                // pass the DOM element and the user-provided options as arguments
                plugin = new $.MB_AudioManager(this, options);

                $(this).data("MB_AudioManager", plugin);
            }

        });

        return plugin;
    };

})(jQuery, window, document);
