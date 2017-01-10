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
})();
