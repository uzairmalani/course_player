<?php

/**
 * Add Validation script
 */
$app->hook('add.validation.script', function($mModel) use ($app) {
	$aData = $app->view()->getData();
	$aData['aScript'][] = 'assets/js/jquery.validate.min.js';
	$aRules = array();
	if (is_array($mModel)) {
		$aModelRules = array();
		foreach ($mModel as $oModel) {
			$aRule = $oModel->getRules();
			$aModelRules = array_merge($aModelRules, $aRule['rules']);
		}
		$aRules['rules'] = $aModelRules;
		
	} else {
		$aRules = $mModel->getRules();
	}
	$aData['aInlineScript'][] = '$(document.forms[0]).validate(' . json_encode($aRules) . ');';
	$app->view()->appendData($aData);
});

/**
 * Slim internal before route run hook
 * Check session
 */
$app->hook('slim.before.router', function() use ($app) {
	if($app->request()->isAjax() === false){
		$req = $app->request();
		$request = $req->getResourceUri();
		$aIgnoreMain = array('/login','/logout','/forgot_password');
		
		$cronIgnores = array();
		try {
			if(!in_array($request,$aIgnoreMain) && !in_array($request,$cronIgnores) && strpos($request, "/app/") === false) {
				if (!isset($_SESSION['user_id']) || $_SESSION['user_id'] == '') {
					throw new Exception('Login Required', 1);
				}
				$result = false;
			}
		} catch (Exception $ex) {
			$app->flash('errors', $ex->getMessage());
			if ($ex->getCode() == 1) {
				if($request != "/" && $request != "/login" && $request != "")
					$_SESSION['redirect_url'] = $request.getQueryString();
				$app->redirect(HTTP_MAIN_SERVER . 'login');
			}
			 else {
				$app->redirect(HTTP_MAIN_SERVER);
			}
		}
	}
});
/**
 * Slim internal before route dispatch hook
 * Initiating variables
 */
$app->hook('slim.before.dispatch', function() use ($app) {
	$aData['aScript'] = array();
	$aData['aCSS'] = array();
	$aData['aInlineScript'] = array();
	$aData['aVarScript'] = array();
	$aData['header_title'] = '';

	$request_url = $app->request()->getResourceUri();
	if (preg_match('/\/[\d]+/', $request_url)) {
		$request_url = preg_replace('/\/[\d]+/', '', $request_url);
	}

	$app->request_url = $request_url;
	$app->view()->appendData($aData);
});

/**
 * Slim internal after route dispatch hook
 */
$app->hook('slim.before.view', function() use ($app) {
	$aData = $app->view()->getData();
	// $aData['aBreadcrumbs'] = $app->breadcrumb->getList();

	$aData['request_url'] = $app->request_url;
	$aData['aVarScript'][] = 'var request_url = "' . $app->request_url . '";';
	if ($app->request()->get('no-layout', '') != '' || $app->request()->isAjax()) {
		$aData['layout'] = false;
	}
	elseif(isset($_SESSION['user_id'])) {
		$aData['notifications'] = ORM::for_table('notifications')
									->select_many('message','created_at','is_read')
									->where('user_id',$_SESSION['user_id'])
									->order_by_asc('is_read')
									->order_by_desc('created_at')
									->limit(3)
									->find_array();
	}
	$app->view()->appendData($aData);
});


/**
 * Authentication callback
 */
$authenticate = function ($app, $bRedirect = true) {

	return function () use ($app, $bRedirect) {
		$req = $app->request();
		$request = $req->getResourceUri();
		try {
			if (!isset($_SESSION['user_id']) || $_SESSION['user_id'] == '') {
				throw new Exception('Login Required', 1);
			}

			$result = false;
		} catch (Exception $ex) {
			if (!$bRedirect) {
				$app->stop();
			} else {
				$app->flash('errors', $ex->getMessage());
				$app->flashNow('errors', $ex->getMessage());
				if ($ex->getCode() == 1) {
					if($request != "/" && $request != "/login" && $request != "")
						$_SESSION['redirect_url'] = $request.getQueryString();
					$app->redirect(HTTP_MAIN_SERVER . 'login');
				} else {
					$app->redirect(HTTP_MAIN_SERVER . 'permission');
				}
			}
		}
	};
};

/**
 * App Authentication callback
 */
$app_authenticate = function ($app) {
	return function () use ($app) {
		$req = $app->request();
		try {
			$token = $req->params('token','');
			$oOrm = ORM::for_table('app_sessions')->where('token',$token)->find_one();
			if(!$oOrm)
				throw new Exception('');
		} catch (Exception $ex) {
			echo json_encode(array('error' => 'Invalid access token, please login again'));
			exit();
		}
	};
};



?>