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

function _HTMLEventElement () {
    this._events = {};
}

(function (prop) {
    
    prop.addEventListener = function (name, callback) {
        if (!this._events[name]) {
            this._events[name] = [];
        }
        var list = this._events[name];
        if (list.indexOf(callback) === -1) {
            list.push(callback);
        }
    };

    prop.removeEventListener = function (name, callback) {
        var list = this._events[name];
        if (!list) return;
        var index = list.indexOf(callback);
        list.splice(index, 1);
    };

    prop.emit = function (name, args) {
        var list = this._events[name];
        if (!list) return;
        for (var i = 0; i < list.length; i++) {
            list[i].apply(this, [args]);
        }
    };

    prop.dispatchEvent = function (event) {
        if (!event) {
            return;
        }
        var name = event.name;
        this.emit(name, [event]);
    };

})(_HTMLEventElement.prototype);


function _ClassList () {
    Array.call(this);
}

(function(prop) {

    prop.constructor = _ClassList;

    prop.add = function (name) {
        if (this.indexOf(name) !== -1) {
            return;
        }
        this.push(name);
    };

    prop.remove = function (name) {
        var index = this.indexOf(name);
        if (index === -1) {
            return;
        }
        this.splice(index, 1);
    };

    prop.toString = function () {
        return this.join(' ');
    };
})(_ClassList.prototype = new Array);

function _HTMLBaseElemenet () {
    _HTMLEventElement.call(this);
    this.id = '';
    this.tagName = 'BASE';
    this.classList = new _ClassList();
    this.innerHTML = '';
    this.style = {};

    this.scrollLeft = 0;
    this.scrollTop = 0;

    this.children = [];
    this._attrs = {};
}

(function (prop) {
    prop.constructor = _HTMLBaseElemenet;

    Object.defineProperty(prop, 'className', {
        get: function () {
            return this.classList.toString();
        },
    
        set: function (str) {
            str.split(' ').forEach(function (name) {
                this.classList.add(name);
            }.bind(this));
        },
    });

    prop.appendChild = function (element) {
        this.children.push(element);
        element.parentNode = this;
        element.emit('mount');
    };

    prop.removeChild = function (element) {
        var index = this.children.indexOf(element);
        if (index !== -1) {
            this.children[index].parentNode = null;
            this.children.splice(index, 1);
        }
    };

    prop.insertBefore = function (d, s) {
        if (d.parentNode) {
            d.parentNode.removeChild(d);
        }

        var index = s.parentNode.children.indexOf(s);
        s.parentNode.children.splice(index, 0, d);
        d.parentNode = s.parentNode;
    };

    prop.setAttribute = function (name, value) {
        this._attrs[name] = value;
    };

    prop.getAttribute = function (name) {
        return this._attrs[name] || null;
    };

    prop.removeAttribute = function (name) {
        delete this._attrs[name];
        return null;
    };

    prop.querySelector = function (query) {
        var list = [];
        var type;
        switch (query[0]) {
            case '.':
                type = 'className';
                query = query.substr(1, query.length - 1);
                break;
            case '#':
                type = 'id';
                query = query.substr(1, query.length - 1);
                break;
            default:
                type = 'tagName';
                query = query.toUpperCase();
        }

        var exec = function (element) {
            if (element[type].indexOf(query) !== -1) {
                list.push(element);
            }

            element.children && element.children.forEach(exec);
        };

        exec(this);
        if (type === 'id') {
            return list[0] || null;
        }
        return list.length > 0 ? list : null;
    };

    prop.getElementById = function (name) {
        return this.querySelector('#' + name);
    };

    prop.getElementsByClassName = function (name) {
        return this.querySelector('.' + name);
    };

    prop.getElementsByTagName = function (name) {
        return this.querySelector(name);
    };

    prop.focus = function () {};

})(_HTMLBaseElemenet.prototype = new _HTMLEventElement);
