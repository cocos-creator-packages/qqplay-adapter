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

if (cc.EditBox) {
    var KeyboardReturnType = cc.EditBox.KeyboardReturnType;
    var _p = cc.EditBox._EditBoxImpl.prototype;

    var component;
    var impl;

    function _onBKBtnClick (text) {

        _onBKTextChange(text);

        if (impl._delegate && impl._delegate.editBoxEditingReturn) {
            impl._delegate.editBoxEditingReturn();
        }
        if (impl._delegate && impl._delegate.editBoxEditingDidEnded) {
            impl._delegate.editBoxEditingDidEnded();
        }

        impl._editing = false;
        BK.Editor.hideKeyBoard();
    }

    function _onBKTextChange (text) {
        if (text.length > impl._maxLength) {
            text = text.slice(0, impl._maxLength);
        }

        if (impl._delegate && impl._delegate.editBoxTextChanged) {
            if (impl._text !== text) {
                if (text === '') {
                    _hideTextLabel();
                }
                else {
                    _showTextLabel();
                }
                impl._text = text;
                impl._delegate.editBoxTextChanged(impl._text);
            }
        }
    }

    function _showTextLabel () {
        if (component) {
            component._textLabel.node.active = true;
            component._placeholderLabel.node.active = false;
        }
    }

    function _hideTextLabel () {
        if (component) {
            component._textLabel.node.active = false;
            component._placeholderLabel.node.active = true;
        }
    }

    _p._beginEditing = function () {
        if (impl !== this) {
            impl = this;
            component = this._node.getComponent(cc.EditBox);
        }
        BK.Editor.showKeyBoard(_onBKBtnClick.bind(impl), _onBKTextChange.bind(impl));
        BK.Editor.setText(impl._text);
        if (impl._delegate && impl._delegate.editBoxEditingDidBegan) {
            impl._delegate.editBoxEditingDidBegan();
        }
        _showTextLabel();
        impl._editing = true;
    };
}
