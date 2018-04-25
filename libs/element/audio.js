
var AudioCachePath = 'GameSandBox://AudioCache7dwe';

function HTMLAudioElement () {
    _HTMLBaseElemenet.call(this);

    this._src = '';
    this.__audioPath = '';
    this._paused = true;
    this._loaded = false;
    this._currentTime = 0;

    this.addEventListener('load', function () {
        this.onLoad && this.onLoad();
        this._loaded = true;
        !this._paused && this.play();
    }.bind(this));
    this.addEventListener('error', function () {
        this.onError && this.onError();
    }.bind(this));
}

(function (prop) {

    prop.play = function () {
        this._paused = false;
        if(!this._loaded){
            return;
        }
        var loop = this._loop ? -1 : 1;
        if(!this._handle){
            this._handle = new BK.Audio(this._loop ? 0 : 1, this.__audioPath, loop);
        }
        this._handle.stopMusic();
        this._handle.startMusic();
    };

    prop.pause = function () {
        this._paused = true;
        if (!this._handle) {
            return;
        }
        this._handle.pauseMusic();
    };

    prop.resume = function () {
        this._paused = false;
        if (!this._handle) {
            this.play();
            return;
        }
        this._handle.resumeMusic();
    };

    prop.stop = function () {
        if (!this._handle) {
            return;
        }
        this._handle.stopMusic();
        this._paused = true;
    };

    prop.canPlayType = function () {
        return true;
    };

    prop.appendChild = function (element) {
        _HTMLBaseElemenet.prototype.appendChild.call(this, element);

        var first = this.children[0];
        if (first.src !== this.src) {
            this.src = first.src;
        }
    };

    Object.defineProperty(prop, 'paused', {
        get: function () {
            return this._paused;
        },
        set: function (val) {},
    });

    Object.defineProperty(prop, 'loop', {
        get: function () {
            // api 限制，无法实现在播音频的循环
            return this._loop;
        },

        set:function (bool) {
            this._loop = bool;
        },
    });

    Object.defineProperty(prop, 'volume', {
        get: function () {
            // api 限制，无法实现音量调节
            return this._volume;
        },
        set: function (num) {
            this._volume = num;
        },
    });

    Object.defineProperty(prop, 'currentTime', {
        get: function () {
            // api 限制，无法实现音量调节
            return this._currentTime;
        },
        set: function (num) {},
    });

    Object.defineProperty(prop, 'duration', {
        get: function () {
            return 0;
        },
    });

    Object.defineProperty(prop, 'src', {
        get: function () {
            return this._src;
        },
        set: function (val) {
            if (val == this._src) {
                return;
            }

            if (this._handle) {
                this._handle.stopMusic();
                this._handle = null;
            }

            this._src = val;
            setTimeout(function () {
                this.emit('canplaythrough');
            }.bind(this), 5);

            // loacl asset
            if (!/^http/.test(val)) {
                this.__audioPath = val;
                setTimeout(function () {
                    this.emit('load');
                }.bind(this), 10);
                return;
            }

            var localFileName = this._src.replace(/\//g, '-_-');
            this.__audioPath = AudioCachePath + localFileName;
            if (BK.FileUtil.isFileExist(this.__audioPath)) {
                setTimeout(function () {
                    this.emit('load');
                }.bind(this), 10);
                return;
            }

            // GameSandBox://
            var httpReq = new BK.HttpUtil(val);
            httpReq.setHttpMethod('get');
            httpReq.requestAsync(function (buffer, status) {
                this.status = status;
                // if (status >= 400 && status <= 417 || status >= 500 && status <= 505) {
                if (status !== 200) {
                    setTimeout(function () {
                        this.emit('error', status);
                    }.bind(this), 10);
                }
                //buffer
                if(BK.FileUtil.isFileExist(AudioCachePath)){
                    BK.FileUtil.makeDir(AudioCachePath);
                }
                var filePath = AudioCachePath + localFileName;
                BK.FileUtil.writeBufferToFile(filePath, buffer);
                setTimeout(function () {
                    this.emit('load');
                }.bind(this), 10);
            }.bind(this));
        },
    });

})(HTMLAudioElement.prototype = new _HTMLBaseElemenet);
