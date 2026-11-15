(function() {
  // === KONFIGURASI REKENING RESMI 3VA.ID (MUDAH DIEDIT) ===
  var BANK_CONFIG = {
    bankName: "BCA (Bank Central Asia)",
    accountHolder: "Ari Wibowo",
    accountNumber: "1234567890"
  };

  var dpTimerInterval = null;
  var isDpPaid = false;

  function formatIDR(num) {
    return "Rp " + Math.round(num).toLocaleString("id-ID");
  }

  function injectDpWatermark() {
    var pr = document.getElementById("evaPr");
    if (!pr) return;
    pr.style.position = "relative";
    if (!document.getElementById("evaDpWatermark")) {
      var wm = document.createElement("div");
      wm.id = "evaDpWatermark";
      wm.textContent = "DP PAID";
      wm.style.cssText = "position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-28deg);font-size:68px;font-weight:900;color:rgba(22,163,74,0.18);border:6px solid rgba(22,163,74,0.22);padding:10px 28px;border-radius:12px;pointer-events:none;z-index:5;letter-spacing:6px;white-space:nowrap;";
      pr.appendChild(wm);
    }
  }
  window.open3vaBuyerCheckout = function(pctText, priceNum) {
    var pr = document.getElementById("evaPr");
    var modal = document.getElementById("evaM");
    var okBtn = document.getElementById("evaOk");
    if (!pr || !modal) return;

    var pctVal = parseFloat(String(pctText).replace("%", "")) || 5;
    var dpNominal = priceNum && priceNum > 0 ? (priceNum * pctVal / 100) : 0;
    var deadline = Date.now() + (24 * 60 * 60 * 1000);
    isDpPaid = false;

    var oldBox = document.getElementById("evaCheckoutBox");
    if (oldBox) oldBox.remove();

    var box = document.createElement("div");
    box.id = "evaCheckoutBox";
    box.style.cssText = "margin-top:12px;padding:12px;border:1.5px solid #0f172a;border-radius:8px;background:#f8fafc;font-size:12px;";
    box.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #cbd5e1;padding-bottom:6px;margin-bottom:8px;">' +
        '<b style="color:#0f172a;font-size:13px;">💳 BUYER DP CHECKOUT &amp; OFFICIAL RECEIPT</b>' +
        '<span id="evaCountdown" style="background:#fef3c7;color:#b45309;font-weight:700;padding:3px 8px;border-radius:4px;font-family:monospace;">⏳ 24:00:00</span>' +
      '</div>' +
      '<div style="margin-bottom:8px;">' +
        '<b>Skema DP (' + pctVal + '%):</b> ' + (dpNominal > 0 ? formatIDR(dpNominal) : 'Sesuai Nilai Transaksi Terpilih') + '<br>' +
        '<b>Tujuan Resmi:</b> ' + BANK_CONFIG.bankName + ' — No. Rek: <b>' + BANK_CONFIG.accountNumber + '</b> a.n. <b>' + BANK_CONFIG.accountHolder + '</b>' +
      '</div>' +
      '<div id="evaPayMethods" style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px;">' +
        '<button type="button" class="eva-pay-btn" data-m="BCA Virtual / Transfer" style="padding:6px 10px;border:1px solid #1d4ed8;background:#eff6ff;color:#1e40af;border-radius:5px;font-weight:600;cursor:pointer;">🏦 BCA</button>' +
        '<button type="button" class="eva-pay-btn" data-m="Bank Mandiri" style="padding:6px 10px;border:1px solid #0369a1;background:#f0f9ff;color:#075985;border-radius:5px;font-weight:600;cursor:pointer;">🏦 Mandiri</button>' +
        '<button type="button" class="eva-pay-btn" data-m="VISA International Card" style="padding:6px 10px;border:1px solid #4338ca;background:#eef2ff;color:#3730a3;border-radius:5px;font-weight:600;cursor:pointer;">💳 VISA</button>' +
        '<button type="button" class="eva-pay-btn" data-m="Bank Lainnya (SKN / RTGS / BI-FAST)" style="padding:6px 10px;border:1px solid #475569;background:#f1f5f9;color:#1e293b;border-radius:5px;font-weight:600;cursor:pointer;">🏛️ Bank Lainnya</button>' +
      '</div>' +
      '<div id="evaPayStatus" style="font-size:11px;color:#334155;margin-bottom:6px;">Pilih metode pembayaran di atas untuk mengunci instruksi Check Out (batas waktu 1 × 24 jam).</div>' +
      '<button type="button" id="evaConfirmPaidBtn" style="display:none;padding:7px 12px;background:#16a34a;color:#fff;border:none;border-radius:5px;font-weight:700;cursor:pointer;">✅ Konfirmasi DP Paid &amp; Terbitkan Watermark PDF</button>';

    pr.appendChild(box);
    modal.style.display = "flex";
    if (okBtn) okBtn.style.display = "none";

    var btns = box.querySelectorAll(".eva-pay-btn");
    btns.forEach(function(b) {
      b.onclick = function() {
        var method = this.getAttribute("data-m");
        btns.forEach(function(x) { x.style.outline = "none"; });
        this.style.outline = "2px solid #0f172a";
        document.getElementById("evaPayStatus").innerHTML =
          '<b>Metode Terpilih:</b> ' + method + ' | Status: <span style="color:#b45309;font-weight:700;">MENUNGGU PEMBAYARAN DP (1×24 JAM)</span>';
        document.getElementById("evaConfirmPaidBtn").style.display = "inline-block";
      };
    });

    document.getElementById("evaConfirmPaidBtn").onclick = function() {
      isDpPaid = true;
      if (dpTimerInterval) clearInterval(dpTimerInterval);
      var cd = document.getElementById("evaCountdown");
      if (cd) {
        cd.textContent = "✅ DP PAID VERIFIED";
        cd.style.background = "#dcfce7";
        cd.style.color = "#15803d";
      }
      document.getElementById("evaPayStatus").innerHTML =
        '<b>Status Akhir:</b> <span style="color:#15803d;font-weight:700;">LUNAS / DP PAID</span> · Tercatat pada ' + new Date().toLocaleString("id-ID");
      this.style.display = "none";
      document.getElementById("evaPayMethods").style.display = "none";
      injectDpWatermark();
    };

    if (dpTimerInterval) clearInterval(dpTimerInterval);
    dpTimerInterval = setInterval(function() {
      if (isDpPaid) return;
      var rem = deadline - Date.now();
      var cd = document.getElementById("evaCountdown");
      if (!cd) { clearInterval(dpTimerInterval); return; }
      if (rem <= 0) {
        cd.textContent = "⛔ EXPIRED (24H)";
        cd.style.background = "#fee2e2";
        cd.style.color = "#b91c1c";
        clearInterval(dpTimerInterval);
        return;
      }
      var h = String(Math.floor(rem / 3600000)).padStart(2, "0");
      var m = String(Math.floor((rem % 3600000) / 60000)).padStart(2, "0");
      var s = String(Math.floor((rem % 60000) / 1000)).padStart(2, "0");
      cd.textContent = "⏳ " + h + ":" + m + ":" + s;
    }, 1000);
  };
})();
