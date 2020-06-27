<?php

class BaseController {

    protected $app;
    protected $request;
    protected $model;

    public function __construct() {
        $this->app = \Slim\Slim::getInstance();
        $this->request = $this->app->request();
    }

    public function getQueryString() {
        $aUrl = array();
        if ($this->app->request()->get()) {
            foreach ($this->app->request()->get() as $sKey => $sValue) {
                $aUrl[] = $sKey . '=' . $sValue;
            }
        }
        if (empty($aUrl))
            return '';

        return '?' . join('&', $aUrl);
    }

}

?>