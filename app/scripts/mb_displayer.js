
(function ($) {

    /**
     * Gère l'affichage
     * @param {object} element l'élément du DOM
     * @param {object} options éventuelle options
     * @author Maxime Le Conte des Floris
     */
    $.MB_Displayer = function (element, options) {

        // Constante de l'application
        const defaults = {
            cellSideLenght:  75,
            cellBorderWidth: 3
        };

        const $menu = $('.menu');
        const $game = $('.game');
        const $player = $('#player');
        const $score = $('.score');
        const $grid = $('#board-game');
        const $gauge = $('.combo-chain .gauge');
        const $victoryModal = $('.victory-modal');
        const gaugeHeight = $gauge.height();

        self.coinColor = {
            10: 'copper',
            20: 'bronze',
            30: 'silver',
            40: 'gold'
        };

        /**
         * Constructeur de l'object
         */
        self.init = function () {
            self.settings = $.extend({}, defaults, options);
            // par défaut, la modal de victoire est caché.
            $victoryModal.hide();
            $.MB_Core().eventRegister('onDisplayScore', 'MB_Displayer');
            $.MB_Core().eventRegister('onDisplayCombo', 'MB_Displayer');
            $.MB_Core().eventRegister('onDisplayCoin', 'MB_Displayer');
        };

        // Méthodes publiques

        /**
         * Met à jour le score du joueur
         * @param player {number} le numero du joueur
         * @param score {number} le score du joueur
         */
        self.onDisplayScore = (player, score) => {
            $score.find('.js-score-' + player).text(score);
        };

        /**
         * Met à jour la jauge de bonus du joueur
         * @param player {number} le numero du joueur
         * @param chain {number} le nombre de pièce de valeur identique récupéré par le joueur de manière consécutive
         */
        self.onDisplayCombo = (player, chain) => {
            $gauge
                .find('.chain-value.js-value-p' + player)
                .animate({
                    'height': chain * gaugeHeight/5
                }, 300);
        };

        /**
         * Déplacer le joueur à la position indiquée
         * @param {number} line (de 0 à 6)
         * @param {number} column (de 0 à 6)
         */
        self.setPlayerPosition = (line, column) => {
            $player.css('transform',
                'translate('+ gridToPixel(column) + 'px, ' + gridToPixel(line) + 'px)'
            );
        };

        /**
         * Placer la pièce sur le jeu
         * @param {number} line (de 0 à 6)
         * @param {column} column (de 0 à 6)
         */
        self.onDisplayCoin = (line, column, value) => {
            const $coin = $(`<div class="coin ${self.coinColor[value]}">
                <span>${value}</span>
            </div>`);
            const $cell = $grid.find(`#${line}_${column}`);
            $cell.append($coin);
        };

        /**
         * Supprimer la pièce du joueur
         * @param {number} line (de 0 à 6)
         * @param {column} column (de 0 à 6)
         */
        self.removeCoin = (line, column) => {
            const $image = $grid.find(`#${line}_${column} coin`);
            $image.remove();
        };

        /**
         * Affichage de la pop-up de victoire
         * @param {number} winner player who won the game
         */
        self.showVictoryModal = (winner) => {
            $victoryModal.find('#winner').text(winner);
            $victoryModal.show();
        };

         /**
          * Cache la pop-up de victoire
          */
        self.hideVictoryModal = () => {
            $victoryModal.hide();
        };

         /**
          * Cache l'air de jeu et affiche de menu
          */
        self.hideGameAndShowMenu = () => {
            $game.hide();
            $menu.show();
        };

         /**
          * Cache le menu et affiche l'air de jeu
          */
        self.hideMenuAndShowGame = () => {
            $menu.hide();
            $game.show();
        };

        // Méthodes privées

        /**
         * Translate grid coordonate to pixel coordonate
         * @param x {number} number of the line or column
         */
        function gridToPixel(x) {
            return ((self.settings.cellSideLenght + self.settings.cellBorderWidth) * x) - $player.height();
        }

        self.init();
        return self;
    };

    // Add the plugin to the jQuery.fn object
    $.fn.MB_Displayer = function (options) {
        let plugin = null;
        this.each(function () {
            if (undefined == $(this).data('MB_Displayer')) {
                plugin = new $.MB_Displayer(this, options);
                $(this).data('MB_Displayer', plugin);
            }
        });
        return plugin;
    };

})(jQuery);
