(function(){

  let last_known_scroll_position = 0;
  let ticking = false;

  function updateHeaderNavByScroll(scroll_pos) {
    console.log(scroll_pos);
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
