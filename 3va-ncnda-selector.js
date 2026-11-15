(function() {
  var st = document.createElement("style");
  st.textContent = ".eva-code-link{color:#1d4ed8;font-weight:800;text-decoration:underline;cursor:pointer;position:relative;padding:1px 5px;background:#eff6ff;border-radius:4px;display:inline-block}.eva-code-tip{visibility:hidden;opacity:0;position:absolute;bottom:130%;left:50%;transform:translateX(-50%);background:#0f172a;color:#fff;font-size:11px;font-weight:600;padding:5px 9px;border-radius:5px;white-space:nowrap;z-index:9999999;box-shadow:0 4px 10px rgba(0,0,0,.25);transition:opacity .15s;pointer-events:none}.eva-code-link:hover .eva-code-tip{visibility:visible;opacity:1}.eva-card-code-badge{position:absolute;top:10px;left:10px;z-index:15;background:#0f172a;color:#f8fafc;border:1.5px solid #b68a4c;padding:5px 9px;border-radius:6px;font-family:monospace;font-size:11px;font-weight:800;cursor:pointer;box-shadow:0 3px 10px rgba(0,0,0,.4)}.eva-card-code-badge:hover,.eva-card-code-badge:active{background:#b68a4c;color:#0f172a}#evaSelectBanner{position:fixed;bottom:64px;left:50%;transform:translateX(-50%);width:min(94%,640px);z-index:999990;background:#1e3a2f;color:#fff;padding:10px 12px;border-radius:10px;border:1.5px solid #b68a4c;font-size:12px;box-shadow:0 8px 22px rgba(0,0,0,.45);display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px}.eva-sel-btn{border-radius:5px;padding:5px 9px;font-weight:700;font-size:11px;cursor:pointer}@media (max-width:600px){#evaSelectBanner{bottom:54px;padding:8px 10px;font-size:10.5px;gap:6px}.eva-sel-btn{padding:4px 7px;font-size:10px}#evaAuthTrigger{font-size:10.5px !important;padding:6px 10px !important;bottom:10px !important;right:10px !important}}";
  document.head.appendChild(st);

  var hiddenMemberModals = [];

  function parseCardPrice(card) {
    var txt = card.textContent || "";
    var mB = txt.match(/(?:idr|rp)\s*([0-9]+(?:[.,][0-9]+)?)\s*(?:b|billion|miliar|m)\b/i);
    if (mB) return Math.round(parseFloat(mB[1].replace(",", ".")) * 1e9);
    var mM = txt.match(/(?:idr|rp)\s*([0-9]+(?:[.,][0-9]+)?)\s*(?:jt|juta|million)\b/i);
    if (mM) return Math.round(parseFloat(mM[1].replace(",", ".")) * 1e6);
    var mFull = txt.match(/(?:idr|rp)\s*([0-9]{1,3}(?:[.,][0-9]{3})+)/i);
    if (mFull) return Number(mFull[1].replace(/[^0-9]/g, ""));
    return 1500000000;
  }

  function restoreMemberModals() {
    hiddenMemberModals.forEach(function(el) {
      el.style.display = el.getAttribute("data-eva-prev-display") || "flex";
    });
    hiddenMemberModals = [];
  }

  function injectListingCodes() {
    var containers = [
      { id: "landCards", prefix: "3VA-1" },
      { id: "propertyCards", prefix: "3VA-2" },
      { id: "featuredCards", prefix: "3VA-3" }
    ];
    containers.forEach(function(cfg) {
      var box = document.getElementById(cfg.id);
      if (!box) return;
      Array.from(box.children).forEach(function(card, idx) {
        if (card.querySelector(".eva-card-code-badge")) return;
        card.style.position = "relative";
        var code = cfg.prefix + String(idx + 1).padStart(2, "0");
        var price = parseCardPrice(card);
        var titleEl = card.querySelector("h3, h4, strong");
        var title = titleEl ? titleEl.textContent.trim() : "Selected Listing";

        var badge = document.createElement("button");
        badge.type = "button";
        badge.className = "eva-card-code-badge";
        badge.title = "Click to select code " + code + " for Buyer Agreement";
        badge.textContent = "SELECT CODE: " + code;
        badge.onclick = function(e) {
          e.stopPropagation();
          var banner = document.getElementById("evaSelectBanner");
          if (banner) banner.remove();
          if (window.open3va) {
            window.open3va("buyer", price, null, { code: code, title: title });
          }
        };
        card.appendChild(badge);
      });
    });
  }

  window.start3vaCodeSelection = function() {
    var m = document.getElementById("evaM");
    if (m) m.style.display = "none";

    hiddenMemberModals = [];
    document.querySelectorAll(".modal, [id*=login i], [id*=member i], [class*=modal]").forEach(function(el) {
      if (el.id === "evaM" || el.id === "evaPinModal") return;
      var cs = window.getComputedStyle(el);
      if (cs.display !== "none" && (el.textContent.indexOf("Member Access") !== -1 || el.textContent.indexOf("Contributor Upload") !== -1 || el.classList.contains("modal"))) {
        el.setAttribute("data-eva-prev-display", cs.display);
        el.style.setProperty("display", "none", "important");
        hiddenMemberModals.push(el);
      }
    });
    document.body.style.overflow = "auto";

    var target = document.getElementById("land") || document.getElementById("property");
    if (target) target.scrollIntoView({ behavior: "smooth" });

    var oldB = document.getElementById("evaSelectBanner");
    if (oldB) oldB.remove();

    var enMsg = '🔎 <b>Select Property Code:</b> Scroll catalogue &amp; tap <b>SELECT CODE: 3VA-xxx</b> on your chosen listing.';
    var idMsg = '🔎 <b>Pilih Kode Properti:</b> Gulir katalog &amp; ketuk <b>SELECT CODE: 3VA-xxx</b> pada foto pilihan Anda.';

    var b = document.createElement("div");
    b.id = "evaSelectBanner";
    b.innerHTML =
      '<div id="evaSelText" style="flex:1 1 200px;line-height:1.3;">' + enMsg + '</div>' +
      '<div style="display:flex;gap:5px;flex-wrap:wrap;">' +
        '<button type="button" id="evaBtnLand" class="eva-sel-btn" onclick="document.getElementById(\'land\').scrollIntoView({behavior:\'smooth\'})" style="background:#334155;color:#fff;border:1px solid #64748b;">Land</button>' +
        '<button type="button" id="evaBtnProp" class="eva-sel-btn" onclick="document.getElementById(\'property\').scrollIntoView({behavior:\'smooth\'})" style="background:#334155;color:#fff;border:1px solid #64748b;">Property</button>' +
        '<button type="button" id="evaRestoreMemberBtn" class="eva-sel-btn" style="background:#b68a4c;color:#111;border:none;font-weight:800;">↩ Back</button>' +
      '</div>';
    document.body.appendChild(b);

    var setLang = function(lang) {
      var t = document.getElementById("evaSelText");
      var bl = document.getElementById("evaBtnLand");
      var bp = document.getElementById("evaBtnProp");
      var br = document.getElementById("evaRestoreMemberBtn");
      if (!t) return;
      if (lang === "id") {
        t.innerHTML = idMsg;
        if (bl) bl.textContent = "Tanah";
        if (bp) bp.textContent = "Properti";
        if (br) br.textContent = "↩ Kembali";
      } else {
        t.innerHTML = enMsg;
        if (bl) bl.textContent = "Land";
        if (bp) bp.textContent = "Property";
        if (br) br.textContent = "↩ Back";
      }
    };

    b.addEventListener("mouseenter", function() { setLang("id"); });
    b.addEventListener("mouseleave", function() { setLang("en"); });
    b.addEventListener("touchstart", function() { setLang("id"); }, { passive: true });
    b.addEventListener("touchend", function() { setTimeout(function() { setLang("en"); }, 2500); }, { passive: true });

    document.getElementById("evaRestoreMemberBtn").onclick = function() {
      b.remove();
      restoreMemberModals();
      if (m) m.style.display = "flex";
    };
  };

  setInterval(injectListingCodes, 600);
})();
