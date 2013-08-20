(function($) {

	// Set up settings for Pikabu object specified in tests/index.html
	var settings = {
		viewportSelector: '.test-viewport',
		selectors: {
			element: '.test-container',
			left: '.test-sidebar-left',
			right: '.test-sidebar-right',
			navToggles: '.nav-toggle'
		}

	};
	var pikabuTest = new Pikabu(settings);

	// Object creation tests
	test("Pikabu initialization tests", function() {
		
		// Object created successfully
		equal(true, pikabuTest instanceof Pikabu,  "Pikabu not initialized");

	});

})(jQuery);