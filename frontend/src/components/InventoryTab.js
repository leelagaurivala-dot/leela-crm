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
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Inventory Sync</h1>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Displaying real-time catalog, pricing, and stock details automatically synced from Shopify.
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] font-bold shrink-0">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          Synced with Shopify
        </div>
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-2.5 px-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1 w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search synced products by name, SKU, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#61191c]/20 focus:border-[#61191c] transition-all font-medium"
          />
        </div>
      </div>

      {/* Compact Inventory Listing Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-2.5 border border-slate-100">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="font-bold text-slate-800 text-sm">No products found</h3>
              <p className="text-xs text-slate-500 mt-0.5 max-w-xs font-medium">
                No items match your search filter. Ensure products exist in your Shopify catalog.
              </p>
            </div>
          ) : (
            <table className="w-full border-collapse text-left min-w-[650px]">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200/80 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  <th className="px-3.5 py-2.5">Product Info</th>
                  <th className="px-3.5 py-2.5">SKU</th>
                  <th className="px-3.5 py-2.5">Category</th>
                  <th className="px-3.5 py-2.5">Price</th>
                  <th className="px-3.5 py-2.5">Stock Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredItems.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-3.5 py-2.5 align-middle">
                      <div className="font-bold text-slate-900 text-xs">{item.name}</div>
                    </td>
                    <td className="px-3.5 py-2.5 align-middle whitespace-nowrap">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/60 font-medium">
                        {item.sku}
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5 align-middle text-slate-600 font-medium whitespace-nowrap">
                      {item.category || 'General'}
                    </td>
                    <td className="px-3.5 py-2.5 align-middle font-bold text-slate-900 whitespace-nowrap">
                      ₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-3.5 py-2.5 align-middle whitespace-nowrap">
                      <span
                        className={`font-bold text-[10px] px-2.5 py-0.5 rounded-full border ${
                          item.quantity === 0
                            ? 'bg-rose-50 text-rose-700 border-rose-200/80'
                            : item.quantity < 10
                            ? 'bg-amber-50 text-amber-700 border-amber-200/80'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
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
