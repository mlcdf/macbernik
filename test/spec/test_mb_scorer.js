(function () {
    "use strict";

    let mbScorer = null;
    before(function () {
        mbScorer = $.MB_Scorer();
    });

    // Reset localStorage for everytime you refresh the page
    localStorage.clear();

    describe("MB_Scorer plugin", function () {
        describe("Construct", function () {
            it("Should have scoreP1 setting", function () {
                expect(mbScorer.settings.scoreP1).to.exist;
            });
            it("Should have scoreP2 setting", function () {
                expect(mbScorer.settings.scoreP2).to.exist;
            });
            it("Should have bonusP1 setting", function () {
                expect(mbScorer.settings.bonusP1).to.exist;
            });
            it("Should have bonusP2 setting", function () {
                expect(mbScorer.settings.bonusP2).to.exist;
            });
        });

        describe("Initialisation", function () {
            it("ScoreP1 should be equals to 0", function () {
                expect(mbScorer.settings.scoreP1).to.equal(0);
            });
            it("ScoreP2 should be equals to 0", function () {
                expect(mbScorer.settings.scoreP2).to.equal(0);
            });
            it("BonusP1 should be equals to 0", function () {
                expect(mbScorer.settings.bonusP1).to.equal(0);
            });
            it("BonusP2 should be equals to 0", function () {
                expect(mbScorer.settings.bonusP2).to.equal(0);
            });
        });

        describe("Increase tests", function () {
            it("ScoreP1 should be equals to 30", function () {
                mbScorer.increaseScore(1, 30);
                expect(mbScorer.getScore(1)).to.equal(30);
            });
            it("ScoreP2 should be equals to 100", function () {
                mbScorer.increaseScore(2, 100);
                expect(mbScorer.getScore(2)).to.equal(100);
            });
            it("BonusP1 should be equals to 1", function () {
                mbScorer.increaseBonus(1);
                expect(mbScorer.getBonus(1)).to.equal(1);
            });
            it("BonusP2 should be equals to 1", function () {
                mbScorer.increaseBonus(2);
                expect(mbScorer.getBonus(2)).to.equal(1);
            });

            it("BonusP1 should be equals to 5", function () {
                // Go to bonus = 6
                mbScorer.increaseBonus(1);
                mbScorer.increaseBonus(1);
                mbScorer.increaseBonus(1);
                mbScorer.increaseBonus(1);
                mbScorer.increaseBonus(1);
                expect(mbScorer.getBonus(1)).to.equal(5);
            });

            it("BonusP2 should be equals to 5", function () {
                // Go to bonus = 6
                mbScorer.increaseBonus(2);
                mbScorer.increaseBonus(2);
                mbScorer.increaseBonus(2);
                mbScorer.increaseBonus(2);
                mbScorer.increaseBonus(2);
                expect(mbScorer.getBonus(2)).to.equal(5);
            });

            it("ScoreP1 should be equals to 110", function () {
                mbScorer.increaseScore(1, 30);
                expect(mbScorer.getScore(1)).to.equal(110);
            });
            it("ScoreP2 should be equals to 200", function () {
                mbScorer.increaseScore(2, 50);
                expect(mbScorer.getScore(2)).to.equal(200);
            });
        });

        describe("Reset tests", function () {
            it("BonusP1 should be reset", function () {
                mbScorer.resetBonus(1);
                expect(mbScorer.getBonus(1)).to.equal(0);
            });

            it("BonusP2 should be reset", function () {
                mbScorer.resetBonus(2);
                expect(mbScorer.getBonus(2)).to.equal(0);
            });

            it("ScoreP1 should be equals to 140", function () {
                mbScorer.increaseScore(1, 30);
                expect(mbScorer.getScore(1)).to.equal(140);
            });
            it("ScoreP2 should be equals to 250", function () {
                mbScorer.increaseScore(2, 50);
                expect(mbScorer.getScore(2)).to.equal(250);
            });
        });

        describe("Save a best score", function () {
            it("Should bestScores array length to be equals to 1", function () {
                mbScorer.addABestScore(10);

                let arrayScoresJson = JSON.parse(localStorage.getItem("bestScores"));

                expect(arrayScoresJson.length).to.equal(1);
            });

            it("Should bestScores array contains valid new score", function () {
                mbScorer.addABestScore(9);

                let arrayScoresJson = JSON.parse(localStorage.getItem("bestScores"));
                expect(arrayScoresJson).to.deep.include.members([{"nb_tours":9}]);
            });

            it("Should bestScores array contains max 8 values", function () {
                // Go to 8 best scores
                mbScorer.addABestScore(8);
                mbScorer.addABestScore(7);
                mbScorer.addABestScore(6);
                mbScorer.addABestScore(5);
                mbScorer.addABestScore(4);
                mbScorer.addABestScore(3);

                // Add a new best score
                mbScorer.addABestScore(4);

                let arrayScoresJson = JSON.parse(localStorage.getItem("bestScores"));

                expect(arrayScoresJson.length).to.equal(8);
            });

            it("Should bestScores not contains score 10 (last previous score)", function () {

                let arrayScoresJson = JSON.parse(localStorage.getItem("bestScores"));

                let lastBestScore = arrayScoresJson[arrayScoresJson.length-1];

                assert.propertyNotVal(lastBestScore, "nb_tours", 10);
            });
        });

        describe("Is a best score", function () {
            it("Should 1 be a best score", function () {
                expect(mbScorer.isABestScore(1)).to.be.true;
            });

            it("Should 6 be a best score", function () {
                expect(mbScorer.isABestScore(6)).to.be.true;
            });

            it("Should 15 not be a best score", function () {
                expect(mbScorer.isABestScore(15)).to.be.false;
            });
        });
    });
})();
