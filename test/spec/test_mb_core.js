var MB_Core = null;
(function () {
    'use strict';

    before(function() {
        MB_Core = $.MB_Core();
    });


    describe('MB_Core plugin', function () {
        describe('Construct', function () {
            it('should have a default settings', function () {
                expect(MB_Core.settings.foo).to.equal('bar');
            });
        });
    });
})();
