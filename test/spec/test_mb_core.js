(function () {
    "use strict";

    let mbCore = null;
    before(function() {
        mbCore = $.MB_Core();
    });


    describe("MB_Core plugin", function () {
        describe("Construct", function () {
            it("should have a default settings", function () {
                expect(mbCore.settings.foo).to.equal("bar");
            });
        });
    });
})();
