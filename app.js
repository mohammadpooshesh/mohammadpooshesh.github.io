/* Mohammad Pooshesh — personal site scripts */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ============ inline icon set (feather-style) ============ */
  var EYE_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
  function iconSvg(paths, color) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths + "</svg>";
  }

  /* ============ hero: flowing contour lines ============ */
  var topo = document.getElementById("topo");
  if (topo) {
    var tctx = topo.getContext("2d");
    var tw = 0, th = 0;
    function resizeTopo() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      tw = topo.clientWidth; th = topo.clientHeight;
      topo.width = tw * dpr; topo.height = th * dpr;
      tctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resizeTopo();
    window.addEventListener("resize", resizeTopo);

    var T = 0;
    function drawTopo() {
      tctx.clearRect(0, 0, tw, th);
      // graticule
      tctx.strokeStyle = "rgba(255,255,255,0.035)";
      tctx.lineWidth = 1;
      for (var gx = 0; gx < tw; gx += 80) {
        tctx.beginPath(); tctx.moveTo(gx, 0); tctx.lineTo(gx, th); tctx.stroke();
      }
      for (var gy = 0; gy < th; gy += 80) {
        tctx.beginPath(); tctx.moveTo(0, gy); tctx.lineTo(tw, gy); tctx.stroke();
      }
      // flowing contour lines
      var lines = 14;
      for (var i = 0; i < lines; i++) {
        var base = (th / (lines + 1)) * (i + 1);
        var alpha = 0.05 + 0.10 * Math.abs(Math.sin(i * 1.7 + 2));
        tctx.strokeStyle = "rgba(94,159,232," + alpha.toFixed(3) + ")";
        tctx.lineWidth = i % 4 === 0 ? 1.5 : 1;
        tctx.beginPath();
        for (var x = -10; x <= tw + 10; x += 6) {
          var y = base
            + 26 * Math.sin(x * 0.006 + T * 0.4 + i * 0.9)
            + 14 * Math.sin(x * 0.013 - T * 0.25 + i * 2.1)
            + 7 * Math.sin(x * 0.027 + T * 0.6 + i * 0.4);
          if (x === -10) tctx.moveTo(x, y); else tctx.lineTo(x, y);
        }
        tctx.stroke();
      }
      T += 0.012;
      if (!reduceMotion) requestAnimationFrame(drawTopo);
    }
    drawTopo();
  }

  /* ============ hero: typed subtitle ============ */
  var phrases = [
    "AI Engineer \u2014 GeoAI",
    "RAG \u00b7 Knowledge Graphs \u00b7 MCP",
    "Building AI that understands maps",
    "GeoLab \u00b7 GeoForge \u00b7 GeoExplain \u2014 GIS in the browser",
    "PostGIS is my happy place"
  ];
  var typedEl = document.getElementById("typed");
  if (typedEl && !reduceMotion) {
    var pi = 0, ci = 0, deleting = false;
    typedEl.textContent = "";
    (function tick() {
      var p = phrases[pi];
      if (!deleting) {
        ci++;
        typedEl.textContent = p.slice(0, ci);
        if (ci === p.length) { deleting = true; setTimeout(tick, 2100); return; }
        setTimeout(tick, 55);
      } else {
        ci--;
        typedEl.textContent = p.slice(0, ci);
        if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(tick, 350); return; }
        setTimeout(tick, 28);
      }
    })();
  }

  /* ============ hero: status bar clock + LLM throughput ============ */
  var clock = document.getElementById("clock");
  function tickClock() {
    if (!clock) return;
    var now = new Date();
    clock.textContent = "UTC " + now.toISOString().slice(11, 19);
  }
  tickClock();
  setInterval(tickClock, 1000);

  var tps = document.getElementById("tps");
  if (tps) {
    function tickTps() {
      tps.textContent = "LLM: " + (36 + Math.floor(Math.random() * 28)) + " tok/s";
    }
    tickTps();
    setInterval(tickTps, 1600);
  }

  /* ============ skill layers ============ */
  var LAYERS = [
    { name: "L0 \u00b7 GeoAI", color: "#5e9fe8", tags: ["RAG", "Knowledge Graphs", "MCP", "Agent Tools"] },
    { name: "L1 \u00b7 Geospatial", color: "#72bc8f", tags: ["PostGIS", "GeoServer", "Map Tiles", "MBTiles"] },
    { name: "L2 \u00b7 Backend", color: "#eac26b", tags: ["Python", "Django", "Clean Architecture"] },
    { name: "L3 \u00b7 Data", color: "#4fb9c9", tags: ["PostgreSQL", "MongoDB", "Redis"] },
    { name: "L4 \u00b7 Vision", color: "#bf8eda", tags: ["OpenCV", "YOLO", "Raspberry Pi"] },
    { name: "L5 \u00b7 Ops", color: "#de9255", tags: ["Docker", "Linux", "Nginx", "Git"] },
    { name: "L6 \u00b7 Frontend", color: "#df84a8", tags: ["HTML", "CSS", "JavaScript", "Django Templates"] }
  ];
  var layersEl = document.getElementById("layers");
  if (layersEl) {
    LAYERS.forEach(function (l) {
      var li = document.createElement("li");
      li.className = "layer reveal";
      var btn = document.createElement("button");
      btn.className = "eye";
      btn.innerHTML = EYE_SVG;
      btn.setAttribute("aria-label", "Toggle layer " + l.name);
      btn.addEventListener("click", function () { li.classList.toggle("off"); });
      var sw = document.createElement("span");
      sw.className = "swatch";
      sw.style.background = l.color;
      var nm = document.createElement("span");
      nm.className = "lname";
      nm.textContent = l.name;
      var tags = document.createElement("span");
      tags.className = "tags";
      l.tags.forEach(function (t) {
        var s = document.createElement("span");
        s.className = "tag";
        s.textContent = t;
        tags.appendChild(s);
      });
      li.appendChild(btn); li.appendChild(sw); li.appendChild(nm); li.appendChild(tags);
      layersEl.appendChild(li);
    });
  }

  /* ============ knowledge graph ============ */
  var kg = document.getElementById("kg");
  if (kg) {
    var ctx = kg.getContext("2d");
    var W = 0, H = 0;
    var nodes = [], links = [];

    var GROUPS = {
      core: "#ffffff",
      ai: "#5e9fe8",
      geo: "#72bc8f",
      be: "#eac26b",
      cv: "#bf8eda",
      data: "#4fb9c9",
      ops: "#de9255"
    };

    function N(id, label, group, r) { return { id: id, label: label, group: group, r: r, x: 0, y: 0, vx: 0, vy: 0 }; }
    var defs = [
      N("m", "Mohammad", "core", 26),
      N("ai", "GeoAI", "ai", 16), N("geo", "Geospatial", "geo", 16), N("be", "Backend", "be", 16),
      N("cv", "Vision", "cv", 16), N("data", "Data", "data", 16), N("ops", "Ops", "ops", 16),
      N("rag", "RAG", "ai", 10), N("kgs", "Knowledge Graphs", "ai", 10), N("mcp", "MCP", "ai", 10), N("tools", "Agent Tools", "ai", 10),
      N("postgis", "PostGIS", "geo", 10), N("geoserver", "GeoServer", "geo", 10), N("tiles", "Map Tiles", "geo", 10),
      N("geolab", "GeoLab", "geo", 12), N("geoforge", "GeoForge", "geo", 12), N("geoexplain", "GeoExplain", "geo", 12),
      N("py", "Python", "be", 10), N("dj", "Django", "be", 10), N("ca", "Clean Arch", "be", 10),
      N("cvx", "OpenCV", "cv", 10), N("yolo", "YOLO", "cv", 10), N("rpi", "Raspberry Pi", "cv", 10),
      N("pg", "PostgreSQL", "data", 10), N("mongo", "MongoDB", "data", 10), N("redis", "Redis", "data", 10),
      N("docker", "Docker", "ops", 10), N("linux", "Linux", "ops", 10), N("nginx", "Nginx", "ops", 10), N("git", "Git", "ops", 10)
    ];
    var edges = [
      ["m", "ai"], ["m", "geo"], ["m", "be"], ["m", "cv"], ["m", "data"], ["m", "ops"],
      ["ai", "rag"], ["ai", "kgs"], ["ai", "mcp"], ["ai", "tools"],
      ["geo", "postgis"], ["geo", "geoserver"], ["geo", "tiles"],
      ["geo", "geolab"], ["geo", "geoforge"], ["geolab", "geoforge"],
      ["geo", "geoexplain"], ["geoexplain", "postgis"],
      ["be", "py"], ["be", "dj"], ["be", "ca"],
      ["cv", "cvx"], ["cv", "yolo"], ["cv", "rpi"],
      ["data", "pg"], ["data", "mongo"], ["data", "redis"],
      ["ops", "docker"], ["ops", "linux"], ["ops", "nginx"], ["ops", "git"],
      ["postgis", "pg"], ["kgs", "rag"], ["mcp", "tools"], ["dj", "py"]
    ];

    var byId = {};
    function resizeKg() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = kg.clientWidth; H = kg.clientHeight;
      kg.width = W * dpr; kg.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function initKg() {
      resizeKg();
      nodes = defs.map(function (d) {
        var n = Object.assign({}, d);
        n.x = W / 2 + (Math.random() - 0.5) * W * 0.6;
        n.y = H / 2 + (Math.random() - 0.5) * H * 0.6;
        byId[n.id] = n;
        return n;
      });
      byId.m.x = W / 2; byId.m.y = H / 2;
      links = edges.map(function (e) { return { a: byId[e[0]], b: byId[e[1]] }; });
    }
    initKg();
    window.addEventListener("resize", function () { resizeKg(); });

    var dragging = null, hover = null;
    function pointer(ev) {
      var rect = kg.getBoundingClientRect();
      var p = ev.touches ? ev.touches[0] : ev;
      return { x: p.clientX - rect.left, y: p.clientY - rect.top };
    }
    function pick(pos) {
      for (var i = nodes.length - 1; i >= 0; i--) {
        var n = nodes[i];
        var dx = n.x - pos.x, dy = n.y - pos.y;
        if (dx * dx + dy * dy < (n.r + 6) * (n.r + 6)) return n;
      }
      return null;
    }
    kg.addEventListener("pointerdown", function (ev) {
      var n = pick(pointer(ev));
      if (n) { dragging = n; kg.setPointerCapture(ev.pointerId); kg.style.cursor = "grabbing"; }
    });
    kg.addEventListener("pointermove", function (ev) {
      var pos = pointer(ev);
      if (dragging) { dragging.x = pos.x; dragging.y = pos.y; dragging.vx = 0; dragging.vy = 0; }
      else { hover = pick(pos); kg.style.cursor = hover ? "pointer" : "grab"; }
    });
    kg.addEventListener("pointerup", function () { dragging = null; kg.style.cursor = "grab"; });

    function stepPhysics() {
      var i, j, n, o;
      // repulsion
      for (i = 0; i < nodes.length; i++) {
        for (j = i + 1; j < nodes.length; j++) {
          n = nodes[i]; o = nodes[j];
          var dx = o.x - n.x, dy = o.y - n.y;
          var d2 = dx * dx + dy * dy + 0.01;
          if (d2 > 90000) continue;
          var d = Math.sqrt(d2);
          var f = 1400 / d2;
          var fx = (dx / d) * f, fy = (dy / d) * f;
          n.vx -= fx; n.vy -= fy; o.vx += fx; o.vy += fy;
        }
      }
      // springs
      links.forEach(function (l) {
        var dx = l.b.x - l.a.x, dy = l.b.y - l.a.y;
        var d = Math.sqrt(dx * dx + dy * dy) + 0.01;
        var rest = (l.a.r + l.b.r) * 2.4 + 40;
        var f = (d - rest) * 0.004;
        var fx = (dx / d) * f, fy = (dy / d) * f;
        l.a.vx += fx; l.a.vy += fy; l.b.vx -= fx; l.b.vy -= fy;
      });
      // center gravity + integrate
      nodes.forEach(function (nd) {
        nd.vx += (W / 2 - nd.x) * 0.0008;
        nd.vy += (H / 2 - nd.y) * 0.0012;
        nd.vx *= 0.9; nd.vy *= 0.9;
        if (nd !== dragging) { nd.x += nd.vx; nd.y += nd.vy; }
        var m = nd.r + 8;
        nd.x = Math.max(m + 30, Math.min(W - m - 30, nd.x));
        nd.y = Math.max(m, Math.min(H - m - 26, nd.y));
      });
    }

    function drawKg() {
      ctx.clearRect(0, 0, W, H);
      // edges
      links.forEach(function (l) {
        var hot = hover && (l.a === hover || l.b === hover);
        ctx.strokeStyle = hot ? "rgba(94,159,232,0.75)" : "rgba(255,255,255,0.13)";
        ctx.lineWidth = hot ? 1.6 : 1;
        ctx.beginPath();
        ctx.moveTo(l.a.x, l.a.y);
        ctx.lineTo(l.b.x, l.b.y);
        ctx.stroke();
      });
      // nodes
      nodes.forEach(function (n) {
        var col = GROUPS[n.group];
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.group === "core" ? "#16233a" : "rgba(16,26,42,0.95)";
        ctx.fill();
        ctx.lineWidth = n === hover ? 2.4 : 1.6;
        ctx.strokeStyle = col;
        ctx.stroke();
        // label
        ctx.font = (n.group === "core" ? "600 13px " : n.r > 12 ? "600 12px " : "11px ") + "Menlo, Consolas, monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = n.group === "core" ? "#ffffff" : "rgba(237,242,247,0.88)";
        if (n.r > 12) {
          ctx.fillText(n.label, n.x, n.y + 4);
        } else {
          ctx.fillText(n.label, n.x, n.y + n.r + 15);
        }
      });
    }

    (function loopKg() {
      stepPhysics();
      drawKg();
      if (!reduceMotion) requestAnimationFrame(loopKg);
      else { for (var k = 0; k < 300; k++) stepPhysics(); drawKg(); }
    })();
  }

  /* ============ projects ============ */
  var PROJECTS = [
    {
      name: "GeoLab", repo: "mohammadpooshesh/GeoLab", featured: true,
      icon: iconSvg('<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.27 6.96L12 12.01l8.73-5.05"/><path d="M12 22.08V12"/>', "#5e9fe8"),
      desc: "Interactive GIS geometry laboratory \u2014 what regex101 is for regex. Draw on a real map, drag a slider, and watch ~30 geometry operations recompute and animate live, with ready-to-copy Turf.js, Shapely & PostGIS code.",
      tags: ["React", "TypeScript", "MapLibre", "Turf.js", "Web Worker"]
    },
    {
      name: "GeoForge", repo: "mohammadpooshesh/GeoForge", featured: true,
      icon: iconSvg('<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>', "#4fb9c9"),
      desc: "The VS Code for GeoJSON \u2014 a browser IDE where a Monaco editor, MapLibre map and feature explorer stay in real-time bidirectional sync. 20+ geometry tools, live validation, smooth at 50,000+ features.",
      tags: ["React", "TypeScript", "Monaco", "MapLibre", "Turf.js"]
    },
    {
      name: "GeoExplain", repo: "mohammadpooshesh/GeoExplain", featured: true,
      icon: iconSvg('<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>', "#bf8eda"),
      desc: "Understand spatial SQL visually \u2014 regex101 for PostGIS. Draw a geometry, pick ST_Buffer, and watch a step-by-step animation of what it does, with live code in PostGIS, Turf.js, Shapely & GDAL.",
      tags: ["React", "TypeScript", "SVG", "PostGIS", "Zero-deps"]
    },
    {
      name: "karnama", repo: "mohammadpooshesh/karnama",
      icon: iconSvg('<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>', "#5e9fe8"),
      desc: "Time tracker \u2014 cross-platform desktop app built with Flutter.",
      tags: ["Flutter", "Desktop"]
    },
    {
      name: "map-tile-downloader", repo: "mohammadpooshesh/map-tile-downloader",
      icon: iconSvg('<path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z"/><path d="M8 2v16"/><path d="M16 6v16"/>', "#72bc8f"),
      desc: "Docker image for downloading map tiles in PNG & MBTiles formats.",
      tags: ["Docker", "GIS", "MBTiles"]
    },
    {
      name: "DomainHunter", repo: "mohammadpooshesh/DomainHunter",
      icon: iconSvg('<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>', "#bf8eda"),
      desc: "Professional Domain OSINT framework \u2014 collects publicly available intelligence about a domain.",
      tags: ["Python", "OSINT", "Security"]
    }
  ];
  var cardsEl = document.getElementById("cards");
  if (cardsEl) {
    PROJECTS.forEach(function (p) {
      var a = document.createElement("a");
      a.className = "card reveal" + (p.featured ? " featured" : "");
      a.href = "https://github.com/" + p.repo;
      a.target = "_blank";
      a.rel = "noopener";
      var pinRow = document.createElement("div");
      pinRow.className = "pin-row";
      var pin = document.createElement("span");
      pin.className = "pin";
      pin.innerHTML = p.icon;
      pinRow.appendChild(pin);
      if (p.featured) {
        var flag = document.createElement("span");
        flag.className = "flag";
        flag.textContent = "FEATURED";
        pinRow.appendChild(flag);
      }
      var stars = document.createElement("span");
      stars.className = "stars";
      stars.dataset.repo = p.repo;
      pinRow.appendChild(stars);
      var h3 = document.createElement("h3");
      h3.textContent = p.name;
      var desc = document.createElement("p");
      desc.textContent = p.desc;
      var tags = document.createElement("div");
      tags.className = "tags";
      p.tags.forEach(function (t) {
        var s = document.createElement("span");
        s.className = "tag";
        s.textContent = t;
        tags.appendChild(s);
      });
      var visit = document.createElement("span");
      visit.className = "visit";
      visit.textContent = "github.com/" + p.repo + " \u2192";
      a.appendChild(pinRow); a.appendChild(h3); a.appendChild(desc); a.appendChild(tags); a.appendChild(visit);
      cardsEl.appendChild(a);
    });
    // live star counts
    PROJECTS.forEach(function (p) {
      fetch("https://api.github.com/repos/" + p.repo)
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (d) {
          if (!d) return;
          var el = cardsEl.querySelector('[data-repo="' + p.repo + '"]');
          if (el) el.textContent = "\u2605 " + d.stargazers_count;
        })
        .catch(function () { /* offline — keep quiet */ });
    });
  }

  /* ============ live activity feed ============ */
  var feed = document.getElementById("feed");
  if (feed) {
    var ICONS = {
      PushEvent: "\u2191",
      CreateEvent: "+",
      WatchEvent: "\u2605",
      ForkEvent: "\u2442",
      IssuesEvent: "\u25C9",
      PullRequestEvent: "\u21C4",
      ReleaseEvent: "\u2691"
    };
    function describe(ev) {
      var repo = ev.repo && ev.repo.name ? ev.repo.name : "";
      switch (ev.type) {
        case "PushEvent": {
          var n = ev.payload && ev.payload.commits ? ev.payload.commits.length : 0;
          return "pushed " + n + " commit" + (n === 1 ? "" : "s") + " to ";
        }
        case "CreateEvent": return "created " + ((ev.payload && ev.payload.ref_type) || "repo") + " in ";
        case "WatchEvent": return "starred ";
        case "ForkEvent": return "forked ";
        case "IssuesEvent": return ((ev.payload && ev.payload.action) || "updated") + " an issue in ";
        case "PullRequestEvent": return ((ev.payload && ev.payload.action) || "updated") + " a PR in ";
        case "ReleaseEvent": return "published a release in ";
        default: return "did something in ";
      }
    }
    function ago(iso) {
      var s = (Date.now() - new Date(iso).getTime()) / 1000;
      if (s < 3600) return Math.max(1, Math.floor(s / 60)) + "m ago";
      if (s < 86400) return Math.floor(s / 3600) + "h ago";
      return Math.floor(s / 86400) + "d ago";
    }
    fetch("https://api.github.com/users/mohammadpooshesh/events/public?per_page=30")
      .then(function (r) { return r.ok ? r.json() : Promise.reject(new Error("http " + r.status)); })
      .then(function (events) {
        var interesting = events.filter(function (e) { return ICONS[e.type]; }).slice(0, 6);
        feed.innerHTML = "";
        if (!interesting.length) {
          var li0 = document.createElement("li");
          li0.className = "muted";
          li0.textContent = "No recent public activity \u2014 the satellite is between passes.";
          feed.appendChild(li0);
          return;
        }
        interesting.forEach(function (ev) {
          var li = document.createElement("li");
          li.className = "reveal in";
          var ico = document.createElement("span");
          ico.className = "ico";
          ico.textContent = ICONS[ev.type];
          var txt = document.createElement("span");
          txt.textContent = describe(ev);
          var link = document.createElement("a");
          link.href = "https://github.com/" + ev.repo.name;
          link.target = "_blank";
          link.rel = "noopener";
          link.textContent = ev.repo.name;
          var when = document.createElement("span");
          when.className = "when";
          when.textContent = ago(ev.created_at);
          li.appendChild(ico); li.appendChild(txt); li.appendChild(link); li.appendChild(when);
          feed.appendChild(li);
        });
      })
      .catch(function () {
        feed.innerHTML = "";
        var li = document.createElement("li");
        li.className = "muted";
        li.textContent = "Live feed unavailable right now \u2014 check github.com/mohammadpooshesh instead.";
        feed.appendChild(li);
      });
  }

  /* ============ reveal on scroll ============ */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -5% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
    // safety net: never leave content hidden (slow devices, screenshots, quirks)
    setTimeout(function () {
      document.querySelectorAll(".reveal:not(.in)").forEach(function (el) { el.classList.add("in"); });
    }, 900);
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }
})();
