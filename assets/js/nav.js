(function () {
    const FADE_MS = 150;
    const RESIZE_MS = 300;
    const IMG_WAIT_MS = 400;
    const panel = () => document.querySelector(".frosted");

    const imagesSettled = (root) => {
        const pending = [...root.querySelectorAll("img")].filter(img => !img.complete);
        if (!pending.length) return Promise.resolve();
        const loaded = pending.map(img => new Promise(resolve => {
            img.addEventListener("load", resolve, { once: true });
            img.addEventListener("error", resolve, { once: true });
        }));
        return Promise.race([
            Promise.all(loaded),
            new Promise(resolve => setTimeout(resolve, IMG_WAIT_MS))
        ]);
    };

    const go = (url, push) => {
        const p = panel();
        if (!p) { location.href = url; return; }

        const oldHeight = p.offsetHeight;
        p.classList.add("is-loading");

        Promise.all([
            fetch(url).then(r => r.ok ? r.text() : Promise.reject(r.status)),
            new Promise(resolve => setTimeout(resolve, FADE_MS))
        ]).then(([html]) => {
            const doc = new DOMParser().parseFromString(html, "text/html");
            const next = doc.querySelector(".frosted");
            if (!next) throw new Error("no .frosted in response");

            p.style.height = oldHeight + "px";
            p.classList.add("is-resizing");
            p.innerHTML = next.innerHTML;
            document.title = doc.title;
            if (push) history.pushState({}, "", url);
            window.scrollTo(0, 0);

            return imagesSettled(p);
        }).then(() => {
            p.style.transition = "none";
            p.style.height = "auto";
            const newHeight = p.offsetHeight;
            p.style.height = oldHeight + "px";
            void p.offsetHeight;
            p.style.transition = "";
            void p.offsetHeight;
            p.style.height = newHeight + "px";

            setTimeout(() => {
                p.style.height = "";
                p.classList.remove("is-resizing");
                p.classList.remove("is-loading");
            }, RESIZE_MS);
        }).catch(() => {
            location.href = url;
        });
    };

    document.addEventListener("click", (e) => {
        if (e.defaultPrevented || e.button !== 0) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

        const a = e.target.closest("a");
        if (!a || !a.href || a.target || a.hasAttribute("download")) return;

        const url = new URL(a.href);
        if (url.origin !== location.origin) return;
        if (url.pathname === location.pathname && url.hash) return;

        e.preventDefault();
        if (url.href === location.href) return;
        go(url.href, true);
    });

    window.addEventListener("popstate", () => go(location.href, false));
})();
