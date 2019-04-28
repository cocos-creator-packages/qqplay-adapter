// check macro in CCSys.js
var QQ_PLAY = 105;
var OS_ANDROID = 'Android';
var OS_IOS ='iOS';
var BROWSER_TYPE_QQ_PLAY = 'qqplay';
var LANGUAGE_UNKNOWN = 'unknown';
var OS_UNKNOWN = 'Unknown';

const systemInfo = {};

// IIFE: initSystemInfo
(function () {
    var env = BK.Director.queryDeviceInfo();
    systemInfo.isNative = false;
    systemInfo.isBrowser = false;
    systemInfo.isMobile = true;
    systemInfo.platform = QQ_PLAY;
    systemInfo.language = LANGUAGE_UNKNOWN;
    systemInfo.languageCode = undefined;

    if (env.platform === "android") {
        systemInfo.os = OS_ANDROID;
    }
    else if (env.platform === "ios") {
        systemInfo.os = OS_IOS;
    }
    else {
        systemInfo.os = OS_UNKNOWN;
    }

    systemInfo.osVersion = env.version;
    systemInfo.osMainVersion = parseInt(systemInfo.osVersion.split('.')[0]);
    systemInfo.browserType = BROWSER_TYPE_QQ_PLAY;
    systemInfo.browserVersion = 0;

    var w = env.screenWidth;
    var h = env.screenHeight;
    var ratio = env.pixelRatio || 1;
    systemInfo.windowPixelResolution = {
        width: ratio * w,
        height: ratio * h
    };

    systemInfo.localStorage = window.localStorage;

    systemInfo.capabilities = {
        "canvas": false,
        "opengl": true,
        "webp": false,
    };
    systemInfo.audioSupport = {
        ONLY_ONE: false,
        WEB_AUDIO: false,
        DELAY_CREATE_CTX: false,
        format: ['.mp3'],
    };
})();

window.__preAdapter.systemInfo = systemInfo;