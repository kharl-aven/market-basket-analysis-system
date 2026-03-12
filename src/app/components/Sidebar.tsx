import { useState } from "react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  hasDataset: boolean;
  totalTransactions: number;
  datasetCount: number;
  rulesCount?: number;
}

/* ── Inline SVG components ───────────────────────────────────────────────── */
const PokeballSpinner = () => (
  <svg viewBox="0 0 36 36" className="w-8 h-8 animate-pokespin flex-shrink-0" fill="none">
    <circle cx="18" cy="18" r="16.5" fill="#cc2222" stroke="#ff4444" strokeWidth="1"/>
    <clipPath id="sb-bot"><rect x="0" y="18" width="36" height="18"/></clipPath>
    <circle cx="18" cy="18" r="16.5" fill="#ffffff" clipPath="url(#sb-bot)" fillOpacity="0.12"/>
    <rect x="0" y="16.5" width="36" height="3" fill="#1a0a0a"/>
    <circle cx="18" cy="18" r="5.5" fill="#1a0a0a" stroke="#cc2222" strokeWidth="2"/>
    <circle cx="18" cy="18" r="2.5" fill="#ff6666"/>
  </svg>
);

const PikaEars = () => (
  <svg viewBox="0 0 28 20" className="w-6 h-5 flex-shrink-0" fill="none">
    <path d="M4 18 L2 2 L10 14 Z" fill="#ffd700" stroke="#e8b800" strokeWidth="1"/>
    <path d="M5 15 L4 6 L9 13 Z" fill="#ff9090"/>
    <path d="M24 18 L26 2 L18 14 Z" fill="#ffd700" stroke="#e8b800" strokeWidth="1"/>
    <path d="M23 15 L24 6 L19 13 Z" fill="#ff9090"/>
  </svg>
);

/* ── Nav items ──────────────────────────────────────────────────────────── */
const NAV = [
  { id:"dashboard", icon:"⊞",  label:"Dashboard",     sub:"Overview"           },
  { id:"insights",  icon:"💡",  label:"Insights",      sub:"Actions & combos"   },
  { id:"pairings",  icon:"⇄",   label:"Item Pairings", sub:"All rules"          },
  { id:"menu",      icon:"🍽",  label:"Menu",          sub:"Items & prices"     },
  { id:"data",      icon:"◫",   label:"My Data",       sub:"Uploads"            },
];

export function Sidebar({ activeTab, onTabChange, hasDataset, totalTransactions, datasetCount, rulesCount = 0 }: SidebarProps) {
  return (
    <aside className="w-[200px] flex-shrink-0 h-screen flex flex-col bg-[var(--sidebar)] sidebar-pokeball-bg z-20 overflow-hidden">

      {/* ── Logo strip ─────────────────────────────────────────────────── */}
      <div className="px-4 pt-5 pb-4 flex items-center gap-2.5 border-b border-[var(--sidebar-border)]">
        <PokeballSpinner/>
        <div className="min-w-0">
          <p className="text-[11px] font-black text-white tracking-[0.12em] uppercase leading-tight">Pokémon</p>
          <p className="text-[9px] font-bold text-red-400 tracking-[0.18em] uppercase">Café Admin</p>
        </div>
      </div>

      {/* ── Live counters (only when data loaded) ─────────────────────── */}
      {hasDataset ? (
        <div className="mx-3 mt-3 mb-1 grid grid-cols-3 gap-1.5">
          {[
            { val: totalTransactions > 999 ? `${(totalTransactions/1000).toFixed(1)}k` : totalTransactions, label:"orders", color:"text-[var(--pikachu-yellow)]" },
            { val: datasetCount,  label:"files",  color:"text-emerald-400" },
            { val: rulesCount,    label:"rules",  color:"text-blue-400"    },
          ].map(s => (
            <div key={s.label} className="bg-white/5 rounded-lg py-2 text-center border border-white/10">
              <p className={`text-sm font-black tabular-nums leading-none ${s.color}`}>{s.val}</p>
              <p className="text-[8px] text-white/40 font-semibold mt-0.5 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mx-3 mt-3 mb-1 flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2.5">
          <PikaEars/>
          <p className="text-[10px] text-amber-300 font-bold leading-tight">No data yet — upload a POS export to begin</p>
        </div>
      )}

      {/* ── Nav ────────────────────────────────────────────────────────── */}
      <nav className="flex-1 px-2.5 py-2 space-y-0.5 overflow-y-auto">
        {NAV.map(item => {
          const active = activeTab === item.id;
          return (
            <button key={item.id} onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all text-left group ${
                active
                  ? "bg-[var(--pokered)] shadow-lg shadow-red-900/40"
                  : "hover:bg-white/8"
              }`}>
              <span className={`text-base leading-none flex-shrink-0 ${active ? "opacity-100" : "opacity-60 group-hover:opacity-100"}`}>{item.icon}</span>
              <div className="min-w-0">
                <p className={`text-[12px] font-black truncate leading-tight ${active ? "text-white" : "text-white/80"}`}>{item.label}</p>
                <p className={`text-[9px] truncate ${active ? "text-red-200" : "text-white/35"}`}>{item.sub}</p>
              </div>
              {active && <div className="ml-auto w-1 h-4 rounded-full bg-white/40 flex-shrink-0"/>}
            </button>
          );
        })}
      </nav>

      {/* ── Pikachu tip ────────────────────────────────────────────────── */}
      <div className="px-3 pb-4 pt-2 border-t border-[var(--sidebar-border)]">
        <div className="flex items-start gap-2 bg-[#ffd700]/10 border border-[#ffd700]/20 rounded-xl px-3 py-2.5">
          <span className="text-sm animate-pikabounce flex-shrink-0">⚡</span>
          <p className="text-[9px] text-white/50 leading-relaxed">
            More orders = more accurate pairing patterns
          </p>
        </div>
      </div>
    </aside>
  );
}
