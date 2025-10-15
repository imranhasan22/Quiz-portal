// src/pages/CalendarPage.tsx
import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Bell } from "lucide-react";

/* ---------- Types ---------- */
type CalEvent = {
  id: string;
  title: string;
  date: string; // ISO yyyy-mm-dd
};

/* ---------- Helpers (Mon-first) ---------- */
const toISO = (d: Date) => d.toISOString().slice(0, 10);

// add months keeping local time
function addMonths(date: Date, delta: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + delta);
  return d;
}
function startOfMonth(date: Date) {
  const d = new Date(date.getFullYear(), date.getMonth(), 1);
  return d;
}
function endOfMonth(date: Date) {
  const d = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return d;
}
// Monday of the week for given date
function startOfWeekMon(date: Date) {
  const d = new Date(date);
  const day = d.getDay(); // 0..6 (Sun..Sat)
  const diff = (day + 6) % 7; // Mon=0
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}
function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}
const MONTH_LABEL = (d: Date) =>
  d.toLocaleString(undefined, { month: "long", year: "numeric" });

/* ---------- Demo events (replace with API) ---------- */
const DEMO_EVENTS: CalEvent[] = [
  { id: "1", title: "Nagad quiz 1", date: "2020-10-08" },
];

/* ---------- Component ---------- */
const CalendarPage: React.FC = () => {
 
  const [viewDate, setViewDate] = useState(new Date(2020, 9, 1)); // Oct=9

  // events – in real app fetch by month
  const [events] = useState<CalEvent[]>(DEMO_EVENTS);

  // compute visible grid (6 weeks, Mon..Sun)
  const { weeks } = useMemo(() => {
    const first = startOfMonth(viewDate);
    const last = endOfMonth(viewDate);
    const gridStart = startOfWeekMon(first);

    const cells: Date[] = [];
    for (let i = 0; i < 42; i++) {
      cells.push(addDays(gridStart, i));
    }
    // chunk by 7
    const weeks: Date[][] = [];
    for (let i = 0; i < 42; i += 7) {
      weeks.push(cells.slice(i, i + 7));
    }
    return { weeks, monthStart: first, monthEnd: last };
  }, [viewDate]);

  const eventsByDay = useMemo(() => {
    const map: Record<string, CalEvent[]> = {};
    for (const e of events) {
      (map[e.date] ||= []).push(e);
    }
    return map;
  }, [events]);

  const isCurrentMonth = (d: Date) =>
    d.getMonth() === viewDate.getMonth() && d.getFullYear() === viewDate.getFullYear();

  return (
    <div className="px-5">
      {/* Top row (title + arrows + right icons to match your topbar spacing if needed) */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            className="rounded-md p-2 hover:bg-gray-100"
            onClick={() => setViewDate((d) => addMonths(d, -1))}
            aria-label="Previous month"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="min-w-[180px] text-center text-lg font-medium">
            {MONTH_LABEL(viewDate)}
          </div>
          <button
            className="rounded-md p-2 hover:bg-gray-100"
            onClick={() => setViewDate((d) => addMonths(d, 1))}
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="overflow-hidden rounded-2xl border bg-white">
        {/* Weekday header Mon..Sun */}
        <div className="grid grid-cols-7 border-b bg-white px-6 py-4 text-sm font-medium text-gray-600">
          <div className="text-left">Mon</div>
          <div className="text-left">Tue</div>
          <div className="text-left">Wed</div>
          <div className="text-left">Thu</div>
          <div className="text-left">Fri</div>
          <div className="text-left">Sat</div>
          <div className="text-left">Sun</div>
        </div>

        {/* Weeks */}
        <div className="px-2 py-2">
          {weeks.map((week, widx) => (
            <div key={widx} className="grid grid-cols-7 gap-y-6 px-4 py-4">
              {week.map((day) => {
                const iso = toISO(day);
                const dayEvents = eventsByDay[iso] || [];
                const muted = !isCurrentMonth(day);

                return (
                  <div key={iso} className="min-h-[84px]">
                    {/* day number */}
                    <div
                      className={[
                        "mb-2 text-sm",
                        muted ? "text-gray-400" : "text-gray-900",
                      ].join(" ")}
                    >
                      {day.getDate()}
                    </div>

                    {/* events */}
                    <div className="space-y-2">
                      {dayEvents.map((ev) => (
                        <div
                          key={ev.id}
                          className="inline-flex rounded-md border px-3 py-1 text-xs text-gray-800"
                          title={ev.title}
                        >
                          {ev.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
