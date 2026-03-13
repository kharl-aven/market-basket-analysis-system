import { useState } from "react";
import { Search } from "lucide-react";

interface MenuItem {
  name: string;
  price: number;
  category: "Mains" | "Desserts" | "Drinks";
  image: string;
}

const MENU: MenuItem[] = [
  { name: "The Pikachu Hamburger",                                   price: 480, category: "Mains",    image: "/images/The Pikachu Hamburger.png" },
  { name: "Snorlax's Tummy Filling Nap Lunch Plate",                price: 620, category: "Mains",    image: "/images/Snorlax's Tummy Filling Nap Lunch Plate.png" },
  { name: "Pikachu and Squirtle's Best Friends Forever Curry Plate",price: 550, category: "Mains",    image: "/images/Pikachu and Squirtle's Best Friends Forever Curry Plate.png" },
  { name: "Rice Plate Meal with Eevee",                              price: 520, category: "Mains",    image: "/images/Rice Plate Meal with Eevee.png" },
  { name: "Paldean Form Wooper Burger",                              price: 490, category: "Mains",    image: "/images/Paldean Form Wooper Burger.png" },
  { name: "Clodsire Soup Pot",                                       price: 380, category: "Mains",    image: "/images/Clodsire Soup Pot.png" },
  { name: "Pokémon Café's Pikachu Soufflé Pancake",                price: 380, category: "Desserts", image: "/images/Pokemon Cafe's Pikachu Souffle Pancake.png" },
  { name: "Pokémon Café's Berry Chocolate Parfait",                 price: 420, category: "Desserts", image: "/images/Pokemon Cafe's Berry Chocolate Parfait.png" },
  { name: "Poké Ball Dessert Bowl",                                  price: 350, category: "Desserts", image: "/images/Poke Ball Dessert Bowl.png" },
  { name: "Assorted Dragon-Type Sweets",                             price: 440, category: "Desserts", image: "/images/Assorted Dragon-Type Sweets.png" },
  { name: "Cocoa",                                                   price: 240, category: "Desserts", image: "/images/Cocoa.png" },
  { name: "Fuecoco's Apple Soda Float",                            price: 280, category: "Drinks",   image: "/images/Fuecoco's Apple Soda Float.png" },
  { name: "Quaxly's Ramune Soda Float",                            price: 280, category: "Drinks",   image: "/images/Quaxly's Ramune Soda Float.png" },
  { name: "Gengar's Confuse Ray Smoothie",                         price: 320, category: "Drinks",   image: "/images/Gengar's Confuse Ray Smoothie.png" },
  { name: "Say Hello to Eevee's Royal Milk Tea",                   price: 300, category: "Drinks",   image: "/images/Say Hello to Eevee's Royal Milk Tea.png" },
  { name: "Pokémon Latte",                                           price: 260, category: "Drinks",   image: "/images/Pokemon Latte.png" },
];

const CAT_STYLE: Record<string, { badge: string; header: string }> = {
  Mains:    { badge: "bg-orange-100 text-orange-700 border-orange-200", header: "bg-orange-50 border-orange-200" },
  Desserts: { badge: "bg-pink-100 text-pink-700 border-pink-200",       header: "bg-pink-50 border-pink-200"     },
  Drinks:   { badge: "bg-blue-100 text-blue-700 border-blue-200",       header: "bg-blue-50 border-blue-200"     },
};
const CAT_EMOJI: Record<string, string> = { Mains: "🍽️", Desserts: "🍰", Drinks: "🥤" };

export function MenuPriceListTab() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const categories = ["All", "Mains", "Desserts", "Drinks"];

  const filtered = MENU.filter(item =>
    (activeCategory === "All" || item.category === activeCategory) &&
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = (["Mains","Desserts","Drinks"] as const).reduce<Record<string,MenuItem[]>>((acc, cat) => {
    acc[cat] = filtered.filter(i => i.category === cat);
    return acc;
  }, {} as any);

  return (
    <div className="space-y-6 animate-pokefade">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-black text-[var(--foreground)]">🍽️ Menu</h2>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            Pokémon Café — {MENU.length} items across 3 categories
          </p>
        </div>
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-2 text-center shadow-sm">
          <p className="text-xl font-black text-[var(--pokered)]">{MENU.length}</p>
          <p className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">Items</p>
        </div>
      </div>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 shadow-sm flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]"/>
          <input type="text" placeholder="Search menu items..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-sm focus:outline-none focus:border-[var(--pokered)] transition-colors"/>
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                activeCategory === cat
                  ? "bg-[var(--pokered)] text-white border-[var(--pokered)] shadow-sm"
                  : "bg-[var(--input-background)] border-[var(--border)] text-[var(--foreground)] hover:border-[var(--pokered)]"
              }`}>
              {cat !== "All" && <span className="mr-1">{CAT_EMOJI[cat]}</span>}{cat}
            </button>
          ))}
        </div>
      </div>

      {(activeCategory === "All" ? ["Mains","Desserts","Drinks"] : [activeCategory]).map(cat => {
        const items = activeCategory === "All" ? grouped[cat] : filtered;
        if(!items?.length) return null;
        const s = CAT_STYLE[cat];
        return (
          <div key={cat} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm poke-card">
            <div className={`px-6 py-3 ${s.header} border-b flex items-center gap-3`}>
              <span className="text-xl">{CAT_EMOJI[cat]}</span>
              <h3 className="font-black text-base text-[var(--foreground)]">{cat}</h3>
              <span className={`badge-poke border ${s.badge} ml-auto`}>{items.length} items</span>
            </div>
            <div className="p-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {items.map(item => (
                <div key={item.name}
                  className="group flex flex-col rounded-xl border border-[var(--border)] bg-[var(--secondary)]/30 hover:bg-[var(--secondary)] hover:border-[var(--pokered)]/40 transition-all overflow-hidden">
                  <div className="w-full aspect-square bg-[var(--secondary)] overflow-hidden">
                    <img src={item.image} alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e)=>{ (e.target as HTMLImageElement).src="/images/Poke Ball Dessert Bowl.png"; }}/>
                  </div>
                  <div className="px-3 py-2.5 flex-1 flex flex-col justify-between">
                    <p className="text-[11px] font-bold text-[var(--foreground)] leading-tight line-clamp-2 mb-1.5">{item.name}</p>
                    <div className="flex items-center justify-between">
                      <span className={`badge-poke border ${s.badge} text-[9px]`}>{cat}</span>
                      <span className="text-sm font-black text-[var(--foreground)]">₱{item.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-[var(--card)] border border-[var(--border)] rounded-2xl">
          <span className="text-5xl">🔍</span>
          <p className="mt-3 font-bold text-[var(--muted-foreground)]">No items match your search.</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {(["Mains","Desserts","Drinks"] as const).map(cat => {
          const items = MENU.filter(i => i.category === cat);
          const s = CAT_STYLE[cat];
          return (
            <div key={cat} className={`rounded-2xl p-4 border ${s.header} shadow-sm`}>
              <p className="text-sm font-black text-[var(--foreground)] mb-2">{CAT_EMOJI[cat]} {cat}</p>
              <div className="flex justify-between text-xs text-[var(--muted-foreground)] font-semibold">
                <span>From <span className="font-black text-[var(--foreground)]">₱{Math.min(...items.map(i=>i.price))}</span></span>
                <span>Up to <span className="font-black text-[var(--foreground)]">₱{Math.max(...items.map(i=>i.price))}</span></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
