'use client'

import React from 'react'
import { Users, UserPlus, Shield, Info, CheckCircle2 } from 'lucide-react'
import { DEMO_CREDENTIALS } from '@/lib/auth'

export function AdminUsers() {
  const users = Object.entries(DEMO_CREDENTIALS).map(([username, info]) => ({
    username,
    name: info.name,
    title: info.title,
    role: info.role.toUpperCase(),
    status: 'ACTIVE DEMO ACCOUNT',
    isLiveUser: true,
  }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#153b35]">Access & User Directory</h2>
          <p className="text-xs text-[#788d81]">
            Role-based authorization and portal assignment registry
          </p>
        </div>

        <button
          disabled
          className="rounded-full bg-gray-200 px-4 py-2.5 text-xs font-bold text-gray-500 cursor-not-allowed self-start sm:self-auto flex items-center gap-1.5"
          title="Backend database user persistence is not yet implemented"
        >
          <UserPlus size={14} />
          <span>Invite User (Coming soon)</span>
        </button>
      </div>

      {/* Persistence Notice */}
      <div className="rounded-2xl border border-[#dce5d9] bg-white p-4.5 flex items-start gap-3 shadow-xs">
        <Info size={18} className="text-[#5c8e33] shrink-0 mt-0.5" />
        <div className="text-xs">
          <p className="font-bold text-[#153b35]">User Directory Persistence Notice</p>
          <p className="mt-0.5 text-[#6d8176]">
            The current FastAPI backend does not include authentication endpoints or user persistence tables.
            User roles are securely partitioned on the client side with verified demo credentials.
            Database-backed RBAC is marked as <strong className="text-[#153b35]">Coming soon</strong>.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {users.map((u) => (
          <div
            key={u.username}
            className="rounded-3xl border border-[#cfe6bf] bg-white p-6 shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="rounded-2xl bg-[#eaf6df] p-3 text-[#5c8e33]">
                  <Shield size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-[#153b35]">{u.name}</h3>
                    <span className="font-mono text-xs text-[#788d81]">(@{u.username})</span>
                  </div>
                  <p className="text-xs text-[#788d81]">{u.title}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded-full bg-[#153b35] px-3.5 py-1 text-xs font-bold text-white">
                  {u.role}
                </span>
                <span className="rounded-full bg-[#eaf6df] px-3 py-1 text-xs font-bold text-[#5c8e33]">
                  {u.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
