(function() {
  var st = document.createElement("style");
  st.textContent = ".eva5-ov{display:none;position:fixed;inset:0;background:rgba(15,23,42,.78);z-index:2147483647;align-items:center;justify-content:center;padding:14px}.eva5-bx{background:#fff;width:min(95%,460px);border-radius:12px;border:2px solid #b68a4c;overflow:hidden;box-shadow:0 20px 45px rgba(0,0,0,.45);color:#0f172a}.eva5-hd{background:#1e3a2f;color:#fff;padding:12px 16px;display:flex;justify-content:space-between;align-items:center}.eva5-bd{padding:16px;font-size:13px;line-height:1.5;max-height:78vh;overflow-y:auto}.eva5-in{width:100%;padding:8px 10px;border:1px solid #cbd5e1;border-radius:6px;margin:4px 0 10px;font-size:13px;box-sizing:border-box}.eva5-ft{padding:10px 16px;background:#f8fafc;border-top:1px solid #e2e8f0;display:flex;gap:8px;justify-content:flex-end}.eva5-btn{padding:8px 14px;border-radius:6px;font-weight:700;font-size:12px;cursor:pointer;border:none}.eva5-ok{background:#1e3a2f;color:#fff}.eva5-skip{background:#e2e8f0;color:#334155}.eva-dp-badge{position:absolute;top:10px;right:10px;z-index:16;background:#16a34a;color:#fff;border:1.5px solid #fff;padding:4px 9px;border-radius:6px;font-size:11px;font-weight:800;cursor:pointer}";
  document.head.appendChild(st);
  var w = document.createElement("div");
  w.innerHTML = '<div id="eva5GateModal" class="eva5-ov"><div class="eva5-bx"><div class="eva5-hd"><strong id="eva5GateTitle">Member Access</strong><button type="button" onclick="document.getElementById(\'eva5GateModal\').style.display=\'none\'" style="background:none;border:none;color:#fff;font-size:18px;cursor:pointer">✕</button></div><div class="eva5-bd" id="eva5GateBody"></div><div class="eva5-ft" id="eva5GateFoot"></div></div></div>';
  document.body.appendChild(w);
  window.eva5GetMember = function() { try { return JSON.parse(localStorage.getItem("eva5_member") || "null"); } catch(e) { return null; } };
  window.eva5OpenLoginGate = function(cb) {
    var m = window.eva5GetMember() || {};
    document.getElementById("eva5GateTitle").textContent = "EASTVENTURA Member Access & KYC";
    document.getElementById("eva5GateBody").innerHTML =
      '<div style="background:#fef3c7;border-left:4px solid #d97706;padding:8px;margin-bottom:8px;font-size:12px;"><b>Lengkapi Data Diri / Sign-Up</b> sebelum Lock Asset &amp; NCNDA.</div>' +
      '<label><b>Email *</b><input type="email" id="e5Email" class="eva5-in" value="' + (m.email || "") + '"></label>' +
      '<label><b>Nama Lengkap *</b><input type="text" id="e5Name" class="eva5-in" value="' + (m.name || "") + '"></label>' +
      '<label><b>Status *</b><select id="e5Type" class="eva5-in"><option value="Individual">Individual</option><option value="PIC Perusahaan"' + (m.type === "PIC Perusahaan" ? " selected" : "") + '>PIC Perusahaan (PT/CV)</option></select></label>' +
      '<label><b>Nama Perusahaan (jika PIC)</b><input type="text" id="e5Comp" class="eva5-in" value="' + (m.company || "") + '"></label>' +
      '<label><b>No. WhatsApp / Kontak *</b><input type="text" id="e5Phone" class="eva5-in" value="' + (m.phone || "") + '"></label>' +
      '<label><b>Skema Harga *</b><select id="e5PriceOpt" class="eva5-in"><option value="Nett Price (Di luar BPHTB & Biaya PPAT)">Nett Price (Di luar BPHTB &amp; PPAT)</option><option value="Fix Price (Termasuk Pajak Penjual & PPAT)"' + (m.priceOpt && m.priceOpt.indexOf("Fix") !== -1 ? " selected" : "") + '>Fix Price (Termasuk Pajak &amp; PPAT)</option></select></label>';
    document.getElementById("eva5GateFoot").innerHTML = '<button type="button" class="eva5-btn eva5-ok" id="e5Save">Simpan &amp; Lanjutkan →</button>';
    document.getElementById("eva5GateModal").style.display = "flex";
    document.getElementById("e5Save").onclick = function() {
      var d = { email: document.getElementById("e5Email").value.trim(), name: document.getElementById("e5Name").value.trim(), type: document.getElementById("e5Type").value, company: document.getElementById("e5Comp").value.trim(), phone: document.getElementById("e5Phone").value.trim(), priceOpt: document.getElementById("e5PriceOpt").value };
      if (!d.email || !d.name || !d.phone) { alert("Isi Email, Nama, dan No. Kontak."); return; }
      localStorage.setItem("eva5_member", JSON.stringify(d));
      document.getElementById("eva5GateModal").style.display = "none";
      if (cb) cb(d);
    };
  };
  window.eva5OpenServicePrompt = function(cb) {
    document.getElementById("eva5GateTitle").textContent = "Become Member?";
    document.getElementById("eva5GateBody").innerHTML =
      '<div style="text-align:center;padding:8px 4px;">' +
        '<div style="font-size:16px;font-weight:800;color:#1e3a2f;margin-bottom:6px;">We care of your urgent matters!</div>' +
        '<p style="color:#475569;margin:0 0 8px;">Daftar member <b>eastventura.biz.id</b> untuk prioritas teknisi darurat &amp; perlindungan escrow 70/30.</p>' +
        '<div style="background:#f0fdf4;border:1px solid #86efac;padding:7px;border-radius:6px;font-size:11.5px;color:#166534;"><b>Klausul Pajak Layanan (3VA-SRV):</b> Tarif jasa sudah termasuk pajak yang berlaku (<i>Tax Included</i>).</div>' +
      '</div>';
    document.getElementById("eva5GateFoot").innerHTML = '<button type="button" class="eva5-btn eva5-skip" id="e5SrvSkip">SKIP</button><button type="button" class="eva5-btn eva5-ok" id="e5SrvOk">OK</button>';
    document.getElementById("eva5GateModal").style.display = "flex";
    document.getElementById("e5SrvSkip").onclick = function() {
      document.getElementById("eva5GateModal").style.display = "none";
      var c = window._e5SrvCode || "3VA-SRV";
      var t = window._e5SrvTitle || "Selected Service";
      if (typeof window.open3va === "function") {
        window.open3va("service", 0, null, { code: c + " — " + t + " (Direct User)" });
      }
    };
    document.getElementById("e5SrvOk").onclick = function() {
      document.getElementById("eva5GateModal").style.display = "none";
      var btn = Array.from(document.querySelectorAll("button, a")).find(function(b) { return /Member Login/i.test(b.textContent || ""); });
      if (btn) btn.click();
      setTimeout(function() {
        var suTab = Array.from(document.querySelectorAll("button, [role=tab], label, div")).find(function(t) { return /^4\.\s*Service User$|^Service User$/i.test((t.textContent || "").trim()); });
        if (suTab) suTab.click();
      }, 200);
    };
  };
  function isAuthorOpen() {
    return Array.from(document.querySelectorAll("button")).some(function(b) { return /Author\s*\(Open\)/i.test(b.textContent || ""); }) || window.is3vaSuperAdmin || sessionStorage.getItem("3va_sa_unlocked") === "1";
  }
  function getDpMap() { try { return JSON.parse(localStorage.getItem("eva5_dp_map") || "{}"); } catch(e) { return {}; } }
  function addWorkDays(ms, d) { var dt = new Date(ms), n = 0; while (n < d) { dt.setDate(dt.getDate() + 1); if (dt.getDay() !== 0 && dt.getDay() !== 6) n++; } return dt.getTime(); }
  function syncCatalogDp() {
    var map = getDpMap();
    document.querySelectorAll(".eva-card-code-badge").forEach(function(b) {
      var code = (b.textContent || "").trim().split(/\s+/).pop(), card = b.parentElement;
      if (!card) return;
      var ex = card.querySelector(".eva-dp-badge");
      if (map[code] && map[code].paid) {
        if (!ex) {
          var tag = document.createElement("div"); tag.className = "eva-dp-badge"; tag.textContent = "✓ DP PAID";
          tag.onclick = function(ev) { ev.stopPropagation(); alert("STATUS ASET " + code + ": DP PAID (BCA EASTVENTURA)\nPembeli: " + map[code].buyer + "\nBatas Pelunasan 5 Hari Kerja: " + new Date(map[code].deadline).toLocaleDateString("id-ID")); };
          card.appendChild(tag);
        }
      } else if (ex) ex.remove();
    });
  }
  function hookAll() {
    if (typeof window.selectServiceCode === "function" && !window.selectServiceCode._e5) {
      var origS = window.selectServiceCode;
      var wrapS = function(code, title) {
        var self = this, args = arguments;
        window._e5SrvCode = code; window._e5SrvTitle = title; if (!isAuthorOpen()) { window.eva5OpenServicePrompt(function() { origS.apply(self, args); }); return; }
        return origS.apply(self, args);
      };
      wrapS._e5 = true; window.selectServiceCode = wrapS;
    }
    if (typeof window.open3va === "function" && !window.open3va._e5) {
      var origO = window.open3va;
      var wrapO = function(role) {
        var self = this, args = arguments;
        if (!isAuthorOpen() && String(role).toLowerCase() === "buyer" && !window.eva5GetMember()) {
          window.eva5OpenLoginGate(function() { origO.apply(self, args); }); return;
        }
        return origO.apply(self, args);
      };
      wrapO._e5 = true; window.open3va = wrapO;
    }
  }
  var C10 = ["Civil & Building Contractor","Electrical & Power Engineering (PLN / Solar / Genset)","Water & Wastewater Treatment (WTP / IPAL)","Heavy Equipment Rental (Alat Berat)","Corporate Legal, Notary & Licensing Firm","Pest & Termite Control Company","Facility Management & MEP Contractor","Fire Safety Equipment","Interior Design & Architectural Fit-Out","Public Area, Garden Maintenance & Plant Nursery"];
  var E18 = ["Legal Advisor & Land Due Diligence","Accounting & Tax Specialist","Executive Chef & Culinary","Pastry & Bakery Specialist","Private Butler & Hospitality","Housekeeper","Pool & Spa Technician","MEP Technician (Mechanical, Electrical, Plumbing)","Civil & Structural Foreman (Mandor)","Carpenter & Woodwork Specialist","Air Conditioner (AC) Technician","Genset Technician","Water & Wastewater Treatment (WTP / IPAL) Operator","Pest & Termite Control Technician","Fire Safety Equipment Specialist","IT Programmer & Web/System Specialist","Interior Designer & Space Stylist","Public Area, Gardener & Nursery Specialist"];
  function syncSelectsAndAuthor() {
    var uRole = document.getElementById("srvRole");
    var uPanel = document.getElementById("panel-service");
    var uSels = uPanel ? uPanel.querySelectorAll("select") : [];
    var uCat = uSels.length > 1 ? uSels[1] : null;
    if (uRole && uRole.getAttribute("data-e5") !== "1") {
      uRole.innerHTML = "<option value=\"Human Expert\">Individual / Human Expert Service</option><option value=\"Corporate Vendor\">Corporate / Institutional Client (PT / CV / Hotel / Resort)</option>";
      uRole.setAttribute("data-e5", "1");
      uRole.onchange = function() { var b = document.getElementById("corpNameBox"); if (b) b.style.display = this.value === "Corporate Vendor" ? "block" : "none"; };
    }
    if (uRole && uCat && uCat.getAttribute("data-lr") !== uRole.value) {
      var arr = uRole.value === "Corporate Vendor" ? C10 : E18;
      uCat.innerHTML = arr.map(function(x) { return "<option value=\"" + x + "\">" + x + "</option>"; }).join("");
      uCat.setAttribute("data-lr", uRole.value);
    }
    var bd = document.getElementById("evaB");
    if (bd && isAuthorOpen() && !document.getElementById("eva5AuthorInline")) {
      var bar = document.createElement("div"); bar.id = "eva5AuthorInline";
      bar.style.cssText = "margin-bottom:10px;padding:8px 10px;background:#0f172a;color:#f8fafc;border:1.5px solid #b68a4c;border-radius:7px;font-size:11.5px;";
      bar.innerHTML = "<b style=\"color:#fcd34d;\">✦ AUTHOR:</b> <input id=\"aCodeIn\" value=\"3VA-101\" style=\"width:85px;padding:2px 5px;color:#000;border-radius:4px;\"> <button type=\"button\" id=\"aSetBtn\" style=\"background:#16a34a;color:#fff;border:none;padding:3px 7px;border-radius:4px;cursor:pointer;\">✓ DP PAID</button> <button type=\"button\" id=\"aClrBtn\" style=\"background:#475569;color:#fff;border:none;padding:3px 7px;border-radius:4px;cursor:pointer;\">Reset</button> <a href=\"https://wa.me\" target=\"_blank\" style=\"color:#86efac;margin-left:4px;\">WA-25</a> | <a href=\"https://t.me\" target=\"_blank\" style=\"color:#7dd3fc;\">TG</a> | <a href=\"https://atrbpn.go.id\" target=\"_blank\" style=\"color:#fde68a;\">BPN</a>";
      bd.insertBefore(bar, bd.firstChild);
      var cm = (bd.textContent || "").match(/3VA-[A-Z0-9-]+/);
      if (cm) document.getElementById("aCodeIn").value = cm[0];
      document.getElementById("aSetBtn").onclick = function() { var c = document.getElementById("aCodeIn").value.trim().toUpperCase(); var mp = getDpMap(); mp[c] = { paid: true, buyer: "Verified Buyer", deadline: addWorkDays(Date.now(), 5) }; localStorage.setItem("eva5_dp_map", JSON.stringify(mp)); syncCatalogDp(); alert("✓ " + c + " DP PAID (5 Hari Kerja)"); };
      document.getElementById("aClrBtn").onclick = function() { var c = document.getElementById("aCodeIn").value.trim().toUpperCase(); var mp = getDpMap(); delete mp[c]; localStorage.setItem("eva5_dp_map", JSON.stringify(mp)); syncCatalogDp(); alert("Reset: " + c); };
    }
  }
  setInterval(function() { syncCatalogDp(); hookAll(); syncSelectsAndAuthor(); }, 500);
})();
