(() => {
  const track = document.getElementById("newsTrack");
  if (!track) return;

  const NEWS_ENDPOINT = "http://localhost:9000/news";

  fetch(NEWS_ENDPOINT, { cache: "no-store" })
    .then(r => {
      if (!r.ok) throw new Error("news fetch failed");
      return r.text();
    })
    .then(xmlText => {
      const xml = new DOMParser().parseFromString(xmlText, "text/xml");
      const items = [...xml.querySelectorAll("item > title")].slice(0, 10);

      track.innerHTML = items
        .map(i => `<div class="newsItem">• ${i.textContent}</div>`)
        .join("");
    })
    .catch(() => {
      track.textContent = "News unavailable";
    });
})();
