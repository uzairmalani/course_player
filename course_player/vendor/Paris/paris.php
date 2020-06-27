<?php

/**
 *
 * Paris
 *
 * http://github.com/j4mie/paris/
 *
 * A simple Active Record implementation built on top of Idiorm
 * ( http://github.com/j4mie/idiorm/ ).
 *
 * You should include Idiorm before you include this file:
 * require_once 'your/path/to/idiorm.php';
 *
 * BSD Licensed.
 *
 * Copyright (c) 2010, Jamie Matthews
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * * Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

/**
 * Subclass of Idiorm's ORM class that supports
 * returning instances of a specified class rather
 * than raw instances of the ORM class.
 *
 * You shouldn't need to interact with this class
 * directly. It is used internally by the Model base
 * class.
 */
class ORMWrapper extends ORM {

    /**
     * The wrapped find_one and find_many classes will
     * return an instance or instances of this class.
     */
    protected $_class_name;

    /**
     * Set the name of the class which the wrapped
     * methods should return instances of.
     */
    public function set_class_name($class_name) {
        $this->_class_name = $class_name;
    }

    /**
     * Add a custom filter to the method chain specified on the
     * model class. This allows custom queries to be added
     * to models. The filter should take an instance of the
     * ORM wrapper as its first argument and return an instance
     * of the ORM wrapper. Any arguments passed to this method
     * after the name of the filter will be passed to the called
     * filter function as arguments after the ORM class.
     */
    public function filter() {
        $args = func_get_args();
        $filter_function = array_shift($args);
        array_unshift($args, $this);
        if (method_exists($this->_class_name, $filter_function)) {
            return call_user_func_array(array($this->_class_name, $filter_function), $args);
        }
    }

    /**
     * Factory method, return an instance of this
     * class bound to the supplied table name.
     *
     * A repeat of content in parent::for_table, so that
     * created class is ORMWrapper, not ORM
     */
    public static function for_table($table_name, $connection_name = parent::DEFAULT_CONNECTION) {
        self::_setup_db($connection_name);
        return new self($table_name, array(), $connection_name);
    }

    /**
     * Method to create an instance of the model class
     * associated with this wrapper and populate
     * it with the supplied Idiorm instance.
     */
    protected function _create_model_instance($orm, $scenario = 'insert') {
        if ($orm === false) {
            return false;
        }
        //setup default scenario
        if (!empty($orm->_data)) {
            $scenario = 'update';
        }
        $model = new $this->_class_name($scenario);
        $model->set_orm($orm);
        $model->init();
        return $model;
    }

    /**
     * Wrap Idiorm's find_one method to return
     * an instance of the class associated with
     * this wrapper instead of the raw ORM class.
     */
    public function find_one($id = null) {
        return $this->_create_model_instance(parent::find_one($id));
    }

    /**
     * Wrap Idiorm's find_many method to return
     * an array of instances of the class associated
     * with this wrapper instead of the raw ORM class.
     */
    public function find_many() {
        $results = parent::find_many();
        foreach ($results as $key => $result) {
            $results[$key] = $this->_create_model_instance($result);
        }
        return $results;
    }

    /**
     * Wrap Idiorm's create method to return an
     * empty instance of the class associated with
     * this wrapper instead of the raw ORM class.
     */
    public function create($data = null) {
        return $this->_create_model_instance(parent::create($data));
    }

}

/**
 * Model base class. Your model objects should extend
 * this class. A minimal subclass would look like:
 *
 * class Widget extends Model {
 * }
 *
 */
class Model {

    // Default ID column for all models. Can be overridden by adding
    // a public static _id_column property to your model classes.
    const DEFAULT_ID_COLUMN = 'id';
    // Default foreign key suffix used by relationship methods
    const DEFAULT_FOREIGN_KEY_SUFFIX = '_id';

    /**
     * Set a prefix for model names. This can be a namespace or any other
     * abitrary prefix such as the PEAR naming convention.
     * @example Model::$auto_prefix_models = 'MyProject_MyModels_'; //PEAR
     * @example Model::$auto_prefix_models = '\MyProject\MyModels\'; //Namespaces
     * @var string
     */
    public static $auto_prefix_models = null;

    /**
     * The ORM instance used by this model 
     * instance to communicate with the database.
     */
    public $orm;
    // Start edited by MoizShabbir@20140829
    private $_errors = array(); // fields name => array of errors
    private $_scenario = '';   // scenario
    protected $_validator;
    //model attributes
    protected $_fields = array(); //overide by child class
    protected $_rules; //overide by child class

    public function __construct($scenario = 'insert') {
        $this->_scenario = $scenario;
    }

    /*
     * initialized the default fields or model properties.
     * This method will be call by factory method
     *
     */

    public function init() {
        $this->_validator = new Validator($this, $this->getRules());
    }

    // End edited by MoizShabbir@20140829

    /**
     * Retrieve the value of a static property on a class. If the
     * class or the property does not exist, returns the default
     * value supplied as the third argument (which defaults to null).
     */
    protected static function _get_static_property($class_name, $property, $default = null) {
        if (!class_exists($class_name) || !property_exists($class_name, $property)) {
            return $default;
        }
        $properties = get_class_vars($class_name);
        return $properties[$property];
    }

    /**
     * Static method to get a table name given a class name.
     * If the supplied class has a public static property
     * named $_table, the value of this property will be
     * returned. If not, the class name will be converted using
     * the _class_name_to_table_name method method.
     */
    protected static function _get_table_name($class_name) {
        $specified_table_name = self::_get_static_property($class_name, '_table');
        if (is_null($specified_table_name)) {
            return self::_class_name_to_table_name($class_name);
        }
        return $specified_table_name;
    }

    /**
     * Convert a namespace to the standard PEAR underscore format.
     * 
     * Then convert a class name in CapWords to a table name in 
     * lowercase_with_underscores.
     *
     * Finally strip doubled up underscores
     *
     * For example, CarTyre would be converted to car_tyre. And
     * Project\Models\CarTyre would be project_models_car_tyre.
     */
    protected static function _class_name_to_table_name($class_name) {
        return strtolower(preg_replace(
                        array('/\\\\/', '/(?<=[a-z])([A-Z])/', '/__/'), array('_', '_$1', '_'), ltrim($class_name, '\\')
        ));
    }

    /**
     * Return the ID column name to use for this class. If it is
     * not set on the class, returns null.
     */
    protected static function _get_id_column_name($class_name) {
        return self::_get_static_property($class_name, '_id_column', self::DEFAULT_ID_COLUMN);
    }

    /**
     * Build a foreign key based on a table name. If the first argument
     * (the specified foreign key column name) is null, returns the second
     * argument (the name of the table) with the default foreign key column
     * suffix appended.
     */
    protected static function _build_foreign_key_name($specified_foreign_key_name, $table_name) {
        if (!is_null($specified_foreign_key_name)) {
            return $specified_foreign_key_name;
        }
        return $table_name . self::DEFAULT_FOREIGN_KEY_SUFFIX;
    }

    /**
     * Factory method used to acquire instances of the given class.
     * The class name should be supplied as a string, and the class
     * should already have been loaded by PHP (or a suitable autoloader
     * should exist). This method actually returns a wrapped ORM object
     * which allows a database query to be built. The wrapped ORM object is
     * responsible for returning instances of the correct class when
     * its find_one or find_many methods are called.
     */
    public static function factory($class_name, $connection_name = null) {
        $class_name = self::$auto_prefix_models . $class_name;
        $table_name = self::_get_table_name($class_name);

        if ($connection_name == null) {
            $connection_name = self::_get_static_property(
                            $class_name, '_connection_name', ORMWrapper::DEFAULT_CONNECTION
            );
        }
        $wrapper = ORMWrapper::for_table($table_name, $connection_name);
        $wrapper->set_class_name($class_name);
        $wrapper->use_id_column(self::_get_id_column_name($class_name));
        return $wrapper;
    }

    /**
     * Internal method to construct the queries for both the has_one and
     * has_many methods. These two types of association are identical; the
     * only difference is whether find_one or find_many is used to complete
     * the method chain.
     */
    protected function _has_one_or_many($associated_class_name, $foreign_key_name = null) {
        $base_table_name = self::_get_table_name(get_class($this));
        $foreign_key_name = self::_build_foreign_key_name($foreign_key_name, $base_table_name);
        return self::factory($associated_class_name)->where($foreign_key_name, $this->id());
    }

    /**
     * Helper method to manage one-to-one relations where the foreign
     * key is on the associated table.
     */
    protected function has_one($associated_class_name, $foreign_key_name = null) {
        return $this->_has_one_or_many($associated_class_name, $foreign_key_name);
    }

    /**
     * Helper method to manage one-to-many relations where the foreign
     * key is on the associated table.
     */
    protected function has_many($associated_class_name, $foreign_key_name = null) {
        return $this->_has_one_or_many($associated_class_name, $foreign_key_name);
    }

    /**
     * Helper method to manage one-to-one and one-to-many relations where
     * the foreign key is on the base table.
     */
    protected function belongs_to($associated_class_name, $foreign_key_name = null) {
        $associated_table_name = self::_get_table_name($associated_class_name);
        $foreign_key_name = self::_build_foreign_key_name($foreign_key_name, $associated_table_name);
        $associated_object_id = $this->$foreign_key_name;
        return self::factory($associated_class_name)->where_id_is($associated_object_id);
    }

    /**
     * Helper method to manage many-to-many relationships via an intermediate model. See
     * README for a full explanation of the parameters.
     */
    protected function has_many_through($associated_class_name, $join_class_name = null, $key_to_base_table = null, $key_to_associated_table = null) {
        $base_class_name = get_class($this);

        // The class name of the join model, if not supplied, is
        // formed by concatenating the names of the base class
        // and the associated class, in alphabetical order.
        if (is_null($join_class_name)) {
            $class_names = array($base_class_name, $associated_class_name);
            sort($class_names, SORT_STRING);
            $join_class_name = join("", $class_names);
        }

        // Get table names for each class
        $base_table_name = self::_get_table_name($base_class_name);
        $associated_table_name = self::_get_table_name($associated_class_name);
        $join_table_name = self::_get_table_name($join_class_name);

        // Get ID column names
        $base_table_id_column = self::_get_id_column_name($base_class_name);
        $associated_table_id_column = self::_get_id_column_name($associated_class_name);

        // Get the column names for each side of the join table
        $key_to_base_table = self::_build_foreign_key_name($key_to_base_table, $base_table_name);
        $key_to_associated_table = self::_build_foreign_key_name($key_to_associated_table, $associated_table_name);

        return self::factory($associated_class_name)
                        ->select("{$associated_table_name}.*")
                        ->join($join_table_name, array("{$associated_table_name}.{$associated_table_id_column}", '=', "{$join_table_name}.{$key_to_associated_table}"))
                        ->where("{$join_table_name}.{$key_to_base_table}", $this->id());
    }

    /**
     * Set the wrapped ORM instance associated with this Model instance.
     */
    public function set_orm($orm) {
        $this->orm = $orm;
    }

    /**
     * Magic getter method, allows $model->property access to data.
     */
    public function __get($property) {
        $method_name = 'get' . strtocamel($property);
        if (method_exists($this, $method_name)) {
            return call_user_func(array($this, $method_name));
        }
        return $this->get($property);
    }

    /**
     * Magic setter method, allows $model->property = 'value' access to data.
     */
    public function __set($property, $value) {
        $method_name = 'set' . strtocamel($property);
        //set($property);
        if (method_exists($this, $method_name)) {
            call_user_func_array(array($this, $method_name), array($property, $value));
        }
        $this->set($property, $value);
    }

    /**
     * Magic isset method, allows isset($model->property) to work correctly.
     */
    public function __isset($property) {
        return $this->orm->__isset($property);
    }

    /**
     * Getter method, allows $model->get('property') access to data
     */
    public function get($property) {
        return $this->orm->get($property);
    }

    /**
     * Setter method, allows $model->set('property', 'value') access to data.
     * @param string|array $key
     * @param string|null $value
     */
    public function set($property, $value = null) {
        $this->orm->set($property, $value);
    }

    /**
     * Sets the attribute values in a massive way.
     * @param array attribute values (name=>value) to be set.
     * @param boolean whether the assignments should only be done to the safe attributes.
     * A safe attribute is one that is associated with a validation rule in the current {@link scenario}.
     * @see getSafeAttributeNames
     * @see attributeNames
     * By MoizShabbir@20140829
     */
    public function setFields($values, $safe_only = true) {
        if (!is_array($values))
            return;
        $attributes = array_flip($safe_only ? $this->getSafeAttributes() : $this->getFields());

        foreach ($values as $name => $value) {
            if (isset($attributes[$name])) {
                $this->$name = $value;
            } else if ($safe_only)
                $this->onUnsafeAttribute($name, $value);
        }
    }

    /**
     * Setter method, allows $model->set_expr('property', 'value') access to data.
     * @param string|array $key
     * @param string|null $value
     */
    public function set_expr($property, $value = null) {
        $this->orm->set_expr($property, $value);
    }

    /**
     * Check whether the given field has changed since the object was created or saved
     */
    public function is_dirty($property) {
        return $this->orm->is_dirty($property);
    }

    /**
     * Check whether the model was the result of a call to create() or not
     * @return bool
     */
    public function is_new() {
        return $this->orm->is_new();
    }

    /**
     * Wrapper for Idiorm's as_array method.
     */
    public function as_array() {
        $args = func_get_args();
        return call_user_func_array(array($this->orm, 'as_array'), $args);
    }

    /**
     * Save the data associated with this model instance to the database.
     */
    public function save() {
        $this->beforeSave();
        if ($this->validate()) {
            try {
                $ok = $this->orm->save();
            } catch (PDOException $ex) {
                $ok = false;
                throw new Exception($ex->getMessage(), $ex->getLine(), $ex);
            }
            $this->afterSave();
            return $ok;
        }
        return false;
    }

    /**
     * This method is invoked before save starts.
     * You may override this method to do preliminary work before save
     * @return boolean whether save should be executed. Defaults to true.
     * If false is returned, the save will stop and the model is considered invalid.
     */
    protected function beforeSave() {
        //return true;
    }

    /**
     * This method is invoked after save ends.
     * You may override this method to do postprocessing after save
     */
    protected function afterSave() {
        //return;
    }

    /**
     * Delete the database row associated with this model instance.
     */
    public function delete() {
        $this->beforeDelete();
        $result = $this->orm->delete();
        $this->afterDelete($result);
        return $result;
    }

    /**
     * Get the database ID of this model instance.
     */
    public function id() {
        return $this->orm->id();
    }

    /**
     * Hydrate this model instance with an associative array of data.
     * WARNING: The keys in the array MUST match with columns in the
     * corresponding database table. If any keys are supplied which
     * do not match up with columns, the database will throw an error.
     */
    public function hydrate($data) {
        $this->orm->hydrate($data)->force_all_dirty();
    }

    public function validate($attributes = null) {
        $this->clearErrors();
        $attributes = is_null($attributes) ? $this->orm->as_array() : $attributes;
        $errors = '';
        if ($attributes && $this->beforeValidate()) {
            $errors = $this->_validator->validate($attributes);
            $this->addErrors($errors);
            if (empty($errors) && $this->hasErrors()) {
                $errors = $this->getErrors();
            }
            $this->afterValidate();
        }
        return !$errors;
    }

    /**
     * Generates a user friendly attribute label.
     * This is done by replacing underscores or dashes with blanks and
     * changing the first letter of each word to upper case.
     * For example, 'department_name' or 'DepartmentName' becomes 'Department Name'.
     * @param string the column name
     * @return string the attribute label
     */
    public function generate_attribute_label($name) {
        return str_replace(' Id', '', ucwords(trim(strtolower(str_replace(array('-', '_', '.'), ' ', preg_replace('/(?<![A-Z])[A-Z]/', ' \0', $name))))));
    }

    public function getAttributeLabel($attribute = null) {
        $labels = '';

        if (!$attribute) {
            $labels = array();
            foreach ($this->getFields() as $field) {
                if (isset($this->_labels) && isset($this->_labels[$field])) {
                    $labels[] = $this->_labels[$field];
                } else {
                    $labels[] = $this->generate_attribute_label($field);
                }
            }
        } else {
            if (isset($this->_labels) && isset($this->_labels[$attribute])) {
                $labels = $this->_labels[$attribute];
            } else {
                $labels = $this->generate_attribute_label($attribute);
            }
        }
        return $labels;
    }

    public function isAttributeRequired($attribute) {
        if ($rules = $this->getRules()) {
            if (isset($rules['rules'][$attribute]) && is_array($rules['rules'][$attribute]) && array_key_exists('required', $rules['rules'][$attribute])) {
                return true;
            }
        }
        return false;
    }

    /**
     * This method is invoked before validation starts.
     * The default implementation calls {@link onBeforeValidate} to raise an event.
     * You may override this method to do preliminary checks before validation.
     * Make sure the parent implementation is invoked so that the event can be raised.
     * @return boolean whether validation should be executed. Defaults to true.
     * If false is returned, the validation will stop and the model is considered invalid.
     */
    protected function beforeValidate() {
        return true;
    }

    /**
     * This method is invoked after validation ends.
     * The default implementation calls {@link onAfterValidate} to raise an event.
     * You may override this method to do postprocessing after validation.
     * Make sure the parent implementation is invoked so that the event can be raised.
     */
    protected function afterValidate() {
        return;
    }

    /**
     * This method is invoked before delete starts.
     */
    protected function beforeDelete() {
        return;
    }

    /**
     * This method is invoked after delete ends.
     */
    protected function afterDelete() {
        return;
    }

    /**
     * Returns the errors for all attribute or a single attribute.
     * @param string attribute name. Use null to retrieve errors for all attributes.
     * @return array errors for all attributes or the specified attribute. Empty array is returned if no error.
     */
    public function getErrors($attribute = null) {
        if ($attribute === null)
            return $this->_errors;
        else
            return isset($this->_errors[$attribute]) ? $this->_errors[$attribute] : array();
    }

    /**
     * Returns the first error of the specified attribute.
     * @param string attribute name.
     * @return string the error message. Null is returned if no error.
     * @since 1.0.2
     */
    public function getError($attribute) {
        return isset($this->_errors[$attribute]) ? reset($this->_errors[$attribute]) : null;
    }

    /**
     * Adds a new error to the specified attribute.
     * @param string attribute name
     * @param string new error message
     */
    public function addError($attribute, $error) {
        $this->_errors[$attribute][] = $error;
    }

    /**
     * Adds a list of errors.
     * @param array a list of errors. The array keys must be attribute names.
     * The array values should be error messages. If an attribute has multiple errors,
     * these errors must be given in terms of an array.
     * You may use the result of {@link getErrors} as the value for this parameter.
     * @since 1.0.5
     */
    public function addErrors($errors) {
        foreach ($errors as $attribute => $error) {
            if (is_array($error)) {
                foreach ($error as $e)
                    $this->_errors[$attribute][] = $e;
            } else
                $this->_errors[$attribute][] = $error;
        }
    }

    /**
     * Removes errors for all attributes or a single attribute.
     * @param string attribute name. Use null to remove errors for all attribute.
     */
    public function clearErrors($attribute = null) {
        if ($attribute === null)
            $this->_errors = array();
        else
            unset($this->_errors[$attribute]);
    }

    /**
     * Returns a value indicating whether there is any validation error.
     * @param string attribute name. Use null to check all attributes.
     * @return boolean whether there is any error.
     */
    public function hasErrors($attribute = null) {
        if ($attribute === null)
            return $this->_errors !== array();
        else
            return isset($this->_errors[$attribute]);
    }

    /**
     * Unsets the attributes.
     * @param array list of attributes to be set null. If this parameter is not given,
     * all attributes as specified by {@link attributeNames} will have their values unset.
     * @since 1.1.3
     */
    public function unsetFields($names = null) {
        if ($names === null)
            $names = $this->getFields();
        foreach ($names as $name)
            $this->$name = null;
    }

    /**
     * Returns the scenario that this model is used in.
     *
     * Scenario affects how validation is performed and which attributes can
     * be massively assigned.
     *
     * A validation rule will be performed when calling {@link validate()}
     * if its 'on' option is not set or contains the current scenario value.
     *
     * And an attribute can be massively assigned if it is associated with
     * a validation rule for the current scenario. Note that an exception is
     * the {@link CUnsafeValidator unsafe} validator which marks the associated
     * attributes as unsafe and not allowed to be massively assigned.
     *
     * @return string the scenario that this model is in.
     * @since 1.0.4
     */
    public function getScenario() {
        return $this->_scenario;
    }

    /**
     * @param string the scenario that this model is in.
     * @see getScenario
     * @since 1.0.4
     */
    public function setScenario($value) {
        $this->_scenario = $value;
        $this->init();
    }

    /**
     * Returns the attribute names that are safe to be massively assigned.
     * A safe attribute is one that is associated with a validation rule in the current {@link scenario}.
     * @return array safe attribute names
     * @since 1.0.2
     */
    public function getSafeAttributes() {
        $attributes = array();
        $unsafe = array();
        $attributes = $this->_validator->getSafeAttributes($this->getScenario(), $this->getFields());
        if (is_array($attributes)) {
            return $attributes;
        }
    }

    /**
     * This method is invoked when an unsafe attribute is being massively assigned.
     * The default implementation will log a warning message if YII_DEBUG is on.
     * It does nothing otherwise.
     * @param string the unsafe attribute name
     * @param mixed the attribute value
     * @since 1.1.1
     */
    public function onUnsafeAttribute($name, $value) {
        // d("Failed to set unsafe attribute $name",0,0,1);
    }

    /**
     *
     * @return array table fields name
     */
    public function getFields() {
        $base_class_name = get_class($this);
        $table = self::_get_table_name($base_class_name);
        $oModels = ORM::for_table($table)->raw_query('SHOW FULL FIELDS FROM ' . $table)->find_many();
        //d($oModels);
        foreach ($oModels as $oModel) {
            $this->_fields[] = $oModel->Field;
        }
        return $this->_fields;
    }

    /**
     *
     * @return array model validations rules
     */
    public function getRules($is_raw = false) {
        if (!isset($this->_rules))
            return array();
        if ($is_raw)
            return $this->_rules;

        $defined_scenarios = array_keys($this->_rules);

        $scenario = $defined_scenarios[0];
        if (in_array($this->getScenario(), $defined_scenarios))
            $scenario = $this->getScenario();
        else {
            //for compound scenarios
            foreach ($defined_scenarios as $cscenario) {
                if (stripos($cscenario, '|')) {
                    $aScenario = explode('|', $cscenario);
                    if (in_array($this->getScenario(), $aScenario)) {
                        $scenario = $cscenario;
                        break;
                    }//endif;
                }//endif;
            }//endforeach;
        }//endif

        return $this->_rules[$scenario];
    }

    public function getValidator() {
        return $this->_validator;
    }

    public function getDefaultSort() {
        return 'id';
    }

    public function getDefaultOrder() {
        return 'DESC';
    }

    /** Format date as string for MySQL
     * @param int $timestamp datetime as timestamp (current time if omitted)
     * @return string fomratted datetime
     */
    function date($timestamp = 0) {
        $timestamp = $timestamp ? $timestamp : time();
        return date('Y-m-d H:i:s', $timestamp);
    }

    function setRuleMessage($message, $scenario, $field, $rule) {
        $aScenario = explode(',', $scenario);
        foreach ($aScenario as $scenario) {
            $this->_rules[$scenario]['messages'][$field][$rule] = $message;
        }
    }

    /** Return minimum value from a column
     * @param string
     * @return int
     */
    public function min($column) {
        return $this->orm->aggregation("MIN($column)");
    }

    /** Return maximum value from a column
     * @param string
     * @return int
     */
    public function max($column) {
        return $this->orm->aggregation("MAX($column)");
    }

    /** Return sum of values in a column
     * @param string
     * @return int
     */
    public function sum($column) {
        return $this->orm->aggregation("SUM($column)");
    }

    public function getNextSequentialId($tableName) {
        $db = Registry::getInstance()->db;
        $sql = "SELECT * FROM " . $tableName . "_seq";
        $query = $db->query($sql);
        if (empty($query->row)) {
            $sql = "INSERT INTO " . $tableName . "_seq SET seq_id=1";
            $db->query($sql);
            $seq_id = 1;
        } else {
            $seq_id = $query->row['seq_id'] + 1;
            $sql = "UPDATE " . $tableName . "_seq SET seq_id=" . $seq_id;
            $db->query($sql);
        }
        return $seq_id;
    }

}
