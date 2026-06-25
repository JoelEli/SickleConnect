import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Edit3, Save, X, Loader2, MessageSquare, ThumbsUp,
  MapPin, CalendarDays, Zap, Share2, ShieldCheck, Bookmark,
  Award, Stethoscope,
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
    setIsSaving(true);
    try {
      const result = await updateProfile({ fullName: editData.fullName, bio: editData.bio, genotype: editData.genotype, role: user!.role });
      if (result.error) toast({ title: 'Error', description: result.error, variant: 'destructive' });
      else { toast({ title: 'Profile Updated' }); setIsEditing(false); }
    } catch { toast({ title: 'Error', description: 'Failed to update profile', variant: 'destructive' }); }
    finally { setIsSaving(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0b1326]"><Loader2 className="h-8 w-8 animate-spin text-[#cabeff]" /></div>;
  if (!user) return <Navigate to="/auth" replace />;

  const totalLikes = userPosts.reduce((s, p) => s + p.likes_count, 0);
  const totalComments = userPosts.reduce((s, p) => s + p.comments_count, 0);
  const isDoctor = user.role === 'doctor';
  const glass = 'bg-[#161f35]/60 backdrop-blur-xl border border-white/[0.1]';
  const tabClass = (t: string) => `pb-4 text-sm font-semibold transition-colors relative ${activeTab === t ? 'text-[#cabeff] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#cabeff]' : 'text-white/40 hover:text-white/60'}`;

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
              {/* Avatar + Identity */}
              <div className="absolute -bottom-16 left-6 md:left-10 flex flex-col md:flex-row items-end gap-6">
                <div className={`w-36 h-36 md:w-40 md:h-40 rounded-full border-4 border-[#0b1326] shadow-2xl overflow-hidden ${glass}`}>
                  <div className={`w-full h-full flex items-center justify-center text-4xl font-bold ${isDoctor ? 'bg-gradient-to-br from-teal-500 to-cyan-600' : 'bg-gradient-to-br from-violet-500 to-purple-600'} text-white`}>
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="pb-4 space-y-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    {isEditing ? (
                      <Input
                        value={editData.fullName}
                        onChange={(e) => setEditData(p => ({ ...p, fullName: e.target.value }))}
                        className="text-2xl md:text-[40px] font-bold bg-transparent border-b border-[#cabeff]/30 text-white h-auto py-0 px-1 rounded-none focus-visible:ring-0"
                      />
                    ) : (
                      <h1 className="text-2xl md:text-[40px] font-bold text-white tracking-tight">{user.fullName}</h1>
                    )}
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

              {/* Action Buttons */}
              <div className="absolute bottom-4 right-6 md:right-10 hidden md:flex gap-3">
                {!isEditing ? (
                  <>
                    <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#7c5dff] to-[#38bdf8] shadow-[0_0_20px_rgba(124,93,255,0.3)] hover:scale-[1.02] active:scale-95 transition-all">
                      <Edit3 className="h-4 w-4" /> Edit Profile
                    </button>
                    <button
                      onClick={() => { navigator.share ? navigator.share({ title: user.fullName, url: window.location.href }) : navigator.clipboard.writeText(window.location.href); }}
                      className={`${glass} flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white/70 hover:bg-white/5 active:scale-95 transition-all`}
                    >
                      <Share2 className="h-4 w-4" /> Share Profile
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#7c5dff] to-[#38bdf8] shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
                      {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
                    </button>
                    <button onClick={() => setIsEditing(false)} className={`${glass} flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white/70 hover:bg-white/5 active:scale-95 transition-all`}>
                      <X className="h-4 w-4" /> Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </section>

          <div className="max-w-[1200px] mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-4 space-y-6">
              {/* About Card */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className={`${glass} rounded-2xl p-6`}>
                <h3 className="text-xl font-semibold text-[#cabeff] mb-4">About</h3>
                {isEditing ? (
                  <Textarea
                    value={editData.bio}
                    onChange={(e) => setEditData(p => ({ ...p, bio: e.target.value }))}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className="bg-[#222a3e] border-[#484555] text-white placeholder:text-white/20 mb-4"
                  />
                ) : (
                  <p className="text-sm text-white/50 leading-relaxed mb-6">
                    {user.bio || 'No bio yet. Click "Edit Profile" to add one.'}
                  </p>
                )}
                <div className="space-y-3">
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
                    {isEditing && user.role === 'patient' ? (
                      <Select value={editData.genotype} onValueChange={(v) => setEditData(p => ({ ...p, genotype: v }))}>
                        <SelectTrigger className="bg-[#222a3e] border-[#484555] text-white w-40">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {GENOTYPES.map(g => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    ) : (
                      <h4 className="text-2xl font-semibold">
                        {isDoctor ? 'Hematologist' : `Genotype: ${user.genotype || 'N/A'}`}
                      </h4>
                    )}
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
              {/* Tabs */}
              <div className="flex gap-8 border-b border-white/[0.04] px-4">
                {['activity', 'saved', 'achievements'].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={tabClass(tab)}>
                    {tab === 'activity' ? 'Recent Activity' : tab === 'saved' ? 'Saved Resources' : 'Achievements'}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
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
                    <>
                      {userPosts.map((post, i) => (
                        <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }}>
                          <PostCard post={post} />
                        </motion.div>
                      ))}
                    </>
                  )}
                </div>
              )}

              {activeTab === 'saved' && (
                <div className={`${glass} rounded-2xl p-12 text-center`}>
                  <Bookmark className="h-12 w-12 text-white/10 mx-auto mb-3" />
                  <p className="text-white/30 text-sm">No saved resources yet.</p>
                </div>
              )}

              {activeTab === 'achievements' && (
                <div className="space-y-4">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`${glass} rounded-2xl p-6`}>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#ffb77f]/10 flex-shrink-0 flex items-center justify-center text-[#ffb77f]">
                        <Award className="h-5 w-5" />
                      </div>
                      <div>
                        <h5 className="text-sm font-semibold text-white mb-1">Community Member</h5>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="px-3 py-1 bg-[#ffb77f]/15 rounded-lg border border-[#ffb77f]/20 text-[#ffb77f] text-sm font-semibold">Welcome Badge</span>
                          <p className="text-xs text-white/30">Earned for joining SickleConnect</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  {userPosts.length >= 5 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className={`${glass} rounded-2xl p-6`}>
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#cabeff]/10 flex-shrink-0 flex items-center justify-center text-[#cabeff]">
                          <Award className="h-5 w-5" />
                        </div>
                        <div>
                          <h5 className="text-sm font-semibold text-white mb-1">Active Contributor</h5>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="px-3 py-1 bg-[#cabeff]/15 rounded-lg border border-[#cabeff]/20 text-[#cabeff] text-sm font-semibold">5+ Posts</span>
                            <p className="text-xs text-white/30">Awarded for sharing 5+ posts with the community</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
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
