<?php

class ControllerPlayer extends BaseController {
	
    public function view() {
        $data = array();
        $this->app->render('editor.php',$data);
    }

     public function viewplayer() {
        $data = array();
        $this->app->render('player.php',$data);
    }
    
}
    