<?php
/** 
 * @author: Huzaifa Mustafa
 * @version: 1.0
 * 
 * CSRF Guard
 *
 * USAGE
 *
 * $app = new \Slim\Slim();
 * $app->add(new \Slim\Extras\Middleware\CsrfGuard());
 *
 */
namespace Slim\Middleware;
class CsrfGuard extends \Slim\Middleware
{
    /**
     * CSRF token key name.
     *
     * @var string
     */
    protected $key;
    /**
     * Constructor.
     *
     * @param string    $key        The CSRF token key name.
     * @return void
     */
    public function __construct($key = 'csrf_token')
    {
        if (! is_string($key) || empty($key) || preg_match('/[^a-zA-Z0-9\-\_]/', $key)) {
            throw new \OutOfBoundsException('Invalid CSRF token key "' . $key . '"');
        }
        $this->key = $key;
    }
    /**
     * Call middleware.
     *
     * @return void
     */
    public function call() 
    {
        // Attach as hook.
        $this->app->hook('slim.before.view', array($this, 'check'));
        // Call next middleware.
        $this->next->call();
    }
    /**
     * Check CSRF token is valid.
     * Note: Also checks POST data to see if a Moneris RVAR CSRF token exists.
     *
     * @return void
     */
    public function check() {
        // Check sessions are enabled.
        if (session_id() === '') {
            throw new \Exception('Sessions are required.');
        }
        if (!isset($_SESSION[$this->key])) {
            $_SESSION[$this->key] = sha1(serialize($_SERVER) . rand(0, PHP_INT_MAX));
        }
        $token = $_SESSION[$this->key];
        if (in_array($this->app->request()->getMethod(), array('POST', 'PUT','DELETE'))) {
            $userToken = $this->app->request()->params($this->key);
            if ($token !== $userToken) {
                // d(array($token, $userToken),1);
                $this->app->halt(400, 'Unauthorized Request.');
            }
        }
        // Assign CSRF token key and value to view.
        $this->app->view()->appendData(array(
            'csrf_key'      => $this->key,
            'csrf_token'    => $token,
        ));
    }
}