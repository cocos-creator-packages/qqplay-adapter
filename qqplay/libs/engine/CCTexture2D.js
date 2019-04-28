const Texture2D = cc.Texture2D;

Object.assign(Texture2D.prototype, {
    initWithElement: function (element) {
        if (!element)
            return;
        this._image = element;
        
        this.handleLoadedTexture();
    },
});