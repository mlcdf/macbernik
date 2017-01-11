/* eslint-disable no-unused-vars */

$(document).ready(function() {

    const mbCore = $("#MB").MB_Core();
    const mbLogger = $("#logger > ul").MB_Logger();
    const mbScorer = $.MB_Scorer();
    const mbGameEngine = $("#board-game").MB_GameEngine();
    const mbDisplayer = $.MB_Displayer();

    let currentPlayer = 1;

    const onPlayerMove = function () {
        $(".coin").each(function () {
            $(this).on("click", function () {
                const line = $(this).parent().attr("id").split("_")[0];
                const column = $(this).parent().attr("id").split("_")[1];
                if (mbGameEngine.isMovePossible(line, column)) {
                    mbGameEngine.setPlayerPosition(line, column);

                    // Logique à déplacer dans le GameEngine ?
                    mbDisplayer.setPlayerPosition(line, column);
                    mbDisplayer.removeCoin(line, column);
                    const removedCoinValue = mbGameEngine.removeCoin(line, column);
                    const newScore = mbScorer.onIncreaseScore(currentPlayer, removedCoinValue);
                    mbDisplayer.setScore(currentPlayer, newScore);

                    mbLogger.onAddMessage(`Le joueur ${currentPlayer} a gagné ${removedCoinValue} points`);

                    // Alterne les tours entre joueur 1 et joueur 2
                    currentPlayer = currentPlayer === 1 ? 2 : 1;
                }
            });
        });
    };
    onPlayerMove();

    $(".start-game-js").on("click", function () {
        mbDisplayer.hideMenuAndShowGame();
    });

    $(".back-to-menu-js").on("click", function () {
        mbDisplayer.hideMenuAndShowGame();
    });

    mbDisplayer.setComboChain(1, 3);
    mbDisplayer.setComboChain(2, 5);
});
