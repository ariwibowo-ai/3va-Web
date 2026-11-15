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
