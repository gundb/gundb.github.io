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

  //PAGE ANIMATED TRANSITION CODE
  var isAnimating = false,
    newLocation = '';
    firstLoad = false;
  
  //trigger smooth transition from the actual page to the new one 
  $('main').on('click', '[data-type="page-transition"]', function(event){
    event.preventDefault();
    //detect which page has been selected
    var newPage = $(this).attr('href');
    //if the page is not already being animated - trigger animation
    if( !isAnimating ) changePage(newPage, true);
    firstLoad = true;
    $('html, body').animate({scrollTop: 0}, 'fast');
    return false;
  });

  //detect the 'popstate' event - e.g. user clicking the back button
  $(window).on('popstate', function() {
    if( firstLoad ) {
      /*
      Safari emits a popstate event on page load - check if firstLoad is true before animating
      if it's false - the page has just been loaded 
      */
      var newPageArray = location.pathname.split('/'),
        //this is the url of the page to be loaded 
        newPage = newPageArray[newPageArray.length - 1];
      if( !isAnimating  &&  newLocation != newPage ) changePage(newPage, false);
    }
    firstLoad = true;
  });

  function changePage(url, bool) {
    isAnimating = true;
    // trigger page animation
    $('body').addClass('page-is-changing');
    $('.cd-loading-bar').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
      loadNewContent(url, bool);
      newLocation = url;
      $('.cd-loading-bar').off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
    });
    //if browser doesn't support CSS transitions
    if( !transitionsSupported() ) {
      loadNewContent(url, bool);
      newLocation = url;
    }
  }

  function loadNewContent(url, bool) {
    url = ('' == url) ? 'index.html' : url;
    var newSection = 'cd-'+url.replace('.html', '');
    var section = $('<div class="cd-main-content '+newSection+'"></div>');
      console.log('what is the URL ', url);
    //section.load(url+' .cd-main-content > *', function(event){
    section.load(url, function(event){
      // load new content and replace <main> content with the new one
      $('main').html(section);
      //if browser doesn't support CSS transitions - dont wait for the end of transitions
      var delay = ( transitionsSupported() ) ? 1200 : 0;
      setTimeout(function(){
        //wait for the end of the transition on the loading bar before revealing the new content
        ( section.hasClass('cd-about') ) ? $('body').addClass('cd-about') : $('body').removeClass('cd-about');
        $('body').removeClass('page-is-changing');
        $('.cd-loading-bar').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
          isAnimating = false;
          $('.cd-loading-bar').off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
        });

        if( !transitionsSupported() ) isAnimating = false;
      }, delay);
      
      if(url!=window.location && bool){
        //add the new page to the window.history
        //if the new page was triggered by a 'popstate' event, don't add it
        window.history.pushState({path: url},'',url);
      }
    });
  }

  function transitionsSupported() {
    return $('html').hasClass('csstransitions');
  }

});

















