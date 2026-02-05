(() => {
  const el = document.getElementById("weatherText");

  fetch("https://api.zippopotam.us/us/48084")
    .then(r => r.json())
    .then(loc => {
      const p = loc.places[0];
      return fetch(
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${p.latitude}&longitude=${p.longitude}` +
        `&current=temperature_2m,wind_speed_10m` +
        `&daily=temperature_2m_max,temperature_2m_min` +
        `&temperature_unit=fahrenheit&wind_speed_unit=mph`
      );
    })
    .then(r => r.json())
    .then(w => {
      el.innerHTML = `
        <div style="
          display: grid;
          grid-template-columns: 1fr 1fr;
          row-gap: 6px;
          column-gap: 20px;
        ">
          <div><strong>Temp:</strong> ${Math.round(w.current.temperature_2m)}°F</div>
          <div><strong>High:</strong> ${Math.round(w.daily.temperature_2m_max[0])}°F</div>

          <div><strong>Wind:</strong> ${Math.round(w.current.wind_speed_10m)} mph</div>
          <div><strong>Low:</strong> ${Math.round(w.daily.temperature_2m_min[0])}°F</div>
        </div>
      `;
    })
    .catch(() => {
      el.textContent = "Weather unavailable";
    });
})();
