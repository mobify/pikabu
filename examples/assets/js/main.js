require(['config'], function() {
    require([
        '$',
        'FastClick',
        'drawer-left',
        'drawer-right',
        'airbnb',
        'pikabu'
    ],
    function(
        $,
        FastClick,
        drawerLeft,
        drawerRight,
        airBnb
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

        var effects = {
            'drawerLeft': $drawerLeft,
            'drawerRight': $drawerRight,
            'airbnb': $airBnb
        };

        activeEffect = effects['drawerLeft'];

        $('.c-effects__button').on('click', function() {
            var $button = $(this);
            var effect = $button.attr('data-pikabu-effect');

            $('.c-effects__button').removeClass('c--active');
            $button.addClass('c--active');

            activeEffect = effects[effect];

            $('.js-menu-open').attr('data-pikabu-effect', effect);
        });

        $('.js-menu-open').on('click', function() {
            activeEffect.pikabu('open');
        });

        // Enable active states
        $(document).on('touchstart', function() {});

        FastClick.attach(document.body);
    });
});
