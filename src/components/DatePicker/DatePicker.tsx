import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { FaCalendarDays } from 'react-icons/fa6';
import { useTranslation } from '../../contexts/TranslationContext';
import './DatePicker.css';

export interface PwDatePickerProps {
  value: string; // ISO yyyy-mm-dd
  min?: string;
  max?: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  locale?: string; // e.g. 'tr-TR'
  weekStart?: 0 | 1; // 0=Sunday 1=Monday
  inline?: boolean;
  todayLabel?: string;
  clearLabel?: string;
  warn?: boolean;
}

const pad = (n: number) => n.toString().padStart(2,'0');

function isoFromYMD(y:number,m:number,d:number){return `${y}-${pad(m+1)}-${pad(d)}`;}
function clampDate(iso:string, min?:string, max?:string){ if(min && iso<min) return min; if(max && iso>max) return max; return iso; }

export const PwDatePicker: React.FC<PwDatePickerProps> = ({ value, min, max, onChange, disabled, locale='tr-TR', weekStart=1, inline=false, todayLabel='Bugün', clearLabel='Temizle', warn=false }) => {
  const { t } = useTranslation();
  const [open,setOpen]=useState(false);
  const today = useMemo(()=>{ const now = new Date(); return isoFromYMD(now.getFullYear(), now.getMonth(), now.getDate()); },[]);
  // Etkin min / max: props yoksa bugün ve +1 yıl
  const effectiveMin = useMemo(()=>{
    if (min) return min;
    return today; // geçmiş seçilemesin
  },[min,today]);
  const effectiveMax = useMemo(()=>{
    if (max) return max;
    const d = new Date(); d.setFullYear(d.getFullYear()+1); return isoFromYMD(d.getFullYear(), d.getMonth(), d.getDate());
  },[max]);
  const initial = value || today;
  const [viewYear,setViewYear]=useState(()=> parseInt(initial.slice(0,4),10));
  const [viewMonth,setViewMonth]=useState(()=> parseInt(initial.slice(5,7),10)-1);
  const wrapperRef = useRef<HTMLDivElement|null>(null);

  useEffect(()=>{ function handler(e:MouseEvent){ if(!wrapperRef.current) return; if(!wrapperRef.current.contains(e.target as Node)) setOpen(false); } document.addEventListener('mousedown',handler); return ()=> document.removeEventListener('mousedown',handler); },[]);

  useEffect(()=>{ if(open){ const btn = wrapperRef.current?.querySelector('.pw-calendar-pop button.sel') as HTMLButtonElement|null; btn?.focus(); } },[open]);

  const monthName = useMemo(()=> new Date(viewYear, viewMonth,1).toLocaleDateString(locale,{month:'long', year:'numeric'}),[viewYear,viewMonth,locale]);

  const weekdays = useMemo(()=>{
    const base = [] as string[]; for(let i=0;i<7;i++){ const d=new Date(2023,0, i + (weekStart===1?1:0)); base.push(d.toLocaleDateString(locale,{weekday:'short'})); } return base; },[locale,weekStart]);

  const daysMatrix = useMemo(()=>{
    const first = new Date(viewYear, viewMonth,1);
    const startDay = (first.getDay()+7-(weekStart===1?1:0))%7; // 0..6
    const daysInMonth = new Date(viewYear, viewMonth+1,0).getDate();
    const prevDays = new Date(viewYear, viewMonth,0).getDate();
    const cells: {day:number; inMonth:boolean; iso:string; disabled:boolean; today:boolean;}[] = [];
    for(let i=startDay-1;i>=0;i--){ const d=prevDays-i; const iso=isoFromYMD(viewYear, viewMonth-1, d); cells.push({day:d,inMonth:false, iso, disabled: !!(effectiveMin && iso<effectiveMin) || !!(effectiveMax && iso>effectiveMax), today: iso===today}); }
    for(let d=1; d<=daysInMonth; d++){ const iso=isoFromYMD(viewYear, viewMonth, d); cells.push({day:d,inMonth:true, iso, disabled: !!(effectiveMin && iso<effectiveMin) || !!(effectiveMax && iso>effectiveMax), today: iso===today}); }
    const nextFill = 42 - cells.length; for(let d=1; d<=nextFill; d++){ const iso=isoFromYMD(viewYear, viewMonth+1, d); cells.push({day:d,inMonth:false, iso, disabled: !!(effectiveMin && iso<effectiveMin) || !!(effectiveMax && iso>effectiveMax), today: iso===today}); }
    return cells;
  },[viewYear, viewMonth, effectiveMin, effectiveMax, today, weekStart]);

  function handleSelect(iso:string){ if(disabled) return; const clamped = clampDate(iso,effectiveMin,effectiveMax); onChange(clamped); setOpen(false); }
  function nav(delta:number){
    let y=viewYear; let m=viewMonth+delta;
    if(m<0){m=11;y--;} if(m>11){m=0;y++;}
    // Aylık aralık tamamen sınır dışıysa engelle
    const monthStart = isoFromYMD(y,m,1);
    const monthEnd = isoFromYMD(y,m, new Date(y,m+1,0).getDate());
    if (monthEnd < effectiveMin || monthStart > effectiveMax) return; // out of bounds
    setViewYear(y); setViewMonth(m);
  }

  function clear(){ onChange(''); }
  function setToday(){ const c = clampDate(today,effectiveMin,effectiveMax); onChange(c); setViewYear(parseInt(c.slice(0,4),10)); setViewMonth(parseInt(c.slice(5,7),10)-1); setOpen(false); }

  useEffect(()=>{ if(value){ const y=parseInt(value.slice(0,4),10); const m=parseInt(value.slice(5,7),10)-1; setViewYear(y); setViewMonth(m); } },[value]);

  // Prev/Next butonlarının etkinliği
  const canPrev = useMemo(()=>{
    const m=viewMonth-1 <0?11: viewMonth-1; const py = viewMonth-1<0? viewYear-1: viewYear;
    const monthEnd = isoFromYMD(py,m,new Date(py,m+1,0).getDate());
    return !(monthEnd < effectiveMin);
  },[viewYear,viewMonth,effectiveMin]);
  const canNext = useMemo(()=>{
    const m=viewMonth+1 >11?0: viewMonth+1; const ny = viewMonth+1>11? viewYear+1: viewYear;
    const monthStart = isoFromYMD(ny,m,1);
    return !(monthStart > effectiveMax);
  },[viewYear,viewMonth,effectiveMax]);

  return (
    <div className={`pw-date-picker${inline?' inline':''}${warn?' warn':''}`} ref={wrapperRef}>
      <button type="button" className={`pw-date-input-btn${value?' has-value':''}${warn?' warn':''}`} disabled={disabled} onClick={()=> !disabled && setOpen(o=>!o)} aria-haspopup="dialog" aria-expanded={open}>
        <span className="ic"><FaCalendarDays/></span>
        <span className="date-text">{value? value : t('app.date.select')}</span>
      </button>
      {warn && (
        <div className="pw-date-warn-msg" role="status" aria-live="polite">{t('app.results.noData')}</div>
      )}
      {open && !disabled && (
        <div className="pw-calendar-pop" role="dialog" aria-label={t('datePicker.dialogLabel')}>
          <div className="pw-cal-head">
            <button type="button" className="nav-btn" disabled={!canPrev} onClick={()=> nav(-1)} aria-label={t('datePicker.prevMonth')}><FaChevronLeft/></button>
            <div className="pw-cal-title">{monthName}</div>
            <button type="button" className="nav-btn" disabled={!canNext} onClick={()=> nav(1)} aria-label={t('datePicker.nextMonth')}><FaChevronRight/></button>
          </div>
          <div className="pw-cal-weekdays pw-cal-grid" aria-hidden="true">
            {weekdays.map((w,i)=>(<div key={i} className="pw-cal-weekday">{w}</div>))}
          </div>
          <div className="pw-cal-grid" role="grid" aria-label={monthName}>
            {daysMatrix.map((c,i)=>(
              <div key={i} className={`pw-cal-cell${!c.inMonth?' pw-cal-out':''}`}> 
                <button type="button" disabled={c.disabled} className={`${value===c.iso?'sel':''} ${c.today?'today':''}`} onClick={()=> handleSelect(c.iso)} aria-label={c.iso + (c.today? ' (Bugün)':'')}>
                  {c.day}
                </button>
              </div>
            ))}
          </div>
          <div className="pw-cal-footer">
            <button type="button" onClick={clear} className="danger" disabled={!value}>{clearLabel}</button>
            <div style={{display:'flex',gap:'.4rem'}}>
              <button type="button" onClick={setToday}>{todayLabel}</button>
              <button type="button" onClick={()=> setOpen(false)} aria-label={t('datePicker.close')}>{t('datePicker.close')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PwDatePicker;
