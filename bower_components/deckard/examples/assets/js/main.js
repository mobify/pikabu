require(['config'], function() {
    require([
        '$',
        'deckard'
    ],
    function($) {
        $('#osVersion').html($.os.version);
        $('#browserVersion').html($.browser.version);
    });
});
