<?php

/**
 * Validates input arrays (such as POST)
 *
 * @package validator
 */

/**
 * Validator class
 * 
 * Main class for validation, based on and influenced by the jQuery validation plugin available 
 * at http://bassistance.de/jquery-plugins/jquery-plugin-validation/.
 *
 * @package validator
 * @author G.J.C. van Ahee <van.ahee@yes2web.nl>
 */
class Validator {

    protected $oMethodCollection;
    protected $asClassRule = array();
    protected $asMessage = array(
        'required' => '{name} cannot be blank',
        'date' => '{name} must be valid date.',
        'digits' => '{name} must be valid number.',
        'email' => '{name} is not a valid email.',
        'equalTo' => '{name} and {name2} value not are not same.',
        'max' => '{name} must be less then {max}',
        'min' => '{name} must be greater then {min}',
        'maxlength' => '{name} must be less then {max} characters',
        'minlength' => '{name} must be greater then {min} characters',
        'url' => '{name} invalid url',
        'range' => '{name} must be between {range1} and {range2}',
        'accept' => '{name} has invalid files, only {types} accepted',
    );
    protected $asValue = array();
    protected $sErrorClass = 'error';
    protected $sErrorElement = 'label';
    protected $asErrorMessage = null;
    /**
     * Function to call when validation fails, e.g.
     * function invalid_callback(array $asPostData, Validator $oValidator){
     * 		header('Location: '.$_SERVER['HTTP_REFERER'].'?numError='.$oValidator->numberOfInvalids());
     * 		die('headered to form after validation fail.');
     * }
     * Part of the options provided to the constructor.
     * @param String Name of the callable function.
     */
    protected $sInvalidHandler = null;
    /**
     * @var array
     * Container to hold the scenario based field details
     *
     */
    protected $on = array();
    /*
     * @var Model object holds the associated model
     */
    protected $_object = null;

    public function setScenario($scenarios, $field) {
        $on = explode('|', $scenarios);
        foreach ($on as $scenario) {
            $this->on[$scenario][] = $field;
        }
    }

    /**
     * Returns a value indicating whether the validator applies to the specified scenario.
     * A validator applies to a scenario as long as any of the following conditions is met:
     * <ul>
     * <li>the validator's "on" property is empty</li>
     * <li>the validator's "on" property contains the specified scenario</li>
     * </ul>
     * @param string scenario name
     * @return boolean whether the validator applies to the specified scenario.
     *
     */
    public function setScenarioRules() {
        $rules = $this->splitCompoundScenario($this->_object->getRules(true));
        
        foreach ($rules as $scenario => $rule) {
            $this->on[$scenario] = array_keys($rule['rules']);
        }
    }

    public function splitCompoundScenario($rules) {
        foreach ($rules as $scenario => $rule) {
            if (stripos($scenario, '|')) {
                $mscenario = explode('|', $scenario);
                foreach ($mscenario as $aScen) {
                    $rules[$aScen] = $rule;
                }
                unset($rules[$scenario]);
            }
        }
        return $rules;
    }

    /*
     * The method will return the safe attributes depended on scenario
     * @param string $scenario name
     * @param array $attributes fields name
     */

    public function getSafeAttributes($scenario, $attributes) {
        if (empty($this->on) || !isset($this->on[$scenario]))
            return $attributes;
        else
            return array_merge($this->on[$scenario], $attributes);
    }

    /*
     * The method will determine wheter the attribute is safe or not
     * @param string $scenario name
     * @param string $attribute field name
     * @return boolean is the field is safe for given scenario
     */

    public function isSafeAttributes($scenario, $attribute) {
        if (empty($this->on) || isset($this->on['scenario']))
            return true;
        else if (in_array($this->on['scenario'], $attribute))
            return true;
        return false;
    }

    /**
     * Options (optional) to supply to the validator
     * Options are similar to the options provided to the jquery validator plugin. Currently
     * only "rules" en "messages" are supported. Specifying these into an array will easily
     * port to javascript, allowing easy integration of server and client sides. See below for
     * examples.
     *
     * Rules:
     * Key/value pairs defining custom rules. Key is the name of an element (or
     * a group of checkboxes/radio buttons) and should be available as the key in the array
     * to be validated, e.g. $_POST['name'] or $db_row['name'], value is an object consisting of
     * rule/parameter pairs or a plain String. Can be combined with class/attribute/metadata
     * rules. Each rule can be specified as having a depends-property to apply the rule only
     * in certain conditions. See the second example below for details.
     *
     * The jquery validator plugin allows keys to point to functions. This is not supporten in the
     * php, as a function is not valid JSON and therefore cannot easily be ported between javascript
     * and php.
     *
     * Providing rules (taken from an example in the jquery validator documentation) and encoding
     * them as a php array:
     * $asOption = array(
     * 				'rules' => array(
     * 					'name' => 'required',
     * 					'email' => array(
     * 						'required' => true,
     * 						'email' => true
     * 						)
     * 					)
     * 				);
     * will translate easily into jquery validator options using php's json_encode:
     * {
     * 	"rules": {
     * 		"name": "required",
     * 		"email": {
     * 	  		"required": true,
     * 	 		"email": true
     *  	}
     * 	}
     * }
     * Example usage:
     * 	$().ready(function() {
     * 		$("form").validate(<?php echo json_encode($asValidatorOption); ?>);
     * 	});
     *
     * Whereas the javascript can detect classnames and element-id, the php version
     * obvious cannot. To integrate client and server as described, make sure all keys
     * in the array refer to element-names, as these are the keys of the POST/GET array.
     */
    public function __construct($object, array $asOption = null) {
        $this->_object = $object;
        $this->setScenarioRules();
        if (false === is_null($asOption)) {
            if (isset($asOption['rules']) && is_array($asOption['rules'])) {
                foreach ($asOption['rules'] as $sField => $mRule) {
                    $this->addClassRules($mRule, $sField);
                }
            }
            if (isset($asOption['messages']) &&
                    is_array($asOption['messages'])) {
                $this->extendMessages($asOption['messages']);
            }
            if (isset($asOption['invalidHandler'])) {
                if (false === is_callable($asOption['invalidHandler'])) {
                    throw new Exception('Invalid option set for "invalidHandler: not callable"');
                }
                $this->sInvalidHandler = $asOption['invalidHandler'];
            }
            if (isset($asOption['errorClass'])) {
                $this->sErrorClass = $asOption['errorClass'];
            }
            if (isset($asOption['errorElement'])) {
                $this->sErrorElement = $asOption['errorElement'];
            }
        }

        $this->oMethodCollection = new ValidatorMethodCollection(new ArrayIterator);
    }

    /**
     * @param String $sName name of method
     * @param String $sFunctionHandle Unique name of (global) function, e.g. from create_function
     * @param String $sMessage Custom message delivered with failing field
     */
    public function addMethod($sName, $sFunctionHandle, $sMessage = null) {
        $this->oMethodCollection[$sName] = $sFunctionHandle;
        $this->asMessage[$sName] = $sMessage;
    }

    /**
     * @param String[][] $asRule [rule_name => [param_name => value]]
     * @param String $sField field name, ...
     */
    public function addClassRules($asRule, $sField) {
        if (false === is_array($asRule)) {
            $asRule = array($asRule => array());
        }
        $asArgv = func_get_args();
        for ($i = 1; $i < count($asArgv); ++$i) {
            if (false === isset($this->asClassRule[$asArgv[$i]])) {
                $this->asClassRule[$asArgv[$i]] = array();
            }
            # overwrite with newest values
            $this->asClassRule[$asArgv[$i]] = $asRule + $this->asClassRule[$asArgv[$i]];
        }
    }
    public function getRules($sField){
        return isset($this->asClassRule[$sField])?$this->asClassRule[$sField]:false;
    }

    /**
     * add messages to the internal messages list
     */
    public function extendMessages(array $asMessage) {
        $this->asMessage = $asMessage + $this->asMessage;
    }

    /**
     * helper method to distill messages from the array of messages
     * @return String the message
     */
    private function getMessage($sField, $sRule, $asRuleParam) {

        if (isset($this->asMessage[$sField]) && is_array($this->asMessage[$sField]) && isset($this->asMessage[$sField][$sRule])) {
            $sMessage = $this->asMessage[$sField][$sRule];
        } else if (isset($this->asMessage[$sField]) && isset($this->asMessage[$sField][$sRule])){
            $sMessage = $this->asMessage[$sField];
        }else {
            $sMessage = $this->asMessage[$sRule];
            $sName = $this->_object->generate_attribute_label($sField);
            $sMessage = str_replace('{name}', $sName, $sMessage);
            switch ($sRule) {
                case 'equalTo':
                    $sMessage = str_replace('{name2}', $asRuleParam, $sMessage);
                    break;
                case 'max':
                    $sMessage = str_replace('{max}', $asRuleParam, $sMessage);
                    break;
                case 'min':
                    $sMessage = str_replace('{min}', $asRuleParam, $sMessage);
                    break;
                case 'maxlength':
                    $sMessage = str_replace('{max}', $asRuleParam, $sMessage);
                    break;
                case 'minlength':
                    $sMessage = str_replace('{min}', $asRuleParam, $sMessage);
                    break;
                case 'range':
                    $sMessage = str_replace(array('{range1}', '{range2}'), $asRuleParam, $sMessage);
                    break;
                case 'accept':
                    $sMessage = str_replace('{types}', $asRuleParam, $sMessage);
                    break;
            }
        }
        
//        return preg_replace('~{(\d+)}~e', '$asRuleParam[$1]', $sMessage);
        return preg_replace_callback('~{(\d+)}~',function($m) use ($asRuleParam) {return $asRuleParam[$m[1]];},$sMessage);
    }

    /**
     * @return int the number of invalid fields
     */
    public function numberOfInvalids() {
        return count($this->asErrorMessage);
    }

    /**
     * Check whether the field is optional. Something is optional when there are either:
     * + no rules set for it [OR]
     * + there are rules, but none require the field
     *
     * When validating an element,
     *
     * @see Validator->element()
     * @param String $sField field name
     * @return bool Whether the provided field is optional
     */
    public function optional($sField) {
        return false === (
        isset($this->asClassRule[$sField]) &&
        isset($this->asClassRule[$sField]['required'])
        );
    }

    /**
     * Show an error for a specific field (if it is wrong)
     * Format is gerenated according to options provided to the cosntructor
     *
     * @param String $sField Field to get error message for
     * @return String Error message of requested field if value was invalid
     */
    public function showError($sField) {
        
        if (isset($this->asErrorMessage[$sField])) {
            return '<' .
            $this->sErrorElement .
            ($this->sErrorElement === 'label' ? ' ' : ' html') .
            'for="' . $sField . '" generated="true" class="' .
            $this->sErrorClass .
            '">' .
            $this->asErrorMessage[$sField] .
            '</' . $this->sErrorElement . '>';
        }
    }

    /**
     * Returns a value indicating whether there is any validation error.
     * @param string attribute name. Use null to check all attributes.
     * @return boolean whether there is any error.
     */
    public function hasErrors($field=null) {
        if ($field === null)
            return $this->$this->asErrorMessage !== array();
        else
            return isset($this->asErrorMessage[$field]);
    }

    /**
     * Returns the errors for all attribute or a single attribute.
     * @param string attribute name. Use null to retrieve errors for all attributes.
     * @return array errors for all attributes or the specified attribute. Empty array is returned if no error.
     */
    public function getErrors($field=null) {
        if ($field === null)
            return $this->asErrorMessage;
        else
            return isset($this->asErrorMessage[$field]) ? $this->asErrorMessage[$field] : array();
    }

    /**
     * Returns the first error of the specified attribute.
     * @param string attribute name.
     * @return string the error message. Null is returned if no error.
     * @since 1.0.2
     */
    public function getError($attribute) {
        return isset($this->asErrorMessage[$attribute]) ? reset($this->asErrorMessage[$attribute]) : null;
    }

    /**
     * return the supplied value (for validation) for the requested field. If no value was
     * provided or the value is invalid, an empty string is returned.
     *
     * @param String $sField Field to get provided value for
     * @return String Provided value if it is valid
     */
    public function showValid($sField) {
        return $this->valid($sField) &&
        isset($this->asValue[$sField]) ?
                $this->asValue[$sField] : '';
    }

    /**
     * Checks if the selected form is valid or if all selected elements are valid.
     * Throws Exception when no call to validate() has been made.
     *
     * @param String $sField Optional parameter allowing to check the validity of a single field
     * @return bool were the values valid
     * @throws Exception when no call to validate() has been made.
     */
    public function valid($sField = null) {
        return
        is_null($this->asErrorMessage) || # not validated
        count($this->asErrorMessage) === 0 || # no errors
        (              # there are errors: can now only return true when
        false === is_null($sField) && # - specific field is requested
        false === isset($this->asErrorMessage[$sField])  # -	and no error for this field
        );
    }

    /**
     * @param String[] $asValue [field =>value]
     */
    public function validate(array $asValue) {
        $this->asValue = $asValue;
        $this->asErrorMessage = array(); # reset error messages
        $safeAttributes = $this->getSafeAttributes($this->_object->getScenario(), array_keys($asValue));
        
        # loop through all fields in the provided list; not in the list -> not validated (unless required)
        foreach ($asValue as $sField => $sValue) {
            if (in_array($sField, $safeAttributes))
                $this->element($sField, $sValue);
        }

        # look for required fields that were not there
        foreach ($this->asClassRule as $sField => $asRules) {
            if (false === isset($asValue[$sField]) && # this field was not validatied, as it was not present in the list
                    isset($asRules['required'])) {    # But is was REQUIRED ! !
                $this->asErrorMessage[$sField] = $this->getMessage($sField, 'required', $asRules['required']);
            }
        }

        if (is_callable($this->sInvalidHandler)) {
            $sFunc = $this->sInvalidHandler;
            $sFunc($asValue, $this);
        }
        return $this->asErrorMessage;
    }

    /**
     * Validate a single element.
     * @param String $sField Name of the element
     * @param Mixed $mValue Value provided with the element
     * @return bool is the elemnent valid
     * @see Validator->validate()
     */
    public function element($sField, $mValue) {
        if (false === is_array($this->asErrorMessage)) {
            $this->asErrorMessage = array();
        }
        # if there is a rule
        if (isset($this->asClassRule[$sField])) {
            # apply all until one fails
            foreach ($this->asClassRule[$sField] as $sRule => $asRuleParam) {
                if (false === ( # iff empty AND optional: don't check
                        empty($mValue) && # easier checked than next line
                        $this->optional($sField)
                        ) &&
                        false === $this->oMethodCollection->{$sRule}($mValue, $asRuleParam)) {
                    $this->asErrorMessage[$sField] = $this->getMessage($sField, $sRule, $asRuleParam);
                    return false; # validation failed
                }
            }
        } # there are no validation rules for this element
        # true if valid
        return true;
    }

}

/**
 * Contains all validation methods/rules
 *
 * @package validator
 */
class ValidatorMethodCollection extends ArrayObject {
    const JQUERY_SELECTOR = '~^([a-z]*[.#])?([a-z0-9-_]+)(\[[a-z-]+="?([a-z0-9-_]+)"?\])?(:([a-z]+))?$~i';

    # regular expressions denoting various validation patters
    # @see ValidatorMethodCollection::email
    # @see ValidatorMethodCollection::url
    # @see ValidatorMethodCollection::regex
    const VALID_EMAIL = '/^(?!(?:(?:\x22?\x5C[\x00-\x7E]\x22?)|(?:\x22?[^\x5C\x22]\x22?)){255,})(?!(?:(?:\x22?\x5C[\x00-\x7E]\x22?)|(?:\x22?[^\x5C\x22]\x22?)){65,}@)(?:(?:[\x21\x23-\x27\x2A\x2B\x2D\x2F-\x39\x3D\x3F\x5E-\x7E]+)|(?:\x22(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21\x23-\x5B\x5D-\x7F]|(?:\x5C[\x00-\x7F]))*\x22))(?:\.(?:(?:[\x21\x23-\x27\x2A\x2B\x2D\x2F-\x39\x3D\x3F\x5E-\x7E]+)|(?:\x22(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21\x23-\x5B\x5D-\x7F]|(?:\x5C[\x00-\x7F]))*\x22)))*@(?:(?:(?!.*[^.]{64,})(?:(?:(?:xn--)?[a-z0-9]+(?:-[a-z0-9]+)*\.){1,126}){1,}(?:(?:[a-z][a-z0-9]*)|(?:(?:xn--)[a-z0-9]+))(?:-[a-z0-9]+)*)|(?:\[(?:(?:IPv6:(?:(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){7})|(?:(?!(?:.*[a-f0-9][:\]]){7,})(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,5})?::(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,5})?)))|(?:(?:IPv6:(?:(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){5}:)|(?:(?!(?:.*[a-f0-9]:){5,})(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,3})?::(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,3}:)?)))?(?:(?:25[0-5])|(?:2[0-4][0-9])|(?:1[0-9]{2})|(?:[1-9]?[0-9]))(?:\.(?:(?:25[0-5])|(?:2[0-4][0-9])|(?:1[0-9]{2})|(?:[1-9]?[0-9]))){3}))\]))$/iD';
    # taken from http://immike.net/blog/2007/04/06/5-regular-expressions-every-web-programmer-should-know/
    const VALID_URL = '{
  \\b
  # Match the leading part (proto://hostname, or just hostname)
  (
    # http://, or https:// leading part
    (https?)://[-\\w]+(\\.\\w[-\\w]*)+
  |
    # or, try to find a hostname with more specific sub-expression
    (?i: [a-z0-9] (?:[-a-z0-9]*[a-z0-9])? \\. )+ # sub domains
    # Now ending .com, etc. For these, require lowercase
    (?-i: com\\b
        | edu\\b
        | biz\\b
        | gov\\b
        | in(?:t|fo)\\b # .int or .info
        | mil\\b
        | net\\b
        | org\\b
        | [a-z][a-z]\\.[a-z][a-z]\\b # two-letter country code
    )
  )
  # Allow an optional port number
  ( : \\d+ )?
  # The rest of the URL is optional, and begins with /
  (
    /
    # The rest are heuristics for what seems to work well
    [^.!,?;"\'<>()\[\]\{\}\s\x7F-\\xFF]*
    (
      [.!,?]+ [^.!,?;"\'<>()\\[\\]\{\\}\s\\x7F-\\xFF]+
    )*
  )?
}ix';

    /**
     * Parse "some" selectors.
     *
     * Obviously, php validation can only work with names of user-input fields. However, from
     * many of the jQuery selectors provide means of finding these.
     * 	examples:
     * 	* use fieldname as id (#firstname)
     *  * use fieldname as classname (.firstname)
     *  * use element name and id (input#firstname)
     * 	* use element name and classname (input.firstname)
     *  * use fieldname as attribute (input[name=firstname])
     *  * use element and classname and name-attribute, though not sure why (input.test-class[name=firstname])
     *
     * Also, you can use any of the above with filters:
     * 	* #firstname:selected
     * 	* input[name=firstname]:checked
     *
     * What is (currently) NOT supported (at least)
     * 	* multiple attributes (input[type=radio][name=lastname])
     *
     * Returns an object (stdClass) containing the fieldname and filter, which is be empty when
     * no filter is present. ($oReturn->sFieldname, $oReturn->sFilter [null]).
     *
     * @param String $sSelector jQuery selector
     * @return stdClass fieldname and filter if present
     */
    private function parseJQuery($sSelector) {
        $asMatch = array();
        preg_match_all(self::JQUERY_SELECTOR, $sSelector, $asMatch);

        $oReturn = new stdClass;
        # match[2] is the "else" here as it could also be a classname
        $oReturn->sFieldname = (false === empty($asMatch[4][0])) ? $asMatch[4][0] : $asMatch[2][0];
        $oReturn->sFilter = $asMatch[6][0];

        return $oReturn;
    }

    /**
     * Called, from Validator::validate. $sName is the name of the rule, specified by
     * the first paramater in Validat::addMethod ($sName). The second parameter is the
     * list of arguments provided to the method: the first is the value of the field to
     * be validated, the second is an [optional] configuration parameters specified when
     * adding rules to a class of fields (actually: a list of fields)
     *
     * @param String $sName name of the rule to be called
     * @param String[] $asParam array containing the value of the field of to be validated and an array of options
     */
    public function __call($sName, array $asParam) {
        if (isset($this[$sName])) {
            return $this[$sName](array_shift($asParam), array_shift($asParam)); # sValue, asRuleParam
        }
        # no validation set...
        else {
            return true;
        }
    }

    /**
     * Makes the element require a date.
     * Return true, if the value is a valid date.
     * Checks for ##-##-####, with an optional separator (here '-').
     * No sanity checks, only the format must be valid, not the actual date, eg 39/39/2008
     * is a valid date. Month/day values may range from 00 to 39 due to the order of these
     * fields used by different locales.
     */

    /**
     * @assert ('22/40/2010') == FALSE
     * @assert ('02-1-2008') == FALSE
     * @assert ('01/12/2010') == TRUE
     * @assert ('12/01/2010') == TRUE
     */
    public function date($sValue, $sSeparator = '/') {
        return preg_match('~^[0-3][0-9]' . $sSeparator . '[0-3][0-9]' . $sSeparator . '[0-9]{4}$~', $sValue) === 1;
    }

    /**
     * @assert ('123123123') == TRUE
     * @assert ('asdasdfasdf') == FALSE
     */
    public function digits($sValue) {
        return preg_match('~^[0-9]+$~', $sValue) === 1;
    }
    /**
     * @assert ('123123123') == TRUE
     * @assert ('asdasdfasdf') == FALSE
     */
    public function numbers($sValue) {
        return preg_match('/^[\-+]?[0-9]*\.*\,?[0-9]+$/', $sValue) === 1;
    }

    /**
     * Test
     * @assert ('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@letters-in-local.org') == TRUE
     * @assert ('01234567890@numbers-in-local.net') == TRUE
     * @assert ("&'*+-./=?^_{}~@other-valid-characters-in-local.net") == TRU
     * @assert ('mixed-1234-in-{+^}-local@sld.net') == TRUE
     * @assert ('a@single-character-in-local.org') == TRUE
     * @assert ('"quoted"@sld.com') == TRUE
     * @assert ('"\e\s\c\a\p\e\d"@sld.com') == TRUE
     * @assert ('"quoted-at-sign@sld.org"@sld.com') == TRUE
     * @assert ('"escaped\"quote"@sld.com') == TRUE
     * @assert ('"back\slash"@sld.com') == TRUE
     * @assert ('single-character-in-sld@x.org') == TRUE
     * @assert ('local@dash-in-sld.com') == TRUE
     * @assert ('letters-in-sld@123.com') == TRUE
     * @assert ('uncommon-tld@sld.museum') == TRUE
     * @assert ('uncommon-tld@sld.travel') == TRUE
     * @assert ('uncommon-tld@sld.mobi') == TRUE
     * @assert ('country-code-tld@sld.uk') == TRUE
     * @assert ('country-code-tld@sld.rw') == TRUE
     * @assert ('local@sld.newTLD') == TRUE
     * @assert ('numbers-in-tld@sld.xn--3e0b707e') == TRUE
     * @assert ('local@sub.domains.com') == TRUE
     * @assert ('bracketed-IP-instead-of-domain@[127.0.0.1]') == TRUE
     */
    public function email($sValue, $mOption) {
        return $this->regex($sValue, self::VALID_EMAIL);
    }

    public function equalTo($sValue, $sEqualTo) {
        $sEqualTo = $this->parseJQuery($sEqualTo)->sFieldname;
        return strcmp($sValue, $_POST[$sEqualTo]) === 0;
    }

    /**
     * "Makes the element require a given maximum."
     */
    public function max($sValue, $iMax) {
        return is_numeric($sValue) && $sValue >= $iMax;
    }

    /**
     * @assert ('123123123',5) == FALSE
     * @assert ('asdasdfasdf',5) == FALSE
     * @assert ('as3',3) == TRUE
     */
    public function maxlength($sValue, $iLength) {
        return isset($sValue{$iLength}) === false;
    }

    /**
     * @assert ('123123123',5) == TRUE
     * @assert ('asdasdfasdf',5) == TRUE
     * @assert ('as3',5) == FALSE
     */
    public function minlength($sValue, $iLength) {
        return isset($sValue{--$iLength}); # pre-decrement: zero-indexed char-array
    }

    /**
     * "Makes the element require a given minimum."
     */
    public function min($sValue, $iMin) {
        return is_numeric($sValue) && $sValue <= $iMin;
    }

    /**
     * Makes the element require a given value range.
     * @return bool
     */

    /**
     * @assert ('123123123',array(2,6)) == TRUE
     * @assert ('asdasdfasdf',array(5,10)) == TRUE
     * @assert ('as3',array(3,6)) == FALSE
     */
    public function range($sValue, array $asRange) {
        return $this->rangelength(intval($sValue), $asRange);
    }

    /**
     * "Makes the element require a given value range [inclusive].
     * 	Return false, if the element is
     * 	some kind of text input and its length is too short or too long
     * 	a set of checkboxes has not enough or too many boxes checked
     * 	a select and has not enough or too many options selected"
     *
     * Works on checkboxes/multi-selects when they are provided as arrays, i.e.:
     * 	<input type="checkbox" name="asChecker[]" value="1" />
     * 	<input type="checkbox" name="asChecker[]" value="2" />
     */

    /**
     * @assert (array(1,2,3,4,5,6),array(2,6)) == TRUE
     * @assert ('asdasdfasdf',array(5,10)) == TRUE
     * @assert ('as34',array(3,6)) == TRUE
     */
    public function rangelength($sValue, array $asRange) {
        # checkbox, multi-select (iff provided as array)
        if (is_array($sValue)) { # list of checkboxes
            $iCount = count($sValue);
        }
        # number
        elseif (is_numeric($sValue)) {
            $iCount = $sValue;
        }
        # text value
        else {
            $iCount = strlen($sValue);
        }
        return $iCount >= $asRange[0] && $iCount <= $asRange[1];
    }

    /**
     * Validate a value by a supplied regex.
     * E.g. url and email use it to validate URLs and emails (respectively)
     *
     * usage:
     * options:
     * 	array(
     * 		'rules' => array(
     * 			'name_to_be_regexed' => array(
     * 				'regex' => '~regexp?~'
     * 			)
     * 		)
     * 	)
     * @param String $sValue Value to validate
     * @param String $sRegex Regex to validate against
     * @return bool valid?
     */
    public function regex($sValue, $sRegex) {
        return preg_match($sRegex, $sValue) == 1;
    }

    /**
     * Required:
     * [quotes taken from jquery validator docs: Validation > Methods > required]
     * 			"Return false if the element is empty (text input) or unchecked (radio/checkbxo) or nothing selected (select)."
     * 1) no additional argument:
     * 		is a value set?
     * 			"Makes the element always required."
     * 2) a String argument:
     * 		The requirement depends on another element. To specify the "depending" element, only id's are supported, i.e. selectors
     * 		of the form "#element-id" and the like (e.g. "element-id:checked" etc).
     * 		It is assumed that the element-id and the name-attribute are the same, making the element-id the key in the POST-array.
     * 			"Makes the element required, depending on the result of the given expression."
     * 3) a function argument:
     * 		The field is only required when the provided function returns false, no arguments will be presented.
     * 			"Makes the element required, depending on the result of the given callback."
     */
    public function required($sValue, $mParam = null) {
        if (false === is_null($mParam)) {
            # function provided: only required when function returns false (check beor is_string, as callable is also a String)
            if (is_callable($mParam)) { # custom required function
                # special if, otherwise the next case will be used (as $mParam is also a String)
                if ($mParam() === false) {  # iff true, it IS required ...
                    return true;   # ... so in this case: it's not
                }
            }
            # a selector pointing to a specific checkbox-element: only required when checked (i.e. in the POST-array)
            elseif (is_string($mParam)) {
                $oJQuery = $this->parseJQuery($mParam);
                # NOT required iff:
                if (false === isset($_POST[$oJQuery->sFieldname]) || # 	the field is not there (i.e. not checked)
                        false === empty($_POST[$oJQuery->sFieldname])) {  # 	the field is empty (i.e. select/input)
                    return true;          # not required means valid!
                }
            }
        } # no additional parameter: just be there
        $sTrimmedValue = trim($sValue);
        return false === empty($sTrimmedValue);
    }

    /**
     * @assert ('http://www.example.org') == TRUE
     * @assert ('http://www.example.org/')
     * @assert ('www.example.org/') == TRUE
     * @assert ('www.example.org') == TRUE
     * @assert ('example.org') == TRUE
     * @assert ('subdomain.example.org')
     * @assert ('https://example.org') == TRUE
     * @assert ('https://example.subdomain.org') == TRUE
     * @assert ('http://www.example.com/discus/messages/131/24297.html') == TRUE
     * @assert ('http://php.net/manual/en/function.preg-match.php') == TRUE
     * @assert ('http://www.lgts.com/catalog/product_info.php?products_id=6&osCsid=be3') == TRUE
     * @assert ('http://192.168.1.1') == TRUE
     * @assert ('http://192.168.1.1/') == TRUE
     * @assert ('http://64.233.167.99/') == TRUE
     * @assert ('http://siteexplorer.search.yahoo.com/search?p=www.x.com&bwmo=d&bwmf=u') == TRUE
     * @assert ('http://www.example.com/2009/01/08/rfc-example-url-validation') == TRUE
     * @assert ('http://mp3hungama.com/music/genre_albums.php?id=3') == TRUE
     * @assert ('www.enfocus.com/product.php?id=855') == TRUE
     * @assert ('http://www.example.com/space%20here.html')
     * @assert ('http://www.example.com/space here.html') == TRUE
     * @assert ('osdir.com/ml/unassigned-bugs/2010-04/msg00162.html') == TRUE
     * @assert ('forums.asp.net/p/1157859/1905808.aspx') == TRUE
     * @assert ('http://forums.asp.net/p/1157859/1905808.aspx') == TRUE
     * @assert ('https://forums.asp.net/p/1157859/1905808.aspx') == TRUE
     * @assert ('http://url.com/?source=rss_feed') == TRUE
     * @assert ('https://www.sound.com/catalog/account.php?osCsid=07b6922f54ed9674582') == TRUE
     * @assert ('https://www.thehayexperts.co.uk/index.php?osCsid=xlo8u8nl8m4t725') == TRUE
     * @assert ('ftp://example.com') == TRUE
     * @assert ('http://example.com/index.asp') == TRUE
     * @assert ('http://www.smallnetbuilder.com/component/option,com_chart/Itemid,189/') == TRUE
     * @assert ('http://example.org:80') == TRUE
     * @assert ('ftp://asmith@ftp.example.org') == TRUE
     * @assert ('HTTP://EN.EXAMPLE.ORG/') == TRUE
     * @assert ('HTTP://EXAMPLE.ORG/') == TRUE
     * @assert ('HTTP://WWW.EXAMPLE.ORG') == TRUE
     * @assert ('http://example.com/redirect?url=http%3A%2F%2Fplanio.com') == TRUE
     * @assert ('http://www.example.com:8080') == TRUE
     * @assert ('www.linux-rules-the-world.com') == TRUE
     * @assert ('http://www.google.com/company_secrets.htm') == TRUE
     * @assert ('http://askville.amazon.com/phones/AnswerViewer.do?requestId=7665185' == TRUE
     * @assert ('C:forums.asp.net/p/1157859/1905808.aspx') == FALSE
     * @assert ('dfds://example.com') == FALSE
     * @assert ('http://www.example.com.') == FALSE
     * @assert ('http://www.example.com/.') == FALSE
     * @assert ('http://.example.com') == FALSE
     * @assert ('http://example/') == FALSE
     * @assert ('http:///example.com') == FALSE
     * @assert ('http://www') == FALSE
     * @assert ('htp://www.google.com') == FALSE
     * @assert ('http//www.google.com') == FALSE
     * @assert ('http://example.com/index.php//') == FALSE
     * @assert ('http://example.com//') == FALSE
     * @assert ('/newfaq/basic/url.html') == FALSE
     * @assert ('http://www.example.commain.html') == FALSE
     * @assert ('example.123') == FALSE
     * @assert ('http://username:password@hostname/path?arg=value#anchor') == FALSE
     * @assert ('.example.') == FALSE
     * @assert ('example') == FALSE
     * @assert ('http://-example.com') == FALSE
     * @assert ('http://example-.com') == FALSE
     * @assert ('//example.com.') == FALSE
     * @assert ('http://www_google_com') == FALSE
     * @assert ('http://www-google-com') == FALSE
     * @assert ('http:forums.asp.net/p/1157859/1905808.aspx') == FALSE
     * @assert ('http://somedomain.com/ind%ex.html') == FALSE
     * @assert ('http://....../path/?query#fragment') == FALSE
     * @assert ('http://...../') == FALSE */
    public function url($sValue) {
        //$regex = "|^http(s)?://[a-z0-9-]+(.[a-z0-9-]+)*(:[0-9]+)?(/.*)?$|i";

        return $this->regex($sValue, self::VALID_URL);
    }
    /**
     * @assert ('aabc.jpg') == TRUE
     * @assert ('jqpeg.jpeg') == TRUE
     * @assert ('dd.doc','docx?|pdf|xls') == TRUE
     * @assert ('dd.docx','docx?|pdf|xls') == TRUE
     * @assert ('dd.pdf','docx?|pdf|xls') == TRUE
     * @assert ('dd.ppt','docx?|pdf|xls') == FALSE
     */

    public function accept($filename, $allowed='png|jpe?g|gif') {
        return $this->regex($filename, "/\.(".$allowed.")$/i");
    }

}

?>