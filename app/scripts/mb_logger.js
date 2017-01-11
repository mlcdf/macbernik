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
            limit: 10

        };

        const self = this;

        self.settings = {};

        // reference to the jQuery version of DOM element
        let $element = $(element);

        // the "constructor" method that gets called when the object is created
        self.init = function () {
            self.settings = $.extend({}, defaults, options);
            $element.empty();

            // Event
            $.MB_Core().eventRegister('onAddMessage', 'MB_Logger');
        };

        /**
         * Cette fonction permet de limiter l'affichage et la conservation des logs dans l'historique.
         * La limite est la limite fixée par self.settings.limit
         */
        const limit = function () {
            if (self.settings.limit < self.settings.history.length) {
                $element.children().first().remove();
            }
        };

        /**
         * Permet d'ajouter un message à la liste de log affiché.
         * @param message {string} Le contenu du message a affiché et historiser.
         */
        self.onAddMessage = function (message) {
            const li = $('<li>');
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
            if (undefined == $(this).data('MB_Logger')) {

                plugin = new $.MB_Logger(this, options);

                $(this).data('MB_Logger', plugin);

            }
        });
        return plugin;
    };

})(jQuery);
