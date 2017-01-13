(function ($) {

    $.MB_AI = function (element, options) {

        const defaults = {
            difficulty: "easy" // Or "normal
        };


        // to avoid confusions, use "self" to reference the
        // current instance of the object
        let self = this;

        self.AI_param = {};

        self.init = function () {
            self.AI_param = $.extend({}, defaults, options);
            mbCore.eventRegister('onAIPlay', 'MB_AI');
        };

        self.setDifficulty = function(difficulty) {
            self.AI_param.difficulty = difficulty;
        };

        /**
         * @param lastAIPiece
         * @returns {*}
         */
        let _play = function (AICoinValue) {
            let move;

            if (self.AI_param.difficulty == "easy") {
                move = playEasy();
            } else {
                move = playNormal(AICoinValue);
            }
            return move;
        };

        self.onAIPlay = function (AICoinValue){
            const move = _play(AICoinValue);
            mbCore.onEvent('onAIPlayed', move);
        };

        /**
         *
         * @param AICoinValue
         * @returns {undefined}
         */
        let playNormal = function (AICoinValue) {
            let playerPosition = mbCore.MB_GameEngine.getPlayerPosition();

            let availableMoves = getAvailableMovesMedium(playerPosition.line, playerPosition.column);

            availableMoves.sort(function (obj1, obj2) {
                return obj2.value - obj1.value;
            });

            let availableMove = undefined;

            $(availableMoves).each(function(i, e) {
                if (e.value == AICoinValue) {
                    availableMove = e;
                    return false;
                }
            });

            if (availableMoves.length != 0 && availableMove == undefined) {
                availableMove = availableMoves[0];
            }

            return availableMove;
        };

        /**
         *
         * @param line
         * @param column
         * @returns {Array}
         */
        let getAvailableMovesMedium = function (line, column) {

            let availableMoves = [];
            let tmpPiece;

            line = parseInt(line);
            column = parseInt(column);

            for (let i = line - 1; i >= 0; i--) {
                tmpPiece = mbCore.MB_GameEngine.getPiece(i, column);
                if (tmpPiece != 0 && typeof tmpPiece == 'number') {
                    availableMoves.push({"line": i, "column": column, "value": tmpPiece});
                }
            }
            for (let i = column + 1; i < mbCore.MB_GameEngine.settings.size; i++) {
                tmpPiece = mbCore.MB_GameEngine.getPiece(line, i);
                if (tmpPiece != 0 && typeof tmpPiece == 'number') {
                    availableMoves.push({"line": line, "column": i, "value": tmpPiece});
                }
            }
            for (let i = line + 1; i < mbCore.MB_GameEngine.settings.size; i++) {
                tmpPiece = mbCore.MB_GameEngine.getPiece(i, column);
                if (tmpPiece != 0 && typeof tmpPiece == 'number') {
                    availableMoves.push({"line": i, "column": column, "value": tmpPiece});
                }
            }
            for (let i = column - 1; i >= 0; i--) {
                tmpPiece = mbCore.MB_GameEngine.getPiece(line, i);
                if (tmpPiece != 0 && typeof tmpPiece == 'number') {
                    availableMoves.push({"line": line, "column": i, "value": tmpPiece});
                }
            }

            return availableMoves;
        };

        /**
         *
         * @param direction
         * @param line
         * @param column
         * @returns {Array}
         */
        let getAvailableMoves = function (direction, line, column) {

            let availableMoves = [];
            let tmpPiece;

            line = parseInt(line);
            column = parseInt(column);

            switch (direction) {
                case 0: // Top
                    for (let i = line - 1; i >= 0; i--) {
                        tmpPiece = mbCore.MB_GameEngine.getPiece(i, column);
                        if (tmpPiece != 0 && typeof tmpPiece == 'number') {
                            availableMoves.push({"line": i, "column": column});
                        }
                    }
                    break;
                case 1: // Right
                    for (let i = column + 1; i < mbCore.MB_GameEngine.settings.size; i++) {
                        tmpPiece = mbCore.MB_GameEngine.getPiece(line, i);
                        if (tmpPiece != 0 && typeof tmpPiece == 'number') {
                            availableMoves.push({"line": line, "column": i});
                        }
                    }
                    break;
                case 2: // Bottom
                    for (let i = line + 1; i < mbCore.MB_GameEngine.settings.size; i++) {
                        tmpPiece = mbCore.MB_GameEngine.getPiece(i, column);
                        if (tmpPiece != 0 && typeof tmpPiece == 'number') {
                            availableMoves.push({"line": i, "column": column});
                        }
                    }
                    break;
                case 3: // Left
                    for (let i = column - 1; i >= 0; i--) {
                        tmpPiece = mbCore.MB_GameEngine.getPiece(line, i);
                        if (tmpPiece != 0 && typeof tmpPiece == 'number') {
                            availableMoves.push({"line": line, "column": i});
                        }
                    }
                    break;
            }
            return availableMoves;
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

        /**
         * Fonction qui permet de retourner un mouvement possible pour l'AI
         * @returns {*}
         */
        let playEasy = function () {

            let playerPosition = mbCore.MB_GameEngine.getPlayerPosition();

            let direction = getRandom(0, 3);
            let availableMoves = getAvailableMoves(direction, playerPosition.line, playerPosition.column);
            let cpt = 0;

            while (availableMoves.length == 0 && cpt < 4) {
                if (direction == 3) {
                    direction = 0;
                    cpt++;
                } else {
                    direction++;
                    cpt++;
                }
                availableMoves = getAvailableMoves(direction, playerPosition.line, playerPosition.column);
            }

            if (availableMoves.length == 0) {
                // GAME ENGINE = FIN DUJEU
                console.log("Erreur, fin du jeu, aucun move possible");
                return null;
            }

            let move = getRandom(0, availableMoves.length -1);

            return availableMoves[move];
        };

        self.init();
        return self;
    };

    // Add the plugin to the jQuery.fn object
    $.fn.MB_AI = function (options) {
        let plugin = null;

        this.each(function () {
            if (undefined == $(this).data("MB_AI")) {
                plugin = new $.MB_AI(this, options);
                $(this).data("MB_AI", plugin);
            }
        });
        return plugin;
    };

})(jQuery);
