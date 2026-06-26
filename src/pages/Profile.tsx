import { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api';
import {
  Edit3, Loader2, MessageSquare, ThumbsUp,
  MapPin, CalendarDays, Zap, Share2, ShieldCheck,
  Award, Stethoscope, Mail, ChevronLeft, Camera, ImagePlus,
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
  profiles: { full_name: string; role: 'patient' | 'doctor'; genotype?: string };
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const Profile = () => {
  const { user, loading, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('activity');
  const [editData, setEditData] = useState({ fullName: '', bio: '', genotype: '', avatarUrl: '', coverUrl: '' });
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setEditData({ fullName: user.fullName || '', bio: user.bio || '', genotype: user.genotype || '', avatarUrl: user.avatarUrl || '', coverUrl: user.coverUrl || '' });
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

  const handleImageSelect = async (file: File, field: 'avatarUrl' | 'coverUrl') => {
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Error', description: 'Please select an image file.', variant: 'destructive' });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: 'Error', description: 'Image must be under 2MB.', variant: 'destructive' });
      return;
    }
    const dataUrl = await readFileAsDataUrl(file);
    setEditData(p => ({ ...p, [field]: dataUrl }));
  };

  const handleSave = async () => {
    if (!editData.fullName.trim() || editData.fullName.trim().length < 2) {
      toast({ title: 'Error', description: 'Name must be at least 2 characters.', variant: 'destructive' });
      return;
    }
    setIsSaving(true);
    try {
      const payload: any = { fullName: editData.fullName.trim(), bio: editData.bio.trim(), genotype: editData.genotype };
      if (editData.avatarUrl !== (user?.avatarUrl || '')) payload.avatarUrl = editData.avatarUrl;
      if (editData.coverUrl !== (user?.coverUrl || '')) payload.coverUrl = editData.coverUrl;
      const result = await updateProfile(payload);
      if (result.error) toast({ title: 'Error', description: result.error, variant: 'destructive' });
      else { toast({ title: 'Profile saved.' }); setIsEditing(false); }
    } catch { toast({ title: 'Error', description: 'Failed to update profile', variant: 'destructive' }); }
    finally { setIsSaving(false); }
  };

  const openEdit = () => {
    setEditData({ fullName: user?.fullName || '', bio: user?.bio || '', genotype: user?.genotype || '', avatarUrl: user?.avatarUrl || '', coverUrl: user?.coverUrl || '' });
    setIsEditing(true);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0b1326]"><Loader2 className="h-8 w-8 animate-spin text-[#cabeff]" /></div>;
  if (!user) return <Navigate to="/auth" replace />;

  const totalLikes = userPosts.reduce((s, p) => s + p.likes_count, 0);
  const totalComments = userPosts.reduce((s, p) => s + p.comments_count, 0);
  const isDoctor = user.role === 'doctor';
  const glass = 'bg-[#161f35]/60 backdrop-blur-xl border border-white/[0.1]';
  const tabClass = (t: string) => `pb-4 text-sm font-semibold transition-colors relative ${activeTab === t ? 'text-[#cabeff] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#cabeff]' : 'text-white/40 hover:text-white/60'}`;
  const avatarGradient = isDoctor ? 'from-teal-500 to-cyan-600' : 'from-violet-500 to-purple-600';
  const displayAvatar = user.avatarUrl;
  const displayCover = user.coverUrl;

  return (
    <PageWrapper>
      <div className="min-h-screen bg-[#0b1326] text-[#dbe2fd]">
        <DarkNavbar />

        {/* Hidden file inputs */}
        <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleImageSelect(e.target.files[0], 'avatarUrl'); e.target.value = ''; }} />
        <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleImageSelect(e.target.files[0], 'coverUrl'); e.target.value = ''; }} />

        {/* ===== INSTAGRAM-STYLE EDIT PROFILE ===== */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[80] bg-[#0b1326] overflow-y-auto"
            >
              {/* Top Bar */}
              <div className="sticky top-0 z-10 bg-[#0b1326]/90 backdrop-blur-xl border-b border-white/[0.06]">
                <div className="max-w-lg mx-auto flex items-center justify-between h-14 px-4">
                  <button onClick={() => setIsEditing(false)} className="text-white/60 hover:text-white transition-colors flex items-center gap-1 text-sm">
                    <ChevronLeft className="h-5 w-5" /> Cancel
                  </button>
                  <h2 className="text-base font-bold text-white">Edit Profile</h2>
                  <button
                    onClick={handleSave}
                    disabled={isSaving || !editData.fullName.trim() || editData.fullName.trim().length < 2}
                    className="text-sm font-bold text-[#7bd0ff] hover:text-[#38bdf8] transition-colors disabled:text-white/20"
                  >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Done'}
                  </button>
                </div>
              </div>

              <div className="max-w-lg mx-auto pb-20">
                {/* Cover Photo */}
                <div
                  onClick={() => coverInputRef.current?.click()}
                  className="relative h-40 cursor-pointer group overflow-hidden"
                >
                  {editData.coverUrl ? (
                    <img src={editData.coverUrl} alt="Cover" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#161f35] to-[#222a3e]" />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <ImagePlus className="h-5 w-5 text-white" />
                    <span className="text-sm font-semibold text-white">Change Cover Photo</span>
                  </div>
                </div>

                {/* Avatar Section */}
                <div className="flex flex-col items-center -mt-12 relative z-10">
                  <div
                    onClick={() => avatarInputRef.current?.click()}
                    className="relative group cursor-pointer"
                  >
                    <div className={`w-24 h-24 rounded-full border-4 border-[#0b1326] shadow-xl overflow-hidden ${!editData.avatarUrl ? `bg-gradient-to-br ${avatarGradient} flex items-center justify-center` : ''}`}>
                      {editData.avatarUrl ? (
                        <img src={editData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-3xl font-bold text-white">
                          {(editData.fullName?.charAt(0) || 'U').toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <button onClick={() => avatarInputRef.current?.click()} className="mt-3 text-sm font-bold text-[#7bd0ff]">
                    Change profile photo
                  </button>
                </div>

                {/* Form Fields */}
                <div className="mt-6 border-t border-white/[0.06]">
                  {/* Name */}
                  <div className="flex items-center px-4 py-3.5 border-b border-white/[0.04]">
                    <label className="w-28 shrink-0 text-sm text-white/40">Name</label>
                    <input
                      value={editData.fullName}
                      onChange={(e) => setEditData(p => ({ ...p, fullName: e.target.value }))}
                      placeholder="Name"
                      className="flex-1 bg-transparent text-sm text-white placeholder:text-white/15 focus:outline-none"
                    />
                  </div>

                  {/* Bio */}
                  <div className="flex items-start px-4 py-3.5 border-b border-white/[0.04]">
                    <label className="w-28 shrink-0 text-sm text-white/40 pt-0.5">Bio</label>
                    <div className="flex-1">
                      <textarea
                        value={editData.bio}
                        onChange={(e) => setEditData(p => ({ ...p, bio: e.target.value }))}
                        placeholder="Write a short bio..."
                        rows={3}
                        maxLength={500}
                        className="w-full bg-transparent text-sm text-white placeholder:text-white/15 focus:outline-none resize-none leading-relaxed"
                      />
                      <p className={`text-[11px] text-right ${editData.bio.length > 450 ? 'text-[#ffb4ab]' : 'text-white/15'}`}>
                        {editData.bio.length}/500
                      </p>
                    </div>
                  </div>

                  {/* Email (read-only) */}
                  <div className="flex items-center px-4 py-3.5 border-b border-white/[0.04]">
                    <label className="w-28 shrink-0 text-sm text-white/40">Email</label>
                    <span className="flex-1 text-sm text-white/25">{user.email}</span>
                  </div>

                  {/* Role (read-only) */}
                  <div className="flex items-center px-4 py-3.5 border-b border-white/[0.04]">
                    <label className="w-28 shrink-0 text-sm text-white/40">Role</label>
                    <span className="flex-1 text-sm text-white/25 capitalize">{user.role}</span>
                  </div>

                  {/* Genotype (patients only) */}
                  {user.role === 'patient' && (
                    <div className="flex items-start px-4 py-3.5 border-b border-white/[0.04]">
                      <label className="w-28 shrink-0 text-sm text-white/40 pt-0.5">Genotype</label>
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2">
                          {GENOTYPES.map(g => (
                            <button
                              key={g.value}
                              type="button"
                              onClick={() => setEditData(p => ({ ...p, genotype: g.value }))}
                              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                                editData.genotype === g.value
                                  ? 'bg-[#7bd0ff]/15 text-[#7bd0ff] border border-[#7bd0ff]/40'
                                  : 'bg-white/[0.04] text-white/30 border border-white/[0.06] hover:text-white/50'
                              }`}
                            >
                              {g.value}
                            </button>
                          ))}
                        </div>
                        {editData.genotype && (
                          <p className="text-[11px] text-white/20 mt-2">
                            {GENOTYPES.find(g => g.value === editData.genotype)?.label}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 px-4">
                  <p className="text-xs text-white/15 leading-relaxed">
                    Photos must be under 2MB. Role and email are set during registration and cannot be changed.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== PROFILE PAGE ===== */}
        <main className="pb-16">
          {/* Hero Banner with Cover Photo */}
          <section className="relative w-full h-[280px] md:h-[320px] mb-24">
            <div className="absolute inset-0 overflow-hidden">
              {displayCover ? (
                <img src={displayCover} alt="Cover" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#0b1326] to-[#161f35]">
                  <div className="absolute inset-0 opacity-30" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(202,190,255,0.08) 1px, transparent 0)',
                    backgroundSize: '32px 32px'
                  }} />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1326] via-[#0b1326]/40 to-transparent" />
              <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-[#603de2]/10 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-[1200px] mx-auto px-6 md:px-10 relative h-full">
              <div className="absolute -bottom-16 left-6 md:left-10 flex flex-col md:flex-row items-end gap-6">
                <div className={`w-36 h-36 md:w-40 md:h-40 rounded-full border-4 border-[#0b1326] shadow-2xl overflow-hidden ${glass}`}>
                  {displayAvatar ? (
                    <img src={displayAvatar} alt={user.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center text-4xl font-bold bg-gradient-to-br ${avatarGradient} text-white`}>
                      {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
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

              <div className="absolute bottom-4 right-6 md:right-10 flex gap-3">
                <button onClick={openEdit} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#7c5dff] to-[#38bdf8] shadow-[0_0_20px_rgba(124,93,255,0.3)] hover:scale-[1.02] active:scale-95 transition-all">
                  <Edit3 className="h-4 w-4" /> Edit Profile
                </button>
                <button
                  onClick={() => { navigator.share ? navigator.share({ title: user.fullName, url: window.location.href }) : navigator.clipboard.writeText(window.location.href); }}
                  className={`${glass} hidden md:flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white/70 hover:bg-white/5 active:scale-95 transition-all`}
                >
                  <Share2 className="h-4 w-4" /> Share
                </button>
              </div>
            </div>
          </section>

          <div className="max-w-[1200px] mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-4 space-y-6">
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
                    { title: 'First Post', badge: 'Storyteller', desc: 'Shared your first post', color: '#7bd0ff', show: userPosts.length >= 1 },
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
