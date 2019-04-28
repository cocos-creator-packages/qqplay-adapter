/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
var renderer = cc.renderer;
var dynamicAtlasManager = cc.dynamicAtlasManager;

//-- Respond after entering the background
BK.onEnterBackground(function () {
    cc.game.emit(cc.game.EVENT_HIDE);
});
//-- Respond back to the foreground
BK.onEnterForeground(function () {
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

cc.game._initRenderer = function () {
    // Avoid setup to be called twice.
    if (this._rendererInitialized) return;
        
    this.container = document.createElement("DIV");
    this.frame = document.documentElement;
    let localCanvas = this.canvas = canvas;

    this._determineRenderType();
    // WebGL context created successfully
    if (this.renderType === this.RENDER_TYPE_WEBGL) {
        var opts = {
            'stencil': true,
            // MSAA is causing serious performance dropdown on some browsers.
            'antialias': cc.macro.ENABLE_WEBGL_ANTIALIAS,
            'alpha': cc.macro.ENABLE_TRANSPARENT_CANVAS,
            'preserveDrawingBuffer': true,
        };

        renderer.initWebGL(localCanvas, opts);
        this._renderContext = renderer.device._gl;
        
        // Enable dynamic atlas manager by default
        if (!cc.macro.CLEANUP_IMAGE_CACHE && dynamicAtlasManager) {
            dynamicAtlasManager.enabled = true;
        }
    }
    if (!this._renderContext) {
        this.renderType = this.RENDER_TYPE_CANVAS;
        // Could be ignored by module settings
        renderer.initCanvas(localCanvas);
        this._renderContext = renderer.device._ctx;
    }

    this.canvas.oncontextmenu = function () {
        if (!cc._isContextMenuEnable) return false;
    };

    this._rendererInitialized = true;
};