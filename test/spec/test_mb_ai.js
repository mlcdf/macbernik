let mbCore;
(function () {
    'use strict';

    let mbAI = null;
    before(function() {
        mbCore = $.MB_Core();
        mbCore.pluginRegister('MB_AI');
        mbAI = mbCore.MB_AI;
    });

    describe('MB_AI plugin', function () {

        describe('Construct', function () {
            it('should have a default settings', function () {
                expect(mbAI.settings.difficulty).to.equal('easy');
            });
        });

        describe('Custom initial player position', function () {
            it('Should be able to change difficulty', function () {
                mbAI.setDifficulty('normal');
                expect(mbAI.settings.difficulty).to.equal('normal');
            });
        });


    });

})();
