(function(){
  const SRV_CATALOG = {
    '3VA-SRV-01': { name: 'Sales & Land Consultant', agencyFee: '2% – 3% Commission (Asset Transaction)', rate: 'Commission: 2% – 3% (Tiered)' },
    '3VA-SRV-02': { name: 'Legal Curator & Advisor', agencyFee: '16% – 17% Client Agency Fee (0% Worker Cut)', rate: 'IDR 2,500,000 – 5,000,000 / scope' },
    '3VA-SRV-03': { name: 'Renovation & Fit-Out', agencyFee: '12% – 13% Client Agency Fee (0% Worker Cut)', rate: 'IDR 3.2M – 5.5M / m² · Labor: IDR 250k – 450k / day' },
    '3VA-SRV-04': { name: 'House Keeper & Butler', agencyFee: '10% – 15% Client Agency Fee (0% Worker Cut)', rate: 'IDR 150k – 250k / visit · IDR 2.8M – 4.2M / mo' },
    '3VA-SRV-05': { name: 'Pools & Spa Maintenance', agencyFee: '10% – 11% Client Agency Fee (0% Worker Cut)', rate: 'IDR 650k – 1.2M / mo · IDR 350k – 600k / visit' },
    '3VA-SRV-06': { name: 'MEP & Power Engineering', agencyFee: '12% – 15% Client Agency Fee (0% Worker Cut)', rate: 'IDR 250k – 450k / point · Retainer: IDR 2.0M – 4.5M / mo' },
    '3VA-SRV-07': { name: 'Air Conditioner & Pest Control', agencyFee: '12% – 13% Client Agency Fee (0% Worker Cut)', rate: 'AC Wash: IDR 85k – 125k · Pest: IDR 250k – 500k' },
    '3VA-SRV-08': { name: 'Hospitality Trainer Expert', agencyFee: '14% – 15% Client Agency Fee (0% Worker Cut)', rate: 'Workshop: IDR 750k – 1.5M / day · IDR 8.5M – 15M / mo' },
    '3VA-SRV-09': { name: 'Fire Safety Equipment Supplier', agencyFee: '12% – 15% Client Agency Fee (0% Worker Cut)', rate: 'Inspection/Refill: IDR 250k – 850k / unit · System: Quoted' }
  };

  window.selectServiceCode = function(code, label) {
    if (typeof window.openLogin === 'function') window.openLogin();
    if (typeof window.switchTab === 'function') window.switchTab('service');
    var uRole = document.getElementById('srvRole');
    if (uRole) {
      uRole.value = String(code).indexOf('CORP') !== -1 ? 'Corporate Vendor' : 'Human Expert';
      if (typeof uRole.onchange === 'function') uRole.onchange();
    }
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
      <div><strong style="color:var(--green)">🔒 Member-Only Real-Time Payment &amp; Payment Transparency Ledger</strong><div class="small">Verify exact worker net pay (0% deduction) vs. client agency fee in real time.</div></div>
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
      <div style="display:flex;justify-content:space-between;margin-bottom:6px"><strong>Contract: ${found.code} · ${found.displayName}</strong><span style="color:var(--green);font-weight:700">● 70/30 MILESTONE ACTIVE</span></div>
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
    if (vCat && ![...vCat.options].some(o => o.value === 'Fire Safety Equipment Supplier')) {
      const opt9 = document.createElement('option'); opt9.value = 'Fire Safety Equipment Supplier';
      opt9.textContent = 'Fire Safety Equipment Supplier (APAR, Hydrant, Alarm & K3 Audit)';
      vCat.appendChild(opt9);
    }
  });
})();
(function() {
  function injectPostMajeureVault() {
    var isAuth = window.is3vaSuperAdmin || sessionStorage.getItem('3va_author_session_open') === '1' || sessionStorage.getItem('3va_sa_unlocked') === '1';
    var box = document.getElementById('realtimeLedgerBox');
    if (!isAuth || !box || document.getElementById('evaPostMajeureVault')) return;
    var v = document.createElement('div');
    v.id = 'evaPostMajeureVault';
    v.style.cssText = 'margin-top:12px;padding:12px;background:#fefce8;border:1.5px solid #ca8a04;border-radius:6px;font-size:12px;color:#1e293b;';
    v.innerHTML = '<div style="font-weight:800;color:#854d0e;margin-bottom:4px;">🛡️ AUTHOR CONFIDENTIAL REMINDER: POST-MAJEURE RESERVE &amp; REKENING KHUSUS</div>' +
      '<div style="font-size:11px;line-height:1.5;margin-bottom:8px;">• <b>Alokasi Internal:</b> Maks. <b>2,5%</b> dari 100% Net Profit transaksi <i>Land + Property</i> (Closed by Buyer) &amp; maks. <b>2,5%</b> dari 100% Net Profit transaksi <i>Services</i> (Closed by Service User).<br>' +
      '• <b>Pemisahan Rekening:</b> Wajib segera dipindahkan ke <b>Rekening Khusus Perusahaan (Official Operational Account)</b> selain rekening operasional utama EASTVENTURA agar tidak tercampur.<br>' +
      '• <b>Tutup Buku 1 Tahun Kalender:</b> Jika nihil klaim Force Majeure selama 1 tahun penuh, dana kembali menjadi hak EASTVENTURA untuk disalurkan ke program <b>Infaq / Shodaqoh / Jariyah</b>.</div>' +
      '<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;">' +
      '<input type="number" id="pmNetProfitInput" placeholder="Input Net Profit Closing (IDR)" style="padding:5px 8px;border:1px solid #cbd5e1;border-radius:4px;font-size:12px;width:210px;">' +
      '<button type="button" class="btn" style="padding:5px 10px;font-size:11.5px;" onclick="(function(){var n=parseFloat(document.getElementById(\'pmNetProfitInput\').value)||0;var r=Math.round(n*0.025);document.getElementById(\'pmCalcOut\').innerHTML=\'Transfer ke Rek. Khusus (2,5%): <b>Rp \'+r.toLocaleString(\'id-ID\')+\'</b> | Net Profit Utama: <b>Rp \'+(n-r).toLocaleString(\'id-ID\')+\'</b>\';})()">Hitung Transfer Rek. Khusus</button>' +
      '<span id="pmCalcOut" style="font-size:11.5px;color:#065f46;"></span></div>';
    box.appendChild(v);
  }
  window.addEventListener('DOMContentLoaded', function() { setTimeout(injectPostMajeureVault, 2500); });
  setInterval(injectPostMajeureVault, 1500);
})();
