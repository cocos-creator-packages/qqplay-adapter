// check macro in CCSys.js
var QQ_PLAY = 105;
var OS_ANDROID = 'Android';
var OS_IOS ='iOS';
var BROWSER_TYPE_QQ_PLAY = 'qqplay';
var LANGUAGE_UNKNOWN = 'unknown';
var OS_UNKNOWN = 'Unknown';

function BrowserGetter () {
    this.adaptationType = BROWSER_TYPE_QQ_PLAY;
    this.meta = {
        "width": "device-width"
    };
}

Object.assign(BrowserGetter.prototype, {
    init: function () {
        // do nothing...
    },
    availWidth: function (frame){
        if (!frame || frame === this.html)
            return window.innerWidth;
        else
            return frame.clientWidth;
    },
    availHeight: function (frame){
        if (!frame || frame === this.html)
            return window.innerHeight;
        else
            return frame.clientHeight;
    },
});

window.__preAdapter.browserGetter = new BrowserGetter();