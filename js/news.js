(() => {
  const container = document.getElementById("newsTrack");
  if (!container) return;

  fetch("https://tight-frog-b4c7.lab-motu.workers.dev/news")
    .then(r => {
      if (!r.ok) throw new Error("News fetch failed");
      return r.text();
    })
    .then(xmlText => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(xmlText, "application/xml");
      const items = xml.querySelectorAll("item");

      if (!items.length) {
        container.textContent = "No news available";
        return;
      }

      container.innerHTML = "";

      items.forEach((item, i) => {
        if (i >= 5) return;

        const title = item.querySelector("title")?.textContent;
        if (!title) return;

        const div = document.createElement("div");
        div.style.marginBottom = "10px";
        div.textContent = "• " + title;

        container.appendChild(div);
      });
    })
    .catch(err => {
      console.warn("News error:", err);
      container.textContent = "News unavailable";
    });
})();
