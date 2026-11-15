(function(){
  var st=document.createElement("style");
  st.textContent=".eva-ov{display:none;position:fixed;inset:0;background:rgba(10,15,25,.88);z-index:999999;align-items:center;justify-content:center;padding:16px;font-family:sans-serif}.eva-bx{background:#fff;color:#0f172a;width:100%;max-width:850px;max-height:92vh;border-radius:12px;display:flex;flex-direction:column;overflow:hidden}.eva-hd{background:#1e3a2f;color:#fff;padding:14px 20px;display:flex;justify-content:space-between;align-items:center}.eva-bd{padding:18px;overflow-y:auto;font-size:12px;line-height:1.5}.eva-gr{display:flex;flex-direction:column;gap:10px;border-bottom:1px solid #cbd5e1;padding-bottom:10px;margin-bottom:10px;touch-action:pan-x pan-y pinch-zoom}.eva-cl{padding-bottom:8px;border-bottom:1px dashed #cbd5e1}.eva-cl:last-child{border-bottom:none;padding-bottom:0}.eva-en{font-size:1em;font-weight:500;color:#0f172a;line-height:1.45;padding-bottom:4px;border-bottom:1px solid #64748b;margin-bottom:4px}.eva-id{font-size:0.88em;font-style:italic;color:#334155;line-height:1.4}.eva-zm-bar{display:flex;justify-content:flex-end;align-items:center;gap:6px;margin-bottom:8px}.eva-zm-btn{background:#e2e8f0;color:#0f172a;border:1px solid #94a3b8;border-radius:4px;padding:2px 8px;font-size:11px;font-weight:700;cursor:pointer}@media print{.eva-zm-bar{display:none !important}}.eva-ft{background:#f8fafc;padding:12px 20px;display:flex;justify-content:space-between;gap:8px}.eva-bt{padding:9px 14px;border-radius:6px;font-weight:700;cursor:pointer;border:none;font-size:12px}.bt-ok{background:#1e3a2f;color:#fff}.bt-pdf{background:#1d4ed8;color:#fff}.eva-err{border:2px solid #dc2626 !important;background-color:#fef2f2 !important}";
  document.head.appendChild(st);
  setInterval(function(){
    document.querySelectorAll("div").forEach(function(d){
      if((d.textContent.indexOf("Below IDR 1 Billion: 3%")!==-1 || d.textContent.indexOf("3va.id Verified Direct Owner Listing")!==-1) && d.textContent.length<300){
        d.style.setProperty("display","none","important");
      }
    });
  }, 150);
  window.make3vaBarcodeSVG=function(code){
    var bars="",x=4;
    for(var i=0;i<code.length;i++){var v=code.charCodeAt(i),w1=(v%3)+1,w2=((v>>2)%2)+1;bars+='<rect x="'+x+'" y="4" width="'+w1+'" height="36" fill="#0f172a"/>';x+=w1+2;bars+='<rect x="'+x+'" y="4" width="'+w2+'" height="36" fill="#0f172a"/>';x+=w2+2;}
    return '<svg width="160" height="54" viewBox="0 0 '+(x+4)+' 54" xmlns="http://w3.org" style="border:1px solid #cbd5e1;padding:2px;background:#fff">'+bars+'<text x="50%" y="50" font-size="8" font-family="monospace" text-anchor="middle" fill="#0f172a">'+code+'</text></svg>';
  };
  var w=document.createElement("div");
  w.innerHTML='<div id="evaM" class="eva-ov"><div class="eva-bx"><div class="eva-hd"><strong id="evaT">3va.id Official Agreement</strong><button type="button" style="background:none;border:none;color:#fff;font-size:18px;cursor:pointer" onclick="document.getElementById(\'evaM\').style.display=\'none\'">✕</button></div><div class="eva-bd" id="evaB"></div><div class="eva-ft"><button type="button" class="eva-bt bt-pdf" onclick="window.print()">⬇ Save / Print Official PDF (1 Page + Barcode)</button><button type="button" class="eva-bt bt-ok" id="evaOk">✓ I Agree &amp; Electronically Sign</button></div></div></div>';
  document.body.appendChild(w.firstChild);
  window.evaZoomLvl = 12;
  window.adj3vaZoom = function(delta) {
    window.evaZoomLvl = delta === 0 ? 12 : Math.min(18, Math.max(9.5, window.evaZoomLvl + delta));
    var el = document.getElementById("evaClausesWrap");
    if (el) el.style.fontSize = window.evaZoomLvl + "px";
  };
  window.open3va=function(role,price,cb,sel){
    var p = Number(price) || 0;
    var r = p>3e9?0.04:(p>=1e9?0.05:0.06), pct = p>3e9?"4%":(p>=1e9?"5%":"6%");
    var dp = new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(Math.round(p*r));
    var docId = "3VA-"+role.toUpperCase()+"-"+Date.now().toString(36).toUpperCase();
    var hasCode = sel && sel.code;
    var codeHtml = hasCode
      ? "<span style=\"background:#dcfce7;color:#15803d;font-weight:800;padding:1px 6px;border-radius:4px;border:1px solid #16a34a;\">"+sel.code+"</span>"
      : "<span class=\"eva-code-link\" onclick=\"window.start3vaCodeSelection()\">\u201ccode\u201d<span class=\"eva-code-tip\">click to find land/property detail code</span></span>";
    var b1En = hasCode
      ? "1. Required DP ("+pct+" - "+dp+") transferred to 3va.id legally locks listing as \"Sold Out (Confirmed)\"."
      : "1. The transactions are required of Down Payment (DP) as followed; 6% DP for the transactions Below IDR 1 Billion | 5% DP for transactions IDR 1 - 3 Billion | 4% DP for transactions over 3 Billion.";
    var b1Id = hasCode
      ? "1. DP Wajib ("+pct+" - "+dp+") ke rekening 3va.id mengunci properti berstatus \"Sold Out (Confirmed)\"."
      : "1. Transaksi mewajibkan Down Payment (DP) dengan ketentuan; DP 6% untuk transaksi di bawah IDR 1 Miliar | DP 5% untuk transaksi IDR 1 - 3 Miliar | DP 4% untuk transaksi di atas IDR 3 Miliar.";

    var cl = function(en, id) {
      return "<div class=\"eva-cl\"><div class=\"eva-en\">"+en+"</div><div class=\"eva-id\">"+id+"</div></div>";
    };

    var clauses = role==="owner"
      ? cl("1. Closing occurs upon valid DP transfer to the official 3va.id account.", "1. Closing dinyatakan sah saat pembayaran DP masuk ke rekening resmi 3va.id.")
        + cl("2. Direct Tiered Commission Deduction from DP: Below IDR 1B: 3% | IDR 1B - 3B: 2.5% | Above IDR 3B: 2%. Zero post-closing fee.", "2. Pemotongan Komisi Berjenjang Langsung dari DP: &lt; IDR 1M: 3% | IDR 1M - 3M: 2,5% | &gt; IDR 3M: 2%. Bebas komisi tambahan saat pelunasan.")
        + cl("3. Admin locks listing status as Sold Out (Confirmed). Zero post-closing liability for 3va.id.", "3. Admin mengunci status iklan menjadi Sold Out (Confirmed). 3va.id bebas dari segala tuntutan pasca-closing.")
        + cl("4. Reciprocal Force Majeure & Human Rights (KUHPerdata 1244-1245): Death, severe accident, or disaster waives default; legal heirs may assume rights.", "4. Perlindungan Force Majeure & HAM Timbal Balik (KUHPerdata 1244-1245): Kematian, kecelakaan berat, atau bencana membebaskan sanksi; ahli waris sah berhak melanjutkan hak.")
      : cl(b1En, b1Id)
        + cl("2. I hereby agree and fully commit to proceeding with the purchase of (Land/Property) via EASTVENTURA-3va.id—as identified by the "+codeHtml+"—and to abide by all of the company’s transaction terms and conditions, as well as the laws governing such transactions in Indonesia.", "2. Saya dengan ini menyetujui dan berkomitmen penuh untuk melanjutkan pembelian (Tanah/Properti) melalui EASTVENTURA-3va.id—sebagaimana diidentifikasi melalui "+codeHtml+"—serta mematuhi seluruh syarat dan ketentuan transaksi perusahaan maupun hukum yang berlaku di Indonesia.")
        + cl("3. Full settlement within 5 Indonesian working days. No settlement or written notice within 1 month (30 days) voids deal and forfeits 100% DP. Zero post-closing liability for 3va.id.", "3. Pelunasan maksimal dalam 5 hari kerja instansional. Tanpa pelunasan atau konfirmasi tertulis hingga 1 bulan (30 hari), transaksi batal & DP hangus 100%. 3va.id bebas tuntutan pasca-closing.")
        + cl("4. Reciprocal Force Majeure & Human Rights: Verified death, severe accident, or disaster waives DP forfeiture; legal heirs may continue or receive fair refund.", "4. Perlindungan Force Majeure & HAM Timbal Balik: Kematian, kecelakaan berat, atau bencana terverifikasi membebaskan hangus DP; ahli waris sah berhak melanjutkan atau menerima pengembalian adil.");

    var zoomBar = "<div class=\"eva-zm-bar\"><span style=\"font-size:10.5px;color:#64748b;margin-right:auto;\">Pinch / Adjust Text Size:</span><button type=\"button\" class=\"eva-zm-btn\" onclick=\"window.adj3vaZoom(-1)\">A−</button><button type=\"button\" class=\"eva-zm-btn\" onclick=\"window.adj3vaZoom(0)\">Reset</button><button type=\"button\" class=\"eva-zm-btn\" onclick=\"window.adj3vaZoom(1)\">A+</button></div>";
    var txt = zoomBar + "<div id=\"evaClausesWrap\" class=\"eva-gr\" style=\"font-size:"+window.evaZoomLvl+"px\">" + clauses + "</div>";

    document.getElementById("evaT").textContent = role==="owner" ? "OWNER BILINGUAL AGREEMENT" : (hasCode ? "BUYER DEAL AGREEMENT — "+sel.code+" ("+pct+" DP)" : "BUYER DIGITAL NCNDA & COMMITMENT");
    document.getElementById("evaB").innerHTML = "<div id=\"evaPr\" style=\"padding:10px;background:#fff\"><div style=\"display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #0f172a;padding-bottom:8px;margin-bottom:10px\"><div><b style=\"font-size:15px\">3va.id — EASTVENTURA OFFICIAL AGREEMENT</b><br><small>Bilingual Electronic Consent ("+role.toUpperCase()+")</small></div><div>"+window.make3vaBarcodeSVG(docId)+"</div></div>"+txt+"<div style=\"background:#f1f5f9;padding:8px;font-size:11px;border-radius:4px\"><b>[✓] ELECTRONICALLY SIGNED (UU ITE &amp; UNCITRAL)</b> | ID: "+docId+" | "+new Date().toISOString()+"</div></div>";
    document.getElementById("evaM").style.display="flex";
    document.getElementById("evaOk").style.display="inline-block";
    document.getElementById("evaOk").onclick=function(){
      if(role==="buyer" && hasCode && window.open3vaBuyerCheckout){
        window.open3vaBuyerCheckout(pct, p);
        if(cb)cb();
      } else {
        document.getElementById("evaM").style.display="none";
        if(cb)cb();
      }
    };
  };
  window.is3vaSuperAdmin = (sessionStorage.getItem('3va_author_session_open')==='1');
  var SUPER_ADMIN_PIN="3VA2026";
  setInterval(function(){
    var h=Array.from(document.querySelectorAll("h1,h2,h3,div")).find(function(e){return e.children.length===0 && e.textContent.indexOf("Member Access")!==-1;});
    if(h && !document.getElementById("evaAdminPinBtn")){
      var b=document.createElement("button");
      b.id="evaAdminPinBtn"; b.type="button";
      b.textContent="🔐 Super Admin Bypass (PIN Required)";
      b.style.cssText="margin:8px 0;padding:6px 12px;font-size:11px;font-weight:700;border-radius:6px;border:1px solid #1e3a2f;background:#f0fdf4;color:#1e3a2f;cursor:pointer;display:inline-block;";
      b.onclick=function(){
        if(window.is3vaSuperAdmin){
          window.is3vaSuperAdmin = (sessionStorage.getItem('3va_author_session_open')==='1');
          b.textContent="🔐 Super Admin Bypass (PIN Required)";
          b.style.background="#f0fdf4"; b.style.color="#1e3a2f";
          return;
        }
        var pin=prompt("Masukkan PIN Khusus Super Admin 3va.id:");
        if(pin===SUPER_ADMIN_PIN){
          window.is3vaSuperAdmin=true;
          b.textContent="⚡ SUPER ADMIN UNLOCKED (Bypass Active - Click to Lock)";
          b.style.background="#fef08a"; b.style.color="#854d0e";
        } else if(pin!==null){
          alert("❌ PIN Salah! Akses Super Admin ditolak.");
        }
      };
      h.parentNode.appendChild(b);
    }
  }, 300);

  document.addEventListener("click",function(e){
    var b=e.target.closest("button");
    if(!b || b.id==="evaAdminPinBtn" || b.id==="evaOk" || b.dataset.ok) return;
    var t=b.textContent.toLowerCase();
    var isAction=t.indexOf("next")!==-1 || t.indexOf("submit")!==-1 || t.indexOf("verification")!==-1 || t.indexOf("complete")!==-1 || t.indexOf("request")!==-1;
    if(!isAction) return;

    if(!window.is3vaSuperAdmin && sessionStorage.getItem('3va_author_session_open')!=='1' && sessionStorage.getItem('3va_author_session_open')!=='1'){
      var box=b.closest("[role='dialog'], .modal") || document.body;
      var bad=null;
      box.querySelectorAll("input,select,textarea").forEach(function(el){
        if(el.offsetParent===null || el.type==="hidden" || el.type==="button" || el.type==="submit") return;
        el.classList.remove("eva-err");
        var v=(el.value||"").trim().toLowerCase();
        var empty=(el.type==="checkbox") ? !el.checked : (el.tagName==="SELECT" ? (!v || v.indexOf("select")===0 || v.indexOf("pilih")===0) : !v);
        if(empty){ el.classList.add("eva-err"); if(!bad) bad=el; }
      });
      if(bad){
        e.preventDefault(); e.stopImmediatePropagation();
        bad.focus();
        if (window.is3vaSuperAdmin || sessionStorage.getItem('3va_sa_unlocked')==='1') return true; alert("⚠️ STRICT VALIDATION (3va.id):\nHarap lengkapi semua kolom berwarna merah dan dropdown sebelum melanjutkan!");
        return;
      }
    }

    if(t.indexOf("submit for bpn")!==-1 || t.indexOf("submit listing")!==-1){
      e.preventDefault(); e.stopImmediatePropagation();
      open3va("owner",0,function(){b.dataset.ok="1";b.click();});
    } else if(t.indexOf("buyer verification")!==-1 || t.indexOf("down payment")!==-1){
      e.preventDefault(); e.stopImmediatePropagation();
      var i=document.querySelector("input[name*=price],input[id*=price]");
      var val=i?parseFloat(i.value.replace(/[^0-9]/g,"")):15e8;
      open3va("buyer",val||15e8,function(){b.dataset.ok="1";b.click();});
    }
  }, true);
})();
