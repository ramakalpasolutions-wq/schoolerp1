// src/app/(dashboard)/super-admin/schools/[id]/page.js

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Building2, Users, GraduationCap, IndianRupee,
  MapPin, Phone, Mail, Calendar, Crown, Shield, Star,
  CheckCircle2, XCircle, Pencil, Power, Loader2, Settings,
  BarChart3, Globe, Navigation,
} from "lucide-react";

const MOCK_SCHOOL = {
  id: "1", name: "Sri Vidya High School", address: "Main Road, Rajyampet, AP", city: "Rajyampet",
  state: "Andhra Pradesh", pincode: "516115", phone: "9876543210", email: "info@srividya.edu.in",
  website: "www.srividya.edu.in", principalName: "Dr. Venkateshwara Rao", logo: null,
  geoLatitude: 14.6929, geoLongitude: 79.1591, geoRadius: 200,
  isActive: true, joinedDate: "2023-06-15",
  subscription: { plan: "PREMIUM", expiry: "2025-12-31", isActive: true, maxStudents: 2000 },
  stats: { students: 1248, teachers: 68, classes: 12, parents: 1100 },
  recentActivity: [
    { type: "payment", message: "Monthly subscription renewed", date: "Mar 15, 2025" },
    { type: "user", message: "New admin account created", date: "Mar 10, 2025" },
    { type: "student", message: "24 new students enrolled", date: "Mar 01, 2025" },
  ],
};

const planConfig = {
  BASIC: { label: "Basic", icon: Star, gradient: "from-slate-400 to-slate-500" },
  STANDARD: { label: "Standard", icon: Shield, gradient: "from-blue-500 to-indigo-600" },
  PREMIUM: { label: "Premium", icon: Crown, gradient: "from-amber-500 to-yellow-600" },
  ENTERPRISE: { label: "Enterprise", icon: Crown, gradient: "from-purple-500 to-indigo-600" },
};

export default function SchoolDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => { setSchool(MOCK_SCHOOL); setLoading(false); }, 500);
    return () => clearTimeout(t);
  }, [params.id]);

  async function handleToggle() {
    setToggling(true);
    await new Promise((r) => setTimeout(r, 800));
    setSchool((p) => ({ ...p, isActive: !p.isActive }));
    setToggling(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }
  if (!school) return null;

  const planCfg = planConfig[school.subscription.plan] || planConfig.STANDARD;
  const PlanIcon = planCfg.icon;
  const expiryDate = new Date(school.subscription.expiry).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/super-admin/schools" className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">School Details</h1>
            <p className="text-sm text-slate-400">{school.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={handleToggle} disabled={toggling} className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold border-2 disabled:opacity-60 transition-all ${school.isActive ? "border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10" : "border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"}`}>
            {toggling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Power className="w-4 h-4" />}
            {school.isActive ? "Disable School" : "Enable School"}
          </button>
          <Link href={`/super-admin/schools/${school.id}?edit=true`} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold shadow-md shadow-blue-500/15 hover:from-blue-700 hover:to-indigo-700 transition-all">
            <Pencil className="w-4 h-4" /> Edit School
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 p-6">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-xl">
            <span className="text-white text-2xl font-bold">{school.name.charAt(0)}</span>
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-2xl font-bold text-white">{school.name}</h2>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${school.isActive ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${school.isActive ? "bg-emerald-400" : "bg-red-400"}`} />
                {school.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="text-slate-400 text-sm">{school.address} • {school.state}</p>
          </div>
          <div className="flex gap-3">
            {Object.entries(school.stats).map(([key, value]) => (
              <div key={key} className="text-center bg-white/10 rounded-xl px-3 py-2">
                <p className="text-white font-bold text-base">{value.toLocaleString()}</p>
                <p className="text-slate-400 text-[10px] capitalize">{key}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Contact */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-500" /> Contact & Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            {[
              { icon: Phone, label: "Phone", value: school.phone },
              { icon: Mail, label: "Email", value: school.email },
              { icon: Globe, label: "Website", value: school.website || "—" },
              { icon: Users, label: "Principal", value: school.principalName || "—" },
              { icon: MapPin, label: "City", value: `${school.city}, ${school.state}` },
              { icon: Calendar, label: "Joined", value: new Date(school.joinedDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) },
              { icon: Navigation, label: "Coordinates", value: `${school.geoLatitude}, ${school.geoLongitude}` },
              { icon: MapPin, label: "Geo Radius", value: `${school.geoRadius}m` },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <item.icon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription */}
        <div className="space-y-4">
          <div className={`rounded-2xl p-5 bg-gradient-to-br ${planCfg.gradient} text-white`}>
            <div className="flex items-center gap-2 mb-3">
              <PlanIcon className="w-5 h-5" />
              <span className="text-sm font-bold">{planCfg.label} Plan</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Expiry</span>
                <span className="font-semibold">{expiryDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Max Students</span>
                <span className="font-semibold">{school.subscription.maxStudents.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Status</span>
                <span className={`font-bold ${school.subscription.isActive ? "text-white" : "text-red-300"}`}>
                  {school.subscription.isActive ? "✓ Active" : "✗ Expired"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: "Manage Subscription", color: "text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10", icon: Crown, href: "/super-admin/subscriptions" },
                { label: "View Analytics", color: "text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10", icon: BarChart3, href: "/super-admin/analytics" },
                { label: "Settings", color: "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800", icon: Settings, href: "/super-admin/settings" },
              ].map((action) => (
                <Link key={action.label} href={action.href} className={`flex items-center gap-3 p-3 rounded-xl ${action.color} transition-colors`}>
                  <action.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-medium">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}