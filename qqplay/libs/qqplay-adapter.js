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

BK.Script.loadlib('GameRes://libs/qqPlayCore.js');

var gl;
var window = this;
window.addEventListener = function () {};
window.removeEventListener = function () {};

var navigator = window.navigator = {
    userAgent: 'qqplay ' + GameStatusInfo.platform + ' QQ/' + GameStatusInfo.QQVer,
    appVersion: ''
};

var location = window.location = {
    href: "",
};

BK.Script.loadlib('GameRes://libs/xmldom/dom-parser.js');

// import element node
BK.Script.loadlib('GameRes://libs/element/index.js');

HTMLElement = _HTMLBaseElemenet;
Image = window.Image = HTMLImageElement;
document = window.document = new HTMLDocumentElement();

var canvas = new HTMLMainCanvasElement();
canvas.id = 'GameCanvas';
document.body.appendChild(canvas);

var HTMLCanvasElement = BK.Canvas;

var console = window.console = {
    log: function () {
        var msg = cc.js.formatStr.apply(null, arguments);
        BK.Script.log(1, 0, msg);
    },
    warn: function () {
        var msg = cc.js.formatStr.apply(null, arguments);
        BK.Script.log(1, 0, msg);
    },
    error: function () {
        var msg = cc.js.formatStr.apply(null, arguments);
        BK.Script.log(1, 0, msg);
    },
    info: function() {
        var msg = cc.js.formatStr.apply(null, arguments);
        BK.Script.log(1, 0, msg);
    },
    debug: function() {
        var msg = cc.js.formatStr.apply(null, arguments);
        BK.Script.log(1, 0, msg);
    },
};

window["BK"] = BK;
window["isQQPlay"] = true;
alert = window.alert = console.warn;
window["pageXOffset"] = 0;
window["pageYOffset"] = 0;

var WebGLRenderingContext = function () {};

// Used to adapter after loading the engine
function initAdapter () {

    var sps = BK.Director.screenPixelSize;
    window.innerWidth = sps.width;
    window.innerHeight = sps.height;

    canvas.width = sps.width;
    canvas.height = sps.height;

    // adapt _runMainLoop

    cc.game._setAnimFrame = function () {
        this._lastTime = new Date();
        this._frameTime = 1000 / this.config.frameRate;
        window.requestAnimFrame = window.requestAnimationFrame;
        window.cancelAnimFrame = window.cancelAnimationFrame;
    };

    var callback, self;
    cc.game._runMainLoop = function () {
        self = this;
        cc.debug.setDisplayStats(self.config.showFPS);

        callback = function () {
            if (!self._paused) {
                self._intervalId = window.requestAnimFrame(callback);
                cc.director.mainLoop();
            }
        };

        self._intervalId = window.requestAnimFrame(callback);
        self._paused = false;
    };

    // adapt engine component
    BK.Script.loadlib('GameRes://libs/engine/index.js');
}

var rendererAdapterInited = false;
function initRendererAdapter () {
    if (rendererAdapterInited) {
        return;
    }
    rendererAdapterInited = true;
    cc.renderer.__render = cc.renderer.render;
    cc.renderer.render = function (ecScene) {
        this.__render(ecScene);
        // In order to avoid the qqplay get the wrong vbo after unbind buffer. 
        cc.renderer.device._current.maxStream = -1;
        gl.glCommit();
    };
    gl.canvas = canvas;
}

Float32Array.prototype.subarray = function (begin, end) {
    return new Float32Array(this.buffer, begin, end)
};

Uint16Array.prototype.subarray = function (begin, end) {
    return new Uint16Array(this.buffer, begin, end)
};

//--BK.Canvas------------------------------------------------

var prototype = BK.Canvas.prototype;
prototype.addEventListener = function () {};
prototype.createLinearGradient = function () {};
prototype.setTransform = prototype.transforms;
var _fillText = prototype.strokeText = prototype.fillText;
prototype.fillText = function () {
    this.lineWidth = 0;
    _fillText.apply(this, arguments);
};
prototype.getImageData = function(){
    return {data : [1, 0, 1, 0]};
};
prototype.focus = function(){};
prototype.getContext = function () {
    return this;
};
Object.defineProperty(prototype, "width", {
    get: function () {
        return this.contentSize.width;
    },
    set: function (val) {
        var size = this.contentSize;
        size.width = val;
        this.contentSize = size;
        this.font = "";
        this.strokeColor = {r:0,g:0,b:0,a:0};
        this.strokewidth = 0;
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(prototype, "height", {
    get: function () {
        return this.contentSize.height;
    },
    set: function (val) {
        var size = this.contentSize;
        size.height = val;
        this.contentSize = size;
        this.font = "";
        this.strokeColor = {r:0,g:0,b:0,a:0};
        this.strokewidth = 0;
    },
    enumerable: true,
    configurable: true
});

var BOLD_REGEX = /bold/g;
Object.defineProperty(prototype, "font", {
    get: function () {
        return this._font || '';
    },
    set: function (val) {
        this._font = val;
        if (val) {
            var matchRet = val.match(/(\d*(\.\d*)?)px/);
            var size = (matchRet && !isNaN(matchRet[1])) ? parseFloat(matchRet[1]) : 20;
            //console.log("size" + size)
            this.setTextSize(size);
            var isBold = BOLD_REGEX.test(val);
            this.setTextBold(isBold);
        }
    },
    enumerable: true,
    configurable: true
});

var tempColor = { r: 0, g: 0, b: 0, a: 1.0};
function rgbToColor (rgbStr) {
    if (/^\#/.test(rgbStr)) {
        if (rgbStr.length === 4) {
            return {
                r: parseInt(rgbStr[1] + rgbStr[1], 16) / 255,
                g: parseInt(rgbStr[2] + rgbStr[2], 16) / 255,
                b: parseInt(rgbStr[3] + rgbStr[3], 16) / 255,
                a: parseInt(rgbStr[4] + rgbStr[4], 16),
            }
        } else if (rgbStr.length === 7) {
            return {
                r: parseInt(rgbStr.substr(1, 2), 16) / 255,
                g: parseInt(rgbStr.substr(3, 2), 16) / 255,
                b: parseInt(rgbStr.substr(5, 2), 16) / 255,
                a: parseInt(rgbStr.substr(7, 2), 16),
            };
        } else {
            return {r: 0, g: 0, b: 0, a: 1};
        }
    }

    var strArr = rgbStr.match(/(\d|\.)+/g);
    if (!strArr || strArr.length > 4 || strArr.length < 3) {
        return {r: 0, g: 0, b: 0, a: 1};
    }
    tempColor.r = strArr[0] / 255 || 0;
    tempColor.g = strArr[1] / 255 || 0;
    tempColor.b = strArr[2] / 255 || 0;
    tempColor.a = strArr[3] || 1;
    return tempColor;
}

Object.defineProperty(prototype, "fillStyle", {
    get: function () {
        return this._fillStyle || '';
    },
    set: function (val) {
        this._fillStyle = val;
        this.fillColor = rgbToColor(val);
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(prototype, "strokeStyle", {
    get: function () {
        return this._strokeStyle || '';
    },
    set: function (val) {
        this._strokeStyle = val;
        this.strokeColor = rgbToColor(val);
    },
    enumerable: true,
    configurable: true
});

// requestAnimationFrame requestAnimationFrame

var _mainTicker;
var requestAnimationFrame = window.requestAnimationFrame = function (callback) {
    if (!_mainTicker) {
        _mainTicker = new BK.Ticker();
        var frameRate = cc.game.config.frameRate;
        _mainTicker.interval = 60 / frameRate;
        _mainTicker.setTickerCallBack(function (ts, duration) {
            if (!cc.game._paused) {
                BK.inputManager && BK.inputManager.detectGesture();
                callback();
            }
        });
    }
    return 1;
};

var cancelAnimationFrame = window.cancelAnimationFrame = function () {
    if (_mainTicker) {
        _mainTicker.dispose();
        _mainTicker = null;
    }
};

// setTimeout, clearTimeout

var _windowTimeIntervalId = 0;
var _windowTimeFunHash = {};
var WindowTimeFun = function (code) {
    this._intervalId = _windowTimeIntervalId++;
    this._ticker = new BK.Ticker();
    this._ticker.interval = 1;
    this._code = code;
};

WindowTimeFun.prototype.fun = function () {
    if (!this._code) return;
    var code = this._code;

    if (typeof code === 'string') {
        Function(code)();
    }
    else if (typeof code === 'function') {
        code.apply(null, this._args);
    }
};

var setTimeout = window.setTimeout = function (code, delay) {
    var target = new WindowTimeFun(code);
    if (arguments.length > 2)
        target._args = Array.prototype.slice.call(arguments, 2);
    var original = target.fun;
    target.fun = function () {
        clearTimeout(this.target._intervalId);
        original.apply(this.target, arguments);
    };
    if (!delay) {
        delay = 0.001;
    }
    target._ticker.setTimeout(function(){
        try{
            target.fun.apply(this, arguments);
        }catch(e){
            debugger;
            console.error(e);
        }
    }, delay, target);
    _windowTimeFunHash[target._intervalId] = target;
    return target._intervalId;
};

var setInterval = window.setInterval = function(code, delay){
    var target = new WindowTimeFun(code);
    if (arguments.length > 2)
        target._args = Array.prototype.slice.call(arguments, 2);
    var original = target.fun;
    target.fun = function () {
        original.apply(this.target, arguments);
    };
    if (!delay) {
        delay = 0.001;
    }
    target._ticker.setInterval(target.fun, delay, target);
    _windowTimeFunHash[target._intervalId] = target;
    return target._intervalId;
};

var clearTimeout = window.clearTimeout = function (intervalId) {
    var target = _windowTimeFunHash[intervalId];
    if (target) {
        target._ticker.removeTimeout(target);
        target._ticker.dispose();
        delete _windowTimeFunHash[intervalId];
    }
};

var clearInterval = window.clearInterval = function (intervalId) {
    var target = _windowTimeFunHash[intervalId];
    if (target) {
        target._ticker.removeInterval(target);
        target._ticker.dispose();
        delete _windowTimeFunHash[intervalId];
    }
};

// other adapter
var performance = { now: function() { return BK.Time.timestamp * 1000; } };

window.Promise = null;

