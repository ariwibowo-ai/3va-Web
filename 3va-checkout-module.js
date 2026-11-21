(function() {
  var BANK_CONFIG = { bankName: "BCA (Bank Central Asia)", accountHolder: "Ari Wibowo", accountNumber: "1234567890" };
  var dpTimerInterval = null, isDpPaid = false, netOffsetMs = 0, netSynced = false;
  function getMonotonicNow() { return (netSynced && performance.now) ? Math.round(netOffsetMs + performance.now()) : Date.now(); }
  function syncNetworkTime(cb) {
    var t0 = performance.now ? performance.now() : 0;
    fetch("https://worldtimeapi.org", { cache: "no-store" })
      .then(function(r) { return r.json(); })
      .then(function(d) { if (d && d.unixtime) { var t1 = performance.now ? performance.now() : 0; netOffsetMs = ((d.unixtime * 1000) + Math.round((t1 - t0) / 2)) - t1; netSynced = true; } if (cb) cb(); })
      .catch(function() { if (cb) cb(); });
  }
  function formatWita(ms) {
    try { return new Date(ms).toLocaleString("id-ID", { timeZone: "Asia/Makassar", day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" }) + " WITA"; }
    catch (e) { return new Date(ms).toLocaleString("id-ID") + " WITA"; }
  }
  function addWorkingDaysWita(ms, d) {
    var cur = new Date(ms), n = 0;
    while (n < d) { cur.setDate(cur.getDate() + 1); if (cur.getDay() !== 0 && cur.getDay() !== 6) n++; }
    return formatWita(cur.getTime());
  }
  function formatIDR(n) { return "Rp " + Math.round(n).toLocaleString("id-ID"); }
  function injectDpWatermark() {
    var pr = document.getElementById("evaPr"); if (!pr || document.getElementById("evaDpWatermark")) return;
    pr.style.position = "relative"; var wm = document.createElement("div"); wm.id = "evaDpWatermark"; wm.textContent = "DP PAID";
    wm.style.cssText = "position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-28deg);font-size:68px;font-weight:900;color:rgba(22,163,74,0.18);border:6px solid rgba(22,163,74,0.22);padding:10px 28px;border-radius:12px;pointer-events:none;z-index:5;letter-spacing:6px;white-space:nowrap;";
    pr.appendChild(wm);
  }
  window.open3vaBuyerCheckout = function(pctText, priceNum, assetCode) {
    var isSrv = /70%|service|3va-srv/i.test(String(pctText || "") + " " + String(assetCode || ""));
    var pr = document.getElementById("evaPr"), modal = document.getElementById("evaM"), okBtn = document.getElementById("evaOk");
    if (!pr || !modal) return;
    var pctVal = parseFloat(String(pctText).replace("%", "")) || 5, dpNom = priceNum > 0 ? (priceNum * pctVal / 100) : 0;
    var storageKey = "3va_dl_" + String(assetCode || "DEFAULT").replace(/[^a-zA-Z0-9_-]/g, ""); isDpPaid = false;
    var oldBox = document.getElementById("evaCheckoutBox"); if (oldBox) oldBox.remove();
    var box = document.createElement("div"); box.id = "evaCheckoutBox";
    box.style.cssText = "margin-top:12px;padding:12px;border:1.5px solid #0f172a;border-radius:8px;background:#f8fafc;font-size:12px;";
    box.innerHTML = '<div style="display:flex;justify-content:space-between;border-bottom:1px solid #cbd5e1;padding-bottom:6px;margin-bottom:8px;"><b>' + (isSrv ? 'SERVICE ESCROW CHECKOUT' : 'BUYER DP CHECKOUT') + '</b><span id="evaCountdown" style="background:#fef3c7;color:#b45309;font-weight:700;padding:3px 8px;border-radius:4px;font-family:monospace;">24:00:00 WITA</span></div><div style="background:#ecfdf5;border:1px solid #a7f3d0;color:#065f46;padding:6px 8px;border-radius:5px;font-size:11px;margin-bottom:8px;"><b>Server Clock (WITA):</b> <span id="evaSyncLabel">Sync...</span><br><b>DP (1x24 Jam):</b> <span id="evaDpDeadlineTxt">-</span> | <b>Pelunasan (5 Hari Kerja):</b> <span id="evaSettleDeadlineTxt">-</span></div><div style="margin-bottom:8px;"><b>' + (isSrv ? 'Escrow 70/30:' : 'DP (' + pctVal + '%):') + '</b> ' + (dpNom > 0 ? formatIDR(dpNom) : 'Sesuai Quotation / Nett Price') + '<br>' + (assetCode ? '<b>Kode:</b> ' + assetCode + '<br>' : '') + '<b>Rekening:</b> ' + BANK_CONFIG.bankName + ' - <b>' + BANK_CONFIG.accountNumber + '</b> a.n. <b>' + BANK_CONFIG.accountHolder + '</b></div><div id="evaPayMethods" style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px;"><button type="button" class="eva-pay-btn" data-m="BCA" style="padding:6px 10px;border:1px solid #1d4ed8;background:#eff6ff;border-radius:5px;font-weight:600;cursor:pointer;">BCA</button><button type="button" class="eva-pay-btn" data-m="Mandiri" style="padding:6px 10px;border:1px solid #0369a1;background:#f0f9ff;border-radius:5px;font-weight:600;cursor:pointer;">Mandiri</button><button type="button" class="eva-pay-btn" data-m="VISA" style="padding:6px 10px;border:1px solid #4338ca;background:#eef2ff;border-radius:5px;font-weight:600;cursor:pointer;">VISA</button><button type="button" class="eva-pay-btn" data-m="Bank Lainnya" style="padding:6px 10px;border:1px solid #475569;background:#f1f5f9;border-radius:5px;font-weight:600;cursor:pointer;">Bank Lainnya</button></div><div id="evaPayStatus" style="font-size:11px;margin-bottom:6px;">Pilih metode pembayaran (batas 1x24 jam WITA).</div><button type="button" id="evaConfirmPaidBtn" style="display:none;padding:7px 12px;background:#16a34a;color:#fff;border:none;border-radius:5px;font-weight:700;cursor:pointer;">Konfirmasi DP Paid &amp; Watermark PDF</button>';
    pr.appendChild(box); modal.style.display = "flex"; if (okBtn) okBtn.style.display = "none";
    var btns = box.querySelectorAll(".eva-pay-btn");
    btns.forEach(function(b) { b.onclick = function() { var m = this.getAttribute("data-m"); btns.forEach(function(x) { x.style.outline = "none"; }); this.style.outline = "2px solid #0f172a"; document.getElementById("evaPayStatus").innerHTML = '<b>Metode:</b> ' + m + ' | <span style="color:#b45309;font-weight:700;">MENUNGGU DP (1x24 JAM)</span>'; document.getElementById("evaConfirmPaidBtn").style.display = "inline-block"; }; });
    document.getElementById("evaConfirmPaidBtn").onclick = function() { isDpPaid = true; if (dpTimerInterval) clearInterval(dpTimerInterval); var cd = document.getElementById("evaCountdown"); if (cd) { cd.textContent = "DP PAID VERIFIED"; cd.style.background = "#dcfce7"; cd.style.color = "#15803d"; } document.getElementById("evaPayStatus").innerHTML = '<b>Status:</b> <span style="color:#15803d;font-weight:700;">LUNAS / DP PAID</span> · ' + formatWita(getMonotonicNow()); this.style.display = "none"; document.getElementById("evaPayMethods").style.display = "none"; injectDpWatermark(); };
    syncNetworkTime(function() {
      var nowRef = getMonotonicNow(), savedDl = parseInt(localStorage.getItem(storageKey) || "0", 10);
      var deadline = (savedDl && savedDl > nowRef && savedDl <= nowRef + 86400000) ? savedDl : (nowRef + 86400000);
      localStorage.setItem(storageKey, String(deadline));
      document.getElementById("evaSyncLabel").textContent = (netSynced ? "Jaringan UTC+8" : "Monotonic Guard") + " · " + formatWita(nowRef);
      document.getElementById("evaDpDeadlineTxt").textContent = formatWita(deadline);
      document.getElementById("evaSettleDeadlineTxt").textContent = addWorkingDaysWita(deadline, 5);
      if (dpTimerInterval) clearInterval(dpTimerInterval);
      dpTimerInterval = setInterval(function() {
        if (isDpPaid) return; var rem = deadline - getMonotonicNow(), cd = document.getElementById("evaCountdown");
        if (!cd || rem <= 0) { if (cd) cd.textContent = "EXPIRED (24H WITA)"; clearInterval(dpTimerInterval); return; }
        var h = String(Math.floor(rem / 3600000)).padStart(2, "0"), m = String(Math.floor((rem % 3600000) / 60000)).padStart(2, "0"), s = String(Math.floor((rem % 60000) / 1000)).padStart(2, "0");
        cd.textContent = h + ":" + m + ":" + s + " WITA";
      }, 1000);
    });
  };
})();
