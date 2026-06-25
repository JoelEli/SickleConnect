import React, { useState } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Search, Loader2, Stethoscope, Activity, Brain, Megaphone,
  ArrowRight, Sparkles, BookOpen, Clock,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api';
import DarkNavbar from '@/shared/components/DarkNavbar';
import DarkFooter from '@/shared/components/DarkFooter';
import PageWrapper from '@/shared/components/PageWrapper';

const stagger = { animate: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } };
const fadeUp = { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } };

const categories = [
  { icon: Stethoscope, title: 'Treatment Guides', description: 'Expert protocols and medical frameworks for all stages.', color: 'text-[#cabeff]', bg: 'bg-[#cabeff]/10', hoverBg: 'hover:bg-[#cabeff]/20' },
  { icon: Activity, title: 'Pain Tracking', description: 'Digital tools and logs to monitor and report pain patterns.', color: 'text-[#7bd0ff]', bg: 'bg-[#7bd0ff]/10', hoverBg: 'hover:bg-[#7bd0ff]/20' },
  { icon: Brain, title: 'Mental Health', description: 'Psychological resilience resources and peer support tips.', color: 'text-[#ffb77f]', bg: 'bg-[#ffb77f]/10', hoverBg: 'hover:bg-[#ffb77f]/20' },
  { icon: Megaphone, title: 'Advocacy Tools', description: 'Templates and kits to help you speak up for your health.', color: 'text-[#ffb4ab]', bg: 'bg-[#ffb4ab]/10', hoverBg: 'hover:bg-[#ffb4ab]/20' },
];

const featuredResources = [
  { tag: 'Guide', tagColor: 'bg-[#cabeff]/20 text-[#cabeff] border-[#cabeff]/30', title: 'Managing Fatigue', description: 'Practical lifestyle adjustments and medical insights to help you maintain energy throughout the week.', readTime: '12 min read', gradient: 'from-[#cabeff]/15 via-[#937dff]/10 to-transparent' },
  { tag: 'Nutrition', tagColor: 'bg-[#7bd0ff]/20 text-[#7bd0ff] border-[#7bd0ff]/30', title: 'Nutrition for Warriors', description: 'A breakdown of key nutrients, hydration tips, and recipes tailored for managing sickle cell symptoms.', readTime: '8 min read', gradient: 'from-[#7bd0ff]/15 via-[#00a6e0]/10 to-transparent' },
  { tag: 'Admin', tagColor: 'bg-[#ffb77f]/20 text-[#ffb77f] border-[#ffb77f]/30', title: 'Navigating Insurance', description: 'Step-by-step toolkit for understanding coverage, appealing denials, and managing healthcare costs.', readTime: '15 min read', gradient: 'from-[#ffb77f]/15 via-[#d6791f]/10 to-transparent' },
];

interface SearchResult {
  id: string;
  type: 'post' | 'user';
  content?: string;
  fullName?: string;
  role?: 'patient' | 'doctor';
  genotype?: string;
  likesCount?: number;
  commentsCount?: number;
  bio?: string;
}

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#0b1326]"><Loader2 className="h-8 w-8 animate-spin text-[#cabeff]" /></div>;
  }
  if (!user) return <Navigate to="/auth" replace />;

  const doSearch = async (q: string, type = 'all') => {
    if (!q.trim()) { setResults([]); return; }
    setIsLoading(true);
    setHasSearched(true);
    try {
      const data = await apiClient.search(q, type) as any;
      setResults(data.results || []);
    } catch { setResults([]); }
    finally { setIsLoading(false); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: query });
    doSearch(query, activeTab);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (query) doSearch(query, tab);
  };

  const filtered = (type?: string) => (!type || type === 'all') ? results : results.filter(r => r.type === type);
  const glass = 'bg-[#161f35]/60 backdrop-blur-xl border border-white/[0.1]';

  return (
    <PageWrapper>
      <div className="min-h-screen bg-[#0b1326] text-[#dbe2fd] flex flex-col">
        <DarkNavbar />

        <main className="flex-grow">
          {/* Hero */}
          <section className="relative py-20 md:py-32 px-6 md:px-10 overflow-hidden" style={{
            background: 'radial-gradient(circle at 20% 30%, rgba(124,93,255,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(56,189,248,0.1) 0%, transparent 50%)'
          }}>
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#cabeff]/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#7bd0ff]/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-[1200px] mx-auto text-center relative z-10">
              <motion.div {...fadeUp}>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] mb-8 backdrop-blur-md text-sm font-semibold text-[#cabeff]">
                  <Sparkles className="h-3.5 w-3.5" />
                  medically-vetted knowledge
                </span>

                <h1 className="text-3xl md:text-5xl lg:text-[64px] font-bold leading-tight mb-6 tracking-tight">
                  Empowering You with{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#cabeff] to-[#7bd0ff]">Knowledge</span>
                </h1>

                <p className="text-lg text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed">
                  A curated collection of medically-vetted guides, research, and tools specifically designed for the sickle cell community.
                </p>

                {/* Search Bar */}
                <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
                  <div className="relative flex items-center bg-[#131b2e] border border-white/[0.08] rounded-2xl p-2 focus-within:shadow-[0_0_15px_rgba(124,93,255,0.2)] focus-within:border-[#7c5dff] transition-all">
                    <Search className="h-5 w-5 text-[#938ea1] ml-4 mr-2 shrink-0" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-white placeholder:text-[#938ea1] py-3 text-base"
                      placeholder="Search resources..."
                    />
                    <Button type="submit" size="sm" className="bg-[#937dff] hover:bg-[#7c5dff] text-white border-0 px-6 py-2.5 rounded-xl shrink-0">
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Find'}
                    </Button>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3 mt-6">
                    <span className="text-xs text-[#938ea1]">Trending:</span>
                    {['Crisis management', 'Voxelotor info', 'Hydroxyurea'].map(t => (
                      <button key={t} type="button" onClick={() => { setQuery(t); doSearch(t); }} className="text-xs text-[#7bd0ff] hover:underline">
                        {t}
                      </button>
                    ))}
                  </div>
                </form>
              </motion.div>
            </div>
          </section>

          {/* Search Results (if searched) */}
          <AnimatePresence>
            {hasSearched && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-16 px-6 md:px-10"
              >
                <div className="max-w-[1200px] mx-auto">
                  <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-2xl font-bold">Results</h2>
                    <div className="flex gap-2">
                      {['all', 'posts', 'users'].map(tab => (
                        <button
                          key={tab}
                          onClick={() => handleTabChange(tab)}
                          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all capitalize ${
                            activeTab === tab
                              ? 'bg-[#cabeff]/15 text-[#cabeff] border border-[#cabeff]/30'
                              : 'text-white/40 border border-white/[0.06] hover:text-white/60'
                          }`}
                        >
                          {tab} ({filtered(tab).length})
                        </button>
                      ))}
                    </div>
                  </div>

                  {isLoading ? (
                    <div className="text-center py-16"><Loader2 className="h-8 w-8 animate-spin text-[#cabeff] mx-auto" /></div>
                  ) : filtered(activeTab).length === 0 ? (
                    <div className="text-center py-16">
                      <Search className="h-12 w-12 text-white/10 mx-auto mb-4" />
                      <p className="text-white/30">No results found for "{query}"</p>
                    </div>
                  ) : (
                    <motion.div variants={stagger} initial="initial" animate="animate" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filtered(activeTab).map((r) => (
                        <motion.div key={r.id} variants={fadeUp}>
                          <div className={`${glass} rounded-2xl p-5 hover:border-[#cabeff]/30 hover:shadow-[0_0_20px_rgba(124,93,255,0.1)] hover:-translate-y-1 transition-all`}>
                            {r.type === 'post' ? (
                              <div>
                                <div className="flex items-center gap-2 mb-3">
                                  <span className="px-2.5 py-0.5 rounded-full bg-[#cabeff]/10 text-[#cabeff] text-[10px] font-bold uppercase tracking-wider border border-[#cabeff]/20">Post</span>
                                </div>
                                <p className="text-sm text-white/60 mb-3 line-clamp-3">{r.content}</p>
                                <div className="flex items-center gap-4 text-xs text-white/25">
                                  <span>{r.likesCount} likes</span>
                                  <span>{r.commentsCount} comments</span>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-4">
                                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                                  {r.fullName?.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <h3 className="font-semibold text-sm text-white">{r.fullName}</h3>
                                    {r.role && (
                                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                        r.role === 'doctor'
                                          ? 'bg-[#7bd0ff]/15 text-[#7bd0ff]'
                                          : 'bg-[#cabeff]/15 text-[#cabeff]'
                                      }`}>{r.role}</span>
                                    )}
                                  </div>
                                  {r.bio && <p className="text-xs text-white/30 truncate">{r.bio}</p>}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* Resource Categories */}
          <section className="py-20 px-6 md:px-10">
            <div className="max-w-[1200px] mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <h2 className="text-[32px] font-bold mb-2">Explore by Category</h2>
                <p className="text-white/40">Navigate our deep library of expert-led content.</p>
              </motion.div>

              <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <motion.div key={cat.title} variants={fadeUp}>
                      <div
                        onClick={() => { setQuery(cat.title); doSearch(cat.title); }}
                        className={`${glass} p-8 rounded-3xl group cursor-pointer hover:border-[#cabeff]/30 hover:shadow-[0_0_20px_rgba(124,93,255,0.15)] hover:-translate-y-1 transition-all`}>
                        <div className={`w-14 h-14 rounded-2xl ${cat.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${cat.hoverBg}`}>
                          <Icon className={`h-7 w-7 ${cat.color}`} />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{cat.title}</h3>
                        <p className="text-sm text-white/40 mb-6">{cat.description}</p>
                        <div className={`flex items-center ${cat.color} text-sm font-semibold group-hover:translate-x-2 transition-transform`}>
                          Explore <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </section>

          {/* Featured Resources */}
          <section className="py-20 bg-[#131b2e]/30 px-6 md:px-10">
            <div className="max-w-[1200px] mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
              >
                <div>
                  <h2 className="text-[32px] font-bold mb-2">Featured Resources</h2>
                  <p className="text-white/40">Our most-read guides updated for this month.</p>
                </div>
                <span className="text-sm text-white/30">Updated monthly</span>
              </motion.div>

              <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {featuredResources.map((res) => (
                  <motion.div key={res.title} variants={fadeUp}>
                    <div className={`${glass} rounded-[2rem] overflow-hidden flex flex-col h-full hover:border-[#cabeff]/30 hover:shadow-[0_0_20px_rgba(124,93,255,0.15)] hover:-translate-y-1 transition-all`}>
                      <div className={`h-56 relative overflow-hidden bg-gradient-to-br ${res.gradient}`}>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <BookOpen className="h-14 w-14 text-white/10" />
                        </div>
                        <div className="absolute top-4 left-4">
                          <span className={`${res.tagColor} text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border backdrop-blur-md`}>
                            {res.tag}
                          </span>
                        </div>
                      </div>
                      <div className="p-8 flex-grow flex flex-col">
                        <h3 className="text-xl font-semibold mb-3">{res.title}</h3>
                        <p className="text-sm text-white/40 mb-8 flex-grow leading-relaxed">{res.description}</p>
                        <div className="flex items-center justify-between pt-6 border-t border-white/[0.04]">
                          <span className="text-xs text-[#938ea1] flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {res.readTime}
                          </span>
                          <span className="text-[#cabeff]/50 text-xs font-semibold flex items-center gap-1">
                            Coming Soon
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

        </main>

        <DarkFooter />
      </div>
    </PageWrapper>
  );
};

export default SearchPage;
