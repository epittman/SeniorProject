<?php
/* SpanishProfiles Test cases generated on: 2010-05-03 00:05:11 : 1272846251*/
App::import('Controller', 'SpanishProfiles');

class TestSpanishProfilesController extends SpanishProfilesController {
	var $autoRender = false;

	function redirect($url, $status = null, $exit = true) {
		$this->redirectUrl = $url;
	}
}

class SpanishProfilesControllerTestCase extends CakeTestCase {
	var $fixtures = array('app.spanish_profile', 'app.volunteer', 'app.location', 'app.office', 'app.employee', 'app.user', 'app.role', 'app.recruiter_meeting', 'app.school', 'app.signup', 'app.page', 'app.price', 'app.line_item', 'app.booking', 'app.donation', 'app.ecuador_profile', 'app.menu', 'app.document');

	function startTest() {
		$this->SpanishProfiles =& new TestSpanishProfilesController();
		$this->SpanishProfiles->constructClasses();
	}

	function endTest() {
		unset($this->SpanishProfiles);
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

	function testAdminIndex() {

	}

	function testAdminView() {

	}

	function testAdminAdd() {

	}

	function testAdminEdit() {

	}

	function testAdminDelete() {

	}

}
?>