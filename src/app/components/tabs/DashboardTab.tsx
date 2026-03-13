import { UploadCloud, ChevronRight, TrendingUp, ShoppingBag, Zap, BarChart2, Tag, Star } from "lucide-react";

interface DatasetEntry {
  id:string; name:string; uploadedAt:Date;
  rowCount:number; pairedRowCount:number; rulesGenerated:number; status:string;
}
interface DashboardTabProps {
  hasData:boolean;
  onUpload:(e:React.ChangeEvent<HTMLInputElement>)=>void;
  rules:any[];
  recommendations:any[];
  drift:{ drift_detected:boolean; drift_score:number };
  datasetLog:DatasetEntry[];
  totalTransactions:number;
  onGoToInsights:()=>void;
  onGoToPairings:()=>void;
  onGoToData:()=>void;
}

function liftBadge(lift:number){
  if(lift>=2.5) return {label:"🔥 Best",  bg:"bg-green-100",  text:"text-green-700",  bar:"bg-green-500"};
  if(lift>=1.8) return {label:"✅ Good",  bg:"bg-blue-100",   text:"text-blue-700",   bar:"bg-blue-500"};
  return              {label:"👀 Watch", bg:"bg-gray-100",    text:"text-gray-600",   bar:"bg-gray-400"};
}

/* ── Pokéballs — arc paths only, zero clipPath IDs ──────────────────────── */
const PokeBall = ({className="w-8 h-8"}:{className?:string}) => (
  <svg viewBox="0 0 40 40" fill="none" className={className}>
    <circle cx="20" cy="20" r="19" fill="white" stroke="#cc2222" strokeWidth="2"/>
    <path d="M1 20 A19 19 0 0 1 39 20 Z" fill="#cc2222"/>
    <rect x="0" y="18.5" width="40" height="3" fill="#1a0a0a"/>
    <circle cx="20" cy="20" r="5.5" fill="white" stroke="#1a0a0a" strokeWidth="2"/>
    <circle cx="20" cy="20" r="2.5" fill="#f5f5f5"/>
  </svg>
);

const GreatBall = ({className="w-8 h-8"}:{className?:string}) => (
  <svg viewBox="0 0 40 40" fill="none" className={className}>
    <circle cx="20" cy="20" r="19" fill="white" stroke="#2266cc" strokeWidth="2"/>
    <path d="M1 20 A19 19 0 0 1 39 20 Z" fill="#2266cc"/>
    <line x1="2" y1="14" x2="38" y2="14" stroke="#1a0a0a" strokeWidth="3" strokeLinecap="round"/>
    <rect x="0" y="18.5" width="40" height="3" fill="#1a0a0a"/>
    <circle cx="20" cy="20" r="5.5" fill="white" stroke="#1a0a0a" strokeWidth="2"/>
    <circle cx="20" cy="20" r="2.5" fill="#99bbff"/>
  </svg>
);

const UltraBall = ({className="w-8 h-8"}:{className?:string}) => (
  <svg viewBox="0 0 40 40" fill="none" className={className}>
    <circle cx="20" cy="20" r="19" fill="white" stroke="#d4a017" strokeWidth="2"/>
    <path d="M1 20 A19 19 0 0 1 39 20 Z" fill="#1a1a1a"/>
    <path d="M14 1 L20 9 L26 1" fill="#d4a017"/>
    <rect x="0" y="18.5" width="40" height="3" fill="#1a0a0a"/>
    <circle cx="20" cy="20" r="5.5" fill="white" stroke="#1a0a0a" strokeWidth="2"/>
    <circle cx="20" cy="20" r="2.5" fill="#ffe066"/>
  </svg>
);

/* ── Welcome state ───────────────────────────────────────────────────────── */
function WelcomeScreen({onUpload, onGoToData}:{onUpload:(e:any)=>void; onGoToData:()=>void}){
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[72vh] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <svg viewBox="0 0 200 200" className="absolute -right-16 -top-16 w-80 h-80 opacity-[0.04]" fill="none">
          <circle cx="100" cy="100" r="95" stroke="#cc2222" strokeWidth="5"/>
          <path d="M5 100 A95 95 0 0 1 195 100 Z" fill="#cc2222"/>
          <rect x="0" y="94" width="200" height="12" fill="#1a0a0a"/>
          <circle cx="100" cy="100" r="28" fill="none" stroke="#1a0a0a" strokeWidth="7"/>
        </svg>
        <svg viewBox="0 0 80 80" className="absolute left-8 bottom-16 w-28 h-28 opacity-[0.05]" fill="none">
          <circle cx="40" cy="40" r="37" stroke="#d4a017" strokeWidth="3"/>
          <path d="M3 40 A37 37 0 0 1 77 40 Z" fill="#1a1a1a"/>
          <rect x="0" y="38" width="80" height="4" fill="#1a0a0a"/>
          <circle cx="40" cy="40" r="11" fill="none" stroke="#1a0a0a" strokeWidth="3"/>
        </svg>
        <svg viewBox="0 0 60 80" className="absolute right-1/4 bottom-8 w-16 h-20 opacity-[0.06]" fill="#ffd700">
          <path d="M35 0 L15 38 L28 38 L20 80 L55 30 L38 30 Z"/>
        </svg>
      </div>

      <div className="relative z-10 text-center px-6 max-w-lg">
        <div className="w-24 h-24 mx-auto mb-6">
          <svg viewBox="0 0 80 80" fill="none" className="w-full h-full drop-shadow-lg">
            <circle cx="40" cy="40" r="37" fill="white" stroke="#cc2222" strokeWidth="3"/>
            <path d="M3 40 A37 37 0 0 1 77 40 Z" fill="#cc2222"/>
            <rect x="0" y="37" width="80" height="6" fill="#1a0a0a"/>
            <circle cx="40" cy="40" r="13" fill="white" stroke="#1a0a0a" strokeWidth="3.5"/>
            <circle cx="40" cy="40" r="6" fill="#f5f5f5"/>
          </svg>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--pokered)]/10 rounded-full border border-[var(--pokered)]/20 text-[11px] font-black text-[var(--pokered)] mb-4 tracking-wider uppercase">
          ⚡ Pokémon Café · Smart Sales
        </div>

        <h1 className="text-3xl font-black text-[var(--foreground)] mb-3 leading-tight">
          Catch the patterns<br/>
          <span className="text-[var(--pokered)]">in your sales data</span>
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] mb-8 leading-relaxed">
          Upload any POS export and discover which menu items your customers order together —
          then get ready-made combo deals, upsell tips, and menu placement ideas.
        </p>

        <div className="grid grid-cols-3 gap-3 mb-8 text-left">
          {[
            { ball:<PokeBall className="w-9 h-9"/>,   title:"Pairing Rules",    desc:"Which items go together" },
            { ball:<GreatBall className="w-9 h-9"/>,  title:"Combo Ideas",      desc:"Ready-to-run promotions" },
            { ball:<UltraBall className="w-9 h-9"/>,  title:"Menu Insights",    desc:"Placement & upsell tips" },
          ].map((f,i)=>(
            <div key={i} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-3 poke-card">
              <div className="mb-2">{f.ball}</div>
              <p className="text-xs font-black text-[var(--foreground)]">{f.title}</p>
              <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">{f.desc}</p>
            </div>
          ))}
        </div>

        <label className="cursor-pointer inline-flex items-center gap-2.5 px-8 py-3.5 bg-[var(--pokered)] text-white rounded-2xl font-black text-sm shadow-xl hover:bg-[var(--pokered-dark)] transition-all hover:scale-[1.02] active:scale-[0.98]">
          <UploadCloud className="w-5 h-5"/> Upload POS Export
          <input type="file" accept=".csv,.xlsx,.xls,.tsv,.txt,.json" className="hidden" onChange={onUpload}/>
        </label>
        <p className="text-[11px] text-[var(--muted-foreground)] mt-2">Accepts CSV, Excel, TSV, JSON and more</p>
      </div>
    </div>
  );
}

/* ── Stat card ───────────────────────────────────────────────────────────── */
function StatCard({icon,value,label,sub,accent}:{icon:React.ReactNode;value:string|number;label:string;sub?:string;accent:string}){
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm poke-card">
      <div className={`absolute top-0 right-0 w-20 h-20 rounded-full -translate-y-6 translate-x-6 opacity-[0.08] ${accent}`}/>
      <div className={`w-8 h-8 rounded-xl ${accent} flex items-center justify-center mb-3 flex-shrink-0`}>{icon}</div>
      <p className="text-2xl font-black tabular-nums text-[var(--foreground)] leading-none">{value}</p>
      <p className="text-xs font-black text-[var(--foreground)] mt-1.5">{label}</p>
      {sub && <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">{sub}</p>}
    </div>
  );
}

/* ── Promo Spotlight ─────────────────────────────────────────────────────── */
function PromoSpotlight({rules, onView}:{rules:any[]; onView:()=>void}){
  if(!rules.length) return null;
  const top = [...rules].sort((a,b)=>b.lift-a.lift)[0];
  if(!top) return null;
  const liftVal = typeof top.lift==="number" ? top.lift : parseFloat(top.lift);
  const confVal = parseFloat(top.confidence)*100;
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[var(--pokered)] to-[#8b0000] rounded-2xl p-5 text-white shadow-xl">
      <svg viewBox="0 0 80 80" className="absolute -right-4 -bottom-4 w-28 h-28 opacity-10" fill="none">
        <circle cx="40" cy="40" r="37" stroke="white" strokeWidth="3"/>
        <path d="M3 40 A37 37 0 0 1 77 40 Z" fill="white" opacity="0.3"/>
        <rect x="0" y="37" width="80" height="6" fill="white" opacity="0.4"/>
        <circle cx="40" cy="40" r="12" fill="none" stroke="white" strokeWidth="4"/>
      </svg>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Tag className="w-3.5 h-3.5 text-red-200"/>
          <p className="text-[10px] font-black text-red-200 uppercase tracking-widest">Top Promo Opportunity</p>
        </div>
        <div className="flex items-center gap-3 mb-3">
          <img src={top.antecedent?.image} alt="" className="w-10 h-10 object-contain bg-white/10 rounded-xl p-1"/>
          <span className="text-white/60 font-black">+</span>
          <img src={top.consequent?.image} alt="" className="w-10 h-10 object-contain bg-white/10 rounded-xl p-1"/>
          <div className="ml-1">
            <p className="text-sm font-black leading-tight">{top.antecedent?.name?.split(",")[0]?.trim()}</p>
            <p className="text-xs text-red-200 leading-tight">{top.consequent?.name?.split(",")[0]?.trim()}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 mb-3">
          <div><p className="text-lg font-black leading-none">{liftVal.toFixed(2)}×</p><p className="text-[10px] text-red-200 font-bold">Lift</p></div>
          <div><p className="text-lg font-black leading-none">{confVal.toFixed(0)}%</p><p className="text-[10px] text-red-200 font-bold">Confidence</p></div>
          <div><p className="text-lg font-black leading-none text-[var(--pikachu-yellow)]">+{Math.round(liftVal*4)}%</p><p className="text-[10px] text-red-200 font-bold">Est. revenue</p></div>
        </div>
        <button onClick={onView} className="flex items-center gap-1.5 text-xs font-black text-white/80 hover:text-white transition-colors">
          See all promos <ChevronRight className="w-3 h-3"/>
        </button>
      </div>
    </div>
  );
}

/* ── Most Paired Items ───────────────────────────────────────────────────── */
function TopSellersCard({rules, onView}:{rules:any[]; onView:()=>void}){
  if(!rules.length) return null;
  const scores: Record<string,{score:number;image:string;count:number}> = {};
  rules.forEach(r=>{
    const a = r.antecedent?.name?.split(",")[0]?.trim();
    const c = r.consequent?.name?.split(",")[0]?.trim();
    if(a){ if(!scores[a]) scores[a]={score:0,image:r.antecedent?.image||"",count:0}; scores[a].score+=r.lift*parseFloat(r.confidence); scores[a].count++; }
    if(c){ if(!scores[c]) scores[c]={score:0,image:r.consequent?.image||"",count:0}; scores[c].score+=r.lift*parseFloat(r.confidence)*0.7; scores[c].count++; }
  });
  const top = Object.entries(scores).sort((a,b)=>b[1].score-a[1].score).slice(0,4);
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
      <div className="px-5 py-3.5 border-b border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Star className="w-4 h-4 text-[var(--pikachu-yellow)] fill-[var(--pikachu-yellow)]"/>
          <p className="font-black text-sm">Most Paired Items</p>
        </div>
        <button onClick={onView} className="text-[11px] font-black text-[var(--pokered)] hover:underline flex items-center gap-1">
          Insights <ChevronRight className="w-3 h-3"/>
        </button>
      </div>
      <div className="p-4 grid grid-cols-2 gap-3">
        {top.map(([name,data],i)=>(
          <div key={name} className="flex items-center gap-3 p-2.5 bg-[var(--secondary)]/50 rounded-xl border border-[var(--border)] hover:bg-[var(--secondary)] transition-colors">
            <div className="relative flex-shrink-0">
              <img src={data.image} alt={name} className="w-10 h-10 object-contain"/>
              <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-[var(--pokered)] text-white text-[9px] font-black flex items-center justify-center">{i+1}</span>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-black text-[var(--foreground)] leading-tight truncate">{name}</p>
              <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">{data.count} pairing{data.count!==1?"s":""}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Top Pairings ────────────────────────────────────────────────────────── */
function TopPairings({rules, onViewAll}:{rules:any[]; onViewAll:()=>void}){
  if(!rules.length) return null;
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm flex flex-col h-full">
      <div className="px-5 py-3.5 border-b border-[var(--border)] flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <PokeBall className="w-6 h-6"/>
          <p className="font-black text-sm">Top Item Pairings</p>
        </div>
        <button onClick={onViewAll} className="text-[11px] font-black text-[var(--pokered)] hover:underline flex items-center gap-1 flex-shrink-0">
          All <ChevronRight className="w-3 h-3"/>
        </button>
      </div>
      <div className="flex-1 divide-y divide-[var(--border)]">
        {rules.slice(0,5).map((r,i)=>{
          const conf = parseFloat(r.confidence)*100;
          const {label,bg,text,bar} = liftBadge(r.lift);
          return (
            <div key={r.id||i} className="px-4 py-2.5 flex items-center gap-2.5 hover:bg-[var(--secondary)]/40 transition-colors">
              <span className="text-xs font-black text-[var(--muted-foreground)] w-4 flex-shrink-0">{i+1}</span>
              <img src={r.antecedent?.image} alt="" className="w-7 h-7 object-contain flex-shrink-0"/>
              <span className="text-xs font-semibold truncate max-w-[90px] flex-1 text-[var(--foreground)]">{r.antecedent?.name?.split(",")[0]?.trim()}</span>
              <span className="text-[var(--muted-foreground)] font-black text-xs flex-shrink-0">+</span>
              <img src={r.consequent?.image} alt="" className="w-7 h-7 object-contain flex-shrink-0"/>
              <span className="text-xs font-semibold truncate max-w-[90px] flex-1 text-[var(--foreground)]">{r.consequent?.name?.split(",")[0]?.trim()}</span>
              <div className="flex-shrink-0 text-right w-10">
                <p className="text-sm font-black leading-none">{conf.toFixed(0)}%</p>
                <div className="h-1 w-full bg-[var(--border)] rounded-full mt-1 overflow-hidden">
                  <div className={`h-full ${bar} rounded-full`} style={{width:`${conf}%`}}/>
                </div>
              </div>
              <span className={`hidden lg:inline-flex badge-poke ${bg} ${text} border border-transparent flex-shrink-0`}>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Recommendations ─────────────────────────────────────────────────────── */
function RecoCards({recommendations, onView}:{recommendations:any[]; onView:()=>void}){
  if(!recommendations.length) return null;
  const ICONS:{[k:string]:string} = {promo:"🏷️", placement:"📍", combo:"🎁"};
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm flex flex-col h-full">
      <div className="px-5 py-3.5 border-b border-[var(--border)] flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <Zap className="w-5 h-5 text-[var(--pikachu-yellow)] fill-[var(--pikachu-yellow)]"/>
          <p className="font-black text-sm">Quick Actions</p>
        </div>
        <button onClick={onView} className="text-[11px] font-black text-[var(--pokered)] hover:underline flex items-center gap-1">
          All <ChevronRight className="w-3 h-3"/>
        </button>
      </div>
      <div className="flex-1 p-4 space-y-3">
        {recommendations.slice(0,3).map((r:any,i:number)=>(
          <div key={i} className="flex items-start gap-3 p-3 bg-[var(--secondary)]/60 rounded-xl border border-[var(--border)] hover:bg-[var(--secondary)] transition-colors">
            <span className="text-lg flex-shrink-0 leading-none">{ICONS[r.type]||"💡"}</span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black text-[var(--foreground)]">{r.title}</p>
              <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5 line-clamp-2 leading-relaxed">{r.description}</p>
              {r.impact && <p className="text-[10px] font-black text-[var(--success-green)] mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3"/>{r.impact}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main export ─────────────────────────────────────────────────────────── */
export function DashboardTab({hasData,onUpload,rules,recommendations,datasetLog,totalTransactions,onGoToInsights,onGoToPairings,onGoToData}:DashboardTabProps){
  if(!hasData) return <WelcomeScreen onUpload={onUpload} onGoToData={onGoToData}/>;

  const pairedRows = datasetLog.reduce((s,d)=>s+(d.pairedRowCount||0),0);
  const pct        = totalTransactions>0 ? Math.round((pairedRows/totalTransactions)*100) : 0;
  const files      = datasetLog.length;

  return (
    <div className="space-y-5 animate-pokefade">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-black text-[var(--foreground)]">Dashboard</h2>
          <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5 font-semibold">
            {new Date().toLocaleDateString("en-PH",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}
          </p>
        </div>
        <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-[var(--pokered)]/10 border border-[var(--pokered)]/30 text-[var(--pokered)] rounded-xl font-black text-xs hover:bg-[var(--pokered)] hover:text-white transition-all">
          <UploadCloud className="w-4 h-4"/> Add More Data
          <input type="file" accept=".csv,.xlsx,.xls,.tsv,.txt,.json" className="hidden" onChange={onUpload}/>
        </label>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<ShoppingBag className="w-4 h-4 text-white"/>} value={totalTransactions.toLocaleString()} label="Total Orders" sub={`across ${files} file${files!==1?"s":""}`} accent="bg-[var(--pokered)]"/>
        <StatCard icon={<BarChart2 className="w-4 h-4 text-white"/>} value={pairedRows.toLocaleString()} label="Orders Analysed" sub={`${pct}% of total`} accent="bg-blue-500"/>
        <StatCard icon={<PokeBall className="w-6 h-6"/>} value={rules.length} label="Pairings Found" sub="item combinations" accent="bg-green-500"/>
        <StatCard icon={<Zap className="w-4 h-4 text-[var(--foreground)]"/>} value={recommendations.length} label="Action Items" sub="ready to act on" accent="bg-[var(--pikachu-yellow)]"/>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="space-y-4">
          <PromoSpotlight rules={rules} onView={onGoToInsights}/>
          <TopSellersCard rules={rules} onView={onGoToInsights}/>
        </div>
        <div className="md:col-span-1"><TopPairings rules={rules} onViewAll={onGoToPairings}/></div>
        <div className="md:col-span-1"><RecoCards recommendations={recommendations} onView={onGoToInsights}/></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {emoji:"💡", title:"Sales Insights", desc:"Promos, combos & upsell", action:onGoToInsights, primary:true},
          {emoji:"🔗", title:"All Pairings",    desc:"Full pairing table",       action:onGoToPairings},
          {emoji:"📁", title:"My Data",         desc:"Files & data quality",     action:onGoToData},
        ].map(c=>(
          <button key={c.title} onClick={c.action}
            className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border text-left transition-all poke-card ${
              c.primary ? "bg-[var(--pokered)] border-[var(--pokered)] text-white shadow-md" : "bg-[var(--card)] border-[var(--border)] hover:border-[var(--pokered)]"
            }`}>
            <span className="text-xl">{c.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className={`font-black text-sm ${c.primary?"text-white":"text-[var(--foreground)]"}`}>{c.title}</p>
              <p className={`text-[11px] truncate ${c.primary?"text-red-100":"text-[var(--muted-foreground)]"}`}>{c.desc}</p>
            </div>
            <ChevronRight className={`w-4 h-4 flex-shrink-0 ${c.primary?"text-red-200":"text-[var(--muted-foreground)]"}`}/>
          </button>
        ))}
      </div>
    </div>
  );
}
