'use strict';

let dialog = {
    message: '更新提示',
    detail: '检查到 qqPlayCore 有新版本，是否更新到当前项目的 build-templates？',
};

let log = {
    complete: '更新 qqPlayCore 脚本完成，代码所在地为 %{path}',
    download_err: '更新 qqPlayCore 失败, %{err}'
};

module.exports = {
    dialog,
    log
};