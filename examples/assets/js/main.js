require(['config'], function() {
    require([
        '$',
        'FastClick',
        'drawer-left',
        'drawer-right',
        'airbnb',
        'slide-along',
        'pikabu'
    ],
    function(
        $,
        FastClick,
        drawerLeft,
        drawerRight,
        airBnb,
        slideAlong
    ) {
        var activeEffect;

        var $drawerLeft = $('#drawerLeftPikabu').pikabu({
            effect: drawerLeft,
            coverage: '80%',
            easing: [200, 20],
            duration: 1000,
            shade: {
                duration: 300,
                zIndex: 5,
                opacity: 0,
                background: 'red'
            },
            cssClass: 'c-pikabu c--left'
        });

        var $airBnb = $('#airbnbPikabu').pikabu({
            effect: airBnb,
            coverage: '80%',
            easing: [200, 20],
            duration: 1000,
            zIndex: 10,
            shade: {
                duration: 300,
                opacity: 0.2
            },
            cssClass: 'c-pikabu c--airbnb'
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

        var $slideAlong = $('#slideAlongPikabu').pikabu({
            effect: slideAlong,
            coverage: '80%',
            easing: [100, 15],
            duration: 1000,
            shade: {
                duration: 100,
                zIndex: 5
            },
            cssClass: 'c-pikabu c--slide'
        });

        var effects = {
            'drawerLeft': $drawerLeft,
            'drawerRight': $drawerRight,
            'airbnb': $airBnb,
            'slideAlong': $slideAlong
        };

        var $menu = $('.js-menu-open');

        activeEffect = effects['drawerLeft'];

        $('.c-effects__button').on('click', function() {
            var $button = $(this);
            var effect = $button.attr('data-pikabu-effect');

            $('.c-effects__button').removeClass('c--active');
            $button.addClass('c--active');

            activeEffect = effects[effect];

            $menu
                .attr('data-pikabu-effect', effect)
                .addClass('c--wiggle');

            setTimeout(function(){
                $menu.removeClass('c--wiggle');
            }, 500);
        });

        $menu.on('click', function() {
            activeEffect.pikabu('open');
        });

        // Enable active states
        $(document).on('touchstart', function() {});

        FastClick.attach(document.body);
    });
});
