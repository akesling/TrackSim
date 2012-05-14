/******************************************************************************/
/** Viewport Handling *********************************************************/
/******************************************************************************/

$(document).ready(function () {
    draw_viewport(car.x,car.y,car.width,car.width);

    $("#set-xy").click(function () {
        var viewport = $("#viewport")[0].getContext('2d');
        car.x = $("#x-coord").val();
        car.y = $("#y-coord").val();
        draw_viewport(car.x,car.y,car.width,car.width);
    });

    $("#x-coord").keyup(function(event) {
        if ( event.which == 37 ) { // Key left
            car.turn(-1);
        } else if ( event.which == 39 ) { // Key right
            car.turn(1);
        } else if ( event.which == 38 ) { // Key up
            car.move(1);
            tick();
        } else if ( event.which == 40 ) { // Key down
            car.move(-1);
            tick();
        }
    });
});


function draw_viewport(x, y, width, height) {
    if (!x) {
        x = 0;
    }
    if (!y) {
        y = 0;
    }

    $("#x-coord").val(x);
    $("#y-coord").val(y);

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

    viewport.getContext('2d').clearRect(0,0,600,600);
    canvg(viewport, svg_src);
    //viewport.drawImage(track,x,y,ds,ds,0,0,500,500);
}

/******************************************************************************/
/** Car object framework ******************************************************/
/******************************************************************************/

function tick() {
    draw_viewport(car.x,car.y,car.width,car.width);
    car.set_sensors();
    car.draw(viewport.getContext('2d'));
}

var car = {
    heading:0, // Degrees from north counter-clockwise
    speed:0.4, // Portion of "car" moved per tick
    x:91.3,
    y:91.3,
    width:2 // Width as a pixel size from original image (/500)
}

car.sensors = [
    {   pos:0.5, // Portion of car width
        width:10,
        data:0},

    {   pos:0.75, // Portion of car width
        width:10,
        data:0}
];

car.sensor_pos = function(sensor) {
    mag = sensor.pos*400;
    x_pos = mag*Math.cos((Math.PI/180)*car.heading);
    y_pos = mag*Math.sin((Math.PI/180)*car.heading);
    return {x:x_pos, y:y_pos};
}

car.draw = function(context) {
    context.fillStyle = "green";
    for(var i=0; i<car.sensors.length; i++) {
        var s = car.sensors[i];
        pos = car.sensor_pos(s);
        context.fillRect(pos.x, pos.y, s.width, s.width);
    }
}

car.turn = function(degrees) {
    if(degrees <= 0) {
        car.heading = (car.heading+degrees)%360;
    } else {
        car.heading = (car.heading+360+degrees)%360;
    }
}

car.move = function(direction) {
    var mag = car.width*car.speed;

    if (direction > 0) {
        var dir = -1;
    } else {
        var dir = 1;
    }

    car.x += mag*dir*Math.sin((Math.PI/180)*(360-car.heading));
    car.y += mag*dir*Math.cos((Math.PI/180)*(360-car.heading));
}

car.sensor_func = function(context, sensor) {
    var pos = car.sensor_pos(sensor);
    var pixels = context.getImageData(pos.x, pos.y,
        sensor.width, sensor.width).data;

    var acc = 0;
    for (var i=0; i<pixels.length; i+=4) {
        var lum = pixels[i+3];
        acc += lum; //add 1 if pixel dark enough
    }

    return (acc/(255*(sensor.width*sensor.width))) > 0.5;
}

car.set_sensors = function() {
    var viewport = $("#viewport")[0].getContext('2d');

    for (var i=car.sensors.length-1; i>=0; i--) {
        var s = car.sensors[i];
        s.data = this.sensor_func(viewport, s);
    }
}

car.get_sensors = function() {
    return car.sensors;
}
