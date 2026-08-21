'use client';

import React, { useState, useEffect } from 'react';

export default function LeadsTab({
  leads,
  leadsTotal,
  leadsPages,
  leadsPage,
  setLeadsPage,
  leadsSearch,
  onSearchChange,
  leadsStatus,
  onStatusChange,
  leadsLoading,
  consultants,
  inventory = [],
  onAssignConsultant,
  onUpdateStatus,
  token
}) {
  const [localSearch, setLocalSearch] = useState(leadsSearch);
  const [showShopifyModal, setShowShopifyModal] = useState(false);
  const [selectedLeadModal, setSelectedLeadModal] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // Custom dropdown open states
  const [filterOpen, setFilterOpen] = useState(false);
  const [openStatusDropdownId, setOpenStatusDropdownId] = useState(null);
  const [openProductDropdownId, setOpenProductDropdownId] = useState(null);
  const [openConsultantDropdownId, setOpenConsultantDropdownId] = useState(null);
  const [productSearch, setProductSearch] = useState('');
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

  const handleOpenDropdown = (e, type, id = null) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const popupWidth = type === 'product' ? 270 : type === 'consultant' ? 170 : 145;
    const popupHeight = type === 'product' ? 260 : type === 'consultant' ? 190 : 160;
    
    const targetLeft = Math.min(rect.left, window.innerWidth - popupWidth - 16);
    const spaceBelow = window.innerHeight - rect.bottom;
    const opensUpward = spaceBelow < popupHeight && rect.top > spaceBelow;

    const targetTop = opensUpward
      ? Math.max(12, rect.top - popupHeight - 6)
      : Math.min(rect.bottom + 6, window.innerHeight - popupHeight - 12);

    setDropdownPos({
      top: Math.max(12, targetTop),
      left: Math.max(16, targetLeft)
    });

    if (type === 'status') {
      setOpenStatusDropdownId(openStatusDropdownId === id ? null : id);
      setOpenProductDropdownId(null);
      setOpenConsultantDropdownId(null);
      setFilterOpen(false);
    } else if (type === 'product') {
      setProductSearch('');
      setOpenProductDropdownId(openProductDropdownId === id ? null : id);
      setOpenStatusDropdownId(null);
      setOpenConsultantDropdownId(null);
      setFilterOpen(false);
    } else if (type === 'consultant') {
      setOpenConsultantDropdownId(openConsultantDropdownId === id ? null : id);
      setOpenStatusDropdownId(null);
      setOpenProductDropdownId(null);
      setFilterOpen(false);
    } else if (type === 'filter') {
      setFilterOpen(!filterOpen);
      setOpenStatusDropdownId(null);
      setOpenStatusDropdownId(null);
      setOpenConsultantDropdownId(null);
    }
  };

  const itemsPerPage = 20;

  // Debounce search query to optimize API request frequency
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onSearchChange(localSearch);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [localSearch]);

  // Sync local search when parent state updates
  useEffect(() => {
    setLocalSearch(leadsSearch);
  }, [leadsSearch]);

  const apiOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5000';
  const shopifySnippet = `<!-- Consultation Form Wrapper -->
<div class="consultation-form-container">
  <div class="form-header">
    <h3>CONSULTATION FORM</h3>
    <div class="vedic-notice">
      <p><strong>Optional Donation Basis:</strong> As we follow the sacred Vedic path, we do not charge a mandatory fee for astrology consultations. However, voluntary contributions are warmly welcomed and utilized for noble & charitable causes.</p>
      <p class="sub-notice">If you do not wish to donate at this time, simply enter <strong>0</strong> in the payment box below.</p>
    </div>
  </div>
  
  <form id="shopify-lead-form">
    <div class="form-group">
      <label>Full Name *</label>
      <input type="text" name="name" required placeholder="Enter your full name">
    </div>

    <div class="form-row">
      <div class="form-group flex-1">
        <label>Date of Birth *</label>
        <input type="date" name="dob" required>
      </div>
      <div class="form-group flex-1">
        <label>Time of Birth *</label>
        <input type="time" name="tob" required>
      </div>
    </div>

    <div class="form-group">
      <label>Place of Birth *</label>
      <input type="text" name="pob" required placeholder="City, State, Country">
    </div>

    <div class="form-row">
      <div class="form-group flex-1">
        <label>WhatsApp Number *</label>
        <input type="tel" name="whatsapp" required placeholder="e.g. 9876543210">
      </div>
      <div class="form-group flex-1">
        <label>Email ID *</label>
        <input type="email" name="email" required placeholder="john@example.com">
      </div>
    </div>

    <div class="form-row">
      <div class="form-group flex-1">
        <label>Current Location *</label>
        <input type="text" name="location" required placeholder="City, Country">
      </div>
      <div class="form-group flex-1">
        <label>Occupation</label>
        <input type="text" name="occupation" placeholder="e.g. Businessman, Software Engineer">
      </div>
    </div>

    <div class="form-group">
      <label>Medical History (If any)</label>
      <input type="text" name="medicalHistory" placeholder="Mention any past or ongoing health conditions">
    </div>

    <div class="form-group">
      <label>Currently wearing any Rudraksh or Crystal products?</label>
      <input type="text" name="wearingRudraksh" placeholder="If yes, please specify which ones (e.g. 5 Mukhi Rudraksha, Amethyst)">
    </div>

    <div class="form-group">
      <label>Preferred Time for Consultation (If any)</label>
      <input type="text" name="preferredTime" placeholder="e.g. Evening after 6 PM, Weekends">
    </div>

    <div class="form-group">
      <label>Area of Concern (If any)</label>
      <textarea name="concern" rows="3" placeholder="Describe your key concerns (Health, Career, Marriage, Finance, etc.)"></textarea>
    </div>

    <div class="form-group">
      <label>Website Product Interest</label>
      <input type="text" name="websiteProduct" placeholder="If you like something on our website, please mention product name or link">
    </div>

    <div class="form-group donation-box">
      <label>Optional Donation Contribution (₹)</label>
      <input type="number" name="donationAmount" min="0" value="0" placeholder="Enter amount or 0 if not donating">
      <span class="donation-hint">Enter 0 if you do not wish to contribute today. If you enter a donation amount, our team will contact you directly to share the payment details.</span>
    </div>
    
    <button type="submit" class="submit-btn">Submit Consultation Request</button>
    <p id="form-status" class="status-msg"></p>
  </form>
</div>

<!-- Embedded styling -->
<style>
.consultation-form-container {
  max-width: 600px;
  margin: 30px auto;
  padding: 32px;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: #ffffff;
  box-shadow: 0 12px 24px -4px rgba(0,0,0,0.06), 0 4px 6px -2px rgba(0,0,0,0.04);
  box-sizing: border-box;
}
.consultation-form-container h3 {
  margin: 0 0 16px 0;
  color: #1e293b;
  font-size: 1.5rem;
  font-weight: 800;
  text-align: center;
  border-bottom: 3px solid #61191c;
  padding-bottom: 12px;
  letter-spacing: -0.02em;
}
.vedic-notice {
  background-color: #FAF7F2;
  border: 1px solid #f1e5d8;
  border-left: 4px solid #61191c;
  padding: 14px 16px;
  border-radius: 10px;
  margin-bottom: 24px;
}
.vedic-notice p {
  margin: 0;
  font-size: 0.85rem;
  color: #475569;
  line-height: 1.55;
}
.vedic-notice .sub-notice {
  margin-top: 6px;
  font-size: 0.8rem;
  color: #61191c;
}
.form-group {
  margin-bottom: 18px;
  display: flex;
  flex-direction: column;
}
.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 650;
  font-size: 0.85rem;
  color: #334155;
}
.form-group input, 
.form-group textarea {
  width: 100%;
  padding: 11px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-size: 0.9rem;
  color: #0f172a;
  background-color: #f8fafc;
  box-sizing: border-box;
  transition: all 0.2s ease;
}
.form-group input:focus, 
.form-group textarea:focus {
  outline: none;
  border-color: #61191c;
  background-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(97, 25, 28, 0.12);
}
.donation-box {
  background: #fdfbf7;
  padding: 14px;
  border: 1px dashed #e2d3c3;
  border-radius: 12px;
}
.donation-hint {
  font-size: 0.8rem;
  color: #64748b;
  margin-top: 6px;
  line-height: 1.45;
  display: block;
}
.form-row {
  display: flex;
  gap: 16px;
}
.flex-1 {
  flex: 1;
}
.submit-btn {
  background: #61191c;
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  width: 100%;
  transition: all 0.2s ease;
  margin-top: 10px;
  box-shadow: 0 4px 12px rgba(97, 25, 28, 0.2);
}
.submit-btn:hover {
  background: #521316;
  transform: translateY(-1px);
}
.submit-btn:active {
  transform: translateY(0);
}
.status-msg {
  margin-top: 15px;
  display: none;
  text-align: center;
  font-weight: 700;
  font-size: 0.9rem;
}
@media (max-width: 600px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  .consultation-form-container {
    padding: 20px;
    margin: 15px auto;
  }
}
</style>

<!-- Intercept and submit data to API -->
<script>
document.getElementById('shopify-lead-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const form = e.target;
  const statusEl = document.getElementById('form-status');
  const submitBtn = form.querySelector('.submit-btn');
  
  const formData = {
    name: form.elements.name.value,
    email: form.elements.email.value,
    phone: form.elements.whatsapp.value,
    whatsapp: form.elements.whatsapp.value,
    dob: form.elements.dob.value,
    tob: form.elements.tob.value,
    pob: form.elements.pob.value,
    location: form.elements.location.value,
    occupation: form.elements.occupation ? form.elements.occupation.value : '',
    medicalHistory: form.elements.medicalHistory ? form.elements.medicalHistory.value : '',
    wearingRudraksh: form.elements.wearingRudraksh ? form.elements.wearingRudraksh.value : '',
    preferredTime: form.elements.preferredTime ? form.elements.preferredTime.value : '',
    concern: form.elements.concern ? form.elements.concern.value : '',
    websiteProduct: form.elements.websiteProduct ? form.elements.websiteProduct.value : '',
    donationAmount: form.elements.donationAmount ? form.elements.donationAmount.value : '0',
    message: form.elements.concern ? form.elements.concern.value : '',
    shopifyData: {
      domain: window.location.hostname,
      path: window.location.pathname,
      submittedAt: new Date().toISOString()
    }
  };
  
  statusEl.style.display = 'block';
  statusEl.style.color = '#475569';
  statusEl.textContent = 'Submitting your request...';
  submitBtn.disabled = true;
  submitBtn.style.opacity = '0.7';
  
  try {
    const response = await fetch('${apiOrigin}/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    const result = await response.json();
    
    if (response.ok && result.success) {
      statusEl.style.color = '#16a34a';
      statusEl.textContent = 'Thank you! Your consultation request has been submitted successfully.';
      form.reset();
    } else {
      statusEl.style.color = '#dc2626';
      statusEl.textContent = result.error || 'Submission failed. Please try again.';
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    statusEl.style.color = '#dc2626';
    statusEl.textContent = 'Connection error. Please check if your CRM backend server is running.';
  } finally {
    submitBtn.disabled = false;
    submitBtn.style.opacity = '1';
  }
});
</script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shopifySnippet);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const totalItems = leadsTotal;
  const totalPages = leadsPages;
  const activePage = leadsPage;
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + leads.length;
  const paginatedLeads = leads;

  return (
    <div className="space-y-3">
      {/* Filter, Search, and Action Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-2.5 px-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1 w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search leads by name, email, location, phone, concern..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#61191c]/20 focus:border-[#61191c] transition-all font-medium"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status:</span>
          <button
            onClick={(e) => handleOpenDropdown(e, 'filter')}
            className="flex items-center justify-between gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-full text-xs px-3.5 py-1.5 text-slate-700 font-bold cursor-pointer min-w-[125px] transition-colors"
          >
            <span>{leadsStatus === 'All' ? 'All Leads' : leadsStatus}</span>
            <svg className={`w-3.5 h-3.5 text-slate-400 transition-transform ${filterOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {filterOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setFilterOpen(false)}></div>
              <div
                style={{ top: `${dropdownPos.top}px`, left: `${dropdownPos.left}px` }}
                className="fixed z-50 w-[145px] bg-white border border-slate-200 rounded-2xl shadow-2xl p-1.5 animate-in fade-in zoom-in-95 duration-100 flex flex-col gap-0.5"
              >
                {['All', 'New', 'Contacted', 'Converted', 'Lost'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      onStatusChange(opt);
                      setFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-normal rounded-xl transition-all cursor-pointer ${
                      leadsStatus === opt ? 'text-[#61191c] bg-[#61191c]/10 font-semibold' : 'text-slate-700 hover:bg-slate-100/80'
                    }`}
                  >
                    {opt === 'All' ? 'All Leads' : opt}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm relative overflow-hidden">
        {leadsLoading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-30">
            <div className="w-8 h-8 border-3 border-slate-200 border-t-[#61191c] rounded-full animate-spin"></div>
          </div>
        )}

        <div className="overflow-x-auto min-h-[350px]">
          {leads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-3 border border-slate-100">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="font-bold text-slate-800 text-sm">No leads match criteria</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs font-medium">
                Try adjusting your search filter or generate a new inquiry via Shopify.
              </p>
            </div>
          ) : (
            <table className="w-full border-collapse text-left min-w-[950px]">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200/80 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  <th className="px-2.5 py-2.5 text-center w-10">#</th>
                  <th className="px-3 py-2.5">Client Profile</th>
                  <th className="px-3 py-2.5">Birth Details</th>
                  <th className="px-3 py-2.5">Consultation & Concern</th>
                  <th className="px-3 py-2.5">Status</th>
                  <th className="px-3 py-2.5">Consultant</th>
                  <th className="px-3 py-2.5">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {paginatedLeads.map((lead, index) => {
                  const serialNo = (activePage - 1) * itemsPerPage + index + 1;
                  const cleanWhatsApp = lead.whatsapp ? lead.whatsapp.replace(/\D/g, '') : (lead.phone ? lead.phone.replace(/\D/g, '') : '');
                  const displayWhatsApp = lead.whatsapp || lead.phone;

                  return (
                    <tr
                      key={lead._id}
                      onClick={() => setSelectedLeadModal(lead)}
                      className="hover:bg-slate-50/90 transition-colors group cursor-pointer"
                    >
                      {/* Serial Sequence Number */}
                      <td className="px-2.5 py-2.5 align-top text-center text-[11px] font-bold text-slate-400/80 whitespace-nowrap font-mono select-none">
                        #{serialNo < 10 ? `0${serialNo}` : serialNo}
                      </td>

                      {/* Client Details */}
                      <td className="px-3 py-2.5 align-top min-w-[190px]">
                        <div className="flex items-start gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#61191c]/10 text-[#61191c] font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5 border border-[#61191c]/20 group-hover:bg-[#61191c] group-hover:text-white transition-colors">
                            {lead.name ? lead.name.charAt(0).toUpperCase() : 'C'}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 text-xs truncate max-w-[150px] group-hover:text-[#61191c] transition-colors">{lead.name}</div>
                            <div className="text-[10px] text-slate-400 truncate max-w-[150px] font-medium">{lead.email}</div>
                            
                            {displayWhatsApp && (
                              <div className="mt-0.5">
                                <a
                                  href={`https://wa.me/${cleanWhatsApp}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-flex items-center gap-1.5 text-[9.5px] text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-bold px-1.5 py-0.5 rounded border border-emerald-200/80 transition-colors whitespace-nowrap"
                                  title="Chat on WhatsApp"
                                >
                                  <svg className="w-3 h-3 fill-emerald-600 shrink-0" viewBox="0 0 24 24">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                                  </svg>
                                  <span>{displayWhatsApp}</span>
                                </a>
                              </div>
                            )}

                            {(lead.location || lead.occupation) && (
                              <div className="text-[9.5px] text-slate-400 mt-0.5 font-medium truncate max-w-[150px]">
                                {lead.location}{lead.location && lead.occupation ? ' • ' : ''}{lead.occupation}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Birth Details */}
                      <td className="px-3 py-2.5 align-top whitespace-nowrap">
                        <div className="space-y-0.5 text-[11px] text-slate-700">
                          <div>
                            <span className="text-[9.5px] text-slate-400 font-medium">DOB:</span>{' '}
                            <span className="font-semibold text-slate-800">{lead.dob || '-'}</span>
                          </div>
                          <div>
                            <span className="text-[9.5px] text-slate-400 font-medium">TOB:</span>{' '}
                            <span className="font-semibold text-slate-800">{lead.tob || '-'}</span>
                          </div>
                          <div>
                            <span className="text-[9.5px] text-slate-400 font-medium">POB:</span>{' '}
                            <span className="font-semibold text-slate-800 max-w-[110px] truncate inline-block align-bottom">{lead.pob || '-'}</span>
                          </div>
                        </div>
                      </td>

                      {/* Consultation & Concern Details */}
                      <td className="px-3 py-2.5 align-top max-w-[240px]">
                        <p className="text-slate-800 font-medium leading-tight line-clamp-2 text-[11px]">
                          {lead.concern || lead.message || <span className="text-slate-400 italic text-[10px]">No concern specified</span>}
                        </p>

                        <div className="flex flex-wrap items-center gap-1 mt-1.5">
                          {Number(lead.donationAmount) > 0 && (
                            <span className="inline-flex items-center text-[9.5px] font-bold text-emerald-800 bg-emerald-100/80 px-1 py-0.2 rounded border border-emerald-200">
                              ₹{lead.donationAmount} Donation
                            </span>
                          )}
                          {lead.medicalHistory && (
                            <span className="inline-flex items-center text-[9.5px] font-semibold text-slate-600 bg-slate-100 px-1 py-0.2 rounded border border-slate-200/50">
                              Medical
                            </span>
                          )}
                          {lead.wearingRudraksh && (
                            <span className="inline-flex items-center text-[9.5px] font-semibold text-slate-600 bg-slate-100 px-1 py-0.2 rounded border border-slate-200/50">
                              Rudraksh
                            </span>
                          )}
                          <button
                            onClick={() => setSelectedLeadModal(lead)}
                            className="text-[9.5px] font-bold text-[#61191c] hover:underline cursor-pointer ml-auto"
                          >
                            Full Info →
                          </button>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-3 py-2.5 align-top whitespace-nowrap">
                        <button
                          onClick={(e) => handleOpenDropdown(e, 'status', lead._id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-full border cursor-pointer transition-all ${
                            lead.status === 'New' ? 'bg-rose-50 text-rose-700 border-rose-200/80' :
                            lead.status === 'Contacted' ? 'bg-amber-50 text-amber-700 border-amber-200/80' :
                            lead.status === 'Converted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80' :
                            'bg-slate-50 text-slate-600 border-slate-200'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            lead.status === 'New' ? 'bg-rose-500' :
                            lead.status === 'Contacted' ? 'bg-amber-500' :
                            lead.status === 'Converted' ? 'bg-emerald-500' : 'bg-slate-400'
                          }`}></span>
                          <span>{lead.status}</span>
                          <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        {openStatusDropdownId === lead._id && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setOpenStatusDropdownId(null)}></div>
                            <div
                              style={{ top: `${dropdownPos.top}px`, left: `${dropdownPos.left}px` }}
                              className="fixed z-50 w-[140px] bg-white border border-slate-200 rounded-2xl shadow-2xl p-1.5 animate-in fade-in zoom-in-95 duration-100 flex flex-col gap-0.5"
                            >
                              {['New', 'Contacted', 'Converted', 'Lost'].map((st) => (
                                <button
                                  key={st}
                                  onClick={() => {
                                    onUpdateStatus(lead._id, st);
                                    setOpenStatusDropdownId(null);
                                  }}
                                  className={`w-full text-left px-3 py-1.5 text-xs font-normal rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                                    lead.status === st ? 'text-[#61191c] bg-[#61191c]/10 font-semibold' : 'text-slate-700 hover:bg-slate-100/80'
                                  }`}
                                >
                                  <span className={`w-2 h-2 rounded-full ${
                                    st === 'New' ? 'bg-rose-500' :
                                    st === 'Contacted' ? 'bg-amber-500' :
                                    st === 'Converted' ? 'bg-emerald-500' : 'bg-slate-400'
                                  }`}></span>
                                  {st}
                                </button>
                              ))}
                            </div>
                          </>
                        )}

                        {lead.status === 'Converted' && (
                          <div className="mt-1">
                            <button
                              onClick={(e) => handleOpenDropdown(e, 'product', lead._id)}
                              className="w-full flex items-center justify-between gap-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-full text-[10px] font-bold px-2.5 py-0.5 max-w-[220px] transition-colors cursor-pointer"
                              title={lead.convertedProduct?.name || 'Select Product'}
                            >
                              <span className="truncate max-w-[180px]">
                                {lead.convertedProduct?.name || 'Select Product'}
                              </span>
                              <svg className="w-3 h-3 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            
                            {openProductDropdownId === lead._id && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={() => setOpenProductDropdownId(null)}></div>
                                <div
                                  style={{ top: `${dropdownPos.top}px`, left: `${dropdownPos.left}px` }}
                                  className="fixed z-50 w-[270px] max-h-[280px] bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-100 flex flex-col gap-1.5"
                                >
                                  {/* Live Product Search Box */}
                                  <div className="relative shrink-0">
                                    <input
                                      type="text"
                                      placeholder="Search product..."
                                      value={productSearch}
                                      onChange={(e) => setProductSearch(e.target.value)}
                                      className="w-full pl-7 pr-2.5 py-1.5 text-xs bg-slate-50/90 border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#61191c]/20 focus:border-[#61191c] text-slate-800 placeholder:text-slate-400 font-normal transition-all"
                                      autoFocus
                                    />
                                    <svg className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                  </div>

                                  {/* Filtered Products List */}
                                  <div className="overflow-y-auto max-h-[200px] flex flex-col gap-0.5 pr-0.5">
                                    <button
                                      onClick={() => {
                                        onUpdateStatus(lead._id, 'Converted', null);
                                        setOpenProductDropdownId(null);
                                      }}
                                      className="w-full text-left px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer shrink-0 transition-colors"
                                    >
                                      Clear Selection
                                    </button>
                                    {inventory
                                      .filter((item) => item.name.toLowerCase().includes(productSearch.toLowerCase()))
                                      .map((item) => (
                                        <button
                                          key={item._id}
                                          onClick={() => {
                                            onUpdateStatus(lead._id, 'Converted', item._id);
                                            setOpenProductDropdownId(null);
                                          }}
                                          className={`w-full text-left px-3 py-1.5 text-xs rounded-xl transition-all cursor-pointer hover:bg-slate-100/80 ${
                                            lead.convertedProduct?._id === item._id ? 'text-[#61191c] bg-[#61191c]/10 font-semibold' : 'text-slate-700 font-normal'
                                          }`}
                                        >
                                          <div className="font-normal text-slate-900 leading-snug whitespace-normal break-words">{item.name}</div>
                                          <div className="text-[10px] text-slate-500 font-normal mt-0.5">₹{item.price.toLocaleString('en-IN')}</div>
                                        </button>
                                      ))}
                                    {inventory.filter((item) => item.name.toLowerCase().includes(productSearch.toLowerCase())).length === 0 && (
                                      <div className="text-center py-3 text-xs text-slate-400 font-normal">
                                        No matching products found
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Consultant Dropdown */}
                      <td className="px-3 py-2.5 align-top whitespace-nowrap">
                        <button
                          onClick={(e) => handleOpenDropdown(e, 'consultant', lead._id)}
                          className="flex items-center justify-between gap-1 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-full text-[11px] font-bold px-3 py-1 text-slate-700 cursor-pointer min-w-[120px] max-w-[140px] transition-colors"
                        >
                          <span className="truncate">
                            {lead.consultant?.name || 'Unassigned'}
                          </span>
                          <svg className="w-3 h-3 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        {openConsultantDropdownId === lead._id && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setOpenConsultantDropdownId(null)}></div>
                            <div
                              style={{ top: `${dropdownPos.top}px`, left: `${dropdownPos.left}px` }}
                              className="fixed z-50 w-[170px] max-h-[220px] overflow-y-auto bg-white border border-slate-200 rounded-2xl shadow-2xl p-1.5 animate-in fade-in zoom-in-95 duration-100 flex flex-col gap-0.5"
                            >
                              <button
                                onClick={() => {
                                  onAssignConsultant(lead._id, '');
                                  setOpenConsultantDropdownId(null);
                                }}
                                className={`w-full text-left px-3 py-1.5 text-xs font-normal rounded-xl transition-all cursor-pointer ${
                                  !lead.consultant ? 'text-slate-400 font-medium bg-slate-100' : 'text-slate-500 hover:bg-slate-100/80'
                                }`}
                              >
                                Unassigned
                              </button>
                              {consultants.map((c) => (
                                <button
                                  key={c._id}
                                  onClick={() => {
                                    onAssignConsultant(lead._id, c._id);
                                    setOpenConsultantDropdownId(null);
                                  }}
                                  className={`w-full text-left px-3 py-1.5 text-xs font-normal rounded-xl transition-all cursor-pointer truncate ${
                                    (lead.consultant?._id || lead.consultant) === c._id
                                      ? 'text-[#61191c] bg-[#61191c]/10 font-semibold'
                                      : 'text-slate-700 hover:bg-slate-100/80'
                                  }`}
                                >
                                  {c.name}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </td>

                      {/* Created At Date & Time */}
                      <td className="px-3 py-2.5 align-top text-[10.5px] whitespace-nowrap">
                        <div className="font-semibold text-slate-800">
                          {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="text-[9.5px] text-slate-400 font-medium mt-0.5">
                          ⏰ {new Date(lead.createdAt).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-500">
            <div>
              Showing <span className="text-slate-800 font-bold">{startIndex + 1}</span>-
              <span className="text-slate-800 font-bold">{Math.min(endIndex, totalItems)}</span> of{' '}
              <span className="text-slate-800 font-bold">{totalItems}</span> leads
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setLeadsPage((prev) => Math.max(prev - 1, 1))}
                disabled={activePage === 1}
                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 cursor-pointer transition-colors"
              >
                Prev
              </button>
              
              <span className="px-2 font-bold text-slate-800">
                {activePage} / {totalPages}
              </span>

              <button
                onClick={() => setLeadsPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={activePage === totalPages}
                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 cursor-pointer transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Full Lead Information Drawer / Modal */}
      {selectedLeadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-150 bg-slate-50/80 rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#61191c] text-white font-black text-base flex items-center justify-center shadow-md shadow-[#61191c]/20">
                  {selectedLeadModal.name ? selectedLeadModal.name.charAt(0).toUpperCase() : 'C'}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedLeadModal.name}</h3>
                  <p className="text-xs text-slate-500">{selectedLeadModal.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLeadModal(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
              {/* Section 1: Client Profile */}
              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/70 space-y-2">
                <h4 className="font-bold text-[#61191c] text-xs uppercase tracking-wider">Client Profile & Contact</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div><span className="text-slate-400 font-semibold">Phone / WhatsApp:</span> <span className="font-bold text-slate-800">{selectedLeadModal.whatsapp || selectedLeadModal.phone || 'N/A'}</span></div>
                  <div><span className="text-slate-400 font-semibold">Location:</span> <span className="font-bold text-slate-800">{selectedLeadModal.location || 'N/A'}</span></div>
                  <div><span className="text-slate-400 font-semibold">Occupation:</span> <span className="font-bold text-slate-800">{selectedLeadModal.occupation || 'N/A'}</span></div>
                  <div><span className="text-slate-400 font-semibold">Preferred Time:</span> <span className="font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">{selectedLeadModal.preferredTime || 'Not specified'}</span></div>
                </div>
              </div>

              {/* Section 2: Birth Details */}
              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/70 space-y-2">
                <h4 className="font-bold text-[#61191c] text-xs uppercase tracking-wider">Birth Details (Vedic Horoscopes)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div><span className="text-slate-400 font-semibold">Date of Birth:</span> <span className="font-bold text-slate-900">{selectedLeadModal.dob || 'N/A'}</span></div>
                  <div><span className="text-slate-400 font-semibold">Time of Birth:</span> <span className="font-bold text-slate-900">{selectedLeadModal.tob || 'N/A'}</span></div>
                  <div><span className="text-slate-400 font-semibold">Place of Birth:</span> <span className="font-bold text-slate-900">{selectedLeadModal.pob || 'N/A'}</span></div>
                </div>
              </div>

              {/* Section 3: Consultation & Vedic Details */}
              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/70 space-y-2">
                <h4 className="font-bold text-[#61191c] text-xs uppercase tracking-wider">Consultation & Health Information</h4>
                <div className="space-y-2 pt-1">
                  <div>
                    <span className="text-slate-400 font-semibold block">Medical History:</span>
                    <p className="font-semibold text-slate-800 bg-white p-2 rounded-xl border border-slate-200/60 mt-0.5">{selectedLeadModal.medicalHistory || 'None specified'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block">Wearing Rudraksh / Crystal Products:</span>
                    <p className="font-semibold text-slate-800 bg-white p-2 rounded-xl border border-slate-200/60 mt-0.5">{selectedLeadModal.wearingRudraksh || 'None specified'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block">Website Product Interest:</span>
                    <p className="font-semibold text-slate-800 bg-white p-2 rounded-xl border border-slate-200/60 mt-0.5">{selectedLeadModal.websiteProduct || 'None specified'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block">Area of Concern:</span>
                    <p className="font-semibold text-slate-800 bg-white p-2.5 rounded-xl border border-slate-200/60 mt-0.5 leading-relaxed whitespace-pre-wrap">{selectedLeadModal.concern || selectedLeadModal.message || 'No concern details specified'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block">Optional Donation Amount:</span>
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-100/90 px-2.5 py-1 rounded-xl text-xs mt-1 border border-emerald-200">
                      ₹{selectedLeadModal.donationAmount || '0'} Contribution
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-150 flex justify-end bg-slate-50/50 rounded-b-3xl">
              <button
                onClick={() => setSelectedLeadModal(null)}
                className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shopify Integration Modal */}
      {showShopifyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl animate-in fade-in zoom-in duration-150">
            {/* Modal header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                <h3 className="text-base font-bold text-slate-900">Shopify Custom Form Code</h3>
              </div>
              <button
                onClick={() => setShowShopifyModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal content */}
            <div className="p-6 overflow-y-auto space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Copy and paste this HTML/CSS/JavaScript block directly into any page of your Shopify Store (using an <strong>HTML Block</strong>, <strong>Custom Liquid</strong>, or page template editor).
              </p>
              
              <div className="relative">
                <button
                  onClick={copyToClipboard}
                  className="absolute top-3 right-3 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors z-10"
                >
                  {copySuccess ? (
                    <>
                      <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01m-.01 4h.01" />
                      </svg>
                      Copy Snippet
                    </>
                  )}
                </button>
                <pre className="bg-slate-950 text-slate-350 p-4 rounded-2xl text-xs font-mono overflow-x-auto max-h-[350px] border border-zinc-900 leading-normal">
                  {shopifySnippet}
                </pre>
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowShopifyModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
