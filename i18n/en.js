'use strict';

let dialog = {
    message: 'Update tips',
    detail: 'There is a new version of qqPlayCore, do you want to update to the build-templates of the current project?',
};

let log = {
    complete: 'Update qqPlayCore completed, saved in %{path}',
    download_err: 'Failed to update qqPlayCore, %{err}'
};


module.exports = {
    dialog
};