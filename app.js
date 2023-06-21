'use strict';
exports.__esModule = true;
try {
    require('./dist/main');
} catch (e) {
    try {
        require('./dist/src/main');
    } catch (err) {
        console.error(err);
    }
}
