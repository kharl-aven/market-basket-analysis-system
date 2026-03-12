import { useState } from "react";
import { Search, Tag } from "lucide-react";

interface MenuItem {
  name: string;
  price: number;
  category: "Mains" | "Desserts" | "Drinks";
  emoji: string;
}

const MENU: MenuItem[] = [
  // Mains
  { name: "The Pikachu Hamburger",                                    price: 480,  category: "Mains",    emoji: "🍔" },
  { name: "Snorlax's Tummy Filling Nap Lunch Plate",                  price: 620,  category: "Mains",    emoji: "🍱" },
  { name: "Pikachu and Squirtle's Best Friends Forever Curry Plate",  price: 550,  category: "Mains",    emoji: "🍛" },
  { name: "Rice Plate Meal with Eevee",                               price: 520,  category: "Mains",    emoji: "🍚" },
  { name: "Paldean Form Wooper Burger",                               price: 490,  category: "Mains",    emoji: "🍔" },
  { name: "Clodsire Soup Pot",                                        price: 380,  category: "Mains",    emoji: "🍲" },
  // Desserts
  { name: "Pokémon Café's Pikachu Soufflé Pancake",                  price: 380,  category: "Desserts", emoji: "🥞" },
  { name: "Pokémon Café's Berry Chocolate Parfait",                   price: 420,  category: "Desserts", emoji: "🍫" },
  { name: "Poké Ball Dessert Bowl",                                   price: 350,  category: "Desserts", emoji: "🍨" },
  { name: "Assorted Dragon-Type Sweets",                              price: 440,  category: "Desserts", emoji: "🍬" },
  // Drinks
  { name: "Fuecoco's Apple Soda Float",                               price: 280,  category: "Drinks",   emoji: "🍎" },
  { name: "Quaxly's Ramune Soda Float",                               price: 280,  category: "Drinks",   emoji: "💧" },
  { name: "Gengar's Confuse Ray Smoothie",                            price: 320,  category: "Drinks",   emoji: "👻" },
  { name: "Say Hello to Eevee's Royal Milk Tea",                      price: 300,  category: "Drinks",   emoji: "🍵" },
  { name: "Pokémon Latte",                                            price: 260,  category: "Drinks",   emoji: "☕" },
  { name: "Cocoa",                                                    price: 240,  category: "Desserts", emoji: "🍫" },
];

const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  Mains:    { bg: "bg-[#fff3e0]", border: "border-orange-200", text: "text-orange-700", badge: "bg-orange-100 text-orange-700 border-orange-300" },
  Desserts: { bg: "bg-[#fce4ec]", border: "border-pink-200",   text: "text-pink-700",   badge: "bg-pink-100 text-pink-700 border-pink-300"       },
  Drinks:   { bg: "bg-[#e3f2fd]", border: "border-blue-200",   text: "text-blue-700",   badge: "bg-blue-100 text-blue-700 border-blue-300"        },
};

const CATEGORY_EMOJI: Record<string, string> = { Mains: "🍽️", Desserts: "🍰", Drinks: "🥤" };

export function MenuPriceListTab() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const categories = ["All", "Mains", "Desserts", "Drinks"];

  const filtered = MENU.filter(item => {
    const matchCat = activeCategory === "All" || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const grouped = categories.slice(1).reduce<Record<string, MenuItem[]>>((acc, cat) => {
    acc[cat] = filtered.filter(i => i.category === cat);
    return acc;
  }, {});

  const totalItems = MENU.length;
  const avgPrice = Math.round(MENU.reduce((s, i) => s + i.price, 0) / MENU.length);

  return (
    <div className="space-y-6 animate-pokefade">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-black text-[var(--foreground)] flex items-center gap-2">
            🍽️ Menu & Price Reference
          </h2>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            Official Pokémon Café menu — {totalItems} items across 3 categories
          </p>
        </div>
        <div className="flex gap-3">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-2 text-center shadow-sm">
            <p className="text-xl font-black text-[var(--pokered)]">{totalItems}</p>
            <p className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">Menu Items</p>
          </div>
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-2 text-center shadow-sm">
            <p className="text-xl font-black text-[var(--cafe-wood)]">₱{avgPrice}</p>
            <p className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">Avg Price</p>
          </div>
        </div>
      </div>

      {/* Pokeball divider with search + filter */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 shadow-sm flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-sm focus:outline-none focus:border-[var(--pokered)] transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                activeCategory === cat
                  ? "bg-[var(--pokered)] text-white border-[var(--pokered)] shadow-sm"
                  : "bg-[var(--input-background)] border-[var(--border)] text-[var(--foreground)] hover:border-[var(--pokered)]"
              }`}
            >
              {cat !== "All" && <span className="mr-1">{CATEGORY_EMOJI[cat]}</span>}
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu by category */}
      {(activeCategory === "All" ? ["Mains", "Desserts", "Drinks"] : [activeCategory]).map(cat => {
        const items = activeCategory === "All" ? grouped[cat] : filtered;
        if (!items || items.length === 0) return null;
        const colors = CATEGORY_COLORS[cat];
        return (
          <div key={cat} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm poke-card">
            {/* Category Header */}
            <div className={`px-6 py-3 ${colors.bg} border-b ${colors.border} flex items-center gap-3`}>
              <span className="text-xl">{CATEGORY_EMOJI[cat]}</span>
              <h3 className={`font-black text-base ${colors.text}`}>{cat}</h3>
              <span className={`badge-poke border ${colors.badge} ml-auto`}>
                {items.length} items
              </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--muted)]/30">
                    <th className="text-left px-6 py-3 text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider w-10">#</th>
                    <th className="text-left px-4 py-3 text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider">Item Name</th>
                    <th className="text-left px-4 py-3 text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider">Category</th>
                    <th className="text-right px-6 py-3 text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr
                      key={item.name}
                      className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--secondary)] transition-colors group"
                    >
                      <td className="px-6 py-3.5 text-sm font-bold text-[var(--muted-foreground)]">{i + 1}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="text-xl group-hover:scale-110 transition-transform">{item.emoji}</span>
                          <span className="font-semibold text-sm text-[var(--foreground)]">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`badge-poke border ${colors.badge}`}>
                          {CATEGORY_EMOJI[item.category]} {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Tag className="w-3.5 h-3.5 text-[var(--cafe-wood)]" />
                          <span className="font-black text-base text-[var(--foreground)]">₱{item.price}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

      {/* Price summary */}
      <div className="grid grid-cols-3 gap-4">
        {["Mains", "Desserts", "Drinks"].map(cat => {
          const items = MENU.filter(i => i.category === cat);
          const min = Math.min(...items.map(i => i.price));
          const max = Math.max(...items.map(i => i.price));
          const colors = CATEGORY_COLORS[cat];
          return (
            <div key={cat} className={`rounded-2xl p-4 border ${colors.border} ${colors.bg} shadow-sm`}>
              <p className={`text-sm font-black ${colors.text} mb-2`}>{CATEGORY_EMOJI[cat]} {cat}</p>
              <div className="flex justify-between text-xs text-[var(--muted-foreground)] font-semibold">
                <span>From <span className="font-black text-[var(--foreground)]">₱{min}</span></span>
                <span>Up to <span className="font-black text-[var(--foreground)]">₱{max}</span></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
