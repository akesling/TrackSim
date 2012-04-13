$().ready(function () {
    draw_viewport(0,0,100,100);
});

$("#set-xy").click(function () {
    var x = $("#x-coord").val();
    var y = $("#y-coord").val();
    draw_viewport(x,y,100,100);
});

function draw_viewport(x, y, width, height) {
    var track = $("#track")[0];
    var viewport = $("#viewport")[0];
    viewport.getContext('2d').drawImage(track,x,y,100,100,0,0,500,500);
}
