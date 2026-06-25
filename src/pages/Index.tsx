import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import PostsFeed from '@/components/PostsFeed';
import DarkNavbar from '@/shared/components/DarkNavbar';
import PageWrapper from '@/shared/components/PageWrapper';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0e1a]">
        <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <PageWrapper>
      <div className="min-h-screen bg-[#0a0e1a] text-white">
        <DarkNavbar />
        <main className="container mx-auto px-4 py-8">
          <PostsFeed />
        </main>
      </div>
    </PageWrapper>
  );
};

export default Index;
