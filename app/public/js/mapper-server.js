//And for the Shop Owner
var HOST_URL = 'http://heatmapper-lg2a5ge6.dotcloud.com/';
if(window.location.host.indexOf('localhost') > -1 ) { HOST_URL = 'http://localhost:8080/'; }

jQuery(function($){
//Begin
var socket = io.connect(HOST_URL);

socket.emit('register-owner', {
    ownerId: 'kloko'
});

socket.on('frame', function(data) {
    console.log('-> Frame');
    $('#viewport').height(data.height).width(data.width);
});

socket.on('location', function(data) {
    console.log('-> Location');
    $('#viewport').attr('src',data.location);
});

var raf = (
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.oRequestAnimationFrame
);

var canvas = $('canvas');

try{
    var heatmap = createWebGLHeatmap({canvas: canvas[0]});
}
catch(error){
    console.log(error);
    return;
}

var count = 200;
var size = 15;
var intensity = 15;
var spread = 25;
var decay = 20;

//So, this loads up the points
socket.on('xy', function(data){

    var offset = canvas.offset();
    var x = data.x - offset.left;
    var y = data.y - offset.top;
    var i = 0;
    while(i < count){
        var xoff = Math.random()*2-1;
        var yoff = Math.random()*2-1;
        var l = xoff*xoff + yoff*yoff;
        if(l > 1){
            continue;
        }
        var ls = Math.sqrt(l);
        xoff/=ls; yoff/=ls;
        xoff*=1-l; yoff*=1-l;
        i += 1;
        heatmap.addPoint(x+xoff*spread, y+yoff*spread, size, intensity/1000);
    }
});

canvas.click(function(){
    // heatmap.clear();
});

var update = function(){

    heatmap.adjustSize(); // can be commented out for statically sized heatmaps, resize clears the map
    heatmap.update(); // adds the buffered points
    heatmap.multiply(1-decay/(100*100));
    heatmap.display(); // draws the heatmap to the canvas

    //heatmap.blur();
    //heatmap.clamp(0.0, 1.0); // depending on usecase you might want to clamp it

    raf(update);
};
raf(update);

//End
});
