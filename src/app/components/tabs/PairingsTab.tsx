import { useState, useEffect } from "react";
import { Search, Download, Filter, X, Info, UploadCloud } from "lucide-react";

interface FPRule {
  id:string;
  antecedent:{name:string; image:string};
  consequent:{name:string; image:string};
  support:string; confidence:string; lift:number;
  trend:"up"|"down";
}

function strengthInfo(lift:number){
  if(lift>=2.5) return {label:"🔥 Best Opportunity",cls:"bg-green-50 text-green-700 border-green-200",bar:"bg-green-500",pct:100,explain:`${((lift-1)*100).toFixed(0)}% more likely than coincidence`};
  if(lift>=1.8) return {label:"✅ Good Opportunity",cls:"bg-blue-50 text-blue-700 border-blue-200",bar:"bg-blue-500",pct:72,explain:`${((lift-1)*100).toFixed(0)}% more likely than coincidence`};
  return             {label:"👀 Worth Watching",cls:"bg-gray-50 text-gray-600 border-gray-200",bar:"bg-gray-400",pct:42,explain:"Mild pattern — observe over more data"};
}

const PokeBall = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
    <circle cx="12" cy="12" r="11" fill="white" stroke="#cc2222" strokeWidth="1.5"/>
    <path d="M1 12 A11 11 0 0 1 23 12 Z" fill="#cc2222"/>
    <rect x="0" y="11" width="24" height="2.5" fill="#1a0a0a"/>
    <circle cx="12" cy="12" r="3.5" fill="white" stroke="#1a0a0a" strokeWidth="1.5"/>
  </svg>
);

export function PairingsTab({dynamicRules, hasData}:{dynamicRules?:FPRule[]; hasData:boolean}){
  const [search, setSearch]     = useState("");
  const [showFilter,setShowFilter] = useState(false);
  const [minConf,setMinConf]    = useState(0);
  const [onlyBest,setOnlyBest]  = useState(false);
  const [fetched,setFetched]    = useState<FPRule[]>([]);
  const [showLegend,setShowLegend] = useState(false);

  useEffect(()=>{
    if(hasData){
      fetch("/api/rules").then(r=>r.json()).then(d=>{ if(d.rules?.length) setFetched(d.rules); }).catch(()=>{});
    }
  },[dynamicRules,hasData]);

  const base     = fetched.length ? fetched : (dynamicRules??[]);
  const filtered = base.filter(r=>{
    const ms = !search || r.antecedent.name.toLowerCase().includes(search.toLowerCase()) || r.consequent.name.toLowerCase().includes(search.toLowerCase());
    const mc = parseFloat(r.confidence) >= minConf;
    const mb = !onlyBest || r.lift >= 1.8;
    return ms && mc && mb;
  });

  const handleExport=()=>{
    if(!base.length) return;
    const rows=[
      ["Item A","Item B","How often together (%)","How reliably linked (%)","Lift (x times more likely)","Opportunity"],
      ...filtered.map(r=>[`"${r.antecedent.name}"`,`"${r.consequent.name}"`,`${(parseFloat(r.support)*100).toFixed(1)}%`,`${(parseFloat(r.confidence)*100).toFixed(0)}%`,`${r.lift.toFixed(2)}x`,strengthInfo(r.lift).label])
    ];
    const csv=rows.map(r=>r.join(",")).join("\n");
    const a=document.createElement("a");
    a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));
    a.download="pokemon_cafe_pairings.csv";
    a.click();
  };

  if(!hasData){
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <div className="w-16 h-16 mx-auto mb-4"><PokeBall/></div>
        <h2 className="text-xl font-black text-[var(--foreground)] mb-2">Item Pairings</h2>
        <p className="text-sm text-[var(--muted-foreground)] max-w-sm mb-6">Upload your sales data to discover which items your customers order together most reliably.</p>
        <label className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-[var(--pokered)] text-white rounded-xl font-black text-sm shadow-lg hover:bg-[var(--pokered-dark)] transition-all">
          <UploadCloud className="w-5 h-5"/> Upload Sales CSV
          <input type="file" accept=".csv" className="hidden"/>
        </label>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-pokefade">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-black text-[var(--foreground)]">Item Pairings</h2>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{base.length} pairing{base.length!==1?"s":""} discovered from your sales data</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={()=>setShowLegend(!showLegend)} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-black transition-all ${showLegend?"bg-[var(--pokered)] text-white border-[var(--pokered)]":"bg-[var(--card)] border-[var(--border)] hover:border-[var(--pokered)]"}`}>
            <Info className="w-3.5 h-3.5"/> What do these mean?
          </button>
          <button onClick={()=>setShowFilter(!showFilter)} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-black transition-all ${showFilter?"bg-[var(--secondary)] border-[var(--border)]":"bg-[var(--card)] border-[var(--border)]"}`}>
            <Filter className="w-3.5 h-3.5"/> Filter
          </button>
          <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-2 bg-[var(--cafe-wood)] text-white rounded-xl text-xs font-black hover:opacity-90 transition-opacity">
            <Download className="w-3.5 h-3.5"/> Export CSV
          </button>
        </div>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 shadow-sm animate-pokefade">
          <h4 className="font-black text-sm mb-4">📖 How to read this table</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {color:"border-l-blue-400",  title:"How reliably linked",    body:"Out of every 10 customers who ordered Item A, how many also ordered Item B. 80% = 8 out of 10."},
              {color:"border-l-green-400", title:"How often together",     body:"What share of all your orders included both items. 15% = roughly 1 in 7 orders."},
              {color:"border-l-amber-400", title:"Opportunity rating",     body:"How much more likely these items are bought together vs. randomly. 2× = twice as likely as coincidence."},
            ].map((c,i)=>(
              <div key={i} className={`border-l-4 ${c.color} pl-3`}>
                <p className="font-black text-xs mb-1.5">{c.title}</p>
                <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search + filter bar */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 shadow-sm flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]"/>
          <input type="text" placeholder="Search item name…" value={search} onChange={e=>setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-xs focus:outline-none focus:border-[var(--pokered)]"/>
        </div>
        {showFilter && (
          <>
            <div className="flex items-center gap-2">
              <label className="text-xs font-black text-[var(--muted-foreground)] whitespace-nowrap">Min reliability:</label>
              <input type="number" step="0.05" min="0" max="1" value={minConf} onChange={e=>setMinConf(parseFloat(e.target.value)||0)}
                className="w-20 px-2 py-2 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-xs focus:outline-none focus:border-[var(--pokered)]"/>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={onlyBest} onChange={e=>setOnlyBest(e.target.checked)} className="w-3.5 h-3.5 accent-[var(--pokered)]"/>
              <span className="text-xs font-bold">Good & best only</span>
            </label>
            <button onClick={()=>{setMinConf(0);setOnlyBest(false);setSearch("");}} className="flex items-center gap-1 px-2.5 py-2 border border-[var(--border)] rounded-xl text-xs font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
              <X className="w-3 h-3"/> Reset
            </button>
          </>
        )}
        <span className="text-xs font-bold text-[var(--muted-foreground)] ml-auto">{filtered.length} of {base.length}</span>
      </div>

      {/* Table */}
      {filtered.length===0 ? (
        <div className="text-center py-16 bg-[var(--card)] border border-[var(--border)] rounded-2xl">
          <span className="text-4xl block mb-3">🔍</span>
          <p className="font-black">{base.length===0?"No pairings found yet":"No results match your filters"}</p>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">{base.length===0?"Upload more data to discover pairings.":"Try adjusting your search or filters."}</p>
        </div>
      ) : (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto max-h-[560px] overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 z-10 bg-white border-b-2 border-[var(--border)]">
                <tr>
                  <th className="text-left py-3 pl-5 pr-4 text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-wider w-[40%]">Pairing</th>
                  <th className="text-center py-3 px-4 text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-wider">
                    Reliably Linked<span className="block text-[8px] normal-case tracking-normal font-semibold mt-0.5">when A ordered → B also</span>
                  </th>
                  <th className="text-center py-3 px-4 text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-wider">
                    Together<span className="block text-[8px] normal-case tracking-normal font-semibold mt-0.5">% of all orders</span>
                  </th>
                  <th className="text-center py-3 px-4 text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-wider">Opportunity</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((rule,i)=>{
                  const conf=parseFloat(rule.confidence);
                  const sup =parseFloat(rule.support);
                  const info=strengthInfo(rule.lift);
                  return (
                    <tr key={rule.id||i} className="border-b border-[var(--border)] hover:bg-[var(--secondary)]/30 transition-colors">
                      {/* Pairing cell */}
                      <td className="py-3 pl-5 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5 bg-[var(--input-background)] px-2.5 py-1.5 rounded-xl border border-[var(--border)]">
                            <img src={rule.antecedent.image} alt="" className="w-6 h-6 object-contain"/>
                            <span className="text-xs font-semibold truncate max-w-[90px]">{rule.antecedent.name.split(",")[0].trim()}</span>
                          </div>
                          <span className="text-[var(--muted-foreground)] font-black text-sm leading-none">+</span>
                          <div className="flex items-center gap-1.5 bg-[var(--secondary)] px-2.5 py-1.5 rounded-xl border border-[var(--border)]">
                            <img src={rule.consequent.image} alt="" className="w-6 h-6 object-contain"/>
                            <span className="text-xs font-semibold truncate max-w-[90px]">{rule.consequent.name.split(",")[0].trim()}</span>
                          </div>
                        </div>
                      </td>
                      {/* Confidence */}
                      <td className="py-3 px-4 text-center">
                        <p className="text-base font-black tabular-nums">{(conf*100).toFixed(0)}%</p>
                        <p className="text-[10px] text-[var(--muted-foreground)]">{conf>=0.7?"Very reliable":conf>=0.5?"Fairly reliable":"Mild pattern"}</p>
                      </td>
                      {/* Support */}
                      <td className="py-3 px-4 text-center">
                        <p className="text-base font-black tabular-nums">{(sup*100).toFixed(1)}%</p>
                        <p className="text-[10px] text-[var(--muted-foreground)]">of orders</p>
                      </td>
                      {/* Opportunity */}
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex flex-col items-center gap-1">
                          <span className={`badge-poke border ${info.cls}`}>{info.label}</span>
                          <div className="w-16 h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                            <div className={`h-full ${info.bar} rounded-full`} style={{width:`${info.pct}%`}}/>
                          </div>
                          <p className="text-[9px] text-[var(--muted-foreground)] max-w-[120px] text-center leading-tight">{info.explain}</p>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
