const containerStrategyProto = {
    _setupContainer: function (view, w, h) {
        var locCanvas = cc.game.canvas, locContainer = cc.game.container;

        // Setup pixel ratio for retina display
        var devicePixelRatio = view._devicePixelRatio = 1;
        if (view.isRetinaEnabled())
            devicePixelRatio = view._devicePixelRatio = Math.min(view._maxPixelRatio, window.devicePixelRatio || 1);
        // Setup canvas
        locCanvas.width = w * devicePixelRatio;
        locCanvas.height = h * devicePixelRatio;
    },
}

window.__preAdapter.containerStrategyProto = containerStrategyProto;