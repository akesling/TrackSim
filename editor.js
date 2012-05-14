var setup_editor;
var loop_editor;
$(document).ready(function() {
    setup_editor = ace.edit("setup-editor");
    setup_editor.getSession().setMode("ace/mode/javascript");
    loop_editor = ace.edit("loop-editor");
    loop_editor.getSession().setMode("ace/mode/javascript");

    $("#run").click(run);
});

var current_runner;
var iterations;
function run() {
    var setup = setup_editor.getSession().getValue();
    var body = loop_editor.getSession().getValue();
    iterations = $("#num-ticks").val()

    eval(setup);
    function runner() {
        eval(body);
        tick();
        iterations--;
        if(iterations > 0) {
            current_runner = window.setTimeout(runner, 20);
        }
    }

    runner();
}
