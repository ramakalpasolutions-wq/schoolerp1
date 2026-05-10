// src/app/(dashboard)/super-admin/settings/page.js

"use client";

import { useState } from "react";
import {
  Settings, Globe, Bell, Shield, Save, Loader2, CheckCircle2,
  Key, Mail, Smartphone, Server, Database, Eye, EyeOff,
  AlertCircle, Info,
} from "lucide-react";

const TABS = [
  { id: "platform", label: "Platform", icon: Globe },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "integrations", label: "Integrations", icon: Server },
];

function InputField({ label, name, value, onChange, type = "text", placeholder, hint, error }) {
  const [showPass, setShowPass] = useState(false);
  const isPassword = type === "password";
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={isPassword ? (showPass ? "text" : "password") : type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-3.5 py-3 rounded-xl border-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 outline-none text-sm transition-all ${error ? "border-red-300 dark:border-red-700" : "border-slate-200 dark:border-slate-700 focus:border-blue-500"}`}
        />
        {isPassword && (
          <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {hint && <p className="mt-1 text-[11px] text-slate-400">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{error}</p>}
    </div>
  );
}

function SaveButton({ loading, saved, onClick }) {
  return (
    <button onClick={onClick} disabled={loading} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 transition-all active:scale-95">
      {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : saved ? <><CheckCircle2 className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
    </button>
  );
}

export default function SuperAdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("platform");
  const [savingState, setSavingState] = useState({});
  const [savedState, setSavedState] = useState({});

  const [platform, setPlatform] = useState({
    platformName: "School ERP",
    tagline: "Enterprise School Management Platform",
    supportEmail: "support@schoolerp.com",
    supportPhone: "9876543200",
    website: "www.schoolerp.com",
    timezone: "Asia/Kolkata",
    currency: "INR",
  });

  const [notif, setNotif] = useState({
    smsProvider: "fast2sms",
    smsApiKey: "",
    smsSenderId: "SCLERP",
    emailHost: "smtp.gmail.com",
    emailPort: "587",
    emailUser: "",
    emailPass: "",
    emailFrom: "noreply@schoolerp.com",
  });

  const [security, setSecurity] = useState({
    jwtSecret: "",
    sessionTimeout: "7",
    maxLoginAttempts: "5",
    twoFactorEnabled: false,
    ipWhitelist: "",
  });

  const [integrations, setIntegrations] = useState({
    r2AccountId: "",
    r2AccessKey: "",
    r2SecretKey: "",
    r2BucketName: "school-erp",
    r2PublicUrl: "",
    twilioAccountSid: "",
    twilioAuthToken: "",
    twilioPhone: "",
  });

  async function handleSave(section) {
    setSavingState((p) => ({ ...p, [section]: true }));
    setSavedState((p) => ({ ...p, [section]: false }));
    await new Promise((r) => setTimeout(r, 1200));
    setSavingState((p) => ({ ...p, [section]: false }));
    setSavedState((p) => ({ ...p, [section]: true }));
    setTimeout(() => setSavedState((p) => ({ ...p, [section]: false })), 3000);
  }

  function handleChange(setter) {
    return (e) => {
      const { name, value, type, checked } = e.target;
      setter((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    };
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <Settings className="w-7 h-7 text-blue-500" /> Super Admin Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Global platform configuration</p>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-1.5">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${activeTab === tab.id ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Platform Settings */}
      {activeTab === "platform" && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-500" /> Platform Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <InputField label="Platform Name" name="platformName" value={platform.platformName} onChange={handleChange(setPlatform)} placeholder="School ERP" />
            <InputField label="Tagline" name="tagline" value={platform.tagline} onChange={handleChange(setPlatform)} placeholder="Your tagline" />
            <InputField label="Support Email" name="supportEmail" value={platform.supportEmail} onChange={handleChange(setPlatform)} placeholder="support@yourplatform.com" type="email" />
            <InputField label="Support Phone" name="supportPhone" value={platform.supportPhone} onChange={handleChange(setPlatform)} placeholder="10-digit phone" />
            <InputField label="Website" name="website" value={platform.website} onChange={handleChange(setPlatform)} placeholder="www.yourplatform.com" />
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Timezone</label>
              <select name="timezone" value={platform.timezone} onChange={handleChange(setPlatform)} className="w-full px-3.5 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none appearance-none transition-all">
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <SaveButton loading={savingState.platform} saved={savedState.platform} onClick={() => handleSave("platform")} />
          </div>
        </div>
      )}

      {/* Notifications Settings */}
      {activeTab === "notifications" && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-blue-500" /> SMS Configuration
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">SMS Provider</label>
                <select name="smsProvider" value={notif.smsProvider} onChange={handleChange(setNotif)} className="w-full px-3.5 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none appearance-none transition-all">
                  {["fast2sms", "twilio", "msg91", "textlocal"].map((p) => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                </select>
              </div>
              <InputField label="Sender ID" name="smsSenderId" value={notif.smsSenderId} onChange={handleChange(setNotif)} placeholder="6-char sender ID" hint="Max 6 characters" />
              <div className="sm:col-span-2">
                <InputField label="API Key" name="smsApiKey" value={notif.smsApiKey} onChange={handleChange(setNotif)} type="password" placeholder="Your SMS API key" hint="Keep this secret" />
              </div>
            </div>
            <div className="flex justify-end">
              <SaveButton loading={savingState.sms} saved={savedState.sms} onClick={() => handleSave("sms")} />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
              <Mail className="w-4 h-4 text-purple-500" /> Email (SMTP) Configuration
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <InputField label="SMTP Host" name="emailHost" value={notif.emailHost} onChange={handleChange(setNotif)} placeholder="smtp.gmail.com" />
              <InputField label="SMTP Port" name="emailPort" value={notif.emailPort} onChange={handleChange(setNotif)} placeholder="587" type="number" />
              <InputField label="Email Username" name="emailUser" value={notif.emailUser} onChange={handleChange(setNotif)} placeholder="your@gmail.com" type="email" />
              <InputField label="Password / App Password" name="emailPass" value={notif.emailPass} onChange={handleChange(setNotif)} type="password" placeholder="App password" />
              <div className="sm:col-span-2">
                <InputField label="From Email" name="emailFrom" value={notif.emailFrom} onChange={handleChange(setNotif)} placeholder="noreply@yourplatform.com" type="email" />
              </div>
            </div>
            <div className="flex justify-end">
              <SaveButton loading={savingState.email} saved={savedState.email} onClick={() => handleSave("email")} />
            </div>
          </div>
        </div>
      )}

      {/* Security Settings */}
      {activeTab === "security" && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
            <Shield className="w-4 h-4 text-red-500" /> Security Configuration
          </h3>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 mb-5">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700 dark:text-amber-300">Changing security settings will affect all users. Apply changes carefully.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <InputField label="JWT Secret" name="jwtSecret" value={security.jwtSecret} onChange={handleChange(setSecurity)} type="password" placeholder="Strong secret key" hint="Min 32 characters recommended" />
            <InputField label="Session Timeout (days)" name="sessionTimeout" value={security.sessionTimeout} onChange={handleChange(setSecurity)} type="number" placeholder="7" />
            <InputField label="Max Login Attempts" name="maxLoginAttempts" value={security.maxLoginAttempts} onChange={handleChange(setSecurity)} type="number" placeholder="5" hint="Before account lockout" />
            <div className="sm:col-span-2">
              <InputField label="IP Whitelist (comma-separated)" name="ipWhitelist" value={security.ipWhitelist} onChange={handleChange(setSecurity)} placeholder="192.168.1.1, 10.0.0.1" hint="Leave empty to allow all IPs" />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-5">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Two-Factor Authentication</p>
              <p className="text-xs text-slate-400 mt-0.5">Require 2FA for all admin accounts</p>
            </div>
            <button type="button" onClick={() => setSecurity((p) => ({ ...p, twoFactorEnabled: !p.twoFactorEnabled }))} className={`relative w-12 h-6 rounded-full transition-all ${security.twoFactorEnabled ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"}`}>
              <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-200 ${security.twoFactorEnabled ? "left-6" : "left-0.5"}`} />
            </button>
          </div>
          <div className="flex justify-end">
            <SaveButton loading={savingState.security} saved={savedState.security} onClick={() => handleSave("security")} />
          </div>
        </div>
      )}

      {/* Integrations */}
      {activeTab === "integrations" && (
        <div className="space-y-5">
          {/* R2 Storage */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
              <Database className="w-4 h-4 text-orange-500" /> Cloudflare R2 Storage
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <InputField label="Account ID" name="r2AccountId" value={integrations.r2AccountId} onChange={handleChange(setIntegrations)} placeholder="Your R2 account ID" />
              <InputField label="Bucket Name" name="r2BucketName" value={integrations.r2BucketName} onChange={handleChange(setIntegrations)} placeholder="school-erp" />
              <InputField label="Access Key ID" name="r2AccessKey" value={integrations.r2AccessKey} onChange={handleChange(setIntegrations)} type="password" placeholder="R2 access key" />
              <InputField label="Secret Access Key" name="r2SecretKey" value={integrations.r2SecretKey} onChange={handleChange(setIntegrations)} type="password" placeholder="R2 secret key" />
              <div className="sm:col-span-2">
                <InputField label="Public URL" name="r2PublicUrl" value={integrations.r2PublicUrl} onChange={handleChange(setIntegrations)} placeholder="https://your-domain.com/storage" hint="Public URL for accessing uploaded files" />
              </div>
            </div>
            <div className="flex justify-end">
              <SaveButton loading={savingState.r2} saved={savedState.r2} onClick={() => handleSave("r2")} />
            </div>
          </div>

          {/* Twilio */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-red-500" /> Twilio SMS (Alternative)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <InputField label="Account SID" name="twilioAccountSid" value={integrations.twilioAccountSid} onChange={handleChange(setIntegrations)} type="password" placeholder="AC..." />
              <InputField label="Auth Token" name="twilioAuthToken" value={integrations.twilioAuthToken} onChange={handleChange(setIntegrations)} type="password" placeholder="Your auth token" />
              <InputField label="From Phone Number" name="twilioPhone" value={integrations.twilioPhone} onChange={handleChange(setIntegrations)} placeholder="+1234567890" />
            </div>
            <div className="flex justify-end">
              <SaveButton loading={savingState.twilio} saved={savedState.twilio} onClick={() => handleSave("twilio")} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}