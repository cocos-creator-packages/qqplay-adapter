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

 (function () {
    if (!(cc && cc.EditBox)) {
        return;
    }
    var EditBox = cc.EditBox;
    var js = cc.js;
    
    function QQEditBoxImpl () {
        this._delegate = null;
        this._editing = false;
    }
   
    js.extend(QQEditBoxImpl, EditBox._ImplClass);
    EditBox._ImplClass = QQEditBoxImpl;

    // bind this pointer when register callback
    function _onBKBtnClick (text) {
        this._delegate.editBoxEditingReturn();
        this.endEditing();
    }

    // bind this pointer when register callback
    function _onBKTextChange (text) {
        var delegate = this._delegate;

        if (text.length > delegate.maxLength) {
            text = text.slice(0, delegate.maxLength);
            BK.Editor.setText(text);  // limit the maxLength in BK.Editor
        }
        if (delegate._string !== text) {
            delegate.editBoxTextChanged(text);
        }
    }
    
    Object.assign(QQEditBoxImpl.prototype, {
        init: function (delegate) {
            if (!delegate) {
                cc.error('EditBox init failed');
                return;
            }
            this._delegate = delegate;
        },
    
        setFocus: function (value) {
            if (value) {
                this.beginEditing();
            }
            else {
                this.endEditing();
            }
        },
    
        isFocused: function () {
            return this._editing;
        },
    
        beginEditing: function () {
            var delegate = this._delegate;
            this._editing = true;
            BK.Editor.showKeyBoard(_onBKBtnClick.bind(this), _onBKTextChange.bind(this));
            BK.Editor.setText(delegate._string);
            delegate.editBoxEditingDidBegan();
        },
        
        endEditing: function () {
            this._editing = false;
            BK.Editor.hideKeyBoard();
            this._delegate.editBoxEditingDidEnded();    
        },
    });
 })();
