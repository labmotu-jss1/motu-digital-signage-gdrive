(() => {
  const el = document.getElementById("tickerText");

  fetch("TextTicker.txt?ts=" + Date.now())
    .then(r => r.text())
    .then(text => {
      // Strip ALL HTML tags if server returns an error page
      const clean = text
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, "")
        .trim();

      if (!clean) return;

      el.textContent = clean;

      // Restart animation cleanly
      el.style.animation = "none";
      el.offsetWidth;
      el.style.animation = "tickerScroll 25s linear infinite";
    })
    .catch(() => {
      // If fetch fails, keep ticker empty
    });
})();
