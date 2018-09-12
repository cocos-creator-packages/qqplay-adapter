
//-- 进入后台后响应
BK.Notification.on("game_enter_background", {}, function () {
    cc.game.emit(cc.game.EVENT_HIDE);
});
//-- 回到前台后响应
BK.Notification.on("game_enter_foreground", {}, function () {
    cc.game.emit(cc.game.EVENT_SHOW);
});


//
var _frameRate = 60;
cc.game.setFrameRate = function (frameRate) {
    _frameRate = frameRate;
    if (_frameRate === 60) {
        BK.Director.tickerSetInterval(1);
    }
    else if (_frameRate === 30) {
        BK.Director.tickerSetInterval(2);
    }
    else {
        BK.Script.log(1, 0, '-- only supports frame rate of 60 or 30 on qqplay --');
        BK.Director.tickerSetInterval(1);
    }
};

cc.game.getFrameRate = function () {
    return _frameRate;
};

cc.game._runMainLoop = function () {
    var self = this, callback, config = self.config,
        director = cc.director,
        skip = true, frameRate = config.frameRate;

    cc.debug.setDisplayStats(config.showFPS);

    callback = function () {
        if (!self._paused) {
            self._intervalId = window.requestAnimFrame(callback);
            director.mainLoop();
        }
    };

    self._intervalId = window.requestAnimFrame(callback);
    self._paused = false;
};