console.log('loaded');

var NUM_LEDS = 60;

var canvas, context, paint;
var canvasHeight = 150;
var canvasWidth = 10*NUM_LEDS;

function initCanvas() {
  var canvasDiv = document.getElementById('canvasDiv');
  canvas = document.createElement('canvas');
  canvas.setAttribute('width', canvasWidth);
  canvas.setAttribute('height', canvasHeight);
  canvas.setAttribute('id', 'canvas');
  canvasDiv.appendChild(canvas);
  if(typeof G_vmlCanvasManager != 'undefined') {
      canvas = G_vmlCanvasManager.initElement(canvas);
  }
  context = canvas.getContext("2d");
  context.filter = "blur(5px)";

  $('#canvas').mousedown(function(e){
    var mouseX = e.pageX - this.offsetLeft;
    var mouseY = e.pageY - this.offsetTop;
    paint = true;
    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
    redraw();
  });

  $('#canvas').mousemove(function(e){
    if (paint) {
      addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
      redraw();
    }
  });

  $('#canvas').mouseup(function(e){
    paint = false;
  });

  $('#canvas').mouseleave(function(e){
    paint = false;
  });

}

var clickX = new Array();
var clickY = new Array();
var clickColor = new Array();
var clickDrag = new Array();
var clickSize = new Array();
var curSize = canvasWidth / NUM_LEDS;
var curColor = '#ff0000';
var paint;

function addClick(x, y, dragging)
{
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
  clickColor.push(curColor);
  clickSize.push(curSize);
}

function stringColorAlpha(color, alpha) {
      return 'rgba(' + [color.r, color.g, color.b, alpha].join(',') + ')';
}

function redraw(){
  context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
  context.lineJoin = "round";
  for (var i=0; i < clickX.length; i++) {
    /*
    for (var y=canvasHeight-1; y > -1; --y) {
      context.beginPath();
      if (clickDrag[i] && i) {
        context.moveTo(clickX[i-1], y);
      } else {
        context.moveTo(clickX[i]-1, y);
      }
      context.lineTo(clickX[i], y);
      context.closePath();
      context.strokeStyle = stringColorAlpha(clickColor[i], 0.1*y/canvasHeight);
      context.lineWidth = clickSize[i];
      context.stroke();
    }
    */

    var startX = (clickDrag[i] && i) ? clickX[i-1] : clickX[i]-1;
    var gradient = context.createLinearGradient(0,0,0,canvasHeight);
    gradient.addColorStop(0,"rgba(0,0,0,0)");
    gradient.addColorStop(1,clickColor[i]);
    context.fillStyle = gradient;
    context.fillRect(startX,0,clickX[i]-startX,canvasHeight);
  }
}

function renderLED() {
  var step = canvasWidth/NUM_LEDS;
  for (var x=0; x < NUM_LEDS; ++x) {
    var data = context.getImageData(x*step, canvasHeight-1, step, 1).data;
    var r = 0, g = 0, b = 0, a = 0;
    for (var i=0; i < data.length; i += 4) {
      r += data[i];
      g += data[i+1];
      b += data[i+2];
      a += data[i+3];
    }
    r = r/step;
    g = g/step;
    b = b/step;
    a = a/step;
    r = Math.trunc(r*a/255);
    g = Math.trunc(g*a/255);
    b = Math.trunc(b*a/255);
    $.get(['http://arduino.local/arduino/custom', r, g, b, x, 1].join('/'));
  }
}


$('.swatch').click(function(e) {
  var $el = $(e.target);
  curColor = $el.find('input[type=color]').val();
  $('.swatch').removeClass('selected');
  $el.addClass('selected');
});

var follower = $('#follower');

function mouseX(event) {
  return event.clientX
}
function mouseY(event) {
  return event.clientY
}
function positionElement(event) {
  var mouse = { x: mouseX(event), y: mouseY(event) }
  follower.css('top', mouse.y + 'px');
  follower.css('left', mouse.x + 'px');
}

var timer = false;
window.onmousemove = function init(event) {
    _event = event
    timer = setTimeout(function() {
          positionElement(_event)
    } , 1);
};

$(function() {
  initCanvas();
  for (i=0; i < NUM_LEDS; ++i) {
    $('.bar tr').append($('<td class="cell">'));
  }
  $('.swatch').each(function(i, el) {
    var $el = $(el);
    var color = $el.find('input[type=color]').val();
    $el.css('background-color', color);
  });
});
