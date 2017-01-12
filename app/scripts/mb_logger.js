(function ($) {

    /**
     * Ce plugin permet de gérer les affichages de score, et plus globalement de log
     * dans un element
     * @param element Object
     *  L'element dans lequel seront affichés les logs. Cet élément doit être une <ul> ou une <ol>
     * @param options Array
     *  Options pour personnaliser le comportement du plugin.
     *  Ces dernières peuvent être :
     *  - limit (int) : La limite de log à afficher.
     * @constructor
     */
    $.MB_Logger = function (element, options) {

        const defaults = {
            history: [],
            limit: 13
        };

        const self = this;

        // this will hold the merged default, and user-provided options
        // plugin's properties will be available through this object like:
        // plugin.settings.propertyName from inside the plugin or
        // element.data('MB_Logger').settings.propertyName from outside the plugin,
        // where "element" is the element the plugin is attached to;
        self.settings = {};

        let $element = $(element); // reference to the jQuery version of DOM element

        // the "constructor" method that gets called when the object is created
        self.init = function () {
            self.settings = $.extend({}, defaults, options);
            $element.empty();
            mbCore.eventRegister('onAddMessage', 'MB_Logger');
        };

        /**
         * Cette fonction permet de limiter l'affichage et la conservation des logs dans l'historique.
         * La limite est la limite fixée par self.settings.limit
         */
        const limit = function () {
            if (self.settings.limit < self.settings.history.length) {
                $element.children().first().remove();
                //self.settings.history.shift(); // On ne supprime pas de l'historique, juste de l'affichage.
            }
        };

        /**
         * Permet d'ajouter un message à la liste de log affiché.
         * @param message string
         *  contenu du message
         */
        self.onAddMessage = function (message) {
            const li = $("<li>");
            li.html(message);
            $element.append(li);
            self.settings.history.push(message);
            limit();
        };

        // fire up the plugin!
        self.init();

        return self;

    };

    $.fn.MB_Logger = function (options) {
        let plugin = null;

        this.each(function () {

            // if plugin has not already been attached to the element
            if (undefined == $(this).data("MB_Logger")) {

                // create a new instance of the plugin
                // pass the DOM element and the user-provided options as arguments
                plugin = new $.MB_Logger(this, options);

                // in the jQuery version of the element
                // store a reference to the plugin object
                // you can later access the plugin and its methods and properties like
                // element.data('MB_Logger').publicMethod(arg1, arg2, ... argn) or
                // element.data('MB_Logger').settings.propertyName
                $(this).data("MB_Logger", plugin);

            }
        });
        return plugin;
    };

})(jQuery);
