import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Edit3, Save, X, Loader2, MessageSquare, ThumbsUp,
  MapPin, CalendarDays, Zap, Share2, ShieldCheck,
  Award, Stethoscope, User, Mail, FileText, Dna, Heart,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GENOTYPES } from '@/lib/constants';
import DarkNavbar from '@/shared/components/DarkNavbar';
import DarkFooter from '@/shared/components/DarkFooter';
import PageWrapper from '@/shared/components/PageWrapper';
import PostCard from '@/components/PostCard';

interface Post {
  id: string;
  user_id: string;
  content: string;
  image_url?: string;
  likes_count: number;
  comments_count: number;
  is_liked?: boolean;
  created_at: string;
  profiles: {
    full_name: string;
    role: 'patient' | 'doctor';
    genotype?: string;
  };
}

const Profile = () => {
  const { user, loading, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('activity');
  const [editData, setEditData] = useState({ fullName: '', bio: '', genotype: '' });

  useEffect(() => {
    if (user) {
      setEditData({ fullName: user.fullName || '', bio: user.bio || '', genotype: user.genotype || '' });
      loadUserPosts();
    }
  }, [user]);

  const loadUserPosts = async () => {
    try {
      const data = await apiClient.posts.getAll(1, 50) as any;
      const posts = data.posts || data;
      setUserPosts((Array.isArray(posts) ? posts : []).filter((p: Post) => p.user_id === user?._id));
    } catch {} finally { setPostsLoading(false); }
  };

  const handleSave = async () => {
    if (!editData.fullName.trim() || editData.fullName.trim().length < 2) {
      toast({ title: 'Validation Error', description: 'Full name must be at least 2 characters.', variant: 'destructive' });
      return;
    }
    if (editData.bio.length > 500) {
      toast({ title: 'Validation Error', description: 'Bio must be under 500 characters.', variant: 'destructive' });
      return;
    }
    setIsSaving(true);
    try {
      const result = await updateProfile({ fullName: editData.fullName.trim(), bio: editData.bio.trim(), genotype: editData.genotype });
      if (result.error) toast({ title: 'Error', description: result.error, variant: 'destructive' });
      else { toast({ title: 'Profile Updated', description: 'Your changes have been saved.' }); setIsEditing(false); }
    } catch { toast({ title: 'Error', description: 'Failed to update profile', variant: 'destructive' }); }
    finally { setIsSaving(false); }
  };

  const openEdit = () => {
    setEditData({ fullName: user?.fullName || '', bio: user?.bio || '', genotype: user?.genotype || '' });
    setIsEditing(true);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0b1326]"><Loader2 className="h-8 w-8 animate-spin text-[#cabeff]" /></div>;
  if (!user) return <Navigate to="/auth" replace />;

  const totalLikes = userPosts.reduce((s, p) => s + p.likes_count, 0);
  const totalComments = userPosts.reduce((s, p) => s + p.comments_count, 0);
  const isDoctor = user.role === 'doctor';
  const glass = 'bg-[#161f35]/60 backdrop-blur-xl border border-white/[0.1]';
  const tabClass = (t: string) => `pb-4 text-sm font-semibold transition-colors relative ${activeTab === t ? 'text-[#cabeff] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#cabeff]' : 'text-white/40 hover:text-white/60'}`;
  const inputClass = 'w-full bg-[#222a3e] border border-[#484555] text-white rounded-xl py-3.5 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#cabeff] focus:border-[#cabeff] transition-all placeholder:text-white/20';
  const labelClass = 'block text-xs font-semibold text-white/40 uppercase tracking-[0.1em] mb-2';

  return (
    <PageWrapper>
      <div className="min-h-screen bg-[#0b1326] text-[#dbe2fd]">
        <DarkNavbar />

        <main className="pb-16">
          {/* Hero Banner */}
          <section className="relative w-full h-[280px] md:h-[320px] mb-24">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0b1326] to-[#161f35] overflow-hidden">
              <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(202,190,255,0.08) 1px, transparent 0)',
                backgroundSize: '32px 32px'
              }} />
              <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-[#603de2]/10 rounded-full blur-[120px]" />
              <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-[#38bdf8]/8 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-[1200px] mx-auto px-6 md:px-10 relative h-full">
              <div className="absolute -bottom-16 left-6 md:left-10 flex flex-col md:flex-row items-end gap-6">
                <div className={`w-36 h-36 md:w-40 md:h-40 rounded-full border-4 border-[#0b1326] shadow-2xl overflow-hidden ${glass}`}>
                  <div className={`w-full h-full flex items-center justify-center text-4xl font-bold ${isDoctor ? 'bg-gradient-to-br from-teal-500 to-cyan-600' : 'bg-gradient-to-br from-violet-500 to-purple-600'} text-white`}>
                    {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                </div>
                <div className="pb-4 space-y-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl md:text-[40px] font-bold text-white tracking-tight">{user.fullName}</h1>
                    <span className="bg-[#cabeff]/15 text-[#cabeff] px-3 py-1 rounded-full text-[11px] font-semibold border border-[#cabeff]/20 flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" />
                      {isDoctor ? 'Expert Contributor' : 'Community Member'}
                    </span>
                  </div>
                  <p className="text-lg text-white/40">
                    {isDoctor ? 'Hematologist' : 'Patient'}{user.genotype ? ` · Genotype ${user.genotype}` : ''} · Community Advocate
                  </p>
                </div>
              </div>

              <div className="absolute bottom-4 right-6 md:right-10 hidden md:flex gap-3">
                <button onClick={openEdit} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#7c5dff] to-[#38bdf8] shadow-[0_0_20px_rgba(124,93,255,0.3)] hover:scale-[1.02] active:scale-95 transition-all">
                  <Edit3 className="h-4 w-4" /> Edit Profile
                </button>
                <button
                  onClick={() => { navigator.share ? navigator.share({ title: user.fullName, url: window.location.href }) : navigator.clipboard.writeText(window.location.href); }}
                  className={`${glass} flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white/70 hover:bg-white/5 active:scale-95 transition-all`}
                >
                  <Share2 className="h-4 w-4" /> Share Profile
                </button>
              </div>

              {/* Mobile edit button */}
              <div className="absolute bottom-4 right-6 md:hidden">
                <button onClick={openEdit} className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#7c5dff] to-[#38bdf8] shadow-lg">
                  <Edit3 className="h-3.5 w-3.5" /> Edit
                </button>
              </div>
            </div>
          </section>

          {/* === Edit Profile Modal === */}
          <AnimatePresence>
            {isEditing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
                onClick={(e) => { if (e.target === e.currentTarget) setIsEditing(false); }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full max-w-[560px] max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl"
                  style={{ background: 'rgba(23, 31, 51, 0.85)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  {/* Modal Header */}
                  <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
                    <div>
                      <h2 className="text-xl font-bold text-white">Edit Profile</h2>
                      <p className="text-xs text-white/30 mt-1">Update your personal information</p>
                    </div>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="h-10 w-10 rounded-xl flex items-center justify-center text-white/30 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div className="p-6 space-y-6">
                    {/* Avatar Preview */}
                    <div className="flex items-center gap-5 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white shrink-0 ${isDoctor ? 'bg-gradient-to-br from-teal-500 to-cyan-600' : 'bg-gradient-to-br from-violet-500 to-purple-600'}`}>
                        {(editData.fullName?.charAt(0) || user.fullName?.charAt(0) || 'U').toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{editData.fullName || user.fullName}</p>
                        <p className="text-xs text-white/30 capitalize">{user.role}{editData.genotype ? ` · ${editData.genotype}` : ''}</p>
                        <p className="text-[11px] text-white/20 mt-0.5">{user.email}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${isDoctor ? 'bg-teal-500/15 text-teal-400 border border-teal-500/20' : 'bg-[#cabeff]/15 text-[#cabeff] border border-[#cabeff]/20'}`}>
                        {user.role}
                      </span>
                    </div>

                    {/* Personal Information Section */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <User className="h-4 w-4 text-[#cabeff]" />
                        <h3 className="text-sm font-semibold text-white">Personal Information</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className={labelClass}>Full Name</label>
                          <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                            <input
                              value={editData.fullName}
                              onChange={(e) => setEditData(p => ({ ...p, fullName: e.target.value }))}
                              placeholder="Your full name"
                              className={`${inputClass} pl-11`}
                            />
                          </div>
                          {editData.fullName.trim().length > 0 && editData.fullName.trim().length < 2 && (
                            <p className="text-xs text-[#ffb4ab] mt-1.5 ml-1">Name must be at least 2 characters</p>
                          )}
                        </div>

                        <div>
                          <label className={labelClass}>Email Address</label>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                            <input
                              value={user.email}
                              disabled
                              className={`${inputClass} pl-11 opacity-40 cursor-not-allowed`}
                            />
                          </div>
                          <p className="text-[11px] text-white/20 mt-1.5 ml-1">Email cannot be changed</p>
                        </div>
                      </div>
                    </div>

                    {/* Bio Section */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <FileText className="h-4 w-4 text-[#7bd0ff]" />
                        <h3 className="text-sm font-semibold text-white">About You</h3>
                      </div>
                      <div>
                        <label className={labelClass}>Bio</label>
                        <textarea
                          value={editData.bio}
                          onChange={(e) => setEditData(p => ({ ...p, bio: e.target.value }))}
                          placeholder="Tell the community about yourself, your journey, your interests..."
                          rows={4}
                          maxLength={500}
                          className={`${inputClass} resize-none`}
                        />
                        <div className="flex justify-between mt-1.5 px-1">
                          <p className="text-[11px] text-white/20">Share what matters to you</p>
                          <span className={`text-[11px] ${editData.bio.length > 450 ? 'text-[#ffb4ab]' : 'text-white/20'}`}>
                            {editData.bio.length}/500
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Medical Information Section (Patient only) */}
                    {user.role === 'patient' && (
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <Dna className="h-4 w-4 text-[#ffb77f]" />
                          <h3 className="text-sm font-semibold text-white">Medical Information</h3>
                        </div>
                        <div>
                          <label className={labelClass}>Genotype</label>
                          <div className="grid grid-cols-3 gap-2">
                            {GENOTYPES.map(g => {
                              const active = editData.genotype === g.value;
                              return (
                                <button
                                  key={g.value}
                                  type="button"
                                  onClick={() => setEditData(p => ({ ...p, genotype: g.value }))}
                                  className={`py-3 rounded-xl text-sm font-semibold transition-all border ${
                                    active
                                      ? 'border-[#7bd0ff] bg-[#7bd0ff]/10 text-[#7bd0ff] shadow-[0_0_12px_rgba(123,208,255,0.15)]'
                                      : 'border-[#484555] text-white/40 hover:border-white/20 hover:text-white/60'
                                  }`}
                                >
                                  {g.value}
                                </button>
                              );
                            })}
                          </div>
                          <p className="text-[11px] text-white/20 mt-2 ml-1">
                            {GENOTYPES.find(g => g.value === editData.genotype)?.label || 'Select your genotype'}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Role Display (Read-only) */}
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDoctor ? 'bg-teal-500/10 text-teal-400' : 'bg-[#cabeff]/10 text-[#cabeff]'}`}>
                            {isDoctor ? <Stethoscope className="h-5 w-5" /> : <Heart className="h-5 w-5" />}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{isDoctor ? 'Doctor' : 'Patient'}</p>
                            <p className="text-[11px] text-white/25">Role cannot be changed</p>
                          </div>
                        </div>
                        <ShieldCheck className="h-4 w-4 text-white/15" />
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="flex items-center justify-between p-6 border-t border-white/[0.06]">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 rounded-xl text-sm font-semibold text-white/50 hover:text-white hover:bg-white/5 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving || !editData.fullName.trim() || editData.fullName.trim().length < 2}
                      className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#7c5dff] to-[#38bdf8] shadow-lg shadow-[#7c5dff]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="max-w-[1200px] mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-4 space-y-6">
              {/* About Card */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className={`${glass} rounded-2xl p-6`}>
                <h3 className="text-xl font-semibold text-[#cabeff] mb-4">About</h3>
                <p className="text-sm text-white/50 leading-relaxed mb-6">
                  {user.bio || 'No bio yet. Click "Edit Profile" to add one.'}
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-white/40">
                    <Mail className="h-4 w-4 text-[#7bd0ff]" />
                    <span className="text-sm font-semibold">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/40">
                    <MapPin className="h-4 w-4 text-[#7bd0ff]" />
                    <span className="text-sm font-semibold">SickleConnect Community</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/40">
                    <CalendarDays className="h-4 w-4 text-[#7bd0ff]" />
                    <span className="text-sm font-semibold">SickleConnect Member</span>
                  </div>
                </div>
              </motion.div>

              {/* Genotype Card */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className={`${glass} rounded-2xl p-6 border-l-4 border-l-[#7bd0ff]`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-[#7bd0ff] uppercase tracking-[0.15em] mb-1">
                      {isDoctor ? 'Specialty' : 'Medical Anchor'}
                    </p>
                    <h4 className="text-2xl font-semibold">
                      {isDoctor ? 'Hematologist' : `Genotype: ${user.genotype || 'N/A'}`}
                    </h4>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-[#7bd0ff]/10 flex items-center justify-center text-[#7bd0ff]">
                    {isDoctor ? <Stethoscope className="h-5 w-5" /> : <Zap className="h-5 w-5" />}
                  </div>
                </div>
              </motion.div>

              {/* Stats */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="space-y-4">
                {[
                  { icon: Zap, value: totalLikes + totalComments, label: 'Impact Score', color: 'text-[#cabeff]', bg: 'bg-[#cabeff]/10' },
                  { icon: MessageSquare, value: userPosts.length, label: 'Community Posts', color: 'text-[#7bd0ff]', bg: 'bg-[#7bd0ff]/10' },
                  { icon: ThumbsUp, value: totalLikes, label: 'Total Likes', color: 'text-[#ffb77f]', bg: 'bg-[#ffb77f]/10' },
                ].map(s => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className={`${glass} rounded-2xl p-5 flex items-center gap-4 group hover:border-white/20 transition-colors`}>
                      <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center ${s.color} group-hover:scale-110 transition-transform`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-semibold">{s.value}</p>
                        <p className="text-xs text-white/40 font-semibold">{s.label}</p>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex gap-8 border-b border-white/[0.04] px-4">
                {['activity', 'badges'].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={tabClass(tab)}>
                    {tab === 'activity' ? 'Recent Activity' : 'Badges'}
                  </button>
                ))}
              </div>

              {activeTab === 'activity' && (
                <div className="space-y-4">
                  {postsLoading ? (
                    <div className="text-center py-12"><Loader2 className="h-6 w-6 animate-spin text-[#cabeff] mx-auto" /></div>
                  ) : userPosts.length === 0 ? (
                    <div className={`${glass} rounded-2xl p-12 text-center`}>
                      <MessageSquare className="h-12 w-12 text-white/10 mx-auto mb-3" />
                      <p className="text-white/30 text-sm">No posts yet. Share your story with the community!</p>
                    </div>
                  ) : (
                    userPosts.map((post, i) => (
                      <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }}>
                        <PostCard post={post} />
                      </motion.div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'badges' && (
                <div className="space-y-4">
                  {[
                    { title: 'Community Member', badge: 'Welcome Badge', desc: 'Earned for joining SickleConnect', color: '#ffb77f', show: true },
                    { title: 'First Post', badge: 'Storyteller', desc: 'Shared your first post with the community', color: '#7bd0ff', show: userPosts.length >= 1 },
                    { title: 'Active Contributor', badge: '5+ Posts', desc: 'Awarded for sharing 5+ posts', color: '#cabeff', show: userPosts.length >= 5 },
                    { title: 'Loved by Community', badge: '10+ Likes', desc: 'Your posts received 10+ total likes', color: '#f472b6', show: totalLikes >= 10 },
                  ].filter(b => b.show).map((b, i) => (
                    <motion.div key={b.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={`${glass} rounded-2xl p-6`}>
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: `${b.color}15` }}>
                          <Award className="h-5 w-5" style={{ color: b.color }} />
                        </div>
                        <div>
                          <h5 className="text-sm font-semibold text-white mb-1">{b.title}</h5>
                          <div className="flex items-center gap-3 mt-1 flex-wrap">
                            <span className="px-3 py-1 rounded-lg text-sm font-semibold" style={{ backgroundColor: `${b.color}15`, color: b.color, border: `1px solid ${b.color}30` }}>
                              {b.badge}
                            </span>
                            <p className="text-xs text-white/30">{b.desc}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>

        <DarkFooter />
      </div>
    </PageWrapper>
  );
};

export default Profile;
