var x1, x2, y1, y2;

function initPreview() {

    $(document).click(function (ev) {
        x1 = ev.clientX - offsetL;
        y1 = ev.clientY - offsetT;
        $(document).click(function (ev) {
            x2 = ev.clientX - offsetL;
            y2 = ev.clientY - offsetT;
            console.log('x1: ' + x1 + ' y1: ' + y1 + ' x2: ' + x2 + ' y2: ' + y2)
        })
    })

}

