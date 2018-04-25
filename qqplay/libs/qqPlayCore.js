(function () {
    BK.Misc.BKBufferToArrayBuffer = function (buf) {
        buf.rewind();
        var ab = new ArrayBuffer(buf.length);
        var da = new DataView(ab);
        while (!buf.eof) {
            da.setUint8(buf.pointer, buf.readUint8Buffer());
        }
        return ab;
    };
    BK.Misc.arrayBufferToBKBuffer = function (ab) {
        var bf = new BK.Buffer(ab.byteLength);
        var da = new DataView(ab);
        for (var i = 0; i < ab.byteLength; i++) {
            bf.writeUint8Buffer(da.getUint8(i));
        }
        var t2 = BK.Time.clock;
        return bf;
    };
}());
(function (global) {
    function __bkIsSupportTypedArray() {
        if (GameStatusInfo.platform == 'android') {
            return true;
        }
        var info = BK.Director.queryDeviceInfo();
        var vers = info.version.split('.');
        if (info.platform == 'ios' && Number(vers[0]) >= 10) {
            return true;
        }
        BK.Script.log(1, 0, 'Current Device dont supoort TypedArray.[info = ' + JSON.stringify(info) + ']');
        return false;
    }
    if (__bkIsSupportTypedArray())
        return;
    (function (global, factory) {
        if (typeof global === 'object') {
            var _global = factory();
            global.DataView = _global.DataView;
            global.ArrayBuffer = _global.ArrayBuffer;
            global.Int8Array = _global.Int8Array;
            global.Int16Array = _global.Int16Array;
            global.Int32Array = _global.Int32Array;
            global.Uint8Array = _global.Uint8Array;
            global.Uint16Array = _global.Uint16Array;
            global.Uint32Array = _global.Uint32Array;
            global.Float32Array = _global.Float32Array;
        }
    }(global, function () {
        var ArrayBuffer = function () {
            function ArrayBuffer(object) {
                try {
                    var tt = typeof object;
                    if (tt === 'number') {
                        this._buffer = new BK.Buffer(object, false);
                    } else if (tt == 'object') {
                        this._buffer = object;
                    } else {
                        this._buffer = new BK.Buffer(0, false);
                    }
                    this._littleEndian = true;
                    Object.defineProperty(this, 'name', {
                        get: function () {
                            return 'ArrayBuffer';
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(this, '__nativeObj', {
                        get: function () {
                            return this._buffer;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(this, 'byteLength', {
                        get: function () {
                            return this._buffer.capacity;
                        },
                        enumerable: true,
                        configurable: true
                    });
                } catch (e) {
                    throw e;
                }
            }
            ArrayBuffer.prototype.__jump = function (offset) {
                this._buffer.rewind();
                this._buffer.jumpBytes(offset);
            };
            ArrayBuffer.prototype.__check = function (offset, byteLength) {
                if (offset + byteLength > this._buffer.capacity)
                    return false;
                this._buffer.expandToBytes(this._buffer.capacity);
                return true;
            };
            ArrayBuffer.prototype.__updateLittleEndian = function (littleEndian) {
                var _littleEndian = undefined == littleEndian ? false : littleEndian;
                if (this._littleEndian != _littleEndian) {
                    this._littleEndian = _littleEndian;
                    this._buffer.netOrder = !_littleEndian;
                }
            };
            ArrayBuffer.isView = function (arg) {
                return false;
            };
            ArrayBuffer.prototype.slice = function (begin, end) {
                var _end = typeof end === 'number' ? end : this._buffer.capacity - 1;
                var offset = 0;
                var length = 0;
                if (begin >= 0 && _end >= 0) {
                    offset = begin;
                    length = _end - begin;
                } else if (begin < 0 && _end < 0) {
                    offset = -_end;
                    length = begin - _end;
                } else {
                    throw 'ArrayBuffer.slice: Range Error';
                }
                if (length > 0) {
                    this.__jump(offset);
                    this._buffer.expandToBytes(offset + length);
                    var buf = this._buffer.readBuffer(length);
                    return new ArrayBuffer(buf);
                }
                return new ArrayBuffer(0);
            };
            ArrayBuffer.prototype.getFloat32 = function (byteOffset, littleEndian) {
                if (!this.__check(byteOffset, 4))
                    return 0;
                this.__jump(byteOffset);
                this.__updateLittleEndian(littleEndian);
                return this._buffer.readFloatBuffer();
            };
            ArrayBuffer.prototype.getFloat64 = function (byteOffset, littleEndian) {
                if (!this.__check(byteOffset, 8))
                    return 0;
                this.__jump(byteOffset);
                this.__updateLittleEndian(littleEndian);
                return this._buffer.readDoubleBuffer();
            };
            ArrayBuffer.prototype.getInt16 = function (byteOffset, littleEndian) {
                if (!this.__check(byteOffset, 2))
                    return 0;
                this.__jump(byteOffset);
                this.__updateLittleEndian(littleEndian);
                return this._buffer.readInt16Buffer();
            };
            ArrayBuffer.prototype.getInt32 = function (byteOffset, littleEndian) {
                if (!this.__check(byteOffset, 4))
                    return 0;
                this.__jump(byteOffset);
                this.__updateLittleEndian(littleEndian);
                return this._buffer.readInt32Buffer();
            };
            ArrayBuffer.prototype.getInt8 = function (byteOffset, littleEndian) {
                if (!this.__check(byteOffset, 1))
                    return 0;
                this.__jump(byteOffset);
                this.__updateLittleEndian(littleEndian);
                return this._buffer.readInt8Buffer();
            };
            ArrayBuffer.prototype.getUint16 = function (byteOffset, littleEndian) {
                if (!this.__check(byteOffset, 2))
                    return 0;
                this.__jump(byteOffset);
                this.__updateLittleEndian(littleEndian);
                return this._buffer.readUint16Buffer();
            };
            ArrayBuffer.prototype.getUint32 = function (byteOffset, littleEndian) {
                if (!this.__check(byteOffset, 4))
                    return 0;
                this.__jump(byteOffset);
                this.__updateLittleEndian(littleEndian);
                return this._buffer.readUint32Buffer();
            };
            ArrayBuffer.prototype.getUint8 = function (byteOffset, littleEndian) {
                if (!this.__check(byteOffset, 1))
                    return 0;
                this.__jump(byteOffset);
                this.__updateLittleEndian(littleEndian);
                return this._buffer.readUint8Buffer();
            };
            ArrayBuffer.prototype.setFloat32 = function (byteOffset, value, littleEndian) {
                this.__jump(byteOffset);
                this.__updateLittleEndian(littleEndian);
                this._buffer.writeFloatBuffer(value);
            };
            ArrayBuffer.prototype.setFloat64 = function (byteOffset, value, littleEndian) {
                this.__jump(byteOffset);
                this.__updateLittleEndian(littleEndian);
                this._buffer.writeDoubleBuffer(value);
            };
            ArrayBuffer.prototype.setInt16 = function (byteOffset, value, littleEndian) {
                this.__jump(byteOffset);
                this.__updateLittleEndian(littleEndian);
                this._buffer.writeInt16Buffer(value);
            };
            ArrayBuffer.prototype.setInt32 = function (byteOffset, value, littleEndian) {
                this.__jump(byteOffset);
                this.__updateLittleEndian(littleEndian);
                this._buffer.writeInt32Buffer(value);
            };
            ArrayBuffer.prototype.setInt8 = function (byteOffset, value, littleEndian) {
                this.__jump(byteOffset);
                this.__updateLittleEndian(littleEndian);
                this._buffer.writeInt8Buffer(value);
            };
            ArrayBuffer.prototype.setUint16 = function (byteOffset, value, littleEndian) {
                this.__jump(byteOffset);
                this.__updateLittleEndian(littleEndian);
                this._buffer.writeUint16Buffer(value);
            };
            ArrayBuffer.prototype.setUint32 = function (byteOffset, value, littleEndian) {
                this.__jump(byteOffset);
                this.__updateLittleEndian(littleEndian);
                this._buffer.writeUint32Buffer(value);
            };
            ArrayBuffer.prototype.setUint8 = function (byteOffset, value, littleEndian) {
                this.__jump(byteOffset);
                this.__updateLittleEndian(littleEndian);
                this._buffer.writeUint8Buffer(value);
            };
            return ArrayBuffer;
        }();
        var DataView = function () {
            function DataView(buffer, byteOffset, byteLength) {
                try {
                    this._byteOffset = typeof byteOffset === 'number' ? byteOffset : 0;
                    this._byteLength = typeof byteLength === 'number' ? byteLength > buffer.byteLength ? buffer.byteLength : byteLength : buffer.byteLength;
                    if (this._byteOffset < 0 || this._byteOffset + this._byteLength > buffer.byteLength) {
                        throw 'DataView.constructor: range error';
                    }
                    this._buffer = buffer;
                    Object.defineProperty(this, 'buffer', {
                        get: function () {
                            return this._buffer;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(this, 'byteLength', {
                        get: function () {
                            return this._byteLength;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(this, 'byteOffset', {
                        get: function () {
                            return this._byteOffset;
                        },
                        enumerable: true,
                        configurable: true
                    });
                } catch (e) {
                    throw e;
                }
            }
            DataView.prototype.__checkRange = function (byteOffset, byteLength) {
                var left = this._byteOffset;
                var right = this._byteOffset + this._byteLength;
                var _left = this._byteOffset + byteOffset;
                if (_left < left || _left >= right) {
                    throw new TypeError('Offset is outside the bounds of the DataView, _left = ' + _left + ', [' + left + ', ' + right + ']');
                }
                var _right = _left + byteLength;
                if (_right < left + 1 || _right > right) {
                    throw new TypeError('Offset is outside the bounds of the DataView, _right = ' + _right + ', [' + left + ', ' + right + ']');
                }
            };
            DataView.prototype.getFloat32 = function (byteOffset, littleEndian) {
                this.__checkRange(byteOffset, 4);
                return this._buffer.getFloat32(this._byteOffset + byteOffset, littleEndian);
            };
            DataView.prototype.getFloat64 = function (byteOffset, littleEndian) {
                this.__checkRange(byteOffset, 8);
                return this._buffer.getFloat64(this._byteOffset + byteOffset, littleEndian);
            };
            DataView.prototype.getInt16 = function (byteOffset, littleEndian) {
                this.__checkRange(byteOffset, 2);
                return this._buffer.getInt16(this._byteOffset + byteOffset, littleEndian);
            };
            DataView.prototype.getInt32 = function (byteOffset, littleEndian) {
                this.__checkRange(byteOffset, 4);
                return this._buffer.getInt32(this._byteOffset + byteOffset, littleEndian);
            };
            DataView.prototype.getInt8 = function (byteOffset, littleEndian) {
                this.__checkRange(byteOffset, 1);
                return this._buffer.getInt8(this._byteOffset + byteOffset, littleEndian);
            };
            DataView.prototype.getUint16 = function (byteOffset, littleEndian) {
                this.__checkRange(byteOffset, 2);
                return this._buffer.getUint16(this._byteOffset + byteOffset, littleEndian);
            };
            DataView.prototype.getUint32 = function (byteOffset, littleEndian) {
                this.__checkRange(byteOffset, 4);
                return this._buffer.getUint32(this._byteOffset + byteOffset, littleEndian);
            };
            DataView.prototype.getUint8 = function (byteOffset, littleEndian) {
                this.__checkRange(byteOffset, 1);
                return this._buffer.getUint8(this._byteOffset + byteOffset, littleEndian);
            };
            DataView.prototype.setFloat32 = function (byteOffset, value, littleEndian) {
                this.__checkRange(byteOffset, 4);
                this._buffer.setFloat32(this._byteOffset + byteOffset, value, littleEndian);
            };
            DataView.prototype.setFloat64 = function (byteOffset, value, littleEndian) {
                this.__checkRange(byteOffset, 8);
                this._buffer.setFloat64(this._byteOffset + byteOffset, value, littleEndian);
            };
            DataView.prototype.setInt16 = function (byteOffset, value, littleEndian) {
                this.__checkRange(byteOffset, 2);
                this._buffer.setInt16(this._byteOffset + byteOffset, value, littleEndian);
            };
            DataView.prototype.setInt32 = function (byteOffset, value, littleEndian) {
                this.__checkRange(byteOffset, 4);
                this._buffer.setInt32(this._byteOffset + byteOffset, value, littleEndian);
            };
            DataView.prototype.setInt8 = function (byteOffset, value, littleEndian) {
                this.__checkRange(byteOffset, 1);
                this._buffer.setInt8(this._byteOffset + byteOffset, value, littleEndian);
            };
            DataView.prototype.setUint16 = function (byteOffset, value, littleEndian) {
                this.__checkRange(byteOffset, 2);
                this._buffer.setUint16(this._byteOffset + byteOffset, value, littleEndian);
            };
            DataView.prototype.setUint32 = function (byteOffset, value, littleEndian) {
                this.__checkRange(byteOffset, 4);
                this._buffer.setUint32(this._byteOffset + byteOffset, value, littleEndian);
            };
            DataView.prototype.setUint8 = function (byteOffset, value, littleEndian) {
                this.__checkRange(byteOffset, 1);
                this._buffer.setUint8(this._byteOffset + byteOffset, value, littleEndian);
            };
            return DataView;
        }();
        var Int8Array = function () {
            function Int8Array(object, byteOffset, length) {
                var typeofobj = typeof object;
                if (typeofobj == 'number' || typeofobj == 'undefined') {
                    this._length = object == undefined ? 256 : object;
                    var arrayBuffer = new ArrayBuffer(this._length * Int8Array.BYTES_PER_ELEMENT);
                    this._dataView = new DataView(arrayBuffer);
                } else if (object instanceof Array == true || object instanceof Int8Array == true || object instanceof Uint8Array == true || object instanceof Int16Array == true || object instanceof Uint16Array == true || object instanceof Int32Array == true || object instanceof Uint32Array == true || object instanceof Float32Array == true) {
                    this._length = object.length;
                    var arrayBuffer = new ArrayBuffer(this._length * Int8Array.BYTES_PER_ELEMENT);
                    this._dataView = new DataView(arrayBuffer);
                    for (var i_1 = 0; i_1 < object.length; i_1++) {
                        this._dataView.setInt8(i_1 * Int8Array.BYTES_PER_ELEMENT, object[i_1]);
                    }
                } else if (object instanceof ArrayBuffer == true) {
                    var arrayBuffer = object;
                    var _byteOffset = byteOffset ? byteOffset : 0;
                    this._length = length ? length : (object.byteLength - _byteOffset) / Int8Array.BYTES_PER_ELEMENT;
                    this._dataView = new DataView(arrayBuffer, _byteOffset, this._length * Int8Array.BYTES_PER_ELEMENT);
                } else {
                    throw 'Int8Array.constructor: Error Type';
                }
                Object.defineProperty(this, '__rawBKData', {
                    get: function () {
                        var begin = this._dataView.byteOffset;
                        var end = this._dataView.byteOffset + this._dataView.byteLength;
                        this.__rawData = this._dataView.buffer.slice(begin, end);
                        return this.__rawData.__nativeObj;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, 'BYTES_PER_ELEMENT', {
                    get: function () {
                        return 1;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, 'buffer', {
                    get: function () {
                        return this._dataView.buffer;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, 'byteLength', {
                    get: function () {
                        return this._dataView.byteLength;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, 'byteOffset', {
                    get: function () {
                        return this._dataView.byteOffset;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, 'length', {
                    get: function () {
                        return this._length;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, 'name', {
                    get: function () {
                        return 'Int8Array';
                    },
                    enumerable: true,
                    configurable: true
                });
                var _loop_1 = function (i_2) {
                    Object.defineProperty(this_1, String(i_2), {
                        get: function () {
                            var elem = this._dataView.getInt8(i_2 * Int8Array.BYTES_PER_ELEMENT);
                            return elem;
                        },
                        set: function (value) {
                            this._dataView.setInt8(i_2 * Int8Array.BYTES_PER_ELEMENT, value);
                        },
                        enumerable: true,
                        configurable: true
                    });
                };
                var this_1 = this;
                for (var i_2 = 0; i_2 < this._length; i_2++) {
                    _loop_1(i_2);
                }
            }
            Int8Array.prototype.forEach = function (callback, thisArg) {
                if (callback) {
                    for (var i_3 = 0; i_3 < this._length; i_3++) {
                        var elem = this._dataView.getInt8(i_3 * Int8Array.BYTES_PER_ELEMENT);
                        callback.call(thisArg, elem, i_3, this);
                    }
                }
            };
            Int8Array.prototype.includes = function (searchElement, fromIndex) {
                for (var i_4 = fromIndex; i_4 < this._length; i_4++) {
                    var elem = this._dataView.getInt8(i_4 * Int8Array.BYTES_PER_ELEMENT);
                    if (searchElement == elem) {
                        return true;
                    }
                }
                return false;
            };
            Int8Array.prototype.lastIndexOf = function (searchElement, fromIndex) {
                if (fromIndex >= 0) {
                    var startIndex = 0;
                    if (fromIndex >= this._length) {
                        startIndex = 0;
                    } else {
                        startIndex = fromIndex;
                    }
                    var index = -1;
                    for (var i_5 = startIndex; i_5 < this._length; i_5++) {
                        var elem = this._dataView.getInt8(i_5 * Int8Array.BYTES_PER_ELEMENT);
                        if (searchElement === elem) {
                            index = i_5;
                        }
                    }
                    return index;
                } else {
                    var startIndex = fromIndex + this._length;
                    if (startIndex >= 0) {
                        var index = -1;
                        for (var i_6 = startIndex; i_6 >= 0; i_6--) {
                            var elem = this._dataView.getInt8(i_6 * Int8Array.BYTES_PER_ELEMENT);
                            if (searchElement === elem) {
                                index = i_6;
                            }
                        }
                        return index;
                    }
                }
                return -1;
            };
            Int8Array.prototype.reduce = function (callback, initialValue) {
                if (0 == this._length && undefined == initialValue) {
                    throw new TypeError('reduce: empty array & no initialValue');
                }
                if (0 == this._length && undefined != initialValue) {
                    return initialValue;
                }
                if (1 == this._length && undefined == initialValue) {
                    return this._dataView.getInt8(0);
                }
                var startIndex;
                var previousValue;
                if (undefined != initialValue) {
                    startIndex = 0;
                    previousValue = initialValue;
                } else {
                    startIndex = 1;
                    previousValue = this._dataView.getInt8(0);
                }
                var result = 0;
                for (var i_7 = startIndex; i_7 < this._length; i_7++) {
                    var elem = this._dataView.getInt8(i_7 * Int8Array.BYTES_PER_ELEMENT);
                    result += callback(previousValue, elem, i_7, this);
                    previousValue = result;
                }
                return result;
            };
            Int8Array.prototype.reduceRight = function (callback, initialValue) {
                if (0 == this._length && undefined == initialValue) {
                    throw new TypeError('reduceRight: empty array & no initialValue');
                }
                if (0 == this._length && undefined != initialValue) {
                    return initialValue;
                }
                if (1 == this._length && undefined == initialValue) {
                    return this._dataView.getInt8(0);
                }
                var startIndex;
                var previousValue;
                if (undefined != initialValue) {
                    startIndex = this._length - 1;
                    previousValue = initialValue;
                } else {
                    startIndex = this._length - 2;
                    previousValue = this._dataView.getInt8((this._length - 1) * Int8Array.BYTES_PER_ELEMENT);
                }
                var result = 0;
                for (var i_8 = startIndex; i_8 >= 0; i_8--) {
                    var elem = this._dataView.getInt8(i_8 * Int8Array.BYTES_PER_ELEMENT);
                    result += callback(previousValue, elem, i_8, this);
                    previousValue = result;
                }
                return result;
            };
            Int8Array.prototype.set = function (array, offset) {
                if (array instanceof Array == true || array instanceof Int8Array == true || array instanceof Uint8Array == true || array instanceof Int16Array == true || array instanceof Uint16Array == true || array instanceof Int32Array == true || array instanceof Uint32Array == true || array instanceof Float32Array == true) {
                    var _offset = offset == undefined ? 0 : offset;
                    if ((array.length - _offset) * Int8Array.BYTES_PER_ELEMENT > this._dataView.byteLength) {
                        throw new TypeError('Int8Array.set: Out of range');
                    }
                    for (var i_9 = _offset, j_1 = 0; j_1 < array.length; i_9++, j_1++) {
                        this._dataView.setInt8(i_9 * Int8Array.BYTES_PER_ELEMENT, array[j_1]);
                    }
                } else {
                    throw new TypeError('Int8Array.set: Error Type');
                }
            };
            Int8Array.prototype.toString = function () {
                var str = '[';
                for (var i_10 = 0; i_10 < this._length; i_10++) {
                    var elem = this._dataView.getInt8(i_10 * Int8Array.BYTES_PER_ELEMENT);
                    str += elem;
                    if (i_10 < this._length - 1)
                        str += ',';
                }
                str += ']';
                return str;
            };
            return Int8Array;
        }();
        Int8Array.BYTES_PER_ELEMENT = 1;
        var Uint8Array = function () {
            function Uint8Array(object, byteOffset, length) {
                var typeofobj = typeof object;
                if (typeofobj == 'number' || typeofobj == 'undefined') {
                    this._length = object == undefined ? 256 : object;
                    var arrayBuffer = new ArrayBuffer(this._length * Uint8Array.BYTES_PER_ELEMENT);
                    this._dataView = new DataView(arrayBuffer);
                } else if (object instanceof Array == true || object instanceof Int8Array == true || object instanceof Uint8Array == true || object instanceof Int16Array == true || object instanceof Uint16Array == true || object instanceof Int32Array == true || object instanceof Uint32Array == true || object instanceof Float32Array == true) {
                    this._length = object.length;
                    var arrayBuffer = new ArrayBuffer(this._length * Uint8Array.BYTES_PER_ELEMENT);
                    this._dataView = new DataView(arrayBuffer);
                    for (var i_11 = 0; i_11 < object.length; i_11++) {
                        this._dataView.setUint8(i_11 * Uint8Array.BYTES_PER_ELEMENT, object[i_11]);
                    }
                } else if (object instanceof ArrayBuffer == true) {
                    var arrayBuffer = object;
                    var _byteOffset = byteOffset ? byteOffset : 0;
                    this._length = length ? length : (object.byteLength - _byteOffset) / Uint8Array.BYTES_PER_ELEMENT;
                    this._dataView = new DataView(arrayBuffer, _byteOffset, this._length * Uint8Array.BYTES_PER_ELEMENT);
                } else {
                    throw 'Uint8Array.constructor: Error Type';
                }
                Object.defineProperty(this, '__rawBKData', {
                    get: function () {
                        var begin = this._dataView.byteOffset;
                        var end = this._dataView.byteOffset + this._dataView.byteLength;
                        this.__rawData = this._dataView.buffer.slice(begin, end);
                        return this.__rawData.__nativeObj;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, 'buffer', {
                    get: function () {
                        return this._dataView.buffer;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, 'BYTES_PER_ELEMENT', {
                    get: function () {
                        return 1;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, 'byteLength', {
                    get: function () {
                        return this._dataView.byteLength;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, 'byteOffset', {
                    get: function () {
                        return this._dataView.byteOffset;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, 'length', {
                    get: function () {
                        return this._length;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, 'name', {
                    get: function () {
                        return 'Uint8Array';
                    },
                    enumerable: true,
                    configurable: true
                });
                var _loop_2 = function (i_12) {
                    Object.defineProperty(this_2, String(i_12), {
                        get: function () {
                            var elem = this._dataView.getUint8(i_12 * Uint8Array.BYTES_PER_ELEMENT);
                            return elem;
                        },
                        set: function (value) {
                            this._dataView.setUint8(i_12 * Uint8Array.BYTES_PER_ELEMENT, value);
                        },
                        enumerable: true,
                        configurable: true
                    });
                };
                var this_2 = this;
                for (var i_12 = 0; i_12 < this._length; i_12++) {
                    _loop_2(i_12);
                }
            }
            Uint8Array.prototype.forEach = function (callback, thisArg) {
                if (callback) {
                    for (var i_13 = 0; i_13 < this._length; i_13++) {
                        var elem = this._dataView.getUint8(i_13 * Uint8Array.BYTES_PER_ELEMENT);
                        callback.call(thisArg, elem, i_13, this);
                    }
                }
            };
            Uint8Array.prototype.includes = function (searchElement, fromIndex) {
                for (var i_14 = fromIndex; i_14 < this._length; i_14++) {
                    var elem = this._dataView.getUint8(i_14 * Uint8Array.BYTES_PER_ELEMENT);
                    if (searchElement == elem) {
                        return true;
                    }
                }
                return false;
            };
            Uint8Array.prototype.lastIndexOf = function (searchElement, fromIndex) {
                if (fromIndex >= 0) {
                    var startIndex = 0;
                    if (fromIndex >= this._length) {
                        startIndex = 0;
                    } else {
                        startIndex = fromIndex;
                    }
                    var index = -1;
                    for (var i_15 = startIndex; i_15 < this._length; i_15++) {
                        var elem = this._dataView.getUint8(i_15 * Uint8Array.BYTES_PER_ELEMENT);
                        if (searchElement === elem) {
                            index = i_15;
                        }
                    }
                    return index;
                } else {
                    var startIndex = fromIndex + this._length;
                    if (startIndex >= 0) {
                        var index = -1;
                        for (var i_16 = startIndex; i_16 >= 0; i_16--) {
                            var elem = this._dataView.getUint8(i_16 * Uint8Array.BYTES_PER_ELEMENT);
                            if (searchElement === elem) {
                                index = i_16;
                            }
                        }
                        return index;
                    }
                }
                return -1;
            };
            Uint8Array.prototype.reduce = function (callback, initialValue) {
                if (0 == this._length && undefined == initialValue) {
                    throw new TypeError('reduce: empty array & no initialValue');
                }
                if (0 == this._length && undefined != initialValue) {
                    return initialValue;
                }
                if (1 == this._length && undefined == initialValue) {
                    return this._dataView.getUint8(0);
                }
                var startIndex;
                var previousValue;
                if (undefined != initialValue) {
                    startIndex = 0;
                    previousValue = initialValue;
                } else {
                    startIndex = 1;
                    previousValue = this._dataView.getUint8(0);
                }
                var result = 0;
                for (var i_17 = startIndex; i_17 < this._length; i_17++) {
                    var elem = this._dataView.getUint8(i_17 * Uint8Array.BYTES_PER_ELEMENT);
                    result += callback(previousValue, elem, i_17, this);
                    previousValue = result;
                }
                return result;
            };
            Uint8Array.prototype.reduceRight = function (callback, initialValue) {
                if (0 == this._length && undefined == initialValue) {
                    throw new TypeError('reduceRight: empty array & no initialValue');
                }
                if (0 == this._length && undefined != initialValue) {
                    return initialValue;
                }
                if (1 == this._length && undefined == initialValue) {
                    return this._dataView.getUint8(0);
                }
                var startIndex;
                var previousValue;
                if (undefined != initialValue) {
                    startIndex = this._length - 1;
                    previousValue = initialValue;
                } else {
                    startIndex = this._length - 2;
                    previousValue = this._dataView.getUint8((this._length - 1) * Uint8Array.BYTES_PER_ELEMENT);
                }
                var result = 0;
                for (var i_18 = startIndex; i_18 >= 0; i_18--) {
                    var elem = this._dataView.getUint8(i_18 * Uint8Array.BYTES_PER_ELEMENT);
                    result += callback(previousValue, elem, i_18, this);
                    previousValue = result;
                }
                return result;
            };
            Uint8Array.prototype.set = function (array, offset) {
                if (array instanceof Array == true || array instanceof Int8Array == true || array instanceof Uint8Array == true || array instanceof Int16Array == true || array instanceof Uint16Array == true || array instanceof Int32Array == true || array instanceof Uint32Array == true || array instanceof Float32Array == true) {
                    var _offset = offset == undefined ? 0 : offset;
                    if ((array.length - _offset) * Uint8Array.BYTES_PER_ELEMENT > this._dataView.byteLength) {
                        throw new TypeError('Uint8Array.set: Out of range');
                    }
                    for (var i_19 = _offset, j_2 = 0; j_2 < array.length; i_19++, j_2++) {
                        this._dataView.setUint8(i_19 * Uint8Array.BYTES_PER_ELEMENT, array[j_2]);
                    }
                } else {
                    throw new TypeError('Uint8Array.set: Error Type');
                }
            };
            Uint8Array.prototype.toString = function () {
                var str = '[';
                for (var i_20 = 0; i_20 < this._length; i_20++) {
                    var elem = this._dataView.getUint8(i_20 * Uint8Array.BYTES_PER_ELEMENT);
                    str += elem;
                    if (i_20 < this._length - 1)
                        str += ',';
                }
                str += ']';
                return str;
            };
            return Uint8Array;
        }();
        Uint8Array.BYTES_PER_ELEMENT = 1;
        var Int16Array = function () {
            function Int16Array(object, byteOffset, length) {
                var typeofobj = typeof object;
                if (typeofobj == 'number' || typeofobj == 'undefined') {
                    this._length = object == undefined ? 256 : object;
                    var arrayBuffer = new ArrayBuffer(this._length * Int16Array.BYTES_PER_ELEMENT);
                    this._dataView = new DataView(arrayBuffer);
                } else if (object instanceof Array == true || object instanceof Int8Array == true || object instanceof Uint8Array == true || object instanceof Int16Array == true || object instanceof Uint16Array == true || object instanceof Int32Array == true || object instanceof Uint32Array == true || object instanceof Float32Array == true) {
                    this._length = object.length;
                    var arrayBuffer = new ArrayBuffer(this._length * Int16Array.BYTES_PER_ELEMENT);
                    this._dataView = new DataView(arrayBuffer);
                    for (var i_21 = 0; i_21 < object.length; i_21++) {
                        this._dataView.setInt16(i_21 * Int16Array.BYTES_PER_ELEMENT, object[i_21], true);
                    }
                } else if (object instanceof ArrayBuffer == true) {
                    var arrayBuffer = object;
                    var _byteOffset = byteOffset ? byteOffset : 0;
                    this._length = length ? length : (object.byteLength - _byteOffset) / Int16Array.BYTES_PER_ELEMENT;
                    this._dataView = new DataView(arrayBuffer, _byteOffset, this._length * Int16Array.BYTES_PER_ELEMENT);
                } else {
                    throw 'Int16Array.constructor: Error Type';
                }
                Object.defineProperty(this, '__rawBKData', {
                    get: function () {
                        var begin = this._dataView.byteOffset;
                        var end = this._dataView.byteOffset + this._dataView.byteLength;
                        this.__rawData = this._dataView.buffer.slice(begin, end);
                        return this.__rawData.__nativeObj;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, 'BYTES_PER_ELEMENT', {
                    get: function () {
                        return 2;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, 'buffer', {
                    get: function () {
                        return this._dataView.buffer;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, 'byteLength', {
                    get: function () {
                        return this._dataView.byteLength;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, 'byteOffset', {
                    get: function () {
                        return this._dataView.byteOffset;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, 'length', {
                    get: function () {
                        return this._length;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, 'name', {
                    get: function () {
                        return 'Int16Array';
                    },
                    enumerable: true,
                    configurable: true
                });
                var _loop_3 = function (i_22) {
                    Object.defineProperty(this_3, String(i_22), {
                        get: function () {
                            var elem = this._dataView.getInt16(i_22 * Int16Array.BYTES_PER_ELEMENT, true);
                            return elem;
                        },
                        set: function (value) {
                            this._dataView.setInt16(i_22 * Int16Array.BYTES_PER_ELEMENT, value, true);
                        },
                        enumerable: true,
                        configurable: true
                    });
                };
                var this_3 = this;
                for (var i_22 = 0; i_22 < this._length; i_22++) {
                    _loop_3(i_22);
                }
            }
            Int16Array.prototype.forEach = function (callback, thisArg) {
                if (callback) {
                    for (var i_23 = 0; i_23 < this._length; i_23++) {
                        var elem = this._dataView.getInt16(i_23 * Int16Array.BYTES_PER_ELEMENT, true);
                        callback.call(thisArg, elem, i_23, this);
                    }
                }
            };
            Int16Array.prototype.includes = function (searchElement, fromIndex) {
                for (var i_24 = fromIndex; i_24 < this._length; i_24++) {
                    var elem = this._dataView.getInt16(i_24 * Int16Array.BYTES_PER_ELEMENT, true);
                    if (searchElement == elem) {
                        return true;
                    }
                }
                return false;
            };
            Int16Array.prototype.lastIndexOf = function (searchElement, fromIndex) {
                if (fromIndex >= 0) {
                    var startIndex = 0;
                    if (fromIndex >= this._length) {
                        startIndex = 0;
                    } else {
                        startIndex = fromIndex;
                    }
                    var index = -1;
                    for (var i_25 = startIndex; i_25 < this._length; i_25++) {
                        var elem = this._dataView.getInt16(i_25 * Int16Array.BYTES_PER_ELEMENT, true);
                        if (searchElement === elem) {
                            index = i_25;
                        }
                    }
                    return index;
                } else {
                    var startIndex = fromIndex + this._length;
                    if (startIndex >= 0) {
                        var index = -1;
                        for (var i_26 = startIndex; i_26 >= 0; i_26--) {
                            var elem = this._dataView.getInt16(i_26 * Int16Array.BYTES_PER_ELEMENT, true);
                            if (searchElement === elem) {
                                index = i_26;
                            }
                        }
                        return index;
                    }
                }
                return -1;
            };
            Int16Array.prototype.reduce = function (callback, initialValue) {
                if (0 == this._length && undefined == initialValue) {
                    throw new TypeError('reduce: empty array & no initialValue');
                }
                if (0 == this._length && undefined != initialValue) {
                    return initialValue;
                }
                if (1 == this._length && undefined == initialValue) {
                    return this._dataView.getInt16(0, true);
                }
                var startIndex;
                var previousValue;
                if (undefined != initialValue) {
                    startIndex = 0;
                    previousValue = initialValue;
                } else {
                    startIndex = 1;
                    previousValue = this._dataView.getInt16(0, true);
                }
                var result = 0;
                for (var i_27 = startIndex; i_27 < this._length; i_27++) {
                    var elem = this._dataView.getInt16(i_27 * Int16Array.BYTES_PER_ELEMENT, true);
                    result += callback(previousValue, elem, i_27, this);
                    previousValue = result;
                }
                return result;
            };
            Int16Array.prototype.reduceRight = function (callback, initialValue) {
                if (0 == this._length && undefined == initialValue) {
                    throw new TypeError('reduceRight: empty array & no initialValue');
                }
                if (0 == this._length && undefined != initialValue) {
                    return initialValue;
                }
                if (1 == this._length && undefined == initialValue) {
                    return this._dataView.getInt16(0, true);
                }
                var startIndex;
                var previousValue;
                if (undefined != initialValue) {
                    startIndex = this._length - 1;
                    previousValue = initialValue;
                } else {
                    startIndex = this._length - 2;
                    previousValue = this._dataView.getInt16((this._length - 1) * Int16Array.BYTES_PER_ELEMENT, true);
                }
                var result = 0;
                for (var i_28 = startIndex; i_28 >= 0; i_28--) {
                    var elem = this._dataView.getInt16(i_28 * Int16Array.BYTES_PER_ELEMENT, true);
                    result += callback(previousValue, elem, i_28, this);
                    previousValue = result;
                }
                return result;
            };
            Int16Array.prototype.set = function (array, offset) {
                if (array instanceof Array == true || array instanceof Int8Array == true || array instanceof Uint8Array == true || array instanceof Int16Array == true || array instanceof Uint16Array == true || array instanceof Int32Array == true || array instanceof Uint32Array == true || array instanceof Float32Array == true) {
                    var _offset = offset == undefined ? 0 : offset;
                    if ((array.length - _offset) * Int16Array.BYTES_PER_ELEMENT > this._dataView.byteLength) {
                        throw new TypeError('Int16Array.set: Out of range');
                    }
                    for (var i_29 = _offset, j_3 = 0; j_3 < array.length; i_29++, j_3++) {
                        this._dataView.setInt16(i_29 * Int16Array.BYTES_PER_ELEMENT, array[j_3], true);
                    }
                } else {
                    throw new TypeError('Int16Array.set: Error Type');
                }
            };
            Int16Array.prototype.toString = function () {
                var str = '[';
                for (var i_30 = 0; i_30 < this._length; i_30++) {
                    var elem = this._dataView.getInt16(i_30 * Int16Array.BYTES_PER_ELEMENT, true);
                    str += elem;
                    if (i_30 < this._length - 1)
                        str += ',';
                }
                str += ']';
                return str;
            };
            return Int16Array;
        }();
        Int16Array.BYTES_PER_ELEMENT = 2;
        var Uint16Array = function () {
            function Uint16Array(object, byteOffset, length) {
                var typeofobj = typeof object;
                if (typeofobj == 'number' || typeofobj == 'undefined') {
                    this._length = object == undefined ? 256 : object;
                    var arrayBuffer = new ArrayBuffer(this._length * Uint16Array.BYTES_PER_ELEMENT);
                    this._dataView = new DataView(arrayBuffer);
                } else if (object instanceof Array == true || object instanceof Int8Array == true || object instanceof Uint8Array == true || object instanceof Int16Array == true || object instanceof Uint16Array == true || object instanceof Int32Array == true || object instanceof Uint32Array == true || object instanceof Float32Array == true) {
                    this._length = object.length;
                    var arrayBuffer = new ArrayBuffer(this._length * Uint16Array.BYTES_PER_ELEMENT);
                    this._dataView = new DataView(arrayBuffer);
                    for (var i_31 = 0; i_31 < object.length; i_31++) {
                        this._dataView.setUint16(i_31 * Uint16Array.BYTES_PER_ELEMENT, object[i_31], true);
                    }
                } else if (object instanceof ArrayBuffer == true) {
                    var arrayBuffer = object;
                    var _byteOffset = byteOffset ? byteOffset : 0;
                    this._length = length ? length : (object.byteLength - _byteOffset) / Uint16Array.BYTES_PER_ELEMENT;
                    this._dataView = new DataView(arrayBuffer, _byteOffset, this._length * Uint16Array.BYTES_PER_ELEMENT);
                } else {
                    throw 'Uint16Array.constructor: Error Type';
                }
                Object.defineProperty(this, '__rawBKData', {
                    get: function () {
                        var begin = this._dataView.byteOffset;
                        var end = this._dataView.byteOffset + this._dataView.byteLength;
                        this.__rawData = this._dataView.buffer.slice(begin, end);
                        return this.__rawData.__nativeObj;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, 'BYTES_PER_ELEMENT', {
                    get: function () {
                        return 2;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, 'buffer', {
                    get: function () {
                        return this._dataView.buffer;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, 'byteLength', {
                    get: function () {
                        return this._dataView.byteLength;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, 'byteOffset', {
                    get: function () {
                        return this._dataView.byteOffset;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, 'length', {
                    get: function () {
                        return this._length;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, 'name', {
                    get: function () {
                        return 'Uint16Array';
                    },
                    enumerable: true,
                    configurable: true
                });
                var _loop_4 = function (i_32) {
                    Object.defineProperty(this_4, String(i_32), {
                        get: function () {
                            var elem = this._dataView.getUint16(i_32 * Uint16Array.BYTES_PER_ELEMENT, true);
                            return elem;
                        },
                        set: function (value) {
                            this._dataView.setUint16(i_32 * Uint16Array.BYTES_PER_ELEMENT, value, true);
                        },
                        enumerable: true,
                        configurable: true
                    });
                };
                var this_4 = this;
                for (var i_32 = 0; i_32 < this._length; i_32++) {
                    _loop_4(i_32);
                }
            }
            Uint16Array.prototype.forEach = function (callback, thisArg) {
                if (callback) {
                    for (var i_33 = 0; i_33 < this._length; i_33++) {
                        var elem = this._dataView.getUint16(i_33 * Uint16Array.BYTES_PER_ELEMENT, true);
                        callback.call(thisArg, elem, i_33, this);
                    }
                }
            };
            Uint16Array.prototype.includes = function (searchElement, fromIndex) {
                for (var i_34 = fromIndex; i_34 < this._length; i_34++) {
                    var elem = this._dataView.getUint16(i_34 * Uint16Array.BYTES_PER_ELEMENT, true);
                    if (searchElement == elem) {
                        return true;
                    }
                }
                return false;
            };
            Uint16Array.prototype.lastIndexOf = function (searchElement, fromIndex) {
                if (fromIndex >= 0) {
                    var startIndex = 0;
                    if (fromIndex >= this._length) {
                        startIndex = 0;
                    } else {
                        startIndex = fromIndex;
                    }
                    var index = -1;
                    for (var i_35 = startIndex; i_35 < this._length; i_35++) {
                        var elem = this._dataView.getUint16(i_35 * Uint16Array.BYTES_PER_ELEMENT, true);
                        if (searchElement === elem) {
                            index = i_35;
                        }
                    }
                    return index;
                } else {
                    var startIndex = fromIndex + this._length;
                    if (startIndex >= 0) {
                        var index = -1;
                        for (var i_36 = startIndex; i_36 >= 0; i_36--) {
                            var elem = this._dataView.getUint16(i_36 * Uint16Array.BYTES_PER_ELEMENT, true);
                            if (searchElement === elem) {
                                index = i_36;
                            }
                        }
                        return index;
                    }
                }
                return -1;
            };
            Uint16Array.prototype.reduce = function (callback, initialValue) {
                if (0 == this._length && undefined == initialValue) {
                    throw new TypeError('reduce: empty array & no initialValue');
                }
                if (0 == this._length && undefined != initialValue) {
                    return initialValue;
                }
                if (1 == this._length && undefined == initialValue) {
                    return this._dataView.getUint16(0, true);
                }
                var startIndex;
                var previousValue;
                if (undefined != initialValue) {
                    startIndex = 0;
                    previousValue = initialValue;
                } else {
                    startIndex = 1;
                    previousValue = this._dataView.getUint16(0, true);
                }
                var result = 0;
                for (var i_37 = startIndex; i_37 < this._length; i_37++) {
                    var elem = this._dataView.getUint16(i_37 * Uint16Array.BYTES_PER_ELEMENT, true);
                    result += callback(previousValue, elem, i_37, this);
                    previousValue = result;
                }
                return result;
            };
            Uint16Array.prototype.reduceRight = function (callback, initialValue) {
                if (0 == this._length && undefined == initialValue) {
                    throw new TypeError('reduceRight: empty array & no initialValue');
                }
                if (0 == this._length && undefined != initialValue) {
                    return initialValue;
                }
                if (1 == this._length && undefined == initialValue) {
                    return this._dataView.getUint16(0, true);
                }
                var startIndex;
                var previousValue;
                if (undefined != initialValue) {
                    startIndex = this._length - 1;
                    previousValue = initialValue;
                } else {
                    startIndex = this._length - 2;
                    previousValue = this._dataView.getUint16((this._length - 1) * Uint16Array.BYTES_PER_ELEMENT, true);
                }
                var result = 0;
                for (var i_38 = startIndex; i_38 >= 0; i_38--) {
                    var elem = this._dataView.getUint16(i_38 * Uint16Array.BYTES_PER_ELEMENT, true);
                    result += callback(previousValue, elem, i_38, this);
                    previousValue = result;
                }
                return result;
            };
            Uint16Array.prototype.set = function (array, offset) {
                if (array instanceof Array == true || array instanceof Int8Array == true || array instanceof Uint8Array == true || array instanceof Int16Array == true || array instanceof Uint16Array == true || array instanceof Int32Array == true || array instanceof Uint32Array == true || array instanceof Float32Array == true) {
                    var _offset = offset == undefined ? 0 : offset;
                    if ((array.length - _offset) * Uint16Array.BYTES_PER_ELEMENT > this._dataView.byteLength) {
                        throw new TypeError('Uint16Array.set: Out of range');
                    }
                    for (var i_39 = _offset, j_4 = 0; j_4 < array.length; i_39++, j_4++) {
                        this._dataView.setUint16(i_39 * Uint16Array.BYTES_PER_ELEMENT, array[j_4], true);
                    }
                } else {
                    throw new TypeError('Uint16Array.set: Error Type');
                }
            };
            Uint16Array.prototype.toString = function () {
                var str = '[';
                for (var i_40 = 0; i_40 < this._length; i_40++) {
                    var elem = this._dataView.getUint16(i_40 * Uint16Array.BYTES_PER_ELEMENT, true);
                    str += elem;
                    if (i_40 < this._length - 1)
                        str += ',';
                }
                str += ']';
                return str;
            };
            return Uint16Array;
        }();
        Uint16Array.BYTES_PER_ELEMENT = 2;
        var Int32Array = function () {
            function Int32Array(object, byteOffset, length) {
                var typeofobj = typeof object;
                if (typeofobj == 'number' || typeofobj == 'undefined') {
                    this._length = object == undefined ? 256 : object;
                    var arrayBuffer = new ArrayBuffer(this._length * Int32Array.BYTES_PER_ELEMENT);
                    this._dataView = new DataView(arrayBuffer);
                } else if (object instanceof Array == true || object instanceof Int8Array == true || object instanceof Uint8Array == true || object instanceof Int16Array == true || object instanceof Uint16Array == true || object instanceof Int32Array == true || object instanceof Uint32Array == true || object instanceof Float32Array == true) {
                    this._length = object.length;
                    var arrayBuffer = new ArrayBuffer(this._length * Int32Array.BYTES_PER_ELEMENT);
                    this._dataView = new DataView(arrayBuffer);
                    for (var i_41 = 0; i_41 < object.length; i_41++) {
                        this._dataView.setInt32(i_41 * Int32Array.BYTES_PER_ELEMENT, object[i_41], true);
                    }
                } else if (object instanceof ArrayBuffer == true) {
                    var arrayBuffer = object;
                    var _byteOffset = byteOffset ? byteOffset : 0;
                    this._length = length ? length : (object.byteLength - _byteOffset) / Int32Array.BYTES_PER_ELEMENT;
                    this._dataView = new DataView(arrayBuffer, _byteOffset, this._length * Int32Array.BYTES_PER_ELEMENT);
                } else {
                    throw 'Uint16Array.constructor: Error Type';
                }
                Object.defineProperty(this, '__rawBKData', {
                    get: function () {
                        var begin = this._dataView.byteOffset;
                        var end = this._dataView.byteOffset + this._dataView.byteLength;
                        this.__rawData = this._dataView.buffer.slice(begin, end);
                        return this.__rawData.__nativeObj;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, 'BYTES_PER_ELEMENT', {
                    get: function () {
                        return 4;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, 'buffer', {
                    get: function () {
                        return this._dataView.buffer;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, 'byteLength', {
                    get: function () {
                        return this._dataView.byteLength;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, 'byteOffset', {
                    get: function () {
                        return this._dataView.byteOffset;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, 'length', {
                    get: function () {
                        return this._length;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, 'name', {
                    get: function () {
                        return 'Int32Array';
                    },
                    enumerable: true,
                    configurable: true
                });
                var _loop_5 = function (i_42) {
                    Object.defineProperty(this_5, String(i_42), {
                        get: function () {
                            var elem = this._dataView.getInt32(i_42 * Int32Array.BYTES_PER_ELEMENT, true);
                            return elem;
                        },
                        set: function (value) {
                            this._dataView.setInt32(i_42 * Int32Array.BYTES_PER_ELEMENT, value, true);
                        },
                        enumerable: true,
                        configurable: true
                    });
                };
                var this_5 = this;
                for (var i_42 = 0; i_42 < this._length; i_42++) {
                    _loop_5(i_42);
                }
            }
            Int32Array.prototype.forEach = function (callback, thisArg) {
                if (callback) {
                    for (var i_43 = 0; i_43 < this._length; i_43++) {
                        var elem = this._dataView.getInt32(i_43 * Int32Array.BYTES_PER_ELEMENT, true);
                        callback.call(thisArg, elem, i_43, this);
                    }
                }
            };
            Int32Array.prototype.includes = function (searchElement, fromIndex) {
                for (var i_44 = fromIndex; i_44 < this._length; i_44++) {
                    var elem = this._dataView.getInt32(i_44 * Int32Array.BYTES_PER_ELEMENT, true);
                    if (searchElement == elem) {
                        return true;
                    }
                }
                return false;
            };
            Int32Array.prototype.lastIndexOf = function (searchElement, fromIndex) {
                if (fromIndex >= 0) {
                    var startIndex = 0;
                    if (fromIndex >= this._length) {
                        startIndex = 0;
                    } else {
                        startIndex = fromIndex;
                    }
                    var index = -1;
                    for (var i_45 = startIndex; i_45 < this._length; i_45++) {
                        var elem = this._dataView.getInt32(i_45 * Int32Array.BYTES_PER_ELEMENT, true);
                        if (searchElement === elem) {
                            index = i_45;
                        }
                    }
                    return index;
                } else {
                    var startIndex = fromIndex + this._length;
                    if (startIndex >= 0) {
                        var index = -1;
                        for (var i_46 = startIndex; i_46 >= 0; i_46--) {
                            var elem = this._dataView.getInt32(i_46 * Int32Array.BYTES_PER_ELEMENT, true);
                            if (searchElement === elem) {
                                index = i_46;
                            }
                        }
                        return index;
                    }
                }
                return -1;
            };
            Int32Array.prototype.reduce = function (callback, initialValue) {
                if (0 == this._length && undefined == initialValue) {
                    throw new TypeError('reduce: empty array & no initialValue');
                }
                if (0 == this._length && undefined != initialValue) {
                    return initialValue;
                }
                if (1 == this._length && undefined == initialValue) {
                    return this._dataView.getInt32(0, true);
                }
                var startIndex;
                var previousValue;
                if (undefined != initialValue) {
                    startIndex = 0;
                    previousValue = initialValue;
                } else {
                    startIndex = 1;
                    previousValue = this._dataView.getInt32(0, true);
                }
                var result = 0;
                for (var i_47 = startIndex; i_47 < this._length; i_47++) {
                    var elem = this._dataView.getInt32(i_47 * Int32Array.BYTES_PER_ELEMENT, true);
                    result += callback(previousValue, elem, i_47, this);
                    previousValue = result;
                }
                return result;
            };
            Int32Array.prototype.reduceRight = function (callback, initialValue) {
                if (0 == this._length && undefined == initialValue) {
                    throw new TypeError('reduceRight: empty array & no initialValue');
                }
                if (0 == this._length && undefined != initialValue) {
                    return initialValue;
                }
                if (1 == this._length && undefined == initialValue) {
                    return this._dataView.getInt32(0, true);
                }
                var startIndex;
                var previousValue;
                if (undefined != initialValue) {
                    startIndex = this._length - 1;
                    previousValue = initialValue;
                } else {
                    startIndex = this._length - 2;
                    previousValue = this._dataView.getInt32((this._length - 1) * Int32Array.BYTES_PER_ELEMENT, true);
                }
                var result = 0;
                for (var i_48 = startIndex; i_48 >= 0; i_48--) {
                    var elem = this._dataView.getInt32(i_48 * Int32Array.BYTES_PER_ELEMENT, true);
                    result += callback(previousValue, elem, i_48, this);
                    previousValue = result;
                }
                return result;
            };
            Int32Array.prototype.set = function (array, offset) {
                if (array instanceof Array == true || array instanceof Int8Array == true || array instanceof Uint8Array == true || array instanceof Int16Array == true || array instanceof Uint16Array == true || array instanceof Int32Array == true || array instanceof Uint32Array == true || array instanceof Float32Array == true) {
                    var _offset = offset == undefined ? 0 : offset;
                    if ((array.length - _offset) * Int32Array.BYTES_PER_ELEMENT > this._dataView.byteLength) {
                        throw new TypeError('Int32Array.set: Out of range');
                    }
                    for (var i_49 = _offset, j_5 = 0; j_5 < array.length; i_49++, j_5++) {
                        this._dataView.setInt32(i_49 * Int32Array.BYTES_PER_ELEMENT, array[j_5], true);
                    }
                } else {
                    throw new TypeError('Int32Array.set: Error Type');
                }
            };
            Int32Array.prototype.toString = function () {
                var str = '[';
                for (var i_50 = 0; i_50 < this._length; i_50++) {
                    var elem = this._dataView.getInt32(i_50 * Int32Array.BYTES_PER_ELEMENT, true);
                    str += elem;
                    if (i_50 < this._length - 1)
                        str += ',';
                }
                str += ']';
                return str;
            };
            return Int32Array;
        }();
        Int32Array.BYTES_PER_ELEMENT = 4;
        var Uint32Array = function () {
            function Uint32Array(object, byteOffset, length) {
                var typeofobj = typeof object;
                if (typeofobj == 'number' || typeofobj == 'undefined') {
                    this._length = object == undefined ? 256 : object;
                    var arrayBuffer = new ArrayBuffer(this._length * Uint32Array.BYTES_PER_ELEMENT);
                    this._dataView = new DataView(arrayBuffer);
                } else if (object instanceof Array == true || object instanceof Int8Array == true || object instanceof Uint8Array == true || object instanceof Int16Array == true || object instanceof Uint16Array == true || object instanceof Int32Array == true || object instanceof Uint32Array == true || object instanceof Float32Array == true) {
                    this._length = object.length;
                    var arrayBuffer = new ArrayBuffer(this._length * Uint32Array.BYTES_PER_ELEMENT);
                    this._dataView = new DataView(arrayBuffer);
                    for (var i_51 = 0; i_51 < object.length; i_51++) {
                        this._dataView.setUint32(i_51 * Uint32Array.BYTES_PER_ELEMENT, object[i_51], true);
                    }
                } else if (object instanceof ArrayBuffer == true) {
                    var arrayBuffer = object;
                    var _byteOffset = byteOffset ? byteOffset : 0;
                    this._length = length ? length : (object.byteLength - _byteOffset) / Uint32Array.BYTES_PER_ELEMENT;
                    this._dataView = new DataView(arrayBuffer, _byteOffset, this._length * Uint32Array.BYTES_PER_ELEMENT);
                } else {
                    throw 'Uint32Array.constructor: Error Type';
                }
                Object.defineProperty(this, '__rawBKData', {
                    get: function () {
                        var begin = this._dataView.byteOffset;
                        var end = this._dataView.byteOffset + this._dataView.byteLength;
                        this.__rawData = this._dataView.buffer.slice(begin, end);
                        return this.__rawData.__nativeObj;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, 'BYTES_PER_ELEMENT', {
                    get: function () {
                        return 4;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, 'buffer', {
                    get: function () {
                        return this._dataView.buffer;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, 'byteLength', {
                    get: function () {
                        return this._dataView.byteLength;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, 'byteOffset', {
                    get: function () {
                        return this._dataView.byteOffset;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, 'length', {
                    get: function () {
                        return this._length;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, 'name', {
                    get: function () {
                        return 'Uint32Array';
                    },
                    enumerable: true,
                    configurable: true
                });
                var _loop_6 = function (i_52) {
                    Object.defineProperty(this_6, String(i_52), {
                        get: function () {
                            var elem = this._dataView.getUint32(i_52 * Uint32Array.BYTES_PER_ELEMENT, true);
                            return elem;
                        },
                        set: function (value) {
                            this._dataView.setUint32(i_52 * Uint32Array.BYTES_PER_ELEMENT, value, true);
                        },
                        enumerable: true,
                        configurable: true
                    });
                };
                var this_6 = this;
                for (var i_52 = 0; i_52 < this._length; i_52++) {
                    _loop_6(i_52);
                }
            }
            Uint32Array.prototype.forEach = function (callback, thisArg) {
                if (callback) {
                    for (var i_53 = 0; i_53 < this._length; i_53++) {
                        var elem = this._dataView.getUint32(i_53 * Uint32Array.BYTES_PER_ELEMENT, true);
                        callback.call(thisArg, elem, i_53, this);
                    }
                }
            };
            Uint32Array.prototype.includes = function (searchElement, fromIndex) {
                for (var i_54 = fromIndex; i_54 < this._length; i_54++) {
                    var elem = this._dataView.getUint32(i_54 * Uint32Array.BYTES_PER_ELEMENT, true);
                    if (searchElement == elem) {
                        return true;
                    }
                }
                return false;
            };
            Uint32Array.prototype.lastIndexOf = function (searchElement, fromIndex) {
                if (fromIndex >= 0) {
                    var startIndex = 0;
                    if (fromIndex >= this._length) {
                        startIndex = 0;
                    } else {
                        startIndex = fromIndex;
                    }
                    var index = -1;
                    for (var i_55 = startIndex; i_55 < this._length; i_55++) {
                        var elem = this._dataView.getUint32(i_55 * Uint32Array.BYTES_PER_ELEMENT, true);
                        if (searchElement === elem) {
                            index = i_55;
                        }
                    }
                    return index;
                } else {
                    var startIndex = fromIndex + this._length;
                    if (startIndex >= 0) {
                        var index = -1;
                        for (var i_56 = startIndex; i_56 >= 0; i_56--) {
                            var elem = this._dataView.getUint32(i_56 * Uint32Array.BYTES_PER_ELEMENT, true);
                            if (searchElement === elem) {
                                index = i_56;
                            }
                        }
                        return index;
                    }
                }
                return -1;
            };
            Uint32Array.prototype.reduce = function (callback, initialValue) {
                if (0 == this._length && undefined == initialValue) {
                    throw new TypeError('reduce: empty array & no initialValue');
                }
                if (0 == this._length && undefined != initialValue) {
                    return initialValue;
                }
                if (1 == this._length && undefined == initialValue) {
                    return this._dataView.getUint32(0, true);
                }
                var startIndex;
                var previousValue;
                if (undefined != initialValue) {
                    startIndex = 0;
                    previousValue = initialValue;
                } else {
                    startIndex = 1;
                    previousValue = this._dataView.getUint32(0, true);
                }
                var result = 0;
                for (var i_57 = startIndex; i_57 < this._length; i_57++) {
                    var elem = this._dataView.getUint32(i_57 * Uint32Array.BYTES_PER_ELEMENT, true);
                    result += callback(previousValue, elem, i_57, this);
                    previousValue = result;
                }
                return result;
            };
            Uint32Array.prototype.reduceRight = function (callback, initialValue) {
                if (0 == this._length && undefined == initialValue) {
                    throw new TypeError('reduceRight: empty array & no initialValue');
                }
                if (0 == this._length && undefined != initialValue) {
                    return initialValue;
                }
                if (1 == this._length && undefined == initialValue) {
                    return this._dataView.getUint32(0, true);
                }
                var startIndex;
                var previousValue;
                if (undefined != initialValue) {
                    startIndex = this._length - 1;
                    previousValue = initialValue;
                } else {
                    startIndex = this._length - 2;
                    previousValue = this._dataView.getUint32((this._length - 1) * Uint32Array.BYTES_PER_ELEMENT, true);
                }
                var result = 0;
                for (var i_58 = startIndex; i_58 >= 0; i_58--) {
                    var elem = this._dataView.getUint32(i_58 * Uint32Array.BYTES_PER_ELEMENT, true);
                    result += callback(previousValue, elem, i_58, this);
                    previousValue = result;
                }
                return result;
            };
            Uint32Array.prototype.set = function (array, offset) {
                if (array instanceof Array == true || array instanceof Int8Array == true || array instanceof Uint8Array == true || array instanceof Int16Array == true || array instanceof Uint16Array == true || array instanceof Int32Array == true || array instanceof Uint32Array == true || array instanceof Float32Array == true) {
                    var _offset = offset == undefined ? 0 : offset;
                    if ((array.length - _offset) * Uint32Array.BYTES_PER_ELEMENT > this._dataView.byteLength) {
                        throw new TypeError('Uint32Array.set: Out of range');
                    }
                    for (var i_59 = _offset, j_6 = 0; j_6 < array.length; i_59++, j_6++) {
                        this._dataView.setUint32(i_59 * Uint32Array.BYTES_PER_ELEMENT, array[j_6], true);
                    }
                } else {
                    throw new TypeError('Uint32Array.set: Error Type');
                }
            };
            Uint32Array.prototype.toString = function () {
                var str = '[';
                for (var i_60 = 0; i_60 < this._length; i_60++) {
                    var elem = this._dataView.getUint32(i_60 * Uint32Array.BYTES_PER_ELEMENT, true);
                    str += elem;
                    if (i_60 < this._length - 1)
                        str += ',';
                }
                str += ']';
                return str;
            };
            return Uint32Array;
        }();
        Uint32Array.BYTES_PER_ELEMENT = 4;
        var Float32Array = function () {
            function Float32Array(object, byteOffset, length) {
                var typeofobj = typeof object;
                if (typeofobj == 'number' || typeofobj == 'undefined') {
                    this._length = object == undefined ? 256 : object;
                    var arrayBuffer = new ArrayBuffer(this._length * Float32Array.BYTES_PER_ELEMENT);
                    this._dataView = new DataView(arrayBuffer);
                } else if (object instanceof Array == true || object instanceof Int8Array == true || object instanceof Uint8Array == true || object instanceof Int16Array == true || object instanceof Uint16Array == true || object instanceof Int32Array == true || object instanceof Uint32Array == true || object instanceof Float32Array == true) {
                    this._length = object.length;
                    var arrayBuffer = new ArrayBuffer(this._length * Float32Array.BYTES_PER_ELEMENT);
                    this._dataView = new DataView(arrayBuffer);
                    for (var i_61 = 0; i_61 < object.length; i_61++) {
                        this._dataView.setFloat32(i_61 * Float32Array.BYTES_PER_ELEMENT, object[i_61], true);
                    }
                } else if (object instanceof ArrayBuffer == true) {
                    var arrayBuffer = object;
                    var _byteOffset = byteOffset ? byteOffset : 0;
                    this._length = length ? length : (object.byteLength - _byteOffset) / Float32Array.BYTES_PER_ELEMENT;
                    this._dataView = new DataView(arrayBuffer, _byteOffset, this._length * Float32Array.BYTES_PER_ELEMENT);
                } else {
                    throw 'Float32Array.constructor: Error Type';
                }
                Object.defineProperty(this, '__rawBKData', {
                    get: function () {
                        var begin = this._dataView.byteOffset;
                        var end = this._dataView.byteOffset + this._dataView.byteLength;
                        this.__rawData = this._dataView.buffer.slice(begin, end);
                        return this.__rawData.__nativeObj;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, 'BYTES_PER_ELEMENT', {
                    get: function () {
                        return 4;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, 'buffer', {
                    get: function () {
                        return this._dataView.buffer;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, 'byteLength', {
                    get: function () {
                        return this._dataView.byteLength;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, 'byteOffset', {
                    get: function () {
                        return this._dataView.byteOffset;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, 'length', {
                    get: function () {
                        return this._length;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, 'name', {
                    get: function () {
                        return 'Float32Array';
                    },
                    enumerable: true,
                    configurable: true
                });
                var _loop_7 = function (i_62) {
                    Object.defineProperty(this_7, String(i_62), {
                        get: function () {
                            var elem = this._dataView.getFloat32(i_62 * Float32Array.BYTES_PER_ELEMENT, true);
                            return elem;
                        },
                        set: function (value) {
                            this._dataView.setFloat32(i_62 * Float32Array.BYTES_PER_ELEMENT, value, true);
                        },
                        enumerable: true,
                        configurable: true
                    });
                };
                var this_7 = this;
                for (var i_62 = 0; i_62 < this._length; i_62++) {
                    _loop_7(i_62);
                }
            }
            Float32Array.prototype.forEach = function (callback, thisArg) {
                if (callback) {
                    for (var i_63 = 0; i_63 < this._length; i_63++) {
                        var elem = this._dataView.getFloat32(i_63 * Float32Array.BYTES_PER_ELEMENT, true);
                        callback.call(thisArg, elem, i_63, this);
                    }
                }
            };
            Float32Array.prototype.includes = function (searchElement, fromIndex) {
                for (var i_64 = fromIndex; i_64 < this._length; i_64++) {
                    var elem = this._dataView.getFloat32(i_64 * Float32Array.BYTES_PER_ELEMENT, true);
                    if (searchElement == elem) {
                        return true;
                    }
                }
                return false;
            };
            Float32Array.prototype.lastIndexOf = function (searchElement, fromIndex) {
                if (fromIndex >= 0) {
                    var startIndex = 0;
                    if (fromIndex >= this._length) {
                        startIndex = 0;
                    } else {
                        startIndex = fromIndex;
                    }
                    var index = -1;
                    for (var i_65 = startIndex; i_65 < this._length; i_65++) {
                        var elem = this._dataView.getFloat32(i_65 * Float32Array.BYTES_PER_ELEMENT, true);
                        if (searchElement === elem) {
                            index = i_65;
                        }
                    }
                    return index;
                } else {
                    var startIndex = fromIndex + this._length;
                    if (startIndex >= 0) {
                        var index = -1;
                        for (var i_66 = startIndex; i_66 >= 0; i_66--) {
                            var elem = this._dataView.getFloat32(i_66 * Float32Array.BYTES_PER_ELEMENT, true);
                            if (searchElement === elem) {
                                index = i_66;
                            }
                        }
                        return index;
                    }
                }
                return -1;
            };
            Float32Array.prototype.reduce = function (callback, initialValue) {
                if (0 == this._length && undefined == initialValue) {
                    throw new TypeError('reduce: empty array & no initialValue');
                }
                if (0 == this._length && undefined != initialValue) {
                    return initialValue;
                }
                if (1 == this._length && undefined == initialValue) {
                    return this._dataView.getFloat32(0, true);
                }
                var startIndex;
                var previousValue;
                if (undefined != initialValue) {
                    startIndex = 0;
                    previousValue = initialValue;
                } else {
                    startIndex = 1;
                    previousValue = this._dataView.getFloat32(0, true);
                }
                var result = 0;
                for (var i_67 = startIndex; i_67 < this._length; i_67++) {
                    var elem = this._dataView.getFloat32(i_67 * Float32Array.BYTES_PER_ELEMENT, true);
                    result += callback(previousValue, elem, i_67, this);
                    previousValue = result;
                }
                return result;
            };
            Float32Array.prototype.reduceRight = function (callback, initialValue) {
                if (0 == this._length && undefined == initialValue) {
                    throw new TypeError('reduceRight: empty array & no initialValue');
                }
                if (0 == this._length && undefined != initialValue) {
                    return initialValue;
                }
                if (1 == this._length && undefined == initialValue) {
                    return this._dataView.getFloat32(0, true);
                }
                var startIndex;
                var previousValue;
                if (undefined != initialValue) {
                    startIndex = this._length - 1;
                    previousValue = initialValue;
                } else {
                    startIndex = this._length - 2;
                    previousValue = this._dataView.getFloat32((this._length - 1) * Float32Array.BYTES_PER_ELEMENT, true);
                }
                var result = 0;
                for (var i_68 = startIndex; i_68 >= 0; i_68--) {
                    var elem = this._dataView.getFloat32(i_68 * Float32Array.BYTES_PER_ELEMENT, true);
                    result += callback(previousValue, elem, i_68, this);
                    previousValue = result;
                }
                return result;
            };
            Float32Array.prototype.set = function (array, offset) {
                if (array instanceof Array == true || array instanceof Int8Array == true || array instanceof Uint8Array == true || array instanceof Int16Array == true || array instanceof Uint16Array == true || array instanceof Int32Array == true || array instanceof Uint32Array == true || array instanceof Float32Array == true) {
                    var _offset = offset == undefined ? 0 : offset;
                    if ((array.length - _offset) * Float32Array.BYTES_PER_ELEMENT > this._dataView.byteLength) {
                        throw new TypeError('Float32Array.set: Out of range');
                    }
                    for (var i_69 = _offset, j_7 = 0; j_7 < array.length; i_69++, j_7++) {
                        this._dataView.setFloat32(i_69 * Float32Array.BYTES_PER_ELEMENT, array[j_7], true);
                    }
                } else {
                    throw new TypeError('Float32Array.set: Error Type');
                }
            };
            Float32Array.prototype.toString = function () {
                var str = '[';
                for (var i_70 = 0; i_70 < this._length; i_70++) {
                    var elem = this._dataView.getFloat32(i_70 * Float32Array.BYTES_PER_ELEMENT, true);
                    str += elem;
                    if (i_70 < this._length - 1)
                        str += ',';
                }
                str += ']';
                return str;
            };
            return Float32Array;
        }();
        Float32Array.BYTES_PER_ELEMENT = 4;
        return {
            'DataView': DataView,
            'ArrayBuffer': ArrayBuffer,
            'Int8Array': Int8Array,
            'Uint8Array': Uint8Array,
            'Int16Array': Int16Array,
            'Uint16Array': Uint16Array,
            'Int32Array': Int32Array,
            'Uint32Array': Uint32Array,
            'Float32Array': Float32Array
        };
    }));
}(this));
BK.Script.log(0, 0, 'filemanage.js is loaded');
BK.FileManager = function () {
    this.fileArray = [];
    this.readFile = function (path, func) {
        var nobFile = new BK.FileUtil(path);
        nobFile.openFile();
        var fileObj = new Object();
        fileObj.path = path;
        fileObj.status = 0;
        fileObj.readCallBack = func;
        fileObj.file = nobFile;
        this.fileArray.push(fileObj);
        return fileObj;
    };
    this.update = function () {
        for (var i = 0; i < this.fileArray.length; i++) {
            if (this.fileArray[i].status == 1) {
                continue;
            }
            var ret = this.fileArray[i].file.update();
            if (ret == 1 || ret == 3) {
                var buffer = this.fileArray[i].file.readFileAsync();
                if (buffer) {
                    this.fileArray[i].readCallBack(buffer);
                    this.fileArray[i].data = buffer;
                    this.fileArray[i].status = 1;
                    this.fileArray[i].file.close();
                }
            }
        }
    };
    this.getFileData = function (path) {
        for (var i = 0; i < this.fileArray.length; i++) {
            if (this.fileArray[i].path == path && this.fileArray[i].status == 1) {
                return this.fileArray[i].data;
            }
        }
    };
    this.closeFile = function (fileObj) {
        for (var i = his.fileArray.length; i > 0; i--) {
            if (this.fileArray[i].path == file.path) {
                this.fileArray.splice(i, 1);
            }
        }
        fileObj.file.removeFromCache();
    };
};
BK.Script.log(1, 1, 'skeletonAnimationAsync js done');
var fileManager = new BK.FileManager();
function skeletonAnimationAsync(path, timescale, startCB, completeCB, endCB, callback) {
    var pngPath = path + '.png';
    var atlasPath = path + '.atlas';
    var jsonPath = path + '.json';
    var progress = 0;
    fileManager.readFile(pngPath, function (buff) {
        BK.Script.log(0, 0, 'skeletonAnimationAsync Done');
        progress++;
        if (progress == 3) {
            var jsonRealPath = BK.Script.pathForResource(jsonPath);
            var atlasRealPath = BK.Script.pathForResource(atlasPath);
            var ani = new BK.SkeletonAnimation(atlasRealPath, jsonRealPath, timescale, startCB, completeCB, endCB);
            callback(ani);
        }
    });
    fileManager.readFile(atlasPath, function (buff) {
        BK.Script.log(0, 0, 'skeletonAnimationAsync Done');
        progress++;
        if (progress == 3) {
            var jsonRealPath = BK.Script.pathForResource(jsonPath);
            var atlasRealPath = BK.Script.pathForResource(atlasPath);
            var ani = new BK.SkeletonAnimation(atlasRealPath, jsonRealPath, timescale, startCB, completeCB, endCB);
            callback(ani);
        }
    });
    fileManager.readFile(jsonPath, function (buff) {
        BK.Script.log(0, 0, 'skeletonAnimationAsync Done');
        progress++;
        if (progress == 3) {
            var jsonRealPath = BK.Script.pathForResource(jsonPath);
            var atlasRealPath = BK.Script.pathForResource(atlasPath);
            var ani = new BK.SkeletonAnimation(atlasRealPath, jsonRealPath, timescale, startCB, completeCB, endCB);
            callback(ani);
        }
    });
}
function setAccessoryAsync(ani, path, callback) {
    var pngPath = path + '.png';
    var atlasPath = path + '.atlas';
    var jsonPath = path + '.json';
    var progress = 0;
    fileManager.readFile(pngPath, function (buff) {
        BK.Script.log(0, 0, 'setAccessoryAsync Done');
        progress++;
        if (progress == 3) {
            var jsonRealPath = BK.Script.pathForResource(jsonPath);
            var atlasRealPath = BK.Script.pathForResource(atlasPath);
            ani.setAccessory(jsonRealPath, atlasRealPath);
            callback();
        }
    });
    fileManager.readFile(atlasPath, function (buff) {
        BK.Script.log(0, 0, 'setAccessoryAsync Done');
        progress++;
        if (progress == 3) {
            var jsonRealPath = BK.Script.pathForResource(jsonPath);
            var atlasRealPath = BK.Script.pathForResource(atlasPath);
            ani.setAccessory(jsonRealPath, atlasRealPath);
            callback();
        }
    });
    fileManager.readFile(jsonPath, function (buff) {
        BK.Script.log(0, 0, 'setAccessoryAsync Done');
        progress++;
        if (progress == 3) {
            var jsonRealPath = BK.Script.pathForResource(jsonPath);
            var atlasRealPath = BK.Script.pathForResource(atlasPath);
            ani.setAccessory(jsonRealPath, atlasRealPath);
            callback();
        }
    });
}
function setAccessoryWithInfoAsync(ani, path, content, callback) {
    var pngPath = path + '.png';
    var atlasPath = path + '.atlas';
    var jsonPath = path + '.json';
    var progress = 0;
    fileManager.readFile(pngPath, function (buff) {
        BK.Script.log(0, 0, 'setAccessoryWithInfo Done');
        progress++;
        if (progress == 3) {
            var jsonRealPath = BK.Script.pathForResource(jsonPath);
            var atlasRealPath = BK.Script.pathForResource(atlasPath);
            ani.setAccessoryWithInfo(jsonRealPath, atlasRealPath, content);
            callback();
        }
    });
    fileManager.readFile(atlasPath, function (buff) {
        BK.Script.log(0, 0, 'setAccessoryWithInfo Done');
        progress++;
        if (progress == 3) {
            var jsonRealPath = BK.Script.pathForResource(jsonPath);
            var atlasRealPath = BK.Script.pathForResource(atlasPath);
            ani.setAccessoryWithInfo(jsonRealPath, atlasRealPath, content);
            callback();
        }
    });
    fileManager.readFile(jsonPath, function (buff) {
        BK.Script.log(0, 0, 'setAccessoryWithInfo Done');
        progress++;
        if (progress == 3) {
            var jsonRealPath = BK.Script.pathForResource(jsonPath);
            var atlasRealPath = BK.Script.pathForResource(atlasPath);
            ani.setAccessoryWithInfo(jsonRealPath, atlasRealPath, content);
            callback();
        }
    });
}
function setAccessoryAnimationAsync(ani, path, name, callback) {
    var pngPath = path + '.png';
    var atlasPath = path + '.atlas';
    var jsonPath = path + '.json';
    var progress = 0;
    fileManager.readFile(pngPath, function (buff) {
        BK.Script.log(0, 0, 'setAccessoryAnimationAsync Done');
        progress++;
        if (progress == 3) {
            var jsonRealPath = BK.Script.pathForResource(jsonPath);
            var atlasRealPath = BK.Script.pathForResource(atlasPath);
            ani.setAccessoryAnimation(jsonRealPath, atlasRealPath, name);
            callback();
        }
    });
    fileManager.readFile(atlasPath, function (buff) {
        BK.Script.log(0, 0, 'setAccessoryAnimationAsync Done');
        progress++;
        if (progress == 3) {
            var jsonRealPath = BK.Script.pathForResource(jsonPath);
            var atlasRealPath = BK.Script.pathForResource(atlasPath);
            ani.setAccessoryAnimation(jsonRealPath, atlasRealPath, name);
            callback();
        }
    });
    fileManager.readFile(jsonPath, function (buff) {
        BK.Script.log(0, 0, 'setAccessoryAnimationAsync Done');
        progress++;
        if (progress == 3) {
            var jsonRealPath = BK.Script.pathForResource(jsonPath);
            var atlasRealPath = BK.Script.pathForResource(atlasPath);
            ani.setAccessoryAnimation(jsonRealPath, atlasRealPath, name);
            callback();
        }
    });
}
BK.Director.ticker.add(function (ts, duration) {
    fileManager.update();
});
BK.DNS = function () {
    function dns() {
        this.records = [];
        this.running = false;
    }
    dns.prototype.exists = function (hostname) {
        for (var i = 0; i < this.records.length; i++) {
            if (this.records[i].hostname === hostname) {
                return true;
            }
        }
        return false;
    };
    dns.prototype.query = function (hostname, af) {
        for (var i = 0; i < this.records.length; i++) {
            if (this.records[i].af === af && this.records[i].hostname === hostname) {
                return this.records[i];
            }
        }
        return null;
    };
    dns.prototype.update = function (hostname, callback, af, timeout) {
        for (var i = 0; i < this.records.length; i++) {
            if (this.records[i].af === af && this.records[i].hostname === hostname) {
                this.records[i].callbacks.push(callback);
                return;
            }
        }
        this.records.push({
            af: af,
            timeout: timeout,
            hostname: hostname,
            callbacks: [callback]
        });
    };
    dns.prototype.delete = function (hostname) {
        for (var i = 0; i < this.records.length; i++) {
            if (this.records[i].hostname === hostname) {
                this.records.splice(i);
                break;
            }
        }
    };
    dns.prototype.start = function () {
        if (!this.running) {
            this.running = true;
            var _this = this;
            BK.Director.ticker.add(function (ts, duration) {
                if (_this.records.length) {
                    BK.Misc.handleDNSQueryResult();
                }
            });
        }
    };
    dns.prototype.queryIPAddress = function (hostname, callback, af, timeout) {
        var needQuery = !this.exists(hostname);
        if (undefined == af)
            af = 2;
        if (undefined == timeout)
            timeout = 0;
        this.update(hostname, callback, af, timeout);
        if (needQuery) {
            var _this = this;
            _this.start();
            BK.Misc.queryIPAddress(hostname, function (reason, af, iplist) {
                var item = _this.query(hostname, af);
                if (item) {
                    var callbacks = item.callbacks;
                    for (var i = 0; i < callbacks.length; i++) {
                        callbacks[i].call(_this, reason, af, iplist);
                    }
                }
                _this.delete(hostname);
            }, af, timeout);
        }
    };
    return new dns();
}();
var CRLF = '\r\n';
var CR = 13;
var LF = 10;
var MAX_CHUNK_SIZE = 512 * 1024;
var MAX_HEADER_BYTES = 80 * 1024;
var RE_STATUS_LINE = /^HTTP\/1\.([01]) ([0-9]{3})(?: ((?:[\x21-\x7E](?:[\t ]+[\x21-\x7E])*)*))?$/;
var RE_HEADER = /^([!#$%'*+\-.^_`|~0-9A-Za-z]+):[\t ]*((?:[\x21-\x7E](?:[\t ]+[\x21-\x7E])*)*)[\t ]*$/;
var RE_FOLDED = /^[\t ]+(.*)$/;
var STATE_STATUS_LINE = 1;
var STATE_HEADER = 2;
var STATE_COMPLETE = 3;
var STATE_NAMES = [
    'STATE_STATUS_LINE',
    'STATE_HEADER',
    'STATE_COMPLETE'
];
var FLAG_CHUNKED = 1 << 0;
var FLAG_CONNECTION_KEEP_ALIVE = 1 << 1;
var FLAG_CONNECTION_CLOSE = 1 << 2;
var FLAG_CONNECTION_UPGRADE = 1 << 3;
var FLAG_TRAILING = 1 << 4;
var FLAG_UPGRADE = 1 << 5;
var FLAG_SKIPBODY = 1 << 6;
var FLAG_ANY_UPGRADE = FLAG_UPGRADE | FLAG_CONNECTION_UPGRADE;
function HTTPParser(type) {
    this.onHeaders = undefined;
    this.onComplete = undefined;
    this.reinitialize(type);
}
HTTPParser.prototype.reinitialize = function (type) {
    this.execute = this._executeHeader;
    this.type = type;
    if (type === HTTPParser.RESPONSE)
        this._state = STATE_STATUS_LINE;
    this._err = undefined;
    this._flags = 0;
    this._contentLen = undefined;
    this._nbytes = 0;
    this._nhdrbytes = 0;
    this._nhdrpairs = 0;
    this._buf = '';
    this._seenCR = false;
    this.headers = {};
    this.httpMajor = 1;
    this.httpMinor = undefined;
    this.maxHeaderPairs = 2000;
    this.method = undefined;
    this.url = undefined;
    this.statusCode = undefined;
    this.statusText = undefined;
};
HTTPParser.prototype._processHdrLine = function (line) {
    switch (this._state) {
    case STATE_HEADER:
        if (line.length === 0) {
            this._headersEnd();
            return;
        }
        var m = RE_HEADER.exec(line);
        if (m === null) {
            m = RE_FOLDED.exec(line);
            if (m === null) {
                this.execute = this._executeError;
                this._err = new Error('Malformed header line');
                this.execute(this._err);
                return this._err;
            }
            var extra = m[1];
            if (extra.length > 0) {
                BK.Script.log(1, 0, 'processHdrLine!extra = ' + extra);
            }
        } else {
            var fieldName = m[1];
            var fieldValue = m[2];
            switch (fieldName.toLowerCase()) {
            case 'connection':
                var valLower = fieldValue.toLowerCase();
                if (valLower.substring(0, 5) === 'close')
                    this._flags |= FLAG_CONNECTION_CLOSE;
                else if (valLower.substring(0, 10) === 'keep-alive')
                    this._flags |= FLAG_CONNECTION_KEEP_ALIVE;
                else if (valLower.substring(0, 7) === 'upgrade')
                    this._flags |= FLAG_CONNECTION_UPGRADE;
                break;
            case 'transfer-encoding':
                var valLower = fieldValue.toLowerCase();
                if (valLower.substring(0, 7) === 'chunked')
                    this._flags |= FLAG_CHUNKED;
                break;
            case 'upgrade':
                this._flags |= FLAG_UPGRADE;
                break;
            case 'content-length':
                var val = parseInt(fieldValue, 10);
                if (isNaN(val) || val > MAX_CHUNK_SIZE) {
                    this.execute = this._executeError;
                    this._err = new Error('Bad Content-Length: ' + inspect(val));
                    this.execute(this._err);
                    return this._err;
                }
                this._contentLen = val;
                break;
            }
            var maxHeaderPairs = this.maxHeaderPairs;
            if (maxHeaderPairs <= 0 || ++this._nhdrpairs < maxHeaderPairs)
                this.headers[fieldName.toLowerCase()] = fieldValue;
        }
        break;
    case STATE_STATUS_LINE:
        if (line.length === 0)
            return true;
        var m = RE_STATUS_LINE.exec(line);
        if (m === null) {
            this.execute = this._executeError;
            this._err = new Error('Malformed status line');
            this.execute(this._err);
            return this._err;
        }
        this.httpMinor = parseInt(m[1], 10);
        this.statusCode = parseInt(m[2], 10);
        this.statusText = m[3] || '';
        this._state = STATE_HEADER;
        break;
    default:
        this.execute = this._executeError;
        this._err = new Error('Unexpected HTTP parser state: ' + this._state);
        this.execute(this._err);
        return this._err;
    }
};
HTTPParser.prototype._headersEnd = function () {
    var flags = this._flags;
    var methodLower = this.method && this.method.toLowerCase();
    var upgrade = (flags & FLAG_ANY_UPGRADE) === FLAG_ANY_UPGRADE || methodLower === 'connect';
    var keepalive = (flags & FLAG_CONNECTION_CLOSE) === 0;
    var contentLen = this._contentLen;
    var ret;
    this._buf = '';
    this._seenCR = false;
    this._nbytes = 0;
    if (this.httpMajor === 0 && this.httpMinor === 9 || this.httpMinor === 0 && (flags & FLAG_CONNECTION_KEEP_ALIVE) === 0) {
        keepalive = false;
    }
    if ((flags & FLAG_TRAILING) > 0) {
        this.onComplete && this.onComplete();
        this.reinitialize(this.type);
        return;
    } else {
        if (this.onHeaders) {
            var headers = this.headers;
            ret = this.onHeaders(this.httpMajor, this.httpMinor, headers, this.method, this.url, this.statusCode, this.statusText, upgrade, keepalive);
            if (ret === true)
                flags = this._flags |= FLAG_SKIPBODY;
        }
    }
    if (upgrade) {
        this.onComplete && this.onComplete();
        this._state = STATE_COMPLETE;
    } else if (contentLen === 0 || (flags & FLAG_SKIPBODY) > 0 || (flags & FLAG_CHUNKED) === 0 && contentLen === undefined && !this._needsEOF()) {
        this.onComplete && this.onComplete();
        this.reinitialize(this.type);
    }
};
HTTPParser.prototype._executeHeader = function (data) {
    var offset = 0;
    var len = data.length;
    var idx;
    var seenCR = this._seenCR;
    var buf = this._buf;
    var ret;
    var bytesToAdd;
    var nhdrbytes = this._nhdrbytes;
    while (offset < len) {
        if (seenCR) {
            seenCR = false;
            if (data.charCodeAt(offset) === LF) {
                ++offset;
                ret = this._processHdrLine(buf);
                buf = '';
                if (typeof ret === 'object') {
                    this._err = ret;
                    this.execute(this._err);
                    return ret;
                } else if (ret === undefined) {
                    var state = this._state;
                    if (state !== STATE_HEADER) {
                        if (state < STATE_COMPLETE && offset < len) {
                            ret = this.execute(data.slice(offset));
                            if (typeof ret !== 'number') {
                                this._err = ret;
                                this.execute(this._err);
                                return ret;
                            }
                            return offset + ret;
                        } else if (state === STATE_COMPLETE)
                            this.reinitialize(this.type);
                        return offset;
                    }
                }
            } else {
                buf += '\r';
                ++nhdrbytes;
                if (nhdrbytes > MAX_HEADER_BYTES) {
                    this.execute = this._executeError;
                    this._err = new Error('Header size limit exceeded (' + MAX_HEADER_BYTES + ')');
                    this.execute(this._err);
                    return this._err;
                }
            }
        }
        var idx = data.indexOf(CRLF, offset);
        if (idx > -1) {
            bytesToAdd = idx - offset;
            if (bytesToAdd > 0) {
                nhdrbytes += bytesToAdd;
                if (nhdrbytes > MAX_HEADER_BYTES) {
                    this.execute = this._executeError;
                    this._err = new Error('Header size limit exceeded (' + MAX_HEADER_BYTES + ')');
                    this.execute(this._err);
                    return this._err;
                }
                buf += data.substring(offset, idx);
            }
            offset = idx + 2;
            ret = this._processHdrLine(buf);
            buf = '';
            if (typeof ret === 'object') {
                this._err = ret;
                this.execute(this._err);
                return ret;
            } else if (ret === undefined) {
                var state = this._state;
                if (state !== STATE_HEADER) {
                    if (state < STATE_COMPLETE && offset < len) {
                        ret = this.execute(data.slice(offset));
                        if (typeof ret !== 'number') {
                            this._err = ret;
                            this.execute(this._err);
                            return ret;
                        }
                        return offset + ret;
                    } else if (state === STATE_COMPLETE)
                        this.reinitialize(this.type);
                    return offset;
                }
            }
        } else {
            var end;
            if (data.charCodeAt(len - 1) === CR) {
                seenCR = true;
                end = len - 1;
            } else
                end = len;
            nhdrbytes += end - offset;
            if (nhdrbytes > MAX_HEADER_BYTES) {
                this.execute = this._executeError;
                this._err = new Error('Header size limit exceeded (' + MAX_HEADER_BYTES + ')');
                this.execute(this._err);
                return this._err;
            }
            buf += data.substring(offset, end);
            break;
        }
    }
    this._buf = buf;
    this._seenCR = seenCR;
    this._nhdrbytes = nhdrbytes;
    return len;
};
HTTPParser.prototype._executeError = function (err) {
    BK.Script.log(1, 0, '_executeError!err = ' + err.message);
    return this._err;
};
HTTPParser.prototype.execute = HTTPParser.prototype._executeHeader;
HTTPParser.prototype._needsEOF = function () {
    if (this.type === HTTPParser.REQUEST)
        return false;
    var status = this.statusCode;
    var flags = this._flags;
    if (status !== undefined && (status === 204 || status === 304 || parseInt(status / 100, 1) === 1) || flags & FLAG_SKIPBODY) {
        return false;
    }
    if ((flags & FLAG_CHUNKED) > 0 || this._contentLen != undefined)
        return false;
    return true;
};
HTTPParser.REQUEST = 0;
HTTPParser.RESPONSE = 1;
var hexcase = 0;
var b64pad = '';
var chrsz = 8;
function hex_md5(s) {
    return bin2hex(core_md5(str2bin(s), s.length * chrsz));
}
function b64_md5(s) {
    return bin2b64(core_md5(str2bin(s), s.length * chrsz));
}
function str_md5(s) {
    return bin2str(core_md5(str2bin(s), s.length * chrsz));
}
function hex_hmac_md5(key, data) {
    return bin2hex(core_hmac_md5(key, data));
}
function b64_hmac_md5(key, data) {
    return bin2b64(core_hmac_md5(key, data));
}
function str_hmac_md5(key, data) {
    return bin2str(core_hmac_md5(key, data));
}
function md5_vm_test() {
    return hex_md5('abc') == '900150983cd24fb0d6963f7d28e17f72';
}
function core_md5(x, len) {
    x[len >> 5] |= 128 << len % 32;
    x[(len + 64 >>> 9 << 4) + 14] = len;
    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;
    for (var i = 0; i < x.length; i += 16) {
        var olda = a;
        var oldb = b;
        var oldc = c;
        var oldd = d;
        a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
        d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
        c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
        b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
        a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
        d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
        c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
        b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
        a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
        d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
        c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
        b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
        a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
        d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
        c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
        b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
        a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
        d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
        c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
        b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
        a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
        d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
        c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
        b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
        a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
        d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
        c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
        b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
        a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
        d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
        c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
        b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
        a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
        d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
        c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
        b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
        a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
        d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
        c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
        b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
        a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
        d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
        c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
        b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
        a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
        d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
        c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
        b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
        a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
        d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
        c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
        b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
        a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
        d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
        c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
        b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
        a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
        d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
        c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
        b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
        a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
        d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
        c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
        b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
        a = safe_add(a, olda);
        b = safe_add(b, oldb);
        c = safe_add(c, oldc);
        d = safe_add(d, oldd);
    }
    return Array(a, b, c, d);
}
function md5_cmn(q, a, b, x, s, t) {
    return safe_add(rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
}
function md5_ff(a, b, c, d, x, s, t) {
    return md5_cmn(b & c | ~b & d, a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t) {
    return md5_cmn(b & d | c & ~d, a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t) {
    return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t) {
    return md5_cmn(c ^ (b | ~d), a, b, x, s, t);
}
function core_hmac_md5(key, data) {
    var bkey = str2bin(key);
    if (bkey.length > 16)
        bkey = core_md5(bkey, key.length * chrsz);
    var ipad = Array(16), opad = Array(16);
    for (var i = 0; i < 16; i++) {
        ipad[i] = bkey[i] ^ 909522486;
        opad[i] = bkey[i] ^ 1549556828;
    }
    var hash = core_md5(ipad.concat(str2bin(data)), 512 + data.length * chrsz);
    return core_md5(opad.concat(hash), 512 + 128);
}
function hex_sha1(s) {
    return bin2hex(core_sha1(str2bin(s), s.length * chrsz));
}
function b64_sha1(s) {
    return bin2b64(core_sha1(str2bin(s), s.length * chrsz));
}
function str_sha1(s) {
    return bin2str(core_sha1(str2bin(s), s.length * chrsz));
}
function hex_hmac_sha1(key, data) {
    return bin2hex(core_hmac_sha1(key, data));
}
function b64_hmac_sha1(key, data) {
    return bin2b64(core_hmac_sha1(key, data));
}
function str_hmac_sha1(key, data) {
    return bin2str(core_hmac_sha1(key, data));
}
function sha1_vm_test() {
    return hex_sha1('abc') == 'a9993e364706816aba3e25717850c26c9cd0d89d';
}
function core_sha1(x, len) {
    x[len >> 5] |= 128 << 24 - len % 32;
    x[(len + 64 >> 9 << 4) + 15] = len;
    var w = Array(80);
    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;
    var e = -1009589776;
    for (var i = 0; i < x.length; i += 16) {
        var olda = a;
        var oldb = b;
        var oldc = c;
        var oldd = d;
        var olde = e;
        for (var j = 0; j < 80; j++) {
            if (j < 16)
                w[j] = x[i + j];
            else
                w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
            var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)), safe_add(safe_add(e, w[j]), sha1_kt(j)));
            e = d;
            d = c;
            c = rol(b, 30);
            b = a;
            a = t;
        }
        a = safe_add(a, olda);
        b = safe_add(b, oldb);
        c = safe_add(c, oldc);
        d = safe_add(d, oldd);
        e = safe_add(e, olde);
    }
    return Array(a, b, c, d, e);
}
function sha1_ft(t, b, c, d) {
    if (t < 20)
        return b & c | ~b & d;
    if (t < 40)
        return b ^ c ^ d;
    if (t < 60)
        return b & c | b & d | c & d;
    return b ^ c ^ d;
}
function sha1_kt(t) {
    return t < 20 ? 1518500249 : t < 40 ? 1859775393 : t < 60 ? -1894007588 : -899497514;
}
function core_hmac_sha1(key, data) {
    var bkey = str2bin(key);
    if (bkey.length > 16)
        bkey = core_sha1(bkey, key.length * chrsz);
    var ipad = Array(16), opad = Array(16);
    for (var i = 0; i < 16; i++) {
        ipad[i] = bkey[i] ^ 909522486;
        opad[i] = bkey[i] ^ 1549556828;
    }
    var hash = core_sha1(ipad.concat(str2bin(data)), 512 + data.length * chrsz);
    return core_sha1(opad.concat(hash), 512 + 160);
}
function safe_add(x, y) {
    var lsw = (x & 65535) + (y & 65535);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return msw << 16 | lsw & 65535;
}
function rol(num, cnt) {
    return num << cnt | num >>> 32 - cnt;
}
function str2bin(str) {
    var bin = Array();
    var mask = (1 << chrsz) - 1;
    for (var i = 0; i < str.length * chrsz; i += chrsz)
        bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << 24 - i % 32;
    return bin;
}
function bin2str(bin) {
    var str = '';
    var mask = (1 << chrsz) - 1;
    for (var i = 0; i < bin.length * 32; i += chrsz)
        str += String.fromCharCode(bin[i >> 5] >>> 24 - i % 32 & mask);
    return str;
}
function bin2hex(binarray) {
    var hex_tab = hexcase ? '0123456789ABCDEF' : '0123456789abcdef';
    var str = '';
    for (var i = 0; i < binarray.length * 4; i++) {
        str += hex_tab.charAt(binarray[i >> 2] >> (3 - i % 4) * 8 + 4 & 15) + hex_tab.charAt(binarray[i >> 2] >> (3 - i % 4) * 8 & 15);
    }
    return str;
}
function bin2b64(binarray) {
    var tab = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var str = '';
    for (var i = 0; i < binarray.length * 4; i += 3) {
        var triplet = (binarray[i >> 2] >> 8 * (3 - i % 4) & 255) << 16 | (binarray[i + 1 >> 2] >> 8 * (3 - (i + 1) % 4) & 255) << 8 | binarray[i + 2 >> 2] >> 8 * (3 - (i + 2) % 4) & 255;
        for (var j = 0; j < 4; j++) {
            if (i * 8 + j * 6 > binarray.length * 32)
                str += b64pad;
            else
                str += tab.charAt(triplet >> 6 * (3 - j) & 63);
        }
    }
    return str;
}
var uri;
var uploadUrl;
var downloadUrl;
var sessionToken;
var authorization;
function sign() {
    var date = new Date();
    var time = date.getFullYear() + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + date.getDate();
    var now = parseInt(date.getTime() / 1000) - 1;
    var expired = now + 600;
    var signTime = now + ';' + expired;
    var extInfo = JSON.parse(GameStatusInfo.extInfo);
    var certInfo = extInfo.certInfo;
    var credentials = certInfo.credentials;
    var tmpSecretId = credentials.tmpSecretId;
    var tmpSecretKey = credentials.tmpSecretKey;
    sessionToken = credentials.sessionToken;
    uri = '/' + hex_md5(time) + GameStatusInfo.gameId + '_' + time + '.png';
    uploadUrl = certInfo.upLoadPrefUrl.replace(new RegExp('http://', 'gm'), '');
    downloadUrl = certInfo.downLoadPrefUrl;
    var signAlgorithm = 'sha1';
    var headerList = 'host;x-cos-storage-class';
    var signKey = hex_hmac_sha1(tmpSecretKey, signTime);
    var formatString = 'put' + '\n' + uri + '\n\nhost=' + uploadUrl + '&x-cos-storage-class=nearline\n';
    var stringToSign = signAlgorithm + '\n' + signTime + '\n' + hex_sha1(formatString) + '\n';
    var signature = hex_hmac_sha1(signKey, stringToSign);
    authorization = 'q-sign-algorithm=' + signAlgorithm + '&q-ak=' + tmpSecretId + '&q-sign-time=' + signTime + '&q-key-time=' + signTime + '&q-header-list=' + headerList + '&q-url-param-list=' + '' + '&q-signature=' + signature;
}
function request(buff, callback) {
    function onResponse(res, code) {
        callback(code, downloadUrl + uri);
    }
    var httpRequest = new BK.HttpUtil('https://' + uploadUrl + uri);
    httpRequest.setHttpMethod('put');
    httpRequest.setHttpHeader('host', uploadUrl);
    httpRequest.setHttpHeader('x-cos-storage-class', 'nearline');
    httpRequest.setHttpHeader('x-cos-security-token', sessionToken);
    httpRequest.setHttpHeader('authorization', authorization);
    httpRequest.setBodyCompatible(false);
    httpRequest.setHttpRawBody(buff);
    httpRequest.requestAsync(onResponse);
}
BK.FileUtil.uploadFromFile = function (path, callback) {
    var buff = BK.FileUtil.readFile(path);
    sign();
    request(buff, callback);
};
BK.FileUtil.uploadFromBuff = function (buff, callback) {
    sign();
    request(buff, callback);
};
BK.FileUtil.uploadFromNode = function (node, callback) {
    var shot = new BK.RenderTexture(BK.Director.screenPixelSize.width, BK.Director.screenPixelSize.height);
    BK.Render.renderToTexture(node, shot);
    shot.writeToDiskWithXY('GameSandBox://temp.png', node.position.x, node.position.y, node.contentSize.width, node.contentSize.height);
    var buff = BK.FileUtil.readFile('GameSandBox://temp.png');
    sign();
    request(buff, callback);
};
enGameHallSucc = 0;
eReqDataLenErr = 1000;
eReqMagicErr = 1001;
eReqFrontCmdErr = 1002;
eReqBackCmdErr = 1003;
eReqBackSrcErr = 1004;
eReqFromIdErr = 1005;
eSTDecryErr = 1006;
eReqDecryErr = 1007;
eSTExpire = 1008;
eSystmeErr = 1009;
eVerUnvalid = 1010;
eReqLimit = 1011;
eGetSvrErr = 1012;
eInitMemErr = 2001;
eQueryMemErr = 2002;
eUpdateMemErr = 2003;
eDelMemErr = 2004;
eGetConfigErr = 2005;
eNotifyCreateErr = 2006;
eGetRoomIdErr = 2007;
eCmdInvalid = 2008;
eRoomNotExist = 2009;
eInBlackList = 2010;
eMatchTimeOut = 2011;
eGetRoomErr = 3000;
eRoomStatusErr = 3001;
eIsNotCreator = 3002;
eIsNotInRoom = 3003;
eFlushTsErr = 3004;
eLogoutIdErr = 3005;
eIsNotInSvc = 3006;
eUsrOverFlow = 3007;
eRoomOverFlow = 3008;
eRoomIsExist = 3009;
eRmvUsrErr = 3010;
eLoginSysErr = 3011;
eUsrHasLoginErr = 3012;
eRoomIsFullErr = 3013;
eCreateRoomErr = 3014;
ePlayerHasJoin = 3015;
eUgcDataAnti = 3020, eFowardToClientErr = 4000;
eFowardToSvrErr = 4001;
function clone_(obj) {
    var o, i, j, k;
    if (typeof obj != 'object' || obj === null)
        return obj;
    if (obj instanceof Array) {
        o = [];
        i = 0;
        j = obj.length;
        for (; i < j; i++) {
            if (typeof obj[i] == 'object' && obj[i] != null) {
                o[i] = arguments.callee(obj[i]);
            } else {
                o[i] = obj[i];
            }
        }
    } else {
        o = {};
        for (i in obj) {
            if (typeof obj[i] == 'object' && obj[i] != null) {
                o[i] = arguments.callee(obj[i]);
            } else {
                o[i] = obj[i];
            }
        }
    }
    return o;
}
var DebugRecommandRoomSvrHost = '139.199.216.130';
var DebugRecommandRoomSvrPort = 10060;
var NormalRecommandRoomSvrHost = '139.199.216.128';
var NormalRecommandRoomSvrPort = 10060;
var TLVType = new Object();
TLVType.Int8 = 33;
TLVType.Uint8 = 34;
TLVType.Int16 = 33;
TLVType.Uint16 = 36;
TLVType.Int32 = 37;
TLVType.Uint32 = 38;
TLVType.Int64 = 39;
TLVType.Uint64 = 40;
TLVType.Byte = 41;
TLVType.Double = 42;
TLVType.Float = 43;
TLVType.Int8Repeated = 49;
TLVType.Uint8Repeated = 50;
TLVType.Int16Repeated = 51;
TLVType.Uint16Repeated = 52;
TLVType.Int32Repeated = 53;
TLVType.Uint32Repeated = 54;
TLVType.Int64Repeated = 55;
TLVType.Uint64Repeated = 56;
TLVType.ByteRepeated = 57;
TLVType.DoubleRepeated = 58;
TLVType.FloatRepeated = 59;
var fixedHeaderLen = 120;
var HeaderLen = 12;
var currentGameMode = GameStatusInfo.gameMode;
var fromPlatform = GameStatusInfo.platform;
var currentAioType = GameStatusInfo.aioType;
var currentPlayerOpenId = GameStatusInfo.openId;
var isMaster = GameStatusInfo.isMaster;
NETWORK_ENVIRONMENT_QQ_RELEASE = 0;
NETWORK_ENVIRONMENT_QQ_DEBUG = 1;
NETWORK_ENVIRONMENT_DEMO_DEV = 2;
CMSHOW_SRV_CMD_JOIN_ROOM = 'apollo_aio_game.join_room';
CMSHOW_SRV_CMD_QUIT_GAME = 'apollo_aio_game.quit_room';
CMSHOW_SRV_CMD_START_GAME = 'apollo_aio_game.start_game';
CMSHOW_SRV_CMD_CANCEL_GAME = 'apollo_aio_game.cancel_game_room';
CMSHOW_SRV_CMD_CUSTOM_GAME_LOGIC = 'apollo_game_openapi.custom_game_logic';
CMSHOW_SRV_GET_RANK_LIST = 'apollo_router_game.game_rank_linkcmd_get_fri_rank_for_engine';
CMSHOW_SC_CMD_STOP_GAME = 'sc.force_stop_game.local';
CMSHOW_SC_CMD_PUSH_MSG = 'sc.push_new_msg.local';
CMSHOW_CS_CMD_MINI_WND = 'cs.make_room_min.local';
CMSHOW_CS_CMD_CLOSE_WND = 'cs.close_room.local';
CMSHOW_CS_CMD_CREATE_ROOM = 'cs.create_room.local';
CMSHOW_CS_CMD_JOIN_ROOM = 'cs.join_room.local';
CMSHOW_CS_CMD_SEND_GAME_MSG = 'cs.send_game_msg.local';
CMSHOW_CS_CMD_GAME_TIPS = 'cs.game_tips.local';
CMSHOW_CS_CMD_GET_PLAYER_DRESS = 'cs.get_dress_path.local';
CMSHOW_CS_CMD_GAME_READY = 'cs.game_ready.local';
CMSHOW_CS_CMD_GAME_START = 'cs.game_start.local';
CMSHOW_CS_CMD_SAVE_RECOMM_VIP = 'cs.save_recommend_ip.local';
CMSHOW_CS_CMD_GET_SRV_IP_PORT = 'cs.get_server_ip_port.local';
CMSHOW_CS_CMD_CHECK_PUBACCOUNT_STATE = 'cs.check_pubAccount_state.local';
CMSHOW_CS_CMD_ENTER_PUBACCOUNT_CARD = 'cs.enter_pubAccount_card.local';
CMSHOW_CS_CMD_SHARE_PIC = 'cs.share_pic.local';
CMSHOW_CS_CMD_SHARE_IN_ARK = 'cs.share_game_in_ark.local';
CMSHOW_AIO_PAUSE = 'sc.aio_pause.local';
CMSHOW_AIO_RESUME = 'sc.aio_resume.local';
CMD_CMSHOW_GAME_ENTER_BACKGROUND = 'sc.game_enter_background.local';
CMD_CMSHOW_GAME_ENTER_FORGROUND = 'sc.game_enter_foreground.local';
CMD_CMSHOW_GAME_MAXIMIZE = 'sc.game_maximize.local';
CMD_CMSHOW_GAME_MINIMIZE = 'sc.game_minimize.local';
CMSHOW_CS_CMD_AUDIOROOM_ENTERN = 'cs.audioRoom_enter.local';
CMSHOW_CS_CMD_AUDIOROOM_EXIT = 'cs.audioRoom_exit.local';
CMSHOW_CS_CMD_AUDIOROOM_UPDATEUSERINFO = 'cs.audioRoom_update_userinfo.local';
CMSHOW_CS_CMD_AUDIOROOM_SET_MIC = 'cs.audioRoom_set_mic.local';
CMSHOW_CS_CMD_AUDIOROOM_SET_SPEAKER = 'cs.audioRoom_set_speaker.local';
CMSHOW_CS_CMD_AUDIOROOM_INIT = 'cs.audioRoom_init.local';
CMSHOW_CS_CMD_AUDIOROOM_DISCONNECT = 'cs.audioRoom_disconnect.local';
CMSHOW_CS_CMD_AUDIOROOM_CAMERASWITCH = 'cs.audioRoom_cameraswitch.local';
CMSHOW_CS_CMD_AUDIOROOM_SET_BEAUTY = 'cs.audioRoom_set_beauty.local';
CMSHOW_CS_CMD_AUDIOROOM_REQ_AUDIO_SESSION = 'cs.audioRoom_req_audio_session.local';
var currentRenderMode;
checkRenderMode = function () {
    if (currentRenderMode == 0) {
        BK.Script.renderMode = 1;
        currentRenderMode = 1;
    }
};
BK.QQ = function () {
    return new function () {
        this.gameCfg = clone_(GameStatusInfo);
        this.gameCfg.gameId = parseInt(this.gameCfg.gameId);
        this.gameCfg.gameMode = 0;
        GameStatusInfo.gameMode = 0;
        this.arkData = { 'modeWording': '' };
        this.setArkData = function (modeWording) {
            this.arkData.modeWording = modeWording;
        };
        if (this.gameCfg.roomId) {
            this.gameCfg.roomId = parseInt(this.gameCfg.roomId);
        }
        if (this.gameCfg.isMaster == 1) {
            this.gameCfg.isCreator = true;
        } else {
            this.gameCfg.isCreator = false;
        }
        this.delegate = {};
        this.ssoJoinRoomCallback;
        this.ssoJoinRoomCallbackPublic;
        BK.MQQ.SsoRequest.addListener(CMD_CMSHOW_GAME_ENTER_BACKGROUND, this, function () {
            var isAndroid = GameStatusInfo.platform == 'android' ? 1 : 2;
            if (isAndroid == 1) {
                BK.Director.tickerPause();
            }
        });
        BK.MQQ.SsoRequest.addListener(CMD_CMSHOW_GAME_ENTER_FORGROUND, this, function () {
            var isAndroid = GameStatusInfo.platform == 'android' ? 1 : 2;
            if (isAndroid == 1) {
                BK.Director.tickerResume();
            }
        });
        BK.MQQ.SsoRequest.addListener(CMD_CMSHOW_GAME_MINIMIZE, this, function () {
            var isAndroid = GameStatusInfo.platform == 'android' ? 1 : 2;
            if (isAndroid == 1) {
                BK.Script.renderMode = 0;
                renderTicker.paused = true;
                currentRenderMode = 0;
            }
        });
        BK.MQQ.SsoRequest.addListener(CMD_CMSHOW_GAME_MAXIMIZE, this, function () {
            var isAndroid = GameStatusInfo.platform == 'android' ? 1 : 2;
            if (isAndroid == 1) {
                BK.Script.renderMode = 1;
                renderTicker.paused = false;
                currentRenderMode = 1;
            }
        });
        this.qPayPurchase = function (gameOrientation, transparent, itemList, callback) {
            var cmd = 'cs.openWebViewWithoutUrl.local';
            var transparentNum = 1;
            if (transparent == true) {
                transparentNum = 1;
            } else {
                transparentNum = 0;
            }
            var data = {
                'gameOrientation': gameOrientation,
                'openId': GameStatusInfo.openId,
                'transparent': transparentNum,
                'businessType': 1,
                'itemList': itemList
            };
            if (callback) {
                var cbCmd = 'sc.apolloGameWebMessage.local';
                BK.MQQ.SsoRequest.removeListener(cbCmd, this);
                BK.MQQ.SsoRequest.addListener(cbCmd, this, function (errCode, cmd, data) {
                    if (errCode == 0) {
                        if (data.op && data.op == 'apolloGamePlatform.buyProps') {
                            callback(data.data.code, data.data);
                        }
                    }
                }.bind(this));
            }
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        this.consumeItems = function (itemList, callback) {
            var cmd = 'apollo_game_item.consume_game_items';
            var data = {
                'cmd': cmd,
                'from': GameStatusInfo.platform,
                'gameId': GameStatusInfo.gameId,
                'openId': GameStatusInfo.openId,
                'items': itemList
            };
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(cmd, this);
                BK.MQQ.SsoRequest.addListener(cmd, this, function (errCode, cmd, data) {
                    var succList = [];
                    var failList = [];
                    if (errCode == 0) {
                        succList = data.data.succList;
                        failList = data.data.failList;
                    }
                    callback(errCode, succList, failList);
                }.bind(this));
            }
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        this.rollbackGameItems = function (itemList, callback) {
            var cmd = 'apollo_game_item.rollback_game_items';
            var data = {
                'cmd': cmd,
                'from': GameStatusInfo.platform,
                'gameId': GameStatusInfo.gameId,
                'openId': GameStatusInfo.openId,
                'items': itemList
            };
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(cmd, this);
                BK.MQQ.SsoRequest.addListener(cmd, this, function (errCode, cmd, data) {
                    var succList = [];
                    var failList = [];
                    if (errCode == 0) {
                        succList = data.data.succList;
                        failList = data.data.failList;
                    }
                    callback(errCode, succList, failList);
                }.bind(this));
            }
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        this.shareToMQQ = function (title, summary, detailUrl, picUrl) {
            var cmd = 'cs.share_game_result.local';
            var data = {
                'cmd': cmd,
                'from': GameStatusInfo.platform,
                'gameId': GameStatusInfo.gameId,
                'openId': GameStatusInfo.openId,
                'gameVersion': GameStatusInfo.gameVersion,
                'roomId': GameStatusInfo.roomId,
                'title': title,
                'summary': summary,
                'detailUrl': detailUrl,
                'picUrl': picUrl
            };
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        this.scoreUpload = function (scoreData, callback, arkData) {
            var cmd = 'apollo_aio_game.report_user_score_3rd';
            var data = {
                'cmd': cmd,
                'from': GameStatusInfo.platform,
                'gameId': GameStatusInfo.gameId,
                'openId': GameStatusInfo.openId,
                'version': GameStatusInfo.gameVersion,
                'roomId': GameStatusInfo.roomId,
                'gData': scoreData
            };
            if (arkData) {
                data['arkData'] = arkData;
            }
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(cmd, this);
                BK.MQQ.SsoRequest.addListener(cmd, this, callback);
            }
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        this.getRoomUserScoreInfo = function (roomId, callback) {
            var cmd = 'apollo_aio_game.get_room_info_3rd';
            var data = {
                'cmd': cmd,
                'from': GameStatusInfo.platform,
                'gameId': GameStatusInfo.gameId,
                'version': GameStatusInfo.gameVersion,
                'roomId': roomId
            };
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(cmd, this);
                BK.MQQ.SsoRequest.addListener(cmd, this, callback);
            }
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        this.getUserGameinfo = function (openId, cycleType, callback) {
            var cmd = 'apollo_aio_game.get_user_gameinfo_3rd';
            var data = {
                'cmd': cmd,
                'from': GameStatusInfo.platform,
                'gameId': GameStatusInfo.gameId,
                'openId': GameStatusInfo.openId,
                'version': GameStatusInfo.gameVersion,
                'roomId': GameStatusInfo.roomId,
                'toOpenId': openId,
                'cycleNum': cycleType
            };
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(cmd, this);
                BK.MQQ.SsoRequest.addListener(cmd, this, callback);
            }
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        this.getUserCurrencyInfo = function (currencyType, callback) {
            var cmd = 'apollo_aio_game.get_user_curreInfo';
            var data = {
                'cmd': cmd,
                'from': GameStatusInfo.platform,
                'gameId': GameStatusInfo.gameId,
                'openId': GameStatusInfo.openId,
                'version': GameStatusInfo.gameVersion,
                'mask': currencyType
            };
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(cmd, this);
                BK.MQQ.SsoRequest.addListener(cmd, this, callback);
            }
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        this.getCmshowDressInfo = function (openId, callback) {
            var cmd = 'cs.get_dress_path.local';
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(cmd, this);
                BK.MQQ.SsoRequest.addListener(cmd, this, callback);
            }
            var data = { 'openId': openId };
            BK.MQQ.SsoRequest.send(data, 'cs.get_dress_path.local');
        };
        this.getGameItemList = function (callback) {
            var cmd = 'apollo_aio_game.get_game_itemList';
            var data = {
                'cmd': cmd,
                'from': GameStatusInfo.platform,
                'gameId': GameStatusInfo.gameId
            };
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(cmd, this);
                BK.MQQ.SsoRequest.addListener(cmd, this, callback);
            }
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        this.getUserGameItems = function (callback) {
            var cmd = 'apollo_aio_game.get_user_game_items';
            var data = {
                'cmd': cmd,
                'from': GameStatusInfo.platform,
                'gameId': GameStatusInfo.gameId,
                'openId': GameStatusInfo.openId
            };
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(cmd, this);
                BK.MQQ.SsoRequest.addListener(cmd, this, callback);
            }
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        this.buyGameItems = function (currencyType, items, callback) {
            var cmd = 'apollo_aio_game.buy_game_items';
            var data = {
                'cmd': cmd,
                'from': GameStatusInfo.platform,
                'gameId': GameStatusInfo.gameId,
                'curreType': currencyType,
                'itemIdList': items
            };
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(cmd, this);
                BK.MQQ.SsoRequest.addListener(cmd, this, callback);
            }
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        this.notifyNewRoom = function (roomId, retCode) {
            var data = {
                'gameId': this.gameCfg.gameId,
                'roomId': roomId,
                'retcode': retCode
            };
            if (!this.gameCfg.roomId) {
                this.gameCfg.roomId = roomId;
            }
            BK.Script.log(0, 0, 'BK.QQ.notifyNewRoom!gameId = ' + data.gameId + ', roomId = ' + data.roomId + ', retCode = ' + retCode);
            BK.MQQ.SsoRequest.send(data, CMSHOW_CS_CMD_CREATE_ROOM);
        };
        this.notifyHideGame = function () {
            var data = {
                'gameId': this.gameCfg.gameId,
                'roomId': this.gameCfg.roomId,
                'sessionId': Number(this.gameCfg.sessionId)
            };
            BK.Script.log(0, 0, 'BK.QQ.notifyHideGame!gameId = ' + data.gameId + ', roomId = ' + data.roomId + ', sessionId = ' + data.sessionId);
            var isAndroid = GameStatusInfo.platform == 'android' ? 1 : 2;
            if (isAndroid == 1) {
                BK.Script.renderMode = 0;
                currentRenderMode = 0;
            }
            BK.MQQ.SsoRequest.send(data, CMSHOW_CS_CMD_MINI_WND);
        };
        this.notifyCloseGame = function () {
            this._closeRoom();
            var data = {
                'gameId': this.gameCfg.gameId,
                'roomId': this.gameCfg.roomId,
                'sessionId': Number(this.gameCfg.sessionId)
            };
            BK.Script.log(0, 0, 'BK.QQ.notifyCloseGame!gameId = ' + data.gameId + ', roomId = ' + data.roomId + ', sessioinId = ' + data.sessionId);
            BK.MQQ.SsoRequest.send(data, CMSHOW_CS_CMD_CLOSE_WND);
        };
        this.notifyReadyGame = function () {
            var data = {
                'gameId': this.gameCfg.gameId,
                'roomId': this.gameCfg.roomId,
                'sessionId': Number(this.gameCfg.sessionId)
            };
            BK.MQQ.SsoRequest.send(data, CMSHOW_CS_CMD_GAME_READY);
        };
        this.notifyGameTips = function (tips) {
            var data = {
                'gameId': this.gameCfg.gameId,
                'roomId': this.gameCfg.roomId,
                'sessionId': Number(this.gameCfg.sessionId),
                'tips': tips
            };
            BK.MQQ.SsoRequest.send(data, CMSHOW_CS_CMD_GAME_TIPS);
        };
        this.notifyGameTipsWaiting = function () {
            this.notifyGameTips('等待玩家加入');
        };
        this.notifyGameTipsSomeOneJoinRoom = function (nick) {
            this.notifyGameTips(nick + '加入房间');
        };
        this.notifyGameTipsSomeOneLeaveRoom = function (nick) {
            this.notifyGameTips(nick + '离开房间');
        };
        this.notifyGameTipsReady = function () {
            this.notifyGameTips('游戏即将开始');
        };
        this.notifyGameTipsPlaying = function () {
            this.notifyGameTips('游戏进行中');
        };
        this.notifyGameTipsGameOver = function () {
            this.notifyGameTips('游戏已结束');
        };
        this.inviteFriend = function (wording, roomId) {
            var cmd = 'cs.invite_friends.local';
            var data = {
                cmd: cmd,
                wording: wording,
                gameId: this.gameCfg.gameId,
                gameMode: 8,
                extendInfo: {}
            };
            if (roomId) {
                data.roomId = roomId;
            }
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        this.uploadData = function (action, enter, result, param1, param2, param3) {
            var cmd = 'cs.report_data_2_compass.local';
            var gameId = this.gameCfg.gameId;
            if (this.gameCfg.platform == 'ios') {
                action = action.toString();
                result = result.toString();
            }
            var data = {
                'cmd': cmd,
                'actionName': action,
                'enter': enter,
                'result': result,
                'r2': gameId.toString(),
                'r3': param1,
                'r4': param2,
                'r5': param3
            };
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        this.sharePic = function (path) {
            var data = {
                'gameId': this.gameCfg.gameId,
                'roomId': this.gameCfg.roomId,
                'sessionId': Number(this.gameCfg.sessionId),
                'path': path
            };
            BK.MQQ.SsoRequest.send(data, CMSHOW_CS_CMD_SHARE_PIC);
        };
        this.addSSOJoinRoomCallBack = function (callback) {
            this.ssoJoinRoomCallbackPublic = callback;
        };
        this.checkPubAccountState = function (puin, callback) {
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(CMSHOW_CS_CMD_CHECK_PUBACCOUNT_STATE, this);
                BK.MQQ.SsoRequest.addListener(CMSHOW_CS_CMD_CHECK_PUBACCOUNT_STATE, this, callback);
            }
            var cmd = CMSHOW_CS_CMD_CHECK_PUBACCOUNT_STATE;
            var data = {
                'cmd': cmd,
                'puin': puin
            };
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        this.enterPubAccountCard = function (puin) {
            var cmd = CMSHOW_CS_CMD_ENTER_PUBACCOUNT_CARD;
            var data = {
                'cmd': cmd,
                'puin': puin
            };
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        this.fetchOpenKey = function (callback) {
            var cmd = 'cs.on_get_open_key.local';
            var data = { 'gameId': GameStatusInfo.gameId };
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(cmd, this);
                BK.MQQ.SsoRequest.addListener(cmd, this, callback);
            }
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        this.listenGameEventEnterBackground = function (obj, callback) {
            var cmd = 'sc.game_enter_background.local';
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(cmd, obj);
                BK.MQQ.SsoRequest.addListener(cmd, obj, callback);
            }
        };
        this.listenGameEventEnterForeground = function (obj, callback) {
            var cmd = 'sc.game_enter_foreground.local';
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(cmd, obj);
                BK.MQQ.SsoRequest.addListener(cmd, obj, callback);
            }
        };
        this.listenGameEventMaximize = function (obj, callback) {
            var cmd = 'sc.game_maximize.local';
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(cmd, obj);
                BK.MQQ.SsoRequest.addListener(cmd, obj, callback);
            }
        };
        this.listenGameEventMinimize = function (obj, callback) {
            var cmd = 'sc.game_minimize.local';
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(cmd, obj);
                BK.MQQ.SsoRequest.addListener(cmd, obj, callback);
            }
        };
        this._event4GetVIPInfo = function (errCode, cmd, data) {
            BK.Script.log(0, 0, 'BK.QQ._event4GetVIPInfo!errCode = ' + errCode + ' cmd = ' + cmd + ' data = ' + JSON.stringify(data));
            if (this.delegate.onGetVIPInfoEvent) {
                this.delegate.onGetVIPInfoEvent(errCode, cmd, data);
            }
            BK.MQQ.SsoRequest.removeListener(CMSHOW_CS_CMD_GET_SRV_IP_PORT, this);
        };
        this.notifyGetVIPInfo = function () {
            BK.MQQ.SsoRequest.send({}, CMSHOW_CS_CMD_GET_SRV_IP_PORT);
            BK.MQQ.SsoRequest.removeListener(CMSHOW_CS_CMD_GET_SRV_IP_PORT, this);
            BK.MQQ.SsoRequest.addListener(CMSHOW_CS_CMD_GET_SRV_IP_PORT, this, this._event4GetVIPInfo.bind(this));
        };
        this.notifySaveRecommVIP = function (ip, port) {
            BK.Script.log(0, 0, 'BK.QQ.notifySaveRecommVIP!ip = ' + ip + ', port = ' + port);
            var data = {
                'gameId': this.gameCfg.gameId,
                'roomId': this.game.roomId,
                'sessionId': Number(this.gameCfg.sessionId),
                'ip': ip,
                'port': port
            };
            BK.MQQ.SsoRequest.send(data, CMSHOW_CS_CMD_SAVE_RECOMM_VIP);
        };
        this._event4GetPlayerDress = function (errCode, cmd, data) {
            BK.Script.log(0, 0, 'BK.QQ._event4GetPlayerDress!errCode = ' + errCode + ', cmd = ' + cmd + ', data = ' + JSON.stringify(data));
            if (this.delegate.onGetPlayerDressEvent) {
                this.delegate.onGetPlayerDressEvent(errCode, cmd, data);
            }
            BK.MQQ.SsoRequest.removeListener(CMSHOW_CS_CMD_GET_PLAYER_DRESS, this);
        };
        this.notifyGetPlayerDress = function (openId) {
            var data = { 'openId': openId };
            BK.MQQ.SsoRequest.removeListener(CMSHOW_CS_CMD_GET_PLAYER_DRESS, this);
            BK.MQQ.SsoRequest.addListener(CMSHOW_CS_CMD_GET_PLAYER_DRESS, this, this._event4GetPlayerDress.bind(this));
            BK.MQQ.SsoRequest.send(data, CMSHOW_CS_CMD_GET_PLAYER_DRESS);
        };
        this._startGameLocal = function (retcode, resp) {
            var data = {
                'gameId': this.gameCfg.gameId,
                'roomId': this.gameCfg.roomId,
                'sessionId': Number(this.gameCfg.sessionId),
                'resp': resp,
                'retcode': retcode,
                'gameMode': this.gameCfg.gameMode
            };
            BK.MQQ.SsoRequest.send(data, CMSHOW_CS_CMD_GAME_START);
        };
        this.notifyJoinRoom = function (newJoinPlayers, resp, retCode) {
            if (newJoinPlayers && newJoinPlayers.length > 0) {
                newJoinPlayers.forEach(function (player) {
                    var isMine = player.openId == currentPlayerOpenId ? true : false;
                    BK.Script.log(1, 1, 'player.openid=' + player.openId + ' currentPlayerOpenId=' + currentPlayerOpenId);
                    var avRoomId = 0;
                    if (resp && resp.data && resp.data.avRoomId) {
                        avRoomId = resp.data.avRoomId;
                    }
                    var sdkAppId = 0;
                    if (resp && resp.data && resp.data.sdkAppId) {
                        sdkAppId = resp.data.sdkAppId;
                    }
                    var accountType = 0;
                    if (resp && resp.data && resp.data.accountType) {
                        accountType = resp.data.accountType;
                    }
                    var someOneJoinGame = {
                        'gameId': this.gameCfg.gameId,
                        'openId': player.openId,
                        'isCreator': this.gameCfg.isCreator && player.openId == currentPlayerOpenId ? 1 : 0,
                        'roomId': this.gameCfg.roomId,
                        'resp': resp,
                        'retcode': retCode,
                        'gameMode': this.gameCfg.gameMode,
                        'avRoomId': avRoomId,
                        'sdkAppId': sdkAppId,
                        'accountType': accountType,
                        'isMine': isMine,
                        'isDisableSendMsg': !this.isAutoSendJoinRoomNotify ? 1 : 0
                    };
                    BK.Script.log(0, 0, 'BK.QQ.notifyJoinroom isDisableSendMsg: ' + someOneJoinGame.isDisableSendMsg);
                    BK.MQQ.SsoRequest.send(someOneJoinGame, CMSHOW_CS_CMD_JOIN_ROOM);
                }, this);
            } else {
                BK.Script.log(0, 0, 'BK.QQ.notifyJoinRoom!newJoinPlayers data error');
            }
        };
        this.sendGameMsg = function () {
            if (this.gameCfg.roomId && this.gameCfg.roomId > 0) {
                var JoinGameMsg = {
                    'gameId': this.gameCfg.gameId,
                    'openId': GameStatusInfo.openId,
                    'roomId': this.gameCfg.roomId,
                    'gameMode': this.gameCfg.gameMode
                };
                BK.Script.log(0, 0, 'SendGameMsg : gameId=' + JoinGameMsg.gameId + '  openId=' + JoinGameMsg.openId + ' roomId=' + JoinGameMsg.roomId + '  gameMode=' + JoinGameMsg.gameMode);
                BK.MQQ.SsoRequest.send(JoinGameMsg, CMSHOW_CS_CMD_SEND_GAME_MSG);
            }
        };
        this.shareToArk = function (roomId, summary, picUrl, isSelectFriend, extendInfo) {
            var data = {
                'summary': summary,
                'picUrl': picUrl,
                'gameId': this.gameCfg.gameId,
                'roomId': roomId,
                'gameMode': this.gameCfg.gameMode,
                'isSelectFriend': isSelectFriend,
                'extendInfo': extendInfo
            };
            BK.Script.log(0, 0, 'ShareToArk summary=' + data.summary + ' roomId=' + data.roomId + '  gameMode=' + data.gameMode + 'picUrl=' + data.picUrl + '  gameId=' + data.gameId);
            BK.MQQ.SsoRequest.send(data, CMSHOW_CS_CMD_SHARE_IN_ARK);
        };
        this.shareToArkFromFile = function (roomId, summary, extendInfo, path) {
            BK.FileUtil.uploadFromFile(path, function (ret, url) {
                if (ret == 200) {
                    BK.QQ.shareToArk(roomId, summary, url, true, extendInfo);
                }
            });
        };
        this.shareToArkFromBuff = function (roomId, summary, extendInfo, buff) {
            BK.FileUtil.uploadFromBuff(node, function (ret, url) {
                if (ret == 200) {
                    BK.QQ.shareToArk(roomId, summary, url, true, extendInfo);
                }
            });
        };
        this.shareToArkFromNode = function (roomId, summary, extendInfo, node) {
            BK.FileUtil.uploadFromNode(node, function (ret, url) {
                if (ret == 200) {
                    BK.QQ.shareToArk(roomId, summary, url, true, extendInfo);
                }
            });
        };
        this._event4QuitGame = function (errCode, cmd, data) {
            BK.Script.log(0, 0, 'BK.QQ._event4QuitGame errCode = ' + errCode + ' cmd = ' + cmd + ' data = ' + JSON.stringify(data));
            if (this.delegate.onQuitGameEvent) {
                this.delegate.onQuitGameEvent(errCode, cmd, data);
            }
            BK.MQQ.SsoRequest.removeListener(CMSHOW_SRV_CMD_QUIT_GAME, this);
        };
        this._event4CancelGame = function (errCode, cmd, data) {
            BK.Script.log(0, 0, 'BK.QQ._event4CancelGame errCode = ' + errCode + ' cmd = ' + cmd + ' data = ' + JSON.stringify(data));
            if (this.delegate.onCancelGameEvent) {
                this.delegate.onCancelGameEvent(errCode, cmd, data);
            }
            BK.MQQ.SsoRequest.removeListener(CMSHOW_SRV_CMD_CANCEL_GAME, this);
        };
        this.notifyQuitGameSrv = function () {
            var data = {
                'cmd': CMSHOW_SRV_CMD_QUIT_GAME,
                'from': this.gameCfg.platform,
                'gameId': this.gameCfg.gameId,
                'roomId': this.gameCfg.roomId
            };
            BK.Script.log(0, 0, 'BK.QQ.notifyQuitGameSrv!' + ', cmd = ' + data.cmd + ', from = ' + data.from + ', gameId = ' + data.gameId + ', roomId = ' + data.roomId);
            BK.MQQ.SsoRequest.removeListener(CMSHOW_SRV_CMD_QUIT_GAME, this);
            BK.MQQ.SsoRequest.addListener(CMSHOW_SRV_CMD_QUIT_GAME, this, this._event4QuitGame.bind(this));
            BK.MQQ.SsoRequest.send(data, CMSHOW_SRV_CMD_QUIT_GAME);
        };
        this.notifyCancelGameSrv = function () {
            var data = {
                'cmd': CMSHOW_SRV_CMD_CANCEL_GAME,
                'from': this.gameCfg.platform,
                'gameId': this.gameCfg.gameId,
                'roomId': this.gameCfg.roomId
            };
            BK.Script.log(0, 0, 'BK.QQ.notifyCancelGameSrv!' + ', cmd = ' + data.cmd + ', from = ' + data.from + ', gameId = ' + data.gameId + ', roomId = ' + data.roomId);
            BK.MQQ.SsoRequest.removeListener(CMSHOW_SRV_CMD_CANCEL_GAME, this);
            BK.MQQ.SsoRequest.addListener(CMSHOW_SRV_CMD_CANCEL_GAME, this, this._event4CancelGame.bind(this));
            BK.MQQ.SsoRequest.send(data, CMSHOW_SRV_CMD_CANCEL_GAME);
        };
        this._event4StartGame = function (errCode, cmd, data) {
            BK.Script.log(0, 0, 'BK.QQ._event4StartGame! errCode = ' + errCode + ' cmd = ' + cmd + ' data = ' + JSON.stringify(data));
            this.hasStartGameSucc = errCode == 0 ? true : false;
            this._startGameLocal(errCode, data);
            if (this.delegate.onStartGameEvent) {
                this.delegate.onStartGameEvent(errCode, cmd, data);
            }
            BK.MQQ.SsoRequest.removeListener(CMSHOW_SRV_CMD_START_GAME, this);
        };
        this.notifyStartGameSrv = function () {
            var data = {
                'cmd': CMSHOW_SRV_CMD_START_GAME,
                'from': this.gameCfg.platform,
                'gameId': this.gameCfg.gameId,
                'roomId': this.gameCfg.roomId
            };
            BK.Script.log(0, 0, 'BK.QQ.notifyStartGameSrv!' + ', cmd = ' + data.cmd + ', from = ' + data.from + ', gameId = ' + data.gameId + ', roomId = ' + data.roomId);
            BK.MQQ.SsoRequest.removeListener(CMSHOW_SRV_CMD_START_GAME, this);
            BK.MQQ.SsoRequest.addListener(CMSHOW_SRV_CMD_START_GAME, this, this._event4StartGame.bind(this));
            BK.MQQ.SsoRequest.send(data, CMSHOW_SRV_CMD_START_GAME);
        };
        this._event4JoinRoom = function (errCode, cmd, data) {
            BK.Script.log(0, 0, 'BK.QQ._event4JoinRoom errCode = ' + errCode + ' cmd = ' + cmd + ' data = ' + JSON.stringify(data));
            if (this.delegate.onJoinRoomEvent) {
                this.delegate.onJoinRoomEvent(errCode, cmd, data);
            }
            this.hasJoinRoomSucc = errCode == 0 ? true : false;
            BK.QQ.notifyJoinRoom(this.newJoinPlayers, data, errCode);
            BK.MQQ.SsoRequest.removeListener(CMSHOW_SRV_CMD_JOIN_ROOM, this);
            if (this.ssoJoinRoomCallback) {
                this.ssoJoinRoomCallback(errCode, cmd, data);
            }
            if (this.ssoJoinRoomCallbackPublic) {
                data['gameId'] = this.gameCfg.gameId;
                data['gameRoomId'] = this.gameCfg.roomId;
                data['avRoomId'] = data.data.avRoomId ? data.data.avRoomId : 0, data['sdkAppId'] = data.data.sdkAppId ? data.data.sdkAppId : 0, data['accountType'] = data.data.accountType ? data.data.accountType : 0, this.ssoJoinRoomCallbackPublic(errCode, cmd, data);
            }
        };
        this.notifyNewOrJoinRoomSrv = function (newJoinPlayers, roomId, isCreator) {
            var data = {
                'cmd': CMSHOW_SRV_CMD_JOIN_ROOM,
                'from': this.gameCfg.platform,
                'aioType': this.gameCfg.aioType,
                'sessionId': Number(this.gameCfg.sessionId),
                'gameId': this.gameCfg.gameId,
                'version': this.gameCfg.gameVersion,
                'roomId': roomId,
                'opType': isCreator,
                'gameMode': this.gameCfg.gameMode,
                'roomVol': this.roomVol,
                'arkData': this.arkData
            };
            BK.Script.log(1, 1, 'BK.QQ.notifyNewOrJoinRoomSrv!' + ', cmd = ' + data.cmd + ', from = ' + data.from + ', aioType = ' + data.aioType + ', sessionId = ' + data.sessionId + ', gameId = ' + data.gameId + ', version = ' + data.version + ', roomId = ' + data.roomId + ', opType = ' + data.opType);
            this.newJoinPlayers = newJoinPlayers;
            BK.MQQ.SsoRequest.removeListener(CMSHOW_SRV_CMD_JOIN_ROOM, this);
            BK.MQQ.SsoRequest.addListener(CMSHOW_SRV_CMD_JOIN_ROOM, this, this._event4JoinRoom.bind(this));
            BK.MQQ.SsoRequest.send(data, CMSHOW_SRV_CMD_JOIN_ROOM);
        };
        this._customGameLogicCallBack = undefined;
        this._event4CustomLogic = function (errCode, cmd, data) {
            if (this._customGameLogicCallBack != undefined) {
                this._customGameLogicCallBack(errCode, cmd, data);
            }
            BK.MQQ.SsoRequest.removeListener(CMSHOW_SRV_CMD_CUSTOM_GAME_LOGIC, this);
        };
        this.reqCustomLogic = function (data, callback) {
            if (data != undefined) {
                this._customGameLogicCallBack = callback;
                BK.MQQ.SsoRequest.removeListener(CMSHOW_SRV_CMD_CUSTOM_GAME_LOGIC, this);
                BK.MQQ.SsoRequest.addListener(CMSHOW_SRV_CMD_CUSTOM_GAME_LOGIC, this, this._event4CustomLogic.bind(this));
                BK.MQQ.SsoRequest.send(data, CMSHOW_SRV_CMD_CUSTOM_GAME_LOGIC);
            } else {
                BK.Script.log(0, 0, 'reqCustomLogic data undefined!');
            }
        };
        this._getRankListLogicCallBack = undefined;
        this._event4GetRankList = function (errCode, cmd, data) {
            BK.Script.log(1, 1, 'BK.QQ.reqGetRankList! callback cmd' + cmd + ' errCode:' + errCode + '  data:' + JSON.stringify(data));
            if (this._getRankListLogicCallBack != undefined) {
                this._getRankListLogicCallBack(errCode, cmd, data);
            }
            BK.MQQ.SsoRequest.removeListener(CMSHOW_SRV_GET_RANK_LIST, this);
        };
        this.getRankList = function (callback, reqConfig) {
            var data = {
                'cmd': CMSHOW_SRV_GET_RANK_LIST,
                'from': 'default',
                'objType': 1,
                'objId': 0,
                'busType': 3,
                'busId': this.gameCfg.gameId.toString()
            };
            if (reqConfig) {
                if (reqConfig.objType) {
                    data.objType = reqConfig.objType;
                }
                if (reqConfig.objId) {
                    data.objId = reqConfig.objId;
                }
                if (reqConfig.from) {
                    data.from = reqConfig.from;
                }
            }
            BK.Script.log(1, 1, 'BK.QQ.reqGetRankList! ' + JSON.stringify(data));
            if (data != undefined) {
                this._getRankListLogicCallBack = callback;
                BK.MQQ.SsoRequest.removeListener(CMSHOW_SRV_GET_RANK_LIST, this);
                BK.MQQ.SsoRequest.addListener(CMSHOW_SRV_GET_RANK_LIST, this, this._event4GetRankList.bind(this));
                BK.MQQ.SsoRequest.send(data, CMSHOW_SRV_GET_RANK_LIST);
            } else {
                BK.Script.log(0, 0, 'reqGetRankList data undefined!');
            }
        };
        this.hasJoinRoom = function () {
            return this.hasJoinRoomSucc;
        };
        this.hasStartGame = function () {
            return this.hasStartGameSucc;
        };
        this._event4PushMsg = function (errCode, cmd, data) {
            BK.Script.log(0, 0, 'BK.QQ._event4PushMsg!errCode = ' + errCode + ' cmd = ' + cmd + ' data = ' + JSON.stringify(data));
            if (this.delegate.onPushMsgEvent) {
                this.delegate.onPushMsgEvent(errCode, cmd, data);
            }
        };
        this._event4StopGame = function (errCode, cmd, data) {
            BK.Script.log(0, 0, 'BK.QQ._event4StopGame!errCode = ' + errCode + ' cmd = ' + cmd + ' data = ' + JSON.stringify(data));
            this._closeRoom();
            if (this.delegate.onStopGameEvent) {
                this.delegate.onStopGameEvent(errCode, cmd, data);
            }
        };
        this._closeRoom = function (needSSOServer) {
            BK.QQ.isNeedSSOServer = needSSOServer != undefined && needSSOServer != null ? needSSOServer : true;
            if (Boolean(BK.QQ.isNeedSSOServer) == true) {
                if (!this.hasStartGameSucc) {
                    if (this.gameCfg.roomId && this.gameCfg.roomId != 0) {
                        if (this.gameCfg.isCreator) {
                            this.notifyCancelGameSrv();
                        } else {
                            this.notifyQuitGameSrv();
                        }
                    }
                }
            }
        };
        BK.MQQ.SsoRequest.addListener(CMSHOW_SC_CMD_PUSH_MSG, this, this._event4PushMsg.bind(this));
        BK.MQQ.SsoRequest.addListener(CMSHOW_SC_CMD_STOP_GAME, this, this._event4StopGame.bind(this));
    }();
}();
BK.Room = function () {
    this.roomId;
    this.gameId;
    this.mId;
    this.ownerId;
    this.createTs;
    this.status;
    this.playerNum;
    this.ip0;
    this.ip1;
    this.msgSeq = 1;
    this.ackSeq;
    this.lastFrame = 0;
    this.startGameTs = 0;
    this.createRoomCallBack;
    this.queryRoomInfoCallBack;
    this.joinRoomCallBack;
    this.leaveRoomCallBack;
    this.startGameCallBack;
    this.broadcastDataCallBack;
    this.sensitiveWordCallBack;
    this.setUserDataCallBack;
    this.getUserDataCallBack;
    this.sendSyncOptCallBack;
    this.forceStopGameCallBack;
    this.frameSyncListener;
    this.queryFrameDataCallBack;
    this.matchGameCallBack;
    this.queryMatchGameCallBack;
    this.quitMatchGameCallBack;
    this.disconnectNetCallBack;
    this.reJoinRoomCallBack;
    this.socket = new BK.Socket();
    this.reqArray = new Array();
    this.newJoinPlayers = [];
    this.currentPlayers = [];
    this.isCreator = GameStatusInfo.isMaster == 1 ? true : false;
    this.gameStatusInfo = GameStatusInfo;
    this.serverConnected;
    this._environment = GameStatusInfo.isWhiteUser;
    this.headerVersion = 769;
    this.recommandRoomSvrHost = NormalRecommandRoomSvrHost;
    this.recommandRoomSvrPort = NormalRecommandRoomSvrPort;
    this.netTimeOutTs = 0;
    this.options = null;
    this.setArkData = function (modeWording) {
        BK.QQ.setArkData(modeWording);
    };
    this.setRoomVol = function (roomVol) {
        BK.QQ.roomVol = roomVol;
    };
    this.read32BytesToString = function (buff) {
        var str = '';
        for (var i = 0; i < 32; i++) {
            var ch = buff.readUint8Buffer();
            str = str + String.fromCharCode(ch);
        }
        return str;
    };
    this.writeOpenIdIntoBuffer = function (buffer, openId) {
        var writeBuf = new BK.Buffer(32);
        if (openId.length == 32) {
            for (var i = 0; i < 32; i++) {
                var ascii = openId.charCodeAt(i);
                writeBuf.writeUint8Buffer(ascii);
            }
        } else {
            for (var i = 0; i < 32; i++) {
                writeBuf.writeUint8Buffer(0);
            }
            BK.Script.log(0, 0, 'writeOpenIdIntoBuffer.length is not 32 bytes,Write empty data');
        }
        buffer.writeBuffer(writeBuf);
    };
    this.addHeader = function (header, len, stLen) {
        header.writeUint16Buffer(4660);
        header.writeUint16Buffer(this.headerVersion);
        header.writeUint16Buffer(0);
        header.writeUint16Buffer(stLen);
        header.writeUint32Buffer(len);
    };
    this.addFixedHeader = function (buff, cmd, gameId, roomId, fromId, toId, token, appId, accessToken) {
        if (toId == undefined) {
            toId = '';
        }
        if (token == undefined) {
            token = 0;
        }
        if (appId == undefined) {
            appId = 0;
        }
        if (accessToken == undefined) {
            accessToken = 0;
        }
        buff.writeUint16Buffer(72);
        buff.writeUint16Buffer(cmd);
        buff.writeUint32Buffer(0);
        buff.writeUint64Buffer(1111);
        buff.writeUint64Buffer(gameId);
        buff.writeUint64Buffer(roomId);
        this.writeOpenIdIntoBuffer(buff, fromId);
        this.writeOpenIdIntoBuffer(buff, toId);
        buff.writeUint64Buffer(token);
        buff.writeUint64Buffer(appId);
        buff.writeUint64Buffer(accessToken);
    };
    this.getHeader = function (buff) {
        var magic = buff.readUint16Buffer();
        var ver = buff.readUint16Buffer();
        var seq = buff.readUint16Buffer();
        var stlen = buff.readUint16Buffer();
        var bodyLen = buff.readUint32Buffer();
        var header = new Object();
        header.magic = magic;
        header.ver = ver;
        header.stlen = stlen;
        header.bodyLen = bodyLen;
        header.seq = seq;
        return header;
    };
    this.getFixedHeader = function (buff) {
        var fixLen = buff.readUint16Buffer();
        var cmd = buff.readUint16Buffer();
        var ret = buff.readUint32Buffer();
        var date = buff.readUint64Buffer();
        var gameId = buff.readUint64Buffer();
        var roomId = buff.readUint64Buffer();
        var fromId = '';
        var toId = '';
        fromId = this.read32BytesToString(buff);
        toId = this.read32BytesToString(buff);
        var token = buff.readUint64Buffer();
        var appId = buff.readUint64Buffer();
        var accessToken = buff.readUint64Buffer();
        var fixHead = new Object();
        fixHead.fixLen = fixLen;
        fixHead.cmd = cmd;
        fixHead.ret = ret;
        fixHead.date = date;
        fixHead.gameId = gameId;
        fixHead.roomId = roomId;
        fixHead.fromId = fromId;
        fixHead.toId = toId;
        fixHead.token = token;
        fixHead.appId = appId;
        fixHead.accessToken = accessToken;
        return fixHead;
    };
    this.matchGame = function (gameId, openId, callback) {
        this.mId = openId;
        this.gameId = parseInt(gameId);
        BK.QQ.gameCfg.gameMode = 6;
        GameStatusInfo.gameMode = 6;
        var con = this.socket.connect(this.recommandRoomSvrHost, this.recommandRoomSvrPort);
        BK.Script.log(0, 0, 'socket con =' + con);
        if (con == -1) {
            BK.Script.log(0, 0, 'socket connect failed! ' + con);
        } else {
            this.serverConnected = 1;
        }
        this.matchGameCallBack = callback;
        var funObj = new Object();
        funObj.cmd = 36;
        funObj.arg0 = gameId;
        funObj.arg1 = openId;
        this.reqArray.push(funObj);
        BK.Script.log(0, 0, 'createRoom ');
    };
    this.requestMatch = function (gameId, openId) {
        BK.Script.log(0, 0, 'match game request in');
        var body = new BK.Buffer(fixedHeaderLen, 1);
        this.addFixedHeader(body, 36, gameId, 0, openId);
        var st = BK.Security.getST();
        BK.Security.encrypt(body);
        var stLen = st.bufferLength();
        var buff = new BK.Buffer(HeaderLen + body.bufferLength() + stLen, 1);
        this.addHeader(buff, body.bufferLength(), stLen);
        buff.writeBuffer(st);
        buff.writeBuffer(body);
        BK.Script.log(0, 0, 'match game request buffer : ' + buff.bufferLength() + ' body len:' + body.bufferLength());
        return buff;
    };
    this.queryMatchGame = function (gameId, openId, callback) {
        BK.Script.log(0, 0, 'queryMatchGame in ');
        this.mId = openId;
        this.gameId = parseInt(gameId);
        this.queryMatchGameCallBack = callback;
        var funObj = new Object();
        funObj.cmd = 38;
        funObj.arg0 = gameId;
        funObj.arg1 = openId;
        this.reqArray.push(funObj);
    };
    this.requestQueryMatch = function (gameId, openId) {
        BK.Script.log(0, 0, 'query match game request in');
        var body = new BK.Buffer(fixedHeaderLen, 1);
        this.addFixedHeader(body, 38, gameId, 0, openId);
        var st = BK.Security.getST();
        BK.Security.encrypt(body);
        var stLen = st.bufferLength();
        var buff = new BK.Buffer(HeaderLen + body.bufferLength() + stLen, 1);
        this.addHeader(buff, body.bufferLength(), stLen);
        buff.writeBuffer(st);
        buff.writeBuffer(body);
        BK.Script.log(0, 0, 'query match game request buffer : ' + buff.bufferLength() + ' body len:' + body.bufferLength());
        return buff;
    };
    this.quitMatchGame = function (gameId, openId, callback) {
        BK.Script.log(0, 0, 'quitMatchGame in ');
        this.mId = openId;
        this.gameId = parseInt(gameId);
        this.quitMatchGameCallBack = callback;
        var funObj = new Object();
        funObj.cmd = 40;
        funObj.arg0 = gameId;
        funObj.arg1 = openId;
        this.reqArray.push(funObj);
    };
    this.requestQuitMatch = function (gameId, openId) {
        BK.Script.log(0, 0, 'quit match game request in');
        var body = new BK.Buffer(fixedHeaderLen, 1);
        this.addFixedHeader(body, 40, gameId, 0, openId);
        var st = BK.Security.getST();
        BK.Security.encrypt(body);
        var stLen = st.bufferLength();
        var buff = new BK.Buffer(HeaderLen + body.bufferLength() + stLen, 1);
        this.addHeader(buff, body.bufferLength(), stLen);
        buff.writeBuffer(st);
        buff.writeBuffer(body);
        BK.Script.log(0, 0, 'quit match game request buffer : ' + buff.bufferLength() + ' body len:' + body.bufferLength());
        return buff;
    };
    this.createRoom = function (gameId, openId, callback) {
        this.mId = openId;
        this.gameId = parseInt(gameId);
        if (this.serverConnected != 1) {
            var con = this.socket.connect(this.recommandRoomSvrHost, this.recommandRoomSvrPort);
            BK.Script.log(0, 0, 'socket con =' + con);
            if (con == -1) {
                BK.Script.log(0, 0, 'socket connect failed! ' + con);
            } else {
                this.serverConnected = 1;
            }
        }
        this.createRoomCallBack = callback;
        var funObj = new Object();
        funObj.cmd = 6;
        funObj.arg0 = gameId;
        funObj.arg1 = openId;
        this.reqArray.push(funObj);
        BK.Script.log(0, 0, 'createRoom ');
    };
    this.requestCreateRoom = function (gameId, openId) {
        BK.Script.log(0, 0, 'create room request in');
        var body = new BK.Buffer(fixedHeaderLen, 1);
        this.addFixedHeader(body, 6, gameId, 0, openId);
        var st = BK.Security.getST();
        BK.Security.encrypt(body);
        var stLen = st.bufferLength();
        var buff = new BK.Buffer(HeaderLen + body.bufferLength() + stLen, 1);
        this.addHeader(buff, body.bufferLength(), stLen);
        buff.writeBuffer(st);
        buff.writeBuffer(body);
        BK.Script.log(0, 0, 'create room request buffer : ' + buff.bufferLength() + ' body len:' + body.bufferLength());
        return buff;
    };
    this.requestQueryRoom = function () {
        var body = new BK.Buffer(fixedHeaderLen, 1);
        this.addFixedHeader(body, 10, this.gameId, this.roomId, this.mId);
        var st = BK.Security.getST();
        BK.Security.encrypt(body);
        var stlen = st.bufferLength();
        var buff = new BK.Buffer(HeaderLen + body.bufferLength() + stlen, 1);
        this.addHeader(buff, body.bufferLength(), stlen);
        buff.writeBuffer(st);
        buff.writeBuffer(body);
        return buff;
    };
    this.queryRoom = function (gameId, roomId, fromId, callback) {
        this.mId = fromId;
        this.roomId = parseFloat(roomId);
        this.gameId = parseInt(gameId);
        ;
        this.queryRoomInfoCallBack = callback;
        var funObj = new Object();
        funObj.cmd = 10;
        this.reqArray.push(funObj);
        BK.Script.log(0, 0, 'queryRoom push');
    };
    this.joinRoom = function (src, callback, notify, needSSOServer) {
        this.joinRoomCallBack = callback;
        BK.QQ.isNeedSSOServer = needSSOServer != undefined && needSSOServer != null ? needSSOServer : true;
        BK.QQ.isAutoSendJoinRoomNotify = notify != undefined && notify != null ? notify : true;
        BK.Script.log(0, 0, 'BK.QQ.notifyJoinroom isDisableSendMsg   isAuto: ' + notify + ',isAutoSendJoin:  ' + BK.QQ.isAutoSendJoinRoomNotify);
        var funObj = new Object();
        funObj.cmd = 2;
        funObj.arg0 = src;
        this.reqArray.push(funObj);
    };
    this.requestJoinRoom = function (src) {
        BK.Script.log(0, 0, 'join room request');
        var body = new BK.Buffer(fixedHeaderLen + 5, 1);
        this.addFixedHeader(body, 2, this.gameId, this.roomId, this.mId);
        var tlv = new BK.TLV(5);
        tlv.bkJSTLVWriteUInt8(src, TLVType.Uint8, 201);
        body.writeBuffer(tlv.bkJSTLVGetBuffer());
        var st = BK.Security.getST();
        BK.Security.encrypt(body);
        var stlen = st.bufferLength();
        var buff = new BK.Buffer(HeaderLen + body.bufferLength() + stlen, 1);
        this.addHeader(buff, body.bufferLength(), stlen);
        buff.writeBuffer(st);
        buff.writeBuffer(body);
        return buff;
    };
    this.setReJoinRoomCallBack = function (callback) {
        this.reJoinRoomCallBack = callback;
    };
    this.reConnectAndJoinRoom = function () {
        var con = this.socket.connect(this.gameSvrIp, this.gameSvrPort);
        BK.Script.log(0, 0, 'socket con =' + con);
        if (con == -1) {
            BK.Script.log(0, 0, 'socket connect failed! ' + con);
            return -1;
        } else {
            this.serverConnected = 1;
        }
        if (con == 0) {
            BK.Script.log(0, 0, 'socket connect =0 ');
        }
        if (con >= 0) {
            BK.Script.log(0, 0, 'rejoinroom send');
            this.joinRoom(1, function (statusCode, room) {
                BK.Script.log(0, 0, 'rejoinroom statusCode:' + statusCode + ' roomid is ' + room.roomId);
                if (this.reJoinRoomCallBack) {
                    this.reJoinRoomCallBack(statusCode, this);
                }
            });
        }
    };
    this.leaveRoom = function (callback, reason) {
        if (reason == undefined) {
            reason = -1;
        }
        ;
        var funObj = new Object();
        funObj.cmd = 4;
        funObj.arg0 = reason;
        this.reqArray.push(funObj);
        this.leaveRoomCallBack = callback;
        BK.Script.log(0, 0, 'leaveRoom push');
    };
    this.setLeaveRoomCallback = function (callback) {
        this.leaveRoomCallBack = callback;
    };
    this.requestLeaveRoom = function (reason) {
        var tlv = new BK.TLV(40 + 4);
        var buf = new BK.Buffer(40, 1);
        this.writeOpenIdIntoBuffer(buf, this.mId);
        buf.writeUint64Buffer(reason);
        tlv.bkJSTLVWriteBuffer(buf, TLVType.Byte, 201);
        var body = new BK.Buffer(fixedHeaderLen + tlv.bkJSTLVGetLength(), 1);
        this.addFixedHeader(body, 4, this.gameId, this.roomId, this.mId);
        body.writeBuffer(tlv.bkJSTLVGetBuffer());
        var st = BK.Security.getST();
        var stlen = st.bufferLength();
        ;
        BK.Security.encrypt(body);
        buff = new BK.Buffer(HeaderLen + body.bufferLength() + stlen, 1);
        this.addHeader(buff, body.bufferLength(), stlen);
        buff.writeBuffer(st);
        buff.writeBuffer(body);
        BK.Script.log(0, 0, 'leave room buffer : ' + buff.bufferLength() + ' body len:' + body.bufferLength());
        return buff;
    };
    this.startGame = function (callback) {
        this.startGameCallBack = callback;
        var funObj = new Object();
        funObj.cmd = 8;
        this.reqArray.push(funObj);
        BK.Script.log(0, 0, 'startGame push');
    };
    this.setStartGameCallback = function (callback) {
        this.startGameCallBack = callback;
    };
    this.requestStartGame = function () {
        var body = new BK.Buffer(fixedHeaderLen, 1);
        this.addFixedHeader(body, 8, this.gameId, this.roomId, this.mId);
        var st = BK.Security.getST();
        BK.Security.encrypt(body);
        var stlen = st.bufferLength();
        var buff = new BK.Buffer(HeaderLen + body.bufferLength() + stlen, 1);
        this.addHeader(buff, body.bufferLength(), stlen);
        buff.writeBuffer(st);
        buff.writeBuffer(body);
        return buff;
    };
    this.setBroadcastDataCallBack = function (callback) {
        this.broadcastDataCallBack = callback;
    };
    this.sendBroadcastData = function (buff) {
        var funObj = new Object();
        funObj.cmd = 1;
        funObj.arg0 = buff;
        this.reqArray.push(funObj);
    };
    this.requestsendBroadcastData = function (buf) {
        var bufLen = buf.capacity ? buf.capacity : buf.bufferLength();
        var body = new BK.Buffer(fixedHeaderLen + bufLen, 1);
        this.addFixedHeader(body, 1, this.gameId, this.roomId, this.mId);
        body.writeBuffer(buf);
        var st = BK.Security.getST();
        BK.Security.encrypt(body);
        var stlen = st.bufferLength();
        var buff = new BK.Buffer(HeaderLen + body.bufferLength() + stlen, 1);
        this.addHeader(buff, body.bufferLength(), stlen);
        buff.writeBuffer(st);
        buff.writeBuffer(body);
        return buff;
    };
    this.setSensitiveWordCallBack = function (callback) {
        this.sensitiveWordCallBack = callback;
    };
    this.sendSensitiveWordData = function (buff) {
        var funObj = new Object();
        funObj.cmd = 50;
        funObj.arg0 = buff;
        this.reqArray.push(funObj);
    };
    this.requestSendSendSensitiveWordData = function (buf) {
        var bufLen = buf.capacity ? buf.capacity : buf.bufferLength();
        var body = new BK.Buffer(fixedHeaderLen + bufLen, 1);
        this.addFixedHeader(body, 50, this.gameId, this.roomId, this.mId);
        body.writeBuffer(buf);
        var st = BK.Security.getST();
        BK.Security.encrypt(body);
        var stlen = st.bufferLength();
        var buff = new BK.Buffer(HeaderLen + body.bufferLength() + stlen, 1);
        this.addHeader(buff, body.bufferLength(), stlen);
        buff.writeBuffer(st);
        buff.writeBuffer(body);
        return buff;
    };
    this.setUserData = function (buff, callback) {
        BK.Script.log(0, 0, 'setUserData call');
        this.setUserDataCallBack = callback;
        var funObj = new Object();
        funObj.cmd = 32;
        funObj.arg0 = buff;
        this.reqArray.push(funObj);
        BK.Script.log(0, 0, 'setUserData push');
    };
    this.requestSetUserData = function (buf) {
        var bufLen = buf.capacity ? buf.capacity : buf.bufferLength();
        var body = new BK.Buffer(fixedHeaderLen + bufLen, 1);
        this.addFixedHeader(body, 32, this.gameId, this.roomId, this.mId);
        body.writeBuffer(buf);
        var st = BK.Security.getST();
        BK.Security.encrypt(body);
        var stlen = st.bufferLength();
        var buff = new BK.Buffer(HeaderLen + body.bufferLength() + stlen, 1);
        this.addHeader(buff, body.bufferLength(), stlen);
        buff.writeBuffer(st);
        buff.writeBuffer(body);
        return buff;
    };
    this.getUserData = function (roomId, callback) {
        if (roomId == undefined) {
            roomId = 0;
        }
        this.getUserDataCallBack = callback;
        var funObj = new Object();
        funObj.cmd = 34;
        funObj.arg0 = roomId;
        this.reqArray.push(funObj);
        BK.Script.log(0, 0, 'getUserData push roomId = ' + roomId);
    };
    this.requestGetUserData = function (roomId) {
        var body = new BK.Buffer(fixedHeaderLen, 1);
        this.addFixedHeader(body, 34, this.gameId, this.roomId, this.mId);
        var st = BK.Security.getST();
        BK.Security.encrypt(body);
        var stlen = st.bufferLength();
        var buff = new BK.Buffer(HeaderLen + body.bufferLength() + stlen, 1);
        this.addHeader(buff, body.bufferLength(), stlen);
        buff.writeBuffer(st);
        buff.writeBuffer(body);
        return buff;
    };
    this.syncOpt = function (statusBuf, optBuf, extendBuf, itemListBuf, callback) {
        this.sendSyncOptCallBack = callback;
        var funObj = new Object();
        ;
        funObj.cmd = 14;
        funObj.arg0 = statusBuf;
        funObj.arg1 = optBuf;
        funObj.arg2 = extendBuf;
        funObj.arg3 = itemListBuf;
        this.reqArray.push(funObj);
    };
    this.sendSyncOpt = function (opt, callback) {
        var status = new BK.Buffer(1, 1);
        status.writeUint8Buffer(0);
        var extend = new BK.Buffer(1, 1);
        extend.writeUint8Buffer(0);
        this.syncOpt(status, opt, extend, undefined, callback);
    };
    this.requestSyncOpt = function (statusBuf, optBuf, extendBuf, itemListBuf) {
        var statusBufLen = statusBuf.capacity ? statusBuf.capacity : statusBuf.bufferLength();
        var optBufLen = optBuf.capacity ? optBuf.capacity : optBuf.bufferLength();
        var extendBufLen = extendBuf.capacity ? extendBuf.capacity : extendBuf.bufferLength();
        var sendTlvLen = 8 + 8 + 4 + statusBufLen + 4 + optBufLen + 4 + extendBufLen;
        if (itemListBuf) {
            var itemListBufLen = itemListBuf.capacity ? itemListBuf.capacity : itemListBuf.bufferLength();
            sendTlvLen = sendTlvLen + 4 + itemListBufLen;
            BK.Script.log(0, 0, 'requestSyncOpt with item len' + itemListBufLen);
        }
        var tlv = new BK.TLV(sendTlvLen);
        tlv.bkJSTLVWriteUInt32(this.msgSeq, TLVType.Uint32, 201);
        tlv.bkJSTLVWriteUInt32(this.lastFrame, TLVType.Uint32, 202);
        tlv.bkJSTLVWriteBuffer(statusBuf, TLVType.Byte, 203);
        tlv.bkJSTLVWriteBuffer(optBuf, TLVType.Byte, 204);
        tlv.bkJSTLVWriteBuffer(extendBuf, TLVType.Byte, 205);
        if (itemListBuf) {
            tlv.bkJSTLVWriteBuffer(itemListBuf, TLVType.Byte, 206);
        }
        BK.Script.log(0, 0, 'requestSyncOpt this.msgSeq:' + this.msgSeq + ' this.lastFrame:' + this.lastFrame);
        var res = tlv.bkJSParseTLV();
        BK.Script.log(0, 0, 'requestSyncOpt tlv len:' + tlv.bkJSTLVGetLength() + ' fix header:' + fixedHeaderLen);
        var body = new BK.Buffer(fixedHeaderLen + tlv.bkJSTLVGetLength(), 1);
        this.addFixedHeader(body, 14, this.gameId, this.roomId, this.mId);
        body.writeBuffer(tlv.bkJSTLVGetBuffer());
        var st = BK.Security.getST();
        BK.Security.encrypt(body);
        var stlen = st.bufferLength();
        var buff = new BK.Buffer(HeaderLen + body.bufferLength() + stlen, 1);
        this.addHeader(buff, body.bufferLength(), stlen);
        buff.writeBuffer(st);
        buff.writeBuffer(body);
        this.msgSeq += 1;
        return buff;
    };
    this.setFrameSyncListener = function (listener) {
        this.frameSyncListener = listener;
    };
    this.queryFrameData = function (beginFrame, count, callback) {
        this.queryFrameDataCallBack = callback;
        var funObj = new Object();
        funObj.cmd = 18;
        funObj.arg0 = beginFrame;
        funObj.arg1 = count;
        this.reqArray.push(funObj);
    };
    this.requestQueryFrameData = function (beginFrame, count) {
        var tlv = new BK.TLV(8 + 8 + 6);
        tlv.bkJSTLVWriteUInt32(this.lastFrame, TLVType.Uint32, 201);
        tlv.bkJSTLVWriteUInt32(beginFrame, TLVType.Uint32, 202);
        tlv.bkJSTLVWriteUInt16(count, TLVType.Uint16, 203);
        var body = new BK.Buffer(fixedHeaderLen + tlv.bkJSTLVGetLength(), 1);
        this.addFixedHeader(body, 18, this.gameId, this.roomId, this.mId);
        body.writeBuffer(tlv.bkJSTLVGetBuffer());
        var st = BK.Security.getST();
        BK.Security.encrypt(body);
        var stlen = st.bufferLength();
        var buff = new BK.Buffer(HeaderLen + body.bufferLength() + stlen, 1);
        this.addHeader(buff, body.bufferLength(), stlen);
        buff.writeBuffer(st);
        buff.writeBuffer(body);
        return buff;
    };
    this.sendControlCommand = function (subcmd, data, openKey, callback) {
        var funObj = new Object();
        funObj.cmd = 48;
        funObj.arg0 = subcmd;
        funObj.arg1 = data;
        funObj.arg2 = openKey;
        this.reqArray.push(funObj);
        this.controlCommandCallback = callback;
    };
    this.requestControlCommand = function (subcmd, data, openkey) {
        var tlv = new BK.TLV(14 + data.bufferLength() + openkey.bufferLength());
        tlv.bkJSTLVWriteBuffer(data, TLVType.Byte, 201);
        tlv.bkJSTLVWriteUInt16(subcmd, TLVType.Uint16, 202);
        tlv.bkJSTLVWriteBuffer(openkey, TLVType.Byte, 203);
        var body = new BK.Buffer(fixedHeaderLen + tlv.bkJSTLVGetLength(), 1);
        this.addFixedHeader(body, 48, this.gameId, this.roomId, this.mId);
        body.writeBuffer(tlv.bkJSTLVGetBuffer());
        BK.Security.encrypt(body);
        var st = BK.Security.getST();
        var stlen = st.bufferLength();
        var buffer = new BK.Buffer(HeaderLen + body.bufferLength() + stlen, 1);
        this.addHeader(buffer, body.bufferLength(), stlen);
        buffer.writeBuffer(st);
        buffer.writeBuffer(body);
        return buffer;
    };
    this.sendKeepAlive = function () {
        var funObj = new Object();
        funObj.cmd = 12;
        this.reqArray.push(funObj);
        if (this.netTimeOutTs != 0) {
            var now = BK.Time.timestamp;
            var netCost = now - this.netTimeOutTs;
            if (netCost > 5) {
                if (this.disconnectNetCallBack) {
                    this.disconnectNetCallBack();
                }
            }
        } else {
        }
    };
    this.requestSendKeepAlive = function () {
        var body = new BK.Buffer(fixedHeaderLen, 1);
        this.addFixedHeader(body, 12, this.gameId, this.roomId, this.mId);
        var st = BK.Security.getST();
        BK.Security.encrypt(body);
        var stlen = st.bufferLength();
        ;
        var buff = new BK.Buffer(HeaderLen + body.bufferLength() + stlen, 1);
        this.addHeader(buff, body.bufferLength(), stlen);
        buff.writeBuffer(st);
        buff.writeBuffer(body);
        return buff;
    };
    this.recvCreateRoom = function (buff, bodyLen) {
        BK.Script.log(0, 0, 'recvCreateRoom bodyLen=' + bodyLen);
        var tlvBuff = buff.readBuffer(bodyLen);
        var tlv = new BK.TLV(tlvBuff);
        var res = tlv.bkJSParseTLV();
        if (res) {
            var buffer = res.tag202;
            var ipType = buffer.readUint8Buffer();
            var resServe = buffer.readUint8Buffer();
            var port = buffer.readUint16Buffer();
            buffer.readUint64Buffer();
            buffer.readUint32Buffer();
            var ip0 = buffer.readUint8Buffer();
            var ip1 = buffer.readUint8Buffer();
            var ip2 = buffer.readUint8Buffer();
            var ip3 = buffer.readUint8Buffer();
            var buffer2 = res.tag201;
            var ipType2 = buffer2.readUint8Buffer();
            var resServe2 = buffer2.readUint8Buffer();
            var port2 = buffer2.readUint16Buffer();
            buffer2.readUint64Buffer();
            buffer2.readUint32Buffer();
            var ip0_2 = buffer2.readUint8Buffer();
            var ip1_2 = buffer2.readUint8Buffer();
            var ip2_2 = buffer2.readUint8Buffer();
            var ip3_2 = buffer2.readUint8Buffer();
            var netAddr = new Object();
            netAddr.ipType_1 = ipType;
            netAddr.resServe_1 = resServe;
            netAddr.ipType_2 = ipType2;
            netAddr.resServe_2 = resServe2;
            netAddr.port_1 = port;
            netAddr.ip_1 = ip0 + '.' + ip1 + '.' + ip2 + '.' + ip3;
            netAddr.port_2 = port2;
            netAddr.ip_2 = ip0_2 + '.' + ip1_2 + '.' + ip2_2 + '.' + ip3_2;
            this.ip0 = netAddr.ip_1;
            this.ip1 = netAddr.ip_2;
            return netAddr;
        } else {
            BK.Script.log(0, 0, 'recvCreateRoom parse failed.');
            return undefined;
        }
    };
    this.recvQueryRoom = function (buff, bodyLen) {
        BK.Script.log(0, 0, 'recvQueryRoom bodyLen:' + bodyLen);
        var tlvBuff = buff.readBuffer(bodyLen);
        var tlv = new BK.TLV(tlvBuff);
        var res = tlv.bkJSParseTLV();
        if (res) {
            var buffer = res.tag202;
            var ipType = buffer.readUint8Buffer();
            var resServe = buffer.readUint8Buffer();
            var port = buffer.readUint16Buffer();
            buffer.readUint64Buffer();
            buffer.readUint32Buffer();
            var ip0 = buffer.readUint8Buffer();
            var ip1 = buffer.readUint8Buffer();
            var ip2 = buffer.readUint8Buffer();
            var ip3 = buffer.readUint8Buffer();
            var buffer2 = res.tag201;
            var ipType2 = buffer2.readUint8Buffer();
            var resServe2 = buffer2.readUint8Buffer();
            var port2 = buffer2.readUint16Buffer();
            buffer2.readUint64Buffer();
            buffer2.readUint32Buffer();
            var ip0_2 = buffer2.readUint8Buffer();
            var ip1_2 = buffer2.readUint8Buffer();
            var ip2_2 = buffer2.readUint8Buffer();
            var ip3_2 = buffer2.readUint8Buffer();
            var buffer3 = res.tag203;
            var ownerId = this.read32BytesToString(buffer3);
            var createTs = buffer3.readUint64Buffer();
            var status = buffer3.readUint8Buffer();
            var playerNum = buffer3.readUint8Buffer();
            var ext_num = res.tag205;
            if (ext_num == undefined) {
                ext_num = 0;
            }
            var players = [];
            for (var i = 0; i < playerNum; i++) {
                var player = {};
                player.uid = this.read32BytesToString(buffer3);
                ;
                player.status = buffer3.readUint8Buffer();
                ;
                players.push(player);
            }
            var roomInfo = new Object();
            roomInfo.ipType_1 = ipType;
            roomInfo.resServe_1 = resServe;
            roomInfo.ipType_2 = ipType2;
            roomInfo.resServe_2 = resServe2;
            roomInfo.port_1 = port;
            roomInfo.ip_1 = ip0 + '.' + ip1 + '.' + ip2 + '.' + ip3;
            roomInfo.port_2 = port2;
            roomInfo.ip_2 = ip0_2 + '.' + ip1_2 + '.' + ip2_2 + '.' + ip3_2;
            roomInfo.ownerId = ownerId;
            roomInfo.createTs = createTs;
            roomInfo.status = status;
            roomInfo.playerNum = playerNum;
            roomInfo.ext_num = ext_num;
            this.ip0 = roomInfo.ip_1;
            this.ip1 = roomInfo.ip_2;
            this.ownerId = ownerId;
            this.createTs = createTs;
            this.status = status;
            this.playerNum = playerNum;
            this.players = players;
            return roomInfo;
        } else {
            BK.Script.log(0, 0, 'recvQueryRoom parse failed.bodyLen is 0');
            return undefined;
        }
    };
    this.recvJoinRoom = function (buff, bodyLen) {
        var tlvBuff = buff.readBuffer(bodyLen);
        var tlv = new BK.TLV(tlvBuff);
        var res = tlv.bkJSParseTLV();
        var buffer = res.tag201;
        var ownerId = this.read32BytesToString(buffer);
        var createTs = buffer.readUint64Buffer();
        var status = buffer.readUint8Buffer();
        var playerNum = buffer.readUint8Buffer();
        var players = [];
        for (var i = 0; i < playerNum; i++) {
            var player = {};
            var openid = this.read32BytesToString(buffer);
            var joinTs = buffer.readUint64Buffer();
            var status = buffer.readUint8Buffer();
            player['openId'] = openid;
            player.status = status;
            player.joinTs = joinTs;
            players.push(player);
        }
        this.ownerId = ownerId;
        this.createTs = createTs;
        this.status = status;
        this.playerNum = playerNum;
        if (this.currentPlayers.length == 0) {
            players.forEach(function (element) {
                this.newJoinPlayers.push(element);
            }, this);
        } else {
            var tmpArray = [];
            BK.Script.log(0, 0, 'recvJoinRoom!curPlayers = ' + JSON.stringify(this.currentPlayers));
            BK.Script.log(0, 0, 'recvJoinRoom!joinPlayers = ' + JSON.stringify(players));
            for (var i = 0; i < players.length; i++) {
                var player = players[i];
                var isFormerJoin = false;
                for (var j = 0; j < this.currentPlayers.length; j++) {
                    var formerNewJoinPlayer = this.currentPlayers[j];
                    if (formerNewJoinPlayer.openId == player.openId) {
                        isFormerJoin = true;
                        break;
                    }
                }
                if (isFormerJoin == false) {
                    tmpArray.push(player);
                }
            }
            this.newJoinPlayers = tmpArray;
            BK.Script.log(0, 0, 'recvJoinRoom!newPlayers = ' + JSON.stringify(this.newJoinPlayers));
        }
        this.currentPlayers = players;
        BK.Script.log(0, 0, 'recvJoinRoom ownerId=' + ownerId + ',createTs =' + createTs + ',playerNum:' + playerNum);
    };
    this.recvLeaveRoom = function (buff, bodyLen) {
        var tlvBuff = buff.readBuffer(bodyLen);
        var tlv = new BK.TLV(tlvBuff);
        var res = tlv.bkJSParseTLV();
        if (res) {
            var buffer = res.tag201;
            var logOutId = this.read32BytesToString(buffer);
            var reason = buff.readUint64Buffer();
            var leaveInfo = new Object();
            BK.Script.log(0, 0, 'recvLeaveRoom!ret = ' + reason);
            leaveInfo.reason = reason;
            leaveInfo.logOutId = logOutId;
            this.currentPlayers.splice(this.currentPlayers.indexOf(logOutId));
            return leaveInfo;
        } else {
            BK.Script.log(0, 0, 'recvLeaveRoom parse failed.bodylen is ' + bodyLen);
            return undefined;
        }
    };
    this.recvStartGame = function (buff, bodyLen) {
        this.startGameTs = BK.Time.timestamp;
        BK.Script.log(0, 0, 'recvStartGame');
    };
    this.recvPushFrameSync = function (buff, bodyLen) {
        var tlvBuff = buff.readBuffer(bodyLen);
        var tlv = new BK.TLV(tlvBuff);
        var res = tlv.bkJSParseTLV();
        var needAck = res.tag201;
        var isFinish = res.tag202;
        var frameData = res.tag203;
        var frameDataArr = new Array();
        for (var i = 0; i < frameData.length; i++) {
            var frameSeq = frameData[i].readUint32Buffer();
            this.lastFrame = frameSeq;
            var len = frameData[i].bufferLength() - 4;
            BK.Script.log(0, 0, 'sync recv len= ' + frameData[i].bufferLength() + ' frameData.length=' + frameData.length);
            var userDataArr = new Array();
            while (len > 0) {
                BK.Script.log(0, 0, 'push frameNo=' + this.lastFrame);
                var dataLen = frameData[i].readUint16Buffer();
                BK.Script.log(0, 0, 'push databuf 2 datalen=' + dataLen);
                var openid = this.read32BytesToString(frameData[i]);
                var itemid = frameData[i].readUint64Buffer();
                var dataBuf = frameData[i].readBuffer(dataLen);
                var userData = {
                    'openId': openid,
                    'itemId': itemid,
                    'dataBuffer': dataBuf
                };
                BK.Script.log(0, 0, 'push databuf openid=' + openid);
                BK.Script.log(0, 0, 'push databuf itemid=' + itemid);
                userDataArr.push(userData);
                len -= 2 + 32 + 8;
                len -= dataLen;
            }
            userDataArr.frameSeq = frameSeq;
            frameDataArr.push(userDataArr);
        }
        this.frameSyncListener(frameDataArr);
    };
    this.recvQueryFrameSync = function (buff, bodyLen) {
        var tlvBuff = buff.readBuffer(bodyLen);
        var tlv = new BK.TLV(tlvBuff);
        var res = tlv.bkJSParseTLV();
        if (!res) {
            BK.Script.log(0, 0, 'recvQueryFrameSync empty.');
            this.queryFrameDataCallBack(0, undefined);
            return;
        }
        var frameData = res.tag201;
        var frameDataArr = new Array();
        for (var i = 0; i < frameData.length; i++) {
            frameData[i].readUint32Buffer();
            var len = frameData[i].bufferLength() - 4;
            BK.Script.log(0, 0, 'sync query recv = ' + frameData[i].bufferLength() + ' frameData.length=' + frameData.length);
            var userDataArr = new Array();
            while (len > 0) {
                BK.Script.log(0, 0, 'push frameNo=' + this.lastFrame);
                var dataLen = frameData[i].readUint16Buffer();
                BK.Script.log(0, 0, 'push databuf 2 datalen=' + dataLen);
                var openid = this.read32BytesToString(frameData[i]);
                var itemid = frameData[i].readUint64Buffer();
                var dataBuf = frameData[i].readBuffer(dataLen);
                var userData = {
                    'openId': openid,
                    'itemId': itemid,
                    'dataBuffer': dataBuf
                };
                BK.Script.log(0, 0, 'push databuf openid=' + openid);
                BK.Script.log(0, 0, 'push databuf itemid=' + itemid);
                userDataArr.push(userData);
                len -= 2 + 32 + 8;
                len -= dataLen;
            }
            frameDataArr.push(userDataArr);
        }
        BK.Script.log(0, 0, 'query end');
        this.queryFrameDataCallBack(0, frameDataArr);
    };
    this.recvControlCommand = function (buffer, bodylen) {
        var body = buffer.readBuffer(bodylen);
        var tlv = new BK.TLV(body);
        var res = tlv.bkJSParseTLV();
        var resp = {};
        if (res.tag201) {
            resp = JSON.parse(res.tag201.readAsString());
        }
        if (this.controlCommandCallback) {
            this.controlCommandCallback(0, resp);
        }
    };
    this.recvSSOJoinRoom = function (errCode, cmd, data) {
        BK.Script.log(1, 1, 'recvSSOJoinRoom = true data=' + JSON.stringify(data));
        if (errCode == 0) {
            var avRoomId = data.data.avRoomId;
            var appId = data.data.sdkAppId;
            var accountType = data.data.accountType;
            GameStatusInfo.avAppId = appId;
            GameStatusInfo.avAccountType = accountType;
            GameStatusInfo.avRoomId = avRoomId;
            GameStatusInfo.roomId = this.roomId;
        }
    };
    this.handleServerError = function (fixedHeader) {
        BK.Script.log(0, 1, 'handleServerError!cmd = ' + fixedHeader.cmd + ', errCode = ' + fixedHeader.ret);
        switch (fixedHeader.cmd) {
        case 7:
            this.roomId = fixedHeader.roomId;
            this.createRoomCallBack(header.ret, null, fixedHeader.roomId);
            break;
        case 11:
            this.queryRoomInfoCallBack(fixedHeader.ret, null);
            break;
        case 3:
            this.joinRoomCallBack(fixedHeader.ret, this);
            break;
        case 5:
            this.leaveRoomCallBack(fixedHeader.ret, null);
            break;
        case 9:
            this.startGameCallBack(fixedHeader.ret);
            break;
        case 1:
            this.broadcastDataCallBack(fixedHeader.fromId, null);
            break;
        case 51:
            this.sensitiveWordCallBack(fixedHeader.ret, fixedHeader.fromId, null);
            break;
        case 33:
            this.setUserDataCallBack(fixedHeader.ret);
            break;
        case 35:
            this.getUserDataCallBack(fixedHeader.ret, null);
            break;
        case 15:
            this.sendSyncOptCallBack(fixedHeader.ret, null);
            break;
        case 16:
            break;
        case 19:
            this.queryFrameDataCallBack(fixedHeader.ret, null);
            break;
        case 37:
            this.matchGameCallBack(fixedHeader.ret);
            break;
        case 39:
            this.queryMatchGameCallBack(fixedHeader.ret);
            break;
        case 41:
            this.quitMatchGameCallBack(fixedHeader.ret);
            break;
        case 49: {
                this.controlCommandCallback && this.controlCommandCallback(fixedHeader.ret, {});
                break;
            }
        }
    };
    this.handleRecv = function (buff) {
        var header = this.getHeader(buff);
        if (header.stlen != 0) {
            var st = buff.readBuffer(header.stlen);
            BK.Script.log(0, 0, 'st.len = ' + header.stlen);
        }
        var body = buff.readBuffer(header.bodyLen);
        BK.Security.decrypt(body);
        var fixedHeader = this.getFixedHeader(body);
        this.netTimeOutTs = 0;
        if (fixedHeader.ret != 0) {
            this.handleServerError(fixedHeader);
            return;
        }
        BK.Script.log(0, 0, 'handleRecv = ' + fixedHeader.cmd + ',bodyLen=' + header.bodyLen + ',bodyreal=' + body.bufferLength());
        switch (fixedHeader.cmd) {
        case 7:
            this.roomId = fixedHeader.roomId;
            var addr = this.recvCreateRoom(body, body.bufferLength() - fixedHeaderLen);
            BK.Script.log(0, 0, 'magic = ' + header.magic + ',stlen = ' + header.stlen + ',bodyLen=' + header.bodyLen + ',cmd=' + fixedHeader.cmd + ',roomId=' + fixedHeader.roomId);
            this.createRoomCallBack(fixedHeader.ret, addr, fixedHeader.roomId);
            BK.QQ.notifyNewRoom(this.roomId, fixedHeader.ret);
            break;
        case 11:
            var roomInfo = this.recvQueryRoom(body, body.bufferLength() - fixedHeaderLen);
            this.queryRoomInfoCallBack(fixedHeader.ret, roomInfo);
            BK.Script.log(0, 0, 'magic = ' + header.magic + ',stlen = ' + header.stlen + ',bodyLen=' + header.bodyLen + ',cmd=' + fixedHeader.cmd + ',roomId=' + fixedHeader.roomId);
            break;
        case 3:
            this.recvJoinRoom(body, body.bufferLength() - fixedHeaderLen);
            this.joinRoomCallBack(fixedHeader.ret, this);
            if (Boolean(BK.QQ.isNeedSSOServer) == true) {
                for (var i = 0; i < this.newJoinPlayers.length; i++) {
                    if (this.newJoinPlayers[i].openId == currentPlayerOpenId) {
                        BK.QQ.ssoJoinRoomCallback = this.recvSSOJoinRoom.bind(this);
                        BK.QQ.notifyNewOrJoinRoomSrv(this.newJoinPlayers, this.roomId, this.ownerId == GameStatusInfo.openId ? 1 : 2);
                        return;
                    }
                }
            }
            BK.QQ.notifyJoinRoom(this.newJoinPlayers, {}, fixedHeader.ret);
            break;
        case 5:
            var leaveInfo = this.recvLeaveRoom(body, body.bufferLength() - fixedHeaderLen);
            if (this.leaveRoomCallBack) {
                this.leaveRoomCallBack(fixedHeader.ret, leaveInfo);
            }
            break;
        case 9:
            this.recvStartGame(body, body.bufferLength() - fixedHeaderLen);
            this.startGameCallBack(fixedHeader.ret);
            if (Boolean(BK.QQ.isNeedSSOServer) == true) {
                BK.QQ.notifyStartGameSrv();
            }
            break;
        case 1:
            var buf = body.readBuffer(body.bufferLength() - fixedHeaderLen);
            this.broadcastDataCallBack(fixedHeader.fromId, buf, fixedHeader.toId);
            break;
        case 51:
            var buf = body.readBuffer(body.bufferLength() - fixedHeaderLen);
            this.sensitiveWordCallBack(fixedHeader.ret, fixedHeader.fromId, buf, fixedHeader.toId);
            break;
        case 33:
            var buf = body.readBuffer(body.bufferLength() - fixedHeaderLen);
            this.setUserDataCallBack(fixedHeader.ret);
            break;
        case 35:
            var buf = body.readBuffer(body.bufferLength() - fixedHeaderLen);
            this.getUserDataCallBack(fixedHeader.ret, buf);
            break;
        case 15:
            var ack = body.readUint32Buffer();
            this.ackSeq = ack;
            this.sendSyncOptCallBack(fixedHeader.ret, ack);
            break;
        case 16:
            this.recvPushFrameSync(body, body.bufferLength() - fixedHeaderLen);
            break;
        case 19:
            this.recvQueryFrameSync(body, body.bufferLength() - fixedHeaderLen);
            break;
        case 37:
            this.matchGameCallBack(fixedHeader.ret);
            break;
        case 39:
            this.roomId = fixedHeader.roomId;
            this.queryMatchGameCallBack(fixedHeader.ret);
            break;
        case 41:
            this.roomId = fixedHeader.roomId;
            this.quitMatchGameCallBack(fixedHeader.ret);
            break;
        case 49: {
                this.recvControlCommand(body, body.bufferLength() - fixedHeaderLen);
                break;
            }
        }
    };
    this.requestSocket = function (funObj) {
        var buff;
        BK.Script.log(0, 0, 'requestSocket = ' + funObj.cmd);
        switch (funObj.cmd) {
        case 6:
            buff = this.requestCreateRoom(funObj.arg0, funObj.arg1);
            break;
        case 10:
            buff = this.requestQueryRoom();
            break;
        case 2:
            buff = this.requestJoinRoom(funObj.arg0);
            break;
        case 4:
            buff = this.requestLeaveRoom(funObj.arg0);
            break;
        case 8:
            buff = this.requestStartGame();
            break;
        case 1:
            buff = this.requestsendBroadcastData(funObj.arg0);
            break;
        case 50:
            buff = this.requestSendSendSensitiveWordData(funObj.arg0);
            break;
        case 32:
            buff = this.requestSetUserData(funObj.arg0);
            break;
        case 34:
            buff = this.requestGetUserData(funObj.arg0);
            break;
        case 14:
            buff = this.requestSyncOpt(funObj.arg0, funObj.arg1, funObj.arg2, funObj.arg3);
            break;
        case 18:
            buff = this.requestQueryFrameData(funObj.arg0, funObj.arg1);
            break;
        case 36:
            buff = this.requestMatch(funObj.arg0, funObj.arg1);
            break;
        case 38:
            buff = this.requestQueryMatch(funObj.arg0, funObj.arg1);
            break;
        case 40:
            buff = this.requestQuitMatch(funObj.arg0, funObj.arg1);
            break;
        case 12:
            buff = this.requestSendKeepAlive();
            if (this.netTimeOutTs == 0) {
                this.netTimeOutTs = BK.Time.timestamp;
            }
            break;
        case 48: {
                var data = new BK.Buffer();
                var openkey = new BK.Buffer();
                data.writeAsString(funObj.arg1);
                openkey.writeAsString(funObj.arg2);
                buff = this.requestControlCommand(funObj.arg0, data, openkey);
                break;
            }
        }
        if (buff != undefined) {
            BK.Script.log(0, 0, 'requestSocket = ' + funObj.cmd);
            this.socket.send(buff);
        }
    };
    this.seperatePackHandle = function () {
        while (true) {
            var checkBuff = this.socket.receiveNotRemove();
            var totalLen = checkBuff.bufferLength();
            var header = this.getHeader(checkBuff);
            var onePackLen = header.stlen + header.bodyLen + HeaderLen;
            BK.Script.log(0, 0, 'this.socket.receive():totalLen = ' + totalLen + '  onePackLen=' + onePackLen);
            if (totalLen == onePackLen) {
                BK.Script.log(0, 0, '  this.socket.receive():onePackLen=' + onePackLen);
                var rBuf = this.socket.receive(onePackLen);
                if (rBuf != undefined) {
                    this.handleRecv(rBuf);
                }
                break;
            } else if (totalLen < onePackLen) {
                BK.Script.log(0, 0, '  this.socket.receive():part of onePackLen=' + onePackLen);
                break;
            } else if (totalLen > onePackLen) {
                BK.Script.log(0, 0, '  this.socket.receive():Multipacks onePackLen=' + onePackLen);
                var rBuf = this.socket.receive(onePackLen);
                if (rBuf != undefined) {
                    this.handleRecv(rBuf);
                }
            }
        }
    };
    this.curConnRetrys = 0;
    this.curConnTimeout = 0;
    this.prevNetState = 0;
    this.reConnectTime = 0;
    this.updateNet = function () {
        var state = this.socket.update();
        var curNetStat = this.socket.state;
        if (-1 != state) {
            switch (this.prevNetState) {
            case 0: {
                    switch (curNetStat) {
                    case 3: {
                            this.onErrorEvent(this);
                            break;
                        }
                    case 1: {
                            this.onConnectingEvent(this);
                            break;
                        }
                    case 2: {
                            this.onConnectedEvent(this);
                            break;
                        }
                    }
                    break;
                }
            case 1: {
                    switch (curNetStat) {
                    case 2: {
                            switch (state) {
                            case 2: {
                                    this.onConnectedEvent();
                                    break;
                                }
                            case 3: {
                                    BK.Script.log(0, 0, 'BK.Socket.update!unexcepted status');
                                    break;
                                }
                            }
                            break;
                        }
                    default: {
                        }
                    }
                    break;
                }
            case 2: {
                    switch (curNetStat) {
                    case 2: {
                            this.onUpdateEvent();
                            break;
                        }
                    default: {
                            this.onErrorEvent();
                        }
                    }
                    break;
                }
            }
        } else {
            BK.Script.log(0, 0, 'BK.Socket.DisconnectEvent prevNetState=' + this.prevNetState);
            switch (this.prevNetState) {
            case 3:
            case 2:
            case 1: {
                    this.onDisconnectEvent();
                    break;
                }
            }
        }
        this.prevNetState = curNetStat;
        return state;
    };
    this.onErrorEvent = function () {
        BK.Script.log(0, 0, 'BK.Socket.ErrorEvent');
    };
    this.onUpdateEvent = function () {
        return 0;
    };
    this.onTimeoutEvent = function () {
        BK.Script.log(0, 0, 'BK.Socket.TimeoutEvent');
    };
    this.onConnectingEvent = function () {
        BK.Script.log(0, 0, 'BK.Socket.ConnectingEvent');
    };
    this.onConnectedEvent = function () {
        BK.Script.log(0, 0, 'BK.Socket.ConnectedEvent');
        if (this.connectedNetCallback) {
            this.connectedNetCallback();
        }
    };
    this.onReconnectEvent = function () {
        BK.Script.log(0, 0, 'BK.Socket.ReconnectEvent');
    };
    this.onDisconnectEvent = function () {
        BK.Script.log(0, 0, 'BK.Socket.DisconnectEvent');
        if (this.disconnectNetCallBack) {
            this.disconnectNetCallBack();
        }
        if (this.reConnectTime < 3) {
            BK.Script.log(0, 0, 'BK.Socket.DisconnectEvent reconnectAndJoinRoom');
            var ts = BK.Time.timestamp;
            var cost = (ts - this.startGameTs) / 60;
            if (cost < 5) {
                this.reConnectTime++;
                this.reConnectAndJoinRoom();
            } else {
                BK.Script.log(0, 0, 'BK.Socket.DisconnectEvent over 5 min');
            }
        } else {
            if (this.terminatedNetCallback) {
                this.terminatedNetCallback();
            }
        }
    };
    this.setConnectedNetCallBack = function (callback) {
        this.connectedNetCallback = callback;
    };
    this.setDisconnectNetCallBack = function (callback) {
        this.disconnectNetCallBack = callback;
    };
    this.setTerminatedNetCallback = function (callback) {
        this.terminatedNetCallback = callback;
    };
    this.updateSocket = function () {
        var update = this.updateNet();
        if (update == 3 || update == 2) {
            if (this.reqArray.length > 0) {
                var funObj = this.reqArray.pop();
                if (funObj != undefined && funObj != null) {
                    this.requestSocket(funObj);
                }
            }
        }
        if (update == 3 || update == 1) {
            this.seperatePackHandle();
        }
        return update;
    };
    this.createAndJoinRoom = function (gameId, masterOpenId, callback, isSendMsg, needSSOServer) {
        this.createRoom(gameId, masterOpenId, function (createStatusCode, netAddr, roomId) {
            if (createStatusCode == 0) {
                BK.Script.log(0, 0, '创建游戏 statusCode:' + createStatusCode + ' roomId:' + roomId);
                this.gameSvrIp = netAddr.ip_2;
                this.gameSvrPort = netAddr.port_2;
                this.roomSvrIp = netAddr.ip_1;
                this.roomSvrPort = netAddr.port_1;
                this.socket.close();
                this.socket.connect(this.gameSvrIp, this.gameSvrPort);
                this.joinRoom(0, function (statusCode, room) {
                    BK.Script.log(0, 0, '加入房间 statusCode:' + statusCode + ' roomid is ' + room.roomId);
                    if (statusCode == 0) {
                        GameStatusInfo.roomId = room.roomId;
                        BK.QQ.gameCfg.roomId = room.roomId;
                    }
                    callback(statusCode, this);
                }, isSendMsg, needSSOServer);
            } else {
                callback(createStatusCode, this);
            }
        });
    };
    this.queryAndJoinRoom = function (gameId, roomId, joinerOpenId, callback, isSendMsg, needSSOServer) {
        if (this.serverConnected != 1) {
            this.socket.close();
            this.socket.connect(this.recommandRoomSvrHost, this.recommandRoomSvrPort);
        }
        this.queryRoom(gameId, roomId, joinerOpenId, function (queryStatusCode, roomInfo) {
            if (queryStatusCode == 0) {
                this.gameSvrIp = roomInfo.ip_2;
                this.gameSvrPort = roomInfo.port_2;
                this.roomSvrIp = roomInfo.ip_1;
                this.roomSvrPort = roomInfo.port_1;
                this.socket.close();
                this.socket.connect(this.gameSvrIp, this.gameSvrPort);
                this.joinRoom(0, function (statusCode, room) {
                    BK.Script.log(0, 0, '加入房间 statusCode:' + statusCode + ' roomid is ' + room.roomId);
                    callback(statusCode, this);
                }, isSendMsg, needSSOServer);
            } else {
                callback(queryStatusCode, undefined);
            }
        });
    };
    this.forceLeaveRoom = function (callback, reason) {
        var funObj = new Object();
        funObj.cmd = 4;
        funObj.arg0 = reason;
        this.leaveRoomCallBack = callback;
        var buff = this.requestLeaveRoom(funObj.arg0);
        var update = this.socket.update();
        if (update == 3 || update == 2) {
            this.socket.send(buff);
            BK.Script.log(0, 0, 'forceLeaveRoom push');
        } else {
            BK.Script.log(0, 0, 'forceLeaveRoom push Failed. Socket not allow Send.');
        }
    };
    this._event4StopGame = function (errCode, cmd, data) {
        BK.Script.log(0, 0, 'BK.Room._event4StopGame!errCode = ' + errCode + ', cmd = ' + cmd + ', data = ' + JSON.stringify(data));
        if (errCode == 0) {
            this.forceLeaveRoom(function (retCode, leaveInfo) {
                BK.Script.log(0, 0, 'forceLeaveRoom callback');
            }, 0);
        }
    };
    BK.MQQ.SsoRequest.addListener(CMSHOW_SC_CMD_STOP_GAME, this, this._event4StopGame.bind(this));
    this.addDebugFunctions = function () {
        this.createFixedRoom = function (gameId, openId, roomId, callback) {
            this.roomId = roomId;
            this.mId = openId;
            this.gameId = gameId;
            var con = this.socket.connect(this.recommandRoomSvrHost, this.recommandRoomSvrPort);
            BK.Script.log(0, 0, 'socket con =' + con);
            if (con != -1) {
                BK.Script.log(0, 0, 'socket connect failed! ' + con);
            }
            this.createRoomCallBack = callback;
            var funObj = new Object();
            funObj.cmd = 6;
            funObj.arg0 = gameId;
            funObj.arg1 = openId;
            this.reqArray.push(funObj);
            BK.Script.log(0, 0, 'create Fixed Room ');
        };
        this.createAndJoinFixedRoom = function (gameId, masterOpenId, roomId, callback, isSendMsg) {
            this.createFixedRoom(gameId, masterOpenId, roomId, function (createStatusCode, netAddr, roomId) {
                if (createStatusCode == 0) {
                    BK.Script.log(0, 0, '创建固定房间号 游戏 statusCode:' + createStatusCode + ' roomId:' + roomId);
                    this.gameSvrIp = netAddr.ip_2;
                    this.gameSvrPort = netAddr.port_2;
                    this.roomSvrIp = netAddr.ip_1;
                    this.roomSvrPort = netAddr.port_1;
                    this.socket.close();
                    this.socket.connect(this.gameSvrIp, this.gameSvrPort);
                    this.joinRoom(0, function (statusCode, room) {
                        BK.Script.log(0, 0, '加入房间 statusCode:' + statusCode + ' roomid is ' + room.roomId);
                        callback(statusCode, this);
                    }, isSendMsg);
                } else {
                    callback(createStatusCode, this);
                }
            });
        };
        this.requestCreateRoom = function (gameId, openId) {
            var fixedRoomId = this.roomId;
            if (!fixedRoomId) {
                fixedRoomId = 0;
            }
            BK.Script.log(0, 0, 'create fixed room request in fixedRoomId:' + fixedRoomId);
            var body = new BK.Buffer(fixedHeaderLen, 1);
            this.addFixedHeader(body, 6, gameId, fixedRoomId, openId);
            var st = BK.Security.getST();
            BK.Security.encrypt(body);
            var stLen = st.bufferLength();
            var buff = new BK.Buffer(HeaderLen + body.bufferLength() + stLen, 1);
            this.addHeader(buff, body.bufferLength(), stLen);
            buff.writeBuffer(st);
            buff.writeBuffer(body);
            BK.Script.log(0, 0, 'create room request buffer : ' + buff.bufferLength() + ' body len:' + body.bufferLength());
            return buff;
        };
    };
    Object.defineProperty(this, 'environment', {
        get: function () {
            return this._environment;
        },
        set: function (obj) {
            BK.Script.log(1, 1, 'set Environment aaaaa' + obj);
            if (obj == NETWORK_ENVIRONMENT_QQ_DEBUG) {
                this.headerVersion = 769;
                this.recommandRoomSvrHost = DebugRecommandRoomSvrHost;
                this.recommandRoomSvrPort = DebugRecommandRoomSvrPort;
            } else if (obj == NETWORK_ENVIRONMENT_DEMO_DEV) {
                this.addDebugFunctions();
                this.headerVersion = 257;
                this.recommandRoomSvrHost = DebugRecommandRoomSvrHost;
                this.recommandRoomSvrPort = DebugRecommandRoomSvrPort;
            }
            this._environment = obj;
        }
    });
    BK.Script.log(1, 1, 'environment aaaaa  xxxxxxxxxxx  ' + this._environment);
    if (this._environment == NETWORK_ENVIRONMENT_QQ_DEBUG) {
        this.headerVersion = 769;
        this.recommandRoomSvrHost = DebugRecommandRoomSvrHost;
        this.recommandRoomSvrPort = DebugRecommandRoomSvrPort;
    } else if (this._environment == NETWORK_ENVIRONMENT_DEMO_DEV) {
        this.addDebugFunctions();
        this.headerVersion = 257;
        this.recommandRoomSvrHost = DebugRecommandRoomSvrHost;
        this.recommandRoomSvrPort = DebugRecommandRoomSvrPort;
    }
};
BK.Script.log(0, 0, 'protocol.js Load Succeed!');
(function () {
    var url = function () {
        function _t() {
            return new RegExp(/(.*?)\.?([^\.]*?)\.?(com|net|org|biz|ws|in|me|co\.uk|co|org\.uk|ltd\.uk|plc\.uk|me\.uk|edu|mil|br\.com|cn\.com|eu\.com|hu\.com|no\.com|qc\.com|sa\.com|se\.com|se\.net|us\.com|uy\.com|ac|co\.ac|gv\.ac|or\.ac|ac\.ac|af|am|as|at|ac\.at|co\.at|gv\.at|or\.at|asn\.au|com\.au|edu\.au|org\.au|net\.au|id\.au|be|ac\.be|adm\.br|adv\.br|am\.br|arq\.br|art\.br|bio\.br|cng\.br|cnt\.br|com\.br|ecn\.br|eng\.br|esp\.br|etc\.br|eti\.br|fm\.br|fot\.br|fst\.br|g12\.br|gov\.br|ind\.br|inf\.br|jor\.br|lel\.br|med\.br|mil\.br|net\.br|nom\.br|ntr\.br|odo\.br|org\.br|ppg\.br|pro\.br|psc\.br|psi\.br|rec\.br|slg\.br|tmp\.br|tur\.br|tv\.br|vet\.br|zlg\.br|br|ab\.ca|bc\.ca|mb\.ca|nb\.ca|nf\.ca|ns\.ca|nt\.ca|on\.ca|pe\.ca|qc\.ca|sk\.ca|yk\.ca|ca|cc|ac\.cn|com\.cn|edu\.cn|gov\.cn|org\.cn|bj\.cn|sh\.cn|tj\.cn|cq\.cn|he\.cn|nm\.cn|ln\.cn|jl\.cn|hl\.cn|js\.cn|zj\.cn|ah\.cn|gd\.cn|gx\.cn|hi\.cn|sc\.cn|gz\.cn|yn\.cn|xz\.cn|sn\.cn|gs\.cn|qh\.cn|nx\.cn|xj\.cn|tw\.cn|hk\.cn|mo\.cn|cn|cx|cz|de|dk|fo|com\.ec|tm\.fr|com\.fr|asso\.fr|presse\.fr|fr|gf|gs|co\.il|net\.il|ac\.il|k12\.il|gov\.il|muni\.il|ac\.in|co\.in|org\.in|ernet\.in|gov\.in|net\.in|res\.in|is|it|ac\.jp|co\.jp|go\.jp|or\.jp|ne\.jp|ac\.kr|co\.kr|go\.kr|ne\.kr|nm\.kr|or\.kr|li|lt|lu|asso\.mc|tm\.mc|com\.mm|org\.mm|net\.mm|edu\.mm|gov\.mm|ms|nl|no|nu|pl|ro|org\.ro|store\.ro|tm\.ro|firm\.ro|www\.ro|arts\.ro|rec\.ro|info\.ro|nom\.ro|nt\.ro|se|si|com\.sg|org\.sg|net\.sg|gov\.sg|sk|st|tf|ac\.th|co\.th|go\.th|mi\.th|net\.th|or\.th|tm|to|com\.tr|edu\.tr|gov\.tr|k12\.tr|net\.tr|org\.tr|com\.tw|org\.tw|net\.tw|ac\.uk|uk\.com|uk\.net|gb\.com|gb\.net|vg|sh|kz|ch|info|ua|gov|name|pro|ie|hk|com\.hk|org\.hk|net\.hk|edu\.hk|us|tk|cd|by|ad|lv|eu\.lv|bz|es|jp|cl|ag|mobi|eu|co\.nz|org\.nz|net\.nz|maori\.nz|iwi\.nz|io|la|md|sc|sg|vc|tw|travel|my|se|tv|pt|com\.pt|edu\.pt|asia|fi|com\.ve|net\.ve|fi|org\.ve|web\.ve|info\.ve|co\.ve|tel|im|gr|ru|net\.ru|org\.ru|hr|com\.hr|ly|xyz)$/);
        }
        function _d(s) {
            return decodeURIComponent(s.replace(/\+/g, ' '));
        }
        function _i(arg, str) {
            var sptr = arg.charAt(0), split = str.split(sptr);
            if (sptr === arg) {
                return split;
            }
            arg = parseInt(arg.substring(1), 10);
            return split[arg < 0 ? split.length + arg : arg - 1];
        }
        function _f(arg, str) {
            var sptr = arg.charAt(0), split = str.split('&'), field = [], params = {}, tmp = [], arg2 = arg.substring(1);
            for (var i = 0, ii = split.length; i < ii; i++) {
                field = split[i].match(/(.*?)=(.*)/);
                if (!field) {
                    field = [
                        split[i],
                        split[i],
                        ''
                    ];
                }
                if (field[1].replace(/\s/g, '') !== '') {
                    field[2] = _d(field[2] || '');
                    if (arg2 === field[1]) {
                        return field[2];
                    }
                    tmp = field[1].match(/(.*)\[([0-9]+)\]/);
                    if (tmp) {
                        params[tmp[1]] = params[tmp[1]] || [];
                        params[tmp[1]][tmp[2]] = field[2];
                    } else {
                        params[field[1]] = field[2];
                    }
                }
            }
            if (sptr === arg) {
                return params;
            }
            return params[arg2];
        }
        return function (arg, url) {
            var _l = {}, tmp, tmp2;
            if (arg === 'tld?') {
                return _t();
            }
            url = url || window.location.toString();
            if (!arg) {
                return url;
            }
            arg = arg.toString();
            if (tmp = url.match(/^mailto:([^\/].+)/)) {
                _l.protocol = 'mailto';
                _l.email = tmp[1];
            } else {
                if (tmp = url.match(/(.*?)\/#\!(.*)/)) {
                    url = tmp[1] + tmp[2];
                }
                if (tmp = url.match(/(.*?)#(.*)/)) {
                    _l.hash = tmp[2];
                    url = tmp[1];
                }
                if (_l.hash && arg.match(/^#/)) {
                    return _f(arg, _l.hash);
                }
                if (tmp = url.match(/(.*?)\?(.*)/)) {
                    _l.query = tmp[2];
                    url = tmp[1];
                }
                if (_l.query && arg.match(/^\?/)) {
                    return _f(arg, _l.query);
                }
                if (tmp = url.match(/(.*?)\:?\/\/(.*)/)) {
                    _l.protocol = tmp[1].toLowerCase();
                    url = tmp[2];
                }
                if (tmp = url.match(/(.*?)(\/.*)/)) {
                    _l.path = tmp[2];
                    url = tmp[1];
                }
                _l.path = (_l.path || '').replace(/^([^\/])/, '/$1');
                if (arg.match(/^[\-0-9]+$/)) {
                    arg = arg.replace(/^([^\/])/, '/$1');
                }
                if (arg.match(/^\//)) {
                    return _i(arg, _l.path.substring(1));
                }
                tmp = _i('/-1', _l.path.substring(1));
                if (tmp && (tmp = tmp.match(/(.*?)\.(.*)/))) {
                    _l.file = tmp[0];
                    _l.filename = tmp[1];
                    _l.fileext = tmp[2];
                }
                if (tmp = url.match(/(.*)\:([0-9]+)$/)) {
                    _l.port = tmp[2];
                    url = tmp[1];
                }
                if (tmp = url.match(/(.*?)@(.*)/)) {
                    _l.auth = tmp[1];
                    url = tmp[2];
                }
                if (_l.auth) {
                    tmp = _l.auth.match(/(.*)\:(.*)/);
                    _l.user = tmp ? tmp[1] : _l.auth;
                    _l.pass = tmp ? tmp[2] : undefined;
                }
                _l.hostname = url.toLowerCase();
                if (arg.charAt(0) === '.') {
                    return _i(arg, _l.hostname);
                }
                if (_t()) {
                    tmp = _l.hostname.match(_t());
                    if (tmp) {
                        _l.tld = tmp[3];
                        _l.domain = tmp[2] ? tmp[2] + '.' + tmp[3] : undefined;
                        _l.sub = tmp[1] || undefined;
                    }
                }
                if (!_l.port) {
                    if (_l.protocol === 'http' || _l.protocol === 'ws') {
                        _l.port = '80';
                    } else if (_l.protocol === 'https' || _l.protocol === 'wss') {
                        _l.port = '443';
                    }
                }
            }
            if (arg in _l) {
                return _l[arg];
            }
            if (arg === '{}') {
                return _l;
            }
            return undefined;
        };
    }();
    BK.URL = url;
}());
var __extends = this && this.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p];
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var SocketEventMgr = function () {
    function SocketEventMgr() {
        this._wsArray = [];
        BK.Director.ticker.add(function (ts, duration) {
            SocketEventMgr.Instance.dispatchEvent();
        });
    }
    SocketEventMgr.prototype.add = function (so) {
        this._wsArray.push(so);
        BK.Script.log(1, 0, 'SocketEventMgr.add!so = ' + so);
    };
    SocketEventMgr.prototype.del = function (so) {
        var idx = this._wsArray.indexOf(so, 0);
        if (idx >= 0) {
            this._wsArray.splice(idx, 1);
            BK.Script.log(1, 0, 'SocketEventMgr.del!so = ' + so);
        }
    };
    SocketEventMgr.prototype.dispatchEvent = function () {
        this._wsArray.forEach(function (so, index, array) {
            if (so) {
                so.update();
            }
        });
    };
    return SocketEventMgr;
}();
SocketEventMgr.Instance = new SocketEventMgr();
var KSocket = function () {
    function KSocket(ip, port) {
        this.ip = ip;
        this.port = port;
        this.__nativeObj = new BK.Socket();
        this.prevConnTs = 0;
        this.curConnRetrys = 0;
        this.curConnTimeout = 0;
        this.prevNetState = 0;
        this.options = {
            ConnectRetryCount: 3,
            ConnectTimeoutInterval: 3000
        };
    }
    KSocket.prototype.__internalClose = function () {
        if (this.__nativeObj) {
            return this.__nativeObj.close();
        }
        return -2;
    };
    KSocket.prototype.__internalSend = function (data) {
        if (this.__nativeObj) {
            return this.__nativeObj.send(data);
        }
        return -2;
    };
    KSocket.prototype.__internalRecv = function (length) {
        if (this.__nativeObj) {
            return this.__nativeObj.receive(length);
        }
        return undefined;
    };
    KSocket.prototype.__internalUpdate = function () {
        if (this.__nativeObj) {
            return this.__nativeObj.update();
        }
        return -2;
    };
    KSocket.prototype.__internalConnect = function () {
        if (this.__nativeObj) {
            var ret = this.__nativeObj.connect(this.ip, this.port);
            var curNetStat = this.curNetState();
            switch (this.prevNetState) {
            case 3:
                this.onReconnectEvent(this);
            case 0: {
                    switch (curNetStat) {
                    case 3: {
                            this.onErrorEvent(this);
                            break;
                        }
                    case 1:
                    case 4: {
                            this.prevConnTs = BK.Time.clock;
                            if (!this.curConnTimeout) {
                                this.curConnTimeout = this.options.ConnectTimeoutInterval;
                            }
                            this.onConnectingEvent(this);
                            ret = 0;
                            break;
                        }
                    case 2:
                    case 5: {
                            this.onConnectedEvent(this);
                            ret = 0;
                            break;
                        }
                    }
                    break;
                }
            }
            this.prevNetState = curNetStat;
            return ret;
        }
        return -2;
    };
    KSocket.prototype.__internalCanReadLength = function () {
        if (this.__nativeObj) {
            return this.__nativeObj.canReadLength();
        }
        return 0;
    };
    KSocket.prototype.__internalIsEnableSSL = function () {
        if (this.__nativeObj) {
            return this.__nativeObj.getSSLEnable();
        }
        return false;
    };
    KSocket.prototype.__internalEnableSSL = function (ssl) {
        if (this.__nativeObj) {
            this.__nativeObj.setSSLEnable(ssl);
        }
    };
    KSocket.prototype.__internalUpdateSSL = function () {
        var state = this.__internalUpdate();
        var curNetStat = this.curNetState();
        if (-1 != state) {
            switch (this.prevNetState) {
            case 1: {
                    switch (curNetStat) {
                    case 2: {
                            BK.Script.log(1, 0, 'BK.Socket.update.ssl!connected, ip = ' + this.ip + ', port = ' + this.port);
                            break;
                        }
                    case 4:
                    case 5: {
                            break;
                        }
                    default: {
                            var curTs = BK.Time.clock;
                            var diffT = BK.Time.diffTime(this.prevConnTs, curTs);
                            if (diffT * 1000 >= this.curConnTimeout) {
                                this.curConnRetrys = this.curConnRetrys + 1;
                                if (this.curConnRetrys < this.options.ConnectRetryCount) {
                                    this.close();
                                    this.connect();
                                    this.curConnTimeout = this.curConnTimeout * 2;
                                } else {
                                    this.onTimeoutEvent(this);
                                    this.close();
                                }
                            }
                            return state;
                        }
                    }
                    break;
                }
            case 2: {
                    break;
                }
            case 4: {
                    switch (curNetStat) {
                    case 5: {
                            switch (state) {
                            case 2:
                            case 3: {
                                    this.onConnectedEvent(this);
                                    break;
                                }
                            }
                            break;
                        }
                    default: {
                            var curTs = BK.Time.clock;
                            var diffT = BK.Time.diffTime(this.prevConnTs, curTs);
                            if (diffT * 1000 >= this.curConnTimeout) {
                                this.curConnRetrys = this.curConnRetrys + 1;
                                if (this.curConnRetrys < this.options.ConnectRetryCount) {
                                    this.close();
                                    this.connect();
                                    this.curConnTimeout = this.curConnTimeout * 2;
                                } else {
                                    this.onTimeoutEvent(this);
                                    this.close();
                                }
                            }
                            return state;
                        }
                    }
                    break;
                }
            case 5: {
                    switch (curNetStat) {
                    case 5: {
                            this.onUpdateEvent(this);
                            break;
                        }
                    case 3: {
                            this.onDisconnectEvent(this);
                            break;
                        }
                    default: {
                            this.onErrorEvent(this);
                        }
                    }
                    break;
                }
            }
        } else {
            switch (this.prevNetState) {
            case 2:
            case 1: {
                    this.onDisconnectEvent(this);
                    break;
                }
            case 4:
            case 6:
            case 5: {
                    this.onErrorEvent(this);
                    break;
                }
            }
        }
        this.prevNetState = curNetStat;
        return state;
    };
    KSocket.prototype.__internalUpdateNoSSL = function () {
        var state = this.__internalUpdate();
        var curNetStat = this.curNetState();
        if (-1 != state) {
            switch (this.prevNetState) {
            case 1: {
                    switch (curNetStat) {
                    case 2: {
                            switch (state) {
                            case 2: {
                                    this.onConnectedEvent(this);
                                    break;
                                }
                            case 3: {
                                    BK.Script.log(1, 0, 'BK.Socket.update!unexcepted status');
                                    break;
                                }
                            }
                            break;
                        }
                    default: {
                            var curTs = BK.Time.clock;
                            var diffT = BK.Time.diffTime(this.prevConnTs, curTs);
                            if (diffT * 1000 >= this.curConnTimeout) {
                                this.curConnRetrys = this.curConnRetrys + 1;
                                if (this.curConnRetrys < this.options.ConnectRetryCount) {
                                    this.close();
                                    this.connect();
                                    this.curConnTimeout = this.curConnTimeout * 2;
                                } else {
                                    this.onTimeoutEvent(this);
                                    this.close();
                                }
                            }
                            return state;
                        }
                    }
                    break;
                }
            case 2: {
                    switch (curNetStat) {
                    case 2: {
                            this.onUpdateEvent(this);
                            break;
                        }
                    case 3: {
                            this.onDisconnectEvent(this);
                            break;
                        }
                    default: {
                            this.onErrorEvent(this);
                        }
                    }
                    break;
                }
            }
        } else {
            switch (this.prevNetState) {
            case 2:
            case 1: {
                    this.onDisconnectEvent(this);
                    break;
                }
            }
        }
        this.prevNetState = curNetStat;
        return state;
    };
    KSocket.prototype.curNetState = function () {
        if (this.__nativeObj) {
            return this.__nativeObj.state;
        }
        return 0;
    };
    KSocket.prototype.close = function () {
        var ret = this.__internalClose();
        if (!ret)
            this.prevNetState = 0;
        SocketEventMgr.Instance.del(this);
        return ret;
    };
    KSocket.prototype.send = function (data) {
        var ret = this.__internalSend(data);
        return ret;
    };
    KSocket.prototype.recv = function (length) {
        return this.__internalRecv(length);
    };
    KSocket.prototype.canRecvLength = function () {
        return this.__internalCanReadLength();
    };
    KSocket.prototype.update = function () {
        if (this.isEnableSSL()) {
            return this.__internalUpdateSSL();
        }
        return this.__internalUpdateNoSSL();
    };
    KSocket.prototype.connect = function () {
        var stat = this.curNetState();
        if (0 == stat || 3 == stat) {
            var ret = this.__internalConnect();
            if (!ret) {
                SocketEventMgr.Instance.add(this);
            }
            return ret;
        }
        return 0;
    };
    KSocket.prototype.isEnableSSL = function () {
        return this.__internalIsEnableSSL();
    };
    KSocket.prototype.enableSSL = function (ssl) {
        this.__internalEnableSSL(ssl);
    };
    KSocket.prototype.onErrorEvent = function (so) {
        BK.Script.log(1, 0, 'BK.Socket.ErrorEvent');
    };
    KSocket.prototype.onUpdateEvent = function (so) {
        return 0;
    };
    KSocket.prototype.onTimeoutEvent = function (so) {
        BK.Script.log(1, 0, 'BK.Socket.TimeoutEvent');
    };
    KSocket.prototype.onConnectingEvent = function (so) {
        BK.Script.log(1, 0, 'BK.Socket.ConnectingEvent');
    };
    KSocket.prototype.onConnectedEvent = function (so) {
        BK.Script.log(1, 0, 'BK.Socket.ConnectedEvent');
    };
    KSocket.prototype.onReconnectEvent = function (so) {
        BK.Script.log(1, 0, 'BK.Socket.ReconnectEvent');
    };
    KSocket.prototype.onDisconnectEvent = function (so) {
        BK.Script.log(1, 0, 'BK.Socket.DisconnectEvent');
    };
    return KSocket;
}();
var WebSocketData = function () {
    function WebSocketData(data, isBinary) {
        this.data = data;
        this.isBinary = isBinary;
    }
    return WebSocketData;
}();
var KWebSocket = function (_super) {
    __extends(KWebSocket, _super);
    function KWebSocket(ip, port, host, path, query) {
        var _this = _super.call(this, ip, port) || this;
        _this.path = path ? path : '/';
        _this.host = host;
        _this.query = query;
        _this.httpVer = 1.1;
        _this.httpParser = new HTTPParser(HTTPParser.RESPONSE);
        _this.version = 13;
        _this.protocols = new Array();
        _this.extensions = new Array();
        _this.delegate = {
            onOpen: null,
            onClose: null,
            onError: null,
            onMessage: null,
            onSendComplete: null
        };
        if (!_this.options) {
            _this.options = {};
        }
        _this.options.DrainSegmentCount = 8;
        _this.options.DefaultSegmentSize = 4096;
        _this.options.PingPongInterval = 0;
        _this.options.HandleShakeRequestTimeout = 10000;
        _this.options.HandleShakeResponseTimeout = 10000;
        _this.options.CloseAckTimeout = 20000;
        _this.options.PingPongTimeout = 3000;
        _this.clear();
        return _this;
    }
    KWebSocket.prototype.clear = function () {
        this.mask4 = new BK.Buffer(4, false);
        this.txbuf = new BK.Buffer(128, true);
        this.rxbuf = new BK.Buffer(128, true);
        this.txbufQue = new Array();
        this.rxbufQue = new Array();
        this.udataQue = new Array();
        this.peerClosed = false;
        this.txSegCount = 0;
        this.rxSegCount = 0;
        this.rxFrameType = -1;
        this.isFinalSeg = false;
        this.inTxSegFrame = false;
        this.inRxSegFrame = false;
        this.inPartialTxbuf = false;
        this.inPingFrame = false;
        this.inPongFrame = false;
        this.errcode = 65535;
        this.state = 0;
        this.parseState = 0;
        this.phaseTimeout = 0;
        this.pingpongTimer = 0;
        this.prevPhaseTickCount = 0;
        this.prevPingPongTickCount = 0;
    };
    KWebSocket.prototype.getReadyState = function () {
        return this.state;
    };
    KWebSocket.prototype.getErrorCode = function () {
        return this.errcode;
    };
    KWebSocket.prototype.getErrorString = function () {
        return this.message;
    };
    KWebSocket.prototype.randomN = function (n) {
        var b = new BK.Buffer(n, false);
        for (var i = 0; i < n; i++) {
            var r = Math.round(Math.random() * 65535);
            b.writeUint8Buffer(r);
        }
        return b;
    };
    KWebSocket.prototype.toHex = function (c) {
        if (c >= 0 && c <= 9)
            return c.toString();
        switch (c) {
        case 10:
            return 'A';
        case 11:
            return 'B';
        case 12:
            return 'C';
        case 13:
            return 'D';
        case 14:
            return 'E';
        case 15:
            return 'F';
        }
        return 'u';
    };
    KWebSocket.prototype.bufferToHexString = function (buf) {
        var s = '';
        buf.rewind();
        while (!buf.eof) {
            var c = buf.readUint8Buffer();
            s = s.concat('x' + this.toHex((c & 240) >> 4) + this.toHex(c & 15) + ' ');
        }
        return s;
    };
    KWebSocket.prototype.startPhaseTimeout = function (phase) {
        if (phase == 6) {
            this.phaseTimeout = phase;
            this.prevPhaseTickCount = 0;
        } else {
            switch (this.state) {
            case 2: {
                    if (phase == 1) {
                        this.phaseTimeout = phase;
                        this.prevPhaseTickCount = BK.Time.clock;
                    }
                    break;
                }
            case 3: {
                    if (phase == 2) {
                        this.phaseTimeout = phase;
                        this.prevPhaseTickCount = BK.Time.clock;
                    }
                    break;
                }
            case 1: {
                    if (phase == 3) {
                        this.phaseTimeout = phase;
                        this.prevPhaseTickCount = BK.Time.clock;
                    }
                    break;
                }
            case 4: {
                    switch (phase) {
                    case 4: {
                            this.options.PingPongTimeout = Math.min(this.options.PingPongTimeout, this.options.PingPongInterval);
                            break;
                        }
                    }
                    this.phaseTimeout = phase;
                    this.prevPhaseTickCount = BK.Time.clock;
                    break;
                }
            }
        }
    };
    KWebSocket.prototype.handlePhaseTimeout = function () {
        if (this.phaseTimeout == 6)
            return;
        var interval = BK.Time.diffTime(this.prevPhaseTickCount, BK.Time.clock);
        switch (this.phaseTimeout) {
        case 1: {
                if (interval * 1000 > this.options.HandleShakeRequestTimeout) {
                    BK.Script.log(1, 0, 'BK.WebSocket.handlePhaseTimeout!handshake request timeout');
                    this.prevPhaseTickCount = BK.Time.clock;
                    this.state = -1;
                    this.errcode = 4096;
                    this.message = 'handshake request timeout';
                    _super.prototype.close.call(this);
                    if (this.delegate.onError) {
                        this.delegate.onError(this);
                    }
                }
                break;
            }
        case 2: {
                if (interval * 1000 > this.options.HandleShakeResponseTimeout) {
                    BK.Script.log(1, 0, 'BK.WebSocket.handlePhaseTimeout!handshake response timeout');
                    this.prevPhaseTickCount = BK.Time.clock;
                    this.state = -1;
                    this.errcode = 4097;
                    this.message = 'handshake response timeout';
                    _super.prototype.close.call(this);
                    if (this.delegate.onError) {
                        this.delegate.onError(this);
                    }
                }
                break;
            }
        case 3: {
                if (interval * 1000 > this.options.CloseAckTimeout) {
                    BK.Script.log(1, 0, 'BK.WebSocket.handlePhaseTimeout!close ack timeout');
                    this.prevPhaseTickCount = BK.Time.clock;
                    if (1 == this.state) {
                        if (!this.peerClosed) {
                            this.errcode = 1006;
                            this.message = 'abnormal close';
                            this.startPhaseTimeout(6);
                        }
                        _super.prototype.close.call(this);
                        if (this.delegate.onError) {
                            this.delegate.onError(this);
                        }
                    }
                }
                break;
            }
        case 4: {
                if (interval * 1000 > this.options.PingPongTimeout) {
                    BK.Script.log(1, 0, 'BK.WebSocket.handlePhaseTimeout!receive pong timeout');
                    this.prevPhaseTickCount = BK.Time.clock;
                }
                break;
            }
        }
    };
    KWebSocket.prototype.restartPingPongTimer = function () {
        if (4 == this.state && this.options.PingPongInterval > 0) {
            this.prevPingPongTickCount = BK.Time.clock;
        }
    };
    KWebSocket.prototype.handlePingPongTimer = function () {
        if (4 == this.state && this.options.PingPongInterval > 0) {
            var interval = BK.Time.diffTime(this.prevPingPongTickCount, BK.Time.clock);
            if (interval * 1000 > this.options.PingPongInterval) {
                this.inPingFrame = false;
                this.txPingData = this.randomN(16);
                this.sendPingFrame(this.txPingData);
                this.restartPingPongTimer();
            }
        }
    };
    KWebSocket.prototype.doHandshakePhase = function () {
        var s = '';
        s = s.concat('GET ' + this.path + ' HTTP/' + this.httpVer + '\r\n');
        if (this.port == 80 || this.port == 443) {
            s = s.concat('Host:' + this.host + '\r\n');
        } else {
            s = s.concat('Host:' + this.host + ':' + this.port + '\r\n');
        }
        s = s.concat('Upgrade:websocket\r\n');
        s = s.concat('Connection:Upgrade\r\n');
        var r16 = this.randomN(16);
        var s64 = BK.Misc.encodeBase64FromBuffer(r16);
        s = s.concat('Sec-WebSocket-Key:' + s64 + '\r\n');
        s = s.concat('Sec-WebSocket-Version:' + this.version + '\r\n');
        if (this.query) {
            var qa = this.query.split('&');
            for (var i = 0; i < qa.length; i++) {
                var kv = qa[i].split('=');
                if (kv.length > 0) {
                    s = s.concat(kv[0] + ':' + kv[1] + '\r\n');
                }
            }
        }
        s = s.concat('\r\n');
        var sha = BK.Misc.sha1(s64.concat('258EAFA5-E914-47DA-95CA-C5AB0DC85B11'));
        this.handshakeSig = BK.Misc.encodeBase64FromBuffer(sha);
        var data = new BK.Buffer(s.length, false);
        data.writeAsString(s, false);
        _super.prototype.send.call(this, data);
        this.state = 2;
        this.startPhaseTimeout(1);
    };
    KWebSocket.prototype.doSvrHandshakePhase1 = function (resp) {
        var _this = this;
        if (!resp)
            return;
        if (!this.httpParser.onComplete) {
            this.httpParser.onComplete = function () {
                for (var k in _this.httpParser.headers) {
                }
                if (!_this.doSvrHandshakePhase2()) {
                    _this.errcode = 4098;
                    _this.message = 'handshake parse error';
                    _this.startPhaseTimeout(6);
                    _super.prototype.close.call(_this);
                    if (_this.delegate.onError) {
                        _this.delegate.onError(_this);
                    }
                } else {
                    _this.restartPingPongTimer();
                    _this.startPhaseTimeout(6);
                    if (_this.delegate.onOpen) {
                        _this.delegate.onOpen(_this);
                    }
                }
            };
        }
        this.httpParser.execute(resp);
        if (2 == this.state) {
            this.state = 3;
            this.startPhaseTimeout(2);
        }
    };
    KWebSocket.prototype.doSvrHandshakePhase2 = function () {
        switch (this.httpParser.statusCode) {
        case 101: {
                if (undefined == this.httpParser.headers['upgrade']) {
                    this.state = -1;
                    BK.Script.log(1, 0, 'BK.WebSocket.doSvrHandshakePhase2!missing \'upgrade\' header');
                    return false;
                }
                if (undefined == this.httpParser.headers['connection']) {
                    this.state = -1;
                    BK.Script.log(1, 0, 'BK.WebSocket.doSvrHandshakePhase2!missing \'connection\' header');
                    return false;
                }
                if ('upgrade' != this.httpParser.headers['connection'].toLowerCase()) {
                    this.state = -1;
                    BK.Script.log(1, 0, 'BK.WebSocket.doSvrHandshakePhase2!error \'connection\' header');
                    return false;
                }
                if (undefined == this.httpParser.headers['sec-websocket-accept']) {
                    this.state = -1;
                    BK.Script.log(1, 0, 'BK.WebSocket.doSvrHandshakePhase2!missing \'sec-websocket-accept\' header');
                    return false;
                }
                if (this.handshakeSig != this.httpParser.headers['sec-websocket-accept']) {
                    this.state = -1;
                    BK.Script.log(1, 0, 'BK.WebSocket.doSvrHandshakePhase2!error \'sec-websocket-accept\' header');
                    return false;
                }
                this.state = 4;
                return true;
            }
        case 401: {
                break;
            }
        }
        return false;
    };
    KWebSocket.prototype.doFrameDataPhase = function (data, opCode, moreSegs) {
        if (moreSegs === void 0) {
            moreSegs = false;
        }
        var total = 6;
        var length = data.length;
        if (this.extensions.length > 0) {
        }
        total = total + length;
        var buf = new BK.Buffer(total, false);
        var bitMask = 0;
        var isMask = false;
        switch (this.version) {
        case 13: {
                isMask = true;
                bitMask = 128;
                break;
            }
        }
        var fin = true;
        switch (opCode) {
        case 1:
        case 2: {
                if (moreSegs) {
                    if (!this.inTxSegFrame) {
                        fin = false;
                        this.inTxSegFrame = true;
                    } else {
                        fin = false;
                        opCode = 0;
                    }
                } else {
                    if (this.inTxSegFrame) {
                        opCode = 0;
                    }
                }
                break;
            }
        }
        if (!fin) {
            buf.writeUint8Buffer(15 & opCode);
        } else {
            buf.writeUint8Buffer(128 | 15 & opCode);
        }
        if (length < 126) {
            buf.writeUint8Buffer(bitMask | 127 & data.length);
        } else {
            if (length < 65536) {
                buf.writeUint8Buffer(bitMask | 126);
                if (KWebSocket.isLittleEndian) {
                    buf.writeUint8Buffer((65280 & length) >> 8);
                    buf.writeUint8Buffer(255 & length);
                } else {
                    buf.writeUint8Buffer(255 & length);
                    buf.writeUint8Buffer((65280 & length) >> 8);
                }
            } else {
                BK.Script.log(1, 0, 'BK.WebSocket.doFrameDataPhase!js don\'t support 64bit data type');
            }
        }
        if (isMask) {
            var mask = this.randomN(4);
            BK.Misc.encodeBufferXorMask4(data, mask);
            buf.writeBuffer(mask);
        }
        buf.writeBuffer(data);
        return buf;
    };
    KWebSocket.prototype.doSvrFrameDataPhase = function (data) {
        if (!data)
            return true;
        while (!data.eof) {
            switch (this.parseState) {
            case 0: {
                    this.mask4.rewind();
                    this.rxbuf = new BK.Buffer(this.options.DefaultSegmentSize, true);
                    this.maskBit = 0;
                    this.rxbuflen = 0;
                    this.isFinalSeg = false;
                    this.parseState = 1;
                }
            case 1: {
                    var hdr1 = data.readUint8Buffer();
                    if (hdr1 & 128) {
                        this.isFinalSeg = true;
                    } else {
                        this.isFinalSeg = false;
                    }
                    this.opcode = hdr1 & 15;
                    switch (this.version) {
                    case 13: {
                            switch (this.opcode) {
                            case 3:
                            case 4:
                            case 5:
                            case 6:
                            case 7:
                            case 11:
                            case 12:
                            case 13:
                            case 14:
                            case 15:
                                this.errcode = 1002;
                                this.message = 'protocol error';
                                BK.Script.log(1, 0, 'BK.WebSocket.doSvrFrameDataPhase!unknown opcode = ' + this.opcode);
                                return false;
                            }
                            break;
                        }
                    }
                    switch (this.opcode) {
                    case 8:
                    case 9:
                    case 10:
                    case 0:
                        break;
                    default: {
                            if (!this.isFinalSeg) {
                                if (this.opcode != 1 && this.opcode != 2) {
                                    this.errcode = 1003;
                                    this.message = 'unsupported data';
                                    BK.Script.log(1, 0, 'BK.WebSocket.doSvrFrameDataPhase!illegal opcode = ' + this.opcode);
                                    return false;
                                }
                            }
                            if (-1 == this.rxFrameType) {
                                this.rxFrameType = this.opcode;
                            } else if (this.rxFrameType != this.opcode) {
                                this.errcode = 1002;
                                this.message = 'protocol error';
                                BK.Script.log(1, 0, 'BK.WebSocket.doSvrFrameDataPhase!rxFrameType = ' + this.rxFrameType + ', illegal opcode = ' + this.opcode);
                                return false;
                            }
                        }
                    }
                    this.parseState = 2;
                    if (data.eof)
                        return true;
                }
            case 2: {
                    var hdrLen = data.readUint8Buffer();
                    this.maskBit = (128 & hdrLen) >> 7;
                    switch (127 & hdrLen) {
                    case 126: {
                            this.parseState = 3;
                            if (data.eof)
                                return true;
                            break;
                        }
                    case 127: {
                            this.parseState = 5;
                            if (data.eof)
                                return true;
                            break;
                        }
                    default: {
                            this.rxbuflen = 127 & hdrLen;
                            if (this.maskBit == 1) {
                                this.parseState = 13;
                            } else {
                                this.parseState = 17;
                            }
                            if (this.rxbuflen > 0 && data.eof)
                                return true;
                        }
                    }
                }
            }
            switch (this.parseState) {
            case 3: {
                    var n = data.readUint8Buffer();
                    if (KWebSocket.isLittleEndian) {
                        this.rxbuflen |= (255 & n) << 8;
                    } else {
                        this.rxbuflen |= 255 & n;
                    }
                    if (data.eof)
                        return true;
                }
            case 4: {
                    var n = data.readUint8Buffer();
                    if (KWebSocket.isLittleEndian) {
                        this.rxbuflen |= 255 & n;
                    } else {
                        this.rxbuflen |= (255 & n) << 8;
                    }
                    if (this.maskBit == 1) {
                        this.parseState = 13;
                    } else {
                        this.parseState = 17;
                    }
                    if (this.rxbuflen > 0 && data.eof) {
                        return true;
                    }
                    break;
                }
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
            case 11:
            case 12: {
                    this.errcode = 1002;
                    this.message = 'protocol errors';
                    BK.Script.log(1, 0, 'BK.WebSocket.doSvrFrameDataPhase!js don\'t support 64bit data type');
                    return false;
                }
            }
            switch (this.parseState) {
            case 13: {
                    this.mask4.writeUint8Buffer(data.readUint8Buffer());
                    this.parseState = 14;
                    if (data.eof)
                        return true;
                }
            case 14: {
                    this.mask4.writeUint8Buffer(data.readUint8Buffer());
                    this.parseState = 15;
                    if (data.eof)
                        return true;
                }
            case 15: {
                    this.mask4.writeUint8Buffer(data.readUint8Buffer());
                    this.parseState = 16;
                    if (data.eof)
                        return true;
                }
            case 16: {
                    this.mask4.writeUint8Buffer(data.readUint8Buffer());
                    this.parseState = 17;
                    if (data.eof)
                        return true;
                }
            }
            if (17 == this.parseState) {
                var relen = data.length - data.pointer;
                if (relen <= this.rxbuflen - this.rxbuf.length) {
                    this.rxbuf.writeBuffer(data.readBuffer(relen));
                } else {
                    this.rxbuf.writeBuffer(data.readBuffer(this.rxbuflen - this.rxbuf.length));
                }
                if (this.rxbuf.length == this.rxbuflen) {
                    this.rxSegCount = this.rxSegCount + 1;
                    this.parseState = 0;
                    if (this.isFinalSeg) {
                        this.rxbuf.rewind();
                        switch (this.opcode) {
                        case 8: {
                                BK.Script.log(0, 0, 'BK.WebSocket.doSvrFrameDataPhase!receive close frame');
                                this.handleCloseFrame();
                                break;
                            }
                        case 9: {
                                BK.Script.log(0, 0, 'BK.WebSocket.doSvrFrameDataPhase!receive ping frame');
                                this.handlePingFrame();
                                break;
                            }
                        case 10: {
                                BK.Script.log(0, 0, 'BK.WebSocket.doSvrFrameDataPhase!receive pong frame');
                                this.handlePongFrame();
                                break;
                            }
                        default: {
                                this.rxbufQue.push(this.rxbuf);
                                this.recvFrameFromRxQ(this.rxFrameType);
                                this.rxSegCount = 0;
                                this.rxFrameType = -1;
                            }
                        }
                    } else {
                        this.rxbuf.rewind();
                        this.rxbufQue.push(this.rxbuf);
                    }
                }
            }
        }
        return true;
    };
    KWebSocket.prototype.handleCloseFrame = function () {
        this.peerClosed = true;
        if (4 == this.state) {
            var errcode = this.rxbuf.readUint16Buffer();
            var msgbuff = this.rxbuf.readBuffer(this.rxbuflen - 2);
            if (!errcode) {
                this.errcode = 1005;
                this.message = 'no status recv';
            } else {
                this.errcode = errcode;
                this.message = msgbuff.readAsString();
            }
            BK.Script.log(1, 0, 'BK.WebSocket.handleCloseFrame!errcode = ' + this.errcode + ', msg = ' + this.message);
            this.sendCloseFrame(this.errcode, this.message);
        } else if (1 == this.state) {
            BK.Script.log(1, 0, 'BK.WebSocket.handleCloseFrame!normal closed');
            this.close();
            this.state = 0;
            if (this.delegate.onClose) {
                this.delegate.onClose(this);
            }
        }
    };
    KWebSocket.prototype.handlePingFrame = function () {
        if (4 == this.state) {
            if (this.rxbuflen > 128 - 3) {
                this.errcode = 4099;
                this.message = 'ping packet large';
                return;
            }
            if (this.inPongFrame) {
                BK.Script.log(1, 0, 'BK.WebSocket.handlePingFrame!already recv ping, drop it.');
                return;
            }
            this.rxPongData = new BK.Buffer(this.rxbuflen, true);
            this.rxPongData.writeBuffer(this.rxbuf.readBuffer(this.rxbuflen));
            this.sendPongFrame(this.rxPongData);
        }
    };
    KWebSocket.prototype.handlePongFrame = function () {
        if (4 == this.state) {
            var data = new BK.Buffer(this.rxbuflen, true);
            data.writeBuffer(this.rxbuf.readBuffer(this.rxbuflen));
            this.startPhaseTimeout(6);
            BK.Script.log(0, 0, 'BK.WebSocket.handlePongFrame!pong data = ' + this.bufferToHexString(data));
        }
    };
    KWebSocket.prototype.sendFrameFromTxQ = function (t) {
        if (4 != this.state)
            return;
        if (this.inPartialTxbuf) {
            var txBytes = _super.prototype.send.call(this, this.txbuf);
            if (txBytes > 0) {
                this.restartPingPongTimer();
                if (txBytes < this.txbuf.length) {
                    var cap = this.txbuf.length - txBytes;
                    var buf = new BK.Buffer(cap, false);
                    this.txbuf.rewind();
                    this.txbuf.jumpBytes(txBytes);
                    buf.writeBuffer(this.txbuf.readBuffer(cap));
                    this.txbuf = buf;
                    return false;
                }
                this.inPartialTxbuf = false;
            } else {
                BK.Script.log(1, txBytes, 'BK.WebSocket.sendFrameFromTxQ!partial send failed, data type = ' + t);
                return false;
            }
        }
        var succ = true;
        var n = Math.min(this.options.DrainSegmentCount, this.txbufQue.length);
        for (; n > 0; n--) {
            var data = this.txbufQue.shift();
            var moreSegs = this.txbufQue.length > 0;
            var frameData = this.doFrameDataPhase(data, t, moreSegs);
            var txBytes = _super.prototype.send.call(this, frameData);
            if (txBytes > 0) {
                this.restartPingPongTimer();
                if (txBytes < frameData.length) {
                    frameData.rewind();
                    frameData.jumpBytes(txBytes);
                    this.txbuf.rewind();
                    this.txbuf.writeBuffer(frameData.readBuffer(frameData.length - txBytes));
                    this.inPartialTxbuf = true;
                    succ = false;
                    BK.Script.log(1, 0, 'BK.WebSocket.sendFrameFromTxQ!partial send, total size = ' + frameData.length + ', tx size = ' + txBytes);
                    break;
                }
            } else {
                succ = false;
                BK.Script.log(1, txBytes, 'BK.WebSocket.sendFrameFromTxQ!send failed, data type = ' + t);
                break;
            }
        }
        if (succ) {
            if (!this.txbufQue.length && this.inTxSegFrame) {
                this.inTxSegFrame = false;
            }
        }
        return succ;
    };
    KWebSocket.prototype.recvFrameFromRxQ = function (t) {
        var isBinary = t == 2;
        var udata = new BK.Buffer(128, true);
        while (this.rxbufQue.length > 0) {
            var rxbuf = this.rxbufQue.shift();
            udata.writeBuffer(rxbuf);
            if (false == isBinary) {
                udata.writeUint8Buffer(0);
            }
        }
        udata.rewind();
        this.udataQue.push(new WebSocketData(udata, isBinary));
    };
    KWebSocket.prototype.__sendBinaryFrame = function (data, frameType) {
        var totLen = data.length;
        var segLen = this.options.DefaultSegmentSize;
        var offset = 0;
        data.rewind();
        while (totLen > segLen) {
            var buf = new BK.Buffer(segLen, false);
            data.rewind();
            data.jumpBytes(offset);
            buf.writeBuffer(data.readBuffer(segLen));
            buf.rewind();
            this.txbufQue.push(buf);
            offset = offset + segLen;
            totLen = totLen - segLen;
        }
        if (totLen > 0) {
            var buf = new BK.Buffer(totLen, false);
            data.rewind();
            data.jumpBytes(offset);
            buf.writeBuffer(data.readBuffer(totLen));
            buf.rewind();
            this.txbufQue.push(buf);
        }
        this.txFrameType = frameType;
        return this.sendFrameFromTxQ(frameType);
    };
    KWebSocket.prototype.sendTextFrame = function (text) {
        if (4 != this.state)
            return false;
        var data = new BK.Buffer(128, true);
        data.writeAsString(text, false);
        data.rewind();
        return this.__sendBinaryFrame(data, 1);
    };
    KWebSocket.prototype.sendBinaryFrame = function (data) {
        if (4 != this.state)
            return;
        return this.__sendBinaryFrame(data, 2);
    };
    KWebSocket.prototype.sendCloseFrame = function (code, reason) {
        if (this.isSendClose)
            return;
        this.isSendClose = true;
        var buf = new BK.Buffer(reason.length + 1, false);
        var data = new BK.Buffer(3 + reason.length, false);
        if (KWebSocket.isLittleEndian) {
            data.writeUint8Buffer((65280 & code) >> 8);
            data.writeUint8Buffer(255 & code);
        } else {
            data.writeUint8Buffer(255 & code);
            data.writeUint8Buffer((65280 & code) >> 8);
        }
        buf.writeAsString(reason, true);
        data.writeBuffer(buf);
        var frameData = this.doFrameDataPhase(data, 8);
        _super.prototype.send.call(this, frameData);
        this.state = 1;
        this.startPhaseTimeout(3);
        BK.Script.log(1, 0, 'BK.WebSocket.sendCloseFrame!code = ' + code + ', reason = ' + reason);
    };
    KWebSocket.prototype.sendPingFrame = function (data) {
        if (this.inPingFrame)
            return;
        BK.Script.log(0, 0, 'BK.WebSocket.sendPingFrame!ping data = ' + this.bufferToHexString(data));
        var frameData = this.doFrameDataPhase(data, 9);
        _super.prototype.send.call(this, frameData);
        this.inPingFrame = true;
        this.startPhaseTimeout(4);
    };
    KWebSocket.prototype.sendPongFrame = function (data) {
        if (this.inPongFrame)
            return;
        var frameData = this.doFrameDataPhase(data, 10);
        _super.prototype.send.call(this, frameData);
        this.inPongFrame = true;
    };
    KWebSocket.prototype.onErrorEvent = function (so) {
        if (this.state == 0 || this.state == 1)
            return;
        _super.prototype.onErrorEvent.call(this, so);
        this.state = -1;
        this.errcode = 1006;
        this.message = 'abnormal closure';
        if (this.delegate.onError) {
            this.delegate.onError(this);
        }
    };
    KWebSocket.prototype.onTimeoutEvent = function (so) {
        _super.prototype.onErrorEvent.call(this, so);
        this.state = 0;
        this.errcode = -1000;
        this.message = 'socket connect timeout';
        if (this.delegate.onError) {
            this.delegate.onError(this);
        }
    };
    KWebSocket.prototype.onDisconnectEvent = function (so) {
        _super.prototype.onDisconnectEvent.call(this, so);
        switch (this.state) {
        case 2:
        case 3:
        case 4: {
                this.state = -1;
                this.errcode = 1006;
                this.message = 'abnormal closure';
                if (this.delegate.onError) {
                    this.delegate.onError(this);
                }
                break;
            }
        case 1: {
                this.state = 0;
                if (this.delegate.onClose) {
                    this.delegate.onClose(this);
                }
                BK.Script.log(1, 0, 'BK.WebSocket.onDisconnectEvent!enter closed state');
                break;
            }
        }
    };
    KWebSocket.prototype.onConnectedEvent = function (so) {
        _super.prototype.onConnectedEvent.call(this, so);
        if (0 == this.state) {
            this.clear();
            this.doHandshakePhase();
        }
    };
    KWebSocket.prototype.onUpdateEvent = function (so) {
        _super.prototype.onUpdateEvent.call(this, so);
        switch (this.state) {
        case 2:
        case 3: {
                var rlen = so.canRecvLength();
                if (rlen > 0) {
                    var buf = this.recv(rlen);
                    if (undefined != buf) {
                        this.doSvrHandshakePhase1(buf.readAsString(true));
                    }
                }
                this.handlePhaseTimeout();
                break;
            }
        case 4: {
                var rlen = so.canRecvLength();
                if (rlen > 0) {
                    var rbuf = this.recv(rlen);
                    while (!rbuf.eof) {
                        if (!this.doSvrFrameDataPhase(rbuf)) {
                            this.sendCloseFrame(this.errcode, this.message);
                            if (this.delegate.onError) {
                                this.delegate.onError(this);
                            }
                            break;
                        }
                    }
                }
                if (this.delegate.onMessage) {
                    while (this.udataQue.length > 0) {
                        var udata = this.udataQue.shift();
                        this.delegate.onMessage(this, udata);
                    }
                }
                if (this.txbufQue.length > 0) {
                    this.sendFrameFromTxQ(this.txFrameType);
                } else if (this.delegate.onSendComplete) {
                    this.delegate.onSendComplete(this);
                }
                this.inPongFrame = false;
                this.handlePhaseTimeout();
                this.handlePingPongTimer();
                break;
            }
        case 1: {
                var rlen = so.canRecvLength();
                if (rlen > 0 && this.doSvrFrameDataPhase(this.recv(rlen))) {
                    if (this.delegate.onMessage) {
                        while (this.udataQue.length > 0) {
                            var udata = this.udataQue.shift();
                            this.delegate.onMessage(this, udata);
                        }
                    }
                }
                this.handlePhaseTimeout();
                break;
            }
        }
        return 0;
    };
    return KWebSocket;
}(KSocket);
KWebSocket.isLittleEndian = BK.Misc.isLittleEndian();
var TxData = function () {
    function TxData(data, isBinary) {
        this.data = data;
        this.isBinary = isBinary;
    }
    return TxData;
}();
;
var WebSocket = function () {
    function WebSocket(url) {
        var _this = this;
        this.__url = url;
        this.options = null;
        this.inTrans = false;
        this.isPendingConn = true;
        this.txdataQ = new Array();
        var res = BK.URL('{}', url);
        this.scheme = res.protocol;
        this.port = res.port;
        this.path = res.path;
        this.query = res.query;
        this.host = res.hostname;
        BK.DNS.queryIPAddress(res.hostname, function (reason, af, iplist) {
            switch (reason) {
            case 0: {
                    BK.Script.log(1, 0, 'BK.WebSocket.queryIPAddress!iplist = ' + JSON.stringify(iplist));
                    _this.iplist = iplist;
                    _this.__nativeObj = new KWebSocket(iplist[0], _this.port, _this.host, _this.path, _this.query);
                    if (_this.scheme == 'wss') {
                        _this.__nativeObj.enableSSL(true);
                    }
                    if (_this.options) {
                        _this.setOptions(_this.options);
                        _this.options = null;
                    }
                    if (_this.isPendingConn) {
                        _this.connect();
                        _this.isPendingConn = false;
                    }
                    _this.__nativeObj.delegate.onOpen = function (kws) {
                        if (_this.txdataQ.length > 0) {
                            _this.send(_this.txdataQ.shift());
                        }
                        if (_this.onOpen) {
                            _this.onOpen(_this);
                        } else if (_this.onopen) {
                            _this.onopen.call(_this);
                        }
                    };
                    _this.__nativeObj.delegate.onClose = function (kws) {
                        var event = {};
                        event.code = _this.getErrorCode();
                        event.reason = _this.getErrorString();
                        if (_this.onClose) {
                            _this.onClose(_this, event);
                        } else if (_this.onclose) {
                            _this.onclose.call(_this, event);
                        }
                    };
                    _this.__nativeObj.delegate.onError = function (kws) {
                        var event = {};
                        event.code = _this.getErrorCode();
                        event.reason = _this.getErrorString();
                        if (_this.onError) {
                            _this.onError(_this, event);
                        } else if (_this.onerror) {
                            _this.onerror.call(_this, event);
                        }
                    };
                    _this.__nativeObj.delegate.onMessage = function (kws, event) {
                        if (_this.onMessage) {
                            _this.onMessage(_this, event);
                        } else if (_this.onmessage) {
                            if (event.isBinary == true) {
                                var buf = event.data;
                                buf.rewind();
                                var ab = new ArrayBuffer(buf.length);
                                var da = new DataView(ab);
                                while (!buf.eof) {
                                    da.setUint8(buf.pointer, buf.readUint8Buffer());
                                }
                                event.data = ab;
                            }
                            _this.onmessage.call(_this, event);
                        }
                    };
                    _this.__nativeObj.delegate.onSendComplete = function (kws) {
                        if (_this.txdataQ.length > 0) {
                            var txdata = _this.txdataQ.shift();
                            if (!txdata.isBinary)
                                _this.__nativeObj.sendTextFrame(txdata.data);
                            else
                                _this.__sendBinaryFrame(txdata.data);
                            _this.inTrans = true;
                        } else {
                            _this.inTrans = false;
                        }
                    };
                    break;
                }
            }
        });
    }
    Object.defineProperty(WebSocket.prototype, 'url', {
        get: function () {
            return this.__url;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebSocket.prototype, 'readyState', {
        get: function () {
            return this.getReadyState();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebSocket.prototype, 'bufferedAmount', {
        get: function () {
            var bufferdAmount = 0;
            for (var i = 0; i < this.txdataQ.length; i++) {
                bufferdAmount = bufferdAmount + this.txdataQ[i].data.length;
            }
            return bufferdAmount;
        },
        enumerable: true,
        configurable: true
    });
    WebSocket.prototype.__sendBinaryFrame = function (data) {
        if (Object.prototype.hasOwnProperty.call(data, '__rawBKData')) {
            return this.__nativeObj.sendBinaryFrame(data.__rawBKData);
        }
        if (data instanceof Int8Array == true || data instanceof Uint8Array == true || data instanceof Int16Array == true || data instanceof Uint16Array == true || data instanceof Int32Array == true || data instanceof Uint32Array == true || data instanceof Float32Array == true) {
            var bf = new BK.Buffer(data.byteLength);
            var da = new DataView(data.buffer);
            for (var i = 0; i < data.byteLength; i++) {
                bf.writeUint8Buffer(da.getUint8(i));
            }
            return this.__nativeObj.sendBinaryFrame(bf);
        } else if (data instanceof ArrayBuffer == true) {
            var bf = new BK.Buffer(data.byteLength);
            var da = new DataView(data);
            for (var i = 0; i < data.byteLength; i++) {
                bf.writeUint8Buffer(da.getUint8(i));
            }
            return this.__nativeObj.sendBinaryFrame(bf);
        }
        return this.__nativeObj.sendBinaryFrame(data);
    };
    WebSocket.prototype.getReadyState = function () {
        if (this.__nativeObj) {
            return this.__nativeObj.getReadyState();
        }
        return 0;
    };
    WebSocket.prototype.getErrorCode = function () {
        if (this.__nativeObj) {
            return this.__nativeObj.getErrorCode();
        }
        return 65535;
    };
    WebSocket.prototype.getErrorString = function () {
        if (this.__nativeObj) {
            return this.__nativeObj.getErrorString();
        }
        return '';
    };
    WebSocket.prototype.close = function () {
        var state = this.getReadyState();
        if (4 == state) {
            this.__nativeObj.sendCloseFrame(1000, 'see ya');
        }
    };
    WebSocket.prototype.connect = function () {
        if (this.__nativeObj) {
            return this.__nativeObj.connect() != 0;
        }
        return true;
    };
    WebSocket.prototype.send = function (data) {
        var state = this.getReadyState();
        if (1 == state || 0 == state) {
            return false;
        }
        if (typeof data == 'string') {
            if (this.inTrans || state != 4) {
                this.txdataQ.push(new TxData(data, false));
            } else {
                this.inTrans = true;
                return this.__nativeObj.sendTextFrame(data);
            }
        } else if (typeof data == 'object') {
            if (this.inTrans || state != 4) {
                this.txdataQ.push(new TxData(data, true));
            } else {
                this.inTrans = true;
                return this.__sendBinaryFrame(data);
            }
        }
        return false;
    };
    WebSocket.prototype.setOptions = function (options) {
        if (!this.__nativeObj) {
            this.options = options;
            return;
        }
        if (options.DrainSegmentCount)
            this.__nativeObj.options.DrainSegmentCount = options.DrainSegmentCount;
        if (options.DefaultSegmentSize)
            this.__nativeObj.options.DefaultSegmentSize = options.DefaultSegmentSize;
        if (options.PingPongInterval)
            this.__nativeObj.options.PingPongInterval = options.PingPongInterval;
        if (options.HandleShakeRequestTimeout)
            this.__nativeObj.options.HandleShakeRequestTimeout = options.HandleShakeRequestTimeout;
        if (options.HandleShakeResponseTimeout)
            this.__nativeObj.options.HandleShakeResponseTimeout = options.HandleShakeResponseTimeout;
        if (options.CloseAckTimeout)
            this.__nativeObj.options.CloseAckTimeout = options.CloseAckTimeout;
        if (options.PingPongTimeout)
            this.__nativeObj.options.PingPongTimeout = options.PingPongTimeout;
    };
    return WebSocket;
}();
BK.WebSocket = WebSocket;
var SheetSprite = function () {
    function SheetSprite(textureInfo, width, height, flipU, flipV, stretchX, stretchY) {
        this.size = {
            width: 0,
            height: 0
        };
        this.flipU = 0;
        this.flipV = 1;
        this.stretchX = 1;
        this.stretchY = 1;
        if (flipU) {
            this.flipU = flipU;
        }
        if (flipV) {
            this.flipV = flipV;
        }
        if (stretchX) {
            this.stretchX = stretchX;
        }
        if (stretchY) {
            this.stretchY = stretchY;
        }
        if (width) {
            this.size.width = width;
        }
        if (height) {
            this.size.height = height;
        }
        this.textureInfo = textureInfo;
        this.onInit(this.size.width, this.size.height);
        this.adjustWithTextureInfo(textureInfo);
    }
    SheetSprite.prototype.onInit = function (width, height) {
        this.createSprites(width, height);
        var names = Object.getOwnPropertyNames(this.__nativeObj);
        names.forEach(function (element) {
            var key = element;
            Object.defineProperty(this, key, {
                get: function () {
                    return this.__nativeObj[key];
                },
                set: function (obj) {
                    this.__nativeObj[key] = obj;
                }
            });
        }, this);
        Object.defineProperty(this, 'size', {
            get: function () {
                return this.__nativeObj.size;
            },
            set: function (obj) {
                this.__nativeObj.size = obj;
                this.updateSize(this.textureInfo);
            }
        });
    };
    SheetSprite.prototype.updateSize = function (textureInfo) {
        if (textureInfo.frameInfo.trimmed == true) {
            var x = textureInfo.frameInfo.spriteSourceSize.x;
            var y = textureInfo.frameInfo.spriteSourceSize.y;
            var w = textureInfo.frameInfo.spriteSourceSize.w;
            var h = textureInfo.frameInfo.spriteSourceSize.h;
            var srcSize = textureInfo.frameInfo.sourceSize;
            var currSize = this.__nativeObj.size;
            x = currSize.width * x / srcSize.w;
            y = currSize.height * y / srcSize.h;
            w = currSize.width * w / srcSize.w;
            h = currSize.height * h / srcSize.h;
            this.contentSprite.position = {
                x: x,
                y: y
            };
            this.contentSprite.size = {
                width: w,
                height: h
            };
        } else {
            this.contentSprite.size = this.__nativeObj.size;
        }
    };
    SheetSprite.prototype.adjustWithTextureInfo = function (textureInfo) {
        if (textureInfo) {
            this.textureInfo = textureInfo;
            var tex = textureInfo.texture;
            var frameInfo = textureInfo.frameInfo;
            this.updateSize(textureInfo);
            this.currTexturePath = textureInfo.texturePath;
            var tex = new BK.Texture(this.currTexturePath);
            this.contentSprite.setTexture(tex);
            this.contentSprite.adjustTexturePosition(frameInfo.frame.x, frameInfo.frame.y, frameInfo.frame.w, frameInfo.frame.h, frameInfo.rotated);
        }
    };
    SheetSprite.prototype.setTexture = function (tex) {
        this.__nativeObj.setTexture(tex);
    };
    SheetSprite.prototype.dispose = function () {
        BK.Director.ticker.remove(this);
        this.__nativeObj.dispose();
    };
    SheetSprite.prototype.removeChild = function (child) {
        return this.__nativeObj.removeChild(child);
    };
    SheetSprite.prototype.removeChildById = function (id, dispose) {
        return this.__nativeObj.removeChildById(id, dispose);
    };
    SheetSprite.prototype.removeChildByName = function (name, dispose) {
        return this.__nativeObj.removeChildByName(name, dispose);
    };
    SheetSprite.prototype.removeFromParent = function () {
        return this.__nativeObj.removeFromParent();
    };
    SheetSprite.prototype.addChild = function (child, index) {
        return this.__nativeObj.addChild(child, index);
    };
    SheetSprite.prototype.hittest = function (position) {
        return this.__nativeObj.hittest(position);
    };
    SheetSprite.prototype.convertToWorldSpace = function (position) {
        return this.__nativeObj.convertToWorldSpace(position);
    };
    SheetSprite.prototype.convertToNodeSpace = function (position) {
        return this.__nativeObj.convertToNodeSpace(position);
    };
    SheetSprite.prototype.createSprites = function (width, height) {
        this.__nativeObj = new BK.Sprite(width, height, undefined, this.flipU, this.flipV, this.stretchX, this.stretchY);
        this.contentSprite = new BK.Sprite(width, height, undefined, this.flipU, this.flipV, this.stretchX, this.stretchY);
        this.__nativeObj.addChild(this.contentSprite);
    };
    return SheetSprite;
}();
if (!BK.SheetSprite) {
    BK.SheetSprite = SheetSprite;
}
var SpriteSheetCache = function () {
    function SpriteSheetCache() {
        this.sheets = {};
        this.jsonConfigs = {};
    }
    SpriteSheetCache.prototype.getFrameInfoByFilename = function (filename) {
        for (var texturePath in this.jsonConfigs) {
            if (this.jsonConfigs.hasOwnProperty(texturePath)) {
                var config = this.jsonConfigs[texturePath];
                var texture = this.sheets[texturePath];
                var frames = config.frames;
                var meta = config.meta;
                this.fullWidth = meta.size.w;
                this.fullHeight = meta.size.h;
                for (var index = 0; index < frames.length; index++) {
                    var frm = frames[index];
                    if (filename == frm.filename) {
                        var frame = {
                            x: 0,
                            y: 1,
                            w: 0,
                            h: 0
                        };
                        var rotated = frm.rotated;
                        var trimmed = frm.trimmed;
                        var spriteSourceSize = frm.spriteSourceSize;
                        var sourceSize = frm.sourceSize;
                        if (rotated) {
                            frame.x = frm.frame.x;
                            frame.y = this.fullHeight - frm.frame.y - frm.frame.w;
                            frame.w = frm.frame.w;
                            frame.h = frm.frame.h;
                        } else {
                            frame.x = frm.frame.x;
                            frame.y = this.fullHeight - frm.frame.y - frm.frame.h;
                            frame.w = frm.frame.w;
                            frame.h = frm.frame.h;
                        }
                        spriteSourceSize.y = sourceSize.h - spriteSourceSize.y - spriteSourceSize.h;
                        var retSheetFrame = {
                            filename: filename,
                            frame: frame,
                            rotated: rotated,
                            trimmed: trimmed,
                            spriteSourceSize: spriteSourceSize,
                            sourceSize: sourceSize
                        };
                        return retSheetFrame;
                    }
                }
            }
        }
        return null;
    };
    SpriteSheetCache.prototype.getTexturePathByFilename = function (filename) {
        for (var texturePath in this.jsonConfigs) {
            if (this.jsonConfigs.hasOwnProperty(texturePath)) {
                var config = this.jsonConfigs[texturePath];
                var frames = config.frames;
                for (var index = 0; index < frames.length; index++) {
                    var frame = frames[index];
                    if (frame.filename == filename) {
                        return texturePath;
                    }
                }
            }
        }
        return null;
    };
    SpriteSheetCache.prototype.loadSheet = function (jsonPath, texturePath, format, minFilter, magFilter, uWrap, vWrap) {
        var buff = BK.FileUtil.readFile(jsonPath);
        var sheetJsonStr = buff.readAsString();
        if (sheetJsonStr) {
            var sheetObj = JSON.parse(sheetJsonStr);
            if (texturePath === void 0) {
                texturePath = jsonPath.replace(/.json$/, '.png');
            }
            this.jsonConfigs[texturePath] = sheetObj;
            if (format === void 0) {
                format = 4;
            }
            format = 4;
            if (minFilter === void 0) {
                minFilter = 1;
            }
            if (magFilter === void 0) {
                magFilter = 1;
            }
            if (uWrap === void 0) {
                uWrap = 1;
            }
            if (vWrap === void 0) {
                vWrap = 1;
            }
            var tex = new BK.Texture(texturePath, format, minFilter, magFilter, uWrap, vWrap);
            this.sheets[texturePath] = tex;
        } else {
            BK.Script.log(0, 0, 'loadSheet Failed.Please check path');
        }
    };
    SpriteSheetCache.prototype.removeSheet = function (jsonPath, texturePath) {
        if (this.jsonConfigs[texturePath]) {
            for (var key in this.jsonConfigs) {
                if (this.jsonConfigs.hasOwnProperty(key)) {
                    var val = this.jsonConfigs[key];
                    if (key == texturePath) {
                        delete this.jsonConfigs[texturePath];
                        BK.Script.log(0, 0, 'Delete jsonConfigs key:' + key + ' val:' + val);
                    }
                }
            }
        }
        if (this.sheets[texturePath]) {
            for (var key in this.sheets) {
                if (this.sheets.hasOwnProperty(key)) {
                    var val = this.sheets[key];
                    if (key == texturePath) {
                        delete this.sheets[texturePath];
                        BK.Script.log(0, 0, 'Delete sheets key:' + key + ' val:' + val);
                    }
                }
            }
        }
    };
    SpriteSheetCache.prototype.getTextureByFilename = function (filename) {
        var frameInfo = this.getFrameInfoByFilename(filename);
        var texturePath = this.getTexturePathByFilename(filename);
        if (frameInfo && texturePath) {
            var texture = new BK.Texture(texturePath);
            return texture;
        } else {
            BK.Script.log(0, 0, 'getTexture Failed.Please check path');
            return null;
        }
    };
    SpriteSheetCache.prototype.getSprite = function (filename, width, height) {
        var textureInfo = this.getTextureFrameInfoByFileName(filename);
        if (textureInfo) {
            var frameInfo = textureInfo.frameInfo;
            var texturePath = textureInfo.texturePath;
            var texture = new BK.Texture(texturePath);
            if (!width) {
                width = frameInfo.frame.w;
            }
            if (!height) {
                height = frameInfo.frame.h;
            }
            BK.Script.log(0, 0, 'getSprite  texture:' + texture + ' width:' + width + ' height:' + height);
            if (frameInfo.trimmed) {
                var sprite = new BK.SheetSprite(textureInfo, width, height);
                return sprite;
            } else {
                var sprite = new BK.Sprite(width, height, texture, 0, 1, 1, 1);
                sprite.adjustTexturePosition(frameInfo.frame.x, frameInfo.frame.y, frameInfo.frame.w, frameInfo.frame.h, frameInfo.rotated);
                return sprite;
            }
        } else {
            return null;
        }
    };
    SpriteSheetCache.prototype.createSheetSprite = function (filename, width, height) {
        var textureInfo = this.getTextureFrameInfoByFileName(filename);
        if (textureInfo) {
            var frameInfo = textureInfo.frameInfo;
            var texturePath = textureInfo.texturePath;
            var texture = new BK.Texture(texturePath);
            if (!width) {
                width = frameInfo.frame.w;
            }
            if (!height) {
                height = frameInfo.frame.h;
            }
            BK.Script.log(0, 0, 'SheetSprite  texture:' + texture + ' width:' + width + ' height:' + height);
            var sprite = new BK.SheetSprite(textureInfo, width, height);
            return sprite;
        } else {
            return null;
        }
    };
    SpriteSheetCache.prototype.getTextureFrameInfoByFileName = function (filename) {
        var frameInfo = this.getFrameInfoByFilename(filename);
        var texturePath = this.getTexturePathByFilename(filename);
        if (frameInfo && texturePath) {
            var textureFrameInfo = {
                'frameInfo': frameInfo,
                'texturePath': texturePath
            };
            return textureFrameInfo;
        } else {
            return null;
        }
    };
    return SpriteSheetCache;
}();
var Sprite9 = function () {
    function Sprite9(texWidth, texHeight, texture, grid, offset, rotated) {
        if (offset === void 0) {
            offset = {
                x: 0,
                y: 0
            };
        }
        this._size = {
            width: 0,
            height: 0
        };
        this.__nativeObj = new BK.Node();
        this.onInit();
        this._grid = grid;
        this._size = {
            width: texHeight,
            height: texHeight
        };
        this._leftTop = new BK.Sprite(grid.left, grid.top, texture, 0, 1, 1, 1);
        this._leftTop.position = {
            x: 0,
            y: texHeight - grid.top
        };
        this._leftTop.zOrder = 99999;
        this._leftTop.name = '_leftTop';
        this.__nativeObj.addChild(this._leftTop);
        this._centerTop = new BK.Sprite(texWidth - grid.left - grid.right, grid.top, texture, 0, 1, 1, 1);
        this._centerTop.position = {
            x: grid.left,
            y: texHeight - grid.top
        };
        this._centerTop.zOrder = 99999;
        this._centerTop.name = '_centerTop';
        this.__nativeObj.addChild(this._centerTop);
        this._rightTop = new BK.Sprite(grid.right, grid.top, texture, 0, 1, 1, 1);
        this._rightTop.position = {
            x: texWidth - grid.right,
            y: texHeight - grid.top
        };
        this._rightTop.zOrder = 99999;
        this._rightTop.name = '_rightTop';
        this.__nativeObj.addChild(this._rightTop);
        this._leftCenter = new BK.Sprite(grid.left, texHeight - grid.top - grid.bottom, texture, 0, 1, 1, 1);
        this._leftCenter.position = {
            x: 0,
            y: grid.bottom
        };
        this._leftCenter.name = '_leftCenter';
        this.__nativeObj.addChild(this._leftCenter);
        this._centerCenter = new BK.Sprite(texWidth - grid.left - grid.right, texHeight - grid.top - grid.bottom, texture, 0, 1, 1, 1);
        this._centerCenter.position = {
            x: grid.left,
            y: grid.bottom
        };
        this._centerCenter.name = '_centerCenter';
        this.__nativeObj.addChild(this._centerCenter);
        this._rightCenter = new BK.Sprite(grid.right, texHeight - grid.bottom - grid.top, texture, 0, 1, 1, 1);
        this._rightCenter.position = {
            x: texWidth - grid.right,
            y: grid.bottom
        };
        this._rightCenter.name = '_rightCenter';
        this.__nativeObj.addChild(this._rightCenter);
        this._leftBottom = new BK.Sprite(grid.left, grid.bottom, texture, 0, 1, 1, 1);
        this._leftBottom.position = {
            x: 0,
            y: 0
        };
        this._leftBottom.name = '_leftBottom';
        this.__nativeObj.addChild(this._leftBottom);
        this._centerBottom = new BK.Sprite(texWidth - grid.left - grid.right, grid.bottom, texture, 0, 1, 1, 1);
        this._centerBottom.position = {
            x: grid.left,
            y: 0
        };
        this._centerBottom.name = '_centerBottom';
        this.__nativeObj.addChild(this._centerBottom);
        this._rightBottom = new BK.Sprite(grid.right, grid.bottom, texture, 0, 1, 1, 1);
        this._rightBottom.position = {
            x: texWidth - grid.right,
            y: 0
        };
        this._rightBottom.name = '_rightBottom';
        this.__nativeObj.addChild(this._rightBottom);
        if (rotated == true) {
            this._leftTop.adjustTexturePosition(offset.x + (texHeight - grid.top), offset.y + (texWidth - grid.left), grid.left, grid.top, rotated);
            this._centerTop.adjustTexturePosition(offset.x + (texHeight - grid.top), offset.y + grid.right, texWidth - grid.left - grid.right, grid.top, rotated);
            this._rightTop.adjustTexturePosition(offset.x + (texHeight - grid.top), offset.y, grid.right, grid.top, rotated);
            this._leftCenter.adjustTexturePosition(offset.x + grid.bottom, offset.y + (texWidth - grid.left), grid.left, texHeight - grid.top - grid.bottom, rotated);
            this._centerCenter.adjustTexturePosition(offset.x + grid.bottom, offset.y + grid.right, texWidth - grid.left - grid.right, texHeight - grid.top - grid.bottom, rotated);
            this._rightCenter.adjustTexturePosition(offset.x + grid.bottom, offset.y, grid.right, texHeight - grid.bottom - grid.top, rotated);
            this._leftBottom.adjustTexturePosition(offset.x, offset.y + (texWidth - grid.left), grid.left, grid.bottom, rotated);
            this._centerBottom.adjustTexturePosition(offset.x, offset.y + grid.right, texWidth - grid.left - grid.right, grid.bottom, rotated);
            this._rightBottom.adjustTexturePosition(offset.x, offset.y, grid.right, grid.bottom, rotated);
        } else {
            this._leftTop.adjustTexturePosition(0 + offset.x, texHeight - grid.top + offset.y, grid.left, grid.top);
            this._centerTop.adjustTexturePosition(grid.left + offset.x, texHeight - grid.top + offset.y, texWidth - grid.left - grid.right, grid.top);
            this._rightTop.adjustTexturePosition(texWidth - grid.right + offset.x, texHeight - grid.top + offset.y, grid.right, grid.top);
            this._leftCenter.adjustTexturePosition(0 + offset.x, grid.bottom + offset.y, grid.left, texHeight - grid.top - grid.bottom);
            this._centerCenter.adjustTexturePosition(grid.left + offset.x, grid.bottom + offset.y, texWidth - grid.left - grid.right, texHeight - grid.top - grid.bottom);
            this._rightCenter.adjustTexturePosition(texWidth - grid.right + offset.x, grid.bottom + offset.y, grid.right, texHeight - grid.bottom - grid.top);
            this._leftBottom.adjustTexturePosition(0 + offset.x, 0 + offset.y, grid.left, grid.bottom);
            this._centerBottom.adjustTexturePosition(grid.left + offset.x, 0 + offset.y, texWidth - grid.left - grid.right, grid.bottom);
            this._rightBottom.adjustTexturePosition(texWidth - grid.right + offset.x, 0 + offset.y, grid.right, grid.bottom);
        }
    }
    Sprite9.prototype.onInit = function () {
        var names = Object.getOwnPropertyNames(this.__nativeObj);
        names.forEach(function (element) {
            var key = element;
            if (key != 'size') {
                Object.defineProperty(this, key, {
                    get: function () {
                        return this.__nativeObj[key];
                    },
                    set: function (obj) {
                        this.__nativeObj[key] = obj;
                    }
                });
            }
        }, this);
    };
    Object.defineProperty(Sprite9.prototype, 'alpha', {
        get: function () {
            return this._rightBottom.vertexColor.a;
        },
        set: function (num) {
            this._leftTop.vertexColor = {
                r: 1,
                g: 1,
                b: 1,
                a: num
            };
            this._centerTop.vertexColor = {
                r: 1,
                g: 1,
                b: 1,
                a: num
            };
            this._rightTop.vertexColor = {
                r: 1,
                g: 1,
                b: 1,
                a: num
            };
            this._leftCenter.vertexColor = {
                r: 1,
                g: 1,
                b: 1,
                a: num
            };
            this._centerCenter.vertexColor = {
                r: 1,
                g: 1,
                b: 1,
                a: num
            };
            this._rightCenter.vertexColor = {
                r: 1,
                g: 1,
                b: 1,
                a: num
            };
            this._leftBottom.vertexColor = {
                r: 1,
                g: 1,
                b: 1,
                a: num
            };
            this._centerBottom.vertexColor = {
                r: 1,
                g: 1,
                b: 1,
                a: num
            };
            this._rightBottom.vertexColor = {
                r: 1,
                g: 1,
                b: 1,
                a: num
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite9.prototype, 'size', {
        get: function () {
            return this._size;
        },
        set: function (contentSize) {
            this._size = contentSize;
            var tgtCenterWidth = contentSize.width - this._grid.left - this._grid.right;
            var tgtCenterHeight = contentSize.height - this._grid.top - this._grid.bottom;
            this._leftTop.position = {
                x: 0,
                y: contentSize.height - this._grid.top
            };
            this._leftCenter.size = {
                width: this._grid.left,
                height: tgtCenterHeight
            };
            this._leftCenter.position = {
                x: 0,
                y: this._grid.bottom
            };
            this._rightCenter.size = {
                width: this._grid.right,
                height: tgtCenterHeight
            };
            this._rightCenter.position = {
                x: contentSize.width - this._grid.right,
                y: this._grid.bottom
            };
            this._centerCenter.size = {
                width: tgtCenterWidth,
                height: tgtCenterHeight
            };
            this._centerTop.size = {
                width: tgtCenterWidth,
                height: this._grid.top
            };
            this._centerTop.position = {
                x: this._grid.left,
                y: contentSize.height - this._grid.top
            };
            this._centerBottom.size = {
                width: tgtCenterWidth,
                height: this._grid.bottom
            };
            this._centerBottom.position = {
                x: this._grid.left,
                y: 0
            };
            this._rightCenter.size = {
                width: this._grid.right,
                height: tgtCenterHeight
            };
            this._rightCenter.position = {
                x: contentSize.width - this._grid.right,
                y: this._grid.bottom
            };
            this._rightBottom.position = {
                x: contentSize.width - this._grid.right,
                y: 0
            };
            this._rightTop.position = {
                x: contentSize.width - this._grid.right,
                y: contentSize.height - this._grid.top
            };
        },
        enumerable: true,
        configurable: true
    });
    Sprite9.prototype.pos = function (x, y) {
        this.__nativeObj.position = {
            x: x,
            y: y
        };
    };
    Sprite9.prototype.dispose = function () {
        this.__nativeObj.dispose();
    };
    Sprite9.prototype.attachBody = function (body) {
        this.__nativeObj.attachComponent(body);
    };
    Sprite9.prototype.addChild = function (sonNode) {
        this.__nativeObj.addChild(sonNode);
    };
    Sprite9.prototype.removeChildById = function (id, isDispose) {
        return this.__nativeObj.removeChildById(id, isDispose);
    };
    Sprite9.prototype.removeChildByName = function (name, isDispose) {
        return this.__nativeObj.removeChildByName(name, isDispose);
    };
    Sprite9.prototype.removeFromParent = function () {
        return this.__nativeObj.removeFromParent();
    };
    Sprite9.prototype.hittest = function (position) {
        return this.__nativeObj.hittest(position);
    };
    return Sprite9;
}();
if (!BK.SpriteSheetCache) {
    BK.SpriteSheetCache = new SpriteSheetCache();
}
if (!BK.Sprite9) {
    BK.Sprite9 = Sprite9;
}
var AnimatedSprite = function () {
    function AnimatedSprite(textureInfoArr) {
        this.paused = false;
        this.delayUnits = 1 / 30;
        this.tmpPlayingIdx = 0;
        this.previousTs = -1;
        this.playedCount = 0;
        this.size = {
            width: 0,
            height: 0
        };
        this.readyTextureInfo(textureInfoArr);
        this.onInit(this.size.width, this.size.height);
        this.displayFrame(0);
        this.paused = true;
        BK.Director.ticker.add(function (ts, duration, obj) {
            obj.update(ts, duration);
        }, this);
    }
    AnimatedSprite.prototype.onInit = function (width, height) {
        this.createSprites(width, height);
        var names = Object.getOwnPropertyNames(this.__nativeObj);
        names.forEach(function (element) {
            var key = element;
            Object.defineProperty(this, key, {
                get: function () {
                    return this.__nativeObj[key];
                },
                set: function (obj) {
                    this.__nativeObj[key] = obj;
                }
            });
        }, this);
        Object.defineProperty(this, 'size', {
            get: function () {
                return this.__nativeObj.size;
            },
            set: function (obj) {
                this.__nativeObj.size = obj;
                this.displayFrame(this.currDisplayIdx);
            }
        });
    };
    AnimatedSprite.prototype.setTexture = function (tex) {
        this.__nativeObj.setTexture(tex);
    };
    AnimatedSprite.prototype.dispose = function () {
        BK.Director.ticker.remove(this);
        this.__nativeObj.dispose();
    };
    AnimatedSprite.prototype.removeChild = function (child) {
        return this.__nativeObj.removeChild(child);
    };
    AnimatedSprite.prototype.removeChildById = function (id, dispose) {
        return this.__nativeObj.removeChildById(id, dispose);
    };
    AnimatedSprite.prototype.removeChildByName = function (name, dispose) {
        return this.__nativeObj.removeChildByName(name, dispose);
    };
    AnimatedSprite.prototype.removeFromParent = function () {
        return this.__nativeObj.removeFromParent();
    };
    AnimatedSprite.prototype.addChild = function (child, index) {
        return this.__nativeObj.addChild(child, index);
    };
    AnimatedSprite.prototype.hittest = function (position) {
        return this.__nativeObj.hittest(position);
    };
    AnimatedSprite.prototype.convertToWorldSpace = function (position) {
        return this.__nativeObj.convertToWorldSpace(position);
    };
    AnimatedSprite.prototype.convertToNodeSpace = function (position) {
        return this.__nativeObj.convertToNodeSpace(position);
    };
    AnimatedSprite.prototype.createSprites = function (width, height) {
        this.__nativeObj = new BK.Sprite(width, height, null, 0, 1, 1, 1);
        this.contentSprite = new BK.Sprite(width, height, null, 0, 1, 1, 1);
        this.__nativeObj.addChild(this.contentSprite);
    };
    AnimatedSprite.prototype.readyTextureInfo = function (textureInfoArr) {
        var _this = this;
        this.textureInfoArr = [];
        textureInfoArr.forEach(function (texInfo) {
            if (texInfo.texturePath) {
                texInfo.texture = new BK.Texture(texInfo.texturePath);
                _this.textureInfoArr.push(texInfo);
                _this.size = {
                    width: texInfo.frameInfo.sourceSize.w,
                    height: texInfo.frameInfo.sourceSize.h
                };
            }
        });
    };
    AnimatedSprite.prototype.displayFrame = function (index) {
        if (this.textureInfoArr.length > 0) {
            var textureInfo = this.textureInfoArr[index];
            if (textureInfo) {
                this.currDisplayIdx = index;
                var tex = textureInfo.texture;
                var frameInfo = textureInfo.frameInfo;
                if (textureInfo.frameInfo.trimmed == true) {
                    var x = textureInfo.frameInfo.spriteSourceSize.x;
                    var y = textureInfo.frameInfo.spriteSourceSize.y;
                    var w = textureInfo.frameInfo.spriteSourceSize.w;
                    var h = textureInfo.frameInfo.spriteSourceSize.h;
                    var srcSize = textureInfo.frameInfo.sourceSize;
                    var currSize = this.__nativeObj.size;
                    x = currSize.width * x / srcSize.w;
                    y = currSize.height * y / srcSize.h;
                    w = currSize.width * w / srcSize.w;
                    h = currSize.height * h / srcSize.h;
                    this.contentSprite.position = {
                        x: x,
                        y: y
                    };
                    this.contentSprite.size = {
                        width: w,
                        height: h
                    };
                } else {
                    this.contentSprite.size = this.__nativeObj.size;
                }
                if (!this.currTexturePath || this.currTexturePath != textureInfo.texturePath) {
                    BK.Script.log(1, -1, 'this.currTexture != tex');
                    this.currTexturePath = textureInfo.texturePath;
                    this.contentSprite.setTexture(tex);
                }
                this.contentSprite.adjustTexturePosition(frameInfo.frame.x, frameInfo.frame.y, frameInfo.frame.w, frameInfo.frame.h, frameInfo.rotated);
            } else {
                BK.Script.log(1, -1, 'displayFrame failed! textureInfo is null. index is ' + index);
            }
        } else {
            BK.Script.log(1, -1, 'displayFrame failed! textureInfoArr.length is 0');
        }
    };
    AnimatedSprite.prototype.render = function () {
        if (this.tmpPlayingIdx > this.textureInfoArr.length - 1) {
            this.tmpPlayingIdx = 0;
        }
        this.displayFrame(this.tmpPlayingIdx);
        this.tmpPlayingIdx++;
        this.currDisplaySum++;
        this.updateCallback();
    };
    AnimatedSprite.prototype.update = function (ts, duration) {
        if (this.paused == false) {
            if (this.previousTs < 0) {
                this.previousTs = ts;
                this.render();
            } else if (ts - this.previousTs > this.delayUnits * 1000) {
                this.previousTs = ts;
                this.render();
            }
        }
    };
    AnimatedSprite.prototype.play = function (beginFrameIdx, repeatCount) {
        if (beginFrameIdx === void 0) {
            beginFrameIdx = 0;
        }
        if (repeatCount === void 0) {
            repeatCount = -1;
        }
        if (beginFrameIdx > this.textureInfoArr.length - 1) {
            this.tmpPlayingIdx = 0;
        } else {
            this.tmpPlayingIdx = beginFrameIdx;
        }
        this.paused = false;
        this.repeatCount = repeatCount;
        this.currDisplaySum = 0;
        this.playedCount = 0;
    };
    AnimatedSprite.prototype.stop = function (frameIdx) {
        if (frameIdx === void 0) {
            frameIdx = -1;
        }
        this.paused = true;
        if (frameIdx > -1) {
            this.displayFrame(frameIdx);
        }
    };
    AnimatedSprite.prototype.updateCallback = function () {
        var texInfArrCnt = this.textureInfoArr.length;
        if (this.currDisplaySum % texInfArrCnt == 0) {
            this.playedCount = parseInt(String(this.currDisplaySum / texInfArrCnt));
            if (this.completeCallback) {
                this.completeCallback(this, this.playedCount);
            }
            if (this.repeatCount > 0 && this.repeatCount <= this.playedCount) {
                if (this.endCallback) {
                    this.endCallback(this, this.playedCount);
                }
                this.stop();
            }
        }
    };
    AnimatedSprite.prototype.setCompleteCallback = function (completeCallback) {
        this.completeCallback = completeCallback;
    };
    AnimatedSprite.prototype.setEndCallback = function (completeCallback) {
        this.endCallback = completeCallback;
    };
    return AnimatedSprite;
}();
if (!BK.AnimatedSprite) {
    BK.AnimatedSprite = AnimatedSprite;
}
function Canvas() {
    var argumentLength = arguments.length;
    this._shadowColor = {
        r: 0,
        g: 0,
        b: 0,
        a: 0
    };
    this._shadowOffset = {
        x: 0,
        y: 0
    };
    this._shadowRadius = 0;
    this._textBaseLine = 0;
    this._textAlign = 0;
    this._useH5Mode = 0;
    if (argumentLength == 2) {
        this.__nativeObj = new BK.CanvasNode(arguments[0], arguments[1]);
    } else {
        return undefined;
    }
    this.setFlipXY(0, 1);
    var names = Object.getOwnPropertyNames(this.__nativeObj);
    names.forEach(function (element) {
        var key = element;
        if (key != 'scale' && key != 'contentSize' && key != 'size') {
            Object.defineProperty(this, key, {
                get: function () {
                    return this.__nativeObj[key];
                },
                set: function (obj) {
                    this.__nativeObj[key] = obj;
                }
            });
        }
    }, this);
    Object.defineProperty(Canvas.prototype, 'contentSize', {
        get: function () {
            return this.__nativeObj['contentSize'];
        },
        set: function (obj) {
            this.__nativeObj['contentSize'] = obj;
            this.__nativeObj.resetCanvas();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, 'size', {
        get: function () {
            return this.__nativeObj['size'];
        },
        set: function (obj) {
            this.__nativeObj['size'] = obj;
            this.__nativeObj.resetCanvas();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, 'textBaseline', {
        get: function () {
            return this._textBaseLine;
        },
        set: function (value) {
            switch (value) {
            case 0:
            case 1:
            case 2:
                this._textBaseLine = value;
                break;
            case 'bottom':
            case 'Bottom':
                this._textBaseLine = 0;
                break;
            case 'Middle':
            case 'middle':
                this._textBaseLine = 1;
                break;
            case 'Top':
            case 'top':
                this._textBaseLine = 2;
                break;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, 'textAlign', {
        get: function () {
            return this._textAlign;
        },
        set: function (value) {
            switch (value) {
            case 0:
            case 1:
            case 2:
                this._textAlign = value;
                break;
            case 'left':
                this._textAlign = 0;
                break;
            case 'center':
                this._textAlign = 1;
                break;
            case 'right':
                this._textAlign = 2;
                break;
            }
            this.__nativeObj.setTextAlign(this._textAlign);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, 'lineWidth', {
        get: function () {
            return this.__nativeObj.lineWidth;
        },
        set: function (value) {
            this.__nativeObj.lineWidth = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, 'globalAlpha', {
        get: function () {
            return this.__nativeObj.globalAlpha;
        },
        set: function (value) {
            value = Math.min(1, value);
            value = Math.max(0, value);
            this.__nativeObj.globalAlpha = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, 'fillColor', {
        get: function () {
            return this.__nativeObj.fillColor;
        },
        set: function (value) {
            this.__nativeObj.fillColor = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, 'strokeColor', {
        get: function () {
            return this.__nativeObj.strokeColor;
        },
        set: function (value) {
            this.__nativeObj.strokeColor = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, 'lineCap', {
        get: function () {
            return this.__nativeObj.lineCap;
        },
        set: function (value) {
            this.__nativeObj.lineCap = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, 'lineJoin', {
        get: function () {
            return this.__nativeObj.lineJoin;
        },
        set: function (value) {
            this.__nativeObj.lineJoin = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, 'miterLimit', {
        get: function () {
            return this.__nativeObj.miterLimit;
        },
        set: function (value) {
            this.__nativeObj.miterLimit = value;
        },
        enumerable: true,
        configurable: true
    });
}
Canvas.prototype.setImagePath = function (path) {
    if (path) {
        this.imagePath = path;
        var texture = new BK.Texture(path);
        this.__nativeObj.setTexture(texture);
    }
};
Canvas.prototype.getImagePath = function () {
    return this.imagePath;
};
Canvas.prototype.setTexture = function (texture) {
    this.__nativeObj.setTexture(texture);
};
Canvas.prototype.setFlipXY = function (flipx, flipy) {
    this.__nativeObj.setUVFlip(flipx, flipy);
};
Canvas.prototype.setUVFlip = function (flipu, flipv) {
    this.__nativeObj.setUVFlip(flipu, flipv);
};
Canvas.prototype.setUVWrap = function (wrapu, wrapv) {
    this.__nativeObj.setUVWrap(wrapu, wrapv);
};
Canvas.prototype.setXYStretch = function (stretchX, stretchY) {
    this.__nativeObj.setXYStretch(stretchX, stretchY);
};
Canvas.prototype.adjustTexturePosition = function (x, y, width, height, rotated) {
    this.__nativeObj.adjustTexturePosition(x, y, width, height, rotated);
};
Canvas.prototype.addChild = function (child) {
    return this.__nativeObj.addChild(child);
};
Canvas.prototype.dispose = function () {
    return this.__nativeObj.dispose();
};
Canvas.prototype.removeChild = function (child) {
    return this.__nativeObj.removeChild(child);
};
Canvas.prototype.removeChildById = function (id) {
    return this.__nativeObj.removeChildById(id);
};
Canvas.prototype.removeChildByName = function (name) {
    return this.__nativeObj.removeChildByName(name);
};
Canvas.prototype.removeChildByTag = function (tag) {
    return this.__nativeObj.removeChildByTag(tag);
};
Canvas.prototype.queryChildAtIndex = function (index) {
    return this.__nativeObj.queryChildAtIndex(index);
};
Canvas.prototype.queryChildById = function (Id) {
    return this.__nativeObj.queryChildById(Id);
};
Canvas.prototype.queryChildByName = function (name) {
    return this.__nativeObj.queryChildByName(name);
};
Canvas.prototype.queryChildByTag = function (tag) {
    return this.__nativeObj.queryChildByTag(tag);
};
Canvas.prototype.getChildCount = function () {
    return this.__nativeObj.getChildCount();
};
Canvas.prototype.removeFromParent = function () {
    return this.__nativeObj.removeFromParent();
};
Canvas.prototype.attachComponent = function (component) {
    return this.__nativeObj.attachComponent(component);
};
Canvas.prototype.detachComponent = function (component) {
    return this.__nativeObj.detachComponent(component);
};
Canvas.prototype.queryComponent = function (type) {
    return this.__nativeObj.queryComponent(type);
};
Canvas.prototype.queryComponentList = function (type) {
    return this.__nativeObj.queryComponentList(type);
};
Canvas.prototype.hittest = function (pos) {
    return this.__nativeObj.hittest(pos);
};
Canvas.prototype.isEqual = function (node) {
    return this.__nativeObj.isEqual(node);
};
Canvas.prototype.convertToWorldSpace = function (pos) {
    return this.__nativeObj.convertToWorldSpace(pos);
};
Canvas.prototype.convertToNodeSpace = function (pos) {
    return this.__nativeObj.convertToNodeSpace(pos);
};
Canvas.prototype.setAtlas = function (jsonUrl, name) {
    if (this.__nativeObj) {
        BK.CanvasSheetCache.loadSheet(jsonUrl);
        var texturePath = BK.CanvasSheetCache.getTexturePathByFilename(name);
        var texture = new BK.Texture(texturePath);
        this.__nativeObj.setTexture(texture);
        var frameInfo = BK.CanvasSheetCache.getFrameInfoByFilename(name);
        this.__nativeObj.adjustTexturePosition(frameInfo.frame.x, frameInfo.frame.y, frameInfo.frame.w, frameInfo.frame.h, frameInfo.rotated);
    }
    return 0;
};
Canvas.prototype.useH5Mode = function () {
    if (this.__nativeObj) {
        this._useH5Mode = 1;
        var argumentLength = arguments.length;
        if (argumentLength == 1) {
            this._useH5Mode = arguments[0];
            return this.__nativeObj.useH5Mode(arguments[0]);
        } else {
            return this.__nativeObj.useH5Mode();
        }
    }
    return 0;
};
Canvas.prototype.drawCircle = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.drawCircle(arguments[0], arguments[1], arguments[2]);
    }
    return 0;
};
Canvas.prototype.drawEllipse = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.drawEllipse(arguments[0], arguments[1], arguments[2], arguments[3]);
    }
    return 0;
};
Canvas.prototype.drawImage = function () {
    if (this.__nativeObj) {
        var argumentLength = arguments.length;
        if (argumentLength == 9) {
            this.__nativeObj.drawImage(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8]);
        } else if (argumentLength == 5) {
            this.__nativeObj.drawImage(arguments[0], 0, 0, 0, 0, arguments[1], arguments[2], arguments[3], arguments[4]);
        } else if (argumentLength == 3) {
            this.__nativeObj.drawImage(arguments[0], 0, 0, 0, 0, arguments[1], arguments[2], 0, 0);
        } else {
            return undefined;
        }
    }
    return 0;
};
Canvas.prototype.fill = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.fill();
    }
    return 0;
};
Canvas.prototype.stroke = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.stroke();
    }
    return 0;
};
Canvas.prototype.rect = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.rect(arguments[0], arguments[1], arguments[2], arguments[3]);
    }
    return 0;
};
Canvas.prototype.fillRect = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.fillRect(arguments[0], arguments[1], arguments[2], arguments[3]);
    }
    return 0;
};
Canvas.prototype.strokeRect = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.strokeRect(arguments[0], arguments[1], arguments[2], arguments[3]);
    }
    return 0;
};
Canvas.prototype.clearRect = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.clearRect(arguments[0], arguments[1], arguments[2], arguments[3]);
    }
    return 0;
};
Canvas.prototype.beginPath = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.beginPath();
    }
    return 0;
};
Canvas.prototype.closePath = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.closePath();
    }
    return 0;
};
Canvas.prototype.moveTo = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.moveTo(arguments[0], arguments[1]);
    }
    return 0;
};
Canvas.prototype.lineTo = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.lineTo(arguments[0], arguments[1]);
    }
    return 0;
};
Canvas.prototype.arcTo = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.arcTo(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
    }
    return 0;
};
Canvas.prototype.arc = function () {
    if (this.__nativeObj) {
        var argumentLength = arguments.length;
        if (argumentLength == 5) {
            return this.__nativeObj.arc(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
        } else
            argumentLength == 6;
        {
            return this.__nativeObj.arc(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
        }
    }
    return 0;
};
Canvas.prototype.quadraticCurveTo = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.quadraticCurveTo(arguments[0], arguments[1], arguments[2], arguments[3]);
    }
    return 0;
};
Canvas.prototype.bezierCurveTo = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.bezierCurveTo(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
    }
    return 0;
};
Canvas.prototype.save = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.save();
    }
    return 0;
};
Canvas.prototype.restore = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.restore();
    }
    return 0;
};
Canvas.prototype.fillText = function () {
    var argumentLength = arguments.length;
    if (argumentLength == 3) {
        var maxWidth = 2048;
        var maxHeight = 1024;
        var measureSize = this.measureText(arguments[0], maxWidth, maxHeight);
        var x = arguments[1];
        var y = arguments[2];
        var baseLineType = this._useH5Mode == 1 ? 2 - this._textBaseLine : this._textBaseLine;
        switch (baseLineType) {
        case 1:
            y = y - measureSize.height * 0.5;
            break;
        case 2:
            y = y - measureSize.height * 1;
            break;
        case 0:
        default:
            break;
        }
        BK.Script.log(0, 0, 'filltext baseLineType ' + baseLineType);
        switch (this._textAlign) {
        case 1:
            x = x - measureSize.width * 0.5;
            break;
        case 2:
            x = x - measureSize.width * 1;
            break;
        case 0:
        default:
            break;
        }
        return this.__nativeObj.fillText(arguments[0], x, y, Math.min(maxWidth, measureSize.width), Math.min(maxHeight, measureSize.height));
    }
    return 0;
};
Canvas.prototype.clip = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.clip();
    }
    return 0;
};
Canvas.prototype.isPointInPath = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.isPointInPath(arguments[0], arguments[1]);
    }
};
Canvas.prototype.scale = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.scales(arguments[0], arguments[1]);
    }
};
Canvas.prototype.rotate = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.rotate(arguments[0]);
    }
};
Canvas.prototype.translate = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.translate(arguments[0], arguments[1]);
    }
};
Canvas.prototype.transforms = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.transforms(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
    }
};
Canvas.prototype.shadowColor = function () {
    this._shadowColor = arguments[0];
    if (this.__nativeObj) {
        return this.__nativeObj.setTextShadow(this._shadowOffset.x, this._shadowOffset.y, this._shadowRadius, this._shadowColor);
    }
};
Canvas.prototype.shadowRadius = function () {
    this._shadowRadius = arguments[0];
    if (this.__nativeObj) {
        return this.__nativeObj.setTextShadow(this._shadowOffset.x, this._shadowOffset.y, this._shadowRadius, this._shadowColor);
    }
};
Canvas.prototype.shadowOffsetX = function () {
    this._shadowOffset.x = arguments[0];
    if (this.__nativeObj) {
        return this.__nativeObj.setTextShadow(this._shadowOffset.x, this._shadowOffset.y, this._shadowRadius, this._shadowColor);
    }
};
Canvas.prototype.shadowOffsetY = function () {
    this._shadowOffset.y = arguments[0];
    if (this.__nativeObj) {
        return this.__nativeObj.setTextShadow(this._shadowOffset.x, this._shadowOffset.y, this._shadowRadius, this._shadowColor);
    }
};
Canvas.prototype.clear = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.clear();
    }
};
Canvas.prototype.getTexture = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.getTexture();
    }
    return null;
};
Canvas.prototype.drawText = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.drawText(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
    }
    return null;
};
Canvas.prototype.setTextSize = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.setTextSize(arguments[0]);
    }
    return null;
};
Canvas.prototype.setTextAlign = function () {
    if (this.__nativeObj) {
        switch (arguments[0]) {
        case 0:
        case 1:
        case 2:
            this._textAlign = arguments[0];
            break;
        case 'left':
            this._textAlign = 0;
            break;
        case 'center':
            this._textAlign = 1;
            break;
        case 'right':
            this._textAlign = 2;
            break;
        }
        return this.__nativeObj.setTextAlign(this._textAlign);
    }
    return null;
};
Canvas.prototype.setTextBold = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.setTextBold(arguments[0]);
    }
    return null;
};
Canvas.prototype.setTextItalic = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.setTextItalic(arguments[0]);
    }
    return null;
};
Canvas.prototype.measureText = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.measureText(arguments[0], arguments[1], arguments[2]);
    }
    return null;
};
Canvas.prototype.updateCanvasTexture = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.updateCanvasTexture();
    }
    return null;
};
Canvas.prototype.saveTo = function () {
    var argumentLength = arguments.length;
    if (this.__nativeObj && argumentLength == 1) {
        this.__nativeObj.saveTo(arguments[0]);
    }
    return null;
};
BK.Canvas = Canvas;
BK.Script.log(0, 0, 'Load Canvas.js succeed.');
function Sprite() {
    this.imagePath = null;
    var argumentLength = arguments.length;
    if (argumentLength == 7) {
        this.__nativeObj = new BK.SpriteNode(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);
    } else if (argumentLength == 1) {
        this.__nativeObj = new BK.SpriteNode(arguments[0]);
        this.imagePath = arguments[0];
    } else {
        this.__nativeObj = new BK.SpriteNode();
    }
    var names = Object.getOwnPropertyNames(this.__nativeObj);
    names.forEach(function (element) {
        var key = element;
        Object.defineProperty(this, key, {
            get: function () {
                return this.__nativeObj[key];
            },
            set: function (obj) {
                this.__nativeObj[key] = obj;
            }
        });
    }, this);
}
Sprite.prototype.setImagePath = function (path) {
    if (path) {
        this.imagePath = path;
        var texture = new BK.Texture(path);
        this.__nativeObj.setTexture(texture);
    }
};
Sprite.prototype.getImagePath = function () {
    return this.imagePath;
};
Sprite.prototype.setTexture = function (texture) {
    this.__nativeObj.setTexture(texture);
};
Sprite.prototype.setFlipXY = function (flipx, flipy) {
    this.__nativeObj.setFlipXY(flipx, flipy);
};
Sprite.prototype.setUVFlip = function (flipu, flipv) {
    this.__nativeObj.setUVFlip(flipu, flipv);
};
Sprite.prototype.setUVWrap = function (wrapu, wrapv) {
    this.__nativeObj.setUVWrap(wrapu, wrapv);
};
Sprite.prototype.setXYStretch = function (stretchX, stretchY) {
    this.__nativeObj.setXYStretch(stretchX, stretchY);
};
Sprite.prototype.adjustTexturePosition = function (x, y, width, height, rotated) {
    this.__nativeObj.adjustTexturePosition(x, y, width, height, rotated);
};
Sprite.prototype.addChild = function (child) {
    return this.__nativeObj.addChild(child);
};
Sprite.prototype.dispose = function () {
    return this.__nativeObj.dispose();
};
Sprite.prototype.removeChild = function (child) {
    return this.__nativeObj.removeChild(child);
};
Sprite.prototype.removeChildById = function (id) {
    return this.__nativeObj.removeChildById(id);
};
Sprite.prototype.removeChildByName = function (name) {
    return this.__nativeObj.removeChildByName(name);
};
Sprite.prototype.removeChildByTag = function (tag) {
    return this.__nativeObj.removeChildByTag(tag);
};
Sprite.prototype.queryChildAtIndex = function (index) {
    return this.__nativeObj.queryChildAtIndex(index);
};
Sprite.prototype.queryChildById = function (Id) {
    return this.__nativeObj.queryChildById(Id);
};
Sprite.prototype.queryChildByName = function (name) {
    return this.__nativeObj.queryChildByName(name);
};
Sprite.prototype.queryChildByTag = function (tag) {
    return this.__nativeObj.queryChildByTag(tag);
};
Sprite.prototype.getChildCount = function () {
    return this.__nativeObj.getChildCount();
};
Sprite.prototype.removeFromParent = function () {
    return this.__nativeObj.removeFromParent();
};
Sprite.prototype.attachComponent = function (component) {
    return this.__nativeObj.attachComponent(component);
};
Sprite.prototype.detachComponent = function (component) {
    return this.__nativeObj.detachComponent(component);
};
Sprite.prototype.queryComponent = function (type) {
    return this.__nativeObj.queryComponent(type);
};
Sprite.prototype.queryComponentList = function (type) {
    return this.__nativeObj.queryComponentList(type);
};
Sprite.prototype.hittest = function (pos) {
    return this.__nativeObj.hittest(pos);
};
Sprite.prototype.isEqual = function (node) {
    return this.__nativeObj.isEqual(node);
};
Sprite.prototype.convertToWorldSpace = function (pos) {
    return this.__nativeObj.convertToWorldSpace(pos);
};
Sprite.prototype.convertToNodeSpace = function (pos) {
    return this.__nativeObj.convertToNodeSpace(pos);
};
Sprite.prototype.setAtlas = function (jsonUrl, name) {
    if (this.__nativeObj) {
        BK.SpriteSheetCache.loadSheet(jsonUrl);
        var texturePath = BK.SpriteSheetCache.getTexturePathByFilename(name);
        var texture = new BK.Texture(texturePath);
        this.__nativeObj.setTexture(texture);
        var frameInfo = BK.SpriteSheetCache.getFrameInfoByFilename(name);
        this.__nativeObj.adjustTexturePosition(frameInfo.frame.x, frameInfo.frame.y, frameInfo.frame.w, frameInfo.frame.h, frameInfo.rotated);
    }
    return 0;
};
Sprite.prototype.getTexture = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.getTexture();
    }
    return null;
};
BK.Sprite = Sprite;
BK.Script.log(0, 0, 'Load Sprite.js succeed.');
var gl;
function bkWebGLGetInstance() {
    if (!gl) {
        gl = new BK.WebGL();
        attatchConst();
        attachMethod();
        gl.OpenOptMode = OpenOptMode;
        gl.viewport(0, 0, BK.Director.screenPixelSize.width, BK.Director.screenPixelSize.height);
    }
    Object.prototype.hasOwnProperty.call(this, 'renderTicker') && renderTicker.setTickerCallBack(function (ts, duration) {
    });
    return gl;
}
function __TypedArrayGetData(array) {
    if (Object.prototype.hasOwnProperty.call(array, '__rawBKData')) {
        return array.__rawBKData;
    } else if (Object.prototype.hasOwnProperty.call(array, '__nativeObj')) {
        return array.__nativeObj;
    }
    return array;
}
function activeTexture(texture) {
    gl.glActiveTexture(texture);
}
function attachShader(program, shader) {
    gl.glAttachShader(program, shader);
}
function bindAttribLocation(program, index, name) {
    gl.glBindAttribLocation(program, index, name);
}
function bindBuffer(target, buffer) {
    gl.glBindBuffer(target, buffer);
}
function bindFramebuffer(target, framebuffer) {
    gl.glBindFramebuffer(target, framebuffer);
}
function bindRenderbuffer(target, renderbuffer) {
    gl.glBindRenderbuffer(target, renderbuffer);
}
function bindTexture(target, texture) {
    gl.glBindTexture(target, texture);
}
function blendColor(red, green, blue, alpha) {
    gl.glBlendColor(red, green, blue, alpha);
}
function blendEquation(mode) {
    gl.glBlendEquation(mode);
}
function blendEquationSeparate(modeRGB, modeAlpha) {
    gl.glBlendEquationSeparate(modeRGB, modeAlpha);
}
function blendFunc(sfactor, dfactor) {
    gl.glBlendFunc(sfactor, dfactor);
}
function blendFuncSeparate(srcRGB, dstRGB, srcAlpha, dstAlpha) {
    gl.glBlendFuncSeparate(srcRGB, dstRGB, srcAlpha, dstAlpha);
}
function bufferData(target, size, usage) {
    gl.glBufferData(target, size, usage);
}
function bufferData(target, data, usage) {
    gl.glBufferData(target, __TypedArrayGetData(data), usage);
}
function bufferSubData(target, offset, data) {
    gl.glBufferSubData(target, offset, __TypedArrayGetData(data));
}
function checkFramebufferStatus(target) {
    return gl.glCheckFramebufferStatus(target);
}
function clear(mask) {
    gl.glClear(mask);
}
function clearColor(red, green, blue, alpha) {
    gl.glClearColor(red, green, blue, alpha);
}
function clearDepth(depth) {
    gl.glClearDepth(depth);
}
function clearStencil(s) {
    gl.glClearStencil(s);
}
function colorMask(red, green, blue, alpha) {
    gl.glColorMask(red, green, blue, alpha);
}
function compileShader(shader) {
    gl.glCompileShader(shader);
}
function compressedTexImage2D(target, level, internalformat, width, height, border, data) {
    gl.glCompressedTexImage2D(target, level, internalformat, width, height, border, data);
}
function compressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, data) {
    gl.glCompressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, data);
}
function copyTexImage2D(target, level, internalformat, x, y, width, height, border) {
    gl.glCopyTexImage2D(target, level, internalformat, x, y, width, height, border);
}
function copyTexSubImage2D(target, level, xoffset, yoffset, x, y, width, height) {
    gl.glCopyTexSubImage2D(target, level, xoffset, yoffset, x, y, width, height);
}
function createBuffer() {
    return gl.glCreateBuffer();
}
function createFramebuffer() {
    return gl.glCreateFramebuffer();
}
function createProgram() {
    return gl.glCreateProgram();
}
function createRenderbuffer() {
    return gl.glCreateRenderbuffer();
}
function createShader(type) {
    return gl.glCreateShader(type);
}
function createTexture() {
    return gl.glCreateTexture();
}
function cullFace(mode) {
    gl.glCullFace(mode);
}
function deleteBuffer(buffer) {
    gl.glDeleteBuffer(buffer);
}
function deleteFramebuffer(framebuffer) {
    gl.glDeleteFramebuffer(framebuffer);
}
function deleteProgram(program) {
    gl.glDeleteProgram(program);
}
function deleteRenderbuffer(renderbuffer) {
    gl.glDeleteRenderbuffer(renderbuffer);
}
function deleteShader(shader) {
    gl.glDeleteShader(shader);
}
function deleteTexture(texture) {
    gl.glDeleteTexture(texture);
}
function depthFunc(func) {
    gl.glDepthFunc(func);
}
function depthMask(flag) {
    gl.glDepthMask(flag);
}
function depthRange(zNear, zFar) {
    gl.glDepthRange(zNear, zFar);
}
function detachShader(program, shader) {
    gl.glDetachShader(program, shader);
}
function disable(cap) {
    gl.glDisable(cap);
}
function disableVertexAttribArray(index) {
    gl.glDisableVertexAttribArray(index);
}
function drawArrays(mode, first, count) {
    gl.glDrawArrays(mode, first, count);
}
function drawElements(mode, count, type, offset) {
    gl.glDrawElements(mode, count, type, offset);
}
function enable(cap) {
    gl.glEnable(cap);
}
function enableVertexAttribArray(index) {
    gl.glEnableVertexAttribArray(index);
}
function finish() {
    gl.glFinish();
}
function flush() {
    gl.glFlush();
}
function framebufferRenderbuffer(target, attachment, renderbuffertarget, renderbuffer) {
    gl.glFramebufferRenderbuffer(target, attachment, renderbuffertarget, renderbuffer);
}
function framebufferTexture2D(target, attachment, textarget, texture, level) {
    gl.glFramebufferTexture2D(target, attachment, textarget, texture, level);
}
function frontFace(mode) {
    gl.glFrontFace(mode);
}
function generateMipmap(target) {
    gl.glGenerateMipmap(target);
}
function getAttribLocation(program, name) {
    return gl.glGetAttribLocation(program, name);
}
function getError() {
    return gl.glGetError();
}
function getShaderPrecisionFormat(shadertype, precisiontype) {
    return gl.glGetShaderPrecisionFormat(shadertype, precisiontype);
}
function getProgramInfoLog(program) {
    return gl.glGetProgramInfoLog(program);
}
function getShaderInfoLog(shader) {
    return gl.glGetShaderInfoLog(shader);
}
function getShaderSource(shader) {
    return gl.glGetShaderSource(shader);
}
function getUniformLocation(program, name) {
    return gl.glGetUniformLocation(program, name);
}
function getVertexAttribOffset(index, pname) {
    return gl.glGetVertexAttribOffset(index, pname);
}
function hint(target, mode) {
    gl.glHint(target, mode);
}
function isBuffer(buffer) {
    return gl.glIsBuffer(buffer);
}
function isEnabled(cap) {
    return gl.glIsEnabled(cap);
}
function isFramebuffer(framebuffer) {
    return gl.glIsFramebuffer(framebuffer);
}
function isProgram(program) {
    return gl.glIsProgram(program);
}
function isRenderbuffer(renderbuffer) {
    return gl.glIsRenderbuffer(renderbuffer);
}
function isShader(shader) {
    return gl.glIsShader(shader);
}
function isTexture(texture) {
    return gl.glIsTexture(texture);
}
function lineWidth(width) {
    gl.glLineWidth(width);
}
function linkProgram(program) {
    gl.glLinkProgram(program);
}
function pixelStorei(pname, param) {
    gl.glPixelStorei(pname, param);
}
function polygonOffset(factor, units) {
    gl.glPolygonOffset(factor, units);
}
function readPixels(x, y, width, height, format, type, pixels) {
    gl.glReadPixels(x, y, width, height, format, type, pixels);
}
function renderbufferStorage(target, internalformat, width, height) {
    gl.glRenderbufferStorage(target, internalformat, width, height);
}
function sampleCoverage(value, invert) {
    gl.glSampleCoverage(value, invert);
}
function scissor(x, y, width, height) {
    gl.glScissor(x, y, width, height);
}
function shaderSource(shader, source) {
    gl.glShaderSource(shader, source);
}
function stencilFunc(func, ref, mask) {
    gl.glStencilFunc(func, ref, mask);
}
function stencilFuncSeparate(face, func, ref, mask) {
    gl.glStencilFuncSeparate(face, func, ref, mask);
}
function stencilMask(mask) {
    gl.glStencilMask(mask);
}
function stencilMaskSeparate(face, mask) {
    gl.glStencilMaskSeparate(face, mask);
}
function stencilOp(fail, zfail, zpass) {
    gl.glStencilOp(fail, zfail, zpass);
}
function stencilOpSeparate(face, fail, zfail, zpass) {
    gl.glStencilOpSeparate(face, fail, zfail, zpass);
}
function texImage2D(target, level, internalformat) {
    switch (arguments.length) {
    case 6: {
            var format = arguments[3];
            var type = arguments[4];
            var source = arguments[5];
            if (Object.prototype.hasOwnProperty.call(source, '__nativeObj')) {
                gl.glTexImage2D(target, level, internalformat, format, type, source.__nativeObj);
            } else {
                gl.glTexImage2D(target, level, internalformat, format, type, source);
            }
            break;
        }
    case 9: {
            var width = arguments[3];
            var height = arguments[4];
            var border = arguments[5];
            var format = arguments[6];
            var type = arguments[7];
            var pixels = arguments[8];
            gl.glTexImage2D(target, level, internalformat, width, height, border, format, type, pixels);
            break;
        }
    }
}
function texParameterf(target, pname, param) {
    gl.glTexParameterf(target, pname, param);
}
function texParameteri(target, pname, param) {
    gl.glTexParameteri(target, pname, param);
}
function texSubImage2D(target, level, xoffset, yoffset) {
    switch (arguments.length) {
    case 7: {
            var format = arguments[4];
            var type = arguments[5];
            var source = arguments[6];
            if (Object.prototype.hasOwnProperty.call(source, '__nativeObj')) {
                gl.glTexSubImage2D(target, level, xoffset, yoffset, format, type, source.__nativeObj);
            } else {
                gl.glTexSubImage2D(target, level, xoffset, yoffset, format, type, source);
            }
            break;
        }
    case 9: {
            var width = arguments[4];
            var height = arguments[5];
            var format = arguments[6];
            var type = arguments[7];
            var pixels = arguments[8];
            gl.glTexSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels);
            break;
        }
    }
}
function uniform1f(location, x) {
    gl.glUniform1f(location, x);
}
function uniform2f(location, x, y) {
    gl.glUniform2f(location, x, y);
}
function uniform3f(location, x, y, z) {
    gl.glUniform3f(location, x, y, z);
}
function uniform4f(location, x, y, z, w) {
    gl.glUniform4f(location, x, y, z, w);
}
function uniform1i(location, x) {
    gl.glUniform1i(location, x);
}
function uniform2i(location, x, y) {
    gl.glUniform2i(location, x, y);
}
function uniform3i(location, x, y, z) {
    gl.glUniform3i(location, x, y, z);
}
function uniform4i(location, x, y, z, w) {
    gl.glUniform4i(location, x, y, z, w);
}
function uniform1fv(location, v) {
    gl.glUniform1fv(location, __TypedArrayGetData(v instanceof Array == true ? new Float32Array(v) : v));
}
function uniform2fv(location, v) {
    gl.glUniform2fv(location, __TypedArrayGetData(v instanceof Array == true ? new Float32Array(v) : v));
}
function uniform3fv(location, v) {
    gl.glUniform3fv(location, __TypedArrayGetData(v instanceof Array == true ? new Float32Array(v) : v));
}
function uniform4fv(location, v) {
    gl.glUniform4fv(location, __TypedArrayGetData(v instanceof Array == true ? new Float32Array(v) : v));
}
function uniform1iv(location, v) {
    gl.glUniform1iv(location, __TypedArrayGetData(v instanceof Array == true ? new Int32Array(v) : v));
}
function uniform2iv(location, v) {
    gl.glUniform2iv(location, __TypedArrayGetData(v instanceof Array == true ? new Int32Array(v) : v));
}
function uniform3iv(location, v) {
    gl.glUniform3iv(location, __TypedArrayGetData(v instanceof Array == true ? new Int32Array(v) : v));
}
function uniform4iv(location, v) {
    gl.glUniform4iv(location, __TypedArrayGetData(v instanceof Array == true ? new Int32Array(v) : v));
}
function uniformMatrix2fv(location, transpose, value) {
    gl.glUniformMatrix2fv(location, transpose, __TypedArrayGetData(value instanceof Array == true ? new Float32Array(value) : value));
}
function uniformMatrix3fv(location, transpose, value) {
    gl.glUniformMatrix3fv(location, transpose, __TypedArrayGetData(value instanceof Array == true ? new Float32Array(value) : value));
}
function uniformMatrix4fv(location, transpose, value) {
    gl.glUniformMatrix4fv(location, transpose, __TypedArrayGetData(value instanceof Array == true ? new Float32Array(value) : value));
}
function useProgram(program) {
    gl.glUseProgram(program);
}
function validateProgram(program) {
    gl.glValidateProgram(program);
}
function vertexAttrib1f(index, x) {
    gl.glVertexAttrib1f(index, x);
}
function vertexAttrib2f(index, x, y) {
    gl.glVertexAttrib2f(index, x, y);
}
function vertexAttrib3f(index, x, y, z) {
    gl.glVertexAttrib3f(index, x, y, z);
}
function vertexAttrib4f(index, x, y, z, w) {
    gl.glVertexAttrib4f(index, x, y, z, w);
}
function vertexAttrib1fv(index, values) {
    gl.glVertexAttrib1fv(index, __TypedArrayGetData(values instanceof Array == true ? new Float32Array(values) : values));
}
function vertexAttrib2fv(index, values) {
    gl.glVertexAttrib2fv(index, __TypedArrayGetData(values instanceof Array == true ? new Float32Array(values) : values));
}
function vertexAttrib3fv(index, values) {
    gl.glVertexAttrib3fv(index, __TypedArrayGetData(values instanceof Array == true ? new Float32Array(values) : values));
}
function vertexAttrib4fv(index, values) {
    gl.glVertexAttrib4fv(index, __TypedArrayGetData(values instanceof Array == true ? new Float32Array(values) : values));
}
function vertexAttribPointer(index, size, type, normalized, stride, offset) {
    gl.glVertexAttribPointer(index, size, type, normalized, stride, offset);
}
function viewport(x, y, width, height) {
    gl.glViewport(x, y, width, height);
}
function getActiveAttrib(program, index) {
    return gl.glGetActiveAttrib(program, index);
}
function getActiveUniform(program, index) {
    return gl.glGetActiveUniform(program, index);
}
function getAttachedShaders(program) {
    return gl.glGetAttachedShaders(program);
}
function getBufferParameter(target, pname) {
    return gl.glGetBufferParameter(target, pname);
}
function getFramebufferAttachmentParameter(target, attachment, pname) {
    return gl.glGetFramebufferAttachmentParameter(target, attachment, pname);
}
function getProgramParameter(program, pname) {
    return gl.glGetProgramParameter(program, pname);
}
function getRenderbufferParameter(target, pname) {
    return gl.glGetRenderbufferParameter(target, pname);
}
function getShaderParameter(shader, pname) {
    return gl.glGetShaderParameter(shader, pname);
}
function getTexParameter(target, pname) {
    return gl.glGetTexParameter(target, pname);
}
function getVertexAttrib(index, pname) {
    return gl.glGetVertexAttrib(index, pname);
}
function getUniform(program, location) {
    return gl.glGetUniform(program, location);
}
function getParameter(pname) {
    switch (pname) {
    case gl.ACTIVE_TEXTURE:
    case gl.ALPHA_BITS:
    case gl.ARRAY_BUFFER_BINDING:
    case gl.BLUE_BITS:
    case gl.CULL_FACE_MODE:
    case gl.CURRENT_PROGRAM:
    case gl.DEPTH_BITS:
    case gl.DEPTH_FUNC:
    case gl.ELEMENT_ARRAY_BUFFER_BINDING:
    case gl.FRAMEBUFFER_BINDING:
    case gl.FRONT_FACE:
    case gl.GENERATE_MIPMAP_HINT:
    case gl.GREEN_BITS:
    case gl.IMPLEMENTATION_COLOR_READ_FORMAT:
    case gl.IMPLEMENTATION_COLOR_READ_TYPE:
    case gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS:
    case gl.MAX_CUBE_MAP_TEXTURE_SIZE:
    case gl.MAX_FRAGMENT_UNIFORM_VECTORS:
    case gl.MAX_RENDERBUFFER_SIZE:
    case gl.MAX_TEXTURE_IMAGE_UNITS:
    case gl.MAX_TEXTURE_SIZE:
    case gl.MAX_VARYING_VECTORS:
    case gl.MAX_VERTEX_ATTRIBS:
    case gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS:
    case gl.MAX_VERTEX_UNIFORM_VECTORS:
    case gl.MAX_VIEWPORT_DIMS:
    case gl.NUM_COMPRESSED_TEXTURE_FORMATS:
    case gl.NUM_SHADER_BINARY_FORMATS:
    case gl.PACK_ALIGNMENT:
    case gl.RED_BITS:
    case gl.RENDERBUFFER_BINDING:
    case gl.SAMPLE_BUFFERS:
    case gl.SAMPLES:
    case gl.STENCIL_BACK_FAIL:
    case gl.STENCIL_BACK_FUNC:
    case gl.STENCIL_BACK_PASS_DEPTH_FAIL:
    case gl.STENCIL_BACK_PASS_DEPTH_PASS:
    case gl.STENCIL_BACK_REF:
    case gl.STENCIL_BACK_VALUE_MASK:
    case gl.STENCIL_BACK_WRITEMASK:
    case gl.STENCIL_BITS:
    case gl.STENCIL_CLEAR_VALUE:
    case gl.STENCIL_FAIL:
    case gl.STENCIL_FUNC:
    case gl.STENCIL_PASS_DEPTH_FAIL:
    case gl.STENCIL_PASS_DEPTH_PASS:
    case gl.STENCIL_REF:
    case gl.STENCIL_VALUE_MASK:
    case gl.STENCIL_WRITEMASK:
    case gl.SUBPIXEL_BITS:
    case gl.TEXTURE_BINDING_2D:
    case gl.TEXTURE_BINDING_CUBE_MAP:
    case gl.UNPACK_ALIGNMENT:
    case gl.BLEND_DST_ALPHA:
    case gl.BLEND_DST_RGB:
    case gl.BLEND_EQUATION_ALPHA:
    case gl.BLEND_EQUATION_RGB:
    case gl.BLEND_SRC_ALPHA:
    case gl.BLEND_SRC_RGB: {
            return gl.glGetParameterInt(pname, 1);
            break;
        }
    case gl.ALIASED_LINE_WIDTH_RANGE:
    case gl.ALIASED_POINT_SIZE_RANGE:
    case gl.DEPTH_RANGE:
    case gl.MAX_VIEWPORT_DIMS: {
            return gl.glGetParameterFloat(pname, 2);
            break;
        }
    case gl.BLEND:
    case gl.CULL_FACE:
    case gl.DEPTH_TEST:
    case gl.DEPTH_WRITEMASK:
    case gl.DITHER:
    case gl.POLYGON_OFFSET_FILL:
    case gl.SAMPLE_ALPHA_TO_COVERAGE:
    case gl.SAMPLE_COVERAGE:
    case gl.SAMPLE_COVERAGE_INVERT:
    case gl.SCISSOR_TEST:
    case gl.SHADER_COMPILER:
    case gl.STENCIL_TEST: {
            return gl.glGetParameterBool(pname, 1);
            break;
        }
    case gl.BLEND_COLOR:
    case gl.COLOR_CLEAR_VALUE: {
            return gl.glGetParameterFloat(pname, 4);
            break;
        }
    case gl.SCISSOR_BOX:
    case gl.VIEWPORT: {
            return gl.glGetParameterInt(pname, 4);
            break;
        }
    case gl.COLOR_WRITEMASK: {
            return gl.glGetParameterBool(pname, 4);
            break;
        }
    case gl.POLYGON_OFFSET_FACTOR:
    case gl.POLYGON_OFFSET_UNITS:
    case gl.SAMPLE_COVERAGE_VALUE: {
            return gl.glGetParameterFloat(pname, 1);
            break;
        }
    case gl.SHADER_BINARY_FORMATS: {
            var len = gl.glGetParameterInt(gl.NUM_SHADER_BINARY_FORMATS, 1);
            return gl.glGetParameterInt(pname, len);
            break;
        }
    case gl.COMPRESSED_TEXTURE_FORMATS: {
            var len = gl.glGetParameterInt(gl.NUM_COMPRESSED_TEXTURE_FORMATS, 1);
            return gl.glGetParameterInt(pname, len);
            break;
        }
    default:
        break;
    }
}
function attachMethod() {
    gl.activeTexture = activeTexture;
    gl.attachShader = attachShader;
    gl.bindAttribLocation = bindAttribLocation;
    gl.bindBuffer = bindBuffer;
    gl.bindFramebuffer = bindFramebuffer;
    gl.bindRenderbuffer = bindRenderbuffer;
    gl.bindTexture = bindTexture;
    gl.blendColor = blendColor;
    gl.blendEquation = blendEquation;
    gl.blendEquationSeparate = blendEquationSeparate;
    gl.blendFunc = blendFunc;
    gl.blendFuncSeparate = blendFuncSeparate;
    gl.bufferData = bufferData;
    gl.bufferData = bufferData;
    gl.bufferSubData = bufferSubData;
    gl.checkFramebufferStatus = checkFramebufferStatus;
    gl.clear = clear;
    gl.clearColor = clearColor;
    gl.clearDepth = clearDepth;
    gl.clearStencil = clearStencil;
    gl.colorMask = colorMask;
    gl.compileShader = compileShader;
    gl.compressedTexImage2D = compressedTexImage2D;
    gl.compressedTexSubImage2D = compressedTexSubImage2D;
    gl.copyTexImage2D = copyTexImage2D;
    gl.copyTexSubImage2D = copyTexSubImage2D;
    gl.createBuffer = createBuffer;
    gl.createFramebuffer = createFramebuffer;
    gl.createProgram = createProgram;
    gl.createRenderbuffer = createRenderbuffer;
    gl.createShader = createShader;
    gl.createTexture = createTexture;
    gl.cullFace = cullFace;
    gl.deleteBuffer = deleteBuffer;
    gl.deleteFramebuffer = deleteFramebuffer;
    gl.deleteProgram = deleteProgram;
    gl.deleteRenderbuffer = deleteRenderbuffer;
    gl.deleteShader = deleteShader;
    gl.deleteTexture = deleteTexture;
    gl.depthFunc = depthFunc;
    gl.depthMask = depthMask;
    gl.depthRange = depthRange;
    gl.detachShader = detachShader;
    gl.disable = disable;
    gl.disableVertexAttribArray = disableVertexAttribArray;
    gl.drawArrays = drawArrays;
    gl.drawElements = drawElements;
    gl.enable = enable;
    gl.enableVertexAttribArray = enableVertexAttribArray;
    gl.finish = finish;
    gl.flush = flush;
    gl.framebufferRenderbuffer = framebufferRenderbuffer;
    gl.framebufferTexture2D = framebufferTexture2D;
    gl.frontFace = frontFace;
    gl.generateMipmap = generateMipmap;
    gl.getAttribLocation = getAttribLocation;
    gl.getError = getError;
    gl.getProgramInfoLog = getProgramInfoLog;
    gl.getShaderInfoLog = getShaderInfoLog;
    gl.getShaderSource = getShaderSource;
    gl.getUniformLocation = getUniformLocation;
    gl.getVertexAttribOffset = getVertexAttribOffset;
    gl.hint = hint;
    gl.isBuffer = isBuffer;
    gl.isEnabled = isEnabled;
    gl.isFramebuffer = isFramebuffer;
    gl.isProgram = isProgram;
    gl.isRenderbuffer = isRenderbuffer;
    gl.isShader = isShader;
    gl.isTexture = isTexture;
    gl.lineWidth = lineWidth;
    gl.linkProgram = linkProgram;
    gl.pixelStorei = pixelStorei;
    gl.polygonOffset = polygonOffset;
    gl.readPixels = readPixels;
    gl.renderbufferStorage = renderbufferStorage;
    gl.sampleCoverage = sampleCoverage;
    gl.scissor = scissor;
    gl.shaderSource = shaderSource;
    gl.stencilFunc = stencilFunc;
    gl.stencilFuncSeparate = stencilFuncSeparate;
    gl.stencilMask = stencilMask;
    gl.stencilMaskSeparate = stencilMaskSeparate;
    gl.stencilOp = stencilOp;
    gl.stencilOpSeparate = stencilOpSeparate;
    gl.texImage2D = texImage2D;
    gl.texSubImage2D = texSubImage2D;
    gl.texParameterf = texParameterf;
    gl.texParameteri = texParameteri;
    gl.uniform1f = uniform1f;
    gl.uniform2f = uniform2f;
    gl.uniform3f = uniform3f;
    gl.uniform4f = uniform4f;
    gl.uniform1i = uniform1i;
    gl.uniform2i = uniform2i;
    gl.uniform3i = uniform3i;
    gl.uniform4i = uniform4i;
    gl.uniform1fv = uniform1fv;
    gl.uniform2fv = uniform2fv;
    gl.uniform3fv = uniform3fv;
    gl.uniform4fv = uniform4fv;
    gl.uniform1iv = uniform1iv;
    gl.uniform2iv = uniform2iv;
    gl.uniform3iv = uniform3iv;
    gl.uniform4iv = uniform4iv;
    gl.uniformMatrix2fv = uniformMatrix2fv;
    gl.uniformMatrix3fv = uniformMatrix3fv;
    gl.uniformMatrix4fv = uniformMatrix4fv;
    gl.useProgram = useProgram;
    gl.validateProgram = validateProgram;
    gl.vertexAttrib1f = vertexAttrib1f;
    gl.vertexAttrib2f = vertexAttrib2f;
    gl.vertexAttrib3f = vertexAttrib3f;
    gl.vertexAttrib4f = vertexAttrib4f;
    gl.vertexAttrib1fv = vertexAttrib1fv;
    gl.vertexAttrib2fv = vertexAttrib2fv;
    gl.vertexAttrib3fv = vertexAttrib3fv;
    gl.vertexAttrib4fv = vertexAttrib4fv;
    gl.vertexAttribPointer = vertexAttribPointer;
    gl.viewport = viewport;
    gl.getActiveAttrib = getActiveAttrib;
    gl.getActiveUniform = getActiveUniform;
    gl.getAttachedShaders = getAttachedShaders;
    gl.getBufferParameter = getBufferParameter;
    gl.getFramebufferAttachmentParameter = getFramebufferAttachmentParameter;
    gl.getProgramParameter = getProgramParameter;
    gl.getRenderbufferParameter = getRenderbufferParameter;
    gl.getShaderParameter = getShaderParameter;
    gl.getTexParameter = getTexParameter;
    gl.getVertexAttrib = getVertexAttrib;
    gl.getParameter = getParameter;
    gl.getUniform = getUniform;
    gl.getShaderPrecisionFormat = getShaderPrecisionFormat;
}
function attatchConst() {
    gl.DEPTH_BUFFER_BIT = 256;
    gl.STENCIL_BUFFER_BIT = 1024;
    gl.COLOR_BUFFER_BIT = 16384;
    gl.POINTS = 0;
    gl.LINES = 1;
    gl.LINE_LOOP = 2;
    gl.LINE_STRIP = 3;
    gl.TRIANGLES = 4;
    gl.TRIANGLE_STRIP = 5;
    gl.TRIANGLE_FAN = 6;
    gl.ZERO = 0;
    gl.ONE = 1;
    gl.SRC_COLOR = 768;
    gl.ONE_MINUS_SRC_COLOR = 769;
    gl.SRC_ALPHA = 770;
    gl.ONE_MINUS_SRC_ALPHA = 771;
    gl.DST_ALPHA = 772;
    gl.ONE_MINUS_DST_ALPHA = 773;
    gl.DST_COLOR = 774;
    gl.ONE_MINUS_DST_COLOR = 775;
    gl.SRC_ALPHA_SATURATE = 776;
    gl.FUNC_ADD = 32774;
    gl.BLEND_EQUATION = 32777;
    gl.BLEND_EQUATION_RGB = 32777;
    gl.BLEND_EQUATION_ALPHA = 34877;
    gl.FUNC_SUBTRACT = 32778;
    gl.FUNC_REVERSE_SUBTRACT = 32779;
    gl.BLEND_DST_RGB = 32968;
    gl.BLEND_SRC_RGB = 32969;
    gl.BLEND_DST_ALPHA = 32970;
    gl.BLEND_SRC_ALPHA = 32971;
    gl.CONSTANT_COLOR = 32769;
    gl.ONE_MINUS_CONSTANT_COLOR = 32770;
    gl.CONSTANT_ALPHA = 32771;
    gl.ONE_MINUS_CONSTANT_ALPHA = 32772;
    gl.BLEND_COLOR = 32773;
    gl.ARRAY_BUFFER = 34962;
    gl.ELEMENT_ARRAY_BUFFER = 34963;
    gl.ARRAY_BUFFER_BINDING = 34964;
    gl.ELEMENT_ARRAY_BUFFER_BINDING = 34965;
    gl.STREAM_DRAW = 35040;
    gl.STATIC_DRAW = 35044;
    gl.DYNAMIC_DRAW = 35048;
    gl.BUFFER_SIZE = 34660;
    gl.BUFFER_USAGE = 34661;
    gl.CURRENT_VERTEX_ATTRIB = 34342;
    gl.FRONT = 1028;
    gl.BACK = 1029;
    gl.FRONT_AND_BACK = 1032;
    gl.CULL_FACE = 2884;
    gl.BLEND = 3042;
    gl.DITHER = 3024;
    gl.STENCIL_TEST = 2960;
    gl.DEPTH_TEST = 2929;
    gl.SCISSOR_TEST = 3089;
    gl.POLYGON_OFFSET_FILL = 32823;
    gl.SAMPLE_ALPHA_TO_COVERAGE = 32926;
    gl.SAMPLE_COVERAGE = 32928;
    gl.NO_ERROR = 0;
    gl.INVALID_ENUM = 1280;
    gl.INVALID_VALUE = 1281;
    gl.INVALID_OPERATION = 1282;
    gl.OUT_OF_MEMORY = 1285;
    gl.CW = 2304;
    gl.CCW = 2305;
    gl.LINE_WIDTH = 2849;
    gl.ALIASED_POINT_SIZE_RANGE = 33901;
    gl.ALIASED_LINE_WIDTH_RANGE = 33902;
    gl.CULL_FACE_MODE = 2885;
    gl.FRONT_FACE = 2886;
    gl.DEPTH_RANGE = 2928;
    gl.DEPTH_WRITEMASK = 2930;
    gl.DEPTH_CLEAR_VALUE = 2931;
    gl.DEPTH_FUNC = 2932;
    gl.STENCIL_CLEAR_VALUE = 2961;
    gl.STENCIL_FUNC = 2962;
    gl.STENCIL_FAIL = 2964;
    gl.STENCIL_PASS_DEPTH_FAIL = 2965;
    gl.STENCIL_PASS_DEPTH_PASS = 2966;
    gl.STENCIL_REF = 2967;
    gl.STENCIL_VALUE_MASK = 2963;
    gl.STENCIL_WRITEMASK = 2968;
    gl.STENCIL_BACK_FUNC = 34816;
    gl.STENCIL_BACK_FAIL = 34817;
    gl.STENCIL_BACK_PASS_DEPTH_FAIL = 34818;
    gl.STENCIL_BACK_PASS_DEPTH_PASS = 34819;
    gl.STENCIL_BACK_REF = 36003;
    gl.STENCIL_BACK_VALUE_MASK = 36004;
    gl.STENCIL_BACK_WRITEMASK = 36005;
    gl.VIEWPORT = 2978;
    gl.SCISSOR_BOX = 3088;
    gl.COLOR_CLEAR_VALUE = 3106;
    gl.COLOR_WRITEMASK = 3107;
    gl.UNPACK_ALIGNMENT = 3317;
    gl.PACK_ALIGNMENT = 3333;
    gl.MAX_TEXTURE_SIZE = 3379;
    gl.MAX_VIEWPORT_DIMS = 3386;
    gl.SUBPIXEL_BITS = 3408;
    gl.RED_BITS = 3410;
    gl.GREEN_BITS = 3411;
    gl.BLUE_BITS = 3412;
    gl.ALPHA_BITS = 3413;
    gl.DEPTH_BITS = 3414;
    gl.STENCIL_BITS = 3415;
    gl.POLYGON_OFFSET_UNITS = 10752;
    gl.POLYGON_OFFSET_FACTOR = 32824;
    gl.TEXTURE_BINDING_2D = 32873;
    gl.SAMPLE_BUFFERS = 32936;
    gl.SAMPLES = 32937;
    gl.SAMPLE_COVERAGE_VALUE = 32938;
    gl.SAMPLE_COVERAGE_INVERT = 32939;
    gl.COMPRESSED_TEXTURE_FORMATS = 34467;
    gl.DONT_CARE = 4352;
    gl.FASTEST = 4353;
    gl.NICEST = 4354;
    gl.GENERATE_MIPMAP_HINT = 33170;
    gl.BYTE = 5120;
    gl.UNSIGNED_BYTE = 5121;
    gl.SHORT = 5122;
    gl.UNSIGNED_SHORT = 5123;
    gl.INT = 5124;
    gl.UNSIGNED_INT = 5125;
    gl.FLOAT = 5126;
    gl.DEPTH_COMPONENT = 6402;
    gl.ALPHA = 6406;
    gl.RGB = 6407;
    gl.RGBA = 6408;
    gl.LUMINANCE = 6409;
    gl.LUMINANCE_ALPHA = 6410;
    gl.UNSIGNED_SHORT_4_4_4_4 = 32819;
    gl.UNSIGNED_SHORT_5_5_5_1 = 32820;
    gl.UNSIGNED_SHORT_5_6_5 = 33635;
    gl.FRAGMENT_SHADER = 35632;
    gl.VERTEX_SHADER = 35633;
    gl.MAX_VERTEX_ATTRIBS = 34921;
    gl.MAX_VERTEX_UNIFORM_VECTORS = 36347;
    gl.MAX_VARYING_VECTORS = 36348;
    gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS = 35661;
    gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS = 35660;
    gl.MAX_TEXTURE_IMAGE_UNITS = 34930;
    gl.MAX_FRAGMENT_UNIFORM_VECTORS = 36349;
    gl.SHADER_TYPE = 35663;
    gl.DELETE_STATUS = 35712;
    gl.LINK_STATUS = 35714;
    gl.VALIDATE_STATUS = 35715;
    gl.ATTACHED_SHADERS = 35717;
    gl.ACTIVE_UNIFORMS = 35718;
    gl.ACTIVE_ATTRIBUTES = 35721;
    gl.SHADING_LANGUAGE_VERSION = 35724;
    gl.CURRENT_PROGRAM = 35725;
    gl.NEVER = 512;
    gl.LESS = 513;
    gl.EQUAL = 514;
    gl.LEQUAL = 515;
    gl.GREATER = 516;
    gl.NOTEQUAL = 517;
    gl.GEQUAL = 518;
    gl.ALWAYS = 519;
    gl.KEEP = 7680;
    gl.REPLACE = 7681;
    gl.INCR = 7682;
    gl.DECR = 7683;
    gl.INVERT = 5386;
    gl.INCR_WRAP = 34055;
    gl.DECR_WRAP = 34056;
    gl.VENDOR = 7936;
    gl.RENDERER = 7937;
    gl.VERSION = 7938;
    gl.NEAREST = 9728;
    gl.LINEAR = 9729;
    gl.NEAREST_MIPMAP_NEAREST = 9984;
    gl.LINEAR_MIPMAP_NEAREST = 9985;
    gl.NEAREST_MIPMAP_LINEAR = 9986;
    gl.LINEAR_MIPMAP_LINEAR = 9987;
    gl.TEXTURE_MAG_FILTER = 10240;
    gl.TEXTURE_MIN_FILTER = 10241;
    gl.TEXTURE_WRAP_S = 10242;
    gl.TEXTURE_WRAP_T = 10243;
    gl.TEXTURE_2D = 3553;
    gl.TEXTURE = 5890;
    gl.TEXTURE_CUBE_MAP = 34067;
    gl.TEXTURE_BINDING_CUBE_MAP = 34068;
    gl.TEXTURE_CUBE_MAP_POSITIVE_X = 34069;
    gl.TEXTURE_CUBE_MAP_NEGATIVE_X = 34070;
    gl.TEXTURE_CUBE_MAP_POSITIVE_Y = 34071;
    gl.TEXTURE_CUBE_MAP_NEGATIVE_Y = 34072;
    gl.TEXTURE_CUBE_MAP_POSITIVE_Z = 34073;
    gl.TEXTURE_CUBE_MAP_NEGATIVE_Z = 34074;
    gl.MAX_CUBE_MAP_TEXTURE_SIZE = 34076;
    gl.TEXTURE0 = 33984;
    gl.TEXTURE1 = 33985;
    gl.TEXTURE2 = 33986;
    gl.TEXTURE3 = 33987;
    gl.TEXTURE4 = 33988;
    gl.TEXTURE5 = 33989;
    gl.TEXTURE6 = 33990;
    gl.TEXTURE7 = 33991;
    gl.TEXTURE8 = 33992;
    gl.TEXTURE9 = 33993;
    gl.TEXTURE10 = 33994;
    gl.TEXTURE11 = 33995;
    gl.TEXTURE12 = 33996;
    gl.TEXTURE13 = 33997;
    gl.TEXTURE14 = 33998;
    gl.TEXTURE15 = 33999;
    gl.TEXTURE16 = 34000;
    gl.TEXTURE17 = 34001;
    gl.TEXTURE18 = 34002;
    gl.TEXTURE19 = 34003;
    gl.TEXTURE20 = 34004;
    gl.TEXTURE21 = 34005;
    gl.TEXTURE22 = 34006;
    gl.TEXTURE23 = 34007;
    gl.TEXTURE24 = 34008;
    gl.TEXTURE25 = 34009;
    gl.TEXTURE26 = 34010;
    gl.TEXTURE27 = 34011;
    gl.TEXTURE28 = 34012;
    gl.TEXTURE29 = 34013;
    gl.TEXTURE30 = 34014;
    gl.TEXTURE31 = 34015;
    gl.ACTIVE_TEXTURE = 34016;
    gl.REPEAT = 10497;
    gl.CLAMP_TO_EDGE = 33071;
    gl.MIRRORED_REPEAT = 33648;
    gl.FLOAT_VEC2 = 35664;
    gl.FLOAT_VEC3 = 35665;
    gl.FLOAT_VEC4 = 35666;
    gl.INT_VEC2 = 35667;
    gl.INT_VEC3 = 35668;
    gl.INT_VEC4 = 35669;
    gl.BOOL = 35670;
    gl.BOOL_VEC2 = 35671;
    gl.BOOL_VEC3 = 35672;
    gl.BOOL_VEC4 = 35673;
    gl.FLOAT_MAT2 = 35674;
    gl.FLOAT_MAT3 = 35675;
    gl.FLOAT_MAT4 = 35676;
    gl.SAMPLER_2D = 35678;
    gl.SAMPLER_CUBE = 35680;
    gl.VERTEX_ATTRIB_ARRAY_ENABLED = 34338;
    gl.VERTEX_ATTRIB_ARRAY_SIZE = 34339;
    gl.VERTEX_ATTRIB_ARRAY_STRIDE = 34340;
    gl.VERTEX_ATTRIB_ARRAY_TYPE = 34341;
    gl.VERTEX_ATTRIB_ARRAY_NORMALIZED = 34922;
    gl.VERTEX_ATTRIB_ARRAY_POINTER = 34373;
    gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING = 34975;
    gl.IMPLEMENTATION_COLOR_READ_TYPE = 35738;
    gl.IMPLEMENTATION_COLOR_READ_FORMAT = 35739;
    gl.COMPILE_STATUS = 35713;
    gl.LOW_FLOAT = 36336;
    gl.MEDIUM_FLOAT = 36337;
    gl.HIGH_FLOAT = 36338;
    gl.LOW_INT = 36339;
    gl.MEDIUM_INT = 36340;
    gl.HIGH_INT = 36341;
    gl.FRAMEBUFFER = 36160;
    gl.RENDERBUFFER = 36161;
    gl.RGBA4 = 32854;
    gl.RGB5_A1 = 32855;
    gl.RGB565 = 36194;
    gl.DEPTH_COMPONENT16 = 33189;
    gl.STENCIL_INDEX8 = 36168;
    gl.DEPTH_STENCIL = 34041;
    gl.RENDERBUFFER_WIDTH = 36162;
    gl.RENDERBUFFER_HEIGHT = 36163;
    gl.RENDERBUFFER_INTERNAL_FORMAT = 36164;
    gl.RENDERBUFFER_RED_SIZE = 36176;
    gl.RENDERBUFFER_GREEN_SIZE = 36177;
    gl.RENDERBUFFER_BLUE_SIZE = 36178;
    gl.RENDERBUFFER_ALPHA_SIZE = 36179;
    gl.RENDERBUFFER_DEPTH_SIZE = 36180;
    gl.RENDERBUFFER_STENCIL_SIZE = 36181;
    gl.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE = 36048;
    gl.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME = 36049;
    gl.FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL = 36050;
    gl.FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE = 36051;
    gl.COLOR_ATTACHMENT0 = 36064;
    gl.DEPTH_ATTACHMENT = 36096;
    gl.STENCIL_ATTACHMENT = 36128;
    gl.DEPTH_STENCIL_ATTACHMENT = 33306;
    gl.NONE = 0;
    gl.FRAMEBUFFER_COMPLETE = 36053;
    gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT = 36054;
    gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT = 36055;
    gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS = 36057;
    gl.FRAMEBUFFER_UNSUPPORTED = 36061;
    gl.FRAMEBUFFER_BINDING = 36006;
    gl.RENDERBUFFER_BINDING = 36007;
    gl.MAX_RENDERBUFFER_SIZE = 34024;
    gl.INVALID_FRAMEBUFFER_OPERATION = 1286;
    gl.UNPACK_FLIP_Y_WEBGL = 37440;
    gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL = 37441;
    gl.CONTEXT_LOST_WEBGL = 37442;
    gl.UNPACK_COLORSPACE_CONVERSION_WEBGL = 37443;
    gl.BROWSER_DEFAULT_WEBGL = 37444;
    gl.SHADER_BINARY_FORMATS = 36344;
    gl.NUM_SHADER_BINARY_FORMATS = 36345;
    gl.NUM_COMPRESSED_TEXTURE_FORMATS = 34466;
}
var GL_COMMAND_ACTIVE_TEXTURE = 0;
var GL_COMMAND_ATTACH_SHADER = 1;
var GL_COMMAND_BIND_ATTRIB_LOCATION = 2;
var GL_COMMAND_BIND_BUFFER = 3;
var GL_COMMAND_BIND_FRAME_BUFFER = 4;
var GL_COMMAND_BIND_RENDER_BUFFER = 5;
var GL_COMMAND_BIND_TEXTURE = 6;
var GL_COMMAND_BLEND_COLOR = 7;
var GL_COMMAND_BLEND_EQUATION = 8;
var GL_COMMAND_BLEND_EQUATION_SEPARATE = 9;
var GL_COMMAND_BLEND_FUNC = 10;
var GL_COMMAND_BLEND_FUNC_SEPARATE = 11;
var GL_COMMAND_BUFFER_DATA = 12;
var GL_COMMAND_BUFFER_SUB_DATA = 13;
var GL_COMMAND_CLEAR = 14;
var GL_COMMAND_CLEAR_COLOR = 15;
var GL_COMMAND_CLEAR_DEPTH = 16;
var GL_COMMAND_CLEAR_STENCIL = 17;
var GL_COMMAND_COLOR_MASK = 18;
var GL_COMMAND_COMMIT = 19;
var GL_COMMAND_COMPILE_SHADER = 20;
var GL_COMMAND_COMPRESSED_TEX_IMAGE_2D = 21;
var GL_COMMAND_COMPRESSED_TEX_SUB_IMAGE_2D = 22;
var GL_COMMAND_COPY_TEX_IMAGE_2D = 23;
var GL_COMMAND_COPY_TEX_SUB_IMAGE_2D = 24;
var GL_COMMAND_CULL_FACE = 25;
var GL_COMMAND_DELETE_BUFFER = 26;
var GL_COMMAND_DELETE_FRAME_BUFFER = 27;
var GL_COMMAND_DELETE_PROGRAM = 28;
var GL_COMMAND_DELETE_RENDER_BUFFER = 29;
var GL_COMMAND_DELETE_SHADER = 30;
var GL_COMMAND_DELETE_TEXTURE = 31;
var GL_COMMAND_DEPTH_FUNC = 32;
var GL_COMMAND_DEPTH_MASK = 33;
var GL_COMMAND_DEPTH_RANGE = 34;
var GL_COMMAND_DETACH_SHADER = 35;
var GL_COMMAND_DISABLE = 36;
var GL_COMMAND_DISABLE_VERTEX_ATTRIB_ARRAY = 37;
var GL_COMMAND_DRAW_ARRAYS = 38;
var GL_COMMAND_DRAW_ELEMENTS = 39;
var GL_COMMAND_ENABLE = 40;
var GL_COMMAND_ENABLE_VERTEX_ATTRIB_ARRAY = 41;
var GL_COMMAND_FINISH = 42;
var GL_COMMAND_FLUSH = 43;
var GL_COMMAND_FRAME_BUFFER_RENDER_BUFFER = 44;
var GL_COMMAND_FRAME_BUFFER_TEXTURE_2D = 45;
var GL_COMMAND_FRONT_FACE = 46;
var GL_COMMAND_GENERATE_MIPMAP = 47;
var GL_COMMAND_HINT = 48;
var GL_COMMAND_LINE_WIDTH = 49;
var GL_COMMAND_LINK_PROGRAM = 50;
var GL_COMMAND_PIXEL_STOREI = 51;
var GL_COMMAND_POLYGON_OFFSET = 52;
var GL_COMMAND_RENDER_BUFFER_STORAGE = 53;
var GL_COMMAND_SAMPLE_COVERAGE = 54;
var GL_COMMAND_SCISSOR = 55;
var GL_COMMAND_SHADER_SOURCE = 56;
var GL_COMMAND_STENCIL_FUNC = 57;
var GL_COMMAND_STENCIL_FUNC_SEPARATE = 58;
var GL_COMMAND_STENCIL_MASK = 59;
var GL_COMMAND_STENCIL_MASK_SEPARATE = 60;
var GL_COMMAND_STENCIL_OP = 61;
var GL_COMMAND_STENCIL_OP_SEPARATE = 62;
var GL_COMMAND_TEX_IMAGE_2D = 63;
var GL_COMMAND_TEX_PARAMETER_F = 64;
var GL_COMMAND_TEX_PARAMETER_I = 65;
var GL_COMMAND_TEX_SUB_IMAGE_2D = 66;
var GL_COMMAND_UNIFORM_1F = 67;
var GL_COMMAND_UNIFORM_1FV = 68;
var GL_COMMAND_UNIFORM_1I = 69;
var GL_COMMAND_UNIFORM_1IV = 70;
var GL_COMMAND_UNIFORM_2F = 71;
var GL_COMMAND_UNIFORM_2FV = 72;
var GL_COMMAND_UNIFORM_2I = 73;
var GL_COMMAND_UNIFORM_2IV = 74;
var GL_COMMAND_UNIFORM_3F = 75;
var GL_COMMAND_UNIFORM_3FV = 76;
var GL_COMMAND_UNIFORM_3I = 77;
var GL_COMMAND_UNIFORM_3IV = 78;
var GL_COMMAND_UNIFORM_4F = 79;
var GL_COMMAND_UNIFORM_4FV = 80;
var GL_COMMAND_UNIFORM_4I = 81;
var GL_COMMAND_UNIFORM_4IV = 82;
var GL_COMMAND_UNIFORM_MATRIX_2FV = 83;
var GL_COMMAND_UNIFORM_MATRIX_3FV = 84;
var GL_COMMAND_UNIFORM_MATRIX_4FV = 85;
var GL_COMMAND_USE_PROGRAM = 86;
var GL_COMMAND_VALIDATE_PROGRAM = 87;
var GL_COMMAND_VERTEX_ATTRIB_1F = 88;
var GL_COMMAND_VERTEX_ATTRIB_2F = 89;
var GL_COMMAND_VERTEX_ATTRIB_3F = 90;
var GL_COMMAND_VERTEX_ATTRIB_4F = 91;
var GL_COMMAND_VERTEX_ATTRIB_1FV = 92;
var GL_COMMAND_VERTEX_ATTRIB_2FV = 93;
var GL_COMMAND_VERTEX_ATTRIB_3FV = 94;
var GL_COMMAND_VERTEX_ATTRIB_4FV = 95;
var GL_COMMAND_VERTEX_ATTRIB_POINTER = 96;
var GL_COMMAND_VIEW_PORT = 97;
var total_size = 100000;
var next_index = 0;
var buffer_data;
function OpenOptMode() {
    if (gl.flushCommand && isSupportTypeArray()) {
        attachMethodOpt();
    }
    buffer_data = new Float32Array(total_size);
}
function flushCommand() {
    if (next_index > 0) {
        gl.flushCommand(next_index, buffer_data);
        next_index = 0;
    }
}
function glCommitOpt() {
    flushCommand();
    gl.commit();
}
function activeTextureOpt(texture) {
    if (next_index + 2 > total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_ACTIVE_TEXTURE;
    buffer_data[next_index + 1] = texture;
    next_index += 2;
}
function attachShaderOpt(program, shader) {
    if (next_index + 3 > total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_ATTACH_SHADER;
    buffer_data[next_index + 1] = program;
    buffer_data[next_index + 2] = shader;
    next_index += 3;
}
function bindAttribLocationOpt(program, index, name) {
    flushCommand();
    bindAttribLocation(program, index, name);
}
function bindBufferOpt(target, buffer) {
    if (next_index + 3 > total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_BIND_BUFFER;
    buffer_data[next_index + 1] = target;
    buffer_data[next_index + 2] = buffer;
    next_index += 3;
}
function bindFramebufferOpt(target, framebuffer) {
    if (next_index + 3 > total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_BIND_FRAME_BUFFER;
    buffer_data[next_index + 1] = target;
    buffer_data[next_index + 2] = framebuffer;
    next_index += 3;
}
function bindRenderbufferOpt(target, renderbuffer) {
    if (next_index + 3 > total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_BIND_RENDER_BUFFER;
    buffer_data[next_index + 1] = target;
    buffer_data[next_index + 2] = renderbuffer;
    next_index += 3;
}
function bindTextureOpt(target, texture) {
    if (next_index + 3 > total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_BIND_TEXTURE;
    buffer_data[next_index + 1] = target;
    buffer_data[next_index + 2] = texture;
    next_index += 3;
}
function blendColorOpt(red, green, blue, alpha) {
    if (next_index + 5 > total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_BLEND_COLOR;
    buffer_data[next_index + 1] = red;
    buffer_data[next_index + 2] = green;
    buffer_data[next_index + 3] = blue;
    buffer_data[next_index + 4] = alpha;
    next_index += 5;
}
function blendEquationOpt(mode) {
    if (next_index + 2 > total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_BLEND_EQUATION;
    buffer_data[next_index + 1] = mode;
    next_index += 2;
}
function blendEquationSeparateOpt(modeRGB, modeAlpha) {
    if (next_index + 3 > total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_BLEND_EQUATION_SEPARATE;
    buffer_data[next_index + 1] = modeRGB;
    buffer_data[next_index + 2] = modeAlpha;
    next_index += 3;
}
function blendFuncOpt(sfactor, dfactor) {
    if (next_index + 3 > total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_BLEND_FUNC;
    buffer_data[next_index + 1] = sfactor;
    buffer_data[next_index + 2] = dfactor;
    next_index += 3;
}
function blendFuncSeparateOpt(srcRGB, dstRGB, srcAlpha, dstAlpha) {
    if (next_index + 5 > total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_BLEND_FUNC_SEPARATE;
    buffer_data[next_index + 1] = srcRGB;
    buffer_data[next_index + 2] = dstRGB;
    buffer_data[next_index + 2] = srcAlpha;
    buffer_data[next_index + 2] = dstAlpha;
    next_index += 5;
}
function bufferDataOpt(target, data, usage) {
    flushCommand();
    bufferData(target, data, usage);
}
function bufferSubDataOpt(target, offset, data) {
    flushCommand();
    bufferSubData(target, offset, data);
}
function checkFramebufferStatusOpt(target) {
    flushCommand();
    checkFramebufferStatus(target);
}
function clearOpt(mask) {
    if (next_index + 2 > total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_CLEAR;
    buffer_data[next_index + 1] = mask;
    next_index += 2;
}
function clearColorOpt(red, green, blue, alpha) {
    if (next_index + 5 > total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_CLEAR_COLOR;
    buffer_data[next_index + 1] = red;
    buffer_data[next_index + 2] = green;
    buffer_data[next_index + 3] = blue;
    buffer_data[next_index + 4] = alpha;
    next_index += 5;
}
function clearDepthOpt(depth) {
    if (next_index + 2 > total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_CLEAR_DEPTH;
    buffer_data[next_index + 1] = depth;
    next_index += 2;
}
function clearStencilOpt(s) {
    if (next_index + 2 > total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_CLEAR_STENCIL;
    buffer_data[next_index + 1] = s;
    next_index += 2;
}
function colorMaskOpt(red, green, blue, alpha) {
    if (next_index + 5 > total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_COLOR_MASK;
    buffer_data[next_index + 1] = red ? 1 : 0;
    buffer_data[next_index + 2] = green ? 1 : 0;
    buffer_data[next_index + 3] = blue ? 1 : 0;
    buffer_data[next_index + 4] = alpha ? 1 : 0;
    next_index += 5;
}
function compileShaderOpt(shader) {
    if (next_index + 2 > total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_COMPILE_SHADER;
    buffer_data[next_index + 1] = shader;
    next_index += 2;
}
function compressedTexImage2DOpt(target, level, internalformat, width, height, border, data) {
    flushCommand();
    compressedTexImage2D(target, level, internalformat, width, height, border, data);
}
function compressedTexSubImage2DOpt(target, level, xoffset, yoffset, width, height, format, data) {
    flushCommand();
    compressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, data);
}
function copyTexImage2DOpt(target, level, internalformat, x, y, width, height, border) {
    if (next_index + 9 > total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_COPY_TEX_IMAGE_2D;
    buffer_data[next_index + 1] = target;
    buffer_data[next_index + 2] = level;
    buffer_data[next_index + 3] = internalformat;
    buffer_data[next_index + 4] = x;
    buffer_data[next_index + 5] = y;
    buffer_data[next_index + 6] = width;
    buffer_data[next_index + 7] = height;
    buffer_data[next_index + 8] = border;
    next_index += 9;
}
function copyTexSubImage2DOpt(target, level, xoffset, yoffset, x, y, width, height) {
    if (next_index + 9 > total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_COPY_TEX_SUB_IMAGE_2D;
    buffer_data[next_index + 1] = target;
    buffer_data[next_index + 2] = level;
    buffer_data[next_index + 3] = xoffset;
    buffer_data[next_index + 4] = yoffset;
    buffer_data[next_index + 5] = x;
    buffer_data[next_index + 6] = y;
    buffer_data[next_index + 7] = width;
    buffer_data[next_index + 8] = height;
    next_index += 9;
}
function createBufferOpt() {
    flushCommand();
    return createBuffer();
}
function createFramebufferOpt() {
    flushCommand();
    return createFramebuffer();
}
function createProgramOpt() {
    flushCommand();
    return createProgram();
}
function createRenderbufferOpt() {
    flushCommand();
    return createRenderbuffer();
}
function createShaderOpt(type) {
    flushCommand();
    return createShader(type);
}
function createTextureOpt() {
    flushCommand();
    return createTexture();
}
function cullFaceOpt(mode) {
    if (next_index + 2 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_CULL_FACE;
    buffer_data[next_index + 1] = mode;
    next_index += 2;
}
function deleteBufferOpt(buffer) {
    if (next_index + 2 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_DELETE_BUFFER;
    buffer_data[next_index + 1] = buffer;
    next_index += 2;
}
function deleteFramebufferOpt(framebuffer) {
    if (next_index + 2 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_DELETE_FRAME_BUFFER;
    buffer_data[next_index + 1] = framebuffer;
    next_index += 2;
}
function deleteProgramOpt(program) {
    if (next_index + 2 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_DELETE_PROGRAM;
    buffer_data[next_index + 1] = program;
    next_index += 2;
}
function deleteRenderbufferOpt(renderbuffer) {
    if (next_index + 2 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_DELETE_RENDER_BUFFER;
    buffer_data[next_index + 1] = renderbuffer;
    next_index += 2;
}
function deleteShaderOpt(shader) {
    if (next_index + 2 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_DELETE_SHADER;
    buffer_data[next_index + 1] = shader;
    next_index += 2;
}
function deleteTextureOpt(texture) {
    if (next_index + 2 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_DELETE_TEXTURE;
    buffer_data[next_index + 1] = texture;
    next_index += 2;
}
function depthFuncOpt(func) {
    if (next_index + 2 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_DEPTH_FUNC;
    buffer_data[next_index + 1] = func;
    next_index += 2;
}
function depthMaskOpt(flag) {
    if (next_index + 2 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_DEPTH_MASK;
    buffer_data[next_index + 1] = flag ? 1 : 0;
    next_index += 2;
}
function depthRangeOpt(zNear, zFar) {
    if (next_index + 3 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_DEPTH_RANGE;
    buffer_data[next_index + 1] = zNear;
    buffer_data[next_index + 1] = zFar;
    next_index += 3;
}
function detachShaderOpt(program, shader) {
    if (next_index + 3 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_DETACH_SHADER;
    buffer_data[next_index + 1] = program;
    buffer_data[next_index + 1] = shader;
    next_index += 3;
}
function disableOpt(cap) {
    if (next_index + 2 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_DISABLE;
    buffer_data[next_index + 1] = cap;
    next_index += 2;
}
function disableVertexAttribArrayOpt(index) {
    if (next_index + 2 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_DISABLE_VERTEX_ATTRIB_ARRAY;
    buffer_data[next_index + 1] = index;
    next_index += 2;
}
function drawArraysOpt(mode, first, count) {
    if (next_index + 4 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_DRAW_ARRAYS;
    buffer_data[next_index + 1] = mode;
    buffer_data[next_index + 2] = first;
    buffer_data[next_index + 3] = count;
    next_index += 4;
}
function drawElementsOpt(mode, count, type, offset) {
    if (next_index + 5 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_DRAW_ELEMENTS;
    buffer_data[next_index + 1] = mode;
    buffer_data[next_index + 2] = count;
    buffer_data[next_index + 3] = type;
    buffer_data[next_index + 4] = offset;
    next_index += 5;
}
function enableOpt(cap) {
    if (next_index + 2 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_ENABLE;
    buffer_data[next_index + 1] = cap;
    next_index += 2;
}
function enableVertexAttribArrayOpt(index) {
    if (next_index + 2 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_ENABLE_VERTEX_ATTRIB_ARRAY;
    buffer_data[next_index + 1] = index;
    next_index += 2;
}
function finishOpt() {
    if (next_index + 1 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_FINISH;
    next_index += 1;
}
function flushOpt() {
    if (next_index + 1 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_FLUSH;
    next_index += 1;
}
function framebufferRenderbufferOpt(target, attachment, renderbuffertarget, renderbuffer) {
    if (next_index + 5 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_FRAME_BUFFER_RENDER_BUFFER;
    buffer_data[next_index + 1] = target;
    buffer_data[next_index + 2] = attachment;
    buffer_data[next_index + 3] = renderbuffertarget;
    buffer_data[next_index + 4] = renderbuffer;
    next_index += 5;
}
function framebufferTexture2DOpt(target, attachment, textarget, texture, level) {
    if (next_index + 6 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_FRAME_BUFFER_TEXTURE_2D;
    buffer_data[next_index + 1] = target;
    buffer_data[next_index + 2] = attachment;
    buffer_data[next_index + 3] = textarget;
    buffer_data[next_index + 4] = texture;
    buffer_data[next_index + 5] = level;
    next_index += 6;
}
function frontFaceOpt(mode) {
    if (next_index + 2 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_FRONT_FACE;
    buffer_data[next_index + 1] = mode;
    next_index += 2;
}
function generateMipmapOpt(target) {
    if (next_index + 2 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_GENERATE_MIPMAP;
    buffer_data[next_index + 1] = target;
    next_index += 2;
}
function getActiveAttribOpt(program, index) {
    flushCommand();
    return getActiveAttrib(program, index);
}
function getActiveUniformOpt(program, index) {
    flushCommand();
    return getActiveUniform(program, index);
}
function getAttachedShadersOpt(program) {
    flushCommand();
    return getAttachedShaders(program);
}
function getAttribLocationOpt(program, name) {
    flushCommand();
    return getAttribLocation(program, name);
}
function getBufferParameterOpt(target, pname) {
    flushCommand();
    return getBufferParameter(target, pname);
}
function getParameterOpt(pname) {
    flushCommand();
    return getParameter(pname);
}
function getErrorOpt() {
    flushCommand();
    return getError();
}
function getFramebufferAttachmentParameterOpt(target, attachment, pname) {
    flushCommand();
    return getFramebufferAttachmentParameter(target, attachment, pname);
}
function getProgramParameterOpt(program, pname) {
    flushCommand();
    return getProgramParameter(program, pname);
}
function getProgramInfoLogOpt(program) {
    flushCommand();
    return getProgramInfoLog(program);
}
function getRenderbufferParameterOpt(target, pname) {
    flushCommand();
    return getRenderbufferParameter(target, pname);
}
function getShaderParameterOpt(shader, pname) {
    flushCommand();
    return getShaderParameter(shader, pname);
}
function getShaderPrecisionFormatOpt(shadertype, precisiontype) {
    flushCommand();
    return getShaderPrecisionFormat(shadertype, precisiontype);
}
function getShaderInfoLogOpt(shader) {
    flushCommand();
    return getShaderInfoLog(shader);
}
function getShaderSourceOpt(shader) {
    flushCommand();
    return getShaderSource(shader);
}
function getTexParameterOpt(target, pname) {
    flushCommand();
    return getTexParameter(target, pname);
}
function getUniformOpt(program, location) {
    flushCommand();
    return getUniform(program, location);
}
function getUniformLocationOpt(program, name) {
    flushCommand();
    return getUniformLocation(program, name);
}
function getVertexAttribOpt(index, pname) {
    flushCommand();
    return getVertexAttrib(index, pname);
}
function getVertexAttribOffsetOpt(index, pname) {
    flushCommand();
    return getVertexAttribOffset(index, pname);
}
function hintOpt(target, mode) {
    if (next_index + 3 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_HINT;
    buffer_data[next_index + 1] = target;
    buffer_data[next_index + 2] = mode;
    next_index += 3;
}
function isBufferOpt(buffer) {
    flushCommand();
    return isBuffer(buffer);
}
function isEnabledOpt(cap) {
    flushCommand();
    return isEnabled(cap);
}
function isFramebufferOpt(framebuffer) {
    flushCommand();
    return isFramebuffer(framebuffer);
}
function isProgramOpt(program) {
    flushCommand();
    return isProgram(program);
}
function isRenderbufferOpt(renderbuffer) {
    flushCommand();
    return isRenderbuffer(renderbuffer);
}
function isShaderOpt(shader) {
    flushCommand();
    return isShader(shader);
}
function isTextureOpt(texture) {
    flushCommand();
    return isTexture(texture);
}
function lineWidthOpt(width) {
    if (next_index + 2 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_LINE_WIDTH;
    buffer_data[next_index + 1] = width;
    next_index += 2;
}
function linkProgramOpt(program) {
    if (next_index + 2 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_LINK_PROGRAM;
    buffer_data[next_index + 1] = program;
    next_index += 2;
}
function pixelStoreiOpt(pname, param) {
    if (next_index + 3 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_PIXEL_STOREI;
    buffer_data[next_index + 1] = pname;
    buffer_data[next_index + 2] = param;
    next_index += 3;
}
function polygonOffsetOpt(factor, units) {
    if (next_index + 3 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_POLYGON_OFFSET;
    buffer_data[next_index + 1] = factor;
    buffer_data[next_index + 2] = units;
    next_index += 3;
}
function readPixelsOpt(x, y, width, height, format, type, pixels) {
    flushCommand();
    readPixels(x, y, width, height, format, type, pixels);
}
function renderbufferStorageOpt(target, internalformat, width, height) {
    if (next_index + 5 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_RENDER_BUFFER_STORAGE;
    buffer_data[next_index + 1] = target;
    buffer_data[next_index + 2] = internalFormat;
    buffer_data[next_index + 3] = width;
    buffer_data[next_index + 4] = height;
    next_index += 5;
}
function sampleCoverageOpt(value, invert) {
    if (next_index + 3 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_SAMPLE_COVERAGE;
    buffer_data[next_index + 1] = value;
    buffer_data[next_index + 2] = invert ? 1 : 0;
    next_index += 3;
}
function scissorOpt(x, y, width, height) {
    if (next_index + 5 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_SCISSOR;
    buffer_data[next_index + 1] = x;
    buffer_data[next_index + 2] = y;
    buffer_data[next_index + 3] = width;
    buffer_data[next_index + 4] = height;
    next_index += 5;
}
function shaderSourceOpt(shader, source) {
    flushCommand();
    shaderSource(shader, source);
}
function stencilFuncOpt(func, ref, mask) {
    if (next_index + 4 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_STENCIL_FUNC;
    buffer_data[next_index + 1] = func;
    buffer_data[next_index + 2] = ref;
    buffer_data[next_index + 3] = mask;
    next_index += 4;
}
function stencilFuncSeparateOpt(face, func, ref, mask) {
    if (next_index + 5 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_STENCIL_FUNC_SEPARATE;
    buffer_data[next_index + 1] = face;
    buffer_data[next_index + 2] = func;
    buffer_data[next_index + 3] = ref;
    buffer_data[next_index + 4] = mask;
    next_index += 5;
}
function stencilMaskOpt(mask) {
    if (next_index + 2 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_STENCIL_MASK;
    buffer_data[next_index + 1] = mask;
    next_index += 2;
}
function stencilMaskSeparateOpt(face, mask) {
    if (next_index + 3 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_STENCIL_MASK_SEPARATE;
    buffer_data[next_index + 1] = face;
    buffer_data[next_index + 2] = mask;
    next_index += 3;
}
function stencilOpOpt(fail, zfail, zpass) {
    if (next_index + 4 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_STENCIL_OP;
    buffer_data[next_index + 1] = fail;
    buffer_data[next_index + 2] = zfail;
    buffer_data[next_index + 3] = zpass;
    next_index += 4;
}
function stencilOpSeparateOpt(face, fail, zfail, zpass) {
    if (next_index + 5 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_STENCIL_OP_SEPARATE;
    buffer_data[next_index + 1] = face;
    buffer_data[next_index + 2] = fail;
    buffer_data[next_index + 3] = zfail;
    buffer_data[next_index + 4] = zpass;
    next_index += 5;
}
function texImage2DOpt(target, level, internalformat) {
    flushCommand();
    switch (arguments.length) {
    case 6: {
            var format = arguments[3];
            var type = arguments[4];
            var source = arguments[5];
            if (Object.prototype.hasOwnProperty.call(source, '__nativeObj')) {
                gl.glTexImage2D(target, level, internalformat, format, type, source.__nativeObj);
            } else {
                gl.glTexImage2D(target, level, internalformat, format, type, source);
            }
            break;
        }
    case 9: {
            var width = arguments[3];
            var height = arguments[4];
            var border = arguments[5];
            var format = arguments[6];
            var type = arguments[7];
            var pixels = arguments[8];
            gl.glTexImage2D(target, level, internalformat, width, height, border, format, type, pixels);
            break;
        }
    }
}
function texParameterfOpt(target, pname, param) {
    if (next_index + 4 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_TEX_PARAMETER_F;
    buffer_data[next_index + 1] = target;
    buffer_data[next_index + 2] = pname;
    buffer_data[next_index + 3] = param;
    next_index += 4;
}
function texParameteriOpt(target, pname, param) {
    if (next_index + 4 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_TEX_PARAMETER_I;
    buffer_data[next_index + 1] = target;
    buffer_data[next_index + 2] = pname;
    buffer_data[next_index + 3] = param;
    next_index += 4;
}
function texSubImage2DOpt(target, level, xoffset, yoffset, width, height, format, type, pixels) {
    flushCommand();
    texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels);
}
function texSubImage2DOpt(target, level, xoffset, yoffset, format, type, source) {
    flushCommand();
    texSubImage2D(target, level, xoffset, yoffset, format, type, source);
}
function uniform1fOpt(location, x) {
    if (next_index + 3 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_1F;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = x;
    next_index += 3;
}
function uniform2fOpt(location, x, y) {
    if (next_index + 4 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_2F;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = x;
    buffer_data[next_index + 3] = y;
    next_index += 4;
}
function uniform3fOpt(location, x, y, z) {
    if (next_index + 5 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_3F;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = x;
    buffer_data[next_index + 3] = y;
    buffer_data[next_index + 4] = z;
    next_index += 5;
}
function uniform4fOpt(location, x, y, z, w) {
    if (next_index + 6 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_4F;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = x;
    buffer_data[next_index + 3] = y;
    buffer_data[next_index + 4] = z;
    buffer_data[next_index + 5] = w;
    next_index += 6;
}
function uniform1iOpt(location, x) {
    if (next_index + 3 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_1I;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = x;
    next_index += 3;
}
function uniform2iOpt(location, x, y) {
    if (next_index + 4 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_2I;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = x;
    buffer_data[next_index + 3] = y;
    next_index += 4;
}
function uniform3iOpt(location, x, y, z) {
    if (next_index + 5 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_3I;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = x;
    buffer_data[next_index + 3] = y;
    buffer_data[next_index + 4] = z;
    next_index += 5;
}
function uniform4iOpt(location, x, y, z, w) {
    if (next_index + 6 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_4I;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = x;
    buffer_data[next_index + 3] = y;
    buffer_data[next_index + 4] = z;
    buffer_data[next_index + 5] = w;
    next_index += 6;
}
function uniform1fvOpt(location, value) {
    if (next_index + 3 + value.length >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_1FV;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = value.length;
    buffer_data.set(value, next_index + 3);
    next_index += 3 + value.length;
}
function uniform2fvOpt(location, value) {
    if (next_index + 3 + value.length >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_2FV;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = value.length;
    buffer_data.set(value, next_index + 3);
    next_index += 3 + value.length;
}
function uniform3fvOpt(location, value) {
    if (next_index + 3 + value.length >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_3FV;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = value.length;
    buffer_data.set(value, next_index + 3);
    next_index += 3 + value.length;
}
function uniform4fvOpt(location, value) {
    if (next_index + 3 + value.length >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_4FV;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = value.length;
    buffer_data.set(value, next_index + 3);
    next_index += 3 + value.length;
}
function uniform1ivOpt(location, value) {
    if (next_index + 3 + value.length >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_1IV;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = value.length;
    buffer_data.set(value, next_index + 3);
    next_index += 3 + value.length;
}
function uniform2ivOpt(location, value) {
    if (next_index + 3 + value.length >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_2IV;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = value.length;
    buffer_data.set(value, next_index + 3);
    next_index += 3 + value.length;
}
function uniform3ivOpt(location, value) {
    if (next_index + 3 + value.length >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_3IV;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = value.length;
    buffer_data.set(value, next_index + 3);
    next_index += 3 + value.length;
}
function uniform4ivOpt(location, value) {
    if (next_index + 3 + value.length >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_4IV;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = value.length;
    buffer_data.set(value, next_index + 3);
    next_index += 3 + value.length;
}
function uniformMatrix2fvOpt(location, transpose, value) {
    if (next_index + 4 + value.length >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_MATRIX_2FV;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = transpose;
    buffer_data[next_index + 3] = value.length;
    buffer_data.set(value, next_index + 4);
    next_index += 4 + value.length;
}
function uniformMatrix3fvOpt(location, transpose, value) {
    if (next_index + 4 + value.length >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_MATRIX_3FV;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = transpose;
    buffer_data[next_index + 3] = value.length;
    buffer_data.set(value, next_index + 4);
    next_index += 4 + value.length;
}
function uniformMatrix4fvOpt(location, transpose, value) {
    if (next_index + 4 + value.length >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_MATRIX_4FV;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = transpose;
    buffer_data[next_index + 3] = value.length;
    buffer_data.set(value, next_index + 4);
    next_index += 4 + value.length;
}
function useProgramOpt(program) {
    if (next_index + 2 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_USE_PROGRAM;
    buffer_data[next_index + 1] = program;
    next_index += 2;
}
function validateProgramOpt(program) {
    if (next_index + 2 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_VALIDATE_PROGRAM;
    buffer_data[next_index + 1] = program;
    next_index += 2;
}
function vertexAttrib1fOpt(index, x) {
    if (next_index + 3 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_VERTEX_ATTRIB_1F;
    buffer_data[next_index + 1] = index;
    buffer_data[next_index + 2] = x;
    next_index += 3;
}
function vertexAttrib2fOpt(index, x, y) {
    if (next_index + 4 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_VERTEX_ATTRIB_2F;
    buffer_data[next_index + 1] = index;
    buffer_data[next_index + 2] = x;
    buffer_data[next_index + 3] = y;
    next_index += 4;
}
function vertexAttrib3fOpt(index, x, y, z) {
    if (next_index + 5 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_VERTEX_ATTRIB_3F;
    buffer_data[next_index + 1] = index;
    buffer_data[next_index + 2] = x;
    buffer_data[next_index + 3] = y;
    buffer_data[next_index + 4] = z;
    next_index += 5;
}
function vertexAttrib4fOpt(index, x, y, z, w) {
    if (next_index + 6 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_VERTEX_ATTRIB_4F;
    buffer_data[next_index + 1] = index;
    buffer_data[next_index + 2] = x;
    buffer_data[next_index + 3] = y;
    buffer_data[next_index + 4] = z;
    buffer_data[next_index + 5] = w;
    next_index += 6;
}
function vertexAttrib1fvOpt(index, value) {
    if (next_index + 3 + value.length >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_VERTEX_ATTRIB_1FV;
    buffer_data[next_index + 1] = index;
    buffer_data[next_index + 2] = value.length;
    buffer_data.set(value, next_index + 3);
    next_index += 3 + value.length;
}
function vertexAttrib2fvOpt(index, value) {
    if (next_index + 3 + value.length >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_VERTEX_ATTRIB_2FV;
    buffer_data[next_index + 1] = index;
    buffer_data[next_index + 2] = value.length;
    buffer_data.set(value, next_index + 3);
    next_index += 3 + value.length;
}
function vertexAttrib3fvOpt(index, value) {
    if (next_index + 3 + value.length >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_VERTEX_ATTRIB_3FV;
    buffer_data[next_index + 1] = index;
    buffer_data[next_index + 2] = value.length;
    buffer_data.set(value, next_index + 3);
    next_index += 3 + value.length;
}
function vertexAttrib4fvOpt(index, value) {
    if (next_index + 3 + value.length >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_VERTEX_ATTRIB_4FV;
    buffer_data[next_index + 1] = index;
    buffer_data[next_index + 2] = value.length;
    buffer_data.set(value, next_index + 3);
    next_index += 3 + value.length;
}
function vertexAttribPointerOpt(index, size, type, normalized, stride, offset) {
    if (next_index + 7 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_VERTEX_ATTRIB_POINTER;
    buffer_data[next_index + 1] = index;
    buffer_data[next_index + 2] = size;
    buffer_data[next_index + 3] = type;
    buffer_data[next_index + 4] = normalized ? 1 : 0;
    buffer_data[next_index + 5] = stride;
    buffer_data[next_index + 6] = offset;
    next_index += 7;
}
function viewportOpt(x, y, width, height) {
    if (next_index + 5 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_VIEW_PORT;
    buffer_data[next_index + 1] = x;
    buffer_data[next_index + 2] = y;
    buffer_data[next_index + 3] = width;
    buffer_data[next_index + 4] = height;
    next_index += 5;
}
function isSupportTypeArray() {
    if (GameStatusInfo.platform == 'android') {
        return true;
    }
    var info = BK.Director.queryDeviceInfo();
    var vers = info.version.split('.');
    if (info.platform == 'ios' && Number(vers[0]) >= 10) {
        return true;
    }
    return false;
}
function attachMethodOpt() {
    gl.activeTexture = activeTextureOpt;
    gl.attachShader = attachShaderOpt;
    gl.bindAttribLocation = bindAttribLocationOpt;
    gl.bindBuffer = bindBufferOpt;
    gl.bindFramebuffer = bindFramebufferOpt;
    gl.bindRenderbuffer = bindRenderbufferOpt;
    gl.bindTexture = bindTextureOpt;
    gl.blendColor = blendColorOpt;
    gl.blendEquation = blendEquationOpt;
    gl.blendEquationSeparate = blendEquationSeparateOpt;
    gl.blendFunc = blendFuncOpt;
    gl.blendFuncSeparate = blendFuncSeparateOpt;
    gl.bufferData = bufferDataOpt;
    gl.bufferData = bufferDataOpt;
    gl.bufferSubData = bufferSubDataOpt;
    gl.checkFramebufferStatus = checkFramebufferStatusOpt;
    gl.clear = clearOpt;
    gl.clearColor = clearColorOpt;
    gl.clearDepth = clearDepthOpt;
    gl.clearStencil = clearStencilOpt;
    gl.colorMask = colorMaskOpt;
    gl.compileShader = compileShaderOpt;
    gl.compressedTexImage2D = compressedTexImage2DOpt;
    gl.compressedTexSubImage2D = compressedTexSubImage2DOpt;
    gl.copyTexImage2D = copyTexImage2DOpt;
    gl.copyTexSubImage2D = copyTexSubImage2DOpt;
    gl.createBuffer = createBufferOpt;
    gl.createFramebuffer = createFramebufferOpt;
    gl.createProgram = createProgramOpt;
    gl.createRenderbuffer = createRenderbufferOpt;
    gl.createShader = createShaderOpt;
    gl.createTexture = createTextureOpt;
    gl.cullFace = cullFaceOpt;
    gl.deleteBuffer = deleteBufferOpt;
    gl.deleteFramebuffer = deleteFramebufferOpt;
    gl.deleteProgram = deleteProgramOpt;
    gl.deleteRenderbuffer = deleteRenderbufferOpt;
    gl.deleteShader = deleteShaderOpt;
    gl.deleteTexture = deleteTextureOpt;
    gl.depthFunc = depthFuncOpt;
    gl.depthMask = depthMaskOpt;
    gl.depthRange = depthRangeOpt;
    gl.detachShader = detachShaderOpt;
    gl.disable = disableOpt;
    gl.disableVertexAttribArray = disableVertexAttribArrayOpt;
    gl.drawArrays = drawArraysOpt;
    gl.drawElements = drawElementsOpt;
    gl.enable = enableOpt;
    gl.enableVertexAttribArray = enableVertexAttribArrayOpt;
    gl.finish = finishOpt;
    gl.flush = flushOpt;
    gl.framebufferRenderbuffer = framebufferRenderbufferOpt;
    gl.framebufferTexture2D = framebufferTexture2DOpt;
    gl.frontFace = frontFaceOpt;
    gl.generateMipmap = generateMipmapOpt;
    gl.getActiveAttrib = getActiveAttribOpt;
    gl.getActiveUniform = getActiveUniformOpt;
    gl.getAttachedShaders = getAttachedShadersOpt;
    gl.getAttribLocation = getAttribLocationOpt;
    gl.getBufferParameter = getBufferParameterOpt;
    gl.getParameter = getParameterOpt;
    gl.getError = getErrorOpt;
    gl.getFramebufferAttachmentParameter = getFramebufferAttachmentParameterOpt;
    gl.getProgramParameter = getProgramParameterOpt;
    gl.getProgramInfoLog = getProgramInfoLogOpt;
    gl.getRenderbufferParameter = getRenderbufferParameterOpt;
    gl.getShaderParameter = getShaderParameterOpt;
    gl.getShaderPrecisionFormat = getShaderPrecisionFormatOpt;
    gl.getShaderInfoLog = getShaderInfoLogOpt;
    gl.getShaderSource = getShaderSourceOpt;
    gl.getTexParameter = getTexParameterOpt;
    gl.getUniform = getUniformOpt;
    gl.getUniformLocation = getUniformLocationOpt;
    gl.getVertexAttrib = getVertexAttribOpt;
    gl.getVertexAttribOffset = getVertexAttribOffsetOpt;
    gl.hint = hintOpt;
    gl.isBuffer = isBufferOpt;
    gl.isEnabled = isEnabledOpt;
    gl.isFramebuffer = isFramebufferOpt;
    gl.isProgram = isProgramOpt;
    gl.isRenderbuffer = isRenderbufferOpt;
    gl.isShader = isShaderOpt;
    gl.isTexture = isTextureOpt;
    gl.lineWidth = lineWidthOpt;
    gl.linkProgram = linkProgramOpt;
    gl.pixelStorei = pixelStoreiOpt;
    gl.polygonOffset = polygonOffsetOpt;
    gl.readPixels = readPixelsOpt;
    gl.renderbufferStorage = renderbufferStorageOpt;
    gl.sampleCoverage = sampleCoverageOpt;
    gl.scissor = scissorOpt;
    gl.shaderSource = shaderSourceOpt;
    gl.stencilFunc = stencilFuncOpt;
    gl.stencilFuncSeparate = stencilFuncSeparateOpt;
    gl.stencilMask = stencilMaskOpt;
    gl.stencilMaskSeparate = stencilMaskSeparateOpt;
    gl.stencilOp = stencilOpOpt;
    gl.stencilOpSeparate = stencilOpSeparateOpt;
    gl.texImage2D = texImage2DOpt;
    gl.texImage2D = texImage2DOpt;
    gl.texParameterf = texParameterfOpt;
    gl.texParameteri = texParameteriOpt;
    gl.texSubImage2D = texSubImage2DOpt;
    gl.texSubImage2D = texSubImage2DOpt;
    gl.uniform1f = uniform1fOpt;
    gl.uniform2f = uniform2fOpt;
    gl.uniform3f = uniform3fOpt;
    gl.uniform4f = uniform4fOpt;
    gl.uniform1i = uniform1iOpt;
    gl.uniform2i = uniform2iOpt;
    gl.uniform3i = uniform3iOpt;
    gl.uniform4i = uniform4iOpt;
    gl.uniform1fv = uniform1fvOpt;
    gl.uniform2fv = uniform2fvOpt;
    gl.uniform3fv = uniform3fvOpt;
    gl.uniform4fv = uniform4fvOpt;
    gl.uniform1iv = uniform1ivOpt;
    gl.uniform2iv = uniform2ivOpt;
    gl.uniform3iv = uniform3ivOpt;
    gl.uniform4iv = uniform4ivOpt;
    gl.uniformMatrix2fv = uniformMatrix2fvOpt;
    gl.uniformMatrix3fv = uniformMatrix3fvOpt;
    gl.uniformMatrix4fv = uniformMatrix4fvOpt;
    gl.useProgram = useProgramOpt;
    gl.validateProgram = validateProgramOpt;
    gl.vertexAttrib1f = vertexAttrib1fOpt;
    gl.vertexAttrib2f = vertexAttrib2fOpt;
    gl.vertexAttrib3f = vertexAttrib3fOpt;
    gl.vertexAttrib4f = vertexAttrib4fOpt;
    gl.vertexAttrib1fv = vertexAttrib1fvOpt;
    gl.vertexAttrib2fv = vertexAttrib2fvOpt;
    gl.vertexAttrib3fv = vertexAttrib3fvOpt;
    gl.vertexAttrib4fv = vertexAttrib4fvOpt;
    gl.vertexAttribPointer = vertexAttribPointerOpt;
    gl.viewport = viewportOpt;
    gl.glCommit = glCommitOpt;
}
function Text(style, content) {
    this.style = {
        'fontSize': 20,
        'textColor': 4294901760,
        'maxWidth': 200,
        'maxHeight': 400,
        'width': 100,
        'height': 200,
        'textAlign': 0,
        'bold': 1,
        'italic': 1,
        'strokeColor': 4278190080,
        'strokeSize': 5,
        'shadowRadius': 5,
        'shadowDx': 10,
        'shadowDy': 10,
        'shadowColor': 4294901760
    };
    this.setStyle(style);
    this._content = '';
    if (content)
        this._content = content;
    this.__nativeObj = new BK.TextNode(this.style, this._content);
    var names = Object.getOwnPropertyNames(this.__nativeObj);
    names.forEach(function (element) {
        var key = element;
        Object.defineProperty(this, key, {
            get: function () {
                return this.__nativeObj[key];
            },
            set: function (obj) {
                this.__nativeObj[key] = obj;
            }
        });
    }, this);
    Object.defineProperty(this, 'content', {
        get: function () {
            return this._content;
        },
        set: function (obj) {
            this._content = obj;
            this.__nativeObj.updateText(this.style, this._content);
        }
    });
    Object.defineProperty(this, 'fontSize', {
        get: function () {
            return this.style.fontSize;
        },
        set: function (obj) {
            this.style.fontSize = obj;
            this.__nativeObj.updateText(this.style, this._content);
        }
    });
    Object.defineProperty(this, 'fontColor', {
        get: function () {
            return this.style.textColor;
        },
        set: function (obj) {
            this.style.textColor = obj;
            this.__nativeObj.updateText(this.style, this._content);
        }
    });
    Object.defineProperty(this, 'maxSize', {
        get: function () {
            return {
                'width': this.style.maxWidth,
                'height': this.style.maxHeight
            };
        },
        set: function (obj) {
            this.style.maxWidth = obj.width;
            this.style.maxHeight = obj.height;
            this.__nativeObj.updateText(this.style, this._content);
        }
    });
    Object.defineProperty(this, 'bold', {
        get: function () {
            return this.style.bold;
        },
        set: function (obj) {
            this.style.bold = obj;
            this.__nativeObj.updateText(this.style, this._content);
        }
    });
    Object.defineProperty(this, 'italic', {
        get: function () {
            return this.style.italic;
        },
        set: function (obj) {
            this.style.italic = obj;
            this.__nativeObj.updateText(this.style, this._content);
        }
    });
    Object.defineProperty(this, 'horizontalAlign', {
        get: function () {
            return this.style.textAlign;
        },
        set: function (obj) {
            this.style.textAlign = obj;
            this.__nativeObj.updateText(this.style, this._content);
        }
    });
    Object.defineProperty(this, 'strokeColor', {
        get: function () {
            return this.style.strokeColor;
        },
        set: function (obj) {
            this.style.strokeColor = obj;
            this.__nativeObj.updateText(this.style, this._content);
        }
    });
    Object.defineProperty(this, 'strokeSize', {
        get: function () {
            return this.style.strokeSize;
        },
        set: function (obj) {
            this.style.strokeSize = obj;
            this.__nativeObj.updateText(this.style, this._content);
        }
    });
    Object.defineProperty(this, 'shadowColor', {
        get: function () {
            return this.style.shadowColor;
        },
        set: function (obj) {
            this.style.shadowColor = obj;
            this.__nativeObj.updateText(this.style, this._content);
        }
    });
    Object.defineProperty(this, 'shadowRadius', {
        get: function () {
            return this.style.shadowRadius;
        },
        set: function (obj) {
            this.style.shadowRadius = obj;
            this.__nativeObj.updateText(this.style, this._content);
        }
    });
    Object.defineProperty(this, 'shadowOffset', {
        get: function () {
            return {
                'x': this.style.shadowDx,
                'y': this.style.shadowDy
            };
        },
        set: function (obj) {
            this.style.shadowDx = obj.x;
            this.style.shadowDy = obj.y;
            this.__nativeObj.updateText(this.style, this._content);
        }
    });
}
Text.prototype.setStyle = function (style) {
    if (style) {
        this.style = {
            'fontSize': style.fontSize,
            'textColor': style.textColor,
            'maxWidth': style.maxWidth,
            'maxHeight': style.maxHeight,
            'width': style.width,
            'height': style.height,
            'textAlign': style.textAlign,
            'bold': style.bold,
            'italic': style.italic,
            'strokeColor': style.strokeColor,
            'strokeSize': style.strokeSize,
            'shadowRadius': style.shadowRadius,
            'shadowDx': style.shadowDx,
            'shadowDy': style.shadowDy,
            'shadowColor': style.shadowColor
        };
    }
};
Text.prototype.measureTextSize = function () {
    if (arguments.length == 2) {
        return BK.TextNode.measureTextSize(arguments[0], arguments[1]);
    }
    return undefined;
};
Text.measureTextSize = function () {
    if (arguments.length == 2) {
        return BK.TextNode.measureTextSize(arguments[0], arguments[1]);
    }
    return undefined;
};
BK.Text = Text;
BK.Script.log(0, 0, 'Load Text.js succeed.');
