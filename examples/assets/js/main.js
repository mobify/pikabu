require(['config'], function() {
    require([
        '$',
        'modal-center',
        'sheet-top',
        'sheet-right',
        'sheet-left',
        'sheet-bottom',
        'pikabu'
    ],
    function(
        $,
        modalCenter,
        sheetTop,
        sheetRight,
        sheetLeft,
        sheetBottom
    ) {
        var $modalCenter = $('#modalCenterPikabu').pikabu({
            effect: modalCenter,
            coverage: '80%'
        });

        $('#modalCenter').on('click', function() {
            $modalCenter.pikabu('toggle');
        });

        var $sheetTop = $('#sheetTopPikabu').pikabu({
            effect: sheetTop,
            coverage: '80%',
            shade: {
                duration: 200
            }
        });

        $('#sheetTop').on('click', function() {
            $sheetTop.pikabu('toggle');
        });

        var $sheetRight = $('#sheetRightPikabu').pikabu({
            effect: sheetRight,
            coverage: '80%'
        });

        $('#sheetRight').on('click', function() {
            $sheetRight.pikabu('toggle');
        });

        var $sheetLeft = $('#sheetLeftPikabu').pikabu({
            effect: sheetLeft,
            coverage: '80%'
        });

        $('#sheetLeft').on('click', function() {
            $sheetLeft.pikabu('toggle');
        });

        var $sheetBottom = $('#sheetBottomPikabu').pikabu({
            effect: sheetBottom,
            coverage: '100%'
        });

        $('#sheetBottom').on('click', function() {
            $sheetBottom.pikabu('toggle');
        });

        // Enable active states
        $(document).on('touchstart', function() {});

        $(window).on('resize', function() {
            $.__deckard.orientation.call($);
        });
    });
});
