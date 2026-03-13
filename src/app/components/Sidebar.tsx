import { useState } from "react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  hasDataset: boolean;
  totalTransactions: number;
  datasetCount: number;
  rulesCount?: number;
}

const PokeballSpinner = () => (
  <svg viewBox="0 0 36 36" className="w-8 h-8 animate-pokespin flex-shrink-0" fill="none">
    <circle cx="18" cy="18" r="16.5" fill="#cc2222" stroke="#ff4444" strokeWidth="1"/>
    <path d="M1.5 18 A16.5 16.5 0 0 0 34.5 18 Z" fill="#ffffff" fillOpacity="0.12"/>
    <rect x="0" y="16.5" width="36" height="3" fill="#1a0a0a"/>
    <circle cx="18" cy="18" r="5.5" fill="#1a0a0a" stroke="#cc2222" strokeWidth="2"/>
    <circle cx="18" cy="18" r="2.5" fill="#ff6666"/>
  </svg>
);

const IconDashboard = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 20 20" className="w-[18px] h-[18px] flex-shrink-0" fill="none"
    stroke={active ? "#ffffff" : "rgba(255,255,255,0.55)"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="7" height="7" rx="1.5"/>
    <rect x="11" y="2" width="7" height="7" rx="1.5"/>
    <rect x="2" y="11" width="7" height="7" rx="1.5"/>
    <rect x="11" y="11" width="7" height="7" rx="1.5"/>
  </svg>
);

const IconInsights = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 20 20" className="w-[18px] h-[18px] flex-shrink-0" fill="none"
    stroke={active ? "#ffffff" : "rgba(255,255,255,0.55)"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 2a6 6 0 0 1 3.5 10.8V15a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-2.2A6 6 0 0 1 10 2z"/>
    <path d="M8 18h4"/>
    <path d="M10 8v3"/>
    <path d="M8.5 10.5l1.5 1.5 1.5-1.5"/>
  </svg>
);

const IconPairings = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 20 20" className="w-[18px] h-[18px] flex-shrink-0" fill="none"
    stroke={active ? "#ffffff" : "rgba(255,255,255,0.55)"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="5" cy="10" r="3"/>
    <circle cx="15" cy="10" r="3"/>
    <path d="M8 10h4"/>
    <path d="M11 8l2 2-2 2"/>
  </svg>
);

const IconMenu = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 20 20" className="w-[18px] h-[18px] flex-shrink-0" fill="none"
    stroke={active ? "#ffffff" : "rgba(255,255,255,0.55)"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4c0 3 1.5 5 3 5s3-2 3-5"/>
    <path d="M7 9v7"/>
    <path d="M14 4v12"/>
    <path d="M12 4v4a2 2 0 0 0 4 0V4"/>
  </svg>
);

const IconData = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 20 20" className="w-[18px] h-[18px] flex-shrink-0" fill="none"
    stroke={active ? "#ffffff" : "rgba(255,255,255,0.55)"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h5l2 2h5v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"/>
    <path d="M7 13l2 2 4-4"/>
  </svg>
);

const NAV = [
  { id: "dashboard", Icon: IconDashboard, label: "Dashboard",     sub: "Overview"       },
  { id: "insights",  Icon: IconInsights,  label: "Insights",      sub: "Sales actions"  },
  { id: "pairings",  Icon: IconPairings,  label: "Item Pairings", sub: "All rules"      },
  { id: "menu",      Icon: IconMenu,      label: "Menu",          sub: "Items & prices" },
  { id: "data",      Icon: IconData,      label: "My Data",       sub: "Uploads"        },
];

export function Sidebar({ activeTab, onTabChange, hasDataset, totalTransactions, datasetCount }: SidebarProps) {
  return (
    <aside className="w-[200px] flex-shrink-0 h-screen flex flex-col bg-[var(--sidebar)] sidebar-pokeball-bg z-20 overflow-hidden">

      <div className="px-4 pt-5 pb-4 flex items-center gap-2.5 border-b border-[var(--sidebar-border)]">
        <PokeballSpinner/>
        <div className="min-w-0">
          <p className="text-[11px] font-black text-white tracking-[0.12em] uppercase leading-tight">Pokémon</p>
          <p className="text-[9px] font-bold text-red-400 tracking-[0.18em] uppercase">Café Admin</p>
        </div>
      </div>

      {hasDataset ? (
        <div className="mx-3 mt-3 mb-1 grid grid-cols-2 gap-1.5">
          {[
            { val: totalTransactions > 999 ? `${(totalTransactions/1000).toFixed(1)}k` : totalTransactions, label: "orders", color: "text-[var(--pikachu-yellow)]" },
            { val: datasetCount, label: "files", color: "text-emerald-400" },
          ].map(s => (
            <div key={s.label} className="bg-white/5 rounded-lg py-2 text-center border border-white/10">
              <p className={`text-sm font-black tabular-nums leading-none ${s.color}`}>{s.val}</p>
              <p className="text-[8px] text-white/40 font-semibold mt-0.5 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mx-3 mt-3 mb-1 flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2.5">
          <span className="text-sm animate-pikabounce flex-shrink-0">⚡</span>
          <p className="text-[10px] text-amber-300 font-bold leading-tight">Upload POS data to begin</p>
        </div>
      )}

      <nav className="flex-1 px-2.5 py-2 space-y-0.5 overflow-y-auto">
        {NAV.map(({ id, Icon, label, sub }) => {
          const active = activeTab === id;
          return (
            <button key={id} onClick={() => onTabChange(id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all text-left group ${
                active ? "bg-[var(--pokered)] shadow-lg shadow-red-900/40" : "hover:bg-white/8"
              }`}>
              <Icon active={active}/>
              <div className="min-w-0">
                <p className={`text-[12px] font-black truncate leading-tight ${active ? "text-white" : "text-white/80"}`}>{label}</p>
                <p className={`text-[9px] truncate ${active ? "text-red-200" : "text-white/35"}`}>{sub}</p>
              </div>
              {active && <div className="ml-auto w-1 h-4 rounded-full bg-white/40 flex-shrink-0"/>}
            </button>
          );
        })}
      </nav>

      <div className="px-3 pb-4 pt-2 border-t border-[var(--sidebar-border)]">
        <div className="flex items-start gap-2 bg-[#ffd700]/10 border border-[#ffd700]/20 rounded-xl px-3 py-2.5">
          <span className="text-sm animate-pikabounce flex-shrink-0">⚡</span>
          <p className="text-[9px] text-white/50 leading-relaxed">More orders = more accurate pairing patterns</p>
        </div>
      </div>
    </aside>
  );
}
