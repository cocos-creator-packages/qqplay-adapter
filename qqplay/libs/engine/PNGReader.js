
cc.ParticleSystem._PNGReader.prototype.copyToImageData = function (bkBuffer, pixels) {
    var alpha, colors, input, i, j, idx, k, length, palette, v, _ref;
    colors = this.colors;
    palette = null;
    alpha = this.hasAlphaChannel;
    if (this.palette.length) {
        palette = (_ref = this._decodedPalette) != null ? _ref : this._decodedPalette = this.decodePalette();
        colors = 4;
        alpha = true;
    }
    length = bkBuffer.capacity;
    input = palette || pixels;
    i = j = idx = 0;
    if (colors === 1) {
        while (i < length) {
            k = palette ? pixels[i / 4] * 4 : j;
            v = input[k++];
            for (idx = 0; idx < 3; idx++) {
                bkBuffer.writeUint8Buffer(v);
            }
            bkBuffer.writeUint8Buffer(alpha ? input[k++] : 255);
            i+=4;
            j = k;
        }

    } else {
        while (i < length) {
            k = palette ? pixels[i / 4] * 4 : j;
            for (idx = 0; idx < 3; idx++) {
                bkBuffer.writeUint8Buffer(input[k++]);
            }
            bkBuffer.writeUint8Buffer(alpha ? input[k++] : 255);
            i+=4;
            j = k;
        }
    }
};