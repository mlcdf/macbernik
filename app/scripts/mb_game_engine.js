(function ($) {

    /**
     * Ce plugin permet de gérer les mécaniques du jeu
     * @param element Object
     *  Le tableau contenant le jeu.
     * @param options Array
     *  Options pour personnaliser le comportement du plugin.
     *  Ces dernières peuvent être :
     *  - size (int) : La taille du plateau
     *  - pieces (array) : Un tableau contenant la liste des pièces, sous la forme d'objet {"value":valeur,"count":nombre}
     * @constructor
     */
    $.MB_GameEngine = function (element, options) {

        const defaults = {
            size:7,
            pieces:
                [
                    {"value":100,"count":1},
                    {"value":50,"count":5},
                    {"value":30,"count":14},
                    {"value":20,"count":14},
                    {"value":10,"count":14}
                ],
            excludePositions: [{"x":0,"y":0}]
        };

        var gameBoard;

        const self = this;

        self.settings = {};

        let $element = $(element); // reference to the jQuery version of DOM element

        var initGameBoard = function() {

            console.log(element);

            var piecesToAdd = [];

            // Création d'un tableau de toutes les pièces à ajouter.
            $(self.settings.pieces).each(function(index, element) {

                for (let i = 0; i < element.count; i++)
                    piecesToAdd.push(element.value);


            });

            console.log(piecesToAdd);
            console.log(self.settings.excludePositions[0]);

            // Ajout de la position du joueur

            for (let i = 0; i< gameBoard.length; i++) {
                for (let j = 0; j < gameBoard.length; j++) {

                }
            }

            for (let i = 0; i < element.count; i++) {
                var randomX = getRandom(0, self.settings.size -1);
                var randomY = getRandom(0, self.settings.size - 1);

                console.log("(" + randomX + "," + randomY + ")");
                console.log(gameBoard[randomX][randomY]);

            }
        };

        /**
         * Retourne un nombre aléatoire compris
         * @param min int le minimum
         * @param max int le maximum
         * @returns {number} compris entre min & max
         */
        var getRandom = function(min, max) {
            return Math.floor(Math.random()*(max-min+1)+min);
        };

        // the "constructor" method that gets called when the object is created
        self.init = function () {
            self.settings = $.extend({}, defaults, options);

            gameBoard = createArray(self.settings.size);
            console.log(gameBoard);

            initGameBoard();

        };

        /**
         * Cette fonction permet de créer un tableau de n colonnes par n lignes
         * @param rows int Taille du tableau.
         * @returns {Array}
         */
        var createArray = function(rows) {
            var array2D = new Array(rows);

            for(var i = 0; i < array2D.length; i++)
            {
                array2D[i] = new Array(rows);
            }

            // Initialisation à 0 de tous les champs.
            for (let i = 0; i < array2D.length; i++) {
                for (let j = 0; j < array2D.length; j++) {
                    array2D[i][j] = 0;
                }
            }

            return array2D;

        };

        // fire up the plugin!
        self.init();

        return self;

    };

    $.fn.MB_GameEngine = function (options) {
        var plugin = null;

        console.log(this)

        this.each(function () {

            // if plugin has not already been attached to the element
            if (undefined == $(this).data('MB_GameEngine')) {

                // create a new instance of the plugin
                // pass the DOM element and the user-provided options as arguments
                plugin = new $.MB_GameEngine(this, options);

                // in the jQuery version of the element
                // store a reference to the plugin object
                // you can later access the plugin and its methods and properties like
                // element.data('MB_GameEngine').publicMethod(arg1, arg2, ... argn) or
                // element.data('MB_GameEngine').settings.propertyName
                $(this).data('MB_GameEngine', plugin);
            }
        });

        return plugin;
    }

})(jQuery);
