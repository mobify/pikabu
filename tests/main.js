(function($) {

	// Markers for events
	var initSet = false, openedSet = false, closedSet = false;
	// Set up settings for Pikabu object specified in tests/index.html
	var settings = {
		viewportSelector: '.test-viewport',
		selectors: {
			element: '.test-container',
			common: '.test-sidebar',
			left: '.test-sidebar-left',
			right: '.test-sidebar-right',
			navToggles: '.nav-toggle'
		},
		onInit: function() {
			initSet = true;
		},
		onOpened: function() {
			openedSet = true;
		},
		onClosed: function() {
			closedSet = true;
		}
	};
	var pikabuTest = new Pikabu(settings);

	// Test fixture variables
	var windowWidth = $(window).width();
	var windowHeight = $(window).height();
	var documentHeight = $(document).height();
	var responsiveBreakpoint = 768; // (in px) We always show sidebar beyond this breakpoint

	var isWidescreen = windowWidth > responsiveBreakpoint;
	// Error messages for sidebar visibility tests according to screensize
	var visibilityErrors = {
		true: "Pikabu sidebars aren't visible on a wide screen",
		false: "Pikabu sidebars aren't visible on a narrow screen"
	};

	// Object creation tests
	test("Pikabu initialization tests", function() {
		// Object created successfully
		equal(true, pikabuTest instanceof Pikabu,  "Pikabu not initialized");
	});

	test("Pikabu sidebars visibility according to screen size", function() {
		// TODO Find a way to simulate screen widths
		equal(pikabuTest.$sidebars['left'].is(':visible') && 
			pikabuTest.$sidebars['right'].is(':visible'), isWidescreen, 
			visibilityErrors[isWidescreen]);
	});

	test("Pikabu sidebars always shown when JS is disabled", function() {
		
		// Simulate no JS to always show sidebars
		$('html').addClass('no-js');

		equal(pikabuTest.$sidebars['left'].is(':visible') && 
			pikabuTest.$sidebars['right'].is(':visible'), true, 
			"Pikabu sidebars aren't visible with JS disabled");

		$('html').removeClass('no-js');
	});

	// JS API and events tests
	test("Pikabu sidebar API", function() {

		// Confirm events work
		equal(initSet, true, "Pikabu initialization event failed");

		if(!isWidescreen) {

			// Test nav toggles
			pikabuTest.$navToggles.each(function(index, el) {
				var $el = $(el);
				var role = $el.data('role');

				// Verify that sidebar opens and event fires
				$el.trigger('click'); // Open sidebar
				setTimeout(function() {
					equal(pikabuTest.$sidebars[role].is(':visible'), true, 
						role + " sidebar open toggle not working");
					equal(openedSet, true, "Pikabu opened event failed");
				});

				// Verify that sidebar closes, and closed event fires
				pikabuTest.$overlay.trigger('click'); // Close sidebar
				setTimeout(function() {
					equal(pikabuTest.$sidebars[role].is(':visible'), false, 
						role + " sidebar close toggle not working");
					equal(openedSet, true, "Pikabu closed event failed");
				});

				// Verify API calls work
				pikabuTest.openSidebar(role);
				setTimeout(function() {
					equal(pikabuTest.$sidebars[role].is(':visible'), true, 
						role + " sidebar open toggle not working");
				});

				pikabuTest.closeSidebars();
				setTimeout(function() {
					equal(pikabuTest.$sidebars[role].is(':visible'), true, 
						role + " sidebar close toggle not working");
				});
			});
			
		} 

	});

})(jQuery);