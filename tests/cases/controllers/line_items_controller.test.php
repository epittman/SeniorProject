<?php
/* LineItems Test cases generated on: 2010-05-03 00:05:48 : 1272846168*/
App::import('Controller', 'LineItems');

class TestLineItemsController extends LineItemsController {
	var $autoRender = false;

	function redirect($url, $status = null, $exit = true) {
		$this->redirectUrl = $url;
	}
}

class LineItemsControllerTestCase extends CakeTestCase {
	var $fixtures = array('app.line_item', 'app.booking', 'app.volunteer', 'app.location', 'app.office', 'app.employee', 'app.user', 'app.role', 'app.recruiter_meeting', 'app.school', 'app.signup', 'app.page', 'app.price', 'app.menu', 'app.document', 'app.donation', 'app.ecuador_profile', 'app.spanish_profile');

	function startTest() {
		$this->LineItems =& new TestLineItemsController();
		$this->LineItems->constructClasses();
	}

	function endTest() {
		unset($this->LineItems);
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