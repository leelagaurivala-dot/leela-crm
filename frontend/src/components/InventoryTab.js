'use client';

import React, { useState } from 'react';

export default function InventoryTab({ inventory }) {
  const [search, setSearch] = useState('');

  const filteredItems = inventory.filter((item) => {
    return (
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Inventory Sync</h1>
          <p className="text-sm text-slate-500 mt-1">
            Displaying real-time catalog, pricing, and stock details automatically synced from Shopify.
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-semibold">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          Synced with Shopify
        </div>
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
            placeholder="Search synced products by name, SKU, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#61191c] focus:border-[#61191c] transition-all"
          />
        </div>
      </div>

      {/* Inventory Listing */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-800">No products found</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm">
                No items match your search. Make sure products are added and webhook is configured in Shopify settings.
              </p>
            </div>
          ) : (
            <table className="w-full border-collapse text-left min-w-[700px]">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Product Info</th>
                  <th className="px-6 py-4">SKU</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredItems.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{item.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs px-2 py-1 rounded bg-slate-100 text-slate-650 border border-slate-200">
                        {item.sku}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      ₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`font-semibold text-xs px-2.5 py-0.5 rounded-full border whitespace-nowrap ${
                          item.quantity === 0
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : item.quantity < 10
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {item.quantity === 0 ? 'Out of stock' : `${item.quantity} units`}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
