
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