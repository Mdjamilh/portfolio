// Runs before first paint: applies a saved theme and marks that scripts run,
// so scroll-reveal effects never hide content when JavaScript is off.
document.documentElement.classList.add("js");
try {
  if (localStorage.getItem("theme") === "light") document.documentElement.dataset.theme = "light";
} catch (e) {
  // Storage blocked: keep the default dark theme.
}
