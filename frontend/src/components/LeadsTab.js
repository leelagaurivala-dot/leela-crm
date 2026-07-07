'use client';

import React, { useState, useEffect } from 'react';

export default function LeadsTab({ leads, consultants, inventory = [], onAssignConsultant, onUpdateStatus, token }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showShopifyModal, setShowShopifyModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Custom dropdown open states
  const [filterOpen, setFilterOpen] = useState(false);
  const [openStatusDropdownId, setOpenStatusDropdownId] = useState(null);
  const [openProductDropdownId, setOpenProductDropdownId] = useState(null);
  const [openConsultantDropdownId, setOpenConsultantDropdownId] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Reset pagination on filter or search updates
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const shopifySnippet = `<form id="shopify-lead-form" style="max-width: 500px; margin: 20px auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; font-family: system-ui, sans-serif; background: #ffffff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); box-sizing: border-box;">
  <h3 style="margin-top: 0; margin-bottom: 20px; color: #1e293b; font-size: 1.25rem; font-weight: 700; text-align: center; border-bottom: 2px solid #61191c; padding-bottom: 10px;">Consultation Form</h3>
  
  <div style="margin-bottom: 15px;">
    <label style="display: block; margin-bottom: 6px; font-weight: 600; font-size: 0.875rem; color: #475569;">Full Name *</label>
    <input type="text" name="name" required style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.875rem; box-sizing: border-box;" placeholder="John Doe">
  </div>

  <div style="display: flex; gap: 15px; margin-bottom: 15px; flex-wrap: wrap;">
    <div style="flex: 1; min-width: 180px;">
      <label style="display: block; margin-bottom: 6px; font-weight: 600; font-size: 0.875rem; color: #475569;">Date of Birth *</label>
      <input type="date" name="dob" required style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.875rem; box-sizing: border-box;">
    </div>
    <div style="flex: 1; min-width: 180px;">
      <label style="display: block; margin-bottom: 6px; font-weight: 600; font-size: 0.875rem; color: #475569;">Time of Birth *</label>
      <input type="time" name="tob" required style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.875rem; box-sizing: border-box;">
    </div>
  </div>

  <div style="margin-bottom: 15px;">
    <label style="display: block; margin-bottom: 6px; font-weight: 600; font-size: 0.875rem; color: #475569;">Place of Birth *</label>
    <input type="text" name="pob" required style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.875rem; box-sizing: border-box;" placeholder="City, State, Country">
  </div>

  <div style="display: flex; gap: 15px; margin-bottom: 15px; flex-wrap: wrap;">
    <div style="flex: 1; min-width: 180px;">
      <label style="display: block; margin-bottom: 6px; font-weight: 600; font-size: 0.875rem; color: #475569;">WhatsApp Number *</label>
      <input type="tel" name="whatsapp" required style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.875rem; box-sizing: border-box;" placeholder="e.g. 9876543210">
    </div>
    <div style="flex: 1; min-width: 180px;">
      <label style="display: block; margin-bottom: 6px; font-weight: 600; font-size: 0.875rem; color: #475569;">Email ID *</label>
      <input type="email" name="email" required style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.875rem; box-sizing: border-box;" placeholder="john@example.com">
    </div>
  </div>

  <div style="display: flex; gap: 15px; margin-bottom: 15px; flex-wrap: wrap;">
    <div style="flex: 1; min-width: 180px;">
      <label style="display: block; margin-bottom: 6px; font-weight: 600; font-size: 0.875rem; color: #475569;">Current Location *</label>
      <input type="text" name="location" required style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.875rem; box-sizing: border-box;" placeholder="City, Country">
    </div>
    <div style="flex: 1; min-width: 180px;">
      <label style="display: block; margin-bottom: 6px; font-weight: 600; font-size: 0.875rem; color: #475569;">Occupation *</label>
      <input type="text" name="occupation" required style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.875rem; box-sizing: border-box;" placeholder="e.g. Software Engineer">
    </div>
  </div>
  
  <div style="margin-bottom: 20px;">
    <label style="display: block; margin-bottom: 6px; font-weight: 600; font-size: 0.875rem; color: #475569;">Area of Concern (If any)</label>
    <textarea name="concern" rows="3" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.875rem; resize: vertical; box-sizing: border-box;" placeholder="e.g. Health, Career, Relationship advice..."></textarea>
  </div>
  
  <button type="submit" style="background: #61191c; color: white; border: none; padding: 12px 20px; border-radius: 6px; font-weight: 600; font-size: 0.875rem; cursor: pointer; width: 100%; transition: background 0.2s;">
    Submit Consultation Request
  </button>
  <p id="form-status" style="margin-top: 12px; display: none; text-align: center; font-weight: 600; font-size: 0.875rem;"></p>
</form>

<script>
document.getElementById('shopify-lead-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const form = e.target;
  const statusEl = document.getElementById('form-status');
  
  const formData = {
    name: form.elements.name.value,
    email: form.elements.email.value,
    phone: form.elements.whatsapp.value,
    whatsapp: form.elements.whatsapp.value,
    dob: form.elements.dob.value,
    tob: form.elements.tob.value,
    pob: form.elements.pob.value,
    location: form.elements.location.value,
    occupation: form.elements.occupation.value,
    concern: form.elements.concern.value,
    message: form.elements.concern.value || '',
    shopifyData: {
      domain: window.location.hostname,
      path: window.location.pathname,
      submittedAt: new Date().toISOString()
    }
  };
  
  statusEl.style.display = 'block';
  statusEl.style.color = '#475569';
  statusEl.textContent = 'Submitting your request...';
  
  try {
    const response = await fetch('https://mvriae-ip-106-219-120-92.tunnelmole.net/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    const result = await response.json();
    
    if (response.ok && result.success) {
      statusEl.style.color = '#16a34a';
      statusEl.textContent = 'Thank you! Your consultation request has been submitted.';
      form.reset();
    } else {
      statusEl.style.color = '#dc2626';
      statusEl.textContent = result.error || 'Submission failed. Please try again.';
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    statusEl.style.color = '#dc2626';
    statusEl.textContent = 'Connection error. Please check backend is running.';
  }
});
</script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shopifySnippet);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      (lead.whatsapp && lead.whatsapp.includes(search)) ||
      (lead.phone && lead.phone.includes(search)) ||
      (lead.location && lead.location.toLowerCase().includes(search.toLowerCase())) ||
      (lead.occupation && lead.occupation.toLowerCase().includes(search.toLowerCase())) ||
      (lead.concern && lead.concern.toLowerCase().includes(search.toLowerCase())) ||
      (lead.pob && lead.pob.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate pagination metrics
  const totalItems = filteredLeads.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLeads = filteredLeads.slice(startIndex, endIndex);

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
            placeholder="Search leads by name, email, location, occupation, concern..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
              <span>{statusFilter === 'All' ? 'All Leads' : statusFilter}</span>
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
                        setStatusFilter(opt);
                        setFilterOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-semibold transition-colors cursor-pointer hover:bg-slate-50 ${statusFilter === opt ? 'text-[#61191c] bg-[#61191c]/5 font-bold' : 'text-slate-700'}`}
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
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm">
        <div className="overflow-x-auto lg:overflow-visible pb-36">
          {filteredLeads.length === 0 ? (
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
            <table className="w-full border-collapse text-left min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Client / Profile</th>
                  <th className="px-6 py-4">Birth Details</th>
                  <th className="px-6 py-4">Area of Concern</th>
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

                      {/* Area of Concern */}
                      <td className="px-6 py-4 align-top max-w-sm whitespace-normal">
                        <p className="text-slate-655 font-medium leading-relaxed whitespace-pre-line text-xs">
                          {lead.concern || lead.message || <span className="text-slate-400 italic">No concern specified</span>}
                        </p>
                        {lead.shopifyData && lead.shopifyData.domain && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-500 mt-2">
                            Shopify: {lead.shopifyData.domain}
                          </span>
                        )}
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
                onClick={() => setCurrentPage(1)}
                disabled={activePage === 1}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-50 disabled:hover:bg-white cursor-pointer disabled:cursor-not-allowed transition-colors"
                title="First Page"
              >
                First
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
                      onClick={() => setCurrentPage(pageNum)}
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
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={activePage === totalPages}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-50 disabled:hover:bg-white cursor-pointer disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
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
