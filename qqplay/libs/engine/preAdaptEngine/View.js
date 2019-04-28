let viewProto = {
    _adjustViewportMeta: function () {
        // qq not support
    },

    setRealPixelResolution: function (width, height, resolutionPolicy) {
        // Reset the resolution size and policy
        this.setDesignResolutionSize(width, height, resolutionPolicy);
    },

    enableAutoFullScreen: function (enabled) {
        // qq not support
    },
};

window.__preAdapter.viewProto = viewProto;