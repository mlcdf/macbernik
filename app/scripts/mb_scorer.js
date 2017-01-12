/**
 * Created by mmondou on 10/01/17.
 */
(function ($) {

    // here we go!
    $.MB_Scorer = function (element, options) {

        // plugin's default options
        // this is private property and is accessible only from inside the plugin
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

        const self = this;
        self.settings = {};

        // the "constructor" method that gets called when the object is created
        self.init = function () {
            self.settings = $.extend({}, defaults, options);
            mbCore.eventRegister('onIncreaseScore', 'MB_Scorer');
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
                let bestScoresLength = bestScoresJson.length < self.settings.BESTSCORELIMIT ? bestScoresJson.length : self.settings.BESTSCORELIMIT;
                return bestScoresJson[bestScoresLength - 1].nb_tours > nb_tours;
            } else {
                return true;
            }
        };

        /**
         * Add to the best scores the value of nb tours passed in params
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
                if (bestScoresJson.length == self.settings.BESTSCORELIMIT + 1) {
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
            return score > self.settings.SCORELIMIT;
        };

        /**
         * Increment by one the player bonus
         * @param player
         */
        self.onIncreaseBonus = function (player) {
            if (player == 1) {
                if (self.settings.bonusP1 < self.settings.BONUSLIMIT) {
                    self.settings.bonusP1 += 1;
                }
            }
            if (player == 2) {
                if (self.settings.bonusP2 < self.settings.BONUSLIMIT) {
                    self.settings.bonusP2 += 1;
                }
            }
        };

        /**
         * Reset the player bonus
         * @param player
         */
        self.onResetBonus = function (player) {
            if (player == 1) {
                self.settings.bonusP1 = 0;
            }
            if (player == 2) {
                self.settings.bonusP2 = 0;
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
                self.settings.scoreP1 = (self.settings.bonusP1 == self.settings.BONUSLIMIT) ? self.settings.scoreP1 += (pieceValue + self.settings.BONUSVALUE) : self.settings.scoreP1 += pieceValue;
            }
            if (player == 2) {
                self.settings.scoreP2 = (self.settings.bonusP2 == self.settings.BONUSLIMIT) ? self.settings.scoreP2 += (pieceValue + self.settings.BONUSVALUE) : self.settings.scoreP2 += pieceValue;
            }
        };

        self.getScore = function (player) {
          return eval(self.settings.scoreP+'player');
        };
        /**
         * return the score of the player past in parameter
         *
         * @param player
         * @returns {number}
         */
        self.getScore = function (player) {
            if (player == 1) {
                return self.settings.scoreP1;
            }
            if (player == 2) {
                return self.settings.scoreP2;
            }
        };

        /**
         * return the bonus of the player past in parameter
         * @param player
         * @returns {number}
         */
        self.getBonus = function (player) {
            if (player == 1) {
                return self.settings.bonusP1;
            }
            if (player == 2) {
                return self.settings.bonusP2;
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
                // pass the DOM element and the user-provided options as arguments
                plugin = new $.MB_Scorer(this, options);

                // in the jQuery version of the element
                // store a reference to the plugin object
                // you can later access the plugin and its methods and properties like
                // element.data('TH_Core').publicMethod(arg1, arg2, ... argn) or
                // element.data('TH_Core').settings.propertyName
                $(this).data("MB_Scorer", plugin);

            }

        });
        return plugin;
    };

})(jQuery);
