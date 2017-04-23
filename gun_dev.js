$(document).ready(function(){
  // swiper hack application
  var slide = window.slide = {pos: {left:0}};
  slide.$ = $('.panels').css({position: 'relative', width: 999999}).wrap($('<div>').css({overflow: 'hidden', position: 'relative'}));
  slide.next = function(){
    var me = slide.next.is;
    me.animate({'margin-left': -slide.next.is.outerWidth() }, function(){
      me.css({'margin-left': 0}).appendTo(slide.$);
    });
    slide.next.is = slide.next.is.next();
    if(!slide.next.is.length){
      slide.next.is = slide.$.children('.panel').first();
    }
  };
  slide.back = function(){
    var me = slide.next.is;
    var prev = slide.$.children('.panel').last();
    prev.css({'margin-left': -prev.outerWidth()}).prependTo(slide.$).animate({'margin-left': 0});
    slide.next.is = me;
  };
  slide.$.children('.panel').each(function(){
    slide.next.is = slide.next.is || $(this);
    $(this).css({float: 'left'});
  });
  slide.$.on('click', function(){
    slide.next();
  });
  // triggering with prev button
  $('.prev').on('click', function(){
    slide.back();
  });
  // triggering with next button
  $('.next').on('click', function(){
    slide.next();
  });
  // Code to flip the picture on hover
  $('.hover').hover(function(){
    $(this).toggleClass('flip');
  });
  
  $(function(){
    var c = ['dull', 'blue', 'green', 'yellow' , 'red'], a = 'dull blue red green yellow', n = 0, to;
    $(".screen").click(function(){
      c.push(c.shift());
      to = to || c[0];
      $(this).removeClass(a).addClass(to);
      $('.screen').not(this).each(function(){
        var t = $(this); n++;
        setTimeout(function(){
          t.removeClass(a).addClass(to);
          if(!(--n)){ to = null; }
        }, rand(400,700));
      });
    });
    function rand(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  });
  $(function(){
    var mouse = $('.mouse');
    function show(i){
      function to(){
        mouse.animate({top: "60%", left: "55%"}, {
          duration: 500, 
          specialEasing: {top: 'easeInQuad', left: 'easeOutQuad'},
          complete: click
        });
      }
      function click(){
        mouse.delay(230).animate({width: mouse.width() / 2}, {
          duration: 60, 
          complete: function(){
            mouse.closest('.screen').trigger('click');
            mouse.animate({width: mouse.width() * 2}, {
              duration: 120, 
              complete: fro
            });
          }
        });
      }
      function fro(){
        mouse.delay(900).animate({top: "87%", left: "110%"}, {
          duration: 700, 
          specialEasing: {top: 'easeOutQuad', left: 'easeInQuad'}, 
          complete: function(){
            setTimeout(show, 4 * 1000);
          }
        });
      }
      if(!i && $('.graphic').filter(function() { return $(this).is(":hover"); }).length){
        setTimeout(show, 2000);
      } else {
        to(); 
      }
    } 
    mouse.delay(1200).animate({top: "70%", left: "20%"}, {
      duration: 400, 
      specialEasing: {top: 'easeOutQuad', left: 'easeInQuad'}, 
      complete: function(){ show(true);}
    });
  });

});

















