/* Law Reviews UI script
   - Multi-layer parallax for the hero copy
   - Card-grid balancer: for each .lr-card-grid, computes how many
     columns fit (based on min card width vs container width) and
     picks ceil(N / ceil(N / max)) — the balanced count, so rows
     differ by at most 1 card. Re-runs on resize.
*/
(function () {
  // 1) Inject a fixed-position background layer behind everything
  var bg = document.createElement('div');
  bg.className = 'lr-bg-layer';
  document.body.insertBefore(bg, document.body.firstChild);

  // 2) Cache scroll targets — only the hero copy parallaxes.
  // Nav is handled by native position: sticky; background is locked.
  var hero = document.querySelector('.hero-area .block');

  var ticking = false;
  function update() {
    var y = window.scrollY || window.pageYOffset;
    if (hero) hero.style.transform = 'translate3d(0,' + (y * 0.55) + 'px, 0)';
    ticking = false;
  }
  function onScroll() {
    if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', update);
  update();

  /* === Card grid balancer ============================================ */
  var MIN_CARD = 210;   // px — keep in sync with the comment in CSS
  var GAP      = 12;
  var MAX_PER_ROW = 3;  // never wider than 3 cards on a row
  function balance() {
    var grids = document.querySelectorAll('.lr-card-grid');
    for (var i = 0; i < grids.length; i++) {
      var g = grids[i];
      var n = parseInt(g.dataset.n, 10) || g.children.length;
      var w = g.clientWidth;
      var maxFit = Math.max(1, Math.floor((w + GAP) / (MIN_CARD + GAP)));
      var perRow = Math.min(maxFit, n, MAX_PER_ROW);
      var rows   = Math.ceil(n / perRow);
      var cols   = Math.ceil(n / rows);
      g.style.gridTemplateColumns = 'repeat(' + cols + ', 1fr)';
    }
  }
  var balanceTick = false;
  function onResize() {
    if (!balanceTick) {
      window.requestAnimationFrame(function () { balance(); balanceTick = false; });
      balanceTick = true;
    }
  }
  window.addEventListener('resize', onResize);
  if (document.readyState !== 'loading') balance();
  else document.addEventListener('DOMContentLoaded', balance);

  /* === Mobile menu auto-close ====================================== */
  /* Bootstrap 4 leaves the burger-menu open after a link is tapped.
     Close it whenever a nav link is clicked on a small screen. */
  function wireMobileMenuClose() {
    var menu = document.getElementById('navigation');
    if (!menu) return;
    var links = menu.querySelectorAll('a.nav-link');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function () {
        if (menu.classList.contains('show')) {
          if (window.jQuery) window.jQuery(menu).collapse('hide');
          else menu.classList.remove('show');
        }
      });
    }
  }
  if (document.readyState !== 'loading') wireMobileMenuClose();
  else document.addEventListener('DOMContentLoaded', wireMobileMenuClose);
})();
