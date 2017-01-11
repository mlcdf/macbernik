(function () {
  'use strict';

    var ul = $('<ul>');

    let mbLogger = null;
    before(function() {
        mbLogger = $(ul).MB_Logger();
    });


    describe('MB_Logger plugin', function () {
        describe('Construct', function () {
            it('should have a default settings', function () {
                expect(mbLogger.settings.limit).to.equal(10);
            });
        });

        describe('addMessage', function () {
            it('should increase history message count', function () {
                mbLogger.onAddMessage('Test');
                expect(mbLogger.settings.history.length).to.equal(1);
            });
        });

        describe('List ', function () {
            it('should contain only <limit> message', function () {

                for (let i = 0; i<100;i++) {
                    mbLogger.onAddMessage('Test');
                }

                expect(ul.children().size()).to.equal(mbLogger.settings.limit);
            });
        });
    });

})();
