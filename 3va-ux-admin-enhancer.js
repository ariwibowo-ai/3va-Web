(function(){
  const SESSION_KEY = '3va_author_session_open';
  const LAST_ACTIVE_KEY = '3va_author_last_active';
  const IDLE_LIMIT_MS = 7 * 60 * 1000;

  function isAuthorOpen() {
    if (sessionStorage.getItem(SESSION_KEY) !== '1') return false;
    const last = parseInt(sessionStorage.getItem(LAST_ACTIVE_KEY) || '0', 10);
    if (last && (Date.now() - last > IDLE_LIMIT_MS)) {
      setAuthorState(false);
      return false;
    }
    return true;
  }

  function touchActivity() {
    if (sessionStorage.getItem(SESSION_KEY) === '1') {
      sessionStorage.setItem(LAST_ACTIVE_KEY, String(Date.now()));
    }
  }

  function setAuthorState(open) {
    window.is3vaSuperAdmin = open;
    window.is3vaSuperAuth = open;
    window.isAdminAuthorized = open;
    window.superAdminUnlocked = open;
    if (open) {
      sessionStorage.setItem(SESSION_KEY, '1');
      sessionStorage.setItem('3va_sa_unlocked', '1');
      sessionStorage.setItem(LAST_ACTIVE_KEY, String(Date.now()));
    } else {
      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem('3va_sa_unlocked');
      sessionStorage.removeItem(LAST_ACTIVE_KEY);
    }
    applyUnrestrictedMode(open);
    updateAuthorButtonUI(open);
  }

  // Override validasi browser bawaan agar Super User tidak pernah diblokir
  const origCheck = HTMLFormElement.prototype.checkValidity;
  HTMLFormElement.prototype.checkValidity = function() {
    return isAuthorOpen() ? true : origCheck.apply(this, arguments);
  };
  const origReport = HTMLFormElement.prototype.reportValidity;
  HTMLFormElement.prototype.reportValidity = function() {
    return isAuthorOpen() ? true : origReport.apply(this, arguments);
  };
  const origAlert = window.alert;
  window.alert = function(msg) {
    if (isAuthorOpen() && typeof msg === 'string' && /(strict validation|harap lengkapi|wajib|required|please fill|check all)/i.test(msg)) {
      return;
    }
    return origAlert.apply(this, arguments);
  };

  function applyUnrestrictedMode(open) {
    document.querySelectorAll('form').forEach(f => { f.noValidate = open; });
    document.querySelectorAll('input, select, textarea').forEach(el => {
      if (open) {
        if (el.hasAttribute('required') || el.required) {
          el.dataset.origReq = '1';
          el.removeAttribute('required');
          el.required = false;
        }
        el.disabled = false;
        el.readOnly = false;
        el.classList.remove('eva-err', 'error', 'invalid');
        el.style.borderColor = '';
        el.style.backgroundColor = '';
      } else if (el.dataset.origReq === '1') {
        el.setAttribute('required', 'required');
        el.required = true;
      }
    });

    // Pasang atau lepas toolbar edit cepat pada kartu Lahan & Properti
    document.querySelectorAll('#landCards .card, #propertyCards .card').forEach(card => {
      let bar = card.querySelector('.eva-su-cardbar');
      if (!open) {
        if (bar) bar.remove();
        card.querySelectorAll('[contenteditable="true"]').forEach(el => el.removeAttribute('contenteditable'));
        return;
      }
      if (!bar) {
        bar = document.createElement('div');
        bar.className = 'eva-su-cardbar';
        bar.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap;margin-top:10px;padding-top:8px;border-top:1px dashed #c59b27;';
        bar.innerHTML =
          '<button type="button" class="su-edit-btn" style="font-size:11px;font-weight:700;padding:4px 9px;border-radius:5px;border:1px solid #162b22;background:#fffbeb;color:#162b22;cursor:pointer;">Edit Teks</button>' +
          '<button type="button" class="su-sold-btn" style="font-size:11px;font-weight:700;padding:4px 9px;border-radius:5px;border:1px solid #162b22;background:#fef2f2;color:#7f1d1d;cursor:pointer;">Sold Out</button>' +
          '<button type="button" class="su-del-btn" style="font-size:11px;font-weight:700;padding:4px 9px;border-radius:5px;border:1px solid #7f1d1d;background:#7f1d1d;color:#fff;cursor:pointer;">Hapus Kartu</button>';
        bar.querySelector('.su-edit-btn').onclick = function() {
          const ed = card.dataset.suEd === '1';
          card.dataset.suEd = ed ? '0' : '1';
          card.querySelectorAll('h3, p, .price, .meta, .tag').forEach(el => {
            el.contentEditable = ed ? 'false' : 'true';
            el.style.outline = ed ? '' : '1px dashed #c59b27';
          });
          this.textContent = ed ? 'Edit Teks' : 'Simpan Teks';
        };
        bar.querySelector('.su-sold-btn').onclick = function() {
          let st = card.querySelector('.eva-su-sold');
          if (st) { st.remove(); card.style.opacity = '1'; }
          else {
            st = document.createElement('div'); st.className = 'eva-su-sold';
            st.textContent = 'SOLD OUT · VERIFIED BY AUTHOR';
            st.style.cssText = 'margin-top:6px;padding:4px 8px;background:#7f1d1d;color:#fff;font-size:11px;font-weight:800;border-radius:4px;text-align:center;';
            card.insertBefore(st, bar); card.style.opacity = '0.82';
          }
        };
        bar.querySelector('.su-del-btn').onclick = function() {
          if (confirm('Hapus kartu listing ini dari tampilan?')) card.remove();
        };
        card.appendChild(bar);
      }
    });
  }

  function updateAuthorButtonUI(open) {
    document.querySelectorAll('#evaAdminPinBtn, #evaSuperAdminQuickBtn').forEach(el => el.remove());
    let btn = document.getElementById('evaMiniAuthorBtn');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'evaMiniAuthorBtn';
      btn.type = 'button';
      btn.style.cssText = 'position:fixed;bottom:14px;right:14px;z-index:99999;border:1.5px solid #c59b27;padding:7px 15px;border-radius:6px;font-size:12.5px;font-weight:700;cursor:pointer;';
      btn.onclick = function(e) {
        e.preventDefault(); e.stopPropagation();
        if (isAuthorOpen()) {
          if (confirm('Kunci kembali akses Author?')) setAuthorState(false);
          return;
        }
        const pin = prompt('Masukkan PIN Author:');
        if (pin && pin.trim().toUpperCase() === '3VA2026') {
          setAuthorState(true);
        } else if (pin !== null) {
          alert('PIN tidak valid.');
        }
      };
      document.body.appendChild(btn);
    }
    btn.textContent = open ? 'Author · Open' : 'Author';
    btn.style.background = open ? '#c59b27' : '#162b22';
    btn.style.color = open ? '#162b22' : '#f3d27a';
  }

  ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'].forEach(evt => {
    window.addEventListener(evt, touchActivity, { passive: true });
  });

  // Pastikan setiap kali tab/langkah berubah saat Author terbuka, seluruh pembatasan langsung dilepas
  document.addEventListener('click', function() {
    if (isAuthorOpen()) {
      touchActivity();
      setTimeout(() => applyUnrestrictedMode(true), 50);
    }
  }, true);

  setInterval(() => {
    if (sessionStorage.getItem(SESSION_KEY) === '1' && !isAuthorOpen()) {
      setAuthorState(false);
    }
  }, 5000);

  const boot = () => setAuthorState(isAuthorOpen());
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

/* === SELECTIVE CARD ACTIVATOR & EXTENDED AUTHOR DRAWER === */
(function() {
  const ACT_KEY = '3va_activated_cards_v1';
  const LAND_CODES = ['3VA-101', '3VA-102', '3VA-103'];
  const PROP_CODES = ['3VA-201', '3VA-202', '3VA-203'];
  const CORP_CODES = Array.from({length: 10}, (_, i) => '3VA-CV-' + String(i + 1).padStart(2, '0'));
  const EXP_CODES  = Array.from({length: 18}, (_, i) => '3VA-XP-' + String(i + 1).padStart(2, '0'));
  const ALL_CODES  = LAND_CODES.concat(PROP_CODES, CORP_CODES, EXP_CODES);

  function getActiveSet() {
    try {
      const raw = localStorage.getItem(ACT_KEY);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch (e) { return new Set(); }
  }
  function saveActiveSet(set) {
    localStorage.setItem(ACT_KEY, JSON.stringify(Array.from(set)));
  }
  function isAuthOpen() {
    return sessionStorage.getItem('3va_author_session_open') === '1' || sessionStorage.getItem('3va_sa_unlocked') === '1';
  }
  function getCardCode(cardEl) {
    const txt = (cardEl.textContent || '');
    const m = txt.match(/3VA-(?:10\d|20\d|CV-\d{2}|XP-\d{2})/);
    return m ? m[0] : '';
  }
  window.apply3vaSelectiveVisibility = function() {
    const active = getActiveSet(), open = isAuthOpen();
    const groups = [
      { sel: '#featuredCards .property', box: '#featuredCards', msg: 'Featured verified assets are being curated for public release.' },
      { sel: '#landCards .property',     box: '#landCards',     msg: 'Curated land listings are currently undergoing BPN & legal verification.' },
      { sel: '#propertyCards .property', box: '#propertyCards', msg: 'Curated villas & hospitality properties are being prepared for release.' }
    ];
    groups.forEach(g => {
      let shown = 0;
      document.querySelectorAll(g.sel).forEach(el => {
        const code = getCardCode(el), ok = !code || active.has(code);
        el.style.display = (ok || open) ? '' : 'none';
        el.style.opacity = (!ok && open) ? '0.42' : '1';
        el.style.outline = (!ok && open) ? '2px dashed #b68a4c' : '';
        if (ok) shown++;
      });
      const box = document.querySelector(g.box);
      if (box) {
        let ph = box.querySelector('.eva-empty-note');
        if (!open && shown === 0) {
          if (!ph) { ph = document.createElement('div'); ph.className = 'eva-empty-note'; ph.style.cssText = 'grid-column:1/-1;padding:18px;border:1px dashed #c59b27;background:#fbf9f3;color:#6d7066;font-size:13px;text-align:center;'; box.appendChild(ph); }
          ph.textContent = g.msg;
        } else if (ph) ph.remove();
      }
    });
    document.querySelectorAll('#services .service-grid').forEach((grid, idx) => {
      let shown = 0;
      grid.querySelectorAll('.service').forEach(el => {
        const code = getCardCode(el), ok = !code || active.has(code);
        el.style.display = (ok || open) ? '' : 'none';
        el.style.opacity = (!ok && open) ? '0.42' : '1';
        el.style.outline = (!ok && open) ? '2px dashed #b68a4c' : '';
        if (ok) shown++;
      });
      let ph = grid.querySelector('.eva-empty-note');
      if (!open && shown === 0) {
        if (!ph) { ph = document.createElement('div'); ph.className = 'eva-empty-note'; ph.style.cssText = 'grid-column:1/-1;padding:14px;border:1px dashed #c59b27;background:#fff;color:#6d7066;font-size:13px;text-align:center;'; grid.appendChild(ph); }
        ph.textContent = idx === 0 ? 'Corporate Vendor (PT/CV) slots are currently in curation.' : 'Human Expert specialist slots are currently in curation.';
      } else if (ph) ph.remove();
    });
    renderAuthorDrawer(open, active);
  };
  function renderAuthorDrawer(open, active) {
    let dr = document.getElementById('evaAuthorDrawer');
    if (!open) { if (dr) dr.remove(); return; }
    if (!dr) {
      dr = document.createElement('div');
      dr.id = 'evaAuthorDrawer';
      dr.style.cssText = 'position:fixed;left:12px;right:12px;bottom:54px;z-index:99990;background:#162b22;color:#fbf9f3;border:1.5px solid #c59b27;border-radius:10px;padding:12px 14px;box-shadow:0 10px 30px rgba(0,0,0,.35);max-height:46vh;overflow-y:auto;font-size:12px;';
      document.body.appendChild(dr);
    }
    const mkPills = (title, codes) => '<div style="margin-top:6px;"><strong style="color:#f3d27a;">' + title + ':</strong> ' +
      codes.map(c => {
        const on = active.has(c);
        return '<button type="button" data-code="' + c + '" style="margin:2px;padding:3px 7px;border-radius:4px;font-family:monospace;font-size:11px;cursor:pointer;border:1px solid #c59b27;background:' + (on ? '#c59b27' : '#234235') + ';color:' + (on ? '#162b22' : '#fbf9f3') + ';font-weight:' + (on ? '800' : '500') + ';">' + (on ? '✓ ' : '') + c + '</button>';
      }).join('') + '</div>';
    dr.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;border-bottom:1px solid rgba(197,155,39,.35);padding-bottom:6px;">' +
      '<div><strong style="color:#f3d27a;letter-spacing:.6px;">✦ AUTHOR SELECTIVE CARD ACTIVATOR</strong> <span style="opacity:.85;">(' + active.size + ' / ' + ALL_CODES.length + ' Active for Public)</span></div>' +
      '<div style="display:flex;gap:6px;">' +
      '<button type="button" id="evaActAll" style="background:#c59b27;color:#162b22;border:none;padding:4px 9px;border-radius:4px;font-weight:700;cursor:pointer;">Activate All</button>' +
      '<button type="button" id="evaHideAll" style="background:#7f1d1d;color:#fff;border:none;padding:4px 9px;border-radius:4px;font-weight:700;cursor:pointer;">Hide All (Soft Launch)</button>' +
      '</div></div>' +
      mkPills('Land for Sale', LAND_CODES) + mkPills('Property for Sale', PROP_CODES) +
      mkPills('Corporate Vendor', CORP_CODES) + mkPills('Human Expert', EXP_CODES);
    dr.querySelectorAll('button[data-code]').forEach(b => {
      b.onclick = function() {
        const s = getActiveSet(), code = this.dataset.code;
        if (s.has(code)) s.delete(code); else s.add(code);
        saveActiveSet(s); window.apply3vaSelectiveVisibility();
      };
    });
    dr.querySelector('#evaActAll').onclick = function() { saveActiveSet(new Set(ALL_CODES)); window.apply3vaSelectiveVisibility(); };
    dr.querySelector('#evaHideAll').onclick = function() { saveActiveSet(new Set()); window.apply3vaSelectiveVisibility(); };
  }
  window.addEventListener('DOMContentLoaded', () => setTimeout(window.apply3vaSelectiveVisibility, 350));
  setInterval(window.apply3vaSelectiveVisibility, 900);
})();
