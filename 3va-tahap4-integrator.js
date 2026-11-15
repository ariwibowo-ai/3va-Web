(function(){

  window.openAuthorPinModal = function() {
    let m = document.getElementById('evaAuthorPinModal');
    if (m) m.remove();
    m = document.createElement('div');
    m.id = 'evaAuthorPinModal';
    m.style.cssText = 'position:fixed;inset:0;background:rgba(15,28,22,0.82);z-index:10099;display:flex;align-items:center;justify-content:center;padding:16px;';
    m.innerHTML = '<div style="background:#162b22;color:#f3d27a;border:1.5px solid #c59b27;border-radius:12px;padding:20px;max-width:340px;width:100%;font-family:system-ui,sans-serif;box-shadow:0 16px 40px rgba(0,0,0,0.45);">' +
      '<div style="font-size:13.5px;font-weight:700;margin-bottom:6px;">🛡️ Author Security Verification</div>' +
      '<div style="font-size:11.5px;color:#d1dbd4;margin-bottom:12px;">Enter your private Author PIN to unlock full editing access:</div>' +
      '<input id="evaAuthorPinInput" type="password" autocomplete="new-password" placeholder="•••••••" style="width:100%;box-sizing:border-box;padding:9px 12px;border-radius:8px;border:1px solid #c59b27;background:#0f1d17;color:#fff;font-size:16px;letter-spacing:4px;margin-bottom:14px;">' +
      '<div style="display:flex;justify-content:flex-end;gap:8px;">' +
      '<button type="button" onclick="document.getElementById(\'evaAuthorPinModal\').remove()" style="background:transparent;color:#d1dbd4;border:1px solid #4b6356;padding:6px 12px;border-radius:999px;font-size:11.5px;cursor:pointer;">Cancel</button>' +
      '<button type="button" id="evaAuthorPinSubmit" style="background:#c59b27;color:#162b22;border:none;padding:6px 16px;border-radius:999px;font-size:11.5px;font-weight:800;cursor:pointer;">Unlock</button>' +
      '</div></div>';
    document.body.appendChild(m);
    const inp = document.getElementById('evaAuthorPinInput');
    inp.focus();
    const verify = () => {
      if ((inp.value || '').trim().toUpperCase() === '3VA2026') {
        m.remove();
        window.is3vaSuperAdmin = true; sessionStorage.setItem('3va_sa_unlocked', '1'); syncAuthorState();
        alert('Author Mode Unlocked: Full editing & validation bypass active across all tabs.');
      } else {
        inp.value = ''; inp.placeholder = 'Invalid PIN — Try Again'; inp.style.borderColor = '#ef4444';
      }
    };
    document.getElementById('evaAuthorPinSubmit').onclick = verify;
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') verify(); });
  };

  
  function fixMobileMemberLogin() {
    document.querySelectorAll('.navbtn, a, button').forEach(el => {
      if (/member\s*login/i.test(el.textContent || '') && !el.dataset.mobFixed) {
        el.dataset.mobFixed = '1';
        el.addEventListener('click', function() {
          const nav = document.getElementById('navlinks');
          if (nav) { nav.classList.remove('open', 'active', 'show'); if (window.innerWidth <= 768) nav.style.display = ''; }
          if (typeof window.toggleMembershipMinimize === 'function') window.toggleMembershipMinimize(false);
          const mem = document.getElementById('membership');
          if (mem) { mem.style.display = 'block'; setTimeout(() => mem.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80); }
        }, true);
      }
    });
  }
  window.openBilingualIntegrityPact = function(opts) {
    const data = Object.assign({
      code: '3VA-SRV-04', grossFee: 'IDR 4,000,000',
      agencyFee: 'IDR 480,000 (12% Paid Separately by Service User)',
      netPay: 'IDR 4,000,000 (or IDR 3,730,000 after voluntary BPJS + IDR 200k admin)'
    }, opts || {});
    let modal = document.getElementById('evaBilingualPactModal');
    if (modal) modal.remove();
    modal = document.createElement('div'); modal.id = 'evaBilingualPactModal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(15,28,22,0.82);z-index:10050;overflow-y:auto;padding:16px;display:flex;justify-content:center;align-items:flex-start;';
    const verifyHash = '3VA-PACT-' + Date.now().toString(36).toUpperCase();
    modal.innerHTML = '<div id="evaPactPrintable" style="background:#fff;max-width:780px;width:100%;border-radius:10px;padding:22px;border:2px solid #c59b27;color:#1a241e;font-family:Georgia,serif;">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #162b22;padding-bottom:8px;margin-bottom:12px;flex-wrap:wrap;gap:8px;">' +
      '<div><div style="font-size:10.5px;font-weight:700;color:#8a6a14;font-family:sans-serif;">PAGE 1 OF 2 · EASTVENTURA (3VA.ID) OFFICIAL DIGITAL AGREEMENT</div><h3 style="margin:2px 0;font-size:16px;color:#162b22;">BILINGUAL INTEGRITY PACT &amp; SERVICE ESCROW COMMITMENT</h3></div>' +
      '<div style="text-align:right;font-family:monospace;font-size:10px;background:#f4f7f4;padding:5px 9px;border:1px solid #162b22;border-radius:4px;"><div style="letter-spacing:2px;font-weight:900;font-size:12px;">||||| || |||| ||| ||||</div><div>VERIFY: ' + verifyHash + '</div></div></div>' +
      '<div style="font-size:12px;line-height:1.5;margin-bottom:10px;">' +
      '<label style="display:flex;gap:8px;margin-bottom:8px;cursor:pointer;"><input type="checkbox" class="pact-req-chk"><span><u><strong>1. Non-Circumvention Clause:</strong> Both parties strictly agree not to bypass 3va.id for repeat engagements or direct off-platform payments within 24 months.</u><br><em style="color:#4b5563;"><strong>1. Klausul Anti-Bypass:</strong> Kedua belah pihak sepakat tidak memotong jalur 3va.id dalam transaksi lanjutan maupun pembayaran langsung di luar platform selama 24 bulan.</em></span></label>' +
      '<label style="display:flex;gap:8px;margin-bottom:8px;cursor:pointer;"><input type="checkbox" class="pact-req-chk"><span><u><strong>2. Zero Worker Cut &amp; 70/30 Escrow:</strong> 100% of agreed worker fee belongs to the Individual Vendor. Platform/Agency fees (10%–17%) are paid separately by Service User.</u><br><em style="color:#4b5563;"><strong>2. Tanpa Potongan Pekerja &amp; Escrow 70/30:</strong> 100% upah menjadi hak penuh Individual Vendor. Biaya platform/agensi (10%–17%) dibayar terpisah oleh Service User.</em></span></label></div>' +
      '<div style="border-top:2px dashed #c59b27;padding-top:10px;">' +
      '<div style="font-size:10.5px;font-weight:700;color:#8a6a14;font-family:sans-serif;margin-bottom:6px;">PAGE 2 OF 2 · REAL-TIME 4-LINE TRANSPARENCY SCHEDULE</div>' +
      '<table style="width:100%;border-collapse:collapse;font-size:11.5px;font-family:sans-serif;margin-bottom:10px;background:#f9fbf9;border:1px solid #c9d7c4;">' +
      '<tr style="border-bottom:1px solid #dce5d8;"><td style="padding:6px 8px;"><strong>a. Gross Service Fee Paid by Service User</strong> / <em>Upah Bruto Dibayar Klien</em></td><td style="padding:6px 8px;text-align:right;font-weight:700;">' + data.grossFee + '</td></tr>' +
      '<tr style="border-bottom:1px solid #dce5d8;"><td style="padding:6px 8px;"><strong>b. Platform / Agency Fee (Paid Separately by Service User)</strong> / <em>0% Deducted from Worker</em></td><td style="padding:6px 8px;text-align:right;color:#166534;font-weight:700;">' + data.agencyFee + '</td></tr>' +
      '<tr style="border-bottom:1px solid #dce5d8;"><td style="padding:6px 8px;"><strong>c. Authorized Deductions (Only if Opted-In by Vendor)</strong> / <em>BPJS JKK/JKM + Flat IDR 200.000 Admin</em></td><td style="padding:6px 8px;text-align:right;">Opt-In / Voluntary</td></tr>' +
      '<tr><td style="padding:6px 8px;"><strong>d. Net Take-Home Pay Transferred to Vendor</strong> / <em>Pending DP → 70% Escrow → 100% Disbursed</em></td><td style="padding:6px 8px;text-align:right;font-weight:700;color:#162b22;">' + data.netPay + '</td></tr></table>' +
      '<label style="display:flex;gap:8px;margin-bottom:12px;cursor:pointer;font-size:12px;"><input type="checkbox" class="pact-req-chk"><span><u><strong>3. Electronic Signature &amp; Holiday Compliance:</strong> Both parties acknowledge Indonesian public/religious holiday protections and verify this 2-page pact prior to Checkout.</u><br><em style="color:#4b5563;"><strong>3. Pengesahan Elektronik &amp; Kalender Kerja:</strong> Kedua belah pihak menyetujui perlindungan hari libur nasional/keagamaan dan mengesahkan pakta 2 halaman ini sebelum Checkout.</em></span></label></div>' +
      '<div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px;border-top:1px solid #ddd;padding-top:10px;font-family:sans-serif;">' +
      '<div style="display:flex;gap:6px;"><button type="button" onclick="window.print()" style="background:#f3f4f6;color:#162b22;border:1px solid #162b22;padding:6px 10px;border-radius:6px;font-size:11.5px;font-weight:700;cursor:pointer;">🖨️ Print / Save 2-Page PDF</button><button type="button" onclick="document.getElementById(\'evaBilingualPactModal\').remove()" style="background:#fff;color:#666;border:1px solid #ccc;padding:6px 10px;border-radius:6px;font-size:11.5px;cursor:pointer;">Close</button></div>' +
      '<button type="button" id="evaSignPactBtn" style="background:#162b22;color:#f3d27a;border:1.5px solid #c59b27;padding:8px 14px;border-radius:6px;font-size:11.5px;font-weight:800;cursor:pointer;">✍️ I Agree and Electronically Sign → Checkout</button></div></div>';
    document.body.appendChild(modal);
    modal.dataset.vhash = verifyHash;
    modal.dataset.vcode = data.code;
  };
  document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'evaSignPactBtn') {
      const modal = document.getElementById('evaBilingualPactModal');
      if (!modal) return;
      const chks = [...modal.querySelectorAll('.pact-req-chk')];
      if (!window.is3vaSuperAdmin && sessionStorage.getItem('3va_author_session_open')!=='1' && chks.some(c => !c.checked)) {
        alert('Please check all 3 mandatory bilingual clauses before signing.');
        return;
      }
      const vhash = modal.dataset.vhash || '3VA-VERIFIED';
      const vcode = modal.dataset.vcode || '3VA-SRV';
      modal.remove();
      alert('✅ Electronically Signed (' + vhash + ')! Opening Verified Checkout & Real-Time Ledger...');
      if (typeof window.openCheckoutModal === 'function') window.openCheckoutModal(vcode);
    }
  });

  setInterval(() => {
    // ditangani oleh 3va-ux-admin-enhancer.js fixMobileMemberLogin();
    const box = document.getElementById('realtimeLedgerBox');
    if (box && !box.dataset.privUpgraded) {
      box.dataset.privUpgraded = '1';
      const n = document.createElement('div');
      n.style.cssText = 'margin-top:8px;padding-top:8px;border-top:1px dashed #c9d7c4;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px;font-size:11.5px;';
      n.innerHTML = '<span>🛡️ <strong>Private Role-Gated Access:</strong> Visible strictly to contracted Vendor, Service User, and <strong>Author</strong>.</span><button type="button" onclick="window.openBilingualIntegrityPact()" style="background:#162b22;color:#f3d27a;border:1px solid #c59b27;padding:5px 11px;border-radius:999px;font-size:11px;font-weight:700;cursor:pointer;">📄 Preview 2-Page Bilingual Integrity Pact (PDF + Barcode)</button>';
      box.appendChild(n);
    }
    const srvPanel = document.getElementById('panel-service');
    if (srvPanel && !srvPanel.dataset.pactHooked) {
      srvPanel.dataset.pactHooked = '1';
      const btn = srvPanel.querySelector('button[type="submit"], .btn');
      if (btn) btn.addEventListener('click', (e) => { e.preventDefault(); window.openBilingualIntegrityPact({ code: '3VA-SRV-CUSTOM' }); });
    }
  }, 15000);

  // 5. STRICT CATALOG GOVERNANCE: Hapus tombol edit frontend pada kartu layanan (.service)
  // Penambahan/editing item layanan HANYA melalui editing index.html di terminal.
  function lockServiceCatalogFromFrontendEdit() {
    document.querySelectorAll('#services .service .eva-sa-toolbar').forEach(el => el.remove());
  }

  // 6. PASANG BILINGUAL INTEGRITY PACT & ESCROW COMMITMENT DI KEDUA SISI (SERVICE USER & VENDOR)
  // Berlaku identik di Desktop Mozilla maupun Mobile Phone tanpa popup loop.
  function attachUnifiedBilingualPactTriggers() {
    ['panel-service', 'panel-vendor'].forEach(panelId => {
      const panel = document.getElementById(panelId);
      if (!panel) return;
      const roleLabel = panelId === 'panel-service' ? 'Service User' : 'Individual Service Vendor';

      // Tambahkan tombol pemicu eksplisit di atas tombol submit jika belum ada
      if (!panel.querySelector('.eva-pact-launch-box')) {
        const box = document.createElement('div');
        box.className = 'eva-pact-launch-box';
        box.style.cssText = 'margin:12px 0;padding:12px;background:#f4f7f4;border:1.5px solid #c59b27;border-radius:8px;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px;';
        box.innerHTML = '<div style="font-size:12px;color:#162b22;"><strong>📜 Mandatory Bilingual Integrity Pact &amp; Escrow Commitment (' + roleLabel + ')</strong><div style="font-size:11px;color:#4b5563;">2-Page Bilingual PDF + Verification Barcode required before Checkout.</div></div>' +
          '<button type="button" class="eva-open-pact-btn" style="background:#162b22;color:#f3d27a;border:1px solid #c59b27;padding:7px 14px;border-radius:999px;font-size:11.5px;font-weight:700;cursor:pointer;">✍️ Open &amp; Sign 2-Page Pact</button>';
        const submitBtn = panel.querySelector('button[type="submit"], button.btn, input[type="submit"]');
        if (submitBtn && submitBtn.parentNode) {
          submitBtn.parentNode.insertBefore(box, submitBtn);
        } else {
          panel.appendChild(box);
        }
        box.querySelector('.eva-open-pact-btn').addEventListener('click', function(ev) {
          ev.preventDefault(); ev.stopPropagation();
          const sel = panel.querySelector('select');
          const chosenCode = (sel && sel.value) ? sel.value.split(' ')[0] : '3VA-SRV-01';
          window.openBilingualIntegrityPact({ code: chosenCode, partyRole: roleLabel });
        });
      }

      // Cegat tombol Submit asli agar tidak memicu Strict Validation popup berulang-ulang
      panel.querySelectorAll('button[type="submit"], button.btn, input[type="submit"]').forEach(btn => {
        if (btn.classList.contains('eva-open-pact-btn') || btn.dataset.strictIntercepted) return;
        btn.dataset.strictIntercepted = '1';
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          const sel = panel.querySelector('select');
          const chosenCode = (sel && sel.value) ? sel.value.split(' ')[0] : '3VA-SRV-01';
          window.openBilingualIntegrityPact({ code: chosenCode, partyRole: roleLabel });
        }, true);
      });
    });
  }

  setInterval(() => {
    lockServiceCatalogFromFrontendEdit();
    attachUnifiedBilingualPactTriggers();
  }, 15000);

  // 7. BERSIHKAN TOMBOL LAMA "Authorization" & PERTAHANKAN HANYA LENCANA MUNGIL "Author"
  let lastAuthorState = null;

  function applyAuthorBadgeAndExpertsVisibility() {
    // 1. Sembunyikan tombol lama Authorization hanya jika terlihat
    document.querySelectorAll('button, a, div').forEach(el => {
      if (el.id === 'evaMiniAuthorBtn' || el.children.length > 0) return;
      if (/authorization/i.test((el.textContent || '').trim()) && el.style.display !== 'none') {
        el.style.setProperty('display', 'none', 'important');
      }
    });

    // 2. Render tombol Author ukuran & badge elegan semula HANYA JIKA state berubah (0% kedipan)
    const active = (sessionStorage.getItem('3va_author_session_open')==='1' || !!window.is3vaSuperAdmin);
    const mini = document.getElementById('evaMiniAuthorBtn');
    if (mini && lastAuthorState !== active) {
      lastAuthorState = active;
      mini.textContent = active ? '✦ Author (Open)' : 'Author';
      mini.style.cssText = 'position:fixed;bottom:14px;right:14px;z-index:9998;' +
        'background:' + (active ? '#c59b27' : '#162b22') + ';' +
        'color:' + (active ? '#162b22' : '#f3d27a') + ';' +
        'border:1.5px solid #c59b27;padding:7px 15px;border-radius:999px;' +
        'font-size:12.5px;font-weight:700;letter-spacing:0.5px;line-height:1.2;' +
        'cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,0.28);transition:all 0.2s ease;';
    }

    // 3. Sembunyikan seluruh box Verified Human Experts jika belum ada member terdaftar
    let vendors = [];
    try {
      vendors = JSON.parse(localStorage.getItem('3va_live_vendors_v1') || '[]')
        .filter(v => v && v.displayName && !/^3VA-VE1(0[1-9]|1[0-5])$/i.test(v.code || ''));
    } catch (e) { vendors = []; }

    document.querySelectorAll('section, div').forEach(box => {
      const heading = box.querySelector('h2, h3');
      if (heading && /Verified (Service Vendors|Human Experts)/i.test(heading.textContent || '')) {
        if (heading.textContent.indexOf('Verified Service Vendors') !== -1) {
          heading.textContent = 'Verified Human Experts';
        }
        // Tampilkan hanya jika ada minimal 1 Human Expert sungguhan yang terdaftar
        const shouldShow = vendors.length > 0;
        const targetDisp = shouldShow ? '' : 'none';
        if (box.style.display !== targetDisp) {
          box.style.display = targetDisp;
        }
      }
    });
  }

  // Bersihkan data dummy lama (3VA-VE101..115) dari localStorage secara otomatis satu kali
  try {
    const raw = JSON.parse(localStorage.getItem('3va_live_vendors_v1') || '[]');
    const cleaned = raw.filter(v => v && !/^3VA-VE1(0[1-9]|1[0-5])$/i.test(v.code || ''));
    if (cleaned.length !== raw.length) {
      localStorage.setItem('3va_live_vendors_v1', JSON.stringify(cleaned));
    }
  } catch (e) {}

  window.addEventListener('DOMContentLoaded', applyAuthorBadgeAndExpertsVisibility);
  setInterval(applyAuthorBadgeAndExpertsVisibility, 1200);
})();
