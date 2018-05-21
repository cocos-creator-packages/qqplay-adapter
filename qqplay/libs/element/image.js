
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
        var image = BK.Image.loadImage(val);
        this.width = image.width;
        this.height = image.height;
        image.dispose();
        this.emit('load');
    };

    prop._generateBKImage = function (val) {
        this.bkImage = BK.Image.loadImage(val);
        if (this.bkImage) {
            this.width = this.bkImage.width;
            this.height = this.bkImage.height;
            this.emit('load');
        }
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

            var filePath = '', isFileValid = '';
            if (/^http/.test(val)) {
                this._localFileName = qpAdapter.generateTempFileName(val);
                filePath = ImageCachePath + this._localFileName;
                isFileValid = qpAdapter.isFileAvailable(filePath);
                if (!isFileValid) {
                    qpAdapter.downloadFile(val, filePath, function (ret, buffer) {
                        if (ret) {
                            this.emit('error', ret);
                        }
                        else {
                            this._loadedImage(filePath);
                        }
                    }.bind(this));
                }
                else {
                    this._loadedImage(filePath);
                }
            }
            else if (/^data:image/.test(val)) {
                // decodeBase64 arraybuffer -> fs io -> BK.image.load
                this._localFileName = window["sha1"](this._src);
                filePath = ImageCachePath + this._localFileName;
                isFileValid = qpAdapter.isFileAvailable(filePath);
                if (!isFileValid) {
                    var base64str = val.replace(/data:image.+;base64,/, "");
                    var bytes = base64js.toByteArray(base64str);
                    var buffer = new BK.Buffer(bytes.length);
                    for (var i = 0; i < bytes.length; i++) {
                        buffer.writeUint8Buffer(bytes[i]);
                    }
                    qpAdapter.saveFile(filePath, buffer);
                }
                this._loadedImage(filePath);
            }
            else {
                this._loadedImage(val);
            }
        },
    });

})(HTMLImageElement.prototype = new _HTMLBaseElemenet);
