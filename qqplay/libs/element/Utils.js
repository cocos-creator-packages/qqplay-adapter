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

// Tools
BK.Script.loadlib('GameRes://libs/other/sha1.min.js');
BK.Script.loadlib('GameRes://libs/other/base64js.min.js');
BK.Script.loadlib('GameRes://libs/other/text-encoder-lite.min.js');

var qpAdapter = {};

qpAdapter.generateTempFileName = function(root, src) {
    return root + window["sha1"](src);
};

qpAdapter.saveFile = function(saveFile, arraybuffer) {
    var folderPath = saveFile.replace(/[^\/\\]+$/, "");
    if (!BK.fileSystem.accessSync(folderPath)) {
        BK.fileSystem.makeDirSync(folderPath);
    }
    BK.fileSystem.writeFileSync(saveFile, arraybuffer);
};

qpAdapter.downloadFile = function(url, saveFileUrl, callback) {
    BK.Http.request({
        url: url,
        success: function (succObj) {
            var arraybuffer = succObj.arrayBuffer();
            qpAdapter.saveFile(saveFileUrl, arraybuffer);
            callback && callback(null, arraybuffer);
        },
        fail: function (errObj) {
            callback && callback(errObj.msg);
        }
    });
};

qpAdapter.isFileAvailable = function(fileName) {
    var buffer = BK.fileSystem.readFileSync(fileName);
    return buffer && buffer.length > 0;
};

//--------base64 ----------------------------------------------
function Base64Encode(str) {
    var encoding = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'utf-8';
    var bytes = new TextEncoderLite(encoding).encode(str);
    return base64js.fromByteArray(bytes);
}

function Base64Decode(str) {
    var encoding = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'utf-8';
    var bytes = base64js.toByteArray(str);
    return new TextDecoderLite(encoding).decode(bytes);
}
//--------base64 ----------------------------------------------
