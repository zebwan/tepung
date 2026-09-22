/* Tepung — interactions
   1. scroll reveals   2. marquee speed   3. menu filters   4. nav shadow on scroll */
(function () {
  'use strict';

  /* ---------- 1. reveal on scroll ---------------------------------------- */
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 0. smooth scroll ------------------------------------------
     Weighted but not floaty. Lenis ships with duration 1.2, which drifts;
     0.9 with an expo-out settle reads heavy while still stopping when you
     stop. Touch is left on native momentum — forcing Lenis there fights
     the OS and feels worse on a phone. */
  var lenis = null;
  if (!reduced && window.Lenis) {
    lenis = new Lenis({
      duration: 0.9,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      wheelMultiplier: 0.9,
      syncTouch: false,
      autoRaf: true
    });
    window.lenis = lenis;   /* handy for debugging in the console */
  }

  /* one scroll helper so anchors and the menu chips behave identically.
     `target` is an element or an absolute pixel offset. */
  function scrollToTarget(target, offset) {
    offset = offset || 0;
    if (lenis) { lenis.scrollTo(target, { offset: offset, duration: 1.1 }); return; }
    var top = (typeof target === 'number')
      ? target
      : target.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({ top: top + offset, behavior: reduced ? 'auto' : 'smooth' });
  }

  /* same-page anchors must route through Lenis, or they jump */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    if (!id) return;
    if (id !== 'top' && !document.getElementById(id)) return;
    e.preventDefault();
    var nav = document.querySelector('.nav');
    var pad = (id === 'top') ? 0 : -((nav ? nav.getBoundingClientRect().height : 0) + 30);
    scrollToTarget(id === 'top' ? 0 : document.getElementById(id), pad);
    if (history.replaceState) history.replaceState(null, '', '#' + id);
  });
  var pending = [];
  function sweepReveals() {
    if (!pending.length) return;
    var h = window.innerHeight;
    pending = pending.filter(function (el) {
      if (el.classList.contains('in')) return false;
      var r = el.getBoundingClientRect();
      if (r.top < h * 0.92 && r.bottom > 0) { el.classList.add('in'); return false; }
      return true;
    });
  }

  var canReveal = !reduced && ('IntersectionObserver' in window);
  /* Everything that starts hidden is scoped to .has-reveal, so if this script
     never runs the page still renders fully visible instead of blank. */
  if (canReveal) document.documentElement.classList.add('has-reveal');

  var targets = document.querySelectorAll('.rv, .rv-img');

  if (!canReveal) {
    Array.prototype.forEach.call(targets, function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var step = parseFloat(el.getAttribute('data-delay') || 0);
        el.style.transitionDelay = step + 'ms';
        el.classList.add('in');
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    Array.prototype.forEach.call(targets, function (el) { io.observe(el); });

    /* Backstop. Anything scoped to .has-reveal starts invisible, so if the
       observer never delivers — a suspended tab, a browser quirk — that
       content would be lost for good. sweepReveals() is cheap and also runs
       from the scroll handler, so the observer is an optimisation, not a
       single point of failure. */
    pending = Array.prototype.slice.call(targets);
    window.setTimeout(sweepReveals, 2500);

    /* stagger anything inside a [data-stagger] container */
    Array.prototype.forEach.call(document.querySelectorAll('[data-stagger]'), function (box) {
      var step = parseFloat(box.getAttribute('data-stagger')) || 70;
      Array.prototype.forEach.call(box.querySelectorAll('.rv, .rv-img'), function (el, i) {
        el.setAttribute('data-delay', i * step);
      });
    });
  }

  /* hero elements animate straight away, no scroll needed */
  window.requestAnimationFrame(function () {
    Array.prototype.forEach.call(document.querySelectorAll('[data-hero]'), function (el, i) {
      el.style.transitionDelay = (i * 90) + 'ms';
      el.classList.add('in');
    });
  });

  /* ---------- 2. marquee: constant 62px per second ----------------------- */
  function trackWidth(track) {
    /* scrollWidth is unreliable on mobile Chrome (it can report the rail
       width and never grow), so measure the children directly */
    var kids = track.children;
    if (!kids.length) return 0;
    var first = kids[0].getBoundingClientRect();
    var last = kids[kids.length - 1].getBoundingClientRect();
    return Math.max(last.right - first.left, track.offsetWidth);
  }

  function sizeTicker(ticker) {
    var track = ticker.querySelector('.ticker__track');
    if (!track) return;
    /* duplicate the run until it comfortably overflows, then clone once more
       so translateX(-100%) on the first track loops seamlessly.
       HARD CAP: never let a measure-based loop run unbounded — a frozen
       width measurement here will append nodes until the tab dies. */
    if (!track.dataset.cloned) {
      var run = track.innerHTML;
      var need = ticker.offsetWidth * 2;
      for (var i = 0; i < 6 && trackWidth(track) < need; i++) track.innerHTML += run;
      var twin = track.cloneNode(true);
      twin.setAttribute('aria-hidden', 'true');
      ticker.appendChild(twin);
      track.dataset.cloned = '1';
      twin.dataset.cloned = '1';
    }
    var dur = Math.max(trackWidth(track) / 62, 8);
    Array.prototype.forEach.call(ticker.querySelectorAll('.ticker__track'), function (t) {
      t.style.animationDuration = dur + 's';
    });
  }
  Array.prototype.forEach.call(document.querySelectorAll('.ticker'), sizeTicker);

  /* ---------- 3. menu page category filter ------------------------------- */
  var chips = document.querySelectorAll('.chip[data-target]');
  if (chips.length) {
    var groups = document.querySelectorAll('.menu-group');
    var lock = 0;          /* ignore the spy while a click-scroll is in flight */

    function setActive(id) {
      Array.prototype.forEach.call(chips, function (c) {
        c.classList.toggle('on', c.getAttribute('data-target') === id);
      });
    }

    Array.prototype.forEach.call(chips, function (chip) {
      chip.addEventListener('click', function () {
        var id = chip.getAttribute('data-target');
        var el = document.getElementById(id);
        if (!el) return;
        setActive(id);
        lock = Date.now() + 1000;
        var bar = document.querySelector('.filters');
        var offset = (bar ? bar.getBoundingClientRect().bottom : 0) + 14;
        scrollToTarget(el, -offset);
      });
    });

    /* highlight whichever group is currently under the sticky bar */
    if ('IntersectionObserver' in window) {
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && Date.now() > lock) setActive(e.target.id);
        });
      }, { rootMargin: '-25% 0px -70% 0px' });
      Array.prototype.forEach.call(groups, function (g) { spy.observe(g); });
    }
  }

  /* ---------- 4. display headlines rise out of a line mask --------------- */
  function splitLines(h) {
    if (h.dataset.split) return;
    var groups = [[]];
    Array.prototype.slice.call(h.childNodes).forEach(function (n) {
      if (n.nodeName === 'BR') { groups.push([]); return; }
      if (n.nodeType === 1 && n.classList && n.classList.contains('script')) {
        groups.push([n]); groups.push([]); return;
      }
      groups[groups.length - 1].push(n);
    });

    var frag = document.createDocumentFragment(), i = 0;
    groups.forEach(function (g) {
      var real = g.some(function (n) {
        return n.nodeType === 1 || (n.textContent && n.textContent.trim());
      });
      if (!real) return;
      var isScript = g.length === 1 && g[0].nodeType === 1 &&
                     g[0].classList && g[0].classList.contains('script');
      var outer = document.createElement('span');
      outer.className = 'ln' + (isScript ? ' ln--script' : '');
      var inner = document.createElement('span');
      inner.className = 'ln__i';
      inner.style.transitionDelay = (i * 95) + 'ms';
      g.forEach(function (n) { inner.appendChild(n); });
      outer.appendChild(inner);
      frag.appendChild(outer);
      i++;
    });
    while (h.firstChild) h.removeChild(h.firstChild);
    h.appendChild(frag);
    h.dataset.split = '1';
    h.classList.add('is-split');
  }

  if (!reduced) {
    Array.prototype.forEach.call(
      document.querySelectorAll('h1.display, h2.display, .menu-hero .display'),
      splitLines
    );
  }

  /* ---------- 5. hero parallax ------------------------------------------
     On its own wrapper so it never fights the image's reveal transition.
     Desktop pointers only — parallax on touch is jank for no payoff. */
  var band = document.querySelector('.hero__band');
  var par = null;
  if (band && !reduced &&
      window.matchMedia('(min-width: 900px) and (hover: hover)').matches) {
    var img = band.querySelector('img');
    if (img) {
      par = document.createElement('span');
      par.style.cssText = 'display:block;width:100%;height:100%;will-change:transform';
      img.parentNode.insertBefore(par, img);
      par.appendChild(img);
    }
  }

  /* ---------- 6. one scroll listener drives the rest --------------------- */
  var nav = document.querySelector('.nav');
  var tracks = document.querySelectorAll('.ticker__track');
  var lean = 0;

  function onScroll(y, velocity) {
    if (nav) {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      nav.style.setProperty('--progress', max > 0 ? (y / max).toFixed(4) : 0);
      nav.classList.toggle('is-stuck', y > 40);
    }
    if (par && band) {
      var p = Math.min(Math.max(y / band.offsetHeight, 0), 1);
      par.style.transform = 'translate3d(0,' + (p * 6).toFixed(2) + '%,0)';
    }
    if (pending.length) sweepReveals();
    if (tracks.length) {
      var target = Math.max(-1.1, Math.min(1.1, (velocity || 0) / 26));
      lean += (target - lean) * 0.18;
      if (Math.abs(lean) < 0.005) lean = 0;
      for (var i = 0; i < tracks.length; i++) {
        tracks[i].style.setProperty('--lean', lean.toFixed(3) + 'deg');
      }
    }
  }

  if (lenis) {
    lenis.on('scroll', function (e) { onScroll(e.scroll, e.velocity); });
  } else {
    window.addEventListener('scroll', function () {
      onScroll(window.pageYOffset, 0);
    }, { passive: true });
  }
  onScroll(window.pageYOffset || 0, 0);

})();
