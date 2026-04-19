import { AnimatePresence, motion } from "motion/react";
import { Gamepad2, Info, LayoutGrid, Maximize2, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import gamesData from "./games.json";

export default function App() {
  const [games] = useState(gamesData);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedGame, setSelectedGame] = useState(null);
  const [isIframeLoading, setIsIframeLoading] = useState(true);

  const categories = useMemo(() => {
    const cats = new Set(games.map((g) => g.category));
    return ["All", ...Array.from(cats)];
  }, [games]);

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const name = game.name || "";
      const description = game.description || "";
      const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || game.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [games, searchQuery, selectedCategory]);

  useEffect(() => {
    if (selectedGame) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [selectedGame]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-brand-primary selection:text-zinc-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary p-2 text-zinc-950">
              <Gamepad2 size={24} />
            </div>
            <h1 className="text-xl font-extrabold tracking-tighter md:text-2xl">
              GAME<span className="text-brand-primary">VAULT</span>
            </h1>
          </div>

          <div className="hidden items-center gap-6 md:flex">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-64 rounded-xl border border-zinc-800 bg-zinc-900 pl-10 pr-4 outline-none ring-brand-primary/20 transition-all focus:border-brand-primary focus:ring-4"
              />
            </div>
            <button className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">
              <Info size={18} />
              About
            </button>
          </div>
          
          <div className="md:hidden">
            <Search className="text-zinc-400" size={24} onClick={() => {}} />
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        {/* Categories Bar */}
        <section className="mb-12">
          <div className="mb-6 flex items-center gap-2">
            <LayoutGrid size={20} className="text-brand-primary" />
            <h2 className="text-lg font-semibold tracking-tight">Categories</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-brand-primary text-zinc-950 shadow-lg shadow-brand-primary/20"
                    : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Search Mobile */}
        <div className="mb-8 md:hidden">
           <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 outline-none focus:border-brand-primary"
              />
        </div>

        {/* Games Grid */}
        <section>
          {filteredGames.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredGames.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedGame(game)}
                  className="group cursor-pointer overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 transition-all hover:border-brand-primary/50 hover:shadow-2xl hover:shadow-brand-primary/5"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={game.thumbnail}
                      alt={game.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                      <button className="w-full rounded-lg bg-brand-primary py-2 text-sm font-bold text-zinc-950">
                        Play Now
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="mb-1 flex items-center justify-between">
                      <h3 className="font-bold tracking-tight text-zinc-100">{game.name}</h3>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-brand-secondary">
                        {game.category}
                      </span>
                    </div>
                    <p className="line-clamp-2 text-xs text-zinc-400 group-hover:text-zinc-300">
                      {game.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-800 text-center">
              <Search size={48} className="mb-4 text-zinc-700" />
              <h3 className="text-xl font-bold">No games found</h3>
              <p className="text-zinc-500">Try adjusting your search or category filters.</p>
              <button 
                onClick={() => {setSearchQuery(""); setSelectedCategory("All");}}
                className="mt-6 text-brand-primary hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Game Player Modal */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/95 p-4 backdrop-blur-sm"
          >
            <motion.div
              layoutId={selectedGame.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative h-full max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl"
            >
              {/* Toolbar */}
              <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/50 p-4 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary text-zinc-950">
                     <Gamepad2 size={18} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold leading-none">{selectedGame.name}</h2>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500">{selectedGame.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100">
                    <Maximize2 size={20} />
                  </button>
                  <button 
                    onClick={() => {setSelectedGame(null); setIsIframeLoading(true);}}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 text-zinc-100 hover:bg-zinc-700 transition-transform active:scale-95"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Player Area */}
              <div className="relative h-[calc(100%-72px)] w-full bg-black">
                {isIframeLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" />
                    <p className="mt-4 animate-pulse text-sm font-medium text-zinc-400">Loading Game Assets...</p>
                  </div>
                )}
                <iframe
                  src={selectedGame.iframeUrl}
                  className="h-full w-full border-none"
                  onLoad={() => setIsIframeLoading(false)}
                  allow="fullscreen"
                  title={selectedGame.name}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="mt-20 border-t border-zinc-900 py-12">
        <div className="mx-auto max-w-7xl px-4 text-center md:px-8">
          <div className="mb-6 flex items-center justify-center gap-3">
             <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 p-2 text-zinc-400 transition-colors">
              <Gamepad2 size={16} />
            </div>
            <h2 className="font-bold tracking-tighter">GAMEVAULT</h2>
          </div>
          <p className="text-xs text-zinc-500">
            &copy; 2026 GameVault Unblocked. All Rights Reserved.
            <br />
            Games are property of their respective owners.
          </p>
        </div>
      </footer>
    </div>
  );
}
