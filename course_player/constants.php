<?php

function isSecure() {
    return
        (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || $_SERVER['SERVER_PORT'] == 443;
}

define("__DIRNAME__", __DIR__);
define('MAIN_DIR',  '/');
define('HTTP_MAIN', $_SERVER['HTTP_HOST'] . MAIN_DIR);
define('HTTP_IMAGE', (isSecure() ? 'https' : 'http') . '://' . HTTP_MAIN . 'assets/image/');
define('HTTP_MAIN_SERVER', (isSecure() ? 'https' : 'http') . '://' . HTTP_MAIN);
define('DIR_FILES',__DIRNAME__  . '/assets/files');
define('HTTP_FILES',(isSecure() ? 'https' : 'http') . '://' . HTTP_MAIN . 'assets/files');
define('LOG_FILES',__DIRNAME__  . '/log/');
define('HTTP_LOG',(isSecure() ? 'https' : 'http') . '://' . HTTP_MAIN . 'log/');
define('SESSION_NAME', 'LJWEB_PLAYER');
