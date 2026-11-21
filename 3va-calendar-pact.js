(function(){
  const RELIGIOUS_HOLIDAYS = [
    '2026-01-16','2026-03-19','2026-03-20','2026-03-21','2026-04-03','2026-05-14','2026-05-27','2026-05-31','2026-06-16','2026-08-25','2026-12-25',
    '2027-01-05','2027-03-08','2027-03-10','2027-03-11','2027-03-26','2027-05-06','2027-05-17','2027-05-20','2027-06-06','2027-08-15','2027-12-25'
  ];
  const NATIONAL_HOLIDAYS = [...RELIGIOUS_HOLIDAYS, '2026-01-01','2026-02-17','2026-05-01','2026-06-01','2026-08-17','2027-01-01','2027-02-06','2027-05-01','2027-06-01','2027-08-17'];

  function checkRestrictedDate(dateStr, mode) {
    if (!dateStr) return null;
    const d = new Date(dateStr + 'T00:00:00');
    if (mode === 'monthly') {
      if (d.getDay() === 0) return 'Sunday rest day is protected under Indonesian Monthly Contract rules.';
      if (NATIONAL_HOLIDAYS.includes(dateStr)) return 'Indonesian National / Religious Holiday (' + dateStr + ') is protected.';
    } else if (RELIGIOUS_HOLIDAYS.includes(dateStr)) {
      return 'Indonesian Major Religious Holiday (' + dateStr + ') is protected even for short-term work.';
    }
    return null;
  }

  function injectVendorAvailabilityAndBpjs() {
    const basis = document.getElementById('vendorRateBasis');
    const vf = document.getElementById('vendorForm');
    if (!basis || !vf || document.getElementById('vendorWorkingAvailBox')) return;

    const box = document.createElement('div');
    box.id = 'vendorWorkingAvailBox';
    box.style.cssText = 'margin-top:10px;padding:12px;background:#edf2eb;border:1px solid #c9d7c4;border-radius:6px';
    box.innerHTML = `<strong style="font-size:12px;color:var(--green)">📅 Working Available Schedule (Indonesia Working Calendar)</strong>
      <div class="small">Visible on front Services catalog so Service Users only book within your confirmed window.</div>
      <div class="form-row" style="margin-top:8px">
        <label>Available From *<input type="date" id="vendorAvailFrom" onkeydown="return false"></label>
        <label>Available To *<input type="date" id="vendorAvailTo" onkeydown="return false"></label>
      </div>
      <div id="bpjsVendorOptBox" style="margin-top:10px;padding-top:8px;border-top:1px dashed #b5c7af">
        <strong style="font-size:12px">🛡️ BPJS Ketenagakerjaan (PP No. 44/2015 — JKK &amp; JKM Protection)</strong>
        <label class="check-item" style="margin-top:4px"><input type="checkbox" id="vendorBpjsOptIn"> <span>For contracts &gt; 1 month (if not registered directly by Service User), authorize <strong>eastventura.biz.id</strong> to process online BPJS JKK/JKM registration (statutory JKK 0.24%–1.74% + JKM 0.30% + <strong>one-time flat admin fee IDR 200,000</strong> deducted transparently on first payout).</span></label>
      </div>`;
    basis.closest('.form-row').insertAdjacentElement('afterend', box);

    const toggleAvail = () => {
      const v = basis.value;
      const show = /Visit|Day|Month|Year/i.test(v);
      box.style.display = show ? 'block' : 'none';
      const r = document.getElementById('vendorRole')?.value || '';
      const bpjsBox = document.getElementById('bpjsVendorOptBox');
      if (bpjsBox) bpjsBox.style.display = (r === 'Human Expert') ? 'block' : 'none';
    };
    basis.addEventListener('change', toggleAvail);
    document.getElementById('vendorRole')?.addEventListener('change', toggleAvail);
    toggleAvail();
  }
  function injectServiceUserSchedule() {
    const panel = document.getElementById('panel-service');
    const form = panel?.querySelector('form');
    if (!form || document.getElementById('userTargetDurationBox')) return;

    const box = document.createElement('div');
    box.id = 'userTargetDurationBox';
    box.style.cssText = 'margin:12px 0;padding:12px;background:#f4efe4;border:1px solid #dfd3ba;border-radius:6px';
    box.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px">
        <strong style="font-size:12px;color:#7a5824">📆 Working Target Duration Request (Indonesia Working Calendar)</strong>
        <button type="button" class="btn" style="background:#b91c1c;color:#fff;padding:4px 10px;font-size:11px" onclick="triggerUrgentWaCall()">🚨 URGENT (Service Call WA)</button>
      </div>
      <div class="form-row" style="margin-top:8px">
        <label>Contract Type *<select id="userContractType"><option value="monthly">Monthly Retainer (&gt; 1 Month · BPJS JKK/JKM Mandatory)</option><option value="short">Short-Term / Lump Sum (&lt; 1 Month / 25–26 Working Days)</option></select></label>
        <label>Client Agency Fee Tier (0% Worker Cut)<select id="userAgencyTier"><option value="10-11%">10% – 11% (Skilled Operational Staff)</option><option value="12-13%">12% – 13% (Certified Technical Specialist)</option><option value="14-15%">14% – 15% (Hospitality Trainer / Chef / WTP Expert)</option><option value="16-17%">16% – 17% (Senior Legal / Chief Engineer Advisor)</option></select></label>
      </div>
      <div class="form-row" style="margin-top:8px">
        <label>From (Commencement Date) *<input type="date" id="userWorkFrom" onkeydown="return false"></label>
        <label>To (Completion Target Date) *<input type="date" id="userWorkTo" onkeydown="return false"></label>
      </div>
      <div id="calGuardMsg" class="small" style="margin-top:6px;color:#7a5824"></div>`;
    form.insertBefore(box, form.querySelector('button[type="submit"]'));

    ['userWorkFrom', 'userWorkTo'].forEach(id => {
      document.getElementById(id)?.addEventListener('change', function() {
        const mode = document.getElementById('userContractType')?.value || 'monthly';
        const err = checkRestrictedDate(this.value, mode);
        const msg = document.getElementById('calGuardMsg');
        if (err) {
          this.value = '';
          if (msg) msg.innerHTML = '⛔ <strong>Blocked:</strong> ' + err + ' Click <strong>URGENT</strong> for emergency Service Call.';
        } else if (msg) {
          msg.textContent = '✓ Valid Indonesian Working Calendar date selected.';
        }
      });
    });
  }

  window.triggerUrgentWaCall = function() {
    const code = document.getElementById('srvSelectedCodeBanner')?.innerText.split('\n') || 'Service Request';
    const d1 = document.getElementById('userWorkFrom')?.value || 'Immediate';
    const d2 = document.getElementById('userWorkTo')?.value || 'TBD';
    if (confirm('URGENT SERVICE CALL (eastventura.biz.id):\nNeed urgent deployment on a holiday/rest day?\n\nClick OK to connect via WhatsApp (+62 812-3707-9929).')) {
      const txt = encodeURIComponent('Halo Admin Service Call eastventura.biz.id, saya membutuhkan layanan URGENT pada hari libur/khusus.\nDetail: ' + code + '\nTarget Jadwal: ' + d1 + ' s.d. ' + d2);
      window.open('https://wa.me' + txt, '_blank');
    }
  };

  window.openBilingualIntegrityPact = function(partyLabel, onConfirm) {
    let modal = document.getElementById('pact2PageModal');
    if (modal) modal.remove();
    const docId = '3VA-PACT-' + Date.now().toString().slice(-6);
    modal = document.createElement('div');
    modal.id = 'pact2PageModal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:99999;overflow:auto;padding:18px';
    modal.innerHTML = `<div id="pactPrintableArea" style="max-width:820px;margin:0 auto;background:#fff;color:#111;padding:26px;border-radius:8px;font-family:Georgia,serif">
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #1b4332;padding-bottom:10px">
        <div><strong style="font-size:16px;color:#1b4332">3VA.ID · EASTVENTURA DIGITAL NCNDA, COMMITMENT &amp; INTEGRITY PACT</strong><div style="font-size:11px;font-family:monospace">DOC ID: ${docId} · ROLE: ${partyLabel} · 2-PAGE VERIFIED RECORD</div></div>
        <div style="font-family:monospace;font-size:11px;border:1px solid #111;padding:4px 8px;letter-spacing:2px">||||| ${docId} |||||</div>
      </div>
      <div style="margin-top:14px;font-size:13px;line-height:1.5">
        <p><strong>PAGE 1 OF 2 — NON-CIRCUMVENTION, TRANSPARENCY &amp; WORKER WELFARE</strong></p>
        <label style="display:block;margin:8px 0"><input type="checkbox" class="pact-chk"> <u>1. Anti-Circumvention (12 Months): Both parties agree not to bypass eastventura.biz.id for direct transactions or poaching within 12 months.</u><br><em style="color:#444">1. Anti-Bypass (12 Bulan): Kedua belah pihak sepakat tidak melakukan transaksi langsung di luar eastventura.biz.id atau membajak SDM selama 12 bulan.</em></label>
        <label style="display:block;margin:8px 0"><input type="checkbox" class="pact-chk"> <u>2. Zero Wage Deduction &amp; Agency Fee (10%–17%): Client pays agency/platform fees separately; 100% of agreed wages belong to the worker.</u><br><em style="color:#444">2. Tanpa Potongan Upah &amp; Agency Fee (10%–17%): Klien membayar biaya agensi/platform secara terpisah; 100% upah yang disepakati menjadi hak penuh pekerja.</em></label>
        <label style="display:block;margin:8px 0"><input type="checkbox" class="pact-chk"> <u>3. BPJS Ketenagakerjaan (PP No. 44/2015 JKK &amp; JKM): Mandatory registration by Service User for monthly contracts &gt; 1 month, or self/eastventura.biz.id online facilitation (IDR 200,000 flat admin) for short-term/opted-in workers.</u><br><em style="color:#444">3. BPJS Ketenagakerjaan (PP No. 44/2015 JKK &amp; JKM): Pendaftaran wajib oleh Pengguna Jasa untuk kontrak bulanan &gt; 1 bulan, atau mandiri/fasilitasi online eastventura.biz.id (admin flat IDR 200.000) bagi pekerja jangka pendek/yang menyetujui.</em></label>
        <hr style="margin:14px 0;border:0;border-top:1px dashed #999">
        <p><strong>PAGE 2 OF 2 — ESCROW 70/30, INDONESIAN WORKING CALENDAR &amp; FORCE MAJEURE</strong></p>
        <label style="display:block;margin:8px 0"><input type="checkbox" class="pact-chk"> <u>4. 70/30 Escrow &amp; Working Calendar Compliance: Parties honor 70% DP / 30% completion escrow and Indonesian rest days/religious holidays.</u><br><em style="color:#444">4. Kepatuhan Escrow 70/30 &amp; Kalender Kerja Indonesia: Para pihak mematuhi escrow 70% DP / 30% pelunasan serta hari libur nasional/keagamaan Indonesia.</em></label>
        <label style="display:block;margin:8px 0"><input type="checkbox" class="pact-chk"> <u>5. Force Majeure Clause: Neither party shall be liable for delays caused by natural disasters, extreme weather, or government decrees.</u><br><em style="color:#444">5. Klausul Force Majeure: Tidak ada pihak yang dibebani sanksi atas keterlambatan akibat bencana alam, cuaca ekstrem, atau kebijakan pemerintah.</em></label>
      </div>
      <div style="margin-top:16px;display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px">
        <button type="button" class="btn secondary" onclick="document.getElementById('pact2PageModal').remove()">Cancel</button>
        <div style="display:flex;gap:8px">
          <button type="button" class="btn" onclick="window.print()">🖨️ Print / Save 2-Page PDF</button>
          <button type="button" class="btn gold" id="pactSignConfirmBtn">I Agree &amp; Electronically Sign</button>
        </div>
      </div>
    </div>`;
    document.body.appendChild(modal);
    document.getElementById('pactSignConfirmBtn').onclick = () => {
      const chks = [...modal.querySelectorAll('.pact-chk')];
      const isAuth = window.is3vaSuperAdmin || sessionStorage.getItem('3va_author_session_open')==='1' || sessionStorage.getItem('3va_sa_unlocked')==='1';
      if (isAuth) chks.forEach(c => c.checked = true);
      if (chks.some(c => !c.checked)) return alert('Please check all 5 bilingual Integrity Pact clauses before signing.');
      modal.remove();
      if (typeof window.open3va === 'function') {
        const catEl = document.getElementById("srvUserCategory") || document.querySelector("#panel-service select:not(#srvRole)");
        const catTxt = catEl ? catEl.value : "Service User Request";
        window.open3va("service", 0, null, { code: "3VA-SRV-EXP (" + catTxt + ")" });
      } else if (typeof onConfirm === 'function') onConfirm();
    };
  };

  window.addEventListener('DOMContentLoaded', () => {
    injectVendorAvailabilityAndBpjs();
    injectServiceUserSchedule();
    const sForm = document.querySelector('#panel-service form');
    if (sForm && !sForm.dataset.pactBound) {
      sForm.dataset.pactBound = '1';
      sForm.removeAttribute('onsubmit');
      sForm.addEventListener('submit', (e) => {
        e.preventDefault();
        openBilingualIntegrityPact('SERVICE USER (CLIENT)', () => {
          alert('Signed! Your Service User request & 2-Page Integrity Pact have been recorded.');
        });
      });
    }
  });
})();
