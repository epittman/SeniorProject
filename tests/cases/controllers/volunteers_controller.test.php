<?php
/* Volunteers Test cases generated on: 2010-04-23 23:04:55 : 1272066175*/
App::import('Controller', 'Volunteers');

class TestVolunteersController extends VolunteersController {
	var $autoRender = false;

	function redirect($url, $status = null, $exit = true) {
		$this->redirectUrl = $url;
	}
}

class VolunteersControllerTestCase extends CakeTestCase {
	var $fixtures = array('app.volunteer', 'app.location', 'app.office', 'app.employee', 'app.user', 'app.role', 'app.recruiter_meeting', 'app.school', 'app.signup', 'app.page', 'app.price', 'app.line_item', 'app.booking', 'app.donation', 'app.ecuador_profile', 'app.spanish_profile', 'app.menu', 'app.document');

	function startTest() {
		$this->Volunteers =& new TestVolunteersController();
		$this->Volunteers->constructClasses();
	}

	function endTest() {
		unset($this->Volunteers);
		ClassRegistry::flush();
	}

	function testIndex() {

	}

	function testView() {

	}

	function testAdd() {

	}

	function testEdit() {

	}

	function testDelete() {

	}

}
?>