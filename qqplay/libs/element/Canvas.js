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

var gl = window.gl = null;

function HTMLMainCanvasElement () {
    _HTMLBaseElemenet.call(this);
    this.tagName = 'CANVAS';
    if (gl) {
        return;
    }
    gl = bkWebGLGetInstance();
    gl.getExtension = function (name) {
        if (name === "OES_texture_float" ||
            name === "WEBKIT_OES_texture_float" ||
            name === "MOZ_OES_texture_float") {
            return null;
        }
        return {};
    };
    gl.getSupportedExtensions = function () {
        return {};
    };
    gl.getImageData = function () {
        return [];
    };
    var _gl_texImage2D = gl.texImage2D;
    gl.texImage2D = function () {
        // generate and dispose BKImage
        if (6 === arguments.length && arguments[5] instanceof Image) {
            // create temp arguments
            var tempArguments = [];
            for (var i = 0; i < arguments.length; ++i) {
                tempArguments.push(arguments[i]);
            }
            // generate bkimage
            var image = tempArguments[5];
            if (!image.bkImage) {
                image._generateBKImage();
            }
            tempArguments[5] = image.bkImage;
            // apply textImage2D
            _gl_texImage2D.apply(this, tempArguments);
            // dispose bkImage
            image._disposeBKImage();
        }
        else {
            _gl_texImage2D.apply(this, arguments);
        }
    };

    var _gl_texSubImage2D = gl.texSubImage2D;
    gl.texSubImage2D = function () {
        // generate and dispose BKImage
        if (7 === arguments.length && arguments[6] instanceof Image) {
            // create temp arguments
            var tempArguments = [];
            for (var i = 0; i < arguments.length; ++i) {
                tempArguments.push(arguments[i]);
            }
            // generate bkimage
            var image = tempArguments[6];
            if (!image.bkImage) {
                image._generateBKImage();
            }
            tempArguments[6] = image.bkImage;
            // apply textImage2D
            _gl_texSubImage2D.apply(this, tempArguments);
            // dispose bkImage
            image._disposeBKImage();
        }
        else {
            _gl_texSubImage2D.apply(this, arguments);
        }
    };

    var _gl_texParameteri = gl.texParameteri;
    gl.texParameteri = function () {
        if (3 === arguments.length && !arguments[1]) {
            return;
        }
        _gl_texParameteri.apply(this, arguments);
    };

    var isSupportTA = undefined;
    function __bkIsSupportTypedArray() {
        // Just need to judge once
        if (isSupportTA !== undefined) {
            return isSupportTA;
        }

        if (GameStatusInfo.platform === 'android') {
            isSupportTA = true;
        }
        var info = BK.Director.queryDeviceInfo();
        var vers = info.version.split('.');
        if ((info.platform === 'ios' && Number(vers[0]) >= 10) || info.platform === 'android') {
            isSupportTA = true;
        } else {
            BK.Script.log(1, 0, 'Current Device dont supoort TypedArray.[info = ' + JSON.stringify(info) + ']');
            isSupportTA = false;
        }
        return isSupportTA;
    }

    // FIX IOS 10 蓝屏的 bug
    gl.bufferDataOldIOS = function (target, data, dataUI32, usage) {
        if (Object.prototype.hasOwnProperty.call(data, '__rawBKData')) {
            return data.__rawBKData;
        } else if (Object.prototype.hasOwnProperty.call(data, '__nativeObj')) {
            return data.__nativeObj;
        }

        var buf;
        if (!__bkIsSupportTypedArray()) {
            buf = new BK.Buffer(data.byteLength, false);
            for (var i = 0; i < data.length; i += 6) {
                buf.writeFloatBuffer(data[i]);
                buf.writeFloatBuffer(data[i + 1]);
                buf.writeFloatBuffer(data[i + 2]);
                buf.writeUint32Buffer(dataUI32[i + 3]);
                buf.writeFloatBuffer(data[i + 4]);
                buf.writeFloatBuffer(data[i + 5]);
            }
        }
        else {
            buf = data;
        }
        gl.glBufferData(target, buf, usage);
    }
}

(function (prop) {
    prop.constructor = HTMLMainCanvasElement;

    prop.getContext = function () {
        return gl;
    };
})(HTMLMainCanvasElement.prototype = new _HTMLBaseElemenet);
