<?php
header('Access-Control-Allow-Origin: *');
ini_set("auto_detect_line_endings", true);
ini_set('upload_max_filesize', '100M');
ini_set('post_max_size', '100M');
ini_set('max_input_time', 9000);
ini_set('max_execution_time', 9000);
ini_set('memory_limit','2G');
set_time_limit(0);
date_default_timezone_set('America/Chicago');

require_once 'vendor/Slim/Slim.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\QSlim(array(
    'view' => '\Slim\LayoutView',
    'layout' => 'layout.php'
        ));

// $app->add(new \Slim\Middleware\CsrfGuard());

require_once 'lib/CommonHelper.php';
// require_once 'lib/Hooks.php';
