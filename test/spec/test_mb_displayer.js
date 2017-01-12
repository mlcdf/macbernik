(function () {
    'use strict';

    let mbDisplayer = null;
    before(function() {
        const $score = $(`
            <div class="score">
                <div class="">
                    Joueur 1: <span class="js-score-1">10</span>
                </div>
                <div class="">
                    Joueur 2: <span class="js-score-2">0</span>
                </div>
            </div>`);

        const $comboChain = $(`
            <div class="combo-chain">
                <div class="gauge" style="position: relative; height: 400px; width: 20px;">
                    <div class="chain-value js-value-p1" style="position:absolute; bottom: 0; left: 0; right: 0;">
                    </div>
                </div>
                <div class="gauge" style="position: relative; height: 400px; width: 20px;">
                    <div class="chain-value js-value-p2 style="position:absolute; bottom: 0; left: 0; right: 0;">
                    </div>
                </div>
            </div>`);

        const $grid = $(`
            <table class="grid">
                <tr>
                    <td id="0_0"></td>
                    <td id="0_1"></td>
                    <td id="0_2"></td>
                </tr>
                <tr>
                    <td id="1_0"></td>
                    <td id="1_1">
                        <div id="player"></div>
                    </td>
                    <td id="1_2"></td>
                </tr>
                <tr>
                    <td id="2_0"></td>
                    <td id="2_1"></td>
                    <td id="2_2"></td>
                </tr>
            </table>`);

        $('body').append($score);
        $('body').append($comboChain);
        $('body').append($grid);

        mbDisplayer = mbCore.MB_Displayer;
    });

    describe('MB_Displayer plugin', function () {
        describe('Construct', function () {
            it('should have a default cell side lenght', function () {
                expect(mbDisplayer.settings.cellSideLenght).to.be.ok;
            });
            it('should have a default border width', function () {
                expect(mbDisplayer.settings.cellBorderWidth).to.be.ok;
            });
        });

        describe('setScore', function () {
            it('should set the score for player1', function () {
                mbDisplayer.setScore(1, 42);
                expect($('.score .js-score-1').text()).to.equal('42');
            });
            it('should set the score for player2', function () {
                mbDisplayer.setScore(2, 1337);
                expect($('.score .js-score-2').text()).to.equal('1337');
            });
        });

        describe('setComboChain', function () {
            it('should set the combo for player 1', function () {
                mbDisplayer.setComboChain(1, 2);
                setTimeout(() => {
                    expect($('.chain-value.js-value-p1').height()).to.equal(160);
                }, 300); // 300ms étant la durée de l'animation.
            });

            it('should set the combo for player 2', function () {
                mbDisplayer.setComboChain(2, 1);
                setTimeout(() => {
                    expect($('.chain-value.js-value-p2').height()).to.equal(80);
                }, 300); // 300ms étant la durée de l'animation.
            });
        });

        describe('putCoin', function () {
            it('should insert a coin', function () {
                mbDisplayer.putCoin(2, 2, 10);
                expect($('.grid #0_0 coin')).to.be.ok;
            });
        });
    });
})();
