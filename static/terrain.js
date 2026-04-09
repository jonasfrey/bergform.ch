// Copyright (c) Jonas Immanuel Frey. All rights reserved.
// Licensed under the terms specified by Jonas Immanuel Frey.

(function () {
  const canvas = document.getElementById("terrain-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width, height;
  let cols, rows;
  const scale = 20;
  let frame = 0;

  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
    cols = Math.ceil(width / scale) + 1;
    rows = Math.ceil(height / scale) + 1;
  }

  function noise(x, y) {
    const sin1 = Math.sin(x * 0.3 + y * 0.7) * 0.5;
    const sin2 = Math.sin(x * 0.1 - y * 0.4 + 2.5) * 0.8;
    const sin3 = Math.sin(x * 0.5 + y * 0.2 + 1.3) * 0.3;
    return (sin1 + sin2 + sin3) / 1.6;
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    frame += 0.003;

    const accent = [213, 43, 30];

    for (let y = 0; y < rows - 1; y++) {
      for (let x = 0; x < cols - 1; x++) {
        const nx = x * 0.15 + frame;
        const ny = y * 0.15;

        const h = noise(nx, ny);
        const brightness = Math.max(0, Math.min(1, (h + 1) * 0.5));

        const r = Math.floor(accent[0] * brightness * 0.3);
        const g = Math.floor(accent[1] * brightness * 0.3);
        const b = Math.floor(accent[2] * brightness * 0.3);

        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(x * scale, y * scale, scale, scale);

        if (brightness > 0.55) {
          ctx.strokeStyle = `rgba(${accent[0]},${accent[1]},${accent[2]},${(brightness - 0.55) * 0.4})`;
          ctx.lineWidth = 0.5;
          ctx.strokeRect(x * scale, y * scale, scale, scale);
        }
      }
    }

    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener("resize", resize);
  draw();
})();
