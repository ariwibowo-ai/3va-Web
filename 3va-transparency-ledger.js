(function(){
  const SRV_CATALOG = {
    '3VA-SRV-01': { name: 'Sales & Land Consultant', agencyFee: '2% – 3% Commission (Asset Transaction)', rate: 'Commission: 2% – 3% (Tiered)' },
    '3VA-SRV-02': { name: 'Legal Curator & Advisor', agencyFee: '16% – 17% Client Agency Fee (0% Worker Cut)', rate: 'IDR 2,500,000 – 5,000,000 / scope' },
    '3VA-SRV-03': { name: 'Renovation & Fit-Out', agencyFee: '12% – 13% Client Agency Fee (0% Worker Cut)', rate: 'IDR 3.2M – 5.5M / m² · Labor: IDR 250k – 450k / day' },
    '3VA-SRV-04': { name: 'House Keeper & Butler', agencyFee: '10% – 15% Client Agency Fee (0% Worker Cut)', rate: 'IDR 150k – 250k / visit · IDR 2.8M – 4.2M / mo' },
    '3VA-SRV-05': { name: 'Pools & Spa Maintenance', agencyFee: '10% – 11% Client Agency Fee (0% Worker Cut)', rate: 'IDR 650k – 1.2M / mo · IDR 350k – 600k / visit' },
    '3VA-SRV-06': { name: 'MEP & Power Engineering', agencyFee: '12% – 15% Client Agency Fee (0% Worker Cut)', rate: 'IDR 250k – 450k / point · Retainer: IDR 2.0M – 4.5M / mo' },
    '3VA-SRV-07': { name: 'Air Conditioner & Pest Control', agencyFee: '12% – 13% Client Agency Fee (0% Worker Cut)', rate: 'AC Wash: IDR 85k – 125k · Pest: IDR 250k – 500k' },
    '3VA-SRV-08': { name: 'Hospitality Trainer Expert', agencyFee: '14% – 15% Client Agency Fee (0% Worker Cut)', rate: 'Workshop: IDR 750k – 1.5M / day · IDR 8.5M – 15M / mo' }
  };

  window.selectServiceCode = function(code, label) {
    const mem = document.getElementById('membership');
    if (mem) { mem.style.display = 'block'; mem.scrollIntoView({ behavior: 'smooth' }); }
    if (typeof switchTab === 'function') switchTab('service');
    const panel = document.getElementById('panel-service');
    if (!panel) return;
    const catSel = panel.querySelectorAll('select')[1];
    if (catSel) {
      const val = code + ' — ' + label;
      if (![...catSel.options].some(o => o.value === val)) {
        const opt = document.createElement('option'); opt.value = val; opt.textContent = val;
        catSel.insertBefore(opt, catSel.firstChild);
      }
      catSel.value = val;
    }
    let badge = document.getElementById('srvSelectedCodeBanner');
    if (!badge) {
      badge = document.createElement('div'); badge.id = 'srvSelectedCodeBanner'; badge.className = 'box-info';
      badge.style.marginBottom = '10px';
      panel.insertBefore(badge, panel.firstChild);
    }
    const info = SRV_CATALOG[code] || {};
    badge.innerHTML = '<strong>Selected Service Code: ' + code + ' (' + label + ')</strong><br>Standard Benchmark: ' + (info.rate || '') + ' · <strong>' + (info.agencyFee || '') + '</strong>';
  };

  function injectLedgerPanel() {
    const memWrap = document.querySelector('#membership .wrap') || document.getElementById('membership');
    if (!memWrap || document.getElementById('realtimeLedgerBox')) return;
    const box = document.createElement('div');
    box.id = 'realtimeLedgerBox';
    box.style.cssText = 'margin-top:18px;padding:14px;background:#f7f9f6;border:1px solid #c9d7c4;border-radius:8px';
    box.innerHTML = `<div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px">
      <div><strong style="color:var(--green)">🔒 Member-Only Real-Time Payment &amp; Escrow Transparency Ledger</strong><div class="small">Verify exact worker net pay (0% deduction) vs. client agency fee in real time.</div></div>
      <div style="display:flex;gap:6px"><input id="ledgerCodeInput" placeholder="Contract Code (e.g. 3VA-VE101)" style="padding:6px 10px;border:1px solid #bbb;border-radius:4px;font-size:13px"><button type="button" class="btn" onclick="viewRealtimeLedger()">Inspect Ledger</button></div>
    </div><div id="ledgerOutput" style="margin-top:10px"></div>`;
    memWrap.appendChild(box);
  }

  window.viewRealtimeLedger = function() {
    const code = (document.getElementById('ledgerCodeInput')?.value || '').trim().toUpperCase();
    const out = document.getElementById('ledgerOutput');
    if (!out) return;
    if (!code) { out.innerHTML = '<span class="small" style="color:#a33">Please enter your Contract / Vendor Code (try <strong>3VA-VE101</strong> for live preview).</span>'; return; }
    const vendors = JSON.parse(localStorage.getItem('3va_live_vendors_v1') || '[]');
    const found = vendors.find(v => v.code.toUpperCase() === code) || (code === '3VA-VE101' ? { code: '3VA-VE101', displayName: 'Sample Hospitality Trainer Expert', category: 'Hospitality Trainer Expert', tariff: 'IDR 10,000,000 / month' } : null);
    if (!found) { out.innerHTML = '<span class="small" style="color:#a33">Code <strong>' + code + '</strong> not found in active member ledger.</span>'; return; }
    out.innerHTML = `<div style="background:#fff;padding:12px;border:1px solid #dfe6dc;border-radius:6px;font-size:13px">
      <div style="display:flex;justify-content:space-between;margin-bottom:6px"><strong>Contract: ${found.code} · ${found.displayName}</strong><span style="color:var(--green);font-weight:700">● 70/30 ESCROW ACTIVE</span></div>
      <table style="width:100%;border-collapse:collapse;font-size:12.5px">
        <tr style="border-bottom:1px solid #eee"><td style="padding:5px 0">1. Gross Worker / Vendor Rate (Agreed Contract)</td><td style="text-align:right;font-weight:700">${found.tariff}</td></tr>
        <tr style="border-bottom:1px solid #eee"><td style="padding:5px 0">2. Client Agency / Platform Fee (10%–17% Paid Separately by Service User)</td><td style="text-align:right;color:var(--green)">0% Deducted from Worker</td></tr>
        <tr style="border-bottom:1px solid #eee"><td style="padding:5px 0">3. BPJS JKK/JKM (PP 44/2015) + Flat Online Admin (IDR 200,000 if opted-in)</td><td style="text-align:right">Covered / Transparent</td></tr>
        <tr><td style="padding:6px 0;font-weight:700">4. Net Take-Home Pay Transferred to Vendor Account</td><td style="text-align:right;font-weight:700;color:var(--green)">100% Full Worker Entitlement</td></tr>
      </table>
    </div>`;
  };

  window.addEventListener('DOMContentLoaded', () => {
    injectLedgerPanel();
    const vCat = document.getElementById('vendorCategory');
    if (vCat && ![...vCat.options].some(o => o.value === 'Hospitality Trainer Expert')) {
      const opt = document.createElement('option'); opt.value = 'Hospitality Trainer Expert';
      opt.textContent = 'Hospitality Trainer Expert (IDR 750k–1.5M/day · 8.5M–15M/mo)';
      vCat.appendChild(opt);
    }
  });
})();
