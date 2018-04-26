var gl = window.gl = null;

function HTMLMainCanvasElement () {
    _HTMLBaseElemenet.call(this);
    this.tagName = 'CANVAS';
    if (gl) {
        return;
    }
    gl = bkWebGLGetInstance();
    gl.getImageData = gl.getExtension = gl.getSupportedExtensions = function () {
        return [];
    };
    var _gl_texImage2D = gl.texImage2D;
    gl.texImage2D = function(){
        if(arguments.length === 6 && arguments[5] instanceof Image){
            arguments[5] = arguments[5].bkImage;
        }
        _gl_texImage2D.apply(this, arguments);
    };
}

(function (prop) {
    prop.constructor = HTMLMainCanvasElement;

    prop.getContext = function () {
        return gl;
    };
})(HTMLMainCanvasElement.prototype = new _HTMLBaseElemenet);
