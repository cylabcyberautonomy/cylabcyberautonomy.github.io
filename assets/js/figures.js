(function () {
    const VERBOSE = location.search.includes("debug");
    const L = (...a) => { if (VERBOSE) console.log("[fig]", ...a); };
    const W = (...a) => console.warn("[fig]", ...a);
    const E = (...a) => console.error("[fig]", ...a);

    const css = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

    // matches the site's own mobile breakpoint (assets/css/base.css)
    const MOBILE_BP = 700;
    const isMobile = () => window.innerWidth <= MOBILE_BP;

    const LIBS = ["vega.min.js", "vega-lite.min.js", "vega-embed.min.js"];

    const script = (src) => new Promise((ok, no) => {
        const s = document.createElement("script");
        s.src = src;
        s.onload = ok;
        s.onerror = () => no(new Error("could not load " + src));
        document.head.appendChild(s);
    });

    let loading;
    const ensureLibs = () => loading || (loading = LIBS.reduce(
        (p, f) => p.then(() => script("/assets/js/vendor/" + f)), Promise.resolve()));

    const fail = (el, msg, err) => {
        el.innerHTML = '<div class="figure-placeholder">' + msg + '</div>';
        E(msg, err || "");
        if (err && err.stack) E(err.stack);
    };

    const theme = () => {
        const ramp = ["--seq-0", "--seq-50", "--seq-100"].map(css).filter(Boolean);
        const cats = ["--cat-1", "--cat-2", "--cat-3"].map(css).filter(Boolean);
        const cfg = {
            background: "transparent",
            font: css("--font-body") || "sans-serif",
            axis: {
                labelColor: css("--primary-color"), titleColor: css("--primary-color"),
                labelFont: css("--font-display"), titleFont: css("--font-display"),
                labelFontSize: 12, titleFontSize: 12,
                domainColor: css("--secondary-color"), tickColor: css("--secondary-color"), grid: false
            },
            legend: {
                labelColor: css("--primary-color"), titleColor: css("--primary-color"),
                labelFont: css("--font-body"), titleFont: css("--font-display"),
                labelFontSize: 12, titleFontSize: 12
            },
            title: { color: css("--primary-color"), font: css("--font-display"), fontSize: 14 },
            text: { color: css("--primary-color"), font: css("--font-display") },
            view: { stroke: "transparent" },
            point: { stroke: null }
        };
        if (ramp.length === 3 || cats.length === 3) cfg.range = {};
        if (ramp.length === 3) cfg.range.heatmap = ramp;
        if (cats.length === 3) cfg.range.category = cats;
        return cfg;
    };

    // A spec with `"width": "container"` shrinks its plot to fit the phone,
    // starving discrete columns (e.g. 3 model columns with un-rotated labels)
    // until their labels collide - CSS can't fix that, since it's the actual
    // rendered plot that's too narrow, not oversized content being squashed.
    // A spec that wants a floor under that on narrow screens sets top-level
    // `_minMobileWidth` to the smallest plot width (px) its labels need; below
    // that the plot renders at that fixed width instead of the container's,
    // and el's own `overflow-x: auto` (see base.css) lets it scroll into view.
    const applyMinMobileWidth = (spec, el) => {
        const minWidth = spec._minMobileWidth;
        if (!minWidth || spec.width !== "container") return spec;
        spec.width = Math.max(el.offsetWidth || 0, minWidth);
        return spec;
    };

    // Vega-Lite's global config.legend doesn't propagate orient/direction/columns
    // (those are layout properties, not the styling ones config.legend actually
    // supports) - they have to be set per-encoding. On narrow screens, move every
    // color/shape legend under the plot instead of letting it eat into the plot's
    // width from the right, which is what squashes a categorical-legend chart
    // (like the scatterplot) on a phone.
    const patchLegendsForMobile = (spec) => {
        const bottomLegend = { orient: "bottom", direction: "horizontal", columns: 0 };
        const patchEncoding = (enc) => {
            if (!enc) return;
            ["color", "shape", "size", "opacity"].forEach((ch) => {
                if (enc[ch] && enc[ch].field) {
                    enc[ch].legend = Object.assign({}, enc[ch].legend, bottomLegend);
                }
            });
        };
        (spec.layer || [spec]).forEach((layer) => patchEncoding(layer.encoding));
        return spec;
    };

    // A tooltip is a hover affordance, and a touch screen has no hover: every
    // tap on a mark pops one up, and it sits there until you happen to tap
    // somewhere else. Drop them on phones - both by dropping the encodings
    // (so the marks carry no tooltip data at all) and by turning off the
    // handler at embed time, since either alone is enough but the pair leaves
    // nothing to go wrong. Desktop keeps its tooltips: the specs on disk are
    // untouched, and this only runs behind the isMobile() check in render().
    const stripTooltipsForMobile = (spec) => {
        (spec.layer || [spec]).forEach((layer) => {
            if (layer.encoding) delete layer.encoding.tooltip;
        });
        if (spec.encoding) delete spec.encoding.tooltip;
        return spec;
    };

    const inspect = (el, view) => {
        const svg = el.querySelector("svg");
        L("view size:", view.width(), "x", view.height());
        L("container offsetWidth:", el.offsetWidth, " clientWidth:", el.clientWidth);
        if (!svg) { W("NO <svg> in the container"); L("container HTML:", el.innerHTML.slice(0, 400)); return; }
        const bb = svg.getBoundingClientRect();
        L("svg attrs w/h:", svg.getAttribute("width"), svg.getAttribute("height"));
        L("svg bounding box:", Math.round(bb.width), "x", Math.round(bb.height));
        L("svg computed display/visibility/opacity:",
          getComputedStyle(svg).display, getComputedStyle(svg).visibility, getComputedStyle(svg).opacity);
        L("marks: rect=", svg.querySelectorAll("rect").length,
          " path=", svg.querySelectorAll("path").length,
          " text=", svg.querySelectorAll("text").length);
        const r = svg.querySelector("g.mark-rect rect") || svg.querySelector("rect");
        if (r) L("first rect:", r.getAttribute("width"), "x", r.getAttribute("height"),
                 "fill=", r.getAttribute("fill"), "opacity=", r.getAttribute("opacity"));
        try {
            const names = Object.keys(view.getState({ data: true, signals: false }).data || {});
            L("view datasets:", names);
            names.forEach(n => {
                const d = view.data(n);
                if (d && d.length) L("  " + n + ": " + d.length + " rows; sample=", JSON.stringify(d[0]).slice(0, 220));
                else L("  " + n + ": EMPTY");
            });
        } catch (e) { W("could not enumerate datasets:", e.message); }
    };

    const observe = (el) => {
        el._mobile = isMobile();
        if (el._ro || typeof ResizeObserver !== "function") return;
        el._ro = new ResizeObserver(() => {
            const nowMobile = isMobile();
            if (nowMobile !== el._mobile) { el._mobile = nowMobile; render(el); return; }
            if (el._view) el._view.resize().run();
        });
        el._ro.observe(el);
    };

    const render = (el) => {
        const src = el.dataset.vega;
        if (!src) return;
        L("--- rendering", src, "---");
        L("libs: vega=", typeof vega !== "undefined" ? vega.version : "MISSING",
          " vega-lite=", typeof vegaLite !== "undefined" ? vegaLite.version : "MISSING",
          " vegaEmbed=", typeof vegaEmbed);
        L("css vars: primary=", css("--primary-color"), " seq0=", css("--seq-0"),
          " seq100=", css("--seq-100"), " fontBody=", css("--font-body").slice(0, 30));
        L("container width before embed:", el.offsetWidth);

        if (typeof vegaEmbed !== "function") { fail(el, "vegaEmbed not loaded"); return; }
        if (el._view) { try { el._view.finalize(); } catch (e) {} el._view = null; }
        el.innerHTML = "";
        // vegaEmbed adds its own classes (.vega-embed, .has-actions, ...) directly
        // onto whatever element it's given, rather than wrapping it - so embedding
        // straight into `el` (.figure) would make .figure and .vega-embed the same
        // node. That breaks the scroll-container pattern used elsewhere on this
        // site (e.g. .table-wrap > table): .figure needs to stay pinned to the
        // viewport width so its overflow-x:auto has something to scroll against,
        // while .vega-embed needs to size to its actual (possibly wider) content
        // so the export button - position:absolute against .vega-embed's own box -
        // lands on the chart's real corner instead of the viewport's. A plain
        // inner div gives each element its own job.
        const inner = document.createElement("div");
        el.appendChild(inner);

        fetch(src)
            .then(r => { L("spec fetch:", r.status); return r.ok ? r.json() : Promise.reject(new Error("HTTP " + r.status + " " + src)); })
            .then(spec => {
                L("spec keys:", Object.keys(spec).join(","), " data.url=", spec.data && spec.data.url);
                return fetch(spec.data.url)
                    .then(r => { L("data fetch:", r.status, spec.data.url); return r.ok ? r.json() : Promise.reject(new Error("HTTP " + r.status + " " + spec.data.url)); })
                    .then(rows => {
                        L("data rows:", rows.length, " sample=", JSON.stringify(rows[0]));
                        const hs = [...new Set(rows.map(r => r.harness))];
                        L("distinct harness values:", hs);
                        return spec;
                    });
            })
            .then(spec => {
                if (isMobile()) {
                    spec = patchLegendsForMobile(spec);
                    spec = stripTooltipsForMobile(spec);
                    spec = applyMinMobileWidth(spec, el);
                    L("mobile: legends moved to bottom, tooltips off, width=", spec.width);
                }
                delete spec._minMobileWidth;
                if (VERBOSE && typeof vegaLite !== "undefined" && vegaLite.compile) {
                    try { const c = vegaLite.compile(spec); L("vl.compile OK; vega marks:", (c.spec.marks || []).length); }
                    catch (e) { E("vl.compile FAILED:", e.message); throw e; }
                }
                // tooltip: the second half of stripTooltipsForMobile - see there.
                return vegaEmbed(inner, spec, {
                    config: theme(), renderer: "svg", logLevel: VERBOSE ? 3 : 1,
                    tooltip: !isMobile(),
                    actions: { export: true, source: false, compiled: false, editor: false }
                });
            })
            .then(res => {
                el._view = res.view;
                observe(el);
                L("embed resolved");
                if (VERBOSE) inspect(el, res.view);
            })
            .catch(err => fail(el, "Figure failed: " + (err && err.message ? err.message : err), err));
    };

    const renderAll = () => {
        const els = document.querySelectorAll("[data-vega]");
        if (!els.length) return;
        L("found", els.length, "figure(s)");
        ensureLibs()
            .then(() => els.forEach(render))
            .catch(err => els.forEach(el => fail(el, "Figure failed: " + err.message, err)));
    };

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", renderAll);
    else renderAll();
    document.addEventListener("content:swapped", renderAll);
    new MutationObserver(m => { if (m.some(x => x.attributeName === "data-theme")) renderAll(); })
        .observe(document.documentElement, { attributes: true });
})();
