console.log('loaded');

var NUM_LEDS = 60;
var current_color = '#ff0000';

$(function() {
  for (i=0; i < NUM_LEDS; ++i) {
    $('.bar tr').append($('<td class="cell">'));
  }
  $('.swatch').each(function(i, el) {
    var $el = $(el);
    var color = $el.find('input[type=color]').val();
    $el.css('background-color', color);
  });
});

$('.swatch').click(function(e) {
  $('input[type=radio]', e.target).click();
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
