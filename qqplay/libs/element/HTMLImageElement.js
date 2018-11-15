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

var ImageCachePath = 'GameSandBox://ImageCache7dwe/';

function HTMLImageElement () {
    _HTMLBaseElemenet.call(this);

    this._src = '';
    this.width = 0;
    this.height = 0;
    this.onload = null;
    this.onerror = null;

    this.addEventListener('load', function () {
        this.onload && this.onload();
        if(!this.bkImage) {
            return;
        }
        this.width = this.bkImage.width;
        this.height = this.bkImage.height;
    }.bind(this));

    this.addEventListener('error', function () {
        this.onerror && this.onerror();
    }.bind(this));
}

(function (prop) {
    prop.constructor = HTMLImageElement;

    prop._loadedImage = function (val) {
        this._src = val;

        var self = this;
        BK.Image.loadImages({
            'file': [{'path': val}],
            'success': function (retObj) {
                var data = retObj[0];
                if (data && data.errcode === 0) {
                    var bkImage = data.image;
                    if (bkImage) {
                        self.width = bkImage.width;
                        self.height = bkImage.height;
                    }
                    self.bkImage = bkImage;
                    self.emit('load');
                }
                else {
                    self.emit('error', "Loading of images failed:" + data.path + " code:" + data.errcode + " msg:" + data.errmsg);
                }
            },
            'fail': function (obj) {
                self.emit('error', "Loading of images failed:" + data.path + " code:" + data.errcode + " msg:" + data.errmsg);
            }
        });
    };

    prop._generateBKImage = function () {
        if (!this._src) {
            console.warn('The image src value is empty. please check it');
            return;
        }

        if (this.bkImage) {
            return;
        }

        this.bkImage = BK.Image.loadImage(this._src);
        if (this.bkImage) {
            this.width = this.bkImage.width;
            this.height = this.bkImage.height;
        }
    };

    prop._disposeBKImage = function () {
        this.bkImage && this.bkImage.dispose();
        this.bkImage = null;
    };

    Object.defineProperty(prop, 'src', {
        get: function () {
            return this._src;
        },

        set: function (val) {
            if (!val) {
                this._src = val;
                this.width = this.height = 0;
                this.bkImage = null;
                this.emit('load');
                return;
            }

            var filePath = qpAdapter.generateTempFileName(ImageCachePath, val);
            var isFileValid = qpAdapter.isFileAvailable(filePath);
            // local data
            if (isFileValid) {
                this._loadedImage(filePath);
            }
            else {
                // remote data
                if (/^http/.test(val)) {
                    qpAdapter.downloadFile(val, filePath, function (ret, buffer) {
                        if (ret) {
                            this.emit('error', ret);
                        }
                        else {
                            this._loadedImage(filePath);
                        }
                    }.bind(this));
                }
                // decodeBase64 data
                else if (/^data:image/.test(val)) {
                    // decodeBase64 arraybuffer -> fs io -> BK.image.load
                    var base64str = val.replace(/data:image.+;base64,/, "");
                    var bytes = base64js.toByteArray(base64str);
                    var buffer = new BK.Buffer(bytes.length);
                    for (var i = 0; i < bytes.length; i++) {
                        buffer.writeUint8Buffer(bytes[i]);
                    }
                    qpAdapter.saveFile(filePath, buffer);
                    this._loadedImage(filePath);
                }
                else {
                    this._loadedImage(val);
                }
            }
        },
    });

})(HTMLImageElement.prototype = new _HTMLBaseElemenet);
