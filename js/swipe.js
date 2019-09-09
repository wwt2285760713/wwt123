function Swipe(container, options) {

    "use strict";
  
    // utilities
    var noop = function() {}; // simple no operation function
    var offloadFn = function(fn) { setTimeout(fn || noop, 0) }; // offload a functions execution
    
    // check browser capabilities
    var browser = {
      addEventListener: !!window.addEventListener,
      touch: ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
      transitions: (function(temp) {
        var props = ['transitionProperty', 'WebkitTransition', 'MozTransition', 'OTransition', 'msTransition'];
        for ( var i in props ) if (temp.style[ props[i] ] !== undefined) return true;
        return false;
      })(document.createElement('swipe'))
    };
  
    // quit if no root element
    if (!container) return;
    var element = container.children[0];
    var slides, slidePos, width, length;
    options = options || {};
    var index = parseInt(options.startSlide, 10) || 0;
    var speed = options.speed || 300;
    options.continuous = options.continuous !== undefined ? options.continuous : true;
  
    function setup() {
  
      // cache slides
      slides = element.children;
      length = slides.length;
  
      // set continuous to false if only one slide
      if (slides.length < 2) options.continuous = false;
  
      //special case if two slides
      if (browser.transitions && options.continuous && slides.length < 3) {
        element.appendChild(slides[0].cloneNode(true));
        element.appendChild(element.children[1].cloneNode(true));
        slides = element.children;
      }
  
      // create an array to store current positions of each slide
      slidePos = new Array(slides.length);
  
      // determine width of each slide
      width = container.getBoundingClientRect().width || container.offsetWidth;
  
      element.style.width = (slides.length * width) + 'px';
  
      // stack elements
      var pos = slides.length;
      while(pos--) {
  
        var slide = slides[pos];
  
        slide.style.width = width + 'px';
        slide.setAttribute('data-index', pos);
  
        if (browser.transitions) {
          slide.style.left = (pos * -width) + 'px';
          move(pos, index > pos ? -width : (index < pos ? width : 0), 0);
        }
  
      }
  
      // reposition elements before and after index
      if (options.continuous && browser.transitions) {
        move(circle(index-1), -width, 0);
        move(circle(index+1), width, 0);
      }
  
      if (!browser.transitions) element.style.left = (index * -width) + 'px';
  
      container.style.visibility = 'visible';
  
    }
  
    function prev() {
  
      if (options.continuous) slide(index-1);
      else if (index) slide(index-1);
  
    }
  
    function next() {
  
      if (options.continuous) slide(index+1);
      else if (index < slides.length - 1) slide(index+1);
  
    }
  
    function circle(index) {
  
      // a simple positive modulo using slides.length
      return (slides.length + (index % slides.length)) % slides.length;
  
    }
  
    function slide(to, slideSpeed) {
  
      // do nothing if already on requested slide
      if (index == to) return;
      
      if (browser.transitions) {
  
        var direction = Math.abs(index-to) / (index-to); // 1: backward, -1: forward
  
        // get the actual position of the slide
        if (options.continuous) {
          var natural_direction = direction;
          direction = -slidePos[circle(to)] / width;
  
          // if going forward but to < index, use to = slides.length + to
          // if going backward but to > index, use to = -slides.length + to
          if (direction !== natural_direction) to =  -direction * slides.length + to;
  
        }
  
        var diff = Math.abs(index-to) - 1;
  
        // move all the slides between index and to in the right direction
        while (diff--) move( circle((to > index ? to : index) - diff - 1), width * direction, 0);
              
        to = circle(to);
  
        move(index, width * direction, slideSpeed || speed);
        move(to, 0, slideSpeed || speed);
  
        if (options.continuous) move(circle(to - direction), -(width * direction), 0); // we need to get the next in place
        
      } else {     
        
        to = circle(to);
        animate(index * -width, to * -width, slideSpeed || speed);
        //no fallback for a circular continuous if the browser does not accept transitions
      }
  
      index = to;
      offloadFn(options.callback && options.callback(index, slides[index]));
    }
  
    function move(index, dist, speed) {
  
      translate(index, dist, speed);
      slidePos[index] = dist;
  
    }
}