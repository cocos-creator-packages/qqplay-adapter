const Audio = cc.Audio;

if (Audio) {
    Object.assign(Audio, {
        _onLoaded: function () {
            let elem = this._src._nativeAsset;
            // Reuse dom audio element
            if (!this._element) {
                this._element = document.createElement('audio');
            }
            this._element.src = elem.src;
    
            this.setVolume(this._volume);
            this.setLoop(this._loop);
            if (this._nextTime !== 0) {
                this.setCurrentTime(this._nextTime);
            }
            if (this._state === Audio.State.PLAYING) {
                this.play();
            }
            else {
                this._state = Audio.State.INITIALZING;
            }
        },

        play: function () {
            // marked as playing so it will playOnLoad
            this._state = Audio.State.PLAYING;
    
            if (!this._element) {
                return;
            }
    
            this._bindEnded();
            this._element.play();
        },

        destroy: function () {
            this._element && this._element.destroy();
            this._element = null;
        },

        setCurrentTime: function (num) {
            if (this._element) {
                this._nextTime = 0;
            }
            else {
                this._nextTime = num;
                return;
            }
    
            try {
                this._element.currentTime = num;
            }
            catch (err) {
                let _element = this._element;
                if (_element.addEventListener) {
                    let func = function () {
                        _element.removeEventListener('loadedmetadata', func);
                        _element.currentTime = num;
                    };
                    _element.addEventListener('loadedmetadata', func);
                }
            }
        },

        getState: function () {
            return this._state;
        },
    });
}