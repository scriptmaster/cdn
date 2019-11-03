(function(){

  let last_known_scroll_position = 0;
  let ticking = false;

  var scrollNavColor = '0,0,0';
  var scrollOffsetpx = 30;
  var scrollToPxRatio = 1;
  var maxScrollPx = scrollOffsetpx+(100*scrollToPxRatio);
  var previousScrollOp = -1;

  function updateHeaderNavByScroll(scroll_pos) {
    console.log(scroll_pos);
    var op=0;
    if(scroll_pos > 30) {
      if(scroll_pos >= maxScrollPx)
        op=1;
      else op=(scroll_pos-scrollOffsetpx) / (maxScrollPx-scrollOffsetpx);
    }
    op = Math.round(op*100,0)/100;
    console.log(op);
    if(previousScrollOp!=op) {
      previousScrollOp=op;
      console.log('Updating opacituad');
      document.getElementsByTagName('nav')[0].style.backgroundColor='rgba('+scrollNavColor+','+op+')';
    }
  }

  window.addEventListener('scroll', function(e) {
    last_known_scroll_position = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(function() {
        updateHeaderNavByScroll(last_known_scroll_position);
        ticking = false;
      });
      ticking = true;
    }
  });

})();