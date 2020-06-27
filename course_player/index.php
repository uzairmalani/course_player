<?php
require_once 'config.php';
require_once 'constants.php';
initSession(SESSION_NAME);

$app->config(array('templates.path' => 'app/templates'));

function my_autoloader($className) {
    $arr = preg_split('/(?=[A-Z])/', $className);
    $arr = array_slice($arr, 1);
    $path = false;
    if (isset($arr[1]) && $arr[1] == "Vendor") {
        $path = __DIRNAME__ . "/vendor/" . strtolower($arr[2]) . ".php";
    } elseif (stristr($className, 'Controller')) {
        $path = __DIRNAME__ . "/app/controllers/" . $className . ".php";
    } else {
        $path = __DIRNAME__ . "/models/" . $className . ".php";
    }

    if (file_exists($path)) {
        require_once $path;
    }
}
spl_autoload_register("my_autoloader");

require_once 'routes.php';
$app->run();