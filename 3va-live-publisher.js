(function(){
  const LS_LISTINGS = '3va_live_listings_v1';
  const LS_VENDORS = '3va_live_vendors_v1';
  const VENDOR_MATRIX = {
    'Human Expert': {
      'Legal Advisor & Land Due Diligence': 'IDR 2,500,000 – 5,000,000 / scope (BPN & RTRW Check)',
      'Accounting & Tax Specialist': 'IDR 2,000,000 – 4,500,000 / month (Villa / PT Reporting)',
      'Executive Chef & Culinary': 'IDR 450,000 – 850,000 / day · IDR 7.5M – 14M / month',
      'Pastry & Bakery Specialist': 'IDR 350,000 – 650,000 / day · IDR 5.5M – 9.5M / month',
      'Private Butler & Hospitality': 'IDR 250,000 – 450,000 / day · IDR 4.0M – 6.5M / month',
      'Housekeeper': 'IDR 150,000 – 250,000 / visit · IDR 2.8M – 4.2M / month',
      'Pool & Spa Technician': 'IDR 350,000 – 600,000 / visit · IDR 650k – 1.2M / month',
      'MEP Technician (Mechanical, Electrical, Plumbing)': 'IDR 250,000 – 450,000 / point or day · IDR 3.8M – 6.0M / month',
      'Civil & Structural Foreman (Mandor)': 'IDR 300,000 – 500,000 / day (Supervised Crew)',
      'Carpenter & Woodwork Specialist': 'IDR 250,000 – 425,000 / day (Custom Teak & Fit-Out)',
      'Air Conditioner (AC) Technician': 'IDR 85,000 – 125,000 / unit wash · IDR 250k – 450k service',
      'Genset Technician': 'IDR 350,000 – 750,000 / call-out & load test',
      'Water & Wastewater Treatment (WTP / IPAL) Operator': 'IDR 350,000 – 650,000 / visit · IDR 3.5M – 6.0M / month',
      'Pest & Termite Control Technician': 'IDR 250,000 – 500,000 / visit (Residential / Villa)',
      'Fire Safety Equipment Specialist': 'IDR 250,000 – 850,000 / visit or unit (APAR Inspection, Refill & K3 Audit)',
      'IT Programmer & Web/System Specialist': 'IDR 350,000 – 750,000 / day · IDR 4.5M – 9.0M / month',
      'Interior Designer & Space Stylist': 'IDR 350,000 – 750,000 / day · IDR 3.5M – 8.0M / project',
      'Public Area, Gardener & Nursery Specialist': 'IDR 150,000 – 300,000 / visit · IDR 2.5M – 4.2M / month'
    },
    'Corporate Vendor': {
      'Civil & Building Contractor': 'IDR 3,200,000 – 5,500,000 / m² (Turnkey Construction / Fit-Out)',
      'Electrical & Power Engineering (PLN / Solar / Genset)': 'IDR 15,000,000 – 150,000,000+ / project (3-Phase / Off-Grid)',
      'Water & Wastewater Treatment (WTP / IPAL)': 'IDR 25,000,000 – 250,000,000+ / installation (RO / STP Resort)',
      'Heavy Equipment Rental (Alat Berat)': 'IDR 350,000 – 950,000 / hour (Excavator / Dozer / Loader)',
      'Corporate Legal, Notary & Licensing Firm': 'IDR 5,000,000 – 25,000,000 / corporate & PMA / PBG package',
      'Pest & Termite Control Company': 'IDR 15,000 – 35,000 / m² (Anti-Termite Soil Injection & Warranty)',
      'Facility Management & MEP Contractor': 'IDR 4,500,000 – 15,000,000 / month (Hotel / Resort Retainer)',
      'Fire Safety Equipment': 'IDR 5,000,000 – 150,000,000+ / package (APAR Supply, Hydrant, Fire Alarm & Suppression)',
      'Interior Design & Architectural Fit-Out': 'IDR 1,500,000 – 4,500,000 / m² or design package',
      'Public Area, Garden Maintenance & Plant Nursery': 'IDR 2,500,000 – 12,000,000 / month (Resort / Estate Landscaping)'
    }
  };
  function compressImage(file) {
    return new Promise((resolve) => {
      if (!file) return resolve('https://unsplash.com');
      const r = new FileReader();
      r.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const c = document.createElement('canvas');
          const s = Math.min(1, 720 / img.width);
          c.width = img.width * s; c.height = img.height * s;
          c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
          resolve(c.toDataURL('image/jpeg', 0.72));
        };
        img.src = e.target.result;
      };
      r.readAsDataURL(file);
    });
  }
  window.syncVendorForm = function() {
    const role = document.getElementById('vendorRole')?.value || 'Human Expert';
    const catSel = document.getElementById('vendorCategory');
    const corpBox = document.getElementById('vendorCorpBox');
    if (corpBox) corpBox.style.display = (role === 'Corporate Vendor') ? 'block' : 'none';
    if (catSel && VENDOR_MATRIX[role]) {
      catSel.innerHTML = Object.keys(VENDOR_MATRIX[role]).map(k => '<option value="' + k + '">' + k + '</option>').join('');
    }
    window.syncVendorRate();
  };
  window.syncVendorRate = function() {
    const role = document.getElementById('vendorRole')?.value || 'Human Expert';
    const cat = document.getElementById('vendorCategory')?.value || '';
    const basis = document.getElementById('vendorRateBasis')?.value || '';
    const guide = document.getElementById('vendorGuidanceBox');
    const tariff = document.getElementById('vendorTariff');
    const benchmark = (VENDOR_MATRIX[role] && VENDOR_MATRIX[role][cat]) || '';
    if (guide) guide.innerHTML = '<strong>Eastern Indonesia Market Benchmark (' + role + '):</strong> ' + benchmark + '<br><span class="small">Selected Billing Basis: ' + basis + ' · Escrow Protection: 70% DP / 30% Completion.</span>';
    if (tariff && !tariff.dataset.edited) tariff.value = benchmark.split('(')[0].trim();
  };
  function hydrateListings() {
    if (typeof listings === 'undefined') return;
    const saved = JSON.parse(localStorage.getItem(LS_LISTINGS) || '[]');
    saved.forEach(item => { if (!listings.some(x => x.id === item.id)) listings.unshift(item); });
    if (typeof renderListings === 'function') { renderListings('land'); renderListings('property'); }
  }
  function renderVendors() {
    const srvWrap = document.querySelector('#services .wrap');
    if (!srvWrap) return;
    let box = document.getElementById('liveVendorDirectory');
    if (!box) { box = document.createElement('div'); box.id = 'liveVendorDirectory'; box.style.marginTop = '26px'; srvWrap.appendChild(box); }
    const vendors = JSON.parse(localStorage.getItem(LS_VENDORS) || '[]');
    if (!vendors.length) { box.innerHTML = ''; return; }
    box.innerHTML = '<h3 style="margin-bottom:12px">Verified Human Experts (' + vendors.length + ')</h3><div class="service-grid" style="grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:16px">' +
      vendors.map(v => '<div class="service" style="background:#fff"><img src="' + v.img + '" style="width:100%;height:140px;object-fit:cover;border-radius:6px;margin-bottom:10px"><div class="num">' + v.code + ' · ' + v.role + ' · ' + v.region + '</div><h3>' + v.displayName + '</h3><p style="font-size:13px"><strong>' + v.category + '</strong> (' + v.tier + ')<br>' + v.scope + '</p><div class="fee">' + v.tariff + ' (' + v.basis + ')</div></div>').join('') + '</div>';
  }
  function bindForms() {
    const vf = document.getElementById('vendorForm');
    if (vf && !vf.dataset.bound) {
      vf.dataset.bound = '1';
      vf.addEventListener('submit', async (e) => {
        e.preventDefault();
        const role = document.getElementById('vendorRole').value;
        const comp = document.getElementById('vendorCompanyName')?.value.trim();
        const lic = document.getElementById('vendorLicenseNo')?.value.trim();
        if (role === 'Corporate Vendor' && (!comp || !lic)) return alert('Corporate Vendor requires Company Name (PT/CV) and NIB/SBUJK License Number.');
        const vendors = JSON.parse(localStorage.getItem(LS_VENDORS) || '[]');
        const code = (role === 'Corporate Vendor' ? '3VA-VC' : '3VA-VE') + (101 + vendors.length);
        const pic = document.getElementById('vendorPicName').value.trim();
        vendors.unshift({
          code, role,
          displayName: role === 'Corporate Vendor' ? comp + ' (PIC: ' + pic + ')' : pic,
          category: document.getElementById('vendorCategory').value,
          region: document.getElementById('vendorRegion').value,
          basis: document.getElementById('vendorRateBasis').value,
          tariff: document.getElementById('vendorTariff').value.trim(),
          tier: document.getElementById('vendorTier').value,
          scope: document.getElementById('vendorScope').value.trim(),
          img: await compressImage(document.getElementById('vendorPhoto')?.files[0])
        });
        localStorage.setItem(LS_VENDORS, JSON.stringify(vendors));
        renderVendors(); vf.reset(); document.getElementById('vendorTariff').dataset.edited = ''; syncVendorForm();
        alert('Published! ' + code + ' is now live in the eastventura.biz.id Service Vendor Directory.');
        document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
      });
    }
    const of = document.querySelector('#panel-owner form');
    if (of && !of.dataset.liveOwnerBound) {
      of.dataset.liveOwnerBound = '1'; const orig = window.submitOwner;
      window.submitOwner = async function(e) {
        e.preventDefault();
        const isP = document.getElementById('assetCat')?.value === 'Land & Property';
        const region = document.getElementById('regRegion')?.value || 'Lombok', city = document.getElementById('regCity')?.value || region;
        const size = document.getElementById('inLandSize')?.value || '500', rawP = (document.getElementById('inPrice')?.value || '1,500,000,000').trim();
        const saved = JSON.parse(localStorage.getItem(LS_LISTINGS) || '[]');
        const code = (isP ? '3VA-P' : '3VA-L') + (901 + saved.length);
        const item = { id: code, code, type: isP ? 'property' : 'land', title: (isP ? 'Curated Property ' : 'Verified Land ') + size + ' m² — ' + city, area: region, place: city, zone: (document.getElementById('inPriceType')?.value || 'Nett Price') + ' · ATR/BPN Verified', status: 'For Sale', badge: code, price: rawP.toUpperCase().startsWith('IDR') ? rawP : 'IDR ' + rawP, size: size + ' m²', img: await compressImage(of.querySelector('#owner-step-4 input[type="file"]')?.files[0]) };
        saved.unshift(item); localStorage.setItem(LS_LISTINGS, JSON.stringify(saved));
        if (typeof listings !== 'undefined') listings.unshift(item);
        if (typeof renderListings === 'function') renderListings(item.type);
        if (typeof orig === 'function') { try { orig(e); } catch(_) {} }
        var isAuth = Array.from(document.querySelectorAll("button")).some(function(b) { return /Author\s*\(Open\)/i.test(b.textContent || ""); }) || window.is3vaSuperAdmin || sessionStorage.getItem("3va_sa_unlocked") === "1";
        if (isAuth) {
          var t = document.createElement("div");
          t.textContent = "✅ Author Mode: Listing " + code + " live on front catalog (Non-blocking).";
          t.style.cssText = "position:fixed;bottom:16px;left:50%;transform:translateX(-50%);z-index:2147483647;background:#166534;color:#fff;border:1.5px solid #86efac;padding:9px 16px;border-radius:8px;font-size:12px;font-weight:700;box-shadow:0 8px 20px rgba(0,0,0,.35);";
          document.body.appendChild(t);
          setTimeout(function() { t.remove(); }, 3500);
        } else {
          alert('Published! Listing ' + code + ' is now live on the front catalog.');
        }
      };
    }
  }
  window.addEventListener('DOMContentLoaded', () => { syncVendorForm(); hydrateListings(); renderVendors(); bindForms(); setTimeout(hydrateListings, 350); });
})();
