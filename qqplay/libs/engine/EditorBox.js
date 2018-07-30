var KeyboardReturnType = cc.EditBox.KeyboardReturnType;
var _p = cc.EditBox._EditBoxImpl.prototype;

var curEditBoxComp;
var curEditBoxImpl;

function _onBKBtnClick (text) {
    this._text = text;
    if (this._delegate && this._delegate.editBoxEditingReturn) {
        this._delegate.editBoxEditingReturn();
    }
    if (this._delegate && this._delegate.editBoxEditingDidEnded) {
        this._delegate.editBoxEditingDidEnded();
    }
    this._editing = false;
}

function _onBKTextChange (text) {
    if (text.length > this._maxLength) {
        text = text.slice(0, this._maxLength);
    }

    if (this._delegate && this._delegate.editBoxTextChanged) {
        if (this._text !== text) {

            if (text === '') {
                _hideTextLabel();
            }
            else {
                _showTextLabel();
            }

            this._text = text;
            this._delegate.editBoxTextChanged(this._text);
        }
    }
}

function _showTextLabel () {
    if (curEditBoxComp) {
        curEditBoxComp._textLabel.node.active = true;
        curEditBoxComp._placeholderLabel.node.active = false;
    }
}

function _hideTextLabel () {
    if (curEditBoxComp) {
        curEditBoxComp._textLabel.node.active = false;
        curEditBoxComp._placeholderLabel.node.active = true;
    }
}

_p._beginEditing = function () {
    if (curEditBoxImpl !== this) {
        curEditBoxImpl = this;
        curEditBoxComp = this._node.getComponent(cc.EditBox);
    }
    BK.Editor.showKeyBoard(_onBKBtnClick.bind(this), _onBKTextChange.bind(this));
    BK.Editor.setText(this._text);
    if (this._delegate && this._delegate.editBoxEditingDidBegan) {
        this._delegate.editBoxEditingDidBegan();
    }

    _showTextLabel();

    this._editing = true;
};
