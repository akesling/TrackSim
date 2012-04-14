/******************************************************************************/
/** Viewport Handling *********************************************************/
/******************************************************************************/

ds = 100

$(document).ready(function () {
    draw_viewport(0,0,ds,ds);
});

$("#set-xy").click(function () {
    var viewport = $("#viewport")[0].getContext('2d');
    viewport.clearRect(0,0,500,500);
    var x = $("#x-coord").val();
    var y = $("#y-coord").val();
    draw_viewport(x,y,ds,ds);
});

function draw_viewport(x, y, width, height) {
    var track = $("#track")[0];
    var viewport = $("#viewport")[0].getContext('2d');
    viewport.drawImage(track,x,y,ds,ds,0,0,500,500);
}

/******************************************************************************/
/** Car object framework ******************************************************/
/******************************************************************************/

var car = {}

car.get_sensors = function() {
    var viewport = $("#viewport")[0].getContext('2d');
    //viewport.getImageData(,

    return "foo";
}
