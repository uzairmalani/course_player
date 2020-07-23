<?php
include_once('connection.php');
class ControllerCourse extends BaseController {

	function Gettopic(){
		$topics=ORM::for_table('course_toc')
		->table_alias('ct')
		->select_many(array('course_name'=>'c.name', 'module_name'=>'m.name' ,'lesson_name'=> 'l.name','topic_name'=>'t.name'))
		->join('course' ,'c.id = ct.course_id', 'c')
		->left_outer_join('module' , 'm.id = ct.module_id' , 'm')
		->left_outer_join('lesson' , 'l.id = ct.lesson_id' , 'l')
		->left_outer_join('topic' , 't.id = ct.topic_id' , 't')
		->where()
		->find_array();
		 print_r($topics);                
	}
	
    public function GetCourse($course_id) {
    	$course = array(
    		"name" => "40 Hour HAZWOPER OSHA Online Training",
    		"modules" => array(
    			array(
    			"name"=>"Module 1: REGULATORY OVERVIEW",
    			"xml" => "/assets/js/module0.xml",
    			"topic" =>array(
	    		"Module 1",
	    		"Module Overview",
	    		"Learning Objectives",
	    		),
    			"lessons" => array(
	    			array(
	    				"name" => "Lesson 1: OSHA AND THE HAZWOPER STANDARD",
	    				"url"  => "/assets/js/lesson1.xml",
	    				"topic" =>array(
	    					"Lesson 1:",
	    					"The Occupational Safety and Health (OSH) Act",
	    					"Hazardous Waste Operations and Emergency Response (HAZWOPER)",
	    					"The HAZWOPER Regulation",
	    					"The HAZWOPER Regulation",
	    					"Scope of the HAZWOPER Standard",
	    					"Appendices to the HAZWOPER Regulation",
	    					"Application of the HAZWOPER Standard",
	    					"HAZWOPER Training",
	    					"HAZWOPER Training",
	    					"The HAZWOPER Standard and Other Regulations",
	    					"Rights and Responsibilities: Employer Responsibilities",
	    					"Rights and Responsibilities: Employer Rights",
	    					"Rights and Responsibilities: Employer Responsibilities",
	    					"Establishment of NIOSH",
	    					"Hazardous Waste Legislation",
	    					"Application of the HAZWOPER Standard to Chemical Spills",
	    					"Application of the HAZWOPER Standard to Chemical Spills",
	    					"Summary",
	    					"LESSON QUIZ"
	    				),
	    			),
	    			array(
	    				"name" => "Lesson 2: HAZARD COMMUNICATION",
	    				"url"  => "/assets/js/lesson2.xml",
	    				"topic" =>array(
	    					"Lesson 2:",
	    					"Hazard Communication",
	    					"Hazard Communication Standard (HCS)",
	    					"Substances not covered by HCS",
	    					"Globally Harmonized System (GHS)",
	    					"Which substances are covered by the GHS?",
	    					"Changes to HCS under GHS",
	    					"Hazardous Material Labeling",
	    					"Labeling Requirements",
	    					"Pictograms",
	    					"Pictograms",
	    					"Pictograms Categories",
	    					"Safety Data Sheets (SDSs)",
	    					"Safety Data Sheets (SDSs) Sections",
	    					"Safety Data Sheets (SDSs) Sections",
	    					"Scope of the HAZWOPER Standard",
	    					"SDSs and Employer Responsibilities",
	    					"Employee Training",
	    					"Summary",
	    					"LESSON QUIZ"
	    				),
	    			)
    			)
    		),
    		array(
    			"name"=>"Module 2: PLANNING AND ORGANIZATION",
    			"xml" => "/assets/js/module1.xml",
    			"topic" =>array(
	    		"PLANNING AND ORGANIZATION",
	    		"Module Overview",
	    		"Learning Objectives",
	    		),
    			"lessons" => array(
	    			array(
	    				"name" => "Lesson 3: NFPA SYSTEM AND DOT LABELS",
	    				"url"  => "",
	    				"topic" =>array(
	    					"NFPA SYSTEM AND DOT LABELS",
	    					"NFPA 704 Standard",
	    					"NFPA 704 Standard",
	    					"BLUE-Health Hazard",
	    					"RED-Flammability",
	    					"YELLOW-Instability or Reactivity",
	    					"WHITE-Special Hazard Symbol",
	    					"DOT Labels",
	    					"HAZWOPER Training",
	    					"HAZWOPER Training",
	    					"The HAZWOPER Standard and Other Regulations",
	    					"Rights and Responsibilities: Employer Responsibilities",
	    					"Rights and Responsibilities: Employer Rights",
	    					"Rights and Responsibilities: Employer Responsibilities",
	    					"Establishment of NIOSH",
	    					"Hazardous Waste Legislation",
	    					"Application of the HAZWOPER Standard to Chemical Spills",
	    					"Application of the HAZWOPER Standard to Chemical Spills",
	    					"Summary",
	    					"LESSON QUIZ"
	    				),
	    			),
    			)
    		)
    		)
    	);


    	echo json_encode($course);
    }
}
    