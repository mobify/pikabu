require(['config'], function() {
    require([
        '$',
        'modal-center',
        'sheet-top',
        'sheet-right',
        'sheet-left',
        'sheet-bottom',
        'pinny'
    ],
    function(
        $,
        modalCenter,
        sheetTop,
        sheetRight,
        sheetLeft,
        sheetBottom
    ) {
        var $modalCenter = $('#modalCenterPikabu').pinny({
            effect: modalCenter,
            coverage: '80%'
        });

        $('#modalCenter').on('click', function() {
            $modalCenter.pinny('toggle');
        });

        var $sheetTop = $('#sheetTopPikabu').pinny({
            effect: sheetTop,
            coverage: '80%',
            shade: {
                duration: 200
            }
        });

        $('#sheetTop').on('click', function() {
            $sheetTop.pinny('toggle');
        });

        var $sheetRight = $('#sheetRightPikabu').pinny({
            effect: sheetRight,
            coverage: '80%'
        });

        $('#sheetRight').on('click', function() {
            $sheetRight.pinny('toggle');
        });

        var $sheetLeft = $('#sheetLeftPikabu').pinny({
            effect: sheetLeft,
            coverage: '80%'
        });

        $('#sheetLeft').on('click', function() {
            $sheetLeft.pinny('toggle');
        });

        var $sheetBottom = $('#sheetBottomPikabu').pinny({
            effect: sheetBottom,
            coverage: '100%'
        });

        $('#sheetBottom').on('click', function() {
            $sheetBottom.pinny('toggle');
        });

        // Enable active states
        $(document).on('touchstart', function() {});

        $(window).on('resize', function() {
            $.__deckard.orientation.call($);
        });
    });
});
