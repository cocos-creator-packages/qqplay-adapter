var inputManager = _cc.inputManager;

Object.assign(inputManager, {
    _isRegisterEvent: false,

    _preTouchPoint: cc.v2(0, 0),

    _preTouchPool: [],
    _preTouchPoolPointer: 0,

    _touches: [],
    _touchesIntegerDict: {},

    _indexBitsUsed: 0,
    _maxTouches: 5,

    _glView: null,

    /**
     * @method getTouchByXY
     * @param {Number} tx
     * @param {Number} ty
     * @param {Vec2} pos
     * @return {Touch}
     */
    getTouchByXY: function (tx, ty, pos) {
        var locPreTouch = this._preTouchPoint;
        var location = this._glView.convertToLocationInView(tx, ty, pos);
        var touch = new cc.Touch(location.x, location.y);
        touch._setPrevPoint(locPreTouch.x, locPreTouch.y);
        locPreTouch.x = location.x;
        locPreTouch.y = location.y;
        return touch;
    },

    /**
     * @method getTouchesByEvent
     * @param {Touch} event
     * @param {Vec2} pos
     * @returns {Array}
     */
    getTouchesByEvent: function (event) {
        var touchArr = [], locView = this._glView;
        var touch_event, touch, preLocation;
        var locPreTouch = this._preTouchPoint;
        var length = event.length;
        for (var i = 0; i < length; i++) {
            touch_event = event[i];
            if (touch_event) {

                var location = locView.convertToLocationInView(touch_event.x, touch_event.y, this._relatedPos);
                location.y = cc.game.canvas.height - location.y;
                if (touch_event.id != null) {
                    touch = new cc.Touch(location.x, location.y, touch_event.id);
                    //use Touch Pool
                    preLocation = this.getPreTouch(touch).getLocation();
                    touch._setPrevPoint(preLocation.x, preLocation.y);
                    this.setPreTouch(touch);
                }
                else {
                    touch = new cc.Touch(location.x, location.y);
                    touch._setPrevPoint(locPreTouch.x, locPreTouch.y);
                }
                locPreTouch.x = location.x;
                locPreTouch.y = location.y;
                touchArr.push(touch);
            }
        }
        return touchArr;
    },

    // bk game
    detectGesture: function () {
        var allTouchArr = BK.TouchEvent.getAllTouchEvent();
        if (!allTouchArr) {
            return;
        }

        var _touchBeginEvents = [];
        var _touchMoveEvents = [];
        var _touchEndEvents = [];

        var touchArr = allTouchArr;
        for(var i = 0; i < touchArr.length; i++) {
            _touchBeginEvents.length = 0;
            _touchMoveEvents.length = 0;
            _touchEndEvents.length = 0;

            for (var j = 0; j < touchArr[i].length; ++j) {

                var touch_event = touchArr[i][j];
                //touch begin
                if (touch_event.status === 2) {
                    _touchBeginEvents.push(touch_event);
                }
                //touch moved
                else if (touch_event.status === 3) {
                    _touchMoveEvents.push(touch_event);
                }
                //touch end
                else if (touch_event.status === 1) {
                    _touchEndEvents.push(touch_event);
                }
            }

            if (_touchBeginEvents.length > 0) {
                this.handleTouchesBegin(this.getTouchesByEvent(_touchBeginEvents));
            }
            if (_touchMoveEvents.length > 0) {
                this.handleTouchesMove(this.getTouchesByEvent(_touchMoveEvents));
            }
            if (_touchEndEvents.length > 0) {
                this.handleTouchesEnd(this.getTouchesByEvent(_touchEndEvents));
            }

        }

    },

    /**
     * @method registerSystemEvent
     * @param {HTMLElement} element
     */
    registerSystemEvent: function (element) {
        this._glView = cc.view;
        this._relatedPos = {
            left: 0,
            top: 0,
            width: element.width,
            height: element.height
        };
        BK.Script.getTouchModeAll = 1;
    },

    _registerKeyboardEvent: function () {
    },

    _registerAccelerometerEvent: function () {
    },
});

BK.inputManager = inputManager;