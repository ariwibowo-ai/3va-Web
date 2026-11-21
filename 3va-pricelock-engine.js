(function() {
  var HIGH_RISK = /MEP|Electrical|Genset|Pest|Termite|Fire|Civil|Foreman|Public Area|Gardener|Pool|AC/i;
  function isHumanMode(code) {
    if (/3VA-SRV-CORP/i.test(code || "")) return false;
    if (/3VA-SRV-EXP/i.test(code || "")) return true;
    var r = document.getElementById("srvRole") || document.querySelector("#panel-vendor select");
    return !r || /Human Expert|Individual/i.test(r.value || "Human Expert");
  }
  function fmtIDR(n) { return "Rp " + Math.round(n).toLocaleString("id-ID"); }
  window.build3vaHumanPriceLockHTML = function(catName) {
    if (!isHumanMode(catName)) return "";
    var isRisk = HIGH_RISK.test(catName || "");
    return '<div id="evaPriceLockBox" style="margin:10px 0;padding:10px;border:1.5px solid #b68a4c;border-radius:8px;background:#fffbeb;font-size:11.5px;color:#1e293b;">' +
      '<div style="font-weight:800;color:#92400e;margin-bottom:6px;">🔒 HUMAN EXPERT PRE-CLOSING PRICE LOCK (SIPP-ONLINE BPJS &amp; PPh 21 BORNE BY USER)</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:6px;">' +
      '<label><b>1. Skema Kontrak Expert:</b><select id="plContractType" style="width:100%;padding:5px;border:1px solid #cbd5e1;border-radius:4px;"><option value="incidental">a. Insidental (Sekali Panggil / Harian)' + (isRisk ? ' [Wajib BPJS Risiko Tinggi]' : '') + '</option><option value="freetimer">b. Free-Timer (Visit / Advise / Paket RAB)</option><option value="casual">c. Casual / Daily Worker (1–3 Bln · Wajib BPJS)</option><option value="annual">d. Tahunan (1–2 Thn · Wajib BPJS)</option></select></label>' +
      '<label><b>2. Self-Set Expert Fee (IDR):</b><input type="number" id="plBaseFee" value="500000" min="50000" step="50000" style="width:100%;padding:5px;border:1px solid #cbd5e1;border-radius:4px;"></label>' +
      '<label><b>3. Urgensi &amp; Wilayah:</b><select id="plUrgentZone" style="width:100%;padding:5px;border:1px solid #cbd5e1;border-radius:4px;"><option value="0|0">Normal · Dalam Kota/Kabupaten (+0%)</option><option value="0.25|0">Urgent / Emergency Call-Out (+25%)</option><option value="0|350000">Luar Kota/Kabupaten (Transport Taksi +Rp 350rb)</option><option value="0.25|350000">Urgent + Luar Kota (Taksi +Rp 350rb &amp; +25%)</option></select></label>' +
      '<label><b>4. Paket Add-On (RAB / Survey / Design):</b><input type="number" id="plAddonFee" value="0" min="0" step="50000" placeholder="0 jika tidak ada" style="width:100%;padding:5px;border:1px solid #cbd5e1;border-radius:4px;"></label></div>' +
      '<div id="plSummaryBar" style="background:#fff;border:1px dashed #d97706;padding:7px;border-radius:5px;line-height:1.45;"></div></div>';
  };
  window.recalc3vaPriceLock = function(catName) {
    var box = document.getElementById("plSummaryBar"); if (!box) return;
    var ct = document.getElementById("plContractType").value;
    var base = parseFloat(document.getElementById("plBaseFee").value) || 0;
    var uz = (document.getElementById("plUrgentZone").value || "0|0").split("|");
    var addon = parseFloat(document.getElementById("plAddonFee").value) || 0;
    var urgAmt = Math.round(base * parseFloat(uz[0] || 0)), taxiAmt = parseFloat(uz[1] || 0);
    var isRisk = HIGH_RISK.test(catName || "");
    var needBpjs = (ct === "casual" || ct === "annual" || (ct === "incidental" && isRisk));
    var bpjsTotal = needBpjs ? 215000 : 0;
    var workerNet = base + urgAmt + taxiAmt + addon;
    var pph21UserBorne = Math.round(workerNet * 0.025);
    var feeRate = (ct === "casual" || ct === "annual") ? 0.11 : 0.15; var agencyFee = Math.round(workerNet * feeRate);
    var userGrandTotal = workerNet + bpjsTotal + pph21UserBorne + agencyFee;
    box.innerHTML = '<b>100% Hak Bersih Human Expert (Zero Deduction):</b> ' + fmtIDR(workerNet) + ' (Base + Urgent + Taksi + Paket RAB)<br>' +
      '<b>Auto-Deduction Awal Closing (Beban Service User):</b> BPJS SIPP-Online: <b style="color:#15803d;">' + (needBpjs ? fmtIDR(bpjsTotal) + ' (JKK+JKM)' : 'Rp 0 (Opsional)') + '</b> · PPh 21 Expert (2,5% Ditanggung User): <b style="color:#15803d;">' + fmtIDR(pph21UserBorne) + '</b><br>' +
      '<b>Agency Fee EASTVENTURA (" + Math.round(feeRate*100) + "% Terpisah):</b> ' + fmtIDR(agencyFee) + ' | <b style="color:#0f172a;">TOTAL PRICE LOCK USER: ' + fmtIDR(userGrandTotal) + '</b>';
  };
  document.addEventListener("change", function(e) { if (e.target && /^pl(ContractType|BaseFee|UrgentZone|AddonFee)$/.test(e.target.id)) window.recalc3vaPriceLock(window._e5SrvTitle || ""); });
  document.addEventListener("input", function(e) { if (e.target && /^pl(BaseFee|AddonFee)$/.test(e.target.id)) window.recalc3vaPriceLock(window._e5SrvTitle || ""); });
})();
(function() {
  var origBuild = window.build3vaHumanPriceLockHTML, origRecalc = window.recalc3vaPriceLock;
  function fmtIDR(n) { return "Rp " + Math.round(n).toLocaleString("id-ID"); }
  window.build3vaHumanPriceLockHTML = function(catName) {
    var isCorp = /3VA-SRV-CORP|Corporate|PT|CV/i.test(catName || "") || (/Corporate|PT|CV/i.test((document.getElementById("vendorRole")||{}).value||"") && !/3VA-SRV-EXP/i.test(catName||""));
    if (!isCorp) return origBuild ? origBuild(catName) : "";
    return '<div id="evaCorpLockBox" style="margin:10px 0;padding:10px;border:1.5px solid #1e3a8a;border-radius:8px;background:#eff6ff;font-size:11.5px;color:#1e293b;">' +
      '<div style="font-weight:800;color:#1e3a8a;margin-bottom:6px;">🏢 CORPORATE VENDOR (PT / CV) B2B BOQ &amp; TAX LOCK</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:6px;">' +
      '<label><b>1. Skema Kontrak B2B:</b><select id="cpContractType" style="width:100%;padding:5px;border:1px solid #cbd5e1;border-radius:4px;"><option value="lumpsum">Turnkey BOQ / Lump Sum Project</option><option value="retainer">Monthly SLA Retainer (Estate/Resort)</option><option value="unit">Per m² / Unit Installation</option></select></label>' +
      '<label><b>2. Nilai BOQ / Jasa Bersih PT/CV (IDR):</b><input type="number" id="cpBaseFee" value="15000000" min="1000000" step="500000" style="width:100%;padding:5px;border:1px solid #cbd5e1;border-radius:4px;"></label>' +
      '<label><b>3. Rezim Pajak Korporasi (Beban User):</b><select id="cpTaxMode" style="width:100%;padding:5px;border:1px solid #cbd5e1;border-radius:4px;"><option value="0.02">PPh Pasal 23 Jasa Teknik/Manajemen (2%)</option><option value="0.0265">PPh Final Jasa Konstruksi SBUJK (2,65%)</option></select></label>' +
      '<label><b>4. Status PKP e-Faktur PPN 11%:</b><select id="cpPpnMode" style="width:100%;padding:5px;border:1px solid #cbd5e1;border-radius:4px;"><option value="0.11">PKP Resmi (+PPN 11% Ditanggung User)</option><option value="0">Non-PKP (Tanpa PPN 11%)</option></select></label></div>' +
      '<div id="cpSummaryBar" style="background:#fff;border:1px dashed #2563eb;padding:7px;border-radius:5px;line-height:1.45;"></div></div>';
  };
  window.recalc3vaPriceLock = function(catName) {
    var box = document.getElementById("cpSummaryBar");
    if (!box) { if (origRecalc) origRecalc(catName); return; }
    var base = parseFloat(document.getElementById("cpBaseFee").value) || 0;
    var pphRate = parseFloat(document.getElementById("cpTaxMode").value) || 0.02;
    var ppnRate = parseFloat(document.getElementById("cpPpnMode").value) || 0;
    var pphAmt = Math.round(base * pphRate), ppnAmt = Math.round(base * ppnRate), agFee = Math.round(base * 0.12);
    var grandTotal = base + pphAmt + ppnAmt + agFee, dp70 = Math.round(grandTotal * 0.70);
    box.innerHTML = '<b>100% Hak Bersih PT/CV (Nett BOQ):</b> ' + fmtIDR(base) + ' | <b>PPh (' + (pphRate*100).toFixed(2) + '%) + PPN (' + Math.round(ppnRate*100) + '%):</b> ' + fmtIDR(pphAmt + ppnAmt) + '<br>' +
      '<b>Agency Fee EASTVENTURA (12% Terpisah):</b> ' + fmtIDR(agFee) + ' | <b>TOTAL KONTRAK B2B: ' + fmtIDR(grandTotal) + '</b> (<b>DP 70% Awal: ' + fmtIDR(dp70) + '</b>)';
  };
  document.addEventListener("change", function(e) { if (e.target && /^cp(ContractType|BaseFee|TaxMode|PpnMode)$/.test(e.target.id)) window.recalc3vaPriceLock(""); });
  document.addEventListener("input", function(e) { if (e.target && e.target.id === "cpBaseFee") window.recalc3vaPriceLock(""); });
})();
