'use client';

import React, { useState } from 'react';

export default function ConsultantTab({ consultants, onAddConsultant, onUpdateConsultant, onDeleteConsultant }) {
  // New consultant form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Editing consultant states
  const [editingConsultant, setEditingConsultant] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  // Handle Add Consultant Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!name || !email || !phone) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const result = await onAddConsultant({ name, email, phone });
      if (result.success) {
        setSuccess('Consultant added successfully!');
        setName('');
        setEmail('');
        setPhone('');
      } else {
        setError(result.error || 'Failed to add consultant');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Open Edit Modal
  const startEdit = (c) => {
    setEditingConsultant(c);
    setEditName(c.name);
    setEditEmail(c.email);
    setEditPhone(c.phone);
    setEditError('');
  };

  // Handle Update Consultant Submit
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setEditError('');
    setEditLoading(true);

    try {
      const result = await onUpdateConsultant(editingConsultant._id, {
        name: editName,
        email: editEmail,
        phone: editPhone
      });

      if (result.success) {
        setEditingConsultant(null);
      } else {
        setEditError(result.error || 'Failed to update consultant');
      }
    } catch (err) {
      console.error(err);
      setEditError('An error occurred. Please try again.');
    } finally {
      setEditLoading(false);
    }
  };

  // Handle Delete Consultant
  const handleDeleteClick = async (id, consultantName) => {
    if (window.confirm(`Are you sure you want to delete consultant "${consultantName}"?\nAny leads currently assigned to them will be reset to Unassigned.`)) {
      await onDeleteConsultant(id);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Consultant Profiles</h1>
        <p className="text-sm text-slate-500 mt-1">
          Register, edit, or delete active consultants assigned to handle Shopify leads.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Registration Form Panel */}
        <div className="lg:col-span-1 bg-white border border-slate-200 p-6 rounded-3xl shadow-sm h-fit">
          <h2 className="text-base font-bold text-slate-900 mb-4">New Consultant Details</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-150 text-rose-700 rounded-lg text-xs font-semibold">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-emerald-50 border border-emerald-150 text-emerald-700 rounded-lg text-xs font-semibold">
                {success}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">Full Name</label>
              <input
                type="text"
                placeholder="e.g. Sarah Jenkins"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#61191c] focus:border-[#61191c]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">Email Address</label>
              <input
                type="email"
                placeholder="e.g. sarah@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#61191c] focus:border-[#61191c]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">Phone Number</label>
              <input
                type="tel"
                placeholder="e.g. +1 (555) 456-7890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#61191c] focus:border-[#61191c]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#61191c] hover:bg-[#521316] text-white font-semibold text-sm rounded-lg shadow-sm hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all cursor-pointer mt-2"
            >
              {loading ? 'Adding Consultant...' : 'Add Consultant'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center bg-white border border-slate-200 p-4 rounded-3xl shadow-sm">
            <h2 className="text-base font-bold text-slate-900">Active Consultants</h2>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-xs font-semibold text-slate-655">
              Total: {consultants.length}
            </span>
          </div>

          {consultants.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-10 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5-3.07M17 10a4 4 0 11-8 0 4 4 0 018 0zM8 21H3v-2a3 3 0 013-3.07M13 3.07a1 1 0 010 1.86m0 0a1 1 0 010 1.86M13 14h.01" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-800 text-sm">No consultants registered</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Fill out the registration form to add consultants. They will immediately become assignable to Shopify leads.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {consultants.map((c) => (
                <div key={c._id} className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#61191c]"></div>
                  
                  {/* Edit and Delete Actions */}
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white pl-2">
                    <button
                      onClick={() => startEdit(c)}
                      className="p-1 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded transition-colors cursor-pointer"
                      title="Edit Profile"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteClick(c._id, c.name)}
                      className="p-1 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded transition-colors cursor-pointer"
                      title="Delete Consultant"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <h3 className="font-bold text-slate-900 group-hover:text-[#61191c] pr-12 transition-colors truncate">
                    {c.name}
                  </h3>
                  
                  <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2 truncate">
                      <svg className="w-4 h-4 text-slate-450 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {c.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-slate-450 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {c.phone}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editingConsultant && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Edit Consultant Profile</h3>
              <button
                onClick={() => setEditingConsultant(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUpdateSubmit}>
              <div className="p-6 space-y-4">
                {editError && (
                  <div className="p-3 bg-rose-50 border border-rose-150 text-rose-700 rounded-lg text-xs font-semibold">
                    {editError}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#61191c] focus:border-[#61191c]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">Email Address</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#61191c] focus:border-[#61191c]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">Phone Number</label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#61191c] focus:border-[#61191c]"
                    required
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2 bg-slate-50 rounded-b-3xl">
                <button
                  type="button"
                  onClick={() => setEditingConsultant(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 font-semibold text-sm rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-4 py-2 bg-[#61191c] hover:bg-[#521316] text-white font-semibold text-sm rounded-lg hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all cursor-pointer"
                >
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
