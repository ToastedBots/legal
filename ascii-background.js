(function () {
  const doc = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const layer = document.createElement("pre");
  const glyphs = [".", ".", "'", "`", "+", "*"];
  const tones = ["dim", "soft", "mid", "bright"];
  let stars = [];
  let cols = 0;
  let rows = 0;
  let lastFrame = 0;
  let animationId = 0;

  function random(seed) {
    let value = seed >>> 0;
    return function next() {
      value += 0x6d2b79f5;
      let t = value;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function measure() {
    const cellWidth = window.innerWidth < 720 ? 18 : 15;
    const cellHeight = window.innerWidth < 720 ? 22 : 18;
    cols = Math.max(24, Math.ceil(window.innerWidth / cellWidth));
    rows = Math.max(18, Math.ceil(window.innerHeight / cellHeight));
  }

  function buildStars() {
    measure();

    const seed = (cols * 73856093) ^ (rows * 19349663) ^ 0x46a11d;
    const next = random(seed);
    const density = window.innerWidth < 720 ? 0.042 : 0.058;
    const count = Math.min(320, Math.max(68, Math.round(cols * rows * density)));

    stars = Array.from({ length: count }, function createStar(_, index) {
      const depth = 0.3 + next() * 1.35;
      const tone = tones[Math.min(tones.length - 1, Math.floor(depth * tones.length * 0.72))];

      return {
        x: Math.floor(next() * cols),
        y: Math.floor(next() * rows),
        depth,
        tone,
        phase: next() * Math.PI * 2,
        speed: 0.5 + next() * 0.9,
        glyph: glyphs[Math.floor(next() * glyphs.length)],
        alternate: glyphs[(index + Math.floor(next() * glyphs.length)) % glyphs.length],
      };
    });
  }

  function frame(time) {
    if (time - lastFrame < 80 && !reduceMotion.matches) {
      animationId = window.requestAnimationFrame(frame);
      return;
    }

    lastFrame = time;
    const seconds = reduceMotion.matches ? 0 : time / 1000;
    const grid = Array.from({ length: rows }, function makeRow() {
      return Array(cols).fill(" ");
    });

    for (const star of stars) {
      const driftX = reduceMotion.matches ? 0 : seconds * 0.18 * star.depth;
      const driftY = reduceMotion.matches ? 0 : seconds * 0.05 * star.depth;
      const x = Math.floor((star.x + driftX) % cols);
      const y = Math.floor((star.y + driftY) % rows);
      const shimmer = Math.sin(seconds * star.speed + star.phase);

      const activeTone = shimmer > 0.72 && star.tone !== "bright" ? "mid" : star.tone;
      grid[y][x] = {
        glyph: shimmer > 0.58 ? star.alternate : star.glyph,
        tone: activeTone,
      };
    }

    layer.innerHTML = grid.map(function joinRow(row) {
      return row.map(function renderCell(cell) {
        if (cell === " ") return " ";
        return `<span class="star-${cell.tone}">${cell.glyph}</span>`;
      }).join("");
    }).join("\n");

    if (!reduceMotion.matches) {
      animationId = window.requestAnimationFrame(frame);
    }
  }

  function reset() {
    window.cancelAnimationFrame(animationId);
    buildStars();
    lastFrame = Number.NEGATIVE_INFINITY;
    frame(0);
  }

  layer.className = "ascii-background";
  layer.setAttribute("aria-hidden", "true");
  doc.classList.add("has-ascii-bg");

  window.addEventListener("resize", reset, { passive: true });
  if (reduceMotion.addEventListener) {
    reduceMotion.addEventListener("change", reset);
  } else {
    reduceMotion.addListener(reset);
  }

  if (document.body) {
    document.body.prepend(layer);
    reset();
  }
})();
