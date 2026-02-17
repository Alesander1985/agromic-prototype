/* AgroMic — prototip SPA (fără backend)
 * - localStorage: ferme, culturi, notițe, chat
 * - MapLibre + OSM tiles, Nominatim autocomplete + reverse geocode (best-effort)
 * - Open-Meteo prognoză 7 zile
 * - MeteoAlarm (best-effort; poate pica din cauza CORS)
 */

const STORAGE_KEY = "agromic_v1";
const DEFAULT_CENTER = { lat: 45.9432, lon: 24.9668, zoom: 6.2 }; // România

// -------------------- Default crops (România)
const DEFAULT_CROPS = [
  // Legume
  { key: "rosii", label: "Roșii", group: "Legume" },
  { key: "ardei", label: "Ardei - gras/capia/iute", group: "Legume" },
  { key: "castraveti", label: "Castraveți", group: "Legume" },
  { key: "vinete", label: "Vinete", group: "Legume" },
  { key: "dovlecei", label: "Dovlecei", group: "Legume" },
  { key: "dovleac", label: "Dovleac", group: "Legume" },
  { key: "varza", label: "Varză", group: "Legume" },
  { key: "conopida", label: "Conopidă", group: "Legume" },
  { key: "broccoli", label: "Broccoli", group: "Legume" },
  { key: "salata", label: "Salată", group: "Legume" },
  { key: "spanac", label: "Spanac", group: "Legume" },
  { key: "ceapa", label: "Ceapă", group: "Legume" },
  { key: "usturoi", label: "Usturoi", group: "Legume" },
  { key: "morcov", label: "Morcov", group: "Legume" },
  { key: "patrunjel", label: "Pătrunjel", group: "Legume" },
  { key: "telina", label: "Țelină", group: "Legume" },
  { key: "sfecla_rosie", label: "Sfeclă roșie", group: "Legume" },
  { key: "ridichi", label: "Ridichi", group: "Legume" },
  { key: "fasole_pastai", label: "Fasole păstăi", group: "Legume" },
  { key: "mazare", label: "Mazăre", group: "Legume" },
  { key: "cartofi", label: "Cartofi", group: "Legume" },
  { key: "praz", label: "Praz", group: "Legume" },
  { key: "gulia", label: "Gulie", group: "Legume" },
  { key: "sparanghel", label: "Sparanghel", group: "Legume" },
  { key: "porumb_zaharat", label: "Porumb zaharat", group: "Legume" },
  { key: "pepene_verde", label: "Pepene verde", group: "Legume" },
  { key: "pepene_galben", label: "Pepene galben", group: "Legume" },
  { key: "capsuni", label: "Căpșuni", group: "Legume" },

  // Pomi fructiferi și arbuști
  { key: "mar", label: "Măr", group: "Pomi fructiferi și arbuști" },
  { key: "par", label: "Păr", group: "Pomi fructiferi și arbuști" },
  { key: "prun", label: "Prun", group: "Pomi fructiferi și arbuști" },
  { key: "cires", label: "Cireș", group: "Pomi fructiferi și arbuști" },
  { key: "visin", label: "Vișin", group: "Pomi fructiferi și arbuști" },
  { key: "cais", label: "Cais", group: "Pomi fructiferi și arbuști" },
  { key: "piersic", label: "Piersic", group: "Pomi fructiferi și arbuști" },
  { key: "nectarin", label: "Nectarin", group: "Pomi fructiferi și arbuști" },
  { key: "gutui", label: "Gutui", group: "Pomi fructiferi și arbuști" },
  { key: "nuc", label: "Nuc", group: "Pomi fructiferi și arbuști" },
  { key: "alun", label: "Alun", group: "Pomi fructiferi și arbuști" },
  { key: "vita_de_vie", label: "Viță de vie", group: "Pomi fructiferi și arbuști" },
  { key: "zmeur", label: "Zmeur", group: "Pomi fructiferi și arbuști" },
  { key: "mur", label: "Mur", group: "Pomi fructiferi și arbuști" },
  { key: "coacaz", label: "Coacăz", group: "Pomi fructiferi și arbuști" },
  { key: "agris", label: "Agriș", group: "Pomi fructiferi și arbuști" },
  { key: "afin", label: "Afin - cultivat", group: "Pomi fructiferi și arbuști" },
  { key: "catina", label: "Cătină", group: "Pomi fructiferi și arbuști" },
  { key: "corn", label: "Corn", group: "Pomi fructiferi și arbuști" },
  { key: "soc", label: "Soc", group: "Pomi fructiferi și arbuști" },
  { key: "aronia", label: "Aronia", group: "Pomi fructiferi și arbuști" },

  // Flori și ornamentale
  { key: "trandafir", label: "Trandafir", group: "Flori și ornamentale" },
  { key: "lavanda", label: "Lavandă", group: "Flori și ornamentale" },
  { key: "muscata", label: "Mușcată", group: "Flori și ornamentale" },
  { key: "petunie", label: "Petunie", group: "Flori și ornamentale" },
  { key: "begonie", label: "Begonie", group: "Flori și ornamentale" },
  { key: "crizantema", label: "Crizantemă", group: "Flori și ornamentale" },
  { key: "lalea", label: "Lalea", group: "Flori și ornamentale" },
  { key: "narcisa", label: "Narcisă", group: "Flori și ornamentale" },
  { key: "zambila", label: "Zambilă", group: "Flori și ornamentale" },
  { key: "bujor", label: "Bujor", group: "Flori și ornamentale" },
  { key: "dahlia", label: "Dalia", group: "Flori și ornamentale" },
  { key: "iris", label: "Iris", group: "Flori și ornamentale" },
  { key: "garoafa", label: "Garoafă", group: "Flori și ornamentale" },
  { key: "crin", label: "Crin", group: "Flori și ornamentale" },
  { key: "hortensie", label: "Hortensie", group: "Flori și ornamentale" },
  { key: "liliac", label: "Liliac", group: "Flori și ornamentale" },
  { key: "iasomie", label: "Iasomie", group: "Flori și ornamentale" },
  { key: "tuia", label: "Tuia", group: "Flori și ornamentale" },
  { key: "buxus", label: "Buxus / Cimișir", group: "Flori și ornamentale" },
  { key: "magnolia", label: "Magnolia", group: "Flori și ornamentale" },
  { key: "iedera", label: "Iedera", group: "Flori și ornamentale" },
  { key: "glicina", label: "Glicină", group: "Flori și ornamentale" },
  { key: "galbenele", label: "Gălbenele", group: "Flori și ornamentale" },
  { key: "busuioc", label: "Busuioc", group: "Flori și ornamentale" },
];

// -------------------- State
const state = loadState();
let currentFarmId = state.ui.currentFarmId || null;

// -------------------- Maps (New farm)
let map = null;
let marker = null;
let mapReady = false;

// -------------------- Maps (Farm dashboard)
let farmMap = null;
let farmMarker = null;
let farmMapReady = false;

// -------------------- Fix location (repair-only)
let fixLocationMode = false;
let fixLocationOriginal = null;

// -------------------- DOM helpers
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function setView(name) {
  const views = ["dashboard", "newFarm", "farm", "chat", "settings"];
  for (const v of views) {
    const el = $(`#view-${v}`);
    if (!el) continue;
    el.classList.toggle("hidden", v !== name);
  }
  state.ui.currentView = name;
  saveState();
}

function toast(msg) {
  alert(msg);
}

// -------------------- Storage
function defaultState() {
  return {
    farms: [], // {id, name, areaHa, locality, county, lat, lon, createdAt}
    crops: [], // {id, farmId, cropKey, areaHa, plantingDate, notes, createdAt}
    notes: "",
    chat: {
      messages: [] // {farmId, role, content, ts}
    },
    ui: {
      currentView: "dashboard",
      currentFarmId: null
    }
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const obj = JSON.parse(raw);
    return { ...defaultState(), ...obj };
  } catch {
    return defaultState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// -------------------- UI: dashboard list
function renderFarmList() {
  const box = $("#farm-list");
  box.innerHTML = "";

  if (!state.farms.length) {
    box.innerHTML = `<div class="muted">Nu ai încă nicio fermă. Apasă „Adaugă fermă”.</div>`;
    renderChatFarmSelect();
    return;
  }

  for (const farm of state.farms.slice().sort((a, b) => b.createdAt - a.createdAt)) {
    const el = document.createElement("div");
    el.className = "item";

    const meta = [
      farm.locality ? farm.locality : "—",
      farm.areaHa != null ? `${farm.areaHa} ha` : "suprafață nedefinită",
      (farm.lat != null && farm.lon != null) ? `${Number(farm.lat).toFixed(4)}, ${Number(farm.lon).toFixed(4)}` : "fără coordonate"
    ].join(" • ");

    el.innerHTML = `
      <div class="top">
        <div>
          <div class="name">${escapeHtml(farm.name || "Fermă fără nume")}</div>
          <div class="meta">${escapeHtml(meta)}</div>
        </div>
        <div class="actions">
          <button class="btn secondary" data-action="open" data-id="${farm.id}">Deschide</button>
          <button class="btn danger" data-action="delete" data-id="${farm.id}">Șterge</button>
        </div>
      </div>
    `;

    el.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      if (action === "open") openFarm(id);
      if (action === "delete") deleteFarm(id);
    });

    box.appendChild(el);
  }

  renderChatFarmSelect();
}

function deleteFarm(id) {
  if (!confirm("Sigur vrei să ștergi ferma și culturile asociate?")) return;
  state.farms = state.farms.filter((f) => f.id !== id);
  state.crops = state.crops.filter((c) => c.farmId !== id);
  if (currentFarmId === id) currentFarmId = null;
  state.ui.currentFarmId = currentFarmId;
  saveState();
  renderFarmList();
  toast("Ferma a fost ștearsă.");
}

function getCurrentFarm() {
  return state.farms.find((f) => f.id === currentFarmId) || null;
}

function openFarm(id) {
  currentFarmId = id;
  state.ui.currentFarmId = id;
  saveState();

  renderFarmView();
  setView("farm");

  setTimeout(() => {
    initFarmMapIfNeeded();
    const farm = getCurrentFarm();
    if (farm?.lat != null && farm?.lon != null) {
      updateFarmMapLocation(Number(farm.lat), Number(farm.lon));
      renderFarmInfoBox(farm);
    }
  }, 50);

  loadWeatherAndAlerts();
}

// -------------------- New farm: Map + Nominatim
function initMapIfNeeded() {
  if (mapReady) return;

  map = new maplibregl.Map({
    container: "map",
    style: {
      version: 8,
      sources: {
        osm: {
          type: "raster",
          tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
          tileSize: 256,
          attribution: "© OpenStreetMap contributors",
        },
      },
      layers: [{ id: "osm", type: "raster", source: "osm" }],
    },
    center: [DEFAULT_CENTER.lon, DEFAULT_CENTER.lat],
    zoom: DEFAULT_CENTER.zoom,
  });

  map.addControl(new maplibregl.NavigationControl({ showCompass: true }), "top-right");

  marker = new maplibregl.Marker({ draggable: true })
    .setLngLat([DEFAULT_CENTER.lon, DEFAULT_CENTER.lat])
    .addTo(map);

  marker.on("dragend", () => {
    const lngLat = marker.getLngLat();
    $("#farm-lat").value = String(lngLat.lat.toFixed(6));
    $("#farm-lon").value = String(lngLat.lng.toFixed(6));
  });

  map.on("click", (e) => {
    marker.setLngLat(e.lngLat);
    $("#farm-lat").value = String(e.lngLat.lat.toFixed(6));
    $("#farm-lon").value = String(e.lngLat.lng.toFixed(6));
  });

  mapReady = true;
}

let nominatimTimer = null;
const nominatimCache = new Map();

function setupLocalityAutocomplete() {
  const input = $("#farm-locality");
  const sugBox = $("#locality-suggestions");
  if (!input || !sugBox) return;

  input.addEventListener("input", () => {
    const q = input.value.trim();
    clearTimeout(nominatimTimer);

    if (q.length < 3) {
      sugBox.classList.add("hidden");
      sugBox.innerHTML = "";
      return;
    }

    nominatimTimer = setTimeout(async () => {
      try {
        const results = await nominatimSearch(q);
        renderSuggestions(results);
      } catch {
        sugBox.classList.add("hidden");
        sugBox.innerHTML = "";
      }
    }, 450);
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".autocomplete")) {
      sugBox.classList.add("hidden");
    }
  });

  function renderSuggestions(items) {
    sugBox.innerHTML = "";
    if (!items.length) {
      sugBox.classList.add("hidden");
      return;
    }
    for (const it of items) {
      const row = document.createElement("div");
      row.className = "sug";
      row.innerHTML = `
        <div>${escapeHtml(it.display_name.split(",").slice(0, 2).join(", "))}</div>
        <span class="small">${escapeHtml(it.display_name)}</span>
      `;
      row.addEventListener("click", () => {
        input.value = it.display_name;
        $("#farm-lat").value = String(Number(it.lat).toFixed(6));
        $("#farm-lon").value = String(Number(it.lon).toFixed(6));

        const lat = Number(it.lat),
          lon = Number(it.lon);
        if (mapReady) {
          map.flyTo({ center: [lon, lat], zoom: 12 });
          marker.setLngLat([lon, lat]);
        }
        sugBox.classList.add("hidden");
      });
      sugBox.appendChild(row);
    }
    sugBox.classList.remove("hidden");
  }
}

async function nominatimSearch(query) {
  const q = query.toLowerCase();
  if (nominatimCache.has(q)) return nominatimCache.get(q);

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "json");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "6");
  url.searchParams.set("countrycodes", "ro");
  url.searchParams.set("q", query);

  const res = await fetch(url.toString(), { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error("Nominatim error");
  const data = await res.json();
  nominatimCache.set(q, data);
  return data;
}

// -------------------- Farm dashboard map
function initFarmMapIfNeeded() {
  if (farmMapReady) return;

  farmMap = new maplibregl.Map({
    container: "farm-map",
    style: {
      version: 8,
      sources: {
        osm: {
          type: "raster",
          tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
          tileSize: 256,
          attribution: "© OpenStreetMap contributors",
        },
      },
      layers: [{ id: "osm", type: "raster", source: "osm" }],
    },
    center: [DEFAULT_CENTER.lon, DEFAULT_CENTER.lat],
    zoom: 12,
  });

  farmMap.addControl(new maplibregl.NavigationControl({ showCompass: true }), "top-right");

  farmMarker = new maplibregl.Marker({ draggable: false })
    .setLngLat([DEFAULT_CENTER.lon, DEFAULT_CENTER.lat])
    .addTo(farmMap);

  // Sync inputs when dragging (only relevant in fix mode)
  farmMarker.on("dragend", () => {
    const ll = farmMarker.getLngLat();
    const latEl = $("#fix-lat");
    const lonEl = $("#fix-lon");
    if (latEl && lonEl) {
      latEl.value = String(ll.lat.toFixed(6));
      lonEl.value = String(ll.lng.toFixed(6));
    }
  });

  farmMapReady = true;
}

function updateFarmMapLocation(lat, lon) {
  if (!farmMapReady) return;
  farmMap.flyTo({ center: [lon, lat], zoom: 12 });
  farmMarker.setLngLat([lon, lat]);
}

// -------------------- Save farm
function saveFarmFromForm() {
  const name = $("#farm-name").value.trim();
  const area = $("#farm-area").value ? Number($("#farm-area").value) : null;
  const locality = $("#farm-locality").value.trim();
  const lat = $("#farm-lat").value ? Number($("#farm-lat").value) : null;
  const lon = $("#farm-lon").value ? Number($("#farm-lon").value) : null;

  if (!name) return toast("Te rog completează numele fermei.");
  if (!locality) return toast("Te rog selectează o localitate (sau scrie una).");
  if (lat == null || lon == null || Number.isNaN(lat) || Number.isNaN(lon)) return toast("Te rog setează coordonatele (lat/lon).");

  const farm = {
    id: crypto.randomUUID(),
    name,
    areaHa: area,
    locality,
    county: "",
    lat,
    lon,
    createdAt: Date.now(),
  };

  state.farms.push(farm);
  saveState();
  renderFarmList();

  // reset form
  $("#farm-name").value = "";
  $("#farm-area").value = "";
  $("#farm-locality").value = "";
  $("#farm-lat").value = "";
  $("#farm-lon").value = "";

  toast("Ferma a fost salvată.");
  openFarm(farm.id);
}

// -------------------- Fix location (repair-only)
function openFixLocationPanel() {
  const farm = getCurrentFarm();
  if (!farm) return;

  // Ensure map exists before enabling drag
  initFarmMapIfNeeded();
  if (farm?.lat != null && farm?.lon != null) {
    updateFarmMapLocation(Number(farm.lat), Number(farm.lon));
  }

  const panel = $("#fix-location-panel");
  const latEl = $("#fix-lat");
  const lonEl = $("#fix-lon");
  if (!panel || !latEl || !lonEl) return;

  fixLocationMode = true;
  fixLocationOriginal = { lat: Number(farm.lat), lon: Number(farm.lon) };

  panel.classList.remove("hidden");
  latEl.value = String(Number(farm.lat).toFixed(6));
  lonEl.value = String(Number(farm.lon).toFixed(6));

  if (farmMarker) farmMarker.setDraggable(true);
}

function closeFixLocationPanel(revert = true) {
  const panel = $("#fix-location-panel");
  if (panel) panel.classList.add("hidden");

  if (farmMarker) farmMarker.setDraggable(false);

  if (revert && fixLocationOriginal) {
    updateFarmMapLocation(fixLocationOriginal.lat, fixLocationOriginal.lon);
  }

  fixLocationMode = false;
  fixLocationOriginal = null;
}

async function reverseGeocodeLocality(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error("Reverse geocoding error");
  const data = await res.json();
  const addr = data.address || {};
  const locality =
    addr.city ||
    addr.town ||
    addr.village ||
    addr.municipality ||
    addr.hamlet ||
    null;
  const county = addr.county || null;
  return { locality, county };
}

async function saveFixedLocation() {
  const farm = getCurrentFarm();
  if (!farm) return;

  const latEl = $("#fix-lat");
  const lonEl = $("#fix-lon");
  if (!latEl || !lonEl) return;

  const lat = Number(latEl.value);
  const lon = Number(lonEl.value);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    alert("Coordonate invalide. Te rog introdu valori numerice.");
    return;
  }

  // Persist coordonate
  farm.lat = lat;
  farm.lon = lon;

  // Best-effort: update locality/county
  try {
    const r = await reverseGeocodeLocality(lat, lon);
    if (r.locality) farm.locality = r.locality;
    if (r.county) farm.county = r.county;
  } catch (err) {
    console.warn("Reverse geocoding failed", err);
  }

  saveState();

  // Update UI + map + meteo
  initFarmMapIfNeeded();
  updateFarmMapLocation(lat, lon);
  renderFarmView(); // updates title/meta/crops/reco placeholder
  renderFarmInfoBox(farm); // ensures Info fermă updates NOW
  loadWeatherAndAlerts();

  closeFixLocationPanel(false);
  alert("Locația a fost actualizată.");
}

function renderFarmInfoBox(farm) {
  const info = $("#farm-info-box");
  if (!info || !farm) return;

  info.textContent =
    `Localitate: ${farm.locality || "—"}${farm.county ? `, ${farm.county}` : ""}, Romania • ` +
    `Coordonate: ${Number(farm.lat).toFixed(4)}, ${Number(farm.lon).toFixed(4)} • ` +
    `Suprafață: ${farm.areaHa ?? "—"} ha`;
}

// -------------------- Farm view render
function renderFarmView() {
  const farm = getCurrentFarm();
  if (!farm) {
    toast("Ferma nu a fost găsită.");
    setView("dashboard");
    renderFarmList();
    return;
  }

  $("#farm-title").textContent = farm.name || "Fermă";
  const meta = [
    farm.areaHa != null ? `${farm.areaHa} ha` : "suprafață nedefinită",
    `${Number(farm.lat).toFixed(4)}, ${Number(farm.lon).toFixed(4)}`
  ].join(" • ");
  $("#farm-meta").textContent = meta;

  renderFarmInfoBox(farm);
  renderCropList();
  renderRecommendations(null); // placeholder until weather loads
}

// -------------------- Crops
function cropsForFarm(farmId) {
  return state.crops.filter((c) => c.farmId === farmId);
}

function renderCropSelect() {
  const sel = $("#crop-select");
  if (!sel) return;
  sel.innerHTML = "";

  const groups = new Map();
  for (const c of DEFAULT_CROPS) {
    if (!groups.has(c.group)) groups.set(c.group, []);
    groups.get(c.group).push(c);
  }

  for (const [group, items] of groups.entries()) {
    const optg = document.createElement("optgroup");
    optg.label = group;
    for (const it of items) {
      const opt = document.createElement("option");
      opt.value = it.key;
      opt.textContent = it.label;
      optg.appendChild(opt);
    }
    sel.appendChild(optg);
  }
}

function renderCropList() {
  const box = $("#crop-list");
  if (!box) return;
  box.innerHTML = "";

  const farm = getCurrentFarm();
  if (!farm) return;
  const items = cropsForFarm(farm.id);

  if (!items.length) {
    box.innerHTML = `<div class="muted">Nu ai culturi adăugate încă.</div>`;
    return;
  }

  for (const c of items.slice().sort((a, b) => b.createdAt - a.createdAt)) {
    const cropMeta = DEFAULT_CROPS.find((x) => x.key === c.cropKey);
    const label = cropMeta ? cropMeta.label : c.cropKey;

    const meta = [
      cropMeta?.group || "—",
      c.areaHa != null ? `${c.areaHa} ha` : "suprafață nedefinită",
      c.plantingDate ? `plantare: ${c.plantingDate}` : "plantare: —",
    ].join(" • ");

    const el = document.createElement("div");
    el.className = "item";
    el.innerHTML = `
      <div class="top">
        <div>
          <div class="name">${escapeHtml(label)}</div>
          <div class="meta">${escapeHtml(meta)}</div>
          ${c.notes ? `<div class="meta">${escapeHtml(c.notes)}</div>` : ``}
        </div>
        <div class="actions">
          <button class="btn danger" data-action="delete" data-id="${c.id}">Șterge</button>
        </div>
      </div>
    `;

    el.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      if (btn.dataset.action === "delete") deleteCrop(btn.dataset.id);
    });

    box.appendChild(el);
  }
}

function deleteCrop(id) {
  if (!confirm("Ștergi cultura?")) return;
  state.crops = state.crops.filter((c) => c.id !== id);
  saveState();
  renderCropList();
  toast("Cultura a fost ștearsă.");
  loadWeatherAndAlerts();
}

function saveCropFromModal() {
  const farm = getCurrentFarm();
  if (!farm) return;

  const cropKey = $("#crop-select").value;
  const area = $("#crop-area").value ? Number($("#crop-area").value) : null;
  const plantingDate = $("#crop-date").value || null;
  const notes = $("#crop-notes").value.trim();

  const item = {
    id: crypto.randomUUID(),
    farmId: farm.id,
    cropKey,
    areaHa: area,
    plantingDate,
    notes,
    createdAt: Date.now(),
  };

  state.crops.push(item);
  saveState();

  closeModal();
  renderCropList();
  loadWeatherAndAlerts();
}

// -------------------- Weather: Open-Meteo
async function fetchWeather(lat, lon) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", lat);
  url.searchParams.set("longitude", lon);
  url.searchParams.set("current", "temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation");
  url.searchParams.set("daily", "temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max");
  url.searchParams.set("timezone", "auto");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Open-Meteo error");
  return res.json();
}

function renderWeather(data) {
  $("#weather-status").textContent = "";
  const cur = data.current || {};
  const curBox = $("#weather-current");
  curBox.innerHTML = `
    <div class="item">
      <div class="top">
        <div>
          <div class="name">Acum</div>
          <div class="meta">
            🌡️ ${fmt(cur.temperature_2m)}°C • 💧 ${fmt(cur.relative_humidity_2m)}% • 💨 ${fmt(cur.wind_speed_10m)} km/h • 🌧️ ${fmt(cur.precipitation)} mm
          </div>
        </div>
        <div class="pill ${riskPillClass(cur)}">Risc: ${riskLabel(cur)}</div>
      </div>
    </div>
  `;

  const daily = data.daily || {};
  const days = (daily.time || []).slice(0, 7);
  const fc = $("#weather-forecast");
  fc.innerHTML = "";

  for (let i = 0; i < days.length; i++) {
    const d = days[i];
    const tmax = daily.temperature_2m_max?.[i];
    const tmin = daily.temperature_2m_min?.[i];
    const rain = daily.precipitation_sum?.[i];
    const wind = daily.wind_speed_10m_max?.[i];

    const el = document.createElement("div");
    el.className = "day";
    el.innerHTML = `
      <div class="d">${formatDateShort(d)}</div>
      <div class="m">max ${fmt(tmax)}° • min ${fmt(tmin)}°</div>
      <div class="m">🌧️ ${fmt(rain)} mm • 💨 ${fmt(wind)} km/h</div>
      <div class="m">${dayRiskSummary(tmin, tmax, rain, wind)}</div>
    `;
    fc.appendChild(el);
  }
}

// Simple risk heuristics
function riskLabel(cur) {
  const t = Number(cur.temperature_2m);
  const w = Number(cur.wind_speed_10m);
  const p = Number(cur.precipitation);
  if (t <= 0) return "îngheț";
  if (t >= 32) return "caniculă";
  if (w >= 45) return "vânt puternic";
  if (p >= 8) return "ploi";
  return "scăzut";
}
function riskPillClass(cur) {
  const r = riskLabel(cur);
  if (r === "scăzut") return "ok";
  if (r === "ploi") return "warn";
  return "danger";
}
function dayRiskSummary(tmin, tmax, rain, wind) {
  const risks = [];
  if (tmin != null && tmin < 0) risks.push("îngheț");
  if (tmax != null && tmax > 32) risks.push("caniculă");
  if (wind != null && wind > 45) risks.push("vânt");
  if (rain != null && rain > 15) risks.push("ploi abundente");
  return risks.length ? `⚠️ ${risks.join(", ")}` : "✅ OK";
}

// -------------------- Alerts: MeteoAlarm (best-effort)
async function fetchMeteoAlarmRomania() {
  const url = "https://api.meteoalarm.org/v1/warnings?country=RO";
  const res = await fetch(url);
  if (!res.ok) throw new Error("MeteoAlarm error");
  return res.json();
}

function renderAlerts(data) {
  const box = $("#alerts-box");
  box.innerHTML = "";

  const warnings = (data && (data.warnings || data.features || data)) || [];
  if (!warnings.length) {
    box.innerHTML = `<div class="muted">Nu sunt avertizări (sau nu au putut fi citite).</div>`;
    return;
  }

  const list = Array.isArray(warnings) ? warnings.slice(0, 6) : [];
  for (const w of list) {
    const title = w.title || w.event || w.properties?.event || "Avertizare";
    const sev = (w.severity || w.level || w.properties?.awareness_level || "").toString().toLowerCase();
    const pill =
      sev.includes("red") || sev.includes("rosu")
        ? "danger"
        : sev.includes("orange") || sev.includes("portocal")
          ? "warn"
          : "ok";
    const desc = w.description || w.properties?.description || w.properties?.headline || "";
    const when = w.onset || w.properties?.onset || w.effective || w.properties?.effective || "";

    const el = document.createElement("div");
    el.className = "item";
    el.innerHTML = `
      <div class="top">
        <div>
          <div class="name">${escapeHtml(title)}</div>
          <div class="meta">${escapeHtml(when ? `Data: ${when}` : "")}</div>
          ${desc ? `<div class="meta">${escapeHtml(desc).slice(0, 260)}${escapeHtml(desc).length > 260 ? "…" : ""}</div>` : ""}
        </div>
        <div class="pill ${pill}">${pill === "danger" ? "Sever" : pill === "warn" ? "Moderat" : "Info"}</div>
      </div>
    `;
    box.appendChild(el);
  }
}

function renderAlertsFallback(errMsg) {
  const box = $("#alerts-box");
  box.innerHTML = `
    <div class="item">
      <div class="name">Avertizări indisponibile în browser (CORS)</div>
      <div class="meta">
        Une’le API-uri nu permit acces direct din GitHub Pages. Ca fallback:
        verifică avertizările pe site-uri oficiale sau activăm un proxy server în etapa 2.
      </div>
      <div class="meta">Detaliu: <span style="font-family:var(--mono)">${escapeHtml(errMsg || "")}</span></div>
    </div>
  `;
}

// -------------------- Recommendations (rule-based)
function renderRecommendations(weatherData) {
  const box = $("#reco-box");
  box.innerHTML = "";

  const farm = getCurrentFarm();
  if (!farm) return;

  const crops = cropsForFarm(farm.id);
  if (!crops.length) {
    box.innerHTML = `<div class="muted">Adaugă cel puțin o cultură ca să primești recomandări.</div>`;
    return;
  }

  const signals = analyzeWeatherSignals(weatherData);
  const recos = [];
  recos.push(...generalReco(signals));

  for (const c of crops) {
    const meta = DEFAULT_CROPS.find((x) => x.key === c.cropKey);
    recos.push(...cropReco(meta, signals));
  }

  const uniq = Array.from(new Set(recos)).slice(0, 12);
  box.innerHTML = `
    <div class="box">
      <div class="name">Checklist (prototip)</div>
      <ul>${uniq.map((x) => `<li>${escapeHtml(x)}</li>`).join("")}</ul>
    </div>
  `;
}

function analyzeWeatherSignals(data) {
  const s = {
    frostRisk: false,
    heatRisk: false,
    heavyRainRisk: false,
    windRisk: false,
    drySpell: false,
  };
  if (!data?.daily) return s;

  const tmin = data.daily.temperature_2m_min || [];
  const tmax = data.daily.temperature_2m_max || [];
  const rain = data.daily.precipitation_sum || [];
  const wind = data.daily.wind_speed_10m_max || [];

  s.frostRisk = tmin.some((v) => v != null && v < 0);
  s.heatRisk = tmax.some((v) => v != null && v > 32);
  s.heavyRainRisk = rain.some((v) => v != null && v > 20);
  s.windRisk = wind.some((v) => v != null && v > 50);

  const rainSum = rain.reduce((a, b) => a + (Number(b) || 0), 0);
  s.drySpell = rainSum < 5;

  return s;
}

function generalReco(sig) {
  const out = [];
  if (sig.frostRisk) out.push("Protejează culturile sensibile la îngheț (agrotextil/folie) și evită tratamentele în nopți reci.");
  if (sig.heatRisk) out.push("Planifică udarea dimineața devreme/seara și verifică stresul hidric (frunze ofilite).");
  if (sig.heavyRainRisk) out.push("Verifică drenajul; evită lucrările pe sol umed pentru a nu compacta.");
  if (sig.windRisk) out.push("Verifică susținerea plantelor (araci, spalier), fixează folii/solarii.");
  if (sig.drySpell) out.push("Planifică o udare profundă (mai rar, dar consistent) și mulcire pentru reducerea evaporării.");
  out.push("Inspectează vizual plantele de 2–3 ori pe săptămână pentru dăunători/boli (MVP).");
  return out;
}

function cropReco(meta, sig) {
  const label = meta?.label || "cultura";
  const group = meta?.group || "";
  const out = [];

  if (group === "Legume") {
    out.push(`(${label}) Verifică buruienile și menține solul afânat la suprafață (după ploi/udări).`);
    if (sig.heavyRainRisk) out.push(`(${label}) Atenție la boli fungice după ploi; aerisește și evită stropirile în ploaie.`);
    if (sig.heatRisk) out.push(`(${label}) Umbrește ușor (dacă e în solar) și crește frecvența monitorizării udării.`);
  }

  if (group === "Pomi fructiferi și arbuști") {
    out.push(`(${label}) Verifică lăstarii și elimină ramurile uscate/bolnave (igienizare).`);
    if (sig.frostRisk) out.push(`(${label}) Dacă e în fază sensibilă, protejează florile/rodul (unde e posibil) și urmărește prognoza.`);
    if (sig.heavyRainRisk) out.push(`(${label}) După ploi, verifică apariția petelor/putregaiurilor și îmbunătățește aerisirea coroanei.`);
  }

  if (group === "Flori și ornamentale") {
    out.push(`(${label}) Îndepărtează florile ofilite și verifică frunzele pentru afide/păianjen roșu.`);
    if (sig.windRisk) out.push(`(${label}) Susține plantele înalte și protejează ghivecele expuse.`);
    if (sig.drySpell) out.push(`(${label}) Mulcește la bază și udă constant (în special la ghivece).`);
  }

  if (sig.frostRisk) out.push(`(${label}) Evită fertilizările azotate înainte de nopți reci (risc de sensibilizare).`);
  return out;
}

// -------------------- Chat (simulat, cu context)
function renderChatFarmSelect() {
  const sel = $("#chat-farm-select");
  if (!sel) return;
  sel.innerHTML = "";

  if (!state.farms.length) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "Nu ai ferme — adaugă una";
    sel.appendChild(opt);
    return;
  }

  for (const f of state.farms) {
    const opt = document.createElement("option");
    opt.value = f.id;
    opt.textContent = f.name;
    sel.appendChild(opt);
  }

  sel.value = currentFarmId || state.farms[0].id;
}

function getChatFarmId() {
  const sel = $("#chat-farm-select");
  if (!sel) return null;
  const v = sel.value;
  return v || null;
}

function renderChatLog() {
  const box = $("#chat-log");
  if (!box) return;
  box.innerHTML = "";
  const farmId = getChatFarmId();

  const msgs = state.chat.messages.filter((m) => m.farmId === farmId);
  if (!msgs.length) {
    box.innerHTML = `<div class="muted">Spune-mi cu ce te pot ajuta. Exemplu: „Ce recomandări ai pentru roșii săptămâna asta?”</div>`;
    return;
  }

  for (const m of msgs) {
    const el = document.createElement("div");
    el.className = `msg ${m.role === "user" ? "user" : "bot"}`;
    el.innerHTML = `
      <div class="meta">${m.role === "user" ? "Tu" : "Agronom"} • ${new Date(m.ts).toLocaleString()}</div>
      <div>${escapeHtml(m.content)}</div>
    `;
    box.appendChild(el);
  }
  box.scrollTop = box.scrollHeight;
}

function addChatMessage(farmId, role, content) {
  state.chat.messages.push({ farmId, role, content, ts: Date.now() });
  saveState();
  renderChatLog();
}

function agronomReply(question, farmId) {
  const farm = state.farms.find((f) => f.id === farmId);
  const crops = state.crops
    .filter((c) => c.farmId === farmId)
    .map((c) => DEFAULT_CROPS.find((x) => x.key === c.cropKey)?.label || c.cropKey);

  const q = question.toLowerCase();

  if (q.includes("plant") || q.includes("plantez")) {
    return `Pentru „când să plantezi”, am nevoie de cultura exactă și dacă e în câmp/solar. La ferma „${farm?.name || "—"}” ai: ${
      crops.length ? crops.join(", ") : "nicio cultură salvată"
    }. Spune-mi cultura și îți fac un plan pe 7–14 zile, adaptat la prognoza meteo.`;
  }
  if (q.includes("ud") || q.includes("irig")) {
    return `Udarea: încearcă dimineața devreme sau seara, cu udare profundă. Dacă ai perioadă uscată, mulcirea ajută mult. Pentru „${
      farm?.locality || "zona fermei"
    }”, verifică prognoza din dashboard și spune-mi cultura ca să calibrez mai bine.`;
  }
  if (q.includes("pesticid") || q.includes("trat") || q.includes("strop")) {
    return `Pot să-ți dau recomandări generale (nu doze). Spune-mi cultura + simptom (ex: pete pe frunze, insecte). Important: respectă eticheta produsului și consultă un specialist pentru substanțe/doze.`;
  }
  if (q.includes("recolt")) {
    return `Recoltarea depinde de soi și stadiu. Spune-mi cultura și semnele observate (culoare, fermitate, dimensiune). Îți dau un checklist de „când e momentul bun” și pași de după recoltare.`;
  }

  return `OK. Ca să te ajut concret: 1) ce cultură ai în vedere, 2) câmp sau solar, 3) ce te îngrijorează (vreme/boli/dăunători/lucrări)? La ferma „${
    farm?.name || "—"
  }” ai: ${crops.length ? crops.join(", ") : "—"}.`;
}

// -------------------- Weather + Alerts load
let lastWeather = null;

async function loadWeatherAndAlerts() {
  const farm = getCurrentFarm();
  if (!farm) return;

  $("#weather-status").textContent = "Încarc meteo...";
  $("#weather-current").innerHTML = "";
  $("#weather-forecast").innerHTML = "";

  try {
    const w = await fetchWeather(farm.lat, farm.lon);
    lastWeather = w;
    renderWeather(w);
    renderRecommendations(w);
  } catch {
    $("#weather-status").textContent = "Nu am putut încărca meteo (încearcă din nou).";
    renderRecommendations(null);
  }

  $("#alerts-box").innerHTML = `<div class="muted">Încarc avertizări...</div>`;
  try {
    const a = await fetchMeteoAlarmRomania();
    renderAlerts(a);
  } catch (e) {
    renderAlertsFallback(e?.message || String(e));
  }
}

// -------------------- Settings / Notes
function initNotes() {
  $("#quick-notes").value = state.notes || "";
  $("#btn-save-notes").addEventListener("click", () => {
    state.notes = $("#quick-notes").value || "";
    saveState();
    toast("Notițele au fost salvate.");
  });
  $("#btn-clear-all").addEventListener("click", () => {
    if (!confirm("Sigur vrei reset? Șterge tot din acest browser.")) return;
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  });
}

// -------------------- Event wiring
function initNav() {
  // top nav buttons
  $$(".navbtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const v = btn.dataset.view;
      if (v === "dashboard") {
        setView("dashboard");
        renderFarmList();
      }
      if (v === "newFarm") {
        setView("newFarm");
        setTimeout(() => initMapIfNeeded(), 50);
      }
      if (v === "chat") {
        setView("chat");
        renderChatFarmSelect();
        renderChatLog();
      }
      if (v === "settings") {
        setView("settings");
      }
    });
  });

  $("#btn-add-farm").addEventListener("click", () => {
    setView("newFarm");
    setTimeout(() => initMapIfNeeded(), 50);
  });

  $("#btn-cancel-farm").addEventListener("click", () => {
    setView("dashboard");
    renderFarmList();
  });

  $("#btn-save-farm").addEventListener("click", saveFarmFromForm);

  $("#btn-back-dashboard").addEventListener("click", () => {
    setView("dashboard");
    renderFarmList();
  });

  // Crop modal
  $("#btn-add-crop").addEventListener("click", openModal);
  $("#btn-save-crop").addEventListener("click", saveCropFromModal);

  // Chat
  $("#chat-send").addEventListener("click", sendChat);
  $("#chat-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendChat();
  });
  $("#chat-farm-select").addEventListener("change", () => renderChatLog());

  // Fix location buttons (if present in DOM)
  const fixBtn = $("#btn-fix-location");
  if (fixBtn) fixBtn.addEventListener("click", openFixLocationPanel);

  const saveLocBtn = $("#btn-save-location");
  if (saveLocBtn) saveLocBtn.addEventListener("click", saveFixedLocation);

  const cancelLocBtn = $("#btn-cancel-location");
  if (cancelLocBtn) cancelLocBtn.addEventListener("click", () => closeFixLocationPanel(true));
}

// -------------------- Modal
function openModal() {
  renderCropSelect();
  $("#crop-area").value = "";
  $("#crop-date").value = "";
  $("#crop-notes").value = "";
  $("#modal").classList.remove("hidden");
}
function closeModal() {
  $("#modal").classList.add("hidden");
}

// -------------------- Chat send
function sendChat() {
  const input = $("#chat-input");
  const text = (input.value || "").trim();
  if (!text) return;

  const farmId = getChatFarmId();
  if (!farmId) return toast("Adaugă mai întâi o fermă.");

  addChatMessage(farmId, "user", text);
  input.value = "";

  const reply = agronomReply(text, farmId);
  setTimeout(() => addChatMessage(farmId, "bot", reply), 250);
}

// -------------------- Utilities
function fmt(v) {
  if (v == null || Number.isNaN(Number(v))) return "—";
  return String(Math.round(Number(v) * 10) / 10);
}
function formatDateShort(iso) {
  const d = new Date(iso);
  const opts = { weekday: "short", day: "2-digit", month: "2-digit" };
  return d.toLocaleDateString("ro-RO", opts);
}
function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// -------------------- Init app
function init() {
  initNav();

  // ensure modal hidden on load
  try { closeModal(); } catch (_) {}

  renderCropSelect();
  initNotes();
  setupLocalityAutocomplete();
  renderFarmList();

  // restore last view
  const v = state.ui.currentView || "dashboard";
  if (
    v === "farm" &&
    state.ui.currentFarmId &&
    state.farms.some((f) => f.id === state.ui.currentFarmId)
  ) {
    currentFarmId = state.ui.currentFarmId;
    renderFarmView();
    setView("farm");

    setTimeout(() => {
      initFarmMapIfNeeded();
      const farm = getCurrentFarm();
      if (farm?.lat != null && farm?.lon != null) {
        updateFarmMapLocation(Number(farm.lat), Number(farm.lon));
        renderFarmInfoBox(farm);
      }
    }, 50);

    loadWeatherAndAlerts();
  } else {
    setView("dashboard");
  }
}

// Modal close fallback + background click
document.addEventListener("click", (e) => {
  const closeBtn = e.target.closest("#btn-close-modal");
  const modalBg = e.target.id === "modal";
  if (closeBtn || modalBg) {
    try { closeModal(); } catch (_) {}
  }
});

// Fix location fallback (works even if buttons appear after initNav)
document.addEventListener("click", (e) => {
  if (e.target.closest("#btn-fix-location")) openFixLocationPanel();
  if (e.target.closest("#btn-save-location")) saveFixedLocation();
  if (e.target.closest("#btn-cancel-location")) closeFixLocationPanel(true);
});

init();
