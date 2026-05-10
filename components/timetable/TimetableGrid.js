// components/timetable/TimetableGrid.js
"use client";

const DAYS    = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const PERIODS = ["Period 1","Period 2","Period 3","Period 4","Period 5","Period 6","Period 7","Period 8"];

const SUBJECT_COLORS = [
  "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20",
  "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
  "bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/20",
  "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
  "bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20",
  "bg-teal-100 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-500/20",
  "bg-indigo-100 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20",
  "bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/20",
];

function getSubjectColor(subject, subjectMap) {
  const idx = subjectMap[subject];
  return SUBJECT_COLORS[idx % SUBJECT_COLORS.length] || SUBJECT_COLORS[0];
}

export default function TimetableGrid({
  timetable   = {},
  periods     = PERIODS,
  days        = DAYS,
  showTeacher = true,
  className   = "",
}) {
  // Build subject → color index map
  const allSubjects = [];
  days.forEach((day) => {
    periods.forEach((period) => {
      const cell = timetable[day]?.[period];
      if (cell?.subject && !allSubjects.includes(cell.subject)) {
        allSubjects.push(cell.subject);
      }
    });
  });
  const subjectMap = Object.fromEntries(allSubjects.map((s, i) => [s, i]));

  return (
    <div className={`rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/60">
              {/* Period column */}
              <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-28 border-r border-slate-200 dark:border-slate-700">
                Period
              </th>
              {days.map((day) => (
                <th key={day} className="px-4 py-3 text-center text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider min-w-[120px]">
                  {day.slice(0, 3)}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {periods.map((period, pIdx) => (
              <tr key={period} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                {/* Period label */}
                <td className="px-4 py-3 border-r border-slate-200 dark:border-slate-700">
                  <p className="text-[12px] font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    {period}
                  </p>
                  {timetable.__times?.[pIdx] && (
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {timetable.__times[pIdx]}
                    </p>
                  )}
                </td>

                {/* Cells */}
                {days.map((day) => {
                  const cell = timetable[day]?.[period];
                  if (!cell) {
                    return (
                      <td key={day} className="px-3 py-3 text-center">
                        <span className="text-slate-300 dark:text-slate-700 text-xs">—</span>
                      </td>
                    );
                  }

                  // Break / free period
                  if (cell.type === "BREAK" || cell.type === "FREE") {
                    return (
                      <td key={day} className="px-3 py-3 text-center">
                        <span className="inline-block px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[11px] font-semibold">
                          {cell.type === "BREAK" ? "☕ Break" : "Free"}
                        </span>
                      </td>
                    );
                  }

                  const colorClass = getSubjectColor(cell.subject, subjectMap);

                  return (
                    <td key={day} className="px-3 py-3">
                      <div className={`rounded-xl border px-3 py-2 ${colorClass}`}>
                        <p className="text-[12px] font-bold leading-tight truncate">
                          {cell.subject}
                        </p>
                        {showTeacher && cell.teacher && (
                          <p className="text-[10px] opacity-75 mt-0.5 truncate">
                            {cell.teacher}
                          </p>
                        )}
                        {cell.room && (
                          <p className="text-[10px] opacity-60 mt-0.5">
                            Room {cell.room}
                          </p>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      {allSubjects.length > 0 && (
        <div className="flex flex-wrap gap-2 px-4 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
          {allSubjects.map((sub) => (
            <span key={sub} className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${getSubjectColor(sub, subjectMap)}`}>
              {sub}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}