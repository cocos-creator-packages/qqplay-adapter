'use strict';

const request = require('request');
const fs = require('fs');
const path = require('path');
const day7 = 604800000;

let profile;

function mkdirSync (dir, cb) {
    let paths = dir.split('/');

    function next (index) {
        if (index > paths.length) return cb();

        let newPath = paths.slice(0, index).join('/');
        fs.access(newPath, function (err) {
            if (err) {
                fs.mkdir(newPath, function (err) {
                    next(index + 1);
                });
            } else {
                next(index + 1);
            }
        })
    }
    next(1);
}

function getVersion (data) {
    if (data) {
        let str = data.match(/version:'(\S*)',c/);
        if (str && str.length > 1) {
            return str[1];
        }
    }
    return -1;
}

function saveTime () {
    if (profile) {
        profile.data['current-time'] = Date.now();
        profile.save();
    }
}

function updateQqPlayCore (opts, cb) {
    if (opts.platform !== 'qqplay') {
        return cb();
    }

    cb();

    profile = Editor.Profile.load('profile://local/qqplay-adapter.json');

    if (Date.now() - profile.data['current-time'] < day7) {
        return;
    }

    console.log('start chack qqPlayCore');

    let remote_path = "http://hudong.qq.com/docs/engine/engine/native/qqPlayCore.js";
    let local_core_path = Editor.url('packages://qqplay-adapter/qqplay/libs/qqPlayCore.js');
    let default_templates_path = path.join(Editor.projectPath, 'build-templates', 'qqplay', 'libs');
    let qqPlayCore_path = path.join(default_templates_path, 'qqPlayCore.js');

    request(remote_path, (err, response, data) => {
        console.log('download qqPlayCore successfully');

        if (err) {
            Editor.error(err);
            return;
        }
        let remote_version = getVersion(data);

        if (fs.existsSync(qqPlayCore_path)) {
            let templates_version = getVersion(fs.readFileSync(qqPlayCore_path, 'utf8'));
            if (remote_version === templates_version) {
                saveTime();
                return;
            }
        }

        let local_version = getVersion(fs.readFileSync(local_core_path, 'utf8'));
        if (remote_version === local_version) {
            saveTime();
            return;
        }

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
            mkdirSync(default_templates_path, () => {
                fs.writeFile(qqPlayCore_path, data, (err) => {
                    if (err) {
                        Editor.error(err);
                        return;
                    }
                    Editor.log(Editor.T('qqplay-adapter.log.complete', { path: default_templates_path }));
                    saveTime();
                });
            });
        }
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
