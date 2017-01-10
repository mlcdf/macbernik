(function () {
  'use strict';

    let mbLogger = null;
    before(function() { 
        mbLogger = $.MB_Logger();
        console.log(mbLogger);
    });


    describe('MB_Logger plugin', function () {
        describe('Construct', function () {
            it('should have a default settings', function () {
                expect(mbLogger.settings.limit).to.equal(10);
            });
        });
    });

    describe('MB_Logger plugin', function () {
        describe('addMessage', function () {
            it('should increase history message count', function () {
                mbLogger.addMessage('Test');
                expect(mbLogger.settings.history.length).to.equal(1);
            });
        });
    });
})();
