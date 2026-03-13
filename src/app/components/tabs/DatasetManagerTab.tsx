import { useState } from "react";
import { UploadCloud, Trash2, FileText, AlertCircle, CheckCircle2, Clock, Plus, ChevronDown, ChevronUp, Info, HelpCircle, Download } from "lucide-react";

interface DatasetEntry {
  id:string; name:string; originalName:string;
  uploadedAt:Date; rowCount:number; pairedRowCount:number;
  rulesGenerated:number; status:"active"|"processing"|"error"; iteration:number;
}

function timeAgo(d:Date){
  const s=Math.floor((Date.now()-d.getTime())/1000);
  if(s<60) return "just now";
  if(s<3600) return `${Math.floor(s/60)}m ago`;
  if(s<86400) return `${Math.floor(s/3600)}h ago`;
  return d.toLocaleDateString("en-PH");
}

/* ── Format guide accordion ─────────────────────────────────────────────── */
function FormatGuide(){
  const [open,setOpen]=useState(false);
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
      <button onClick={()=>setOpen(!open)} className="w-full flex items-center gap-3 px-5 py-4 hover:bg-[var(--secondary)]/30 transition-colors text-left">
        <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
          <Info className="w-4 h-4 text-blue-600"/>
        </div>
        <div className="flex-1">
          <p className="font-black text-sm text-[var(--foreground)]">POS Export Format Guide</p>
          <p className="text-xs text-[var(--muted-foreground)]">What your CSV needs to look like for analysis to work</p>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-[var(--muted-foreground)]"/> : <ChevronDown className="w-4 h-4 text-[var(--muted-foreground)]"/>}
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-[var(--border)] animate-pokefade">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
            <div>
              <h4 className="font-black text-xs uppercase tracking-wider text-[var(--muted-foreground)] mb-3">Required columns</h4>
              <div className="space-y-2">
                {[
                  {col:"Items Ordered", req:true,  desc:"Comma-separated items per transaction — the only column required"},
                  {col:"Items",         req:false, desc:"Accepted as an alternative to 'Items Ordered'"},
                  {col:"Transaction ID",req:false, desc:"POS reference number"},
                  {col:"Date",          req:false, desc:"YYYY-MM-DD recommended"},
                  {col:"Time",          req:false, desc:"HH:MM:SS"},
                  {col:"Total (PHP)",   req:false, desc:"Order total — not used in analysis"},
                  {col:"Payment Method",req:false, desc:"Cash, GCash, Maya, etc."},
                  {col:"Staff ID",      req:false, desc:"Staff reference"},
                  {col:"Table/Area",    req:false, desc:"Seat or area"},
                ].map(r=>(
                  <div key={r.col} className="flex items-start gap-2 text-xs">
                    <span className={`flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] font-black ${r.req?"bg-[var(--pokered)] text-white":"bg-[var(--secondary)] text-[var(--muted-foreground)]"}`}>
                      {r.req?"Required":"Optional"}
                    </span>
                    <code className="font-black text-[var(--pokered)]">{r.col}</code>
                    <span className="text-[var(--muted-foreground)] leading-relaxed">{r.desc}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-black text-xs uppercase tracking-wider text-[var(--muted-foreground)] mb-3">Example rows</h4>
              <div className="bg-[var(--secondary)] rounded-xl p-3 border border-[var(--border)] overflow-x-auto text-xs font-mono mb-3">
                <p className="text-[var(--muted-foreground)] font-black">Transaction ID,Date,Items Ordered</p>
                <p className="text-[var(--foreground)] mt-1">TXN-00001,2024-01-05,<span className="text-[var(--pokered)] font-black">The Pikachu Hamburger, Pokemon Latte</span></p>
                <p className="text-[var(--foreground)]">TXN-00002,2024-01-05,<span className="text-[var(--pokered)] font-black">Paldean Form Wooper Burger, Cocoa</span></p>
                <p className="text-[var(--muted-foreground)]">TXN-00003,2024-01-05,<span className="italic">Clodsire Soup Pot</span></p>
              </div>
              <div className="space-y-1.5">
                {[
                  "Item names must match the menu exactly (case-sensitive)",
                  "One row = one customer transaction",
                  "Items separated by commas within the same row",
                  "Single-item orders are fine — they just won't appear in pairings",
                ].map((t,i)=>(
                  <p key={i} className="text-xs text-[var(--muted-foreground)] flex gap-2">
                    <span className="text-[var(--success-green)] font-black flex-shrink-0">✓</span>{t}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Data quality accordion ──────────────────────────────────────────────── */
function DataQualityPanel({datasetLog,totalTransactions}:{datasetLog:DatasetEntry[];totalTransactions:number}){
  const [open,setOpen]=useState(false);
  if(totalTransactions===0) return null;
  const paired = datasetLog.reduce((s,d)=>s+(d.pairedRowCount||0),0);
  const pct    = Math.round((paired/totalTransactions)*100);
  const single = totalTransactions-paired;

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
      <button onClick={()=>setOpen(!open)} className="w-full flex items-center gap-3 px-5 py-4 hover:bg-[var(--secondary)]/30 transition-colors text-left">
        <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
          <HelpCircle className="w-4 h-4 text-amber-600"/>
        </div>
        <div className="flex-1">
          <p className="font-black text-sm text-[var(--foreground)]">Why was only {pct}% of data used?</p>
          <p className="text-xs text-[var(--muted-foreground)]">{paired.toLocaleString()} of {totalTransactions.toLocaleString()} orders contributed to pairings</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
          <div className="w-20 h-2 bg-[var(--border)] rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${pct>=70?"bg-[var(--success-green)]":pct>=50?"bg-amber-400":"bg-red-400"}`} style={{width:`${pct}%`}}/>
          </div>
          <span className="text-xs font-black">{pct}%</span>
        </div>
        {open?<ChevronUp className="w-4 h-4 text-[var(--muted-foreground)]"/>:<ChevronDown className="w-4 h-4 text-[var(--muted-foreground)]"/>}
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-[var(--border)] animate-pokefade">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {[
              {icon:"1️⃣",color:"border-amber-400",title:"Single-item orders skipped",body:`${single.toLocaleString()} orders contained only one item — nothing to pair. This is normal.`},
              {icon:"📉",color:"border-blue-400",title:"Rare pairs filtered out",body:"Combinations that only appeared once or twice are removed — they're likely coincidences, not patterns."},
              {icon:"✏️",color:"border-purple-400",title:"Unrecognised item names",body:"Items spelled differently from the official menu (e.g. 'Pikachu Burger' vs 'The Pikachu Hamburger') are excluded."},
              {icon:"🔢",color:"border-gray-400",title:"Duplicate items collapsed",body:"If the same item appears twice in one order, it counts once. Quantities are not tracked — only which items appeared together."},
            ].map((r,i)=>(
              <div key={i} className={`border-l-4 ${r.color} pl-3 py-1`}>
                <p className="text-xs font-black text-[var(--foreground)] mb-1 flex items-center gap-2"><span>{r.icon}</span>{r.title}</p>
                <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">{r.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-[var(--secondary)] rounded-xl border border-[var(--border)]">
            <p className="text-xs text-[var(--muted-foreground)]">
              💡 <strong>To improve coverage:</strong> Make sure POS item names match the menu exactly. Upload more months of data. Aim for 500+ multi-item orders for strong patterns.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Download samples card ───────────────────────────────────────────────── */
export function DatasetManagerTab({datasets, datasetLog, onUpload, onDelete, isUploading, totalTransactions, totalRules}:{
  datasets:string[]; datasetLog:DatasetEntry[]; onUpload:(e:any)=>void;
  onDelete:(id:string)=>void; isUploading:boolean; totalTransactions:number; totalRules:number;
}){
  const [confirmDelete,setConfirmDelete]=useState<string|null>(null);
  const totalPaired = datasetLog.reduce((s,d)=>s+(d.pairedRowCount||0),0);
  const pairPct     = totalTransactions>0 ? Math.round((totalPaired/totalTransactions)*100) : 0;

  const handleDelete=(id:string)=>{
    if(confirmDelete===id){onDelete(id);setConfirmDelete(null);}
    else{setConfirmDelete(id);setTimeout(()=>setConfirmDelete(null),3000);}
  };

  return (
    <div className="space-y-5 animate-pokefade">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-black text-[var(--foreground)]">My Data</h2>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">POS export files · format guide · data quality</p>
        </div>
        <label className="cursor-pointer flex items-center gap-2 px-4 py-2.5 bg-[var(--pokered)] text-white rounded-xl font-black text-sm shadow hover:bg-[var(--pokered-dark)] transition-all">
          <Plus className="w-4 h-4"/> Upload CSV
          <input type="file" accept=".csv,.xlsx,.xls,.tsv,.txt,.json" className="hidden" onChange={onUpload}/>
        </label>
      </div>

      {/* Stats row — only when data exists */}
      {totalTransactions>0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {val:totalTransactions.toLocaleString(), label:"Total Orders",    bg:"from-red-500 to-red-600"},
            {val:`${totalPaired.toLocaleString()} (${pairPct}%)`, label:"Orders Analysed", bg:"from-blue-500 to-blue-600"},
            {val:totalRules,                          label:"Pairings Found",  bg:"from-green-500 to-green-600"},
            {val:datasetLog.length,                   label:"Files Uploaded",  bg:"from-amber-500 to-amber-600"},
          ].map(s=>(
            <div key={s.label} className={`rounded-2xl bg-gradient-to-br ${s.bg} p-4 text-white shadow`}>
              <p className="text-2xl font-black tabular-nums leading-none">{s.val}</p>
              <p className="text-[11px] text-white/70 font-bold mt-1.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Format guide */}
      {/* Format pills */}
      <div className="flex gap-2 flex-wrap">
        {[".csv",".xlsx",".xls",".tsv",".json",".txt"].map(fmt=>(
          <span key={fmt} className="px-2.5 py-1 bg-[var(--card)] border border-[var(--border)] rounded-lg text-[11px] font-black text-[var(--muted-foreground)]">{fmt}</span>
        ))}
        <span className="px-2.5 py-1 bg-[var(--pokered)]/10 border border-[var(--pokered)]/20 rounded-lg text-[11px] font-black text-[var(--pokered)]">All POS formats accepted</span>
      </div>
      <FormatGuide/>

      {/* Quality panel */}
      <DataQualityPanel datasetLog={datasetLog} totalTransactions={totalTransactions}/>

      {/* Upload history */}
      {datasetLog.length===0 ? (
        <div className="border-2 border-dashed border-[var(--border)] rounded-2xl p-14 text-center bg-[var(--card)]">
          <UploadCloud className="w-10 h-10 text-[var(--muted-foreground)] opacity-25 mx-auto mb-3"/>
          <p className="font-black text-[var(--foreground)] mb-1">No files uploaded yet</p>
          <p className="text-xs text-[var(--muted-foreground)] mb-5">Upload a POS export CSV to start discovering item pairings</p>
          <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--pokered)] text-white rounded-xl font-black text-sm shadow hover:bg-[var(--pokered-dark)] transition-all">
            <UploadCloud className="w-4 h-4"/> Upload POS Export
            <input type="file" accept=".csv,.xlsx,.xls,.tsv,.txt,.json" className="hidden" onChange={onUpload}/>
          </label>
        </div>
      ) : (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-3.5 border-b border-[var(--border)] flex items-center gap-2 bg-[var(--secondary)]/40">
            <FileText className="w-4 h-4 text-[var(--cafe-wood)]"/>
            <h3 className="font-black text-sm">Upload History</h3>
            <span className="badge-poke bg-[var(--secondary)] border border-[var(--border)] text-[var(--muted-foreground)] ml-1">{datasetLog.length} file{datasetLog.length!==1?"s":""}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--secondary)]/20">
                  {["File","Uploaded","Total Orders","Analysed","Pairings","Status",""].map(h=>(
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-wider first:pl-5 last:pr-5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {datasetLog.map((e,i)=>{
                  const p = e.rowCount>0 ? Math.round(((e.pairedRowCount||0)/e.rowCount)*100) : 0;
                  return (
                    <tr key={e.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--secondary)]/25 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-[var(--secondary)] border border-[var(--border)] flex items-center justify-center text-xs font-black text-[var(--cafe-wood)] flex-shrink-0">
                            {String.fromCharCode(65+i)}
                          </div>
                          <p className="text-xs font-bold truncate max-w-[140px]" title={e.originalName}>{e.originalName}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1 text-xs text-[var(--muted-foreground)] whitespace-nowrap"><Clock className="w-3 h-3"/>{timeAgo(e.uploadedAt)}</div>
                      </td>
                      <td className="px-4 py-3.5 font-black text-sm tabular-nums">{e.rowCount.toLocaleString()}</td>
                      <td className="px-4 py-3.5">
                        <span className="font-black text-sm tabular-nums">{(e.pairedRowCount||0).toLocaleString()}</span>
                        <span className="text-xs text-[var(--muted-foreground)] ml-1">({p}%)</span>
                      </td>
                      <td className="px-4 py-3.5 font-black text-sm tabular-nums">{e.rulesGenerated}</td>
                      <td className="px-4 py-3.5">
                        {e.status==="active"     && <span className="flex items-center gap-1 text-xs font-bold text-[var(--success-green)]"><CheckCircle2 className="w-3.5 h-3.5"/>Ready</span>}
                        {e.status==="processing" && <span className="flex items-center gap-1 text-xs font-bold text-amber-600"><span className="animate-spin">⚙️</span>Processing</span>}
                        {e.status==="error"      && <span className="flex items-center gap-1 text-xs font-bold text-[var(--destructive)]"><AlertCircle className="w-3.5 h-3.5"/>Error</span>}
                      </td>
                      <td className="pr-5 py-3.5">
                        <button onClick={()=>handleDelete(e.id)}
                          className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg transition-all ${
                            confirmDelete===e.id ? "bg-[var(--destructive)] text-white animate-pulse" : "text-[var(--muted-foreground)] hover:text-[var(--destructive)] hover:bg-red-50 border border-transparent hover:border-red-200"
                          }`}>
                          <Trash2 className="w-3.5 h-3.5"/>
                          {confirmDelete===e.id?"Confirm?":"Remove"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {isUploading && (
            <div className="px-5 py-3 border-t border-[var(--border)] bg-amber-50 flex items-center gap-3">
              <div className="flex gap-1">{[0,1,2].map(i=><div key={i} className="w-2 h-2 rounded-full bg-[var(--pokered)] animate-bounce" style={{animationDelay:`${i*0.15}s`}}/>)}</div>
              <p className="text-xs font-bold text-amber-700">Processing file — this may take a moment…</p>
            </div>
          )}
        </div>
      )}

      {/* Sample download card */}
    </div>
  );
}
