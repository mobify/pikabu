require(['config'], function() {
    require([
        '$',
        'drawer-left',
        'drawer-right',
        'airbnb',
        'pikabu'
    ],
    function(
        $,
        drawerLeft,
        drawerRight,
        airBnb
    ) {
        var $drawerLeft = $('#drawerLeftPikabu').pikabu({
            effect: drawerLeft,
            coverage: '80%',
            easing: [200, 20],
            duration: 1000,
            shade: {
                duration: 300,
                zIndex: 5,
                opacity: 0.2
            },
            cssClass: 'c-pikabu c--left'
        });

        var $airBnb = $('#airBnbPikabu').pikabu({
            effect: airBnb,
            coverage: '80%',
            easing: [200, 20],
            duration: 1000,
            shade: {
                duration: 300,
                opacity: 0.2
            },
            cssClass: 'c-pikabu c--airbnb',
            open: function() {
                $('html').addClass('airbnb');
            },
            closed: function() {
                $('html').removeClass('airbnb');
            }
        });

        var $drawerRight = $('#drawerRightPikabu').pikabu({
            effect: drawerRight,
            coverage: '80%',
            easing: 'swing',
            duration: 200,
            shade: {
                duration: 100,
                zIndex: 5
            },
            cssClass: 'c-pikabu c--right'
        });

        $('.js-drawer-left').on('click', function() {
            $drawerLeft.pikabu('toggle');
        });

        $('.js-drawer-right').on('click', function() {
            $drawerRight.pikabu('toggle');
        });

        $('.js-airbnb').on('click', function() {
            $airBnb.pikabu('toggle');
        });

        // Enable active states
        $(document).on('touchstart', function() {});

        $(window).on('resize', function() {
            $.__deckard.orientation.call($);
        });
    });
});
