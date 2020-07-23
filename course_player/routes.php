<?php

include_once('beforemiddleware.php');

$app->notFound(function () use ($app) {
    $app->render('404.php');
});

$app->get('/','ControllerPlayer:view');
$app->post('/user_tracking/:token_id','ControllerUser:track' )
$app->get('/editor','ControllerPlayer:viewEditor');
$app->get('/get_course/:id','ControllerCourse:GetCourse');
$app->get('/get_topic/:id','ControllerCourse:Gettopic');
$app->get('/viewcourse','ControllerCourse:viewCourse');


$app->post('/addtopic','ControllerCoursetoc:createTopic');
$app->post('/addcourse','ControllerCoursetoc:createCourse');
$app->post('/addmodule','ControllerCoursetoc:createModule');
$app->post('/addlesson','ControllerCoursetoc:createLesson');
