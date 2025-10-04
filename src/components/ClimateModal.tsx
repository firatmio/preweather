import { jsPDF } from 'jspdf';
import { useEffect, useRef, useState } from 'react';
import { FaFileImage, FaFilePdf } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';

interface ClimateModalProps {
  open: boolean;
  onClose: () => void;
  data: any[];
  metrics: string[];
  t: (k: string) => string;
}


// Her metrik için yıl-bazlı dizi çıkar, -999 değerli yılları filtrele
function extractMetricSeries(data: any[], metrics: string[]): Record<string, {year: number, value: number}[]> {
  const out: Record<string, {year: number, value: number}[]> = {};
  metrics.forEach(m => { out[m] = []; });
  data.forEach(dayObj => {
    metrics.forEach(m => {
      const metricObj = dayObj[m];
      if (metricObj && typeof metricObj === 'object') {
        Object.entries(metricObj).forEach(([dateStr, v]: [string, any]) => {
          if (typeof v === 'number' && !isNaN(v) && v !== -999) {
            // dateStr: YYYYMMDD, sadece yıl al
            const year = parseInt(dateStr.slice(0,4));
            out[m].push({ year, value: v });
          }
        });
      }
    });
  });
  // Yıllara göre sırala
  metrics.forEach(m => { out[m].sort((a,b)=>a.year-b.year); });
  return out;
}

// Canlı renk paleti - component dışında tanımla
const palette = [
  '#FF6B6B','#4ECDC4','#45B7D1','#FFA07A','#98D8C8','#F7DC6F','#BB8FCE','#85C1E2','#F8B500','#52B788',
  '#E63946','#06FFA5','#118AB2','#FF9F1C','#2A9D8F','#E76F51','#8338EC','#FF006E','#06D6A0','#FFBE0B'
];

// Hex rengi RGB'ye çevir
function hexToRgb(hex: string): {r: number, g: number, b: number} {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : {r: 255, g: 255, b: 255};
}

export const ClimateModal: React.FC<ClimateModalProps> = ({ open, onClose, data, metrics, t }) => {
  const [selected, setSelected] = useState<string[]>(metrics);
  const [tooltip, setTooltip] = useState<{x:number,y:number,text:string}|null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Her metrik için sabit renk ataması (metrics array sırasına göre)
  const metricColorMap = useRef<Map<string,string>>(new Map());
  useEffect(() => {
    metrics.forEach((m,i)=> {
      if(!metricColorMap.current.has(m)) metricColorMap.current.set(m, palette[i%palette.length]);
    });
  }, [metrics]);
  useEffect(() => {
    if (!open || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    // Boyutlar
    const W = 1100, H = 540, pad = 64;
    ctx.canvas.width = W;
    ctx.canvas.height = H;
    ctx.font = '18px sans-serif';
    ctx.fillStyle = '#222';
    ctx.fillRect(0,0,W,H);
    // Verileri hazırla
    const series = extractMetricSeries(data, selected);
    // Tüm yılları topla
    const allYears = Array.from(new Set(selected.flatMap(m => series[m].map(d=>d.year)))).sort((a,b)=>a-b);
    // Y ekseni aralığı: seçili metrikler için ortak
    const globalMin = Math.min(...selected.flatMap(mm=>series[mm].map(d=>d.value)));
    const globalMax = Math.max(...selected.flatMap(mm=>series[mm].map(d=>d.value)));
    // Eksenler
    ctx.strokeStyle = '#fff8';
    ctx.beginPath();
    ctx.moveTo(pad, pad);
    ctx.lineTo(pad, H-pad);
    ctx.lineTo(W-pad, H-pad);
    ctx.stroke();
    // Yıl etiketleri (X ekseni) - 45 derece açıyla, marginTop ekle
    allYears.forEach((year,i) => {
      const x = pad + (W-2*pad) * (i/(allYears.length-1||1));
      ctx.save();
      ctx.translate(x, H-pad+48);
      ctx.rotate(-Math.PI/4);
      ctx.fillStyle = '#fff';
      ctx.fillText(String(year), 0, 0);
      ctx.restore();
    });
    // Nokta bilgilerini tooltip için sakla
    const pointsData: {x:number,y:number,metric:string,year:number,value:number}[] = [];
    // Her metrik için çizgi ve noktalar (eşit aralıklı X ekseni)
    selected.forEach((m) => {
      const baseColor = metricColorMap.current.get(m) || palette[0];
      const arr = series[m];
      if (!arr.length) return;
      // Her yıl için eşit aralıklı X pozisyonu
      const spacing = (W - 2*pad) / (allYears.length > 1 ? allYears.length - 1 : 1);
      // Çizgi
      ctx.beginPath();
      arr.forEach((d, i) => {
        const yearIndex = allYears.indexOf(d.year);
        const x = pad + yearIndex * spacing;
        const y = H-pad - ((d.value-globalMin)/(globalMax-globalMin||1))*(H-2*pad);
        if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      });
      ctx.strokeStyle = baseColor;
      ctx.lineWidth = 2.8;
      ctx.stroke();
      // Noktalar - her noktaya renk tonlaması (gradient effect)
      arr.forEach((d) => {
        const yearIndex = allYears.indexOf(d.year);
        const x = pad + yearIndex * spacing;
        const y = H-pad - ((d.value-globalMin)/(globalMax-globalMin||1))*(H-2*pad);
        // Tooltip verisi kaydet
        pointsData.push({x,y,metric:m,year:d.year,value:d.value});
        // Değer bazlı renk tonlaması (düşük->koyu, yüksek->açık)
        const intensity = (d.value - globalMin) / (globalMax - globalMin || 1);
        const rgb = hexToRgb(baseColor);
        const toned = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.6 + intensity * 0.4})`;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2*Math.PI);
        ctx.fillStyle = toned;
        ctx.fill();
        ctx.strokeStyle = baseColor;
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    });
    // Y ekseni - 10 nokta (9 eşit aralık) - en küçükten en büyüğe
    ctx.fillStyle = '#fff8';
    ctx.font = '15px sans-serif';
    const numPoints = 10;
    for (let i = 0; i < numPoints; i++) {
      const value = globalMin + (globalMax - globalMin) * (i / (numPoints - 1));
      const yPos = H - pad - ((value - globalMin) / (globalMax - globalMin || 1)) * (H - 2 * pad);
      ctx.fillText(value.toFixed(2), pad - 48, yPos + 4);
    }
    // Mouse move handler - tooltip
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const scaleX = W / rect.width;
      const scaleY = H / rect.height;
      const mouseX = (e.clientX - rect.left) * scaleX;
      const mouseY = (e.clientY - rect.top) * scaleY;
      // En yakın nokta bul (10px threshold)
      type PointData = {x:number,y:number,metric:string,year:number,value:number};
      let nearest: PointData | null = null;
      let minDist = 12;
      pointsData.forEach(p => {
        const dist = Math.sqrt((p.x-mouseX)**2 + (p.y-mouseY)**2);
        if (dist < minDist) { minDist = dist; nearest = p as PointData; }
      });
      if (nearest) {
        const pt = nearest as PointData;
        const metricLabel = t('metric.'+pt.metric);
        const valueStr = pt.value.toFixed(2);
        const yearStr = pt.year;
          setTooltip({ x: e.clientX, y: e.clientY, text: `${metricLabel.replace(/\s*\([^)]*\)\s*$/, '').trim() }: ${valueStr} (${yearStr})`});
      } else {
        setTooltip(null);
      }
    };
    const handleMouseLeave = () => setTooltip(null);
    const canvas = canvasRef.current;
    canvas?.addEventListener('mousemove', handleMouseMove);
    canvas?.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      canvas?.removeEventListener('mousemove', handleMouseMove);
      canvas?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [open, data, metrics, t, selected]);

  const handleDownloadPNG = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `climate-chart-${new Date().toISOString().split('T')[0]}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const handleDownloadPDF = () => {
    if (!canvasRef.current) return;
    const imgData = canvasRef.current.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [1100, 540]
    });
    pdf.addImage(imgData, 'PNG', 0, 0, 1100, 540);
    pdf.save(`climate-chart-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (!open) return null;
  return (
    <div className="climate-modal-overlay" onClick={onClose}>
      <div className="climate-modal" onClick={e=>e.stopPropagation()}>
        <button className="climate-modal-close" onClick={onClose}><IoClose /></button>
        <h2>{t('app.climateInfo')}</h2>
        <div style={{display:'flex', flexDirection:'row', gap:32, alignItems:'flex-start', justifyContent:'center'}}>
          <div style={{flex:1, minWidth:0}}>
            <canvas ref={canvasRef} width={1100} height={540} style={{width: '100%', maxWidth: '90vw', background: '#222', borderRadius: 16, boxShadow:'0 2px 16px #0006'}} />
          </div>
          <div style={{minWidth:220, maxWidth:320, color:'#fff', fontSize:15, marginTop:8}}>
            <div style={{fontWeight:600, marginBottom:8}}>{t('app.climate.selectData')}</div>
            <div style={{display:'flex', flexDirection:'column', gap:6}}>
              {metrics.map((m)=>(
                <label key={m} style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer'}}>
                  <input type="checkbox" checked={selected.includes(m)} onChange={e=>{
                    setSelected(sel=>e.target.checked ? [...sel,m] : sel.filter(x=>x!==m))
                  }} />
                  <span style={{width:18, height:10, background:metricColorMap.current.get(m)||'#fff', borderRadius:4, display:'inline-block'}} />
                      <span>{t('metric.' + m).replace(/\s*\([^)]*\)\s*$/, '').trim()}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div style={{display:'flex', position: 'absolute', right: '1rem', bottom: '1rem', gap:12, marginTop:18}}>
          <button onClick={handleDownloadPNG} style={{
            display:'flex', alignItems:'center', gap:8, background:'#1976d2', color:'#fff',
            border:'none', borderRadius:12, padding:'10px 18px', fontSize:15, fontWeight:500,
            cursor:'pointer', transition:'background 0.2s', boxShadow:'0 2px 8px #0004'
          }}>
            <FaFileImage /> PNG
          </button>
          <button onClick={handleDownloadPDF} style={{
            display:'flex', alignItems:'center', gap:8, background:'#d32f2f', color:'#fff',
            border:'none', borderRadius:12, padding:'10px 18px', fontSize:15, fontWeight:500,
            cursor:'pointer', transition:'background 0.2s', boxShadow:'0 2px 8px #0004'
          }}>
            <FaFilePdf /> PDF
          </button>
        </div>
      </div>
      {tooltip && (
        <div style={{
          position:'fixed', left:tooltip.x+12, top:tooltip.y+12, background:'#23242aee', color:'#fff',
          padding:'8px 14px', borderRadius:8, fontSize:14, pointerEvents:'none', zIndex:999999,
          boxShadow:'0 2px 12px #0008', whiteSpace:'nowrap'
        }}>
          {tooltip.text}
        </div>
      )}
    </div>
  );
};
