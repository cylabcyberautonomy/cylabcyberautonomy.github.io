(function () {
  var DATA_URL = '/assets/March2026RSA/rsa_results.json';

  // Metric colors: blue = hosts, orange = data
  var C = {
    hosts: '#1565C0',
    hostsLight: '#90CAF9',
    data:  '#E65100',
    dataLight:  '#FFCC80',
  };

  var MIN_BAR_PX = 5;

  // Build a seamless diagonal-stripe canvas pattern.
  // Transparent background so the dark chart bg shows through.
  function makeStripePattern(mainCtx, color) {
    var sz = 10;
    var pc = document.createElement('canvas');
    pc.width = sz;
    pc.height = sz;
    var c = pc.getContext('2d');
    c.strokeStyle = color;
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(0, sz);       c.lineTo(sz, 0);
    c.moveTo(-sz/2, sz/2); c.lineTo(sz/2, -sz/2);
    c.moveTo(sz/2, sz*1.5); c.lineTo(sz*1.5, sz/2);
    c.stroke();
    return mainCtx.createPattern(pc, 'repeat');
  }

  function vals(models, strategy, metric) {
    return models.map(function (m) {
      var s = m[strategy];
      return s === null ? null : (s[metric] || 0);
    });
  }

  // Render a two-row legend:
  //   Row 1 — color encodes metric
  //   Row 2 — fill encodes strategy
  function buildLegend(container, hostsColor, dataColor) {
    var sw = 'display:inline-block;width:16px;height:16px;vertical-align:middle;margin-right:5px;border-radius:2px;';
    var stripeHosts = 'repeating-linear-gradient(-45deg,' + hostsColor + ' 0,' + hostsColor + ' 3px,transparent 3px,transparent 9px)';
    var row = 'display:flex;align-items:center;gap:1.5rem;flex-wrap:wrap;justify-content:center;margin:2px 0;font-size:0.85rem;color:#cdd6f4;';
    var label = 'font-weight:600;color:#aaa;min-width:6rem;text-align:right;';

    container.style.cssText = 'margin:0.5rem 0 1.5rem;';
    container.innerHTML =
      '<div style="' + row + '">' +
        '<span style="' + label + '">Metric</span>' +
        '<span><span style="' + sw + 'background:' + hostsColor + '"></span>Hosts Infected</span>' +
        '<span><span style="' + sw + 'background:' + dataColor  + '"></span>Data Exfiltrated</span>' +
      '</div>' +
      '<div style="' + row + '">' +
        '<span style="' + label + '">Attack Strategy</span>' +
        '<span><span style="' + sw + 'background:#888"></span>Incalmo</span>' +
        '<span><span style="' + sw + 'background:' + stripeHosts + ';border:1px solid #555;box-sizing:border-box;"></span>Shell</span>' +
      '</div>';
  }

  // Custom plugin: family bracket lines + labels drawn below tick labels
  var familyLabelsPlugin = {
    id: 'familyLabels',
    afterDraw: function (chart) {
      var models = chart._rsaModels;
      if (!models) { return; }

      var xScale = chart.scales.x;
      var axisBottom = xScale.bottom;
      var canvasBottom = chart.height;
      var textY = (axisBottom + canvasBottom) / 2;
      var lineY = axisBottom + 6;
      var halfSlot = xScale.width / (2 * models.length);

      var families = [];
      models.forEach(function (m, i) {
        var last = families[families.length - 1];
        if (last && last.name === m.family) { last.end = i; }
        else { families.push({ name: m.family, start: i, end: i }); }
      });

      var ctx = chart.ctx;
      ctx.save();
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#cdd6f4';
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 1.5;

      families.forEach(function (f) {
        var x1 = xScale.getPixelForValue(f.start) - halfSlot * 0.88;
        var x2 = xScale.getPixelForValue(f.end)   + halfSlot * 0.88;
        ctx.beginPath();
        ctx.moveTo(x1, lineY);
        ctx.lineTo(x2, lineY);
        ctx.stroke();
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText(f.name, (x1 + x2) / 2, textY);
      });

      ctx.restore();
    },
  };

  fetch(DATA_URL)
    .then(function (r) {
      if (!r.ok) { throw new Error('HTTP ' + r.status); }
      return r.json();
    })
    .then(function (data) {
      var models = data.models;
      var labels = models.map(function (m) { return m.labelLines; });

      var canvas = document.getElementById('rsaChart');
      var ctx = canvas.getContext('2d');

      var shHosts = makeStripePattern(ctx, C.hostsLight);
      var shData  = makeStripePattern(ctx, C.dataLight);

      var chart = new Chart(ctx, {
        type: 'bar',
        plugins: [familyLabelsPlugin],
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Shell \u2014 Hosts Infected',
              data: vals(models, 'shell', 'hostsInfectedPct'),
              backgroundColor: shHosts,
              borderColor: C.hostsLight,
              borderWidth: 1,
              borderRadius: 2,
              minBarLength: MIN_BAR_PX,
            },
            {
              label: 'Incalmo \u2014 Hosts Infected',
              data: vals(models, 'incalmo', 'hostsInfectedPct'),
              backgroundColor: C.hosts,
              borderRadius: 2,
              minBarLength: MIN_BAR_PX,
            },
            {
              label: 'Shell \u2014 Data Exfiltrated',
              data: vals(models, 'shell', 'dataExfiltratedPct'),
              backgroundColor: shData,
              borderColor: C.dataLight,
              borderWidth: 1,
              borderRadius: 2,
              minBarLength: MIN_BAR_PX,
            },
            {
              label: 'Incalmo \u2014 Data Exfiltrated',
              data: vals(models, 'incalmo', 'dataExfiltratedPct'),
              backgroundColor: C.data,
              borderRadius: 2,
              minBarLength: MIN_BAR_PX,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          layout: { padding: { bottom: 44 } },
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: function (item) {
                  var v = item.raw;
                  if (v === null) { return item.dataset.label + ': N/A (no trial)'; }
                  return item.dataset.label + ': ' + v.toFixed(2) + '%';
                },
              },
            },
          },
          scales: {
            x: {
              ticks: { color: '#cdd6f4', font: { size: 11 }, maxRotation: 0, autoSkip: false },
              grid: { color: 'rgba(255,255,255,0.07)' },
            },
            y: {
              min: 0,
              max: 100,
              title: { display: true, text: 'Percentage (%)', color: '#cdd6f4', font: { size: 12 } },
              ticks: {
                color: '#cdd6f4',
                stepSize: 20,
                callback: function (v) { return v + '%'; },
              },
              grid: { color: 'rgba(255,255,255,0.1)' },
            },
          },
        },
      });

      chart._rsaModels = models;

      var legendEl = document.getElementById('rsaLegend');
      if (legendEl) { buildLegend(legendEl, C.hosts, C.data); }
    })
    .catch(function (err) {
      var el = document.getElementById('rsaChart');
      if (el) {
        el.parentNode.insertAdjacentHTML('beforeend',
          '<p style="color:#f38ba8;text-align:center;">Chart failed to load: ' + err.message + '</p>');
      }
      console.error('RSA chart error:', err);
    });
})();
