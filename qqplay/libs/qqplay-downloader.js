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

var REGEX = /^\w+:\/\/.*/;
var non_text_format = [
    'js','png','jpg','bmp','jpeg','gif','ico','tiff','webp','image','mp3',
    'ogg','wav','m4a','font','eot','ttf','woff','svg','ttc', 'bin'
];

var ID = 'QQPlayDownloader';

var QQPlayDownloader = window.QQPlayDownloader = function () {
    this.id = ID;
    this.async = true;
    this.pipeline = null;
    this.GameRes_ROOT = 'GameRes://';
    this.GameSandBox_ROOT = 'GameSandBox://cc_QQPlayDownloader_';// local resources path
    this.REMOTE_SERVER_ROOT = '';
};
QQPlayDownloader.ID = ID;

QQPlayDownloader.prototype.handle = function (item, callback) {

    if (item.type === 'js') {
        callback(null, null);
        return;
    }

    if (item.type === 'uuid') {
        var result = cc.Pipeline.Downloader.PackDownloader.load(item, callback);
        // handled by PackDownloader
        if (result !== undefined) {
            // null result
            if (!!result) {
                return result;
            }
            else {
                return;
            }
        }
    }

    // Download from remote server
    var relatUrl = item.url;

    // filter protocol url (E.g: https:// or http:// or ftp://)
    if (REGEX.test(relatUrl)) {
        callback(null, null);
        return
    }

    var gameResUrl = this.GameRes_ROOT + item.url;
    var gameSandBoxUrl = this.GameSandBox_ROOT + '/' + item.url;
    var needDownload = true;
    if (BK.fileSystem.accessSync(gameResUrl)) {
        item.url = gameResUrl;
        needDownload = false;
    }
    else if (BK.fileSystem.accessSync(gameSandBoxUrl)) {
        item.url = gameSandBoxUrl;
        needDownload = false;
    }

    if (needDownload) {
        if (!qqPlayDownloader.REMOTE_SERVER_ROOT) {
            callback(null, null);
            return;
        }
        downloadRemoteFile(item, callback);
    }
    else {
        if (item.type && non_text_format.indexOf(item.type) !== -1) {
            nextPipe(item, callback);
        }
        else {
            readText(item, callback);
        }
    }
};

function nextPipe (item, callback) {
    var queue = cc.LoadingItems.getQueue(item);
    queue.addListener(item.id, function (item) {
        if (item.error) {
            if (!BK.fileSystem.unlinkSync(item.url)) {
                cc.log('Load failed, removed local file ' + item.url + ' successfully!');
            }
        }
    });
    callback(null, null);
}

function readText (item, callback) {
    var content = BK.fileSystem.readFileSync(item.url, 'utf8');
    if (!content) {
        callback( "Read text file failed: " + item.url, null);
        item.states[cc.loader.downloader.id] = cc.Pipeline.ItemState.ERROR;
    }
    else {
        item.states[cc.loader.downloader.id] = cc.Pipeline.ItemState.COMPLETE;
        callback(null, content);
    }
}

function downloadRemoteFile (item, callback) {
    BK.Http.request({
        url: qqPlayDownloader.REMOTE_SERVER_ROOT + '/' + item.url,

        success: function (tempItem, succObj) {
            tempItem.url = qqPlayDownloader.GameSandBox_ROOT + '/' + tempItem.url;
            BK.fileSystem.writeFileSync(tempItem.url, succObj.arrayBuffer());
            //
            if (tempItem.type && non_text_format.indexOf(tempItem.type) !== -1) {
                nextPipe(tempItem, callback);
            }
            else {
                readText(tempItem, callback);
            }
        }.bind(this, item),

        fail: function (errObj) {
            callback && callback(errObj.msg, null);
        }
    });
}

/**
 * Pre-load remote resources
 * @example
 *
 * qqPlayDownloader.preload('http://www.cocos.com', 'wp-content/themes/cocos/img/download1.png', function (err) {});
 * cc.loader.load('wp-content/themes/cocos/img/download1.png', (err, tex) => {
 *     var spriteFrame = new cc.SpriteFrame(tex);
 *     this.sprite.spriteFrame = spriteFrame;
 * });
 *
 * @method preload
 * @param {String} remoteUrl - remote url
 * @param {String|String[]} resources - Url list in an array
 * @param {Function} [callback] - Whether the callback results are loaded
 */
QQPlayDownloader.prototype.preload = function (remoteUrl, resources, callback) {
    if (!REGEX.test(remoteUrl)) {
        callback && callback(new Error("Failed to QQPlayDownloader preLoad: The remoteUrl is invalid."));
    }
    else {
        var _this = this;
        if (!(resources instanceof Array)) {
            resources = resources ? [resources] : [];
        }

        var onCompleted = (function (err, resUrl, buffer) {
            if (err) {
                errList[resUrl] = err;
                console.error(err);
            }
            else {
                try {
                    BK.fileSystem.writeFileSync(_this.GameSandBox_ROOT + '/' + resUrl, buffer);
                }
                catch (e) {
                    errList[resUrl] = e;
                    console.error(e.message);
                }
            }
            this.completedCount++;
            if (this.completedCount >= this.totalCount) {
                var result = Object.keys(errList).length > 0 ? errList : null;
                callback && callback(result);
            }
        }).bind({
            completedCount: 0,
            totalCount: resources.length
        });

        var resource, errList = {};
        for (var i = 0, len = resources.length; i < len; ++i) {
            resource = resources[i];

            BK.Http.request({
                url: remoteUrl + '/' + resource,

                success: function (url, succObj) {
                    // save pre-load res url
                    if (_this._preloads.indexOf(url) === -1) {
                        _this._preloads.push(url);
                    }
                    onCompleted(null, url, succObj.arrayBuffer());
                }.bind(this, resource),

                fail: function (url, errObj) {
                    onCompleted(errObj.msg, url, null);
                }.bind(this, resource)
            });
        }
    }
};

/**
 * clean All Assets
 * @example
 *
 * qqPlayDownloader.cleanAllAssets();
 *
 * @method cleanAllAssets
 */
QQPlayDownloader.prototype.cleanAllAssets = function () {
    for (var i = 0, len = this._preloads.length; i < len; ++i) {
        var path = this._preloads[i];
        if (!BK.fileSystem.unlinkSync(path)) {
            cc.warn('Failed to remove file(' + path + '): unknown error');
        }
    }
};

var qqPlayDownloader = window.qqPlayDownloader = new QQPlayDownloader();

function downloadText (item, callback) {
    var content = BK.fileSystem.readFileSync(item.url, 'utf8');
    var error = null;
    if (!content) {
        error = 'Load text file failed: The url is ( '+ item.url + ' ).';
    }
    callback(null, content);
}

var FONT_TYPE = {
    '.eot' : 'embedded-opentype',
    '.ttf' : 'truetype',
    '.ttc' : 'truetype',
    '.woff' : 'woff',
    '.svg' : 'svg'
};

function downloadFont (item, callback) {
    // todo font
    callback(null, null);
}

function downloadAudio (item, callback) {
    var dom = document.createElement('audio');
    item.element = dom;
    dom.onload = function () {
        callback(null, dom);
    };
    dom.onerror = function (err) {
        callback(err, null);
    };
    dom.src = item.url;
}

var extMap = {
    // Font
    'font' : downloadFont,
    'eot' : downloadFont,
    'ttf' : downloadFont,
    'woff' : downloadFont,
    'svg' : downloadFont,
    'ttc' : downloadFont,

    // Audio
    'mp3' : downloadAudio,
    'ogg' : downloadAudio,
    'wav' : downloadAudio,
    'm4a' : downloadAudio,
};

cc.loader.downloader.addHandlers(extMap);

