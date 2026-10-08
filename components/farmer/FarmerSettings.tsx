'use client'

import React, { useState } from 'react'
import { Globe, User, Bell, Shield, Check, Info } from 'lucide-react'

interface FarmerSettingsProps {
  language: 'EN' | 'తెలుగు'
  onLanguageChange: (lang: 'EN' | 'తెలుగు') => void
}

export function FarmerSettings({ language, onLanguageChange }: FarmerSettingsProps) {
  const isTe = language === 'తెలుగు'
  const [smsAlerts, setSmsAlerts] = useState(true)
  const [whatsappAlerts, setWhatsappAlerts] = useState(true)
  const [soundAlerts, setSoundAlerts] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-[#153b35]">
          {isTe ? 'రైతు సెట్టింగ్‌లు' : 'Farmer Settings'}
        </h2>
        <p className="text-xs text-[#788d81]">
          {isTe ? 'భాష మరియు నోటిఫికేషన్ ప్రాధాన్యతలు' : 'Language and operational alert preferences'}
        </p>
      </div>

      {saved && (
        <div className="rounded-2xl bg-[#eaf6df] border border-[#cfe6bf] p-4 text-xs font-bold text-[#5c8e33] flex items-center gap-2">
          <Check size={16} />
          <span>{isTe ? 'సెట్టింగ్‌లు విజయవంతంగా భద్రపరచబడ్డాయి.' : 'Preferences saved successfully.'}</span>
        </div>
      )}

      {/* Language Section */}
      <div className="rounded-3xl border border-[#dce5d9] bg-white p-6 shadow-xs">
        <div className="flex items-center gap-3 pb-4 border-b border-[#edf1eb]">
          <div className="rounded-xl bg-[#eaf6df] p-2.5 text-[#5c8e33]">
            <Globe size={20} />
          </div>
          <div>
            <h3 className="font-bold text-base text-[#153b35]">
              {isTe ? 'భాష ఎంపిక' : 'Language Selection'}
            </h3>
            <p className="text-xs text-[#788d81]">
              {isTe ? 'ఇంటర్‌ఫేస్ కోసం కావలసిన భాషను ఎంచుకోండి' : 'Choose your preferred dashboard language'}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => onLanguageChange('EN')}
            className={`flex items-center justify-between rounded-2xl border p-4 text-left font-bold text-sm transition-all ${
              language === 'EN'
                ? 'border-[#153b35] bg-[#153b35] text-white shadow-xs'
                : 'border-[#dce5d9] bg-white text-[#153b35] hover:bg-[#f9faf7]'
            }`}
          >
            <span>English</span>
            {language === 'EN' && <Check size={18} className="text-[#d5f36d]" />}
          </button>

          <button
            onClick={() => onLanguageChange('తెలుగు')}
            className={`flex items-center justify-between rounded-2xl border p-4 text-left font-bold text-sm transition-all ${
              language === 'తెలుగు'
                ? 'border-[#153b35] bg-[#153b35] text-white shadow-xs'
                : 'border-[#dce5d9] bg-white text-[#153b35] hover:bg-[#f9faf7]'
            }`}
          >
            <span>తెలుగు (Telugu)</span>
            {language === 'తెలుగు' && <Check size={18} className="text-[#d5f36d]" />}
          </button>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="rounded-3xl border border-[#dce5d9] bg-white p-6 shadow-xs">
        <div className="flex items-center gap-3 pb-4 border-b border-[#edf1eb]">
          <div className="rounded-xl bg-[#fef3c7] p-2.5 text-[#d97706]">
            <Bell size={20} />
          </div>
          <div>
            <h3 className="font-bold text-base text-[#153b35]">
              {isTe ? 'నోటిఫికేషన్ల ప్రాధాన్యతలు' : 'Notification Channels'}
            </h3>
            <p className="text-xs text-[#788d81]">
              {isTe ? 'ఆక్సిజన్ హెచ్చరికల కోసం అలర్ట్ సెట్టింగ్‌లు' : 'Configure low DO alerts for nighttime farm emergencies'}
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <label className="flex items-center justify-between rounded-2xl border border-[#edf1eb] p-4 cursor-pointer hover:bg-[#f9faf7]">
            <div>
              <p className="font-bold text-sm text-[#153b35]">
                {isTe ? 'వాట్సాప్ అలర్ట్‌లు' : 'WhatsApp Instant Alerts'}
              </p>
              <p className="text-xs text-[#788d81]">
                {isTe ? 'ఆక్సిజన్ 5.0 mg/L కంటే తగ్గితే సందేశం పంపుతుంది' : 'Send emergency alerts when predicted DO falls below 5.0 mg/L'}
              </p>
            </div>
            <input
              type="checkbox"
              checked={whatsappAlerts}
              onChange={(e) => setWhatsappAlerts(e.target.checked)}
              className="h-5 w-5 accent-[#153b35] rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between rounded-2xl border border-[#edf1eb] p-4 cursor-pointer hover:bg-[#f9faf7]">
            <div>
              <p className="font-bold text-sm text-[#153b35]">
                {isTe ? 'ఎస్ఎంఎస్ అలర్ట్‌లు' : 'SMS Critical Alerts'}
              </p>
              <p className="text-xs text-[#788d81]">
                {isTe ? 'ఇంటర్నెట్ లేనప్పుడు నేరుగా ఫోన్‌కు సందేశం' : 'Direct cellular SMS for farm supervisor'}
              </p>
            </div>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={(e) => setSmsAlerts(e.target.checked)}
              className="h-5 w-5 accent-[#153b35] rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between rounded-2xl border border-[#edf1eb] p-4 cursor-pointer hover:bg-[#f9faf7]">
            <div>
              <p className="font-bold text-sm text-[#153b35]">
                {isTe ? 'చెరువు సైరన్ అలారం' : 'Pond Siren Alert'}
              </p>
              <p className="text-xs text-[#788d81]">
                {isTe ? 'రాత్రి సమయంలో క్షేత్రస్థాయి సైరన్ ధ్వని' : 'Trigger physical buzzer relay during critical oxygen drops'}
              </p>
            </div>
            <input
              type="checkbox"
              checked={soundAlerts}
              onChange={(e) => setSoundAlerts(e.target.checked)}
              className="h-5 w-5 accent-[#153b35] rounded cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Account Profile Card */}
      <div className="rounded-3xl border border-[#dce5d9] bg-white p-6 shadow-xs">
        <div className="flex items-center gap-3 pb-4 border-b border-[#edf1eb]">
          <div className="rounded-xl bg-[#eff6ff] p-2.5 text-[#2563eb]">
            <User size={20} />
          </div>
          <div>
            <h3 className="font-bold text-base text-[#153b35]">
              {isTe ? 'రైతు ప్రొఫైల్' : 'Operator Account'}
            </h3>
            <p className="text-xs text-[#788d81]">
              {isTe ? 'డెమో ఖాతా వివరాలు' : 'Demo session operator details'}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="rounded-2xl bg-[#f4f7f2] p-4">
            <span className="text-[#788d81]">{isTe ? 'రైతు పేరు' : 'Farmer Name'}</span>
            <p className="font-bold text-sm text-[#153b35] mt-1">Ravi Kumar</p>
          </div>
          <div className="rounded-2xl bg-[#f4f7f2] p-4">
            <span className="text-[#788d81]">{isTe ? 'ప్రాంతం' : 'Farm Location'}</span>
            <p className="font-bold text-sm text-[#153b35] mt-1">Kakinada Delta Cluster, Pond 01</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            className="rounded-full bg-[#153b35] px-6 py-3 text-xs font-bold text-white hover:bg-[#1b4841] transition-colors"
          >
            {isTe ? 'మార్పులను భద్రపరచండి' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  )
}
