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
  const [copySuccess, setCopySuccess] = useState(false);

  // Custom dropdown open states
  const [filterOpen, setFilterOpen] = useState(false);
  const [openStatusDropdownId, setOpenStatusDropdownId] = useState(null);
  const [openProductDropdownId, setOpenProductDropdownId] = useState(null);
  const [openConsultantDropdownId, setOpenConsultantDropdownId] = useState(null);

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'New':
        return 'bg-[#61191c]/10 text-[#61191c] border-[#61191c]/20';
      case 'Contacted':
        return 'bg-amber-50 text-amber-700 border-amber-250';
      case 'Converted':
        return 'bg-emerald-50 text-emerald-700 border-emerald-250';
      case 'Lost':
        return 'bg-rose-50 text-rose-700 border-rose-250';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Leads Data</h1>
        <p className="text-sm text-slate-500 mt-1">
          Displaying detailed consultation inquiries synced from your Shopify store.
        </p>
      </div>

      {/* Filter and search controls */}
      <div className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search leads by name, email, location, occupation, medical history, rudraksh, product..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#61191c] focus:border-[#61191c] transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status:</label>
          <div className="relative">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center justify-between gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-sm px-3.5 py-2 text-slate-700 font-semibold cursor-pointer min-w-[135px] transition-colors"
            >
              <span>{leadsStatus === 'All' ? 'All Leads' : leadsStatus}</span>
              <svg className={`w-3.5 h-3.5 text-slate-450 transition-transform ${filterOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {filterOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setFilterOpen(false)}></div>
                <div className="absolute right-0 mt-1.5 w-[140px] bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-45 animate-in fade-in slide-in-from-top-1 duration-100">
                  {['All', 'New', 'Contacted', 'Converted', 'Lost'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        onStatusChange(opt);
                        setFilterOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-semibold transition-colors cursor-pointer hover:bg-slate-50 ${leadsStatus === opt ? 'text-[#61191c] bg-[#61191c]/5 font-bold' : 'text-slate-700'}`}
                    >
                      {opt === 'All' ? 'All Leads' : opt}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Table grid */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm relative">
        {leadsLoading && (
          <div className="absolute inset-0 bg-white/45 backdrop-blur-[1px] flex items-center justify-center z-30 rounded-3xl">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-[#61191c] rounded-full animate-spin"></div>
          </div>
        )}
        <div className="overflow-x-auto lg:overflow-visible pb-36">
          {leads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-800">No leads found</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm">
                Try adjusting your search terms or generate a Shopify form submission to see data populated here.
              </p>
            </div>
          ) : (
            <table className="w-full border-collapse text-left min-w-[1050px]">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Client / Profile</th>
                  <th className="px-6 py-4">Birth Details</th>
                  <th className="px-6 py-4">Consultation & Concern</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Assigned Consultant</th>
                  <th className="px-6 py-4">Date Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {paginatedLeads.map((lead) => {
                  // Clean WhatsApp number for link format: remove non-digits
                  const cleanWhatsApp = lead.whatsapp ? lead.whatsapp.replace(/\D/g, '') : (lead.phone ? lead.phone.replace(/\D/g, '') : '');
                  const displayWhatsApp = lead.whatsapp || lead.phone;

                  return (
                    <tr key={lead._id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Client Details */}
                      <td className="px-6 py-4 align-top min-w-[240px]">
                        <div className="font-semibold text-slate-900">{lead.name}</div>
                        <div className="text-xs text-slate-550 mt-0.5">{lead.email}</div>
                        
                        {displayWhatsApp && (
                          <div className="mt-2">
                            <a
                              href={`https://wa.me/${cleanWhatsApp}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 font-bold transition-colors whitespace-nowrap"
                              title="Click to chat on WhatsApp"
                            >
                              <svg className="w-3.5 h-3.5 fill-emerald-600" viewBox="0 0 24 24">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.504-5.713-1.465L0 24zm6.275-3.837l.366.218c1.605.952 3.805 1.458 6.071 1.464 5.926-.001 10.748-4.819 10.75-10.745.002-2.87-1.114-5.571-3.136-7.597C18.298 1.48 15.602.35 12.012.35 6.082.35 1.26 5.169 1.258 11.099c-.001 2.378.625 4.699 1.812 6.707l.228.388-.974 3.562 3.65-.957z" />
                              </svg>
                              {displayWhatsApp}
                            </a>
                          </div>
                        )}

                        <div className="mt-2 space-y-0.5 text-xs text-slate-500 whitespace-nowrap">
                          {lead.location && (
                            <div>Loc: <span className="font-semibold text-slate-700">{lead.location}</span></div>
                          )}
                          {lead.occupation && (
                            <div>Occ: <span className="font-semibold text-slate-700">{lead.occupation}</span></div>
                          )}
                          {lead.preferredTime && (
                            <div>Time: <span className="font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">{lead.preferredTime}</span></div>
                          )}
                        </div>
                      </td>

                      {/* Birth Details */}
                      <td className="px-6 py-4 align-top text-xs text-slate-700 leading-relaxed whitespace-nowrap">
                        <div className="space-y-1">
                          <div>
                            <span className="text-slate-400 font-medium">DOB:</span>{' '}
                            <span className="font-semibold text-slate-800">{lead.dob || <span className="text-slate-400 italic">Not set</span>}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-medium">TOB:</span>{' '}
                            <span className="font-semibold text-slate-800">{lead.tob || <span className="text-slate-400 italic">Not set</span>}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-medium">POB:</span>{' '}
                            <span className="font-semibold text-slate-800">{lead.pob || <span className="text-slate-400 italic">Not set</span>}</span>
                          </div>
                        </div>
                      </td>

                      {/* Consultation & Concern Details */}
                      <td className="px-6 py-4 align-top max-w-sm whitespace-normal space-y-2">
                        {/* Area of Concern */}
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Area of Concern:</span>
                          <p className="text-slate-800 font-medium leading-relaxed whitespace-pre-line text-xs mt-0.5">
                            {lead.concern || lead.message || <span className="text-slate-400 italic">No concern specified</span>}
                          </p>
                        </div>

                        {/* Additional fields */}
                        <div className="space-y-1 pt-1 border-t border-slate-100 text-xs">
                          {lead.medicalHistory && (
                            <div className="text-slate-600">
                              <span className="font-semibold text-slate-700">Medical:</span> {lead.medicalHistory}
                            </div>
                          )}
                          {lead.wearingRudraksh && (
                            <div className="text-slate-600">
                              <span className="font-semibold text-slate-700">Rudraksh/Crystals:</span> {lead.wearingRudraksh}
                            </div>
                          )}
                          {lead.websiteProduct && (
                            <div className="text-slate-600">
                              <span className="font-semibold text-slate-700">Product Interest:</span> {lead.websiteProduct}
                            </div>
                          )}
                          
                          {/* Donation Amount Badge */}
                          <div className="flex items-center gap-2 pt-1">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold ${
                              Number(lead.donationAmount) > 0
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}>
                              Donation: ₹{lead.donationAmount || '0'}
                            </span>

                            {lead.shopifyData && lead.shopifyData.domain && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-500">
                                Shopify
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 align-top">
                        <div className="relative">
                          <button
                            onClick={() => {
                              setOpenStatusDropdownId(openStatusDropdownId === lead._id ? null : lead._id);
                              setOpenProductDropdownId(null);
                              setOpenConsultantDropdownId(null);
                            }}
                            className={`flex items-center justify-between gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#61191c] cursor-pointer min-w-[110px] transition-colors ${getStatusColor(
                              lead.status
                            )}`}
                          >
                            <span>{lead.status}</span>
                            <svg className="w-3 h-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          
                          {openStatusDropdownId === lead._id && (
                            <>
                              <div className="fixed inset-0 z-30" onClick={() => setOpenStatusDropdownId(null)}></div>
                              <div className="absolute left-0 mt-1.5 w-[125px] bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-45 animate-in fade-in slide-in-from-top-1 duration-100 whitespace-normal flex flex-col">
                                {['New', 'Contacted', 'Converted', 'Lost'].map((st) => (
                                  <button
                                    key={st}
                                    onClick={() => {
                                      onUpdateStatus(lead._id, st);
                                      setOpenStatusDropdownId(null);
                                    }}
                                    className={`w-full text-left px-3 py-2 text-xs font-semibold transition-colors cursor-pointer hover:bg-slate-50 ${lead.status === st ? 'text-[#61191c] bg-[#61191c]/5 font-bold' : 'text-slate-700'}`}
                                  >
                                    {st}
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>

                        {lead.status === 'Converted' && (
                          <div className="mt-2.5 relative">
                            <button
                              onClick={() => {
                                setOpenProductDropdownId(openProductDropdownId === lead._id ? null : lead._id);
                                setOpenStatusDropdownId(null);
                                setOpenConsultantDropdownId(null);
                              }}
                              className="w-full flex items-center justify-between gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-[11px] font-semibold px-2 py-1 text-slate-700 cursor-pointer max-w-[170px] truncate transition-colors"
                            >
                              <span className="truncate">
                                {lead.convertedProduct?.name || (lead.convertedProduct ? 'Synced Product' : 'Select Product')}
                              </span>
                              <svg className="w-3 h-3 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            
                            {openProductDropdownId === lead._id && (
                              <>
                                <div className="fixed inset-0 z-30" onClick={() => setOpenProductDropdownId(null)}></div>
                                <div className="absolute left-0 mt-1.5 w-[220px] max-h-[220px] overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-45 animate-in fade-in slide-in-from-top-1 duration-100 whitespace-normal flex flex-col">
                                  <button
                                    onClick={() => {
                                      onUpdateStatus(lead._id, 'Converted', null);
                                      setOpenProductDropdownId(null);
                                    }}
                                    className="w-full text-left px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer"
                                  >
                                    Clear Selection
                                  </button>
                                  {inventory.map((item) => (
                                    <button
                                      key={item._id}
                                      onClick={() => {
                                        onUpdateStatus(lead._id, 'Converted', item._id);
                                        setOpenProductDropdownId(null);
                                      }}
                                      className={`w-full text-left px-3 py-2 text-xs transition-colors cursor-pointer hover:bg-slate-50 border-t border-slate-50 ${lead.convertedProduct?._id === item._id ? 'text-[#61191c] bg-[#61191c]/5 font-bold' : 'text-slate-700'}`}
                                    >
                                      <div className="font-bold truncate">{item.name}</div>
                                      <div className="text-[10px] text-slate-500 font-semibold mt-0.5">₹{item.price.toLocaleString('en-IN')}</div>
                                    </button>
                                  ))}
                                </div>
                              </>
                            )}
                            
                            {lead.convertedProduct && (
                              <div className="text-[10px] text-slate-500 mt-1 font-mono italic">
                                SKU: {lead.convertedProduct.sku || 'N/A'}
                              </div>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Consultant Dropdown */}
                      <td className="px-6 py-4 align-top whitespace-nowrap">
                        <div className="relative">
                          <button
                            onClick={() => {
                              setOpenConsultantDropdownId(openConsultantDropdownId === lead._id ? null : lead._id);
                              setOpenStatusDropdownId(null);
                              setOpenProductDropdownId(null);
                            }}
                            className="w-full flex items-center justify-between gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold px-2.5 py-1.5 text-slate-700 cursor-pointer w-full max-w-[170px] transition-colors"
                          >
                            <span className="truncate">
                              {lead.consultant?.name || 'Unassigned'}
                            </span>
                            <svg className="w-3.5 h-3.5 text-slate-450 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          
                          {openConsultantDropdownId === lead._id && (
                            <>
                              <div className="fixed inset-0 z-30" onClick={() => setOpenConsultantDropdownId(null)}></div>
                              <div className="absolute left-0 mt-1.5 w-[170px] max-h-[220px] overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-45 animate-in fade-in slide-in-from-top-1 duration-100 whitespace-normal flex flex-col">
                                <button
                                  onClick={() => {
                                    onAssignConsultant(lead._id, '');
                                    setOpenConsultantDropdownId(null);
                                  }}
                                  className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 cursor-pointer"
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
                                    className={`w-full text-left px-3 py-2 text-xs font-semibold transition-colors cursor-pointer hover:bg-slate-50 ${(lead.consultant?._id || lead.consultant) === c._id ? 'text-[#61191c] bg-[#61191c]/5 font-bold' : 'text-slate-700'}`}
                                  >
                                    {c.name}
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Created At Date */}
                      <td className="px-6 py-4 align-top text-xs text-slate-500 whitespace-nowrap">
                        {new Date(lead.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-xl text-xs font-semibold text-slate-500">
            <div>
              Showing <span className="text-slate-800 font-bold">{startIndex + 1}</span> to{' '}
              <span className="text-slate-800 font-bold">{Math.min(endIndex, totalItems)}</span> of{' '}
              <span className="text-slate-800 font-bold">{totalItems}</span> leads
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setLeadsPage(1)}
                disabled={activePage === 1}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-50 disabled:hover:bg-white cursor-pointer disabled:cursor-not-allowed transition-colors"
                title="First Page"
              >
                First
              </button>
              <button
                onClick={() => setLeadsPage((prev) => Math.max(prev - 1, 1))}
                disabled={activePage === 1}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-50 disabled:hover:bg-white cursor-pointer disabled:cursor-not-allowed transition-colors"
              >
                Prev
              </button>
              
              {/* Dynamic Visible Page Numbers */}
              {Array.from({ length: totalPages }, (_, idx) => {
                const pageNum = idx + 1;
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  Math.abs(pageNum - activePage) <= 1
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setLeadsPage(pageNum)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-bold cursor-pointer transition-colors ${
                        activePage === pageNum
                          ? 'bg-[#61191c] text-white border-[#61191c]'
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
                
                if (pageNum === 2 || pageNum === totalPages - 1) {
                  return (
                    <span key={pageNum} className="px-1.5 text-slate-400 select-none">
                      ...
                    </span>
                  );
                }
                
                return null;
              })}

              <button
                onClick={() => setLeadsPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={activePage === totalPages}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-50 disabled:hover:bg-white cursor-pointer disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
              <button
                onClick={() => setLeadsPage(totalPages)}
                disabled={activePage === totalPages}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-50 disabled:hover:bg-white cursor-pointer disabled:cursor-not-allowed transition-colors"
                title="Last Page"
              >
                Last
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Shopify Integration Modal */}
      {showShopifyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Modal header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                <h3 className="text-lg font-bold text-slate-900">Shopify Custom Form Code</h3>
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
              <p className="text-sm text-slate-600 leading-relaxed">
                Copy and paste this HTML/CSS/JavaScript block directly into any page of your Shopify Store (using an <strong>HTML Block</strong>, <strong>Custom Liquid</strong>, or page template editor).
              </p>
              
              <div className="relative">
                <button
                  onClick={copyToClipboard}
                  className="absolute top-3 right-3 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
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
                <pre className="bg-slate-950 text-slate-350 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-[350px] border border-zinc-900 leading-normal">
                  {shopifySnippet}
                </pre>
              </div>

              <div className="p-4 bg-[#61191c]/10 border border-[#61191c]/20 rounded-xl">
                <h4 className="font-semibold text-[#61191c] text-xs uppercase tracking-wider mb-1">
                  How it works:
                </h4>
                <ol className="list-decimal pl-4 text-xs text-[#61191c] space-y-1">
                  <li>Creates a clean input form styling for Shopify customer submission.</li>
                  <li>Captures inputs and intercepts normal submission via JavaScript.</li>
                  <li>Sends a POST request to your local API endpoint <code>http://localhost:5000/api/leads</code>.</li>
                  <li>Saves details in database and syncs instantly in real time to this Leads Data panel.</li>
                </ol>
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowShopifyModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-700 font-semibold text-sm rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
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
