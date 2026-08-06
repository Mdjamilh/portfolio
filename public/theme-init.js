// Runs before first paint so a saved theme never flashes the other one.
try {
  var saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") document.documentElement.dataset.theme = saved;
} catch (e) {
  // Storage blocked: follow the system setting.
}
