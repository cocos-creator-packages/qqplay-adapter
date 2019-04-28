
cc.loader.downloader.loadSubpackage = function (name, completeCallback) {
    BK.loadSubpackage({
        name: name,
        success: function (succInfo) {
            if (completeCallback) {
                completeCallback();
            }
        },
        fail: function (failInfo) {
            if (completeCallback) {
                completeCallback(new Error('Failed to load subpackage ' + name + ' ' + failInfo.msg));
            }
        }
    })
};

function loadImage (item) {
    var loadByDeserializedAsset = (item._owner instanceof cc.Asset);
    if (loadByDeserializedAsset) {
        // already has cc.Asset
        return null;
    }

    var image = item.content;

    // load cc.Texture2D
    var rawUrl = item.rawUrl;
    var tex = item.texture || new Texture2D();
    tex._uuid = item.uuid;
    tex.url = rawUrl;
    tex._setRawAsset(rawUrl, false);
    tex._nativeAsset = image;
    return tex;
}

cc.loader.loader.addHandlers({
    // Images
    png : loadImage,
    jpg : loadImage,
    bmp : loadImage,
    jpeg : loadImage,
    gif : loadImage,
    ico : loadImage,
    tiff : loadImage,
    webp : loadImage,
    image : loadImage,
});