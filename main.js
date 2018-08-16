'use strict';

const download = require('download');
const fs = require('fire-fs');
const path = require('path');
const minCheckDuration = 3600 * 24 * 7;

const remote_path = "http://hudong.qq.com/docs/engine/engine/native/qqPlayCore.js";

let profile;

function getVersion (data) {
    if (data) {
        let str = data.match(/\bversion:\s*'([^']+)',/);
        if (str && str.length > 1) {
            return str[1];
        }
    }
    return -1;
}

function saveProfile (key, value) {
    if (profile) {
        profile.data[key] = value;
        profile.save();
    }
}

function getFileStat (path) {
    try {
        return fs.statSync(path);
    }
    catch (err) {
        return null;   
    }
}

let hasOpenMessageBox = false;
function updateQqPlayCore (opts, cb) {
    if (opts.platform !== 'qqplay') {
        return cb();
    }

    cb();

    profile = Editor.Profile.load('profile://local/qqplay-adapter.json');

    let local_core_path = Editor.url('packages://qqplay-adapter/qqplay/libs/qqPlayCore.js');
    let default_templates_path = path.join(Editor.projectPath, 'build-templates', 'qqplay', 'libs');
    let qqPlayCore_path = path.join(default_templates_path, 'qqPlayCore.js');

    // 检查时间是否满足
    if (Date.now() - profile.data['time-last-check-for-update'] < minCheckDuration) {
        return;
    }

    let stat = getFileStat(qqPlayCore_path);
    if (stat && (Date.now() - stat.mtime.getTime() < minCheckDuration)) {
        return;
    }

    // 保存检查时间，重新计算
    saveProfile('time-last-check-for-update', Date.now());
    download(remote_path).then((buffer) => {
        if (hasOpenMessageBox) {
            return;
        }

        let data = buffer.toString();
        let remote_version = getVersion(data);

        if (fs.existsSync(qqPlayCore_path)) {
            let templates_version = getVersion(fs.readFileSync(qqPlayCore_path, 'utf8'));
            if (remote_version === templates_version) {
                return;
            }
        }
        else {
            let local_version = getVersion(fs.readFileSync(local_core_path, 'utf8'));
            if (remote_version === local_version) {
                return;
            }
        }

        hasOpenMessageBox = true;
        let resultId = Editor.Dialog.messageBox({
            type: 'info',
            buttons: [Editor.T('MESSAGE.yes'), Editor.T('MESSAGE.no')],
            message: Editor.T('qqplay-adapter.dialog.message'),
            detail: Editor.T('qqplay-adapter.dialog.detail'),
            defaultId: 0,
            cancelId: 1,
            noLink: true,
        });

        if (resultId === 0) {
            // 存储远程版本号
            fs.outputFile(qqPlayCore_path, buffer, (err) => {
                if (err) {
                    Editor.error(err);
                    return;
                }
                Editor.log(Editor.T('qqplay-adapter.log.complete', { path: default_templates_path }));
            });
        }
        hasOpenMessageBox = false;
    }).catch((err) => {
        console.warn(Editor.T('qqplay-adapter.log.download_err',{err: err}));
    });
}

module.exports = {
  load () {
      Editor.Builder.on('build-finished', updateQqPlayCore);
  },

  unload () {
      Editor.Builder.removeListener('build-finished', updateQqPlayCore);
  }
};
