var mbCore;
(function () {
    'use strict';

    let mbScorer = null;
    before(function() {
        mbCore = $.MB_Core();
        mbCore.pluginRegister('MB_Scorer');

        mbScorer = mbCore.MB_Scorer;
    });

    // Reset localStorage for everytime you refresh the page
    localStorage.clear();

    describe('MB_Scorer plugin', function () {
        describe('Construct', function () {
            it('Should have scoreP1 setting', function () {
                expect(mbScorer.settings.scoreP1).to.exist;
            });
            it('Should have scoreP2 setting', function () {
                expect(mbScorer.settings.scoreP2).to.exist;
            });
            it('Should have bonusP1 setting', function () {
                expect(mbScorer.settings.bonusP1).to.exist;
            });
            it('Should have bonusP2 setting', function () {
                expect(mbScorer.settings.bonusP2).to.exist;
            });
        });

        describe('Initialisation', function () {
            it('ScoreP1 should be equals to 0', function () {
                expect(mbScorer.settings.scoreP1).to.equal(0);
            });
            it('ScoreP2 should be equals to 0', function () {
                expect(mbScorer.settings.scoreP2).to.equal(0);
            });
            it('BonusP1 should be equals to 0', function () {
                expect(mbScorer.settings.bonusP1).to.equal(0);
            });
            it('BonusP2 should be equals to 0', function () {
                expect(mbScorer.settings.bonusP2).to.equal(0);
            });
        });

        describe('Increase tests', function () {
            it('ScoreP1 should be equals to 30', function () {
                mbScorer.onIncreaseScore(1, 30);
                expect(mbScorer.getScore(1)).to.equal(30);
            });
            it('ScoreP2 should be equals to 100', function () {
                mbScorer.onIncreaseScore(2, 100);
                expect(mbScorer.getScore(2)).to.equal(100);
            });
            it('BonusP1 should be equals to 1', function () {
                mbScorer.onIncreaseBonus(1);
                expect(mbScorer.getBonus(1)).to.equal(1);
            });
            it('BonusP2 should be equals to 1', function () {
                mbScorer.onIncreaseBonus(2);
                expect(mbScorer.getBonus(2)).to.equal(1);
            });

            it('BonusP1 should be equals to 5', function () {
                // Go to bonus = 6
                mbScorer.onIncreaseBonus(1);
                mbScorer.onIncreaseBonus(1);
                mbScorer.onIncreaseBonus(1);
                mbScorer.onIncreaseBonus(1);
                mbScorer.onIncreaseBonus(1);
                expect(mbScorer.getBonus(1)).to.equal(5);
            });

            it('BonusP2 should be equals to 5', function () {
                // Go to bonus = 6
                mbScorer.onIncreaseBonus(2);
                mbScorer.onIncreaseBonus(2);
                mbScorer.onIncreaseBonus(2);
                mbScorer.onIncreaseBonus(2);
                mbScorer.onIncreaseBonus(2);
                expect(mbScorer.getBonus(2)).to.equal(5);
            });

            it('ScoreP1 should be equals to 110', function () {
                mbScorer.onIncreaseScore(1, 30);
                expect(mbScorer.getScore(1)).to.equal(110);
            });
            it('ScoreP2 should be equals to 200', function () {
                mbScorer.onIncreaseScore(2, 50);
                expect(mbScorer.getScore(2)).to.equal(200);
            });
        });

        describe('Reset tests', function () {
            it('BonusP1 should be reset', function () {
                mbScorer.onResetBonus(1);
                expect(mbScorer.getBonus(1)).to.equal(0);
            });

            it('BonusP2 should be reset', function () {
                mbScorer.onResetBonus(2);
                expect(mbScorer.getBonus(2)).to.equal(0);
            });

            it('ScoreP1 should be equals to 140', function () {
                mbScorer.onIncreaseScore(1, 30);
                expect(mbScorer.getScore(1)).to.equal(140);
            });
            it('ScoreP2 should be equals to 250', function () {
                mbScorer.onIncreaseScore(2, 50);
                expect(mbScorer.getScore(2)).to.equal(250);
            });
        });

        describe('Save a best score', function () {
            it('Should bestScores array length to be equals to 1', function () {
                mbScorer.onAddABestScore(10);

                let arrayScoresJson = JSON.parse(localStorage.getItem('bestScores'));

                expect(arrayScoresJson.length).to.equal(1);
            });

            it('Should bestScores array contains valid new score', function () {
                mbScorer.onAddABestScore(9);

                let arrayScoresJson = JSON.parse(localStorage.getItem('bestScores'));
                expect(arrayScoresJson).to.deep.include.members([{'nb_tours':9}]);
            });

            it('Should bestScores array contains max 8 values', function () {
                // Go to 8 best scores
                mbScorer.onAddABestScore(8);
                mbScorer.onAddABestScore(7);
                mbScorer.onAddABestScore(6);
                mbScorer.onAddABestScore(5);
                mbScorer.onAddABestScore(4);
                mbScorer.onAddABestScore(3);

                // Add a new best score
                mbScorer.onAddABestScore(4);

                let arrayScoresJson = JSON.parse(localStorage.getItem('bestScores'));

                expect(arrayScoresJson.length).to.equal(8);
            });

            it('Should bestScores not contains score 10 (last previous score)', function () {

                let arrayScoresJson = JSON.parse(localStorage.getItem('bestScores'));

                var lastBestScore = arrayScoresJson[arrayScoresJson.length-1];

                assert.propertyNotVal(lastBestScore, 'nb_tours', 10);
            });
        });

        describe('Is a best score', function () {
            it('Should 1 be a best score', function () {
                expect(mbScorer.isABestScore(1)).to.be.true;
            });

            it('Should 6 be a best score', function () {
                expect(mbScorer.isABestScore(6)).to.be.true;
            });

            it('Should 15 not be a best score', function () {
                expect(mbScorer.isABestScore(15)).to.be.false;
            });
        });
    });
})();
