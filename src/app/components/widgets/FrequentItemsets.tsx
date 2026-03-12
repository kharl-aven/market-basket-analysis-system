import { Sparkles } from "lucide-react";

export function FrequentItemsets() {
  const itemsets = [
    { items: "Paldean Wooper Burger + Fuecoco Apple Float", support: 42.3 },
    { items: "Gengar Smoothie + Clodsire Soup", support: 38.7 },
    { items: "Dragon-Type Sweets + Royal Milk Tea", support: 35.1 },
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 h-full">
      <h3 className="mb-4">Top Frequent Itemsets</h3>
      
      <div className="space-y-3">
        {itemsets.map((itemset, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-[var(--input-background)] rounded-lg border border-border hover:border-primary transition-colors"
          >
            <div className="flex-1">
              <p className="font-medium">{itemset.items}</p>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-2 bg-muted rounded-full w-32 overflow-hidden">
                  <div
                    className="h-full bg-[var(--pikachu-yellow)]"
                    style={{ width: `${itemset.support}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-[var(--pikachu-yellow)]">
                  {itemset.support}%
                </span>
              </div>
            </div>
            
            <button className="ml-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Generate Promo
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Based on 2,847 transactions in current dataset
        </p>
      </div>
    </div>
  );
}
