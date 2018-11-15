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

var AudioCachePath = 'GameSandBox://AudioCache7dwe/';

var SN_SEED = 1;
var _audioContextMap = {};

function HTMLAudioElement (url) {
    var self = this;
    _HTMLBaseElemenet.call(self);

    self._$sn = SN_SEED++;

    // api: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/readyState
    self.HAVE_NOTHING = 0;
    self.HAVE_METADATA = 1;
    self.HAVE_CURRENT_DATA = 2;
    self.HAVE_FUTURE_DATA = 3;
    self.HAVE_ENOUGH_DATA = 4;

    var audioContext = BK.createAudioContext();
    _audioContextMap[self._$sn] = audioContext;

    // 用于存储本地音频对路径
    self.localSrc = '';

    if (url) {
        self.src = url;
    }
    else {
        self._src = '';
    }

    self._loop = audioContext.loop;
    self._autoplay = audioContext.autoplay;
    self._volume = audioContext.volume;
    self._muted = audioContext.muted;
    self._currentTime = audioContext.currentTime;
    self._loaded = false;

    self._canplayEvents = [
        'canplay',
        'canplaythrough',
        'loadeddata',
        'loadedmetadata'
    ];

    audioContext.on('loadstart', function () {
        self._loaded = false;
        self.readyState = self.HAVE_NOTHING;
        self.dispatchEvent({type: 'loadstart'});
    });

    audioContext.on('loadedmetadata', function () {
        self._loaded = true;
        self.readyState = self.HAVE_METADATA;
        self.dispatchEvent({type: 'loadedmetadata'});
    });

    audioContext.on('canplay', function () {
        self._loaded = true;
        self.readyState = self.HAVE_ENOUGH_DATA;
        self.dispatchEvent({type: 'canplay'});
    });

    audioContext.on('canplaythrough', function () {
        self._loaded = true;
        self.readyState = self.HAVE_ENOUGH_DATA;
        self.dispatchEvent({type: 'canplaythrough'});
    });

    audioContext.on('loadeddata', function () {
        self._loaded = true;
        self.readyState = self.HAVE_ENOUGH_DATA;
        self.dispatchEvent({type: 'loadeddata'});
    });

    audioContext.on('play', function () {
        self.dispatchEvent({type: 'play'});
    });
    audioContext.on('pause', function () {
        self.dispatchEvent({type: 'pause'});
    });
    audioContext.on('playing', function () {
        self.dispatchEvent({type: 'playing'});
    });
    audioContext.on('ended', function () {
        self.dispatchEvent({type: 'ended'});
    });
    audioContext.on('error', function () {
        self.dispatchEvent({type: 'error'});
    });
    audioContext.on('seeked', function () {
        self.dispatchEvent({type: 'seeked'});
    });
    audioContext.on('seeking', function () {
        self.dispatchEvent({type: 'seeking'});
    });
    audioContext.on('timeupdate', function () {});
    audioContext.on('volumechange', function () {});

    self.onload = null;
    self.onerror = null;
    self.addEventListener('loaded', function () {
        self.onload && self.onload();
        self._loaded = true;
    });
    self.addEventListener('error', function (errMsg) {
        self.onerror && self.onerror(errMsg);
        self._loaded = false;
    });
}

(function (prop) {

    prop.play = function () {
        _audioContextMap[this._$sn].play();
    };

    prop.pause = function () {
        _audioContextMap[this._$sn].pause();
    };

    prop.resume = function () {
        _audioContextMap[this._$sn].resume();
    };

    prop.stop = function () {
        _audioContextMap[this._$sn].stop();
    };

    prop.canPlayType = function (mediaType) {
        // todo 目前只支持 audio/mpeg
        _audioContextMap[this._$sn].canPlayType('audio/mpeg');
    };

    prop.destroy = function () {
        _audioContextMap[this._$sn].destroy();
    };

    prop.appendChild = function (element) {
        _HTMLBaseElemenet.prototype.appendChild.call(this, element);

        var first = this.children[0];
        if (first.src !== this.src) {
            this.src = first.src;
        }
    };

    Object.defineProperty(prop, 'currentTime', {
        get: function () {
            return (_audioContextMap[this._$sn].currentTime / 1000.0);
        },
        set: function (val) {
            // current Time 是以毫秒为单位
            _audioContextMap[this._$sn].currentTime = (val * 1000.0);
        },
    });

    Object.defineProperty(prop, 'autoplay', {
        get: function () {
            return _audioContextMap[this._$sn].autoplay;
        },
        set: function (val) {
            _audioContextMap[this._$sn].autoplay = val;
            this._autoplay = val;
        },
    });

    Object.defineProperty(prop, 'loop', {
        get: function () {
            return this._loop;
        },

        set:function (val) {
            _audioContextMap[this._$sn].loop = val;
            this._loop = val;
        },
    });

    Object.defineProperty(prop, 'volume', {
        get: function () {
            return this._volume;
        },
        set: function (val) {
            _audioContextMap[this._$sn].volume = val;
            this._volume = val;
        },
    });

    Object.defineProperty(prop, 'muted', {
        get: function () {
            return this._muted;
        },
        set: function (val) {
            _audioContextMap[this._$sn].muted = val;
            this._muted = val;
        },
    });

    Object.defineProperty(prop, 'duration', {
        get: function () {
            return (_audioContextMap[this._$sn].duration / 1000.0);
        },
    });

    Object.defineProperty(prop, 'paused', {
        get: function () {
            return _audioContextMap[this._$sn].paused;
        }
    });

    Object.defineProperty(prop, 'src', {
        get: function () {
            return this._src;
        },
        set: function (val) {
            var self = this;
            self._src = val;
            self._load = false;
            self.readyState = this.HAVE_NOTHING;

            var audioContex = _audioContextMap[self._$sn];

            // 如果是远程资源，需要先加载到本地
            if (/^http/.test(val)) {

                self.localSrc = qpAdapter.generateTempFileName(AudioCachePath, val) + '.mp3';

                if (BK.fileSystem.accessSync(self.localSrc)) {
                    audioContex.src = self.localSrc;
                    this.emit('loaded');
                    return;
                }

                qpAdapter.downloadFile(val, self.localSrc, function (err) {
                    if (err) {
                        console.log(err);
                        self.emit('error', err);
                        return;
                    }
                    audioContex.src = self.localSrc;
                    self.emit('loaded');
                })
            }
            else {
                self.localSrc = val;
                audioContex.src = val;
                self.emit('loaded');
            }
        },
    });

})(HTMLAudioElement.prototype = new _HTMLBaseElemenet);
