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
