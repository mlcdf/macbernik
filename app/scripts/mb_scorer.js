/**
 * Created by mmondou on 10/01/17.
 */
(function ($, window, document, undefined) {

    // here we go!
    $.MB_Scorer = function (element, options) {

        // plugin's default options
        // this is private property and is accessible only from inside the plugin
        let defaults = {

            SCORELIMIT: 500,
            BONUSLIMIT: 5,
            BONUSVALUE: 50,
            BESTSCORELIMIT: 8,

            scoreP1: 0,
            scoreP2: 0,
            bonusP1: 1,
            bonusP2: 1

        };

        let self = this;
        self.params = {};

        // the "constructor" method that gets called when the object is created
        self.init = function () {
            self.params = $.extend({}, defaults, options);
            mbCore.eventRegister('onIncreaseScore', 'MB_Scorer');
            mbCore.eventRegister('onIncreaseBonus', 'MB_Scorer');
            mbCore.eventRegister('onResetBonus', 'MB_Scorer');
            mbCore.eventRegister('onAddABestScore', 'MB_Scorer');
        };

        //Public functions

        /**
         * Check if need to add to the best scores. It's possible to add the same value
         * if it's greater than the last value of the best scores
         * @param nb_tours
         * @returns {boolean}
         */
        self.isABestScore = function (nb_tours) {
            let bestScores = localStorage.getItem("bestScores");

            if (bestScores != null) {
                let bestScoresJson = JSON.parse(bestScores);
                let bestScoresLength = bestScoresJson.length < defaults.BESTSCORELIMIT ? bestScoresJson.length : defaults.BESTSCORELIMIT;
                return bestScoresJson[bestScoresLength - 1].nb_tours > nb_tours;
            } else {
                return true;
            }
        };

        /**
         * Add to the best scores the value of nb tours passed in settings
         * @param nb_tours
         */
        self.onAddABestScore = function (nb_tours) {
            let bestScores = localStorage.getItem("bestScores");

            if (bestScores != null) {
                let bestScoresJson = JSON.parse(bestScores);
                bestScoresJson.push({"nb_tours": nb_tours});
                bestScoresJson.sort(function (obj1, obj2) {
                    return obj1.nb_tours - obj2.nb_tours;
                });
                if (bestScoresJson.length == self.params.BESTSCORELIMIT + 1) {
                    bestScoresJson.pop();
                }
                localStorage.setItem("bestScores", JSON.stringify(bestScoresJson));

            } else {
                bestScores = [
                    {"nb_tours": nb_tours}
                ];
                localStorage.setItem("bestScores", JSON.stringify(bestScores));
            }
        };

        /**
         * Check if score is greater than the score limit.
         * @param score
         * @returns {boolean}
         */
        self.isWinnerByScore = function (score) {
            return score >= defaults.SCORELIMIT;
        };

        /**
         * Increment by one the player bonus
         * @param player
         */
        self.onIncreaseBonus = function (player) {
            if (player == 1) {
                if (self.params.bonusP1 < self.params.BONUSLIMIT) {
                    self.params.bonusP1 += 1;
                }
            }
            if (player == 2) {
                if (self.params.bonusP2 < self.params.BONUSLIMIT) {
                    self.params.bonusP2 += 1;
                }
            }
        };

        /**
         * Reset the player bonus
         * @param player
         */
        self.onResetBonus = function (player) {
            if (player == 1) {
                self.params.bonusP1 = 1;
            }
            if (player == 2) {
                self.params.bonusP2 = 1;
            }
        };

        /**
         * Increase the player score by the value in param
         * Increase Player score with bonus value if it exists
         * @param player
         * @param pieceValue
         * @returns {number|boolean} the new score
         */
        self.onIncreaseScore = function (player, pieceValue) {
            if (player == 1) {
                self.params.scoreP1 = (self.params.bonusP1 >= self.params.BONUSLIMIT) ?
                    self.params.scoreP1 += (pieceValue + self.params.BONUSVALUE) :
                    self.params.scoreP1 += pieceValue;
            }
            if (player == 2) {
                self.params.scoreP2 = (self.params.bonusP2 >= self.params.BONUSLIMIT) ? self.params.scoreP2 += (pieceValue + self.params.BONUSVALUE) : self.params.scoreP2 += pieceValue;
            }
        };

        /**
         * return the score of the player past in parameter
         *
         * @param player
         * @returns {number}
         */
        self.getScore = function (player) {
            if (player == 1) {
                return self.params.scoreP1;
            }
            if (player == 2) {
                return self.params.scoreP2;
            }
        };

        /**
         * return the bonus of the player past in parameter
         * @param player
         * @returns {number}
         */
        self.getBonus = function (player) {
            if (player == 1) {
                return self.params.bonusP1;
            }
            if (player == 2) {
                return self.params.bonusP2;
            }
        };

        // fire up the plugin!
        // call the "constructor" method
        self.init();
        return self;
    };

    // add the plugin to the jQuery.fn object
    $.fn.MB_Scorer = function (options) {
        let plugin = null;
        // iterate through the DOM elements we are attaching the plugin to
        this.each(function () {

            // if plugin has not already been attached to the element
            if (undefined == $(this).data("MB_Scorer")) {

                // create a new instance of the plugin
                plugin = new $.MB_Scorer(this, options);

                $(this).data("MB_Scorer", plugin);

            }

        });
        return plugin;
    };

})(jQuery, window, document);
