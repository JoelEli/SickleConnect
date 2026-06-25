import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { usePosts } from '@/hooks/usePosts';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createPost } = usePosts();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    const { error } = await createPost(content.trim());

    if (error) {
      toast({ title: "Failed to Create Post", description: error, variant: "destructive" });
    } else {
      toast({ title: "Post Shared!", description: "Your post has been shared with the community" });
      setContent('');
    }
    setIsSubmitting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 mb-6">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-4">
            <Avatar className="h-10 w-10 shrink-0 border border-white/10">
              <AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white text-sm font-semibold">
                {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <textarea
                placeholder="Share an update, question, or resource with the community..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={500}
                rows={3}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 resize-none focus:outline-none focus:ring-1 focus:ring-teal-500/30 focus:border-teal-500/30 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-end mt-3 pl-14">
            <div className="flex items-center gap-3">
              <span className={`text-xs ${content.length > 450 ? 'text-rose-400' : 'text-white/20'}`}>
                {content.length}/500
              </span>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting || !content.trim()}
                className="bg-teal-500 hover:bg-teal-600 text-white border-0 px-5 rounded-lg disabled:opacity-30"
              >
                {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Post'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default CreatePost;
