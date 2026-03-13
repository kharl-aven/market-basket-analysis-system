import { useState, useEffect } from "react";
import { Check, X, Tag, MapPin, TrendingUp, ChevronRight, ShoppingCart, Star, UploadCloud } from "lucide-react";

interface InsightsTabProps {
  dynamicRecommendations?: any[];
  dynamicRules?: any[];
  hasData: boolean;
  onUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function pct(v:string|number){ return `${(parseFloat(String(v))*100).toFixed(0)}%`; }
function strengthInfo(lift:number){
  if(lift>=2.5) return {label:"🔥 Best Opportunity",bar:"bg-green-500",text:"text-green-700",bg:"bg-green-50 border-green-200"};
  if(lift>=1.8) return {label:"✅ Good Opportunity",bar:"bg-blue-500", text:"text-blue-700", bg:"bg-blue-50 border-blue-200"};
  return             {label:"👀 Worth Watching",   bar:"bg-gray-400", text:"text-gray-600", bg:"bg-gray-50 border-gray-200"};
}

const SECTIONS=[
  {id:"actions",   label:"Quick Actions",   emoji:"⚡"},
  {id:"combos",    label:"Natural Combos",  emoji:"🎁"},
  {id:"upsell",    label:"Upsell Tips",     emoji:"↔️"},
  {id:"layout",    label:"Menu Layout",     emoji:"📍"},
  {id:"spotlight", label:"Spotlight",       emoji:"⭐"},
];

/* ── Quick Actions ─────────────────────────────────────────────────────── */
function QuickActionsSection({recommendations,onUpload}:{recommendations:any[]; onUpload?:(e:any)=>void}){
  const [dismissed,setDismissed]=useState<Set<string>>(new Set());
  const ICONS:{[k:string]:string}={promo:"🏷️",placement:"📍",combo:"🎁"};
  const visible=recommendations.filter(r=>!dismissed.has(r.id));

  if(!recommendations.length) return (
    <div className="text-center py-16 bg-[var(--card)] rounded-2xl border border-[var(--border)]">
      <span className="text-4xl block mb-3">⚡</span>
      <p className="font-black mb-1">No actions yet</p>
      <p className="text-xs text-[var(--muted-foreground)] mb-5 max-w-xs mx-auto">Upload sales data to generate combo deals and promotion ideas based on your actual ordering patterns.</p>
      {onUpload && <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--pokered)] text-white rounded-xl font-black text-xs shadow"><UploadCloud className="w-4 h-4"/>Upload CSV<input type="file" accept=".csv" className="hidden" onChange={onUpload}/></label>}
    </div>
  );

  return (
    <div className="space-y-4">
      {visible.length===0 ? (
        <div className="text-center py-10 bg-[var(--card)] rounded-2xl border border-[var(--border)]">
          <Check className="w-10 h-10 text-[var(--success-green)] mx-auto mb-2"/>
          <p className="font-black">All actions addressed</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {visible.map((r:any,i:number)=>(
            <div key={r.id||i} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm poke-card flex flex-col">
              <div className="flex items-start gap-3 p-4 flex-1">
                <span className="text-2xl flex-shrink-0">{ICONS[r.type]||"💡"}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-[var(--foreground)]">{r.title}</p>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1 leading-relaxed">{r.description}</p>
                  {r.impact && <p className="text-xs font-black text-[var(--success-green)] mt-2 flex items-center gap-1"><TrendingUp className="w-3 h-3"/>{r.impact}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 pb-4 border-t border-[var(--border)] pt-3">
                <button onClick={()=>setDismissed(p=>new Set([...p,r.id||String(i)]))}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--success-green)] text-white rounded-lg text-xs font-black hover:opacity-90 transition-opacity">
                  <Check className="w-3 h-3"/> Done
                </button>
                <button onClick={()=>setDismissed(p=>new Set([...p,r.id||String(i)]))}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-[var(--border)] rounded-lg text-xs font-bold text-[var(--muted-foreground)] hover:border-[var(--pokered)] hover:text-[var(--pokered)] transition-colors">
                  <X className="w-3 h-3"/> Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Natural Combos ─────────────────────────────────────────────────────── */
function NaturalCombosSection({insights}:{insights:any}){
  const [showLegend,setShowLegend]=useState(false);
  const bundles  = insights?.top_bundles ?? [];
  const topRules = insights?.top_rules ?? [];
  if(!bundles.length && !topRules.length) return <EmptyMsg/>;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 flex-wrap">
        <button onClick={()=>setShowLegend(!showLegend)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-black transition-all ${showLegend?"bg-[var(--pokered)] text-white border-[var(--pokered)]":"bg-[var(--card)] border-[var(--border)]"}`}>
          📖 What do these mean?
        </button>
      </div>
      {showLegend && (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 animate-pokefade">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-l-4 border-l-blue-400 pl-3">
              <p className="font-black text-xs mb-1">How reliably linked</p>
              <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">When a customer ordered Item A, how often they also ordered Item B. 80% = 8 out of 10 customers.</p>
            </div>
            <div className="border-l-4 border-l-amber-400 pl-3">
              <p className="font-black text-xs mb-1">Opportunity rating</p>
              <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">How much more likely these items are together vs. randomly. 2× = twice as likely as coincidence — a real pattern.</p>
            </div>
          </div>
        </div>
      )}
      {bundles.length>0 && (
        <div>
          <h4 className="text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider mb-3">Top Natural Bundles</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {bundles.map((b:any,i:number)=>(
              <div key={i} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 shadow-sm poke-card flex items-start gap-3">
                <img src={b.image} alt="" className="w-12 h-12 object-contain flex-shrink-0"/>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-[var(--foreground)] leading-snug">{b.items.slice(0,3).join(" + ")}</p>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1">{b.support_pct} of all orders include this combination</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {topRules.length>0 && (
        <div>
          <h4 className="text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider mb-3">Strongest Pairing Rules</h4>
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-[var(--border)] bg-[var(--secondary)]/30">
                  <tr>
                    <th className="text-left py-3 pl-5 pr-4 text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-wider">Pairing</th>
                    <th className="text-center py-3 px-4 text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-wider">Reliably Linked</th>
                    <th className="text-center py-3 px-4 text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-wider">Together</th>
                    <th className="text-center py-3 px-4 text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-wider">Opportunity</th>
                  </tr>
                </thead>
                <tbody>
                  {topRules.map((r:any,i:number)=>{
                    const info=strengthInfo(parseFloat(r.lift));
                    return (
                      <tr key={i} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--secondary)]/20 transition-colors">
                        <td className="py-3 pl-5 pr-4">
                          <div className="flex items-center gap-2">
                            <img src={r.image} alt="" className="w-7 h-7 object-contain flex-shrink-0"/>
                            <span className="text-xs font-semibold truncate max-w-[80px]">{r.antecedent?.split(",")[0]?.trim()}</span>
                            <span className="text-[var(--muted-foreground)] text-xs font-black">+</span>
                            <span className="text-xs font-semibold truncate max-w-[80px]">{r.consequent?.split(",")[0]?.trim()}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center font-black text-sm">{pct(r.confidence)}</td>
                        <td className="py-3 px-4 text-center font-black text-sm">{pct(r.support)}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`badge-poke border ${info.bg} ${info.text}`}>{info.label}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Upsell ──────────────────────────────────────────────────────────────── */
function UpsellSection({insights}:{insights:any}){
  const crossSell = insights?.cross_sell ?? [];
  const fbt       = insights?.frequently_bought_together ?? [];
  if(!crossSell.length && !fbt.length) return <EmptyMsg/>;
  return (
    <div className="space-y-5">
      {crossSell.map((cs:any,i:number)=>(
        <div key={i} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-3 px-5 py-3 border-b border-[var(--border)] bg-[var(--secondary)]/40">
            <ShoppingCart className="w-4 h-4 text-[var(--cafe-wood)]"/>
            <span className="text-xs font-black">When ordering <span className="text-[var(--pokered)]">{cs.cart_item}</span>, suggest:</span>
          </div>
          <div className="p-4 flex flex-wrap gap-3">
            {cs.suggestions?.map((s:any,j:number)=>(
              <div key={j} className="flex items-center gap-3 bg-[var(--secondary)] rounded-xl px-3 py-2.5 border border-[var(--border)]">
                <img src={s.image} alt="" className="w-9 h-9 object-contain flex-shrink-0"/>
                <div>
                  <p className="text-xs font-black truncate max-w-[130px]">{s.item?.split(",")[0]?.trim()}</p>
                  <p className="text-[10px] text-[var(--muted-foreground)]"><span className="font-black text-[var(--success-green)]">{s.confidence}</span> accept this</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {fbt.length>0 && (
        <div>
          <h4 className="text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider mb-3">Frequently Ordered Together</h4>
          <div className="space-y-2.5">
            {fbt.map((item:any,i:number)=>(
              <div key={i} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:bg-[var(--secondary)]/20 transition-colors">
                <img src={item.trigger_image} alt="" className="w-10 h-10 object-contain flex-shrink-0"/>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black truncate">{item.trigger_item}</p>
                  <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">
                    Paired with <strong>{item.suggested_item}</strong> — <span className="text-[var(--success-green)] font-black">{item.confidence}</span> of the time
                  </p>
                </div>
                <span className="text-[var(--muted-foreground)] font-black text-sm">→</span>
                <img src={item.suggested_image} alt="" className="w-10 h-10 object-contain flex-shrink-0"/>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Menu Layout ─────────────────────────────────────────────────────────── */
function LayoutSection({insights}:{insights:any}){
  const placements = insights?.shelf_placement ?? [];
  const promos     = insights?.promo_recommendations ?? [];
  if(!placements.length && !promos.length) return <EmptyMsg/>;
  const PROMO_EMOJI:{[k:string]:string}={bundle:"🎁",b2g1:"🆓",combo:"🍱",happy_hour:"⏰",loyalty:"⭐"};
  return (
    <div className="space-y-5">
      {placements.length>0 && (
        <div>
          <h4 className="text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider mb-3">Menu Placement Suggestions</h4>
          <div className="space-y-3">
            {placements.map((sp:any,i:number)=>{
              const info=strengthInfo(sp.strength==="Very Strong"?2.5:sp.strength==="Strong"?1.8:1.0);
              return (
                <div key={i} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 flex items-start gap-4 shadow-sm poke-card">
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <img src={sp.ant_image} alt="" className="w-9 h-9 object-contain"/>
                    <MapPin className="w-4 h-4 text-[var(--muted-foreground)]"/>
                    <img src={sp.cons_image} alt="" className="w-9 h-9 object-contain"/>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-black text-[var(--foreground)] mb-1.5">{sp.suggestion}</p>
                    <span className={`badge-poke border ${info.bg} ${info.text}`}>{info.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {promos.length>0 && (
        <div>
          <h4 className="text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider mb-3">Promotion Ideas</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {promos.map((p:any,i:number)=>(
              <div key={i} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 flex items-start gap-3 shadow-sm poke-card">
                <span className="text-2xl flex-shrink-0">{PROMO_EMOJI[p.type]||"💡"}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs font-black">{p.title}</p>
                    {p.est_impact && <span className="text-[10px] font-black text-[var(--success-green)] flex items-center gap-0.5"><TrendingUp className="w-3 h-3"/>{p.est_impact}</span>}
                  </div>
                  <p className="text-[11px] text-[var(--muted-foreground)] leading-relaxed">{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Spotlight ───────────────────────────────────────────────────────────── */
function SpotlightSection({insights}:{insights:any}){
  const ranking = insights?.homepage_ranking ?? [];
  if(!ranking.length) return <EmptyMsg/>;
  const RANK_STYLES=[
    "bg-gradient-to-br from-yellow-400 to-amber-500 text-white shadow-lg shadow-amber-200",
    "bg-gradient-to-br from-gray-300 to-gray-400 text-white shadow-lg shadow-gray-200",
    "bg-gradient-to-br from-amber-600 to-amber-700 text-white shadow-lg shadow-amber-300",
  ];
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {ranking.map((item:any)=>(
          <div key={item.rank} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 text-center poke-card shadow-sm relative overflow-hidden">
            <div className={`absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${RANK_STYLES[item.rank-1]||"bg-[var(--secondary)] text-[var(--foreground)]"}`}>
              {item.rank}
            </div>
            <img src={item.image} alt="" className="w-14 h-14 object-contain mx-auto mb-2.5"/>
            <p className="text-[11px] font-black leading-snug line-clamp-2">{item.item}</p>
            <p className="text-[9px] text-[var(--muted-foreground)] mt-1.5 flex items-center justify-center gap-1">
              <Star className="w-2.5 h-2.5 fill-[var(--pikachu-yellow)] text-[var(--pikachu-yellow)]"/> Feature first
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyMsg(){
  return (
    <div className="text-center py-12 bg-[var(--card)] rounded-2xl border border-[var(--border)]">
      <span className="text-4xl block mb-3">📊</span>
      <p className="font-black mb-1">No data for this section yet</p>
      <p className="text-xs text-[var(--muted-foreground)]">Upload sales data and this section will populate automatically.</p>
    </div>
  );
}

/* ── Main export ─────────────────────────────────────────────────────────── */
export function InsightsTab({dynamicRecommendations,dynamicRules,hasData,onUpload}:InsightsTabProps){
  const [section,setSection]=useState("actions");
  const [insights,setInsights]=useState<any>(null);

  useEffect(()=>{
    if(hasData){
      fetch("/api/insights").then(r=>r.json()).then(d=>{ if(d.insights) setInsights(d.insights); }).catch(()=>{});
    }
  },[hasData,dynamicRules]);

  if(!hasData) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <span className="text-5xl mb-4">💡</span>
      <h2 className="text-xl font-black mb-2">Sales Insights</h2>
      <p className="text-xs text-[var(--muted-foreground)] max-w-xs mb-6">Upload sales data to unlock combo deals, upsell tips, menu placement ideas, and more.</p>
      {onUpload && <label className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-[var(--pokered)] text-white rounded-xl font-black text-sm shadow-lg hover:bg-[var(--pokered-dark)] transition-all"><UploadCloud className="w-5 h-5"/> Upload Sales CSV<input type="file" accept=".csv" className="hidden" onChange={onUpload}/></label>}
    </div>
  );

  return (
    <div className="space-y-5 animate-pokefade">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black">Sales Insights</h2>
        <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Data-driven actions from your ordering patterns</p>
      </div>

      {/* Sub-nav */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-1.5 shadow-sm">
        <div className="flex gap-1 overflow-x-auto">
          {SECTIONS.map(s=>(
            <button key={s.id} onClick={()=>setSection(s.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all flex-shrink-0 ${
                section===s.id ? "bg-[var(--pokered)] text-white shadow-sm" : "text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
              }`}>
              <span>{s.emoji}</span><span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Section content */}
      <div className="animate-pokefade">
        {section==="actions"   && <QuickActionsSection recommendations={dynamicRecommendations??[]} onUpload={onUpload}/>}
        {section==="combos"    && <NaturalCombosSection insights={insights}/>}
        {section==="upsell"    && <UpsellSection insights={insights}/>}
        {section==="layout"    && <LayoutSection insights={insights}/>}
        {section==="spotlight" && <SpotlightSection insights={insights}/>}
      </div>
    </div>
  );
}
