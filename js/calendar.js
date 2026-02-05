// ================================
// MOTU DIGITAL SIGNAGE – CALENDAR
// Collision-safe version
// ================================

(function () {
  // Prevent double-execution
  if (window.__MOTU_CALENDAR_LOADED__) return;
  window.__MOTU_CALENDAR_LOADED__ = true;

  const CALENDAR_ENDPOINT =
    "https://tight-frog-b4c7.lab-motu.workers.dev/calendar";

  const REFRESH_INTERVAL_MS = 120000;
  const SCROLL_INTERVAL_MS = 40;
  const SCROLL_PAUSE_MS = 2000;

  let scrollTimer = null;

  async function loadCalendar() {
    const track = document.getElementById("calendarTrack");
    if (!track) return;

    track.textContent = "Loading calendar…";

    try {
      const res = await fetch(CALENDAR_ENDPOINT + "?t=" + Date.now(), {
        cache: "no-store"
      });
      if (!res.ok) throw new Error();

      const text = await res.text();
      const events = parseICS(text);

      if (!events.length) {
        track.textContent = "No upcoming events";
        return;
      }

      track.innerHTML = events.slice(0, 10).map(e => {
        return `
          <div class="calRow">
            <div class="calDate">
              ${e.date}
              <span style="float:right">${e.time}</span>
            </div>
            <div class="calTitle">${e.title}</div>
          </div>
        `;
      }).join("");

      startAutoScroll();
    } catch {
      track.textContent = "Calendar unavailable";
    }
  }

  function startAutoScroll() {
    if (scrollTimer) clearInterval(scrollTimer);

    const box = document.getElementById("calendarBox");
    if (!box) return;

    box.scrollTop = 0;
    let dir = 1;
    let pauseUntil = 0;

    scrollTimer = setInterval(() => {
      if (Date.now() < pauseUntil) return;

      box.scrollTop += dir;

      if (
        box.scrollTop + box.clientHeight >= box.scrollHeight - 2 ||
        box.scrollTop <= 0
      ) {
        pauseUntil = Date.now() + SCROLL_PAUSE_MS;
        dir *= -1;
      }
    }, SCROLL_INTERVAL_MS);
  }

  function parseICS(text) {
    const lines = text.split(/\r?\n/);
    const events = [];
    let cur = {};

    for (const line of lines) {
      if (line === "BEGIN:VEVENT") cur = {};
      if (line.startsWith("SUMMARY:")) cur.title = line.slice(8);

      if (line.startsWith("DTSTART")) {
        const raw = line.split(":")[1];
        cur.date = raw.slice(0, 8);
        cur.time = raw.length > 8 ? raw.slice(9, 13) : "All day";
      }

      if (line === "END:VEVENT") {
        events.push({
          title: cur.title || "(No title)",
          date: cur.date || "",
          time: cur.time || ""
        });
      }
    }
    return events;
  }

  loadCalendar();
  setInterval(loadCalendar, REFRESH_INTERVAL_MS);
})();
