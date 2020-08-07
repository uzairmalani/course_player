<?php
include_once('connection.php');
class ControllerPlayer extends BaseController {
	
    public function view() {
        $data = array();
        $this->app->render('editor.php',$data);
    }

     public function viewplayer($course_id,$user_id) {
        $data = array();
        $res = array();
        $userID=substr(base64_decode($user_id),16);
        $user_session = ORM::for_table('user')
                ->select('full_name')
                ->where('wp_user_id' , $userID)
                ->find_one();  
        $data['course_id'] = $course_id;
        $data['user_id'] = $user_id;
        $data['user_name'] = $user_session->full_name;

    
        $this->app->render('player.php',$data);

    }

    
}
    