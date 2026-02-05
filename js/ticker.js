(() => {
  const el = document.getElementById("tickerText");
  if (!el) return;

  fetch("/motu-digital-signage/TextTicker.txt?ts=" + Date.now())
    .then(r => {
      if (!r.ok) throw new Error("Ticker fetch failed");
      return r.text();
    })
    .then(text => {
      const clean = text
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, "")
        .trim();

      if (!clean) return;

      el.textContent = clean;

      // Restart animation cleanly
      el.style.animation = "none";
      el.offsetWidth; // force reflow
      el.style.animation = "tickerScroll 30s linear infinite";
    })
    .catch(err => {
      console.warn("Ticker error:", err);
    });
})();
