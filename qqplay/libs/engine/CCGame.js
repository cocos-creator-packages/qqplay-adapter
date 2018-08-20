
//-- 进入后台后响应
BK.Notification.on("game_enter_background", {}, function () {
    cc.game.emit(cc.game.EVENT_HIDE);
});
//-- 回到前台后响应
BK.Notification.on("game_enter_foreground", {}, function () {
    cc.game.emit(cc.game.EVENT_SHOW);
});
