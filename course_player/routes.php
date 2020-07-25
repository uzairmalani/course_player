<?php


$app->notFound(function () use ($app) {
    $app->render('404.php');
});

$app->get('/','ControllerPlayer:view');
// $app->get('/user_tracking/:course_id/:topic_id/:current_time/:duration/:completed','ControllerUser:track' );

$app->get('/editor','ControllerPlayer:viewEditor');
$app->get('/get_course/:id','ControllerCourse:GetCourse');
$app->get('/get_topic/:id','ControllerCourse:Gettopic');
$app->get('/player/','ControllerPlayer:viewplayer');
$app->get('/viewcourse','ControllerCourse:viewCourse');
$app->get('/get_user_tracking/:course_id/:user_id','ControllerUser:get_track');


$app->post('/user_tracking','ControllerUser:track');
$app->post('/addtopic','ControllerCoursetoc:createTopic');
$app->post('/addcourse','ControllerCoursetoc:createCourse');
$app->post('/addmodule','ControllerCoursetoc:createModule');
$app->post('/addlesson','ControllerCoursetoc:createLesson');
