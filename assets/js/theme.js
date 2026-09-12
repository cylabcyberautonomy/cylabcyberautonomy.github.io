document.addEventListener("click", (e) => {
    if (!e.target.closest(".nav-toggle")) return;

    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    const fade = parseFloat(getComputedStyle(root).getPropertyValue("--theme-fade")) * 1000;

    root.classList.add("theming");
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (err) {}
    setTimeout(() => root.classList.remove("theming"), fade);
});
