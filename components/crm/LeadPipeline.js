// components/crm/LeadPipeline.js
"use client";

import LeadCard from "@/components/crm/LeadCard";

const STAGES = [
  { key: "NEW",        label: "New Enquiries", color: "border-blue-400"    },
  { key: "CONTACTED",  label: "Contacted",     color: "border-purple-400"  },
  { key: "INTERESTED", label: "Interested",    color: "border-amber-400"   },
  { key: "ADMITTED",   label: "Admitted",      color: "border-emerald-400" },
  { key: "DROPPED",    label: "Dropped",       color: "border-red-400"     },
];

export default function LeadPipeline({
  leads            = [],
  onView,
  onUpdateStatus,
  onCall,
}) {
  const byStage = STAGES.reduce((acc, s) => {
    acc[s.key] = leads.filter((l) => l.status === s.key);
    return acc;
  }, {});

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1">
      {STAGES.map((stage) => {
        const stageLeads = byStage[stage.key] || [];
        return (
          <div
            key={stage.key}
            className={`flex-shrink-0 w-72 rounded-2xl border-t-4 ${stage.color} bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 overflow-hidden`}
          >
            {/* Column header */}
            <div className="px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h3 className="text-[13px] font-bold text-slate-900 dark:text-white">
                  {stage.label}
                </h3>
                <span className="text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full">
                  {stageLeads.length}
                </span>
              </div>
            </div>

            {/* Cards */}
            <div className="p-3 space-y-3 min-h-[200px] max-h-[calc(100vh-280px)] overflow-y-auto">
              {stageLeads.length === 0 ? (
                <div className="flex items-center justify-center h-24 text-xs text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                  No leads
                </div>
              ) : (
                stageLeads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    onView={onView}
                    onUpdateStatus={onUpdateStatus}
                    onCall={onCall}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}