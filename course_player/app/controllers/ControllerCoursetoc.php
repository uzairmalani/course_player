<?php
include_once('connection.php');
class ControllerCoursetoc extends BaseController {

	function createCourse(){
		$res = array();
		try {
			ORM::get_db()->beginTransaction();	
			$params = json_decode(file_get_contents('php://input'), true);
		 	$course_category=ORM::for_table('course_category')
				->where("name" , $params['course_category'])
			 	->find_one();
			 if (isset($params['course_id'])){
				$course = ORM::for_table('course')
			 			->where('id' , $params['course_id'])
			 			->find_one();
			 	$res['success'] = 'course updated successfully';
			 }else{
			 	$course = ORM::for_table('course')->create();
			 	$course->set("publish_date" , date("Y-m-d H:i:s"));		
				$res['success'] = 'course created successfully';
			}
			$course->set(array(
					"name" => $params['course_name'],
					"course_category" => $course_category->id,
					"modified_date" => date("Y-m-d H:i:s")
			));
			$course->save();
			$res['course_id'] = $course->id;
			ORM::get_db()->commit();
		} catch(Exception $ex) {
			ORM::get_db()->rollBack();
			$res['error'] = $ex->getMessage();
		}

		echo json_encode($res);
	}



	function createModule(){
		$res = array();
		try {
			ORM::get_db()->beginTransaction();	
			$params = json_decode(file_get_contents('php://input'), true);
			if (isset($params['module_id'])){
				$module = ORM::for_table('module')
						->where('id' , $params['module_id'])
						->find_one();
				$module->set(array(
					"name" => $params['module_name'],
					"url"  => $params['module_xml']
				));
				$module->save();
				$res['module_id'] = $module->id;
				$res['success'] = 'module updated successfully';
			}else{
				$module = ORM::for_table('module')->create();
				$module->set(array(
					"name" => $params['module_name'],
					"url"  => $params['module_xml']
				));
				$module->save();

				$courseToc = ORM::for_table('course_toc')->create();
				$courseToc->set(array(
					"course_id" => $params['course_id'],
					"level" => $params['level'],
					"position" => $params['position'],
					"type" => "m",
					"type_id" => $module->id,
					"module_id" =>$module->id,
					"lesson_id" => NULL,
					"topic_id" =>  NULL,
					"quize_id" => NULL,
				));
				$courseToc->save();

				$res['module_id'] = $module->id;
				$res['toc_id'] = $courseToc->id;
				$res['success'] = 'module created successfully';
			}
			ORM::get_db()->commit();
		} catch(Exception $ex) {
			ORM::get_db()->rollBack();
			$res['error'] = $ex->getMessage();
		}

		echo json_encode($res);
	}

	function createLesson(){
		$res = array();
		try {
			ORM::get_db()->beginTransaction();	
			$params = json_decode(file_get_contents('php://input'), true);
			if (isset($params['lesson_id'])){
				$lesson = ORM::for_table('lesson')
						->where('id' , $params['lesson_id'])
						->find_one();
				$lesson->set(array(
					"name" => $params['lesson_name'],
					"url"  => $params['lesson_xml']
				));
				$lesson->save();
				$res['lesson_id'] = $lesson->id;
				$res['success'] = 'lesson updated successfully';
			}else{
				$lesson = ORM::for_table('lesson')->create();
				$lesson->set(array(
					"name" => $params['lesson_name'],
					"url"  => $params['lesson_xml']
				));
				$lesson->save();

				$courseToc = ORM::for_table('course_toc')->create();
				$courseToc->set(array(
					"course_id" => $params['course_id'],
					"level" => $params['level'],
					"position" => $params['position'],
					"type" => "l",
					"type_id" => $lesson->id,
					"module_id" => $params['module_id'],
					"lesson_id" => $lesson->id,
					"topic_id" =>  NULL,
					"quize_id" => NULL,
				));
				$courseToc->save();

				$res['lesson_id'] = $lesson->id;
				$res['toc_id'] = $courseToc->id;
				$res['success'] = 'lesson created successfully';
			}
			ORM::get_db()->commit();
		} catch(Exception $ex) {
			ORM::get_db()->rollBack();
			$res['error'] = $ex->getMessage();
		}

		echo json_encode($res);

	}

	function createTopic(){
		$res = array();
		try {
			ORM::get_db()->beginTransaction();	
			$params = json_decode(file_get_contents('php://input'), true);
			if (isset($params['topic_id'])){
				$topic = ORM::for_table('topic')
						->where('id' , $params['topic_id'])
						->find_one();
				$topic->set("name" , $params['topic_name']);
				$topic->save();
				$res['topic_id'] = $topic->id;
				$res['success'] = 'topic updated successfully';
			}else{
				$topic = ORM::for_table('topic')->create();
				$topic->set("name" , $params['topic_name']);
				$topic->save();

				$courseToc = ORM::for_table('course_toc')->create();
				$courseToc->set(array(
					"course_id" => $params['course_id'],
					"level" => $params['level'],
					"position" => $params['position'],
					"type" => "t",
					"type_id" => $topic->id,
					"module_id" => $params['module_id'],
					"lesson_id" => $params['lesson_id'],
					"topic_id" =>  $topic->id,
					"quize_id" => NULL,
				));
				$courseToc->save();

				$res['topic_id'] = $topic->id;
				$res['toc_id'] = $courseToc->id;
				$res['success'] = 'topic created successfully';
			}
			ORM::get_db()->commit();
		} catch(Exception $ex) {
			ORM::get_db()->rollBack();
			$res['error'] = $ex->getMessage();
		}

		echo json_encode($res);
	}


	function createQuize(){
		$res = array();
		try {
			ORM::get_db()->beginTransaction();	
			$params = json_decode(file_get_contents('php://input'), true);
			if (isset($params['topic_id'])){
				$quize = ORM::for_table('quize')
						->where('id' , $params['quize_id'])
						->find_one();
				$quize->set("name" , $params['quize_name']);
				$quize->save();
				$res['quize_id'] = $quize->id;
				$res['success'] = 'quize updated successfully';
			}else{
				$quize = ORM::for_table('quize')->create();
				$quize->set("name" , $params['quize_name']);
				$quize->save();

				$courseToc = ORM::for_table('course_toc')->create();
				$courseToc->set(array(
					"course_id" => $params['course_id'],
					"level" => $params['level'],
					"position" => $params['position'],
					"type" => "q",
					"type_id" => $quize->id,
					"module_id" => $params['module_id'],
					"lesson_id" => (isset($params['lesson_id']) ? $params['lesson_id'] : NULL),
					"topic_id" =>  null,
					"quize_id" => $quize->id
				));
				$courseToc->save();

				$res['quize_id'] = $quize->id;
				$res['toc_id'] = $courseToc->id;
				$res['success'] = 'quize created successfully';
			}
			ORM::get_db()->commit();
		} catch(Exception $ex) {
			ORM::get_db()->rollBack();
			$res['error'] = $ex->getMessage();
		}

		echo json_encode($res);
	}
}