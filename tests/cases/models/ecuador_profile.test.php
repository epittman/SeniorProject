<?php
/* EcuadorProfile Test cases generated on: 2010-04-23 23:04:44 : 1272066104*/
App::import('Model', 'EcuadorProfile');

class EcuadorProfileTestCase extends CakeTestCase {
	var $fixtures = array('app.ecuador_profile', 'app.volunteer', 'app.booking', 'app.donation', 'app.line_item', 'app.price', 'app.location', 'app.office', 'app.employee', 'app.recruiter_meeting', 'app.school', 'app.signup', 'app.role', 'app.page', 'app.menu', 'app.spanish_profile', 'app.document');

	function startTest() {
		$this->EcuadorProfile =& ClassRegistry::init('EcuadorProfile');
	}

	function endTest() {
		unset($this->EcuadorProfile);
		ClassRegistry::flush();
	}

}
?>