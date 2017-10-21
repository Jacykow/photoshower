var content;
var gs;

var width = 100;
var lastScale = 1;
var lastX = 0;
var lastY = 0;



function initGs() {
    content = $('#content');
    $(content).width(width + '%');


    gs = new Hammer(content[0]);
    gs.get('pinch').set({enable: true});
    gs.on('pinch', function (ev) {
        if (Math.abs(ev.scale - lastScale) > .03 && drawing == 0) {
            if ((ev.scale > 1 && width < 300) || (ev.scale < 1 && width > 100)) {
                width = width * (ev.scale);
                if (width < 100) width = 100;
                $(content).width(width + '%');
                lastScale = ev.scale;
            }
        }
    });

    gs.on('pan', function (ev) {
        if(drawing == 0) {
            var l = parseInt($(content).css('left')) + (ev.deltaX - lastX);
            offsetL += ev.deltaX - lastX;
            $(content).css('left', l + 'px');

            var t = parseInt($(content).css('top')) + (ev.deltaY - lastY);
            offsetT += ev.deltaY - lastY;
            $(content).css('top', t + 'px');

            lastX = ev.deltaX;
            lastY = ev.deltaY;
        }
    });

    gs.on('panend', function (ev) {
        lastX = 0;
        lastY = 0;
    });
}