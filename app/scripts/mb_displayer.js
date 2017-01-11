
(function ($) {

    /**
     * Gère l'affichage
     * @param {object} element l'élément du DOM
     * @param {object} options éventuelle options
     * @author Maxime Le Conte des Floris
     */
    $.MB_Displayer = function (element, options) {

        // Constante de l'application
        const CELL_SIDE_LENGHT = 70;
        const CELL_BORDER_WIDTH = 2;

        const $player = $("#player");
        const $score = $(".score");
        const $grid = $(".grid");
        const $gauge = $(".combo-chain .gauge");
        const gaugeHeight = $gauge.height();

        /**
         * Constructeur de l'object
         */
        self.init = function () {
            // the plugin's final properties are the merged default and
            // user-provided options (if any)
            // self.settings = $.extend({}, defaults, options);
        };

        // Public methods

        /**
         * Met à jour le score du joueur
         * @param player {number} le numero du joueur
         * @param score {number} le score du joueur
         */
        self.setScore = (player, score) => {
            $score.find(".js-score-" + player).text(score);
        };

        /**
         * Met à jour la jauge de bonus du joueur
         * @param player {number} le numero du joueur
         * @param chain {number} le nombre de pièce de valeur identique récupéré par le joueur de manière consécutive
         */
        self.setComboChain = (player, chain) => {
            $gauge
                .find(".chain-value.js-value-p" + player)
                .animate({
                    "height": chain * gaugeHeight/5
                }, 300);
        };

        /**
         * Déplacer le joueur à la position indiquée
         * @param {number} line (de 0 à 6)
         * @param {number} column (de 0 à 6)
         */
        self.setPlayerPosition = (line, column) => {
            $player.css("transform",
                "translate("+ gridToPixel(column) + "px, " + gridToPixel(line) + "px)"
            );
        }

        /**
         * Placer la pièce sur le jeu
         * @param {number} line (de 0 à 6)
         * @param {column} column (de 0 à 6)
         */
        self.putPiece = (line, column, value) => {
            const $image = $(`<img src="images\coin${value}.png" alt="${value}"></img>`);
            const $cell = $grid.find(`#${line}_${column}`);
            $cell.append($image);
        }

        /**
         * Supprimer la pièce du joueur
         * @param {number} line (de 0 à 6)
         * @param {column} column (de 0 à 6)
         */
        self.removePiece = (line, column) => {
            const $image = $grid.find(`#${line}_${column} img`);
            $img.remove();
        }

        // Private methods

        /**
         * Translate grid coordonate to pixel coordonate
         * @param x {number} number of the line or column
         */
        function gridToPixel(x) {
            return (CELL_SIDE_LENGHT * x) - $player.height()/2 + CELL_SIDE_LENGHT/2 + CELL_BORDER_WIDTH/2;
        }

        self.init();
        return self;
    };

    // Add the plugin to the jQuery.fn object
    $.fn.MB_Displayer = function (options) {
        let plugin = null;
        this.each(function () {
            if (undefined == $(this).data("MB_Displayer")) {
                plugin = new $.MB_Displayer(this, options);
                $(this).data("MB_Displayer", plugin);
            }
        });
        return plugin;
    }

})(jQuery);
