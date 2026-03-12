import { ChevronRight } from "lucide-react";

export function PipelineArchitectureTab() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto py-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">Pipeline Architecture</h2>
        <p className="text-[var(--muted-foreground)] max-w-xl mx-auto">
          End-to-end flow from raw POS transactions to AI-powered menu recommendations
        </p>
      </div>

      {/* Main Pipeline Flow */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 shadow-sm overflow-x-auto">
        <div className="flex items-start gap-0 min-w-[1100px]">

          {/* Stage 1: Data Source */}
          <div className="flex flex-col items-center flex-shrink-0" style={{ width: 120 }}>
            <div className="pipeline-chevron bg-[#ffe0b2] text-[#e65100] text-xs font-bold px-3 py-1.5 rounded-md mb-3 text-center w-full">
              Data Source
            </div>
            <div className="bg-[#fff9c4] border border-[#fdd835] rounded-lg p-3 w-full space-y-2 min-h-[80px] flex flex-col justify-center">
              <div className="bg-white rounded px-2 py-1 text-xs font-medium text-center shadow-sm border border-[#f0e68c]">Menu Items</div>
              <div className="bg-white rounded px-2 py-1 text-xs font-medium text-center shadow-sm border border-[#f0e68c]">User Transactions</div>
            </div>
          </div>

          <div className="flex items-center self-center pt-6 flex-shrink-0"><ChevronRight className="w-5 h-5 text-[var(--muted-foreground)]" /></div>

          {/* Stage 2: Cleaning */}
          <div className="flex flex-col items-center flex-shrink-0" style={{ width: 140 }}>
            <div className="bg-[#ffe0b2] text-[#e65100] text-xs font-bold px-3 py-1.5 rounded-md mb-3 text-center w-full">
              Cleaning
            </div>
            <div className="bg-[#fff9c4] border border-[#fdd835] rounded-lg p-3 w-full min-h-[80px] flex items-center justify-center">
              <p className="text-xs text-center font-medium text-gray-700 leading-relaxed">Remove duplicate transactions (same order submitted twice)</p>
            </div>
          </div>

          <div className="flex items-center self-center pt-6 flex-shrink-0"><ChevronRight className="w-5 h-5 text-[var(--muted-foreground)]" /></div>

          {/* Stage 3: Encoding */}
          <div className="flex flex-col items-center flex-shrink-0" style={{ width: 110 }}>
            <div className="bg-[#c8e6c9] text-[#2e7d32] text-xs font-bold px-3 py-1.5 rounded-md mb-3 text-center w-full">
              Encoding
            </div>
            <div className="bg-[#e8f5e9] border border-[#a5d6a7] rounded-lg p-3 w-full min-h-[80px] flex items-center justify-center">
              <p className="text-xs text-center font-medium text-gray-700">One-Hot Encoding</p>
            </div>
          </div>

          <div className="flex items-center self-center pt-6 flex-shrink-0"><ChevronRight className="w-5 h-5 text-[var(--muted-foreground)]" /></div>

          {/* Stage 4: Mining Engine */}
          <div className="flex flex-col items-center flex-shrink-0" style={{ width: 120 }}>
            <div className="bg-[#bbdefb] text-[#1565c0] text-xs font-bold px-3 py-1.5 rounded-md mb-3 text-center w-full">
              Mining Engine
            </div>
            <div className="bg-[#e3f2fd] border border-[#90caf9] rounded-lg p-3 w-full space-y-2 min-h-[80px] flex flex-col justify-center">
              <div className="bg-white rounded px-2 py-1.5 text-xs font-medium text-center shadow-sm border border-[#90caf9]">FP-Growth Algorithm</div>
              <div className="bg-white rounded px-2 py-1.5 text-xs font-medium text-center shadow-sm border border-[#90caf9]">Find frequent sets</div>
            </div>
          </div>

          <div className="flex items-center self-center pt-6 flex-shrink-0"><ChevronRight className="w-5 h-5 text-[var(--muted-foreground)]" /></div>

          {/* Stage 5: Rules */}
          <div className="flex flex-col items-center flex-shrink-0" style={{ width: 110 }}>
            <div className="bg-[#bbdefb] text-[#1565c0] text-xs font-bold px-3 py-1.5 rounded-md mb-3 text-center w-full">
              Rules
            </div>
            <div className="bg-[#e3f2fd] border border-[#90caf9] rounded-lg p-3 w-full space-y-1.5 min-h-[80px] flex flex-col justify-center">
              <div className="bg-white rounded px-2 py-1 text-xs font-medium text-center shadow-sm border border-[#90caf9]">Support</div>
              <div className="bg-white rounded px-2 py-1 text-xs font-medium text-center shadow-sm border border-[#90caf9]">Confidence</div>
              <div className="bg-white rounded px-2 py-1 text-xs font-medium text-center shadow-sm border border-[#90caf9]">Lift</div>
            </div>
          </div>

          <div className="flex items-center self-center pt-6 flex-shrink-0"><ChevronRight className="w-5 h-5 text-[var(--muted-foreground)]" /></div>

          {/* Stage 6: Scoring */}
          <div className="flex flex-col items-center flex-shrink-0" style={{ width: 130 }}>
            <div className="bg-[#c8e6c9] text-[#2e7d32] text-xs font-bold px-3 py-1.5 rounded-md mb-3 text-center w-full">
              Scoring
            </div>
            <div className="bg-[#e8f5e9] border border-[#a5d6a7] rounded-lg p-3 w-full space-y-2 min-h-[80px] flex flex-col justify-center">
              <div className="bg-white rounded px-2 py-1.5 text-xs font-medium text-center shadow-sm border border-[#a5d6a7]">Rank recommendations</div>
              <div className="bg-white rounded px-2 py-1.5 text-xs font-medium text-center shadow-sm border border-[#a5d6a7]">Top-N suggestions</div>
            </div>
          </div>

          <div className="flex items-center self-center pt-6 flex-shrink-0"><ChevronRight className="w-5 h-5 text-[var(--muted-foreground)]" /></div>

          {/* Stage 7: Storage */}
          <div className="flex flex-col items-center flex-shrink-0" style={{ width: 110 }}>
            <div className="bg-[#e0e0e0] text-[#424242] text-xs font-bold px-3 py-1.5 rounded-md mb-3 text-center w-full">
              Storage
            </div>
            <div className="bg-[#f5f5f5] border border-[#bdbdbd] rounded-lg p-3 w-full space-y-2 min-h-[80px] flex flex-col justify-center">
              <div className="flex justify-center mb-1">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#757575" strokeWidth="1.5">
                  <ellipse cx="12" cy="6" rx="8" ry="3" />
                  <path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
                  <path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
                </svg>
              </div>
              <div className="bg-white rounded px-2 py-1 text-xs font-medium text-center shadow-sm border border-[#bdbdbd]">Rule Database</div>
              <div className="bg-white rounded px-2 py-1 text-xs font-medium text-center shadow-sm border border-[#bdbdbd]">Processed</div>
            </div>
          </div>

          <div className="flex items-center self-center pt-6 flex-shrink-0"><ChevronRight className="w-5 h-5 text-[var(--muted-foreground)]" /></div>

          {/* Stage 8: Recommendations */}
          <div className="flex flex-col items-center flex-shrink-0" style={{ width: 130 }}>
            <div className="bg-[#e1bee7] text-[#6a1b9a] text-xs font-bold px-3 py-1.5 rounded-md mb-3 text-center w-full">
              Recommendations
            </div>
            <div className="bg-[#f3e5f5] border border-[#ce93d8] rounded-lg p-3 w-full space-y-1.5 min-h-[80px] flex flex-col justify-center">
              <div className="bg-white rounded px-2 py-1 text-xs font-medium text-center shadow-sm border border-[#ce93d8]">Retrieve best rules</div>
              <div className="bg-white rounded px-2 py-1 text-xs font-medium text-center shadow-sm border border-[#ce93d8]">Match user selection</div>
              <div className="bg-white rounded px-2 py-1 text-xs font-medium text-center shadow-sm border border-[#ce93d8]">Send suggestions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Hosted Web UI Section */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 shadow-sm">
        <div className="text-center mb-4">
          <div className="inline-block bg-[#f5f5f5] border border-[#bdbdbd] rounded-lg px-6 py-2">
            <h3 className="font-semibold text-sm text-gray-700">Hosted Web UI</h3>
          </div>
        </div>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <div className="bg-[#f5f5f5] border border-[#bdbdbd] rounded-lg px-5 py-3 text-center">
            <p className="text-xs font-medium text-gray-600">Menu browsing</p>
          </div>
          <ChevronRight className="w-4 h-4 text-[var(--muted-foreground)]" />
          <div className="bg-[#f5f5f5] border border-[#bdbdbd] rounded-lg px-5 py-3 text-center">
            <p className="text-xs font-medium text-gray-600">User item selection</p>
          </div>
          <ChevronRight className="w-4 h-4 text-[var(--muted-foreground)]" />
          <div className="bg-[#f5f5f5] border border-[#bdbdbd] rounded-lg px-5 py-3 text-center">
            <p className="text-xs font-medium text-gray-600">Shows recommendations</p>
          </div>
        </div>
        <div className="flex justify-between mt-4 px-8">
          <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
            <span>Feeds back into <strong>Data Source</strong></span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
            <span>Powered by <strong>Recommendations</strong> engine</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[#fff9c4] border border-[#fdd835]"></div>
            <span className="text-xs text-[var(--muted-foreground)]">Input / Cleaning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[#e8f5e9] border border-[#a5d6a7]"></div>
            <span className="text-xs text-[var(--muted-foreground)]">Encoding / Scoring</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[#e3f2fd] border border-[#90caf9]"></div>
            <span className="text-xs text-[var(--muted-foreground)]">Mining Engine / Rules</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[#f5f5f5] border border-[#bdbdbd]"></div>
            <span className="text-xs text-[var(--muted-foreground)]">Storage / UI</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[#f3e5f5] border border-[#ce93d8]"></div>
            <span className="text-xs text-[var(--muted-foreground)]">Recommendations</span>
          </div>
        </div>
      </div>
    </div>
  );
}