(function($) {

    // Markers for events
    var initializedCalled = false,
        beforeOpenedCalled = false,
        afterOpenedCalled = false,
        beforeClosedCalled = false,
        afterClosedCalled = false,
        initializedEventName;

    var pikabuTest = $('#mainPikabu').pikabu({
        initialized: function(e) {
            initializedCalled = true;
            initializedEventName = e.type;
        },
        beforeOpened: function() {
            beforeOpenedCalled = true;
        },
        afterOpened: function() {
            afterOpenedCalled = true;
        },
        beforeClosed: function() {
            beforeClosedCalled = true;
        },
        afterClosed: function() {
            afterClosedCalled = true;
        }
    }).data('pikabu');

    // Test fixture variables
    var windowWidth = $(window).width();
    var responsiveBreakpoint = 768; // (in px) We always show sidebar beyond this breakpoint
    // Error messages for sidebar visibility tests according to screensize
    var visibilityErrors = {
           true: "Pikabu sidebars aren't visible on a wide screen",
           false: "Pikabu sidebars aren't visible on a narrow screen"
    };
    var isWidescreen = windowWidth > responsiveBreakpoint;

    //
    // ----------------------------------------------------------------
    // Tests
    // ----------------------------------------------------------------
    //
    // jQuery / Mobify tests
    test('Pikabu selector library correctly assigned', function() {
        // Mobify.$ is corrected assigned to jQuery
        equal(Mobify.$, jQuery, 'Selector library is correctly assigned to Mobify.$');
    });


    test('Pikabu initialization event called', function() {
        // Confirm events work
        equal(initializedCalled, true, "Pikabu initialization event called successfully");
        equal(initializedEventName, 'pikabu:initialized', "Pikabu initialization event name is correct");
    });


    // Object creation tests
    test('Pikabu instance created successfully', function() {
        // Object created successfully
        equal(true, pikabuTest instanceof $.fn.pikabu.Constructor,  'Pikabu instance created');
    });

    test('Pikabu sidebars visibility on initial state', function() {
        // TODO Find a way to simulate screen widths
        equal(pikabuTest.$sidebars['left'].is(':visible') && 
            pikabuTest.$sidebars['right'].is(':visible'), isWidescreen, 
            visibilityErrors[isWidescreen]);
    });

    test('Pikabu sidebars always shown when JS is disabled', function() {
        
        // Simulate no JS to always show sidebars
        $('html').addClass('no-js');

        equal(pikabuTest.$sidebars['left'].is(':visible') && 
            pikabuTest.$sidebars['right'].is(':visible'), true, 
            "Pikabu sidebars are visible with JS disabled");

        $('html').removeClass('no-js');
    });

    test('Pikabu sidebar opens on clicking toggle', function() {

        // Only test if the sidebars are hidden by default
        if(!isWidescreen) {

            // Test nav toggles
            pikabuTest.$navToggles.each(function(index, el) {
                
                var $el = $(el);
                var role = $el.data('role');

                stop(); // Stop test until async operation completes
                $el.trigger('pikabu:click'); // Open sidebar

                // Verify that sidebar opens
                setTimeout(function() {
                    var visible = pikabuTest.$sidebars[role].is(':visible');
                    equal(visible, true, role + " sidebar not opening on clicking toggle");
                    equal(beforeOpenedCalled, true, role + " sidebar didn't trigger the beforeOpen event");
                    equal(afterOpenedCalled, true, role + " sidebar didn't trigger the beforeOpen event");
                    start(); // Resume tests
                });

                // Verify that sidebar closes
                stop();
                pikabuTest.$overlay.trigger('pikabu:click'); // Close sidebar
                setTimeout(function() {
                    var visible = pikabuTest.$sidebars[role].is(':visible');
                    equal(visible, false, role + " sidebar visible after clicking on overlay");
                    equal(beforeClosedCalled, true, role + " sidebar didn't trigger the beforeClose event");
                    equal(afterClosedCalled, true, role + " sidebar didn't trigger the afterClose event");
                    start(); // Resume tests
                }, 500);

            });
            
        } else {
            equal(pikabuTest.$navToggles.is(':visible'), false, 
                "Nav toggles should be hidden in wide screen mode");
        }

    });
})(jQuery);