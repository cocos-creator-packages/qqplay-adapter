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

if (cc.ParticleSystem) {
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
                i += 4;
                j = k;
            }

        } else {
            while (i < length) {
                k = palette ? pixels[i / 4] * 4 : j;
                for (idx = 0; idx < 3; idx++) {
                    bkBuffer.writeUint8Buffer(input[k++]);
                }
                bkBuffer.writeUint8Buffer(alpha ? input[k++] : 255);
                i += 4;
                j = k;
            }
        }
    };
}
