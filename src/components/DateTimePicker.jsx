import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

const pad = (n) => String(n).padStart(2, '0');

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

export default function DateTimePicker({ value, onChange, required }) {
  const today = new Date();
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  // parsed selected state
  const parsed = value ? new Date(value) : null;
  const [selDay, setSelDay] = useState(parsed ? parsed.getDate() : null);
  const [selMonth, setSelMonth] = useState(parsed ? parsed.getMonth() : today.getMonth());
  const [selYear, setSelYear] = useState(parsed ? parsed.getFullYear() : today.getFullYear());
  const [selHour, setSelHour] = useState(parsed ? (parsed.getHours() % 12 || 12) : 12);
  const [selMin, setSelMin] = useState(parsed ? parsed.getMinutes() : 0);
  const [selAmPm, setSelAmPm] = useState(parsed ? (parsed.getHours() >= 12 ? 'PM' : 'AM') : 'AM');

  const hourRef = useRef(null);
  const minRef = useRef(null);
  const containerRef = useRef(null);

  // close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // scroll time columns to selection
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        if (hourRef.current) {
          const el = hourRef.current.querySelector(`[data-h="${selHour}"]`);
          el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
        if (minRef.current) {
          const el = minRef.current.querySelector(`[data-m="${selMin}"]`);
          el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
      }, 120);
    }
  }, [open]);

  const emitChange = (day, month, year, hour, min, ampm) => {
    if (!day) return;
    let h24 = hour % 12;
    if (ampm === 'PM') h24 += 12;
    const dt = new Date(year, month, day, h24, min);
    const local = `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
    onChange({ target: { name: 'time', value: local } });
  };

  const selectDay = (d) => {
    setSelDay(d); setSelMonth(viewMonth); setSelYear(viewYear);
    emitChange(d, viewMonth, viewYear, selHour, selMin, selAmPm);
  };

  const selectHour = (h) => {
    setSelHour(h);
    emitChange(selDay, selMonth, selYear, h, selMin, selAmPm);
    hourRef.current?.querySelector(`[data-h="${h}"]`)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  };

  const selectMin = (m) => {
    setSelMin(m);
    emitChange(selDay, selMonth, selYear, selHour, m, selAmPm);
    minRef.current?.querySelector(`[data-m="${m}"]`)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  };

  const selectAmPm = (ap) => {
    setSelAmPm(ap);
    emitChange(selDay, selMonth, selYear, selHour, selMin, ap);
  };

  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); };

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const prevDays = getDaysInMonth(viewYear, viewMonth === 0 ? 11 : viewMonth - 1);

  const displayLabel = parsed
    ? parsed.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'Select date & time';

  const isToday = (d) => d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
  const isSelected = (d) => d === selDay && viewMonth === selMonth && viewYear === selYear;
  const isPast = (d) => new Date(viewYear, viewMonth, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    <div ref={containerRef} className="relative">
      {/* trigger button */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`w-full py-4 h-[56px] pl-12 pr-4 bg-slate-50 border-2 rounded-2xl flex justify-between items-center transition-all shadow-sm font-bold text-left ${open ? 'border-red-500 bg-white ring-4 ring-red-500/10 text-slate-900' : 'border-slate-100 text-slate-500'}`}
      >
        <Calendar className={`absolute left-4 w-5 h-5 transition-colors ${open ? 'text-red-500' : 'text-slate-400'}`} />
        <span className={parsed ? 'text-slate-900' : 'text-slate-400'}>{displayLabel}</span>
        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${open ? 'rotate-180 text-red-500' : 'text-slate-400'}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 top-[110%] right-0 min-w-[460px] bg-white border border-slate-100 rounded-2xl shadow-[0_30px_60px_-10px_rgba(0,0,0,0.15)] overflow-visible flex"
          >
            {/* ── CALENDAR ── */}
            <div className="flex-1 p-4 min-w-[220px]">
              {/* header */}
              <div className="flex items-center justify-between mb-3">
                <button type="button" onClick={prevMonth} className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors">
                  <ChevronLeft className="w-4 h-4 text-slate-600" />
                </button>
                <span className="font-black text-slate-900 text-sm tracking-tight">
                  {MONTHS[viewMonth]}, {viewYear}
                </span>
                <button type="button" onClick={nextMonth} className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors">
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </button>
              </div>

              {/* day headers */}
              <div className="grid grid-cols-7 mb-1">
                {DAYS.map(d => (
                  <div key={d} className="text-center text-[10px] font-black uppercase tracking-wider text-slate-400 py-1">{d}</div>
                ))}
              </div>

              {/* day cells */}
              <div className="grid grid-cols-7 gap-y-0.5">
                {/* leading empty / prev month days */}
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`p${i}`} className="text-center py-1.5 text-[11px] text-slate-300 font-bold">
                    {prevDays - firstDay + 1 + i}
                  </div>
                ))}
                {/* current month days */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const d = i + 1;
                  const sel = isSelected(d);
                  const tod = isToday(d);
                  return (
                    <button
                      type="button"
                      key={d}
                      onClick={() => !isPast(d) && selectDay(d)}
                      disabled={isPast(d)}
                      className={`relative text-center py-1.5 text-[12px] font-black rounded-full transition-all mx-auto w-8 h-8 flex items-center justify-center
                        ${isPast(d) ? 'text-slate-300 cursor-not-allowed' : sel ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : tod ? 'border-2 border-red-400 text-red-500' : 'text-slate-700 hover:bg-slate-100'}`}
                    >
                      {d}
                    </button>
                  );
                })}
                {/* trailing next month days */}
                {Array.from({ length: (7 - (firstDay + daysInMonth) % 7) % 7 }).map((_, i) => (
                  <div key={`n${i}`} className="text-center py-1.5 text-[11px] text-slate-300 font-bold">{i + 1}</div>
                ))}
              </div>

              {/* footer actions */}
              <div className="flex justify-between mt-3 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => { setSelDay(null); onChange({ target: { name: 'time', value: '' } }); setOpen(false); }}
                  className="text-xs font-black text-red-500 hover:text-red-700 transition-colors">Clear</button>
                <button type="button" onClick={() => { selectDay(today.getDate()); setViewMonth(today.getMonth()); setViewYear(today.getFullYear()); }}
                  className="text-xs font-black text-red-500 hover:text-red-700 transition-colors">Today</button>
              </div>
            </div>

            {/* ── TIME PICKER ── */}
            <div className="flex flex-col border-l border-slate-100 bg-slate-50 flex-shrink-0 rounded-r-2xl overflow-hidden">
              {/* Column headings */}
              <div className="flex gap-1 px-3 pt-3 pb-1 border-b border-slate-100">
                <div className="w-12 text-center text-[9px] font-black uppercase tracking-[0.18em] text-red-400">Hr</div>
                <div className="w-12 text-center text-[9px] font-black uppercase tracking-[0.18em] text-red-400">Min</div>
                <div className="w-12 text-center text-[9px] font-black uppercase tracking-[0.18em] text-red-400">AM/PM</div>
              </div>

              {/* Columns */}
              <div className="flex gap-1 px-3 pt-2 pb-0">
                {/* Hour column */}
                <div ref={hourRef} className="w-12 h-[200px] overflow-y-auto scrollbar-hide flex flex-col items-center gap-0.5 scroll-smooth">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                    <button
                      type="button"
                      key={h}
                      data-h={h}
                      onClick={() => selectHour(h)}
                      className={`w-10 h-8 flex items-center justify-center rounded-xl text-sm font-black transition-all flex-shrink-0
                        ${selHour === h ? 'bg-red-500 text-white shadow-md shadow-red-500/30' : 'text-slate-500 hover:bg-white hover:text-slate-900'}`}
                    >
                      {pad(h)}
                    </button>
                  ))}
                </div>

                {/* Minute column */}
                <div ref={minRef} className="w-12 h-[200px] overflow-y-auto scrollbar-hide flex flex-col items-center gap-0.5 scroll-smooth">
                  {Array.from({ length: 60 }, (_, i) => i).map(m => (
                    <button
                      type="button"
                      key={m}
                      data-m={m}
                      onClick={() => selectMin(m)}
                      className={`w-10 h-8 flex items-center justify-center rounded-xl text-sm font-black transition-all flex-shrink-0
                        ${selMin === m ? 'bg-red-500 text-white shadow-md shadow-red-500/30' : 'text-slate-500 hover:bg-white hover:text-slate-900'}`}
                    >
                      {pad(m)}
                    </button>
                  ))}
                </div>

                {/* AM / PM column */}
                <div className="w-12 flex flex-col items-center gap-2 pt-1 pb-0">
                  {['AM', 'PM'].map(ap => (
                    <button
                      type="button"
                      key={ap}
                      onClick={() => selectAmPm(ap)}
                      className={`w-10 h-8 flex items-center justify-center rounded-xl text-xs font-black transition-all
                        ${selAmPm === ap ? 'bg-red-500 text-white shadow-md shadow-red-500/30' : 'text-slate-400 hover:bg-white hover:text-slate-900'}`}
                    >
                      {ap}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
