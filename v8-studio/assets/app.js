/* V8 Studio — comportamento compartilhado
   Cabeçalho e rodapé injetados, abertura do logo, marquee, carrossel,
   acordeão, passos, contadores e menu mobile. Sem dependências. */
(function () {
  "use strict";
  var ROOT = (document.currentScript && document.currentScript.dataset.root) || "";
  document.documentElement.classList.add("js");

  /* ---------- Logo V8 (marca oficial, vetorizada da prancha de identidade) ----------
     V com o braço direito seccionado por um corte diagonal e 8 octogonal com
     contadores retangulares. Um único <path> com fill-rule evenodd; a ordem dos
     subcaminhos é a ordem do desenho na abertura: o V nasce no vértice e sobe. */
  var LOGO_PATH = "M93 186 L125 186 L171 94 L149 56 L109 133 L43 0 L0 0 Z " +
    "M161 0 L119 0 L96 46 L117 90 Z " +
    "M171 112 L171 164 L192 186 L288 186 L308 164 L308 112 L286 93 L308 74 L308 22 L287 0 L192 0 L171 22 L171 74 L193 93 Z " +
    "M208 111 L270 111 L270 151 L208 151 Z M208 35 L270 35 L270 75 L208 75 Z";
  var LOGO_VB = "0 0 308 186";
  function logoSvg(cls, ids) {
    return '<svg class="' + (cls || "") + '" viewBox="' + LOGO_VB + '" fill="currentColor" fill-rule="evenodd" aria-hidden="true">' +
      '<path ' + (ids ? 'id="' + ids + '-main" ' : "") + 'd="' + LOGO_PATH + '"/></svg>';
  }
  window.V8 = { logoSvg: logoSvg, LOGO_PATH: LOGO_PATH, LOGO_VB: LOGO_VB };
  (function fonts() {
    var l = document.createElement("link"); l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&display=swap";
    document.head.appendChild(l);
  })();

  var ICON_CHEV = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6l5 5 5-5"/></svg>';
  var ICON_ARROW = '<svg class="arrow" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10h13M11 5l5 5-5 5"/></svg>';
  var ICON_PLUS = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M8 2v12M2 8h12"/></svg>';
  var ICON_MENU = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
  var ICON_CLOSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  window.V8.icons = { chevron: ICON_CHEV, arrow: ICON_ARROW, plus: ICON_PLUS };

  var SERVICES = [
    ["Sites", "servicos/sites.html"],
    ["Landing pages", "servicos/landing-pages.html"],
    ["Lojas virtuais", "servicos/lojas-virtuais.html"],
    ["Sistemas", "servicos/sistemas.html"],
    ["Aplicativos", "servicos/aplicativos.html"]
  ];

  /* ---------- Cabeçalho ---------- */
  function header() {
    var mount = document.querySelector("[data-header]");
    if (!mount) return;
    var sub = SERVICES.map(function (s) { return '<a href="' + ROOT + s[1] + '">' + s[0] + "</a>"; }).join("");
    mount.outerHTML =
      '<header class="site-header"><div class="container">' +
        '<a class="logo" href="' + ROOT + 'index.html" aria-label="V8 Studio, início">' + logoSvg("", null) + "<span>Studio</span></a>" +
        '<nav class="nav" aria-label="Principal">' +
          '<div class="nav__item"><a class="nav__link" href="' + ROOT + 'servicos/sites.html" aria-haspopup="true">Serviços ' + ICON_CHEV + '</a><div class="submenu">' + sub + "</div></div>" +
          '<a class="nav__link" href="' + ROOT + 'blog/index.html">Blog</a>' +
          '<a class="nav__link" href="' + ROOT + 'sobre.html">Sobre</a>' +
        "</nav>" +
        '<div class="header-cta"><a class="btn btn--primary btn--sm" href="' + ROOT + 'comecar.html">Começar</a>' +
          '<button class="menu-toggle" aria-label="Abrir menu" aria-expanded="false">' + ICON_MENU + "</button></div>" +
      "</div></header>" +
      '<div class="mobile-nav" hidden>' +
        '<a href="' + ROOT + 'servicos/sites.html">Serviços</a><div class="sub">' + sub + "</div>" +
        '<a href="' + ROOT + 'blog/index.html">Blog</a><a href="' + ROOT + 'sobre.html">Sobre</a>' +
        '<a class="btn btn--primary" href="' + ROOT + 'comecar.html">Começar</a></div>';

    var hd = document.querySelector(".site-header");
    var toggle = hd.querySelector(".menu-toggle");
    var mob = document.querySelector(".mobile-nav");
    toggle.addEventListener("click", function () {
      var open = !mob.classList.contains("is-open");
      mob.hidden = !open; mob.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
      toggle.innerHTML = open ? ICON_CLOSE : ICON_MENU;
      document.body.style.overflow = open ? "hidden" : "";
    });
    var onScroll = function () { hd.classList.toggle("is-scrolled", window.scrollY > 8); };
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  }

  /* ---------- Rodapé ---------- */
  function footer() {
    var mount = document.querySelector("[data-footer]");
    if (!mount) return;
    var svc = SERVICES.map(function (s) { return '<li><a href="' + ROOT + s[1] + '">' + s[0] + "</a></li>"; }).join("");
    mount.outerHTML =
      '<footer class="site-footer"><div class="container">' +
        '<div class="cols">' +
          '<div><a class="logo" href="' + ROOT + 'index.html" aria-label="V8 Studio">' + logoSvg("", null) + '<span>Studio</span></a>' +
            '<p class="muted small" style="margin-top:16px;max-width:30ch">Sites, landing pages, lojas virtuais, sistemas e aplicativos para empresas que precisam de clientes.</p></div>' +
          '<div><h4>Serviços</h4><ul>' + svc + "</ul></div>" +
          '<div><h4>Empresa</h4><ul><li><a href="' + ROOT + 'sobre.html">Sobre</a></li><li><a href="' + ROOT + 'comecar.html">Começar</a></li><li><a href="' + ROOT + 'blog/index.html">Blog</a></li></ul></div>' +
          '<div><h4>Blog</h4><ul><li><a href="' + ROOT + 'blog/artigo.html">Quanto custa um site em 2026</a></li><li><a href="' + ROOT + 'blog/index.html">Landing page ou site completo?</a></li><li><a href="' + ROOT + 'blog/index.html">Por que seu site não aparece no Google</a></li></ul></div>' +
        "</div>" +
        '<div class="base"><span>© 2026 V8 Studio</span><span><a href="' + ROOT + 'privacidade.html">Política de privacidade</a></span></div>' +
      "</div></footer>";
  }

  /* ---------- Marquee: duplica os itens para o loop infinito ---------- */
  function marquees() {
    document.querySelectorAll(".marquee__track").forEach(function (t) {
      t.innerHTML += t.innerHTML;
      t.querySelectorAll("[aria-hidden]").forEach(function () {});
      var items = t.children, half = items.length / 2;
      for (var i = half; i < items.length; i++) items[i].setAttribute("aria-hidden", "true");
    });
  }

  /* ---------- Carrossel ---------- */
  function carousels() {
    document.querySelectorAll(".carousel").forEach(function (c) {
      var track = c.querySelector(".carousel__track");
      c.querySelectorAll("[data-dir]").forEach(function (b) {
        b.addEventListener("click", function () {
          var w = track.firstElementChild ? track.firstElementChild.getBoundingClientRect().width + 24 : 360;
          track.scrollBy({ left: w * (b.dataset.dir === "next" ? 1 : -1), behavior: "smooth" });
        });
      });
    });
  }

  /* ---------- Acordeão ---------- */
  function accordions() {
    document.querySelectorAll(".accordion").forEach(function (acc) {
      acc.querySelectorAll(".accordion__item").forEach(function (item, i) {
        var btn = item.querySelector(".accordion__btn");
        var panel = item.querySelector(".accordion__panel");
        if (!btn || !panel) return;
        if (!btn.querySelector(".accordion__icon")) btn.insertAdjacentHTML("beforeend", '<span class="accordion__icon">' + ICON_PLUS + "</span>");
        var id = "acc-" + Math.random().toString(36).slice(2, 7) + "-" + i;
        panel.id = id; btn.setAttribute("aria-controls", id);
        btn.setAttribute("aria-expanded", item.classList.contains("is-open") ? "true" : "false");
        btn.addEventListener("click", function () {
          var open = !item.classList.contains("is-open");
          if (acc.dataset.single !== "false") acc.querySelectorAll(".accordion__item.is-open").forEach(function (o) { o.classList.remove("is-open"); o.querySelector(".accordion__btn").setAttribute("aria-expanded", "false"); });
          item.classList.toggle("is-open", open); btn.setAttribute("aria-expanded", String(open));
        });
      });
    });
  }

  /* ---------- Revelação, passos e contadores ---------- */
  function observers() {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal, .steps").forEach(function (e) { e.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("is-in");
        en.target.querySelectorAll("[data-count]").forEach(countUp);
        if (en.target.hasAttribute("data-count")) countUp(en.target);
        io.unobserve(en.target);
      });
    }, { threshold: 0.18 });
    document.querySelectorAll(".reveal, .steps, [data-count]").forEach(function (e) { io.observe(e); });
  }
  function countUp(el) {
    if (el.dataset.done) return; el.dataset.done = "1";
    var target = parseFloat(el.dataset.count), suffix = el.dataset.suffix || "", prefix = el.dataset.prefix || "";
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { el.textContent = prefix + target + suffix; return; }
    var start = null, dur = 1400;
    function tick(t) {
      if (!start) start = t;
      var p = Math.min(1, (t - start) / dur); p = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * p) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- Abertura do logo ----------
     Roda uma vez por sessão, 2,5 s. Keyframes em pranchas/keyframes.html. */
  function intro() {
    if (!document.body.hasAttribute("data-intro")) return;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var seen = false;
    try { seen = sessionStorage.getItem("v8-intro") === "1"; } catch (e) {}
    if (reduce || seen) return;
    try { sessionStorage.setItem("v8-intro", "1"); } catch (e) {}

    document.body.classList.add("intro-running");
    var el = document.createElement("div");
    el.className = "intro"; el.setAttribute("aria-hidden", "true");
    el.innerHTML = '<div class="intro__stage">' + logoSvg("intro__logo", "intro") + '<span class="intro__word">Studio</span></div>' +
      '<button class="intro__skip" type="button">Pular</button>';
    document.body.appendChild(el);

    var stage = el.querySelector(".intro__stage"), svg = el.querySelector("svg"), word = el.querySelector(".intro__word");
    var main = el.querySelector("#intro-main");
    var lenM = main.getTotalLength();
    main.style.strokeDasharray = lenM; main.style.strokeDashoffset = lenM;
    main.style.fill = "currentColor"; main.style.fillOpacity = "0";
    main.style.stroke = "currentColor"; main.style.strokeWidth = "3"; main.style.strokeLinejoin = "round";

    var T_DRAW = 1450, T_ZOOM = 1950, T_DOCK = 2500, Z = 2.6;
    var cam = { x: 0, y: 0 }, started = null, done = false, raf = 0;
    stage.style.transformOrigin = "0 0";

    function ease(p) { return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; }
    function easeOut(p) { return 1 - Math.pow(1 - p, 3); }
    function tipPage(progress) {
      var pt = main.getPointAtLength(progress * lenM);
      var m = svg.getScreenCTM();
      return { x: m.a * pt.x + m.c * pt.y + m.e, y: m.b * pt.x + m.d * pt.y + m.f };
    }
    function placeWord() {
      var r = svg.getBoundingClientRect();
      word.style.left = (r.left) + "px"; word.style.top = (r.bottom + 14) + "px"; word.style.width = r.width + "px";
    }
    placeWord();
    var cx = window.innerWidth / 2, cy = window.innerHeight / 2;

    function frame(now) {
      if (done) return;
      if (!started) started = now;
      var t = now - started;
      if (t < T_DRAW) {
        var p = ease(t / T_DRAW);
        main.style.strokeDashoffset = lenM * (1 - p);
        var tip = tipPage(p);
        var k = t < 120 ? 1 : 0.14;
        cam.x += (tip.x - cam.x) * k; cam.y += (tip.y - cam.y) * k;
        var zin = Math.min(1, t / 240);
        var z = 1 + (Z - 1) * zin;
        stage.style.transform = "translate(" + (cx - z * cam.x) + "px," + (cy - z * cam.y) + "px) scale(" + z + ")";
      } else if (t < T_ZOOM) {
        main.style.strokeDashoffset = 0;
        var q = easeOut((t - T_DRAW) / (T_ZOOM - T_DRAW));
        main.style.fillOpacity = Math.min(1, q * 1.6); main.style.strokeOpacity = 1 - Math.min(1, q * 1.6);
        var z2 = Z + (1 - Z) * q;
        var tx = (cx - Z * cam.x) * (1 - q), ty = (cy - Z * cam.y) * (1 - q);
        stage.style.transform = "translate(" + tx + "px," + ty + "px) scale(" + z2 + ")";
        word.style.opacity = Math.max(0, (q - 0.45) / 0.55);
      } else if (t < T_DOCK) {
        var d = easeOut((t - T_ZOOM) / (T_DOCK - T_ZOOM));
        if (!document.body.classList.contains("intro-reveal")) document.body.classList.add("intro-reveal");
        var target = document.querySelector(".site-header .logo svg");
        var from = svg.getBoundingClientRect();
        var s = 1, dx = 0, dy = 0;
        if (target) {
          var to = target.getBoundingClientRect();
          s = to.height / from.height;
          dx = to.left - from.left; dy = to.top - from.top;
        } else { s = 0.12; dy = -from.top + 24; dx = -from.left + 24; }
        var sc = 1 + (s - 1) * d;
        stage.style.transformOrigin = from.left + "px " + from.top + "px";
        stage.style.transform = "translate(" + dx * d + "px," + dy * d + "px) scale(" + sc + ")";
        word.style.opacity = 1 - Math.min(1, d * 2);
        el.style.background = "rgba(255,255,255," + (1 - d) + ")";
      } else { finish(); return; }
      raf = requestAnimationFrame(frame);
    }
    function finish() {
      if (done) return; done = true;
      cancelAnimationFrame(raf);
      el.classList.add("is-done");
      document.body.classList.remove("intro-running");
      document.body.classList.add("intro-reveal");
      setTimeout(function () { el.remove(); }, 50);
    }
    el.querySelector(".intro__skip").addEventListener("click", finish);
    raf = requestAnimationFrame(frame);
  }

  /* ---------- Submenu por teclado ---------- */
  function submenuKeys() {
    document.querySelectorAll(".nav__item").forEach(function (it) {
      var link = it.querySelector(".nav__link");
      link.addEventListener("keydown", function (e) {
        if (e.key === "ArrowDown" || e.key === " ") { e.preventDefault(); it.classList.add("is-open"); var f = it.querySelector(".submenu a"); if (f) f.focus(); }
      });
      it.addEventListener("keydown", function (e) { if (e.key === "Escape") { it.classList.remove("is-open"); link.focus(); } });
      it.addEventListener("focusout", function () { setTimeout(function () { if (!it.contains(document.activeElement)) it.classList.remove("is-open"); }, 0); });
    });
  }

  function init() {
    header(); footer(); marquees(); carousels(); accordions(); observers(); submenuKeys(); intro();
    document.querySelectorAll("[data-arrow]").forEach(function (e) { e.innerHTML = ICON_ARROW; });
    document.querySelectorAll("form[data-demo]").forEach(function (f) { f.addEventListener("submit", function (e) { e.preventDefault(); }); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
