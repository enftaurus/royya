'use client'

import React from 'react'
import { Building2, Plus, Info, CheckCircle2, Clock } from 'lucide-react'

export function AdminFarms() {
  const farms = [
    {
      id: 'farm-01',
      name: 'Kakinada Coastal Farm',
      location: 'Kakinada, Andhra Pradesh',
      ponds: 1,
      devices: 1,
      status: 'Live & Operational',
      isLive: true,
      note: 'Actively linked to FastAPI backend node (Pond 01)',
    },
    {
      id: 'farm-02',
      name: 'Nellore Delta Shrimp Estate',
      location: 'Nellore, Andhra Pradesh',
      ponds: 0,
      devices: 0,
      status: 'Coming soon',
      isLive: false,
      note: 'Multi-farm database persistence pending in backend',
    },
    {
      id: 'farm-03',
      name: 'Krishna Brackish Aquaculture',
      location: 'Machilipatnam, Andhra Pradesh',
      ponds: 0,
      devices: 0,
      status: 'Coming soon',
      isLive: false,
      note: 'Multi-farm database persistence pending in backend',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#153b35]">Farm Deployments</h2>
          <p className="text-xs text-[#788d81]">
            Multi-cluster shrimp farm installations and geographic deployment registry
          </p>
        </div>

        <button
          disabled
          className="rounded-full bg-gray-200 px-4 py-2.5 text-xs font-bold text-gray-500 cursor-not-allowed self-start sm:self-auto flex items-center gap-1.5"
          title="Backend farm persistence is not yet implemented"
        >
          <Plus size={14} />
          <span>Add Farm (Coming soon)</span>
        </button>
      </div>

      {/* Backend Limitation Banner */}
      <div className="rounded-2xl border border-[#dce5d9] bg-white p-4.5 flex items-start gap-3 shadow-xs">
        <Info size={18} className="text-[#5c8e33] shrink-0 mt-0.5" />
        <div className="text-xs">
          <p className="font-bold text-[#153b35]">Multi-Farm Persistence Status</p>
          <p className="mt-0.5 text-[#6d8176]">
            The current FastAPI backend exposes <code>/api/data</code> and <code>/api/aerator</code> for a single live deployment.
            Multi-farm registration and tenant management require backend database schema updates, labelled here as <strong>Coming soon</strong>.
          </p>
        </div>
      </div>

      {/* Farm Cards */}
      <div className="space-y-4">
        {farms.map((farm) => (
          <div
            key={farm.id}
            className={`rounded-3xl border p-6 transition-all ${
              farm.isLive
                ? 'border-[#cfe6bf] bg-white shadow-xs'
                : 'border-[#edf1eb] bg-white/70 opacity-80'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div
                  className={`rounded-2xl p-3 shrink-0 ${
                    farm.isLive ? 'bg-[#eaf6df] text-[#5c8e33]' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  <Building2 size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-[#153b35]">{farm.name}</h3>
                  <p className="text-xs text-[#788d81]">{farm.location}</p>
                  <p className="text-xs text-[#6d8176] mt-2 italic">{farm.note}</p>
                </div>
              </div>

              <div className="flex flex-col sm:items-end gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold self-start sm:self-auto ${
                    farm.isLive
                      ? 'bg-[#eaf6df] text-[#5c8e33]'
                      : 'bg-[#fef9e7] text-[#9c7414] border border-[#f9e79f]'
                  }`}
                >
                  {farm.status}
                </span>
                <span className="text-xs text-[#788d81]">
                  {farm.isLive ? `${farm.ponds} Pond · ${farm.devices} Device` : 'Provisioning pending'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
