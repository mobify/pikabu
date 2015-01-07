require(['config'], function() {
    require([
        '$',
        'drawer-left',
        'pikabu'
    ],
    function(
        $,
        drawerLeft
    ) {
        var $drawerLeft = $('#drawerLeftPikabu').pikabu({
            effect: drawerLeft,
            coverage: '80%'
        });

        $('.js-drawer-left').on('click', function() {
            $drawerLeft.pikabu('toggle');
        });

        // Enable active states
        $(document).on('touchstart', function() {});

        $(window).on('resize', function() {
            $.__deckard.orientation.call($);
        });
    });
});
