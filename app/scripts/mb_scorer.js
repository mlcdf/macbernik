/**
 * Created by mmondou on 10/01/17.
 */
(function ($) {

    // here we go!
    $.MB_Scorer = function (element, options) {

        // plugin's default options
        const defaults = {

            SCORELIMIT: 500,
            BONUSLIMIT: 5,
            BONUSVALUE: 50,
            BESTSCORELIMIT: 8,

            scoreP1: 0,
            scoreP2: 0,
            bonusP1: 0,
            bonusP2: 0

        };

        let self = this;

        self.settings = {};

        // the "constructor" method that gets called when the object is created
        self.init = function () {

            self.settings = $.extend({}, defaults, options);

        };

        //Public functions

        /**
         * Check if need to add to the best scores. It's possible to add the same value
         * if it's greater than the last value of the best scores
         * @param {number} nb_tours
         * @returns {boolean}
         */
        self.isABestScore = function (nb_tours) {
            let bestScores = localStorage.getItem('bestScores');

            if (bestScores != null) {
                let bestScoresJson = JSON.parse(bestScores);
                let bestScoresLength = bestScoresJson.length < defaults.BESTSCORELIMIT ? bestScoresJson.length : defaults.BESTSCORELIMIT;
                return bestScoresJson[bestScoresLength-1].nb_tours > nb_tours;
            } else {
                return true;
            }
        };

        /**
         * Add to the best scores the value of nb tours passed in params
         * @param {number} nb_tours
         */
        self.addABestScore = function (nb_tours) {
            let bestScores = localStorage.getItem('bestScores');

            if (bestScores != null) {
                let bestScoresJson = JSON.parse(bestScores);
                bestScoresJson.push({'nb_tours': nb_tours});
                bestScoresJson.sort(function(obj1, obj2) {
                    return obj1.nb_tours - obj2.nb_tours;
                });
                if (bestScoresJson.length == defaults.BESTSCORELIMIT + 1) {
                    bestScoresJson.pop();
                }
                localStorage.setItem('bestScores', JSON.stringify(bestScoresJson));

            } else {
                bestScores = [
                    {'nb_tours': nb_tours}
                ];
                localStorage.setItem('bestScores', JSON.stringify(bestScores));
            }
        };

        /**
         * Check if score is greater than the score limit.
         * @param {number} score
         * @returns {boolean}
         */
        self.isWinnerByScore = function (score) {
            return score > defaults.SCORELIMIT;
        };

        /**
         * Increase Player bonus if it's possible
         * @param {number} player
         */
        self.increaseBonus = function (player) {
            if (player == 1) {
                if (defaults.bonusP1 < defaults.BONUSLIMIT) {
                    defaults.bonusP1 += 1;
                }
            }
            if (player == 2) {
                if (defaults.bonusP2 < defaults.BONUSLIMIT) {
                    defaults.bonusP2 += 1;
                }
            }
        };

        /**
         * Reset Player bonus
         * @param {number} player
         */
        self.resetBonus = function (player) {
            if (player == 1) {
                defaults.bonusP1 = 0;
            }
            if (player == 2) {
                defaults.bonusP2 = 0;
            }
        };

        /**
         * Increase Player score with bonus value if it exists
         * @param {number} player
         * @param {number} pieceValue
         */
        self.increaseScore = function (player, pieceValue) {
            if (player == 1) {
                defaults.scoreP1 = (defaults.bonusP1 == defaults.BONUSLIMIT) ? defaults.scoreP1 += (pieceValue + defaults.BONUSVALUE) : defaults.scoreP1 += pieceValue;
            }
            if (player == 2) {
                defaults.scoreP2 = (defaults.bonusP2 == defaults.BONUSLIMIT) ? defaults.scoreP2 += (pieceValue + defaults.BONUSVALUE) : defaults.scoreP2 += pieceValue;
            }
        };

        //Getters

        self.getScore = function (player) {
            if (player == 1) {
                return defaults.scoreP1;
            }
            if (player == 2) {
                return defaults.scoreP2;
            }
        };

        self.getBonus = function (player) {
            if (player == 1) {
                return defaults.bonusP1;
            }
            if (player == 2) {
                return defaults.bonusP2;
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
            if (undefined == $(this).data('MB_Scorer')) {

                // create a new instance of the plugin
                plugin = new $.MB_Scorer(this, options);

                $(this).data('MB_Scorer', plugin);

            }

        });
        return plugin;
    };

})(jQuery);
