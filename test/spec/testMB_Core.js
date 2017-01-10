(function () {
    'use strict';

    let MB_Core = $().MB_Core();

    describe('MB_Core plugin', function () {
        describe('Construct', function () {
            it('should have a default settings', function () {
                expect(MB_Core.settings.foo).to.equal('bar');
            });
        });
    });
})();
