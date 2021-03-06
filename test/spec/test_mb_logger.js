var mbCore;
(function () {
    'use strict';

    var ul = $('ul#logger-tests');

    let mbLogger = null;
    before(function() {
        mbCore = $.MB_Core();
        mbCore.pluginRegister('MB_Logger','ul#logger-tests');

        mbLogger = mbCore.MB_Logger;
    });

    describe('MB_Logger plugin', function () {
        describe('Construct', function () {
            it('should have a default settings', function () {
                expect(mbLogger.getLimit()).to.be.ok;
            });
        });

        describe('onAddMessage', function () {
            it('should increase history message count', function () {
                mbLogger.onAddMessage('Test');
                expect(mbLogger.getHistory().length).to.equal(1);
            });
        });

        describe('List ', function () {
            it('should contain only <limit> message', function () {

                for (let i = 0; i<100;i++) {
                    mbLogger.onAddMessage('Test');
                }

                expect(ul.children().size()).to.equal(mbLogger.getLimit());
                ul.remove();
            });
        });
    });

})();
