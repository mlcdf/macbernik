/* eslint-disable no-unused-vars */
var mbCore;
$(document).ready(function () {

    mbCore = $.MB_Core();
    mbCore.pluginRegister('MB_Logger', '#logger');
    mbCore.pluginRegister('MB_Scorer');
    mbCore.pluginRegister('MB_Displayer');
    mbCore.pluginRegister('MB_GameEngine', '#board-game');
});
