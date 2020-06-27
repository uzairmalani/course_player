<?php

// To timeout session in 40 min
function session_time_out()
{
	if (isset($_SESSION['LAST_ACTIVITY']) && ((time() - $_SESSION['LAST_ACTIVITY']) > 1800)) // 30 mins
	{   
		$redirect_url = '';
		// handle login redirect after session timeout
		if(isset($_SESSION['redirect_url']) && $_SESSION['redirect_url'] != ''){
			$redirect_url = $_SESSION['redirect_url'];
		}
		// last request was more than 30 minutes ago
		if(isset($_SESSION['user_id'])){
			session_unset();     // unset $_SESSION variable for the run-time  
			initSession(SESSION_NAME); // destroy session data in storage
			$_SESSION['redirect_url'] = $redirect_url;
		}
	}   
	$_SESSION['LAST_ACTIVITY'] = time(); // update last activity time stamp    
}

function initSession($name = '',$session_id = null) {
	//write and close current session
	if (session_id()) {
		$a = session_id();
		session_unset();

		if (!$session_id)
			session_regenerate_id(true);
	}

	if ($session_id) {
		session_id($session_id);
	}
	session_name($name);
	session_start();
}

//for debuging
function d($mParam, $bExit = 0, $bVarDump = 0, $echoInFile = 0, $htmlencode = 1) {
	ob_start();

	print get_back_trace("\n");
	if (!$bVarDump) {
		print_r($mParam);
	} else {
		var_dump($mParam);
	}
	if($htmlencode)
		$sStr = htmlspecialchars(ob_get_contents());
	else
		$sStr = ob_get_contents();
	ob_clean();
	if ($echoInFile) {
		if($echoInFile == 1)
			$echoInFile = date('Y-m-d');

		file_put_contents(LOG_FILES . '/' . $echoInFile . '.log', $sStr, FILE_APPEND);
	} else {
		echo '<hr><pre>' . $sStr . '</pre><hr>';
	}
	if ($bExit)
		exit;
}

function get_back_trace($NL = "\n") {
	$dbgTrace = debug_backtrace();
	$dbgMsg = "Trace[";
	foreach ($dbgTrace as $dbgIndex => $dbgInfo) {
		if ($dbgIndex > 0 && isset($dbgInfo['file'])) {
			$dbgMsg .= "\t at $dbgIndex  " . $dbgInfo['file'] . " (line {$dbgInfo['line']}) -> {$dbgInfo['function']}(" . (isset($dbgInfo['args']) ? count($dbgInfo['args']) : 0) . ")$NL";
		}
	}
	$dbgMsg .= "]" . $NL;
	return $dbgMsg;
}

function createPdf($html, $title, $pageFormat = PDF_PAGE_FORMAT, $type = 'I', $watermark = false, $print = false) {
	// create new PDF document
	$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, $pageFormat, true, 'UTF-8', false);

	// set document information
	$pdf->SetCreator(PDF_CREATOR);
	$pdf->SetAuthor(PDF_AUTHOR);
	$pdf->SetTitle($title);
	$pdf->SetSubject($title);
	$pdf->SetKeywords('Fund, Jamaat, Followup, Report');

	// set default header data
	// $pdf->SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE . ' ID#', PDF_HEADER_STRING);
	// set header and footer fonts
	//$pdf->setHeaderFont(Array(PDF_FONT_NAME_MAIN, '', PDF_FONT_SIZE_MAIN));
	//$pdf->setFooterFont(Array(PDF_FONT_NAME_DATA, '', PDF_FONT_SIZE_DATA));
	// set default monospaced font
	$pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

	// set margins
	$pdf->SetMargins(PDF_MARGIN_LEFT, 4, PDF_MARGIN_RIGHT);
	//$pdf->SetHeaderMargin(PDF_MARGIN_HEADER);
	//$pdf->SetFooterMargin(PDF_MARGIN_FOOTER);
	// set auto page breaks
	$pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);

	// set image scale factor
	$pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);

	// $fontname = $pdf->addTTFfont('alfatemiver5-webfont.ttf', '', '', 32);
	// Add background image
	// set font
	$pdf->SetFont('dejavusans', '', 10);

	// add a page
	$pdf->AddPage();

	// test some inline CSS
	//d($html,1);

	if ($watermark) {
		$img_file = __DIRNAME__ . 'assets/img/watermark.jpg';
		$pdf->Image($img_file, 0, 0, 210, 297, '', '', '', false, 300, '', false, false, 0);
		$pdf->setPageMark();
	}

	$pdf->writeHTML($html, true, true, true, false, '');

	//  reset pointer to the last page
	//$pdf->lastPage();
	//Close and output PDF document
	//$pdf->deletePage(1);
	// $pdf->deletePage(DELETE_PDF_PAGE);
	if($print) {
		// force print dialog
		$js = 'print(true);';
		// set javascript
		$pdf->IncludeJS($js);
	}
	$name = trim(str_replace(' ', '_', strtolower($title)));
	if ($type == 'S') {
		return $pdf->Output($name . '.pdf', $type);
	} else {
		$pdf->Output($name . '.pdf', $type);
	}
	//echo $html;
	exit();
}

function sendEmail($subj, $body, $emails, $cc = false, $bcc = false, $attachment = false, $filename = '', $bcc_addresses = array(), $content_type = false) {
	try {
		$mail = new PHPMailer();
		if (MAIL_SMTP) {
			$mail->IsSMTP();
			$mail->Host = SMTP_HOST;
			$mail->SMTPAuth = true;
			$mail->Username = SMTP_USER;
			$mail->Password = SMTP_PASS;
		}
		$mail->From = ADMIN_EMAIL;
		$mail->FromName = ADMIN_NAME;
		$mail->isHtml(true);
		foreach ($emails as $email) {
			$mail->AddAddress($email);
		}

		if ($cc) {
			$mail->AddCC($cc);
		}
		if ($bcc) {
			$mail->AddBCC($bcc);
		}

		foreach ($bcc_addresses as $address) {
			$mail->AddBCC($address);
		}

		if (empty($emails)) {
			$mail->AddAddress(ADMIN_EMAIL);
		} else {
			$mail->AddBCC(ADMIN_NAME);
		}


		if ($attachment) {
			if ($content_type) {
				$mail->AddStringAttachment($attachment, $filename, "base64", $content_type);
			} else {
				$mail->AddStringAttachment($attachment, $filename);
			}
		}


		$mail->Subject = $subj;
		$mail->Body = $body;
		
		if (!$mail->Send())
			throw new Exception($mail->ErrorInfo);

		return true;
	} catch(Exception $e) {
		return $e->getMessage();
	}
}

function getQueryString() {
	$aUrl = array();
	$app = \Slim\Slim::getInstance();
	if ($app->request()->get()) {
		foreach ($app->request()->get() as $sKey => $sValue) {
			$aUrl[] = $sKey . '=' . $sValue;
		}
	}
	if (empty($aUrl))
		return '';

	return '?' . join('&', $aUrl);
}

/**
 * Convert a string to camel case, optionally capitalizing the first char and optionally setting which characters are
 * acceptable.
 *
 * First, take existing camel case and add a space between each word so that it is in Title Form; note that
 *   consecutive capitals (acronyms) are considered a single word.
 * Second, capture all contigious words, capitalize the first letter and then convert the rest into lower case.
 * Third, strip out all the non-desirable characters (i.e, non numerics).
 *
 * EXAMPLES:
 * $str = 'Please_RSVP: b4 you-all arrive!';
 *
 * To convert a string to camel case:
 *  strtocamel($str); // gives: PleaseRsvpB4YouAllArrive
 *
 * To convert a string to an acronym:
 *  strtocamel($str, true, 'A-Z'); // gives: PRBYAA
 *
 * To convert a string to first-lower camel case without numerics but with underscores:
 *  strtocamel($str, false, 'A-Za-z_'); // gives: please_RsvpBYouAllArrive
 *
 * @param  string  $str              text to convert to camel case.
 * @param  bool    $capitalizeFirst  optional. whether to capitalize the first chare (e.g. "camelCase" vs. "CamelCase").
 * @param  string  $allowed          optional. regex of the chars to allow in the final string
 *
 * @return string camel cased result
 *
 * @author Sean P. O. MacCath-Moran   www.emanaton.com
 */
function strtocamel($str, $capitalizeFirst = true, $allowed = 'A-Za-z0-9') {
	return str_replace(
			array(
		'/([A-Z][a-z])/e', // all occurances of caps followed by lowers
		'/([a-zA-Z])([a-zA-Z]*)/e', // all occurances of words w/ first char captured separately
		'/[^' . $allowed . ']+/e', // all non allowed chars (non alpha numerics, by default)
		'/^([a-zA-Z])/e' // first alpha char
			), array(
		'" ".$1', // add spaces
		'strtoupper("$1").strtolower("$2")', // capitalize first, lower the rest
		'', // delete undesired chars
		'strto' . ($capitalizeFirst ? 'upper' : 'lower') . '("$1")' // force first char to upper or lower
			), $str
	);
}

function addRoutes($app, $authenticate) {
	$string = file_get_contents("routes.json");
	$aRoutes = json_decode($string, true);
	$sRoute = $app->request()->getResourceUri();
	if ($aRoutes) {
		foreach ($aRoutes as $aRoute) {
			if ($aRoute['route'] == $sRoute) {

				$mAuth = function() {
					
				};
				if ($aRoute['auth']) {
					$mAuth = $authenticate($app);
				}
				$mCallback = function() {
					
				};
				if ($aRoute['controller']) {
					$mCallback = "Controller" . $aRoute['controller'];
					if ($aRoute['method'] != "") {
						$mCallback .=":" . $aRoute['method'];
					} else {
						$mCallback .=":index";
					}
				}
				$app->{$aRoute['type']}($aRoute['route'], $mAuth, $mCallback);
			}
		}
	}
}

function showErrors($aErrors) {
	$sErrors = '<div class="errorSummary"><p>Please fix the following input errors:</p>
				<ul>';
	foreach ($aErrors as $sKey => $aError) {
		foreach ($aError as $error) {
			$sErrors .= '<li>' . $error . '</li>';
		}
	}
	$sErrors .= '</ul></div>';
	return $sErrors;
}

function uploadFile($file, $directory, $allowZip = false) {
	$json = array();
	try{
		if (!isset($file['name']) || empty($file['tmp_name'])) {
			throw new Exception('Invalid file');
		}
		$directory = rtrim(DIR_FILES . '/' . str_replace('../', '', $directory), '/');

		if (!is_dir($directory)) {
			mkdir($directory,0777,true);
		}
		$allowed = array(
			'image/jpeg',
			'image/pjpeg',
			'image/jpg',
			'image/png',
			'image/x-png',
			'image/gif',
			'image/bmp',
			'text/plain',
			'text/richtext',
			"text/csv",
			'application/msword',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
			'application/vnd.ms-excel',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			'application/vnd.ms-powerpoint',
			'application/vnd.openxmlformats-officedocument.presentationml.presentation',
			'application/pdf',
			'application/x-pdf',
			'application/octet-stream'
		);
		$zips = array('zip','rar');
		if ((strlen(utf8_decode($file['name'])) < 3) || (strlen(utf8_decode($file['name'])) > 255)) {
			throw new Exception('File name is invalid');
		}
		if ($file['size'] > 31457280) {
			throw new Exception('File size exceeds limit');
		}
		if (in_array($file['type'], $allowed) == FALSE) {
			throw new Exception('File type ' . $file['type'] . ' is not allowed');
		}
		if ($file['error'] != UPLOAD_ERR_OK) {
			throw new Exception($files['error']);
		}

		$dir = $directory . '/' . (isset($file['new_name']) ? $file['new_name'] : basename($file['name']));
		$path_parts = pathinfo($dir);
		$ext = $path_parts['extension'];
		if (@move_uploaded_file($file['tmp_name'], $dir)) {
			if($allowZip && in_array($ext, $zips) && !isRarOrZip($dir)) {
				throw new Exception("Uploaded file is not a valid zip or rar file. ");
			}
			$json['success'] = 'File uploaded successfully';
		} else {
			throw new Exception('An error occurred while uploading the file');
		}
	} catch(Exception $ex){
		$json['error'] = $ex->getMessage();
	}
	return $json;
}

function callService($method, $url, $data = false)
{
    $curl = curl_init();
    switch ($method)
    {
        case "POST":
            curl_setopt($curl, CURLOPT_POST, 1);
            if ($data)
                curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
            break;
        case "PUT":
            curl_setopt($curl, CURLOPT_PUT, 1);
            break;
        default:
            if ($data)
                $url = sprintf("%s/%s", $url, implode('/', $data));
    }
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    $result = json_decode(curl_exec($curl),true);
    curl_close($curl);
    return $result;
}

function isValidDate($date, $format = 'Y-m-d')
{
    $d = DateTime::createFromFormat($format, $date);
    return $d && $d->format($format) === $date;
}

?>