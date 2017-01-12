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
                {"value": 100, "count": 1},
                {"value": 50, "count": 5},
                {"value": 30, "count": 14},
                {"value": 20, "count": 14},
                {"value": 10, "count": 14}
            ],
            playerOne: "Joueur 1",
            playerTwo: "Joueur 2",
            playerPosition: {"x": 3, "y": 3}
        };

        let gameBoard;
        let $coins;
        let lastRemovedCoinValue = 0;
        let currentPlayer = 1;
        let lastCoin = [0, 0, 0];
        const self = this;
        self.settings = {};

        /**
         * Initialize gameboard with random positions for pieces.
         */
        let initGameBoard = function () {

            // Set player position according to settings.
            gameBoard[self.settings.playerPosition.x][self.settings.playerPosition.y]
                = self.settings.playerOne;

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
                    if (i != self.settings.playerPosition.x || j != self.settings.playerPosition.y) {
                        gameBoard[i][j] = piece;

                        mbCore.MB_Displayer.putCoin(i, j, piece);
                        piecesToAdd.splice(randomIndex, 1);
                    }
                }
            }
        };

        /**
         * Retourne un nombre aléatoire compris
         * @param min int le minimum
         * @param max int le maximum
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
        };

        /**
         * Vérifier si le joueur peut effectuer ce mouvement
         * @param {number} line (de 0 à 6)
         * @param {number} column (de 0 à 6)
         * @returns {boolean} true si le mouvement est possible. false sinon.
         */
        self.isMovePossible = (line, column) => {
            return gameBoard[line][column] !== 0 && (
                self.settings.playerPosition.x == column ||
                self.settings.playerPosition.y == line);

        };

        /**
         * Met à jour la position du joueur
         * @param {number} line (de 0 à 6)
         * @param {number} column (de 0 à 6)
         */
        self.setPlayerPosition = (line, column) => {
            self.settings.playerPosition.x = column;
            self.settings.playerPosition.y = line;
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
                $coin.on('click', function () {
                    const coord = $coin.parent().attr('id').split('_');
                    const line = coord[0];
                    const column = coord[1];

                    if (self.isMovePossible(line, column)) {

                        // We move the player
                        mbCore.onEvent('setPlayerPosition', line, column);

                        // Remove the coin from the board
                        mbCore.onEvent('removeCoin', line, column);
                        const removedCoinValue = self.removeCoin(line, column);


                        // Have some bonus ?
                        if(lastCoin[currentPlayer] == removedCoinValue){
                            mbCore.onEvent('onIncreaseBonus', currentPlayer);
                        }
                        else{
                            mbCore.onEvent('onResetBonus', currentPlayer);
                        }
                        const bonusChain = currentPlayer == 1 ? mbCore.MB_Scorer.settings.bonusP1 : mbCore.MB_Scorer.settings.bonusP2;
                        mbCore.onEvent('setComboChain', currentPlayer, bonusChain);

                        lastCoin[currentPlayer] = removedCoinValue;
                        mbCore.onEvent('displayLastCoinRemoved', currentPlayer, removedCoinValue);

                        mbCore.onEvent('onIncreaseScore', currentPlayer, removedCoinValue);
                        const newScore = mbCore.MB_Scorer.getScore(currentPlayer);
                        mbCore.onEvent('setScore',currentPlayer, newScore);
                        mbCore.onEvent('onAddMessage', `Le joueur ${currentPlayer} a gagné ${removedCoinValue}`);
                        // Si bonus >= 5
                        if(mbCore.MB_Scorer.getBonus(currentPlayer) >= 5){
                            mbCore.onEvent('setBonus', currentPlayer, mbCore.MB_Scorer.settings.BONUSVALUE);
                        }

                        // Changement de joueur
                        currentPlayer = currentPlayer === 1 ? 2 : 1;


                    }
                })
            })
        };

        // fire up the plugin!
        self.init();
        return self;
    };

    $.fn.MB_GameEngine = function (options) {
        let plugin = null;

        this.each(function () {

            // if plugin has not already been attached to the element
            if (undefined == $(this).data("MB_GameEngine")) {

                // create a new instance of the plugin
                // pass the DOM element and the user-provided options as arguments
                plugin = new $.MB_GameEngine(this, options);

                // in the jQuery version of the element
                // store a reference to the plugin object
                // you can later access the plugin and its methods and properties like
                // element.data('MB_GameEngine').publicMethod(arg1, arg2, ... argn) or
                // element.data('MB_GameEngine').settings.propertyName
                $(this).data("MB_GameEngine", plugin);
            }
        });

        return plugin;
    };

})(jQuery);
