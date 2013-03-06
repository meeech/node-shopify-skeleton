//This is for the customer. Sends us their events.
var HOST_URL = 'http://heatmapper-lg2a5ge6.dotcloud.com/';
if(window.location.host.indexOf('localhost') > -1 ) { HOST_URL = 'http://localhost:8080/'; }

jQuery(function($){
//Begin

//Don't execute when viewing the page via iFrame.
if(window !== top) { return; }

var socket = io.connect(HOST_URL)
    ,sendXY = function(event) {
        socket.emit('xy', { customerId: 1, x: event.pageX, y: event.pageY });
    }
    ,sendFrame = function(event) {
        //Ok, jQ doesnt normalize resize event, so fires constantly. 
        //need to either normalize, or switch to yui!
        socket.emit('frame', { width: window.innerWidth, height: window.innerHeight });
    }
;

//Send initial connection data
socket.emit('register-customer', {
    location: window.location.href
    ,frame: {width: window.innerWidth, height: window.innerHeight }
    ,customerId: '1'
});

$(window).mousemove(sendXY);
$(window).resize(sendFrame);

//End
});
