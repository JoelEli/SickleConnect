import { useAuth } from '@/hooks/useAuth';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, Home, Info, Search, CreditCard, MessageCircle } from 'lucide-react';
import PostsFeed from '@/components/PostsFeed';
import { ThemeToggle } from '@/shared/components/ThemeToggle';
import NotificationCenter from '@/shared/components/NotificationCenter';
import HamburgerMenu from '@/shared/components/HamburgerMenu';

const Index = () => {
  const { user, signOut, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* Navigation */}
      <nav className="bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">SickleConnect</h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
            <Link to="/search">
              <Button variant="ghost">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </Link>
            <Link to="/chat">
              <Button variant="ghost">
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="ghost">
                <Info className="h-4 w-4 mr-2" />
                About
              </Button>
            </Link>
            <Link to="/donate">
              <Button variant="default" className="bg-pink-600 hover:bg-pink-700">
                <CreditCard className="h-4 w-4 mr-2" />
                Donate
              </Button>
            </Link>
            <NotificationCenter />
            <ThemeToggle />
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Welcome, {user.fullName}!
              </span>
              <Button variant="outline" size="sm" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-2">
            <NotificationCenter />
            <ThemeToggle />
            <HamburgerMenu />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <PostsFeed />
      </main>
    </div>
  );
};

export default Index;
