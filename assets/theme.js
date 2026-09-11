// Dark-mode toggle, shared by every page. The actual color switch is done by
// CSS reacting to `[data-theme]` on <html> (see the early inline snippet in
// each page's <head>, and the [data-theme] rules in site.css / the post's own
// <style>); this file only wires up the button and remembers the choice.
(function () {
  function systemPrefersDark() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") || (systemPrefersDark() ? "dark" : "light");
  }
  function paintButton(btn) {
    if (!btn) return;
    var dark = currentTheme() === "dark";
    btn.textContent = dark ? "☀️" : "🌙";
    btn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  }
  function applyStoredTheme() {
    var saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") {
      document.documentElement.setAttribute("data-theme", saved);
    }
  }
  function wire() {
    applyStoredTheme();
    var btn = document.getElementById("theme-toggle");
    paintButton(btn);
    if (btn) {
      btn.addEventListener("click", function () {
        var next = currentTheme() === "dark" ? "light" : "dark";
        localStorage.setItem("theme", next);
        document.documentElement.setAttribute("data-theme", next);
        paintButton(btn);
      });
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wire);
  } else {
    wire();
  }
})();
