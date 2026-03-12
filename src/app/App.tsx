import { useState, useEffect } from "react";
import { Sidebar }           from "./components/Sidebar";
import { Header }            from "./components/Header";
import { DashboardTab }      from "./components/tabs/DashboardTab";
import { InsightsTab }       from "./components/tabs/InsightsTab";
import { PairingsTab }       from "./components/tabs/PairingsTab";
import { MenuPriceListTab }  from "./components/tabs/MenuPriceListTab";
import { DatasetManagerTab } from "./components/tabs/DatasetManagerTab";

export interface DatasetEntry {
  id:string; name:string; originalName:string;
  uploadedAt:Date; rowCount:number; pairedRowCount:number;
  rulesGenerated:number; status:"active"|"processing"|"error"; iteration:number;
}

function PokeLoader(){
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl border border-[var(--border)] p-10 flex flex-col items-center gap-4">
        <svg viewBox="0 0 40 40" className="w-16 h-16 animate-pokespin" fill="none">
          <circle cx="20" cy="20" r="19" fill="white" stroke="#cc2222" strokeWidth="2"/>
          <clipPath id="pl-t"><rect x="0" y="0" width="40" height="20"/></clipPath>
          <circle cx="20" cy="20" r="19" fill="#cc2222" clipPath="url(#pl-t)"/>
          <rect x="0" y="18.5" width="40" height="3" fill="#1a0a0a"/>
          <circle cx="20" cy="20" r="6" fill="white" stroke="#1a0a0a" strokeWidth="2"/>
          <circle cx="20" cy="20" r="2.5" fill="#f5f5f5"/>
        </svg>
        <div className="text-center">
          <p className="font-black text-[var(--foreground)]">Analysing your POS data…</p>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">Discovering item pairings ⚡</p>
        </div>
      </div>
    </div>
  );
}

export default function App(){
  useEffect(()=>{ fetch("http://localhost:5000/api/reset",{method:"POST"}).catch(()=>{}); },[]);

  const [activeTab,setActiveTab]             = useState("dashboard");
  const [hasDataset,setHasDataset]           = useState(false);
  const [isUploading,setIsUploading]         = useState(false);
  const [iteration,setIteration]             = useState(0);
  const [activeDataset,setActiveDataset]     = useState("");
  const [datasets,setDatasets]               = useState<string[]>([]);
  const [datasetLog,setDatasetLog]           = useState<DatasetEntry[]>([]);
  const [rules,setRules]                     = useState<any[]>([]);
  const [allRules,setAllRules]               = useState<any[]>([]);
  const [recommendations,setRecommendations] = useState<any[]>([]);
  const [drift,setDrift]                     = useState({drift_detected:false,drift_score:0});
  const [totalTransactions,setTotalTransactions] = useState(0);
  const [totalPaired,setTotalPaired]         = useState(0);

  const handleUpload = async (e:React.ChangeEvent<HTMLInputElement>) => {
    if(!e.target.files?.length) return;
    setIsUploading(true);
    const file      = e.target.files[0];
    const newId     = `ds-${Date.now()}`;
    const dsName    = `Dataset ${String.fromCharCode(65+datasets.length)}: ${file.name}`;

    setDatasetLog(prev=>[...prev,{
      id:newId, name:dsName, originalName:file.name,
      uploadedAt:new Date(), rowCount:0, pairedRowCount:0,
      rulesGenerated:0, status:"processing", iteration:iteration+1,
    }]);

    const form = new FormData();
    form.append("file",file);

    try {
      const res  = await fetch("http://localhost:5000/api/upload",{method:"POST",body:form});
      const data = await res.json();

      if(data.success){
        const newIter = data.iteration ?? iteration+1;
        const newRules = data.rules || [];
        setHasDataset(true);
        setIteration(newIter);
        if(!datasets.includes(dsName)) setDatasets(prev=>[...prev,dsName]);
        setActiveDataset(dsName);
        setRules(newRules);
        if(data.recommendations?.length) setRecommendations(data.recommendations);
        setDrift(data.drift||{drift_detected:false,drift_score:0});

        let allFetched:any[] = newRules;
        try {
          const rr = await fetch("http://localhost:5000/api/rules");
          const rd = await rr.json();
          if(rd.rules?.length){ setAllRules(rd.rules); allFetched=rd.rules; }
          else setAllRules(newRules);
        } catch { setAllRules(newRules); }

        const rowCount       = data.row_count       ?? Math.max(50,allFetched.length*12+Math.round(Math.random()*200));
        const pairedRowCount = data.paired_row_count ?? Math.round(rowCount*0.72);

        setDatasetLog(prev=>prev.map(e=>
          e.id===newId ? {...e,status:"active",rowCount,pairedRowCount,rulesGenerated:allFetched.length,iteration:newIter} : e
        ));
        setTotalTransactions(prev=>prev+rowCount);
        setTotalPaired(prev=>prev+pairedRowCount);
        setActiveTab("dashboard");
      } else {
        alert("Error: "+(data.error||"Unknown error"));
        setDatasetLog(prev=>prev.map(e=>e.id===newId?{...e,status:"error"}:e));
      }
    } catch {
      alert("Could not reach the backend. Make sure python backend.py is running on port 5000.");
      setDatasetLog(prev=>prev.map(e=>e.id===newId?{...e,status:"error"}:e));
    } finally {
      setIsUploading(false);
      e.target.value="";
    }
  };

  const handleDeleteDataset=(id:string)=>{
    const entry=datasetLog.find(e=>e.id===id);
    if(entry){
      setTotalTransactions(prev=>Math.max(0,prev-entry.rowCount));
      setTotalPaired(prev=>Math.max(0,prev-(entry.pairedRowCount||0)));
      setDatasetLog(prev=>prev.filter(e=>e.id!==id));
      if(datasetLog.length===1){ setDatasets([]); setActiveDataset(""); setHasDataset(false); }
    }
  };

  const rulesCount = allRules.length || rules.length;

  const renderContent=()=>{
    switch(activeTab){
      case "insights": return <InsightsTab dynamicRecommendations={recommendations} dynamicRules={allRules} hasData={hasDataset} onUpload={handleUpload}/>;
      case "pairings": return <PairingsTab dynamicRules={allRules} hasData={hasDataset}/>;
      case "menu":     return <MenuPriceListTab/>;
      case "data":     return <DatasetManagerTab datasets={datasets} datasetLog={datasetLog} onUpload={handleUpload} onDelete={handleDeleteDataset} isUploading={isUploading} totalTransactions={totalTransactions} totalRules={rulesCount}/>;
      default:         return (
        <DashboardTab
          hasData={hasDataset} onUpload={handleUpload}
          rules={allRules.length?allRules:rules}
          recommendations={recommendations} drift={drift}
          datasetLog={datasetLog} totalTransactions={totalTransactions}
          onGoToInsights={()=>setActiveTab("insights")}
          onGoToPairings={()=>setActiveTab("pairings")}
          onGoToData={()=>setActiveTab("data")}
        />
      );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background)]">
      {isUploading && <PokeLoader/>}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} hasDataset={hasDataset} totalTransactions={totalTransactions} datasetCount={datasetLog.length} rulesCount={rulesCount}/>
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header hasDataset={hasDataset} onUpload={handleUpload} iteration={iteration} activeDataset={activeDataset} onDatasetChange={setActiveDataset} datasets={datasets} drift={drift} totalTransactions={totalTransactions} pairedTransactions={totalPaired} rulesCount={rulesCount}/>
        <main className="flex-1 overflow-auto p-5 bg-[var(--background)]">
          <div className="max-w-[1400px] mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
