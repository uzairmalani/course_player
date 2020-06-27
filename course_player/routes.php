<?php
$app->notFound(function () use ($app) {
    $app->render('404.php');
});

$app->get('/','ControllerPlayer:view');