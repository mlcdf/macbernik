(function () {
    "use strict";

    let mbGameEngine = null;
    before(function() {
        mbGameEngine = $("<table>").MB_GameEngine();
    });

    describe("MB_GameEngine plugin", function () {
        describe("Construct", function () {
            it("should have a default settings", function () {
                expect(mbGameEngine.settings.size).to.equal(7);
            });
        });

        describe("Custom initial player position", function () {
            it("Should allow user to set custom values", function () {

                const customPosition = {"x": 4,"y": 4};

                mbGameEngine = $("<table>").MB_GameEngine({playerPosition:customPosition});
                
                assert.equal(mbGameEngine.settings.playerPosition, customPosition);
            });
        });

        describe("Initial player position", function () {
            it("Player should be at (4,4) with defaults settings.", function () {

                expect(mbGameEngine.get(4,4)).to.equal(mbGameEngine.settings.playerOne);

            });
        });
    });

})();
