'use client';

import React, { useState, useEffect } from 'react';
import LeadsTab from './LeadsTab';
import InventoryTab from './InventoryTab';
import ConsultantTab from './ConsultantTab';

export default function Dashboard({ token, user, onLogout }) {
  const [activeTab, setActiveTab] = useState('leads'); // default to leads data
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [leads, setLeads] = useState([]);
  const [consultants, setConsultants] = useState([]);
  const [inventory, setInventory] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL !== undefined 
    ? process.env.NEXT_PUBLIC_API_URL 
    : (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');

  const [syncing, setSyncing] = useState(false);

  // Pagination, Search, and Status Filter states for Leads
  const [leadsPage, setLeadsPage] = useState(1);
  const [leadsSearch, setLeadsSearch] = useState('');
  const [leadsStatus, setLeadsStatus] = useState('All');
  const [leadsTotal, setLeadsTotal] = useState(0);
  const [leadsPages, setLeadsPages] = useState(1);
  const [leadsLoading, setLeadsLoading] = useState(false);

  const fetchLeads = async (pageVal = leadsPage, searchVal = leadsSearch, statusVal = leadsStatus, silent = false) => {
    if (!silent) setLeadsLoading(true);
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const queryParams = new URLSearchParams({
        page: pageVal,
        limit: 20,
        search: searchVal,
        status: statusVal
      });

      const res = await fetch(`${API_URL}/api/leads?${queryParams.toString()}`, { headers });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to fetch leads');

      setLeads(data.leads || []);
      setLeadsTotal(data.total || 0);
      setLeadsPages(data.pages || 1);
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred while loading leads data');
    } finally {
      if (!silent) setLeadsLoading(false);
    }
  };

  // Fetch initial data (excluding leads since they are loaded by the pagination useEffect)
  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    setError('');
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      // Fetch consultants
      const consRes = await fetch(`${API_URL}/api/consultants`, { headers });
      const consData = await consRes.json();
      if (!consRes.ok) throw new Error(consData.error || 'Failed to fetch consultants');
      setConsultants(consData);

      // Fetch inventory
      const invRes = await fetch(`${API_URL}/api/inventory`, { headers });
      const invData = await invRes.json();
      if (!invRes.ok) throw new Error(invData.error || 'Failed to fetch inventory');
      setInventory(invData);

      // Fetch leads matching current states silently
      await fetchLeads(leadsPage, leadsSearch, leadsStatus, true);

    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred while loading dashboard data');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    await fetchData(true);
    setSyncing(false);
  };

  useEffect(() => {
    const savedTab = localStorage.getItem('crm_active_tab');
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const handleTabSelect = (tabName) => {
    setActiveTab(tabName);
    localStorage.setItem('crm_active_tab', tabName);
    setSidebarOpen(false);
  };

  // Refetch leads when page, search query, or status filter changes
  useEffect(() => {
    if (token) {
      fetchLeads(leadsPage, leadsSearch, leadsStatus);
    }
  }, [token, leadsPage, leadsSearch, leadsStatus]);

  const handleSearchChange = (val) => {
    setLeadsSearch(val);
    setLeadsPage(1);
  };

  const handleStatusChange = (val) => {
    setLeadsStatus(val);
    setLeadsPage(1);
  };

  // Lead actions
  const handleAssignConsultant = async (leadId, consultantId) => {
    try {
      const res = await fetch(`${API_URL}/api/leads/${leadId}/assign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ consultantId })
      });

      const updatedLead = await res.json();
      if (!res.ok) throw new Error(updatedLead.error || 'Failed to assign consultant');

      // Update leads list in state
      setLeads(leads.map(lead => lead._id === leadId ? updatedLead : lead));
      return { success: true };
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to assign consultant');
      return { success: false, error: err.message };
    }
  };

  const handleUpdateStatus = async (leadId, status, convertedProductId = null) => {
    try {
      const res = await fetch(`${API_URL}/api/leads/${leadId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status, convertedProductId })
      });

      const updatedLead = await res.json();
      if (!res.ok) throw new Error(updatedLead.error || 'Failed to update status');

      // Update leads list in state
      setLeads(leads.map(lead => lead._id === leadId ? updatedLead : lead));
      return { success: true };
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to update status');
      return { success: false, error: err.message };
    }
  };

  // Consultant actions
  const handleAddConsultant = async (consultantData) => {
    try {
      const res = await fetch(`${API_URL}/api/consultants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(consultantData)
      });

      const newConsultant = await res.json();
      if (!res.ok) throw new Error(newConsultant.error || 'Failed to create consultant');

      // Update list
      setConsultants([...consultants, newConsultant].sort((a, b) => a.name.localeCompare(b.name)));
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: err.message };
    }
  };

  const handleUpdateConsultant = async (consultantId, consultantData) => {
    try {
      const res = await fetch(`${API_URL}/api/consultants/${consultantId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(consultantData)
      });

      const updatedConsultant = await res.json();
      if (!res.ok) throw new Error(updatedConsultant.error || 'Failed to update consultant');

      setConsultants(
        consultants
          .map(c => (c._id === consultantId ? updatedConsultant : c))
          .sort((a, b) => a.name.localeCompare(b.name))
      );
      // Refresh list to update assigned consultant records
      fetchData();
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: err.message };
    }
  };

  const handleDeleteConsultant = async (consultantId) => {
    try {
      const res = await fetch(`${API_URL}/api/consultants/${consultantId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete consultant');

      setConsultants(consultants.filter(c => c._id !== consultantId));
      // Refresh leads to show unassigned states
      fetchData();
      return { success: true };
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to delete consultant');
      return { success: false, error: err.message };
    }
  };

  // Inventory CRUD actions
  const handleAddInventory = async (itemData) => {
    try {
      const res = await fetch(`${API_URL}/api/inventory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(itemData)
      });

      const newItem = await res.json();
      if (!res.ok) throw new Error(newItem.error || 'Failed to create inventory item');

      setInventory([newItem, ...inventory]);
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: err.message };
    }
  };

  const handleUpdateInventory = async (itemId, itemData) => {
    try {
      const res = await fetch(`${API_URL}/api/inventory/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(itemData)
      });

      const updatedItem = await res.json();
      if (!res.ok) throw new Error(updatedItem.error || 'Failed to update inventory item');

      setInventory(inventory.map(item => item._id === itemId ? updatedItem : item));
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: err.message };
    }
  };

  const handleDeleteInventory = async (itemId) => {
    try {
      const res = await fetch(`${API_URL}/api/inventory/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete item');

      setInventory(inventory.filter(item => item._id !== itemId));
      return { success: true };
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to delete inventory item');
      return { success: false, error: err.message };
    }
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-[#61191c] rounded-full animate-spin"></div>
          <span className="text-sm font-medium text-slate-500 mt-4">Loading dashboard data...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-6 bg-rose-50 border border-rose-150 rounded-xl text-center max-w-lg mx-auto mt-10">
          <svg className="w-10 h-10 text-rose-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="font-bold text-rose-800 text-sm">Failed to Load Dashboard Data</h3>
          <p className="text-xs text-rose-700 mt-1">{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            Retry Fetching
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'leads':
        return (
          <LeadsTab
            leads={leads}
            leadsTotal={leadsTotal}
            leadsPages={leadsPages}
            leadsPage={leadsPage}
            setLeadsPage={setLeadsPage}
            leadsSearch={leadsSearch}
            onSearchChange={handleSearchChange}
            leadsStatus={leadsStatus}
            onStatusChange={handleStatusChange}
            leadsLoading={leadsLoading}
            consultants={consultants}
            inventory={inventory}
            onAssignConsultant={handleAssignConsultant}
            onUpdateStatus={handleUpdateStatus}
            token={token}
          />
        );
      case 'inventory':
        return (
          <InventoryTab
            inventory={inventory}
            onAddItem={handleAddInventory}
            onUpdateItem={handleUpdateInventory}
            onDeleteItem={handleDeleteInventory}
          />
        );
      case 'consultants':
        return (
          <ConsultantTab
            consultants={consultants}
            onAddConsultant={handleAddConsultant}
            onUpdateConsultant={handleUpdateConsultant}
            onDeleteConsultant={handleDeleteConsultant}
          />
        );
      default:
        return <div>Select a menu option from the sidebar.</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Mobile Drawer Overlay Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/45 backdrop-blur-xs z-35 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* LEFT SIDEBAR */}
      <aside className={`w-[280px] bg-[#61191c] flex flex-col fixed z-40 transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 h-screen md:h-[calc(100vh-32px)] md:my-4 md:ml-4 rounded-r-3xl md:rounded-3xl shadow-2xl`}>
        {/* Brand Header */}
        <div className="h-[80px] flex items-center justify-center px-6 relative">
          <img src="/logo.png" alt="Leela Logo" className="h-14 w-auto object-contain rounded-xl" />
          {/* Close button for mobile */}
          <button 
            onClick={() => setSidebarOpen(false)}
            className="absolute right-4 p-1.5 rounded-lg hover:bg-white/10 md:hidden cursor-pointer text-white/80"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User profile brief */}
        <div className="p-4 mx-4 my-2 bg-white/5 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 text-white rounded-full flex items-center justify-center font-bold text-sm">
              {user.name ? user.name[0].toUpperCase() : 'A'}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-sm font-bold text-white truncate">{user.name || 'Admin'}</h4>
              <p className="text-[11px] font-medium text-white/70 truncate">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation Menus */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {/* Leads Menu */}
          <button
            onClick={() => handleTabSelect('leads')}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'leads'
                ? 'bg-white/10 text-white shadow-xs'
                : 'text-white/80 hover:text-white hover:bg-white/5'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Leads Data
          </button>

          {/* Inventory Menu */}
          <button
            onClick={() => handleTabSelect('inventory')}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-white/10 text-white shadow-xs'
                : 'text-white/80 hover:text-white hover:bg-white/5'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Inventory
          </button>

          {/* Add Consultant Menu */}
          <button
            onClick={() => handleTabSelect('consultants')}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'consultants'
                ? 'bg-white/10 text-white shadow-xs'
                : 'text-white/80 hover:text-white hover:bg-white/5'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Add Consultant
          </button>
        </nav>

        {/* Footer Logout */}
        <div className="p-4">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3.5 px-4 py-3 border border-white/10 rounded-xl text-sm font-semibold text-white hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* RIGHT CONTENT CONTAINER */}
      <main className="flex-1 md:pl-[312px] min-h-screen w-full flex flex-col">
        <div className="flex-1 bg-[#FAF7F2] md:my-4 md:mr-4 md:rounded-3xl md:shadow-md flex flex-col overflow-hidden border border-slate-100/50 h-screen md:h-[calc(100vh-32px)] relative">
          {/* Top Navbar */}
          <header className="h-[70px] bg-[#FAF7F2] border-b border-slate-100 flex items-center justify-between px-4 md:px-6 shrink-0 select-none">
            <div className="flex items-center gap-2 md:gap-3">
              {/* Hamburger open drawer button */}
              <button 
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-slate-200/50 md:hidden cursor-pointer text-slate-700"
                aria-label="Open Sidebar Menu"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <span className="text-[11px] md:text-xs font-bold text-slate-500 uppercase tracking-wider">
                {activeTab === 'leads' ? 'Leads Data' : activeTab === 'inventory' ? 'Inventory' : 'Consultants'}
              </span>
            </div>
            <div className="flex items-center gap-2.5 md:gap-3">
              {/* Manual Refresh Sync Button */}
              <button
                onClick={handleSync}
                disabled={syncing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 shadow-xs hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
              >
                <svg className={`w-3 h-3 text-slate-500 ${syncing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                Sync
              </button>

              {/* Backend connection indicator status bubble */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <span className="hidden sm:inline">Server Status:</span>
                <span className="text-emerald-600 font-bold hidden sm:inline">Online</span>
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" title="Server Status: Online"></span>
              </div>
            </div>
          </header>

          {/* Content Tab (Scrollable inside the card) */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            {renderTabContent()}
          </div>
        </div>
      </main>
    </div>
  );
}
