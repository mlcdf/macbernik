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
            size: 7,
            pieces: [
                {'value': 100, 'count': 1},
                {'value': 50, 'count': 5},
                {'value': 30, 'count': 14},
                {'value': 20, 'count': 14},
                {'value': 10, 'count': 14}
            ],
            playerOne: 'Joueur 1',
            playerTwo: 'Joueur 2',
            playerPosition: {'column': 3, 'line': 3}
        };

        let gameBoard;
        let $coins;
        let currentPlayer = 1;
        let lastCoin = [0, 0, 0];
        let counter = 1;
        const self = this;
        let canPlay = false;
        let AICoinValue = 0;
        self.settings = {};

        /**
         * Initialize gameboard with random positions for pieces.
         */
        let initGameBoard = function () {

            // Set player position according to settings.
            gameBoard[self.settings.playerPosition.column][self.settings.playerPosition.line]
                = 0;

            let piecesToAdd = [];
            let i = 0;
            let j = 0;

            // Creating array containing all pieces that need to be added on the gameboard.
            $(self.settings.pieces).each(function (index, element) {
                for (i = 0; i < element.count; i++) {
                    piecesToAdd.push(element.value);
                }
            });
            // Iterating over gameBoard
            for (i = 0; i < self.settings.size; i++) {
                for (j = 0; j < self.settings.size; j++) {

                    let randomIndex = getRandom(0, piecesToAdd.length - 1);
                    let piece = piecesToAdd[randomIndex];

                    // Piece 100 cannot be placed on the same line or column than initial player position.
                    while (piece == 100 && (i == 3 || j == 3)) {
                        randomIndex = getRandom(0, piecesToAdd.length - 1);
                        piece = piecesToAdd[randomIndex];
                    }
                    // Cannot add piece on initial player position
                    if (i != self.settings.playerPosition.column || j != self.settings.playerPosition.line) {
                        gameBoard[i][j] = piece;

                        mbCore.MB_Displayer.putCoin(i, j, piece);
                        piecesToAdd.splice(randomIndex, 1);
                    }
                }
            }
        };

        /**
         * Retourne un nombre aléatoire compris
         * @param min {number} le minimum
         * @param max {number} le maximum
         * @returns {number} compris entre min & max
         */
        let getRandom = function (min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        };

        // the "constructor" method that gets called when the object is created
        self.init = function () {
            self.settings = $.extend({}, defaults, options);

            gameBoard = createArray(self.settings.size);
            initGameBoard();
            $coins = $('.coin');
            bindEventToCoin();
            mbCore.eventRegister('setPlayerPosition', 'MB_GameEngine');
            mbCore.eventRegister('onAIPlayed', 'MB_GameEngine');
            canPlay = true;

            $('.start-game-multi-js').on('click', function () {
                self.enableIA(false);
            });

            $('.start-game-easy-js').on('click', function () {
                self.enableIA(true);
                mbCore.MB_AI.setDifficulty('easy');
            });

            $('.start-game-medium-js').on('click', function () {
                self.enableIA(true);
                mbCore.MB_AI.setDifficulty('normal');
            });
        };

        /**
         * Vérifier si le joueur peut effectuer ce mouvement
         * @param {number} line (de 0 à 6)
         * @param {number} column (de 0 à 6)
         * @returns {boolean} true si le mouvement est possible. false sinon.
         */
        self.isMovePossible = (line, column) => {
            return gameBoard[line][column] !== 0 && (
                self.settings.playerPosition.column == column ||
                self.settings.playerPosition.line == line);

        };

        /**
         * Met à jour la position du joueur
         * @param {number} line (de 0 à 6)
         * @param {number} column (de 0 à 6)
         */
        self.setPlayerPosition = (line, column) => {
            self.settings.playerPosition.column = column;
            self.settings.playerPosition.line = line;
        };

        /**
         * Retire un pièce du jeu
         * @param {number} line (de 0 à 6)
         * @param {number} column (de 0 à 6)
         */
        self.removeCoin = (line, column) => {
            const coinValue = gameBoard[line][column];
            gameBoard[line][column] = 0; // Suppression logique de la pièce
            return coinValue;
        };

        /**
         * Retourne la valeur de la case demandée
         * @param line int
         * @param column int
         * @returns Valeur de la piece demandée
         */
        self.getPiece = function (line, column) {
            return gameBoard[line][column];
        };

        /**
         * Retourne la position du joueur, sous forme d'objet
         * @return Object {"line":line,"column":column}
         */
        self.getPlayerPosition = function () {
            return self.settings.playerPosition;
        };

        //TODO à mettre dans l'IA
        self.enableIA = function (bool) {
            self.settings.ia = bool;
        };

        /**
         * Cette fonction permet de créer un tableau de n colonnes par n lignes
         * @param rows int Taille du tableau.
         * @returns {Array}
         */
        let createArray = function (rows) {
            let array2D = new Array(rows);

            for (let i = 0; i < array2D.length; i++) {
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

        let bindEventToCoin = function () {
            $coins.each(function () {
                let $coin = $(this);
                let line;
                let column;
                $coin.on('click', function () {
                    // Can the player play ?
                    if (canPlay == true) {
                        // Avoiding spam click
                        canPlay = false;
                        const coord = $coin.parent().attr('id').split('_');
                        line = coord[0];
                        column = coord[1];
                        _doMove(line, column);
                    }
                });
            });
        };

        /**
         * Test if the player can not take any coin at the next turn.
         * @return {boolean} true if can not move.
         */
        let canNotMove = function () {
            // Any coin on the current column ?
            for (let line = 0; line < 7; line++) {
                for (let column = 0 ;column < 7; column++) {
                    if (self.isMovePossible(line, column)) {
                        return false;
                    }
                }
            }
            return true;
        };

        /**
         * Check if the requested move is legit.
         * Move player, give point and fire up the IA if enabled.
         * @param line
         * @param column
         */
        let _doMove = function (line, column) {
            if (self.isMovePossible(line, column)) {
                // We move the player
                mbCore.onEvent('setPlayerPosition', line, column);

                // Remove the coin from the board
                mbCore.onEvent('removeCoin', line, column);
                const removedCoinValue = self.removeCoin(line, column);


                // Have some bonus ?
                _doScore(removedCoinValue);

                // Victory  ?
                _checkVictory();

                // Changement de joueur
                currentPlayer = currentPlayer === 1 ? 2 : 1;
                counter++;
                // AI turn ?
                if (self.settings.ia && currentPlayer == 2) {
                    setTimeout(function () {
                        mbCore.onEvent('onAIPlay', AICoinValue);
                    }, 700);

                }
                else {
                    canPlay = true;
                }

            }
            else{
                canPlay = true;
            }
        };

        /**
         * Check combo and bonus, give point
         * @param removedCoinValue
         */
        let _doScore = function (removedCoinValue) {
            if (lastCoin[currentPlayer] == removedCoinValue) {
                mbCore.onEvent('onIncreaseBonus', currentPlayer);
            }
            else {
                mbCore.onEvent('onResetBonus', currentPlayer);
            }
            const bonusChain = currentPlayer == 1 ? mbCore.MB_Scorer.params.bonusP1 : mbCore.MB_Scorer.params.bonusP2;
            mbCore.onEvent('setComboChain', currentPlayer, bonusChain);

            lastCoin[currentPlayer] = removedCoinValue;
            mbCore.onEvent('displayLastCoinRemoved', currentPlayer, removedCoinValue);

            mbCore.onEvent('onIncreaseScore', currentPlayer, removedCoinValue);
            const newScore = mbCore.MB_Scorer.getScore(currentPlayer);
            mbCore.onEvent('setScore', currentPlayer, newScore);
            mbCore.onEvent('onAddMessage', `Le joueur ${currentPlayer} a gagné ${removedCoinValue} £`);
            // Si bonus >= 5
            if (mbCore.MB_Scorer.getBonus(currentPlayer) >= 5) {
                mbCore.onEvent('setBonus', currentPlayer, mbCore.MB_Scorer.params.BONUSVALUE);
            }
        };

        let _checkVictory = function () {
            if (mbCore.MB_Scorer.isWinnerByScore(mbCore.MB_Scorer.getScore(currentPlayer))) {
                // Best score
                if (mbCore.MB_Scorer.isABestScore(counter)) {
                    mbCore.onEvent('onAddABestScore', counter);
                }
                mbCore.onEvent('showVictoryModal', currentPlayer);
                mbCore.onEvent('onAddMessage', 'Le joueur ' + currentPlayer + ' a gagné la partie !!');
            }
            if (canNotMove()) {
                // Best score
                if (mbCore.MB_Scorer.isABestScore(counter)) {
                    mbCore.onEvent('onAddABestScore', counter);
                }
                mbCore.onEvent('showVictoryModal', currentPlayer === 1 ? 2 : 1);
                mbCore.onEvent('onAddMessage', 'Le joueur ' + currentPlayer === 1 ? 2 : 1 + ' a gagné la partie !!');
            }
            // TODO fire up onEndGame
        };
        self.onAIPlayed = function (position) {
            _doMove(position.line, position.column);
            AICoinValue = self.getPiece(position.line, position.column);
        };

        // fire up the plugin!
        self.init();
        return self;
    };

    $.fn.MB_GameEngine = function (options) {
        let plugin = null;

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
    };

})(jQuery);
