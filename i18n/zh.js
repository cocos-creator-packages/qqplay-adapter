'use strict';

let dialog = {
    message: '更新提示',
    detail: '检查到 qqPlayCore 有新版本，是否更新到当前项目的 build-templates？',
};

let log = {
    complete: 'qqPlayCore 已更新到 %{path}，请重新构建项目',
    download_err: '更新 qqPlayCore 失败, %{err}'
};

module.exports = {
    dialog,
    log
};