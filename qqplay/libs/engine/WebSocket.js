// WebSocket 适配层
var WebSocket = window.WebSocket = BK.WebSocket;

WebSocket.CONNECTING = 0;
WebSocket.OPEN = 1;
WebSocket.CLOSING = 2;
WebSocket.CLOSED = 3;

// adaptation readyState
// https://developer.mozilla.org/en-US/docs/Web/API/WebSocket#Ready_state_constants
Object.defineProperty(WebSocket.prototype, "readyState", {
    get: function () {
        var readyState = this.getReadyState();
        //console.log("defineProperty readyState" + readyState)
        if (readyState === 4 /* ESTABLISHED */)
            return WebSocket.OPEN;
        if (readyState === 2 /* HANDSHAKE_REQ */ || readyState === 3 /* HANDSHAKE_RESP */)
            return WebSocket.CONNECTING;
        if (readyState === 1 /* CLOSING */)
            return WebSocket.CLOSING;
        if (readyState === 0 /* CLOSED */)
            return WebSocket.CLOSED;
        return -1;
    }
});