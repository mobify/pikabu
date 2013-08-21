(function($) {

	// Markers for events
	var initMarker = false, openedMarker = false, closedMarker = false;
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
			initMarker = true;
		},
		onOpened: function() {
			openedMarker = true;
		},
		onClosed: function() {
			closedMarker = true;
		}
	};
	var pikabuTest = new Pikabu(settings);

	// Test fixture variables
	var windowWidth = $(window).width();
	var windowHeight = $(window).height();
	var documentHeight = $(document).height();
	var responsiveBreakpoint = 768; // (in px) We always show sidebar beyond this breakpoint
	// Error messages for sidebar visibility tests according to screensize
	var visibilityErrors = {
	       true: "Pikabu sidebars aren't visible on a wide screen",
	       false: "Pikabu sidebars aren't visible on a narrow screen"
	};
	var isWidescreen = windowWidth > responsiveBreakpoint;

	// Object creation tests
	test("Pikabu initialization tests", function() {
		// Object created successfully
		equal(true, pikabuTest instanceof Pikabu,  "Pikabu not initialized");
	});

	test("Pikabu sidebars visibility on initial state", function() {
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

	test("Pikabu sidebar opens on clicking toggle", function() {

		// Only test if the sidebars are hidden by default
		if(!isWidescreen) {

			// Test nav toggles
			pikabuTest.$navToggles.each(function(index, el) {
				
				var $el = $(el);
				var role = $el.data('role');

				stop(); // Stop test until async operation completes
				$el.trigger('click'); // Open sidebar

				// Verify that sidebar opens
				setTimeout(function() {
					var visible = pikabuTest.$sidebars[role].is(':visible');
					equal(visible, true, role + " sidebar not opening on clicking toggle");
					start(); // Resume tests
				});

				// Verify that sidebar closes
				stop();
				pikabuTest.$overlay.trigger('click'); // Close sidebar
				setTimeout(function() {
					var visible = pikabuTest.$sidebars[role].is(':visible');
					equal(visible, false, role + " sidebar visible after clicking on overlay");
					start(); // Resume tests
				}, 500);

			});
			
		} else {
			equal(pikabuTest.$navToggles.is(':visible'), false, 
				"Nav toggles should be hidden in wide screen mode");
		}

	});

	test("Pikabu events", function() {
		// Confirm events work
		equal(initMarker, true, "Pikabu initialization event failed");
	});

})(jQuery);