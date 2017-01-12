
(function ($) {

    /**
     * Gère l'affichage
     * @param {object} element l'élément du DOM
     * @param {object} options éventuelle options
     */
    $.MB_Displayer = function (element, options) {

        // Constante de l'application
        const defaults = {
            cellSideLenght:  77,
            cellBorderWidth: 2,
            bonusLimit: 5
        };

        const $menu = $('.menu');
        const $game = $('.game');
        const $player = $('#player');
        const $score = $('.score');
        const $grid = $('#board-game');
        const $comboChain = $('.combo-chain');
        const $victoryModal = $('.victory-modal');

        self.coinColor = {
            10: 'copper',
            20: 'bronze',
            30: 'silver',
            50: 'duo',
            100: 'gold'
        };

        /**
         * Constructeur de l'object
         */
        self.init = function () {
            self.settings = $.extend({}, defaults, options);
            // par défaut, la modal de victoire est caché.
            $victoryModal.hide();

            self.setComboChain(1, 0);
            self.setComboChain(2, 0);

            // Event
            mbCore.eventRegister('removeCoin', 'MB_Displayer');
            mbCore.eventRegister('setPlayerPosition', 'MB_Displayer');
            mbCore.eventRegister('setScore', 'MB_Displayer');
            mbCore.eventRegister('setComboChain', 'MB_Displayer');
            mbCore.eventRegister('initGame', 'MB_Displayer');
            mbCore.eventRegister('setBonus', 'MB_Displayer');

            // mbCore.onEvent('initGame');
            self.initGame();
        };

        // Méthodes publiques

        self.initGame = function () {
            $('.start-game-js').on('click', function () {
                self.hideMenuAndShowGame();
            });
        };

        /**
         * Met à jour le score du joueur
         * @param player {number} le numero du joueur
         * @param score {number} le score du joueur
         */
        self.setScore = function (player, score)  {
            $score.find('.js-score-' + player).text(`${score} £`);
        };

        /**
         * Met à jour la jauge de bonus du joueur
         * @param player {number} le numero du joueur
         * @param chain {number} le nombre de pièce de valeur identique récupéré par le joueur de manière consécutive
         */
        self.setComboChain = (player, chain) => {
            $comboChain
                .find(`.p${player}-js .counter`)
                .text(`${chain}/${self.settings.bonusLimit}`);
        };

        /**
         * Affichage la dernière pièce retirée par le joueur
         * @param {number} player
         * @param {number} value
         */
        self.displayLastCoinRemoved = (player, value) => {
            const $coin = $(`<div class="coin ${self.coinColor[value]}">
                <span>${value}</span>
            </div>`);

            $comboChain
                .find(`.p${player}-js .js-value .coin:first`)
                .remove();

            $comboChain
                .find(`.p${player}-js .js-value`)
                .append($coin);
        };

        /**
         * Met à jour le bonus
         * @param {player} player
         * @param {number} bonus
         */
        self.setBonus = (player, bonus) => {
            $(`.p${player}-js .bonus .value`).text(`${bonus} £`);
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
        self.putCoin = (line, column, value) => {
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
            const $image = $grid.find(`#${line}_${column} .coin`);
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
            $victoryModal.hide(300);
        };

         /**
          * Cache l'air de jeu et affiche de menu
          */
        self.hideGameAndShowMenu = () => {
            $game.fadeOut(300);
            $menu.fadeIn(300);
        };

         /**
          * Cache le menu et affiche l'air de jeu
          */
        self.hideMenuAndShowGame = () => {
            $menu.fadeOut(300);
            $game.fadeIn(300);
        };

        // Méthodes privées

        /**
         * Translate grid coordonate to pixel coordonate
         * @param x {number} number of the line or column
         */
        function gridToPixel(x) {
            return ((self.settings.cellSideLenght + self.settings.cellBorderWidth) * (x - 3));
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
