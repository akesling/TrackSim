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
    if (!x) {
        x = 0;
    }
    if (!y) {
        y = 0;
    }
    var svg_src = '<svg \
   xmlns:dc="http://purl.org/dc/elements/1.1/" \
   xmlns:cc="http://creativecommons.org/ns#" \
   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" \
   xmlns:svg="http://www.w3.org/2000/svg" \
   xmlns="http://www.w3.org/2000/svg" \
   version="1.1" \
   viewBox="'+x+' '+y+' '+width+' '+height+'" \
   id="svg2"> \
  <defs \
     id="defs4" /> \
  <metadata \
     id="metadata7"> \
    <rdf:RDF> \
      <cc:Work \
         rdf:about=""> \
        <dc:format>image/svg+xml</dc:format> \
        <dc:type \
           rdf:resource="http://purl.org/dc/dcmitype/StillImage" /> \
        <dc:title></dc:title> \
      </cc:Work> \
    </rdf:RDF> \
  </metadata> \
  <g \
     transform="translate(0,-552.36218)" \
     id="layer1"> \
    <path \
       d="M 92.857143,92.857143 420,104.28571 374.28572,352.85715 102.85714,405.71429 z" \
       transform="translate(0,552.36218)" \
       id="path2987" \
       style="fill:none;stroke:#000000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" /> \
  </g> \
</svg>';
    var track = $("#track")[0];
    var viewport = document.getElementById('viewport');
    canvg(viewport, svg_src);
    //viewport.drawImage(track,x,y,ds,ds,0,0,500,500);
}

/******************************************************************************/
/** Car object framework ******************************************************/
/******************************************************************************/

var car = {};
car.sensors = [
    {   x:0,
        y:0,
        width:500,
        data:0},

    {   x:300,
        y:300,
        width:10,
        data:0}
    ];

car.sensor_func = function(context, sensor) {
    var pixels = context.getImageData(sensor.x, sensor.y,
        sensor.x+sensor.width, sensor.y+sensor.width).data;

    var acc = 0;
    for (var i=0; i<pixels.length; i+=4) {
        var lum = 0.333*pixels[i] + 0.333*pixels[i+1] +
            0.333*pixels[i+2] + pixels[i+3];
        acc += (lum/255) >= 0.3; //add 1 if pixel dark enough
    }

    return (acc/(sensor.width*sensor.width)) > 0;
}

car.get_sensors = function() {
    var viewport = $("#viewport")[0].getContext('2d');
    for (var i=car.sensors.length-1; i>=0; i--) {
        var s = car.sensors[i];
        s.data = this.sensor_func(viewport, s);
    }

    return car.sensors;
}
