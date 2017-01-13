var mbCore;
(function () {
    'use strict';
    let mbGameEngine = null;
    before(function() {
        mbCore = $.MB_Core();
        mbCore.pluginRegister('MB_Displayer');

        mbGameEngine = $('<table>').MB_GameEngine();
    });

    describe('MB_GameEngine plugin', function () {
        describe('Construct', function () {
            it('should have a default settings', function () {
                expect(mbGameEngine.getSize()).to.equal(7);
            });
        });
    });

})();
