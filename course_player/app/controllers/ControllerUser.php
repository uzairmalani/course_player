<?php
include_once('connection.php');

class ControllerUser extends BaseController {
		function track(){
			$res = array();
			try {
				$track = ORM::for_table('course_tracking')
						->where('user_id' , 1)
						->where('course_id', $_POST['courseid'])
						->where('topic_id' ,$_POST['topicid'])
						->find_one();
				if(!$track){
					$track=ORM::for_table('course_tracking')->create();
					$track->set("created_on" ,date("Y-m-d H:i:s"));
				}else if($track->is_completed==1){
					throw new Exception("Topic is Completed", 1);	
				}
				$track->set(array(
					"user_id" => 1,
					"course_id" => $_POST['courseid'],
					"topic_id" => $_POST['topicid'],
					"current_time"  => $_POST['currenttime'],
					"updated_on" => date("Y-m-d H:i:s"),
					"total_duration"=> $_POST['durations'],
					"is_completed" => $_POST['is_completed']
				));
				$track->save();
				
				$res['success'] = "successfully updated";
			} catch(Exception $ex) {
				$res['error'] = $ex->getMessage();
			}

		echo json_encode($res);
		}


		function get_track($course_id,$user_id){
			$res = array();
			try {
				$track = ORM::for_table('course_tracking')
							->where('user_id' , $user_id)
							->where('course_id', $course_id)
							->where('is_completed' , 0)
							->find_one();

				$res['course_id']=$track->course_id;
				$res['topic_id']=$track->topic_id;
				$res['current_time']=$track->current_time;
			} catch(Exception $ex) {
				$res['error'] = $ex->getMessage();
			}
			echo json_encode($res);
		}

}