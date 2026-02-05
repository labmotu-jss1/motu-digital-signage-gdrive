(() => {
  const clockEl = document.getElementById("clock");
  if (!clockEl) return;

  function updateClock() {
    const now = new Date();

    const days = [
      "Sunday", "Monday", "Tuesday", "Wednesday",
      "Thursday", "Friday", "Saturday"
    ];

    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const dayName = days[now.getDay()];
    const monthName = months[now.getMonth()];
    const date = now.getDate();
    const year = now.getFullYear();

    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");

    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    clockEl.textContent =
      `${dayName}, ${monthName} ${date}, ${year} — ` +
      `${hours}:${minutes}:${seconds} ${ampm}`;
  }

  // Initial draw
  updateClock();

  // Update every second so it never looks frozen
  setInterval(updateClock, 1000);
})();
