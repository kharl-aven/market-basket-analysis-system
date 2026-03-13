import { UploadCloud, RefreshCw, Bell, X, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface Alert { id:string; level:"warn"|"ok"|"info"; title:string; body:string; emoji:string; }

interface HeaderProps {
  hasDataset: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  iteration: number;
  activeDataset: string;
  onDatasetChange: (d:string)=>void;
  datasets: string[];
  drift?: { drift_detected:boolean; drift_score:number };
  totalTransactions?: number;
  pairedTransactions?: number;
  rulesCount?: number;
}

export function Header({ hasDataset, onUpload, drift, totalTransactions=0, pairedTransactions=0, rulesCount=0 }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const pct = totalTransactions > 0 ? Math.round((pairedTransactions/totalTransactions)*100) : 0;

  /* Build contextual alerts */
  const allAlerts: Alert[] = [
    ...(drift?.drift_detected ? [{
      id:"drift", level:"warn" as const, emoji:"📉",
      title:"Customer ordering habits have shifted",
      body:`A ${(drift.drift_score*100).toFixed(0)}% change was detected versus previous data. Your insights may need refreshing — upload this month's data for accurate patterns.`,
    }] : []),
    ...(hasDataset && pct < 55 ? [{
      id:"low-cov", level:"warn" as const, emoji:"⚠️",
      title:`Only ${pct}% of orders contributed to analysis`,
      body:"Many orders had a single item or contained unrecognised item names. Check My Data → Format Guide to improve coverage.",
    }] : []),
    ...(hasDataset && rulesCount === 0 ? [{
      id:"no-rules", level:"warn" as const, emoji:"🔍",
      title:"No item pairings found yet",
      body:"Your data was processed but no strong patterns emerged. Try uploading more orders — at least 500 multi-item orders are needed for reliable rules.",
    }] : []),
    ...(hasDataset && pct >= 55 && rulesCount > 0 && !drift?.drift_detected ? [{
      id:"healthy", level:"ok" as const, emoji:"✅",
      title:`System healthy — ${rulesCount} pairing${rulesCount!==1?"s":""} discovered`,
      body:`${pct}% of your orders were valid for analysis. Insights are based on ${pairedTransactions.toLocaleString()} multi-item transactions.`,
    }] : []),
  ];

  const visible = allAlerts.filter(a => !dismissed.has(a.id));
  const warnCount = visible.filter(a=>a.level==="warn").length;

  return (
    <div className="flex-shrink-0 z-30">
      {/* ── Main bar ──────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-[var(--border)] h-14 px-5 flex items-center gap-4 shadow-sm">

        {/* Brand */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none">
            <circle cx="16" cy="16" r="15" fill="white" stroke="#cc2222" strokeWidth="1.5"/>
            <path d="M1 16 A15 15 0 0 1 31 16 Z" fill="#cc2222"/>
            <rect x="0" y="14" width="32" height="4" fill="#1a0a0a"/>
            <circle cx="16" cy="16" r="4.5" fill="white" stroke="#1a0a0a" strokeWidth="1.5"/>
            <circle cx="16" cy="16" r="2" fill="#f5f5f5"/>
          </svg>
          <div className="hidden sm:block">
            <p className="text-sm font-black text-[var(--foreground)] leading-none">Pokémon Café</p>
            <p className="text-[10px] text-[var(--muted-foreground)] font-bold">Café Admin</p>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1"/>

        {/* Alert bell — only when data loaded */}
        {hasDataset && visible.length > 0 && (
          <button onClick={()=>setOpen(!open)}
            className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-black transition-all ${
              warnCount>0
                ? "bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100"
                : "bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100"
            }`}>
            <Bell className="w-3.5 h-3.5"/>
            {warnCount>0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[var(--pokered)] text-white text-[9px] font-black rounded-full flex items-center justify-center">
                {warnCount}
              </span>
            )}
            <span className="hidden sm:inline">{warnCount>0 ? `${warnCount} alert${warnCount>1?"s":""}` : "All good"}</span>
            {open ? <ChevronUp className="w-3.5 h-3.5"/> : <ChevronDown className="w-3.5 h-3.5"/>}
          </button>
        )}

        {/* Upload btn */}
        <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-[var(--pokered)] text-white rounded-xl font-black text-xs shadow-md hover:bg-[var(--pokered-dark)] transition-all flex-shrink-0 active:scale-95">
          {hasDataset ? <><RefreshCw className="w-3.5 h-3.5"/>Add Data</> : <><UploadCloud className="w-3.5 h-3.5"/>Upload POS</>}
          <input type="file" accept=".csv,.xlsx,.xls,.tsv,.txt,.json" className="hidden" onChange={onUpload}/>
        </label>
      </header>

      {/* ── Alert tray ────────────────────────────────────────────────── */}
      {open && visible.length > 0 && (
        <div className="bg-white border-b border-[var(--border)] shadow-lg animate-pokefade">
          <div className="px-5 py-3 space-y-2 max-w-[1400px] mx-auto">
            {visible.map(a=>(
              <div key={a.id} className={`flex items-start gap-3 px-4 py-3 rounded-xl border animate-slideIn ${
                a.level==="warn" ? "bg-amber-50 border-amber-200"
                : a.level==="ok"  ? "bg-emerald-50 border-emerald-200"
                : "bg-blue-50 border-blue-200"
              }`}>
                <span className="text-base flex-shrink-0">{a.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-black ${a.level==="warn"?"text-amber-800":a.level==="ok"?"text-emerald-800":"text-blue-800"}`}>{a.title}</p>
                  <p className="text-xs text-[var(--muted-foreground)] mt-0.5 leading-relaxed">{a.body}</p>
                </div>
                <button onClick={()=>setDismissed(p=>new Set([...p,a.id]))} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] flex-shrink-0 p-0.5 mt-0.5">
                  <X className="w-3.5 h-3.5"/>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
