// Local Storage 适配层
(function _adaptLocalStorage () {
    var LocalStoragePath = 'GameSandBox://cc_local_storage.json';
    window.localStorage = {//cc.sys.localStorage
        _readData: function () {
            if (!BK.FileUtil.isFileExist(LocalStoragePath)) {
                return {};
            }
            try {
                var buff = BK.FileUtil.readFile(LocalStoragePath);
                return JSON.parse(buff.readAsString());
            }
            catch (e){
                debugger;
                console.log('read data failed: '+  e);
                return {};
            }
        },
        _saveData: function (data) {
            if (!data) return;
            try {
                BK.FileUtil.writeFile(LocalStoragePath, JSON.stringify(data));
            }
            catch (e){
                debugger;
                console.log('save data failed: '+  data);
            }
        },
        getItem: function (key) {
            var data = this._readData();
            return data[key] || null;
        },
        setItem: function (key, content) {
            var data = this._readData();
            data[key] = content;
            this._saveData(data);
        },
        removeItem: function (key) {
            var data = this._readData();
            delete data[key];
            this._saveData(data);
        },
        clear: function () {
            this._saveData({});
        }
    };
})();