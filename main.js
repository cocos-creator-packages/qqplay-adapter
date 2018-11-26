/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

'use strict';

const JSZip = require('./lib/jszip.min.js');
const Async = require("async");

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
        Editor.warn(Editor.T('qqplay-adapter.log.download_err',{err: err}));
    });
}

function _addFileToZip (dir, zip, cb) {
    let files = fs.readdirSync(dir);
    let index = 0;

    if (index === files.length) {
        return cb();
    }

    Async.whilst(
        function () {
            return index < files.length;
        },
        function (whileCb) {
            let file = files[index];
            let pathname = path.join(dir, file);
            if (fs.lstatSync(pathname).isDirectory()) {
                let folder = zip.folder(file);
                _addFileToZip(pathname, folder, ()=>{
                    index++;
                    whileCb();
                });
            }
            else {
                zip.file(file, fs.readFileSync(pathname));
                index++;
                whileCb();
            }
        },
        function () {
            cb();
        }
    );
}

function unpackZip(opts, cb) {
    if (opts.platform !== 'qqplay' || !opts.qqplay.zip) {
        return cb();
    }

    Editor.log('Start unpack zip');

    let jsZip = new JSZip();
    _addFileToZip(opts.dest, jsZip, () => {
        let basePath = path.join(opts.buildPath, opts.title);
        jsZip.generateNodeStream(
            {
                type: "nodebuffer",
                compression: "DEFLATE",
                compressionOptions: {
                    level: 9
                }
            })
            .pipe(fs.createWriteStream(basePath + '.zip'))
            .on('finish', ()=>{
                Editor.log('Finish unpack zip');
                cb();
            });
    });
}


module.exports = {
  load () {
      Editor.Builder.on('build-finished', updateQqPlayCore);
      Editor.Builder.on('build-finished', unpackZip);
  },

  unload () {
      Editor.Builder.removeListener('build-finished', updateQqPlayCore);
      Editor.Builder.removeListener('build-finished', unpackZip);
  }
};
