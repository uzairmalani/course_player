<?php
$app->notFound(function () use ($app) {
    $app->render('404.php');
});

$app->get('/','ControllerPlayer:view');
$app->get('/get_course/:id','ControllerCourse:GetCourse');