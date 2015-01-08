require(['config'], function() {
    require([
        '$',
        'drawer-left',
        'drawer-right',
        'pikabu'
    ],
    function(
        $,
        drawerLeft,
        drawerRight
    ) {
        var $drawerLeft = $('#drawerLeftPikabu').pikabu({
            effect: drawerLeft,
            coverage: '80%',
            easing: [200, 20],
            duration: 1000,
            shade: {
                duration: 300,
                zIndex: 5
            }
        });

        var $drawerRight = $('#drawerRightPikabu').pikabu({
            effect: drawerRight,
            coverage: '60%',
            easing: 'swing',
            duration: 200,
            shade: {
                duration: 100,
                zIndex: 5
            }
        });

        $('.js-drawer-left').on('click', function() {
            $drawerLeft.pikabu('toggle');
        });

        $('.js-drawer-right').on('click', function() {
            $drawerRight.pikabu('toggle');
        });

        // Enable active states
        $(document).on('touchstart', function() {});

        $(window).on('resize', function() {
            $.__deckard.orientation.call($);
        });
    });
});
