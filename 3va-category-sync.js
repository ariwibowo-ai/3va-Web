(function() {
  var CORP = [['3VA-CV-01', 'Civil & Building Contractor'], ['3VA-CV-02', 'Electrical & Power Engineering (PLN / Solar / Genset)'], ['3VA-CV-03', 'Water & Wastewater Treatment (WTP / IPAL)'], ['3VA-CV-04', 'Heavy Equipment Rental (Alat Berat)'], ['3VA-CV-05', 'Corporate Legal, Notary & Licensing Firm'], ['3VA-CV-06', 'Pest & Termite Control Company'], ['3VA-CV-07', 'Facility Management & MEP Contractor'], ['3VA-CV-08', 'Fire Safety Equipment'], ['3VA-CV-09', 'Interior Design & Architectural Fit-Out'], ['3VA-CV-10', 'Public Area, Garden Maintenance & Plant Nursery']];
  var EXP = [['3VA-XP-01', 'Legal Advisor & Land Due Diligence'], ['3VA-XP-02', 'Accounting & Tax Specialist'], ['3VA-XP-03', 'Executive Chef & Culinary'], ['3VA-XP-04', 'Pastry & Bakery Specialist'], ['3VA-XP-05', 'Private Butler & Hospitality'], ['3VA-XP-06', 'Housekeeper'], ['3VA-XP-07', 'Pool & Spa Technician'], ['3VA-XP-08', 'MEP Technician (Mechanical, Electrical, Plumbing)'], ['3VA-XP-09', 'Civil & Structural Foreman (Mandor)'], ['3VA-XP-10', 'Carpenter & Woodwork Specialist'], ['3VA-XP-11', 'Air Conditioner (AC) Technician'], ['3VA-XP-12', 'Genset Technician'], ['3VA-XP-13', 'Water & Wastewater Treatment (WTP / IPAL) Operator'], ['3VA-XP-14', 'Pest & Termite Control Technician'], ['3VA-XP-15', 'Fire Safety Equipment Specialist'], ['3VA-XP-16', 'IT Programmer & Web/System Specialist'], ['3VA-XP-17', 'Interior Designer & Space Stylist'], ['3VA-XP-18', 'Public Area, Gardener & Nursery Specialist']];
  window.resolve3vaServiceLabel = function(raw) {
    var s = String(raw || "").trim(), all = CORP.concat(EXP);
    for (var i = 0; i < all.length; i++) {
      if (s.indexOf(all[i][0]) !== -1 || s.toLowerCase().indexOf(all[i][1].toLowerCase()) !== -1) return all[i][0] + " — " + all[i][1];
    }
    return s || "3VA-SRV — Selected Service";
  };
  function ensureJobBox(catSel, boxId, lblText) {
    if (!catSel) return null;
    var row = catSel.parentNode.parentNode;
    row.style.cssText = "display:grid;grid-template-columns:1.1fr 1.5fr 0.85fr;gap:10px;align-items:end;";
    if (document.getElementById(boxId)) return document.getElementById(boxId);
    var wrap = document.createElement("label");
    wrap.style.cssText = "display:block;margin:0;";
    wrap.innerHTML = lblText + '<select id="' + boxId + '" style="width:100%;background:#fefce8;border:1.5px solid #c59b27;font-weight:700;color:#162b22;font-family:monospace;"></select>';
    row.appendChild(wrap);
    return document.getElementById(boxId);
  }
  function bindPair(catSel, jobSel, list) {
    if (!catSel || !jobSel) return;
    catSel.innerHTML = ""; jobSel.innerHTML = "";
    list.forEach(function(x) {
      var o1 = document.createElement("option"); o1.value = x[0] + " — " + x[1]; o1.textContent = x[1]; catSel.appendChild(o1);
      var o2 = document.createElement("option"); o2.value = x[0] + " — " + x[1]; o2.textContent = x[0]; jobSel.appendChild(o2);
    });
    catSel.onchange = function() { jobSel.selectedIndex = catSel.selectedIndex; if (typeof syncVendorRate === "function" && catSel.id === "vendorCategory") syncVendorRate(); };
    jobSel.onchange = function() { catSel.selectedIndex = jobSel.selectedIndex; if (typeof syncVendorRate === "function" && catSel.id === "vendorCategory") syncVendorRate(); };
  }
  window.sync3vaCategoryDropdowns = function() {
    var vCat = document.getElementById("vendorCategory");
    var rSel = document.getElementById("vendorRole") || document.querySelector("#panel-vendor select");
    if (vCat) {
      var isCorp = rSel && /Corporate|PT|CV/i.test(rSel.value);
      var vJob = ensureJobBox(vCat, "vendorJobCode", "Job Code *");
      bindPair(vCat, vJob, isCorp ? CORP : EXP);
    }
    var uCat = document.querySelector("#panel-service select:not(#srvRole):not(#srvJobCode)");
    if (uCat && !uCat.dataset.synced3va) {
      uCat.dataset.synced3va = "1"; uCat.id = "srvUserCategory";
      var uJob = ensureJobBox(uCat, "srvJobCode", "Job Code *");
      bindPair(uCat, uJob, EXP.concat(CORP));
    }
  };
  window.addEventListener("DOMContentLoaded", function() {
    window.sync3vaCategoryDropdowns();
    var rSel = document.getElementById("vendorRole") || document.querySelector("#panel-vendor select");
    if (rSel) rSel.addEventListener("change", function() { setTimeout(window.sync3vaCategoryDropdowns, 40); });
    setTimeout(window.sync3vaCategoryDropdowns, 400);
  });
})();
