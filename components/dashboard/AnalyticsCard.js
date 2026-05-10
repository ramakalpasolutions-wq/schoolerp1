// components/dashboard/AnalyticsCard.js

"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const colorMap = {
  blue: {
    iconBg: "bg-blue-100 dark:bg-blue-500/10",
    iconColor: "text-blue-600 dark:text-blue-400",
    glow: "from-blue-500 to-indigo-500",
  },
  green: {
    iconBg: "bg-emerald-100 dark:bg-emerald-500/10",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    glow: "from-emerald-500 to-teal-500",
  },
  orange: {
    iconBg: "bg-orange-100 dark:bg-orange-500/10",
    iconColor: "text-orange-600 dark:text-orange-400",
    glow: "from-orange-500 to-amber-500",
  },
  red: {
    iconBg: "bg-red-100 dark:bg-red-500/10",
    iconColor: "text-red-600 dark:text-red-400",
    glow: "from-red-500 to-rose-500",
  },
  purple: {
    iconBg: "bg-purple-100 dark:bg-purple-500/10",
    iconColor: "text-purple-600 dark:text-purple-400",
    glow: "from-purple-500 to-violet-500",
  },
  indigo: {
    iconBg: "bg-indigo-100 dark:bg-indigo-500/10",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    glow: "from-indigo-500 to-blue-500",
  },
};

export default function AnalyticsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  color = "blue",
  loading = false,
  onClick,
}) {
  const cfg = colorMap[color] || colorMap.blue;

  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  const trendClass =
    trend === "up"
      ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
      : trend === "down"
        ? "bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400"
        : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400";

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 animate-pulse">
        <div className="flex items-start justify-between mb-5">
          <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="w-20 h-6 rounded-lg bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="w-24 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 mb-2" />
        <div className="w-32 h-4 rounded bg-slate-100 dark:bg-slate-800" />
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`
        group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800
        bg-white dark:bg-slate-900 p-6
        transition-all duration-300
        hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-200/60 dark:hover:shadow-black/30
        ${onClick ? "cursor-pointer" : ""}
      `}
    >
      {/* Subtle gradient line on hover */}
      <div
        className={`absolute inset-x-6 top-0 h-[2px] bg-gradient-to-r ${cfg.glow} rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
      />

      {/* Top row */}
      <div className="flex items-start justify-between mb-5">
        <div
          className={`w-12 h-12 rounded-xl ${cfg.iconBg} flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110`}
        >
          {Icon && <Icon className={`w-6 h-6 ${cfg.iconColor}`} />}
        </div>

        {trend && trendValue && (
          <span
            className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-semibold ${trendClass}`}
          >
            <TrendIcon className="w-3.5 h-3.5" />
            {trendValue}
          </span>
        )}
      </div>

      {/* Value */}
      <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-1">
        {value}
      </p>

      {/* Title */}
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
        {title}
      </p>

      {/* Subtitle */}
      {subtitle && (
        <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
          {subtitle}
        </p>
      )}
    </div>
  );
}