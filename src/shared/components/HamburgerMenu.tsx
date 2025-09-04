import React, { useState } from 'react';
import { Menu, X, Heart, User, LogOut, Search, Home, Info, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/shared/hooks/useTheme';

interface HamburgerMenuProps {
  className?: string;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const menuItems = [
    { icon: Home, label: 'Home', path: '/', show: true },
    { icon: Search, label: 'Search', path: '/search', show: true },
    { icon: Info, label: 'About', path: '/about', show: true },
    { icon: CreditCard, label: 'Donate', path: '/donate', show: true, isDonate: true },
  ];

  return (
    <div className={`relative ${className}`}>
      {/* Hamburger Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-background border-l shadow-lg">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Menu</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="p-2"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* User Info */}
              {user && (
                <div className="p-4 border-b bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{user.fullName}</p>
                      <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Items */}
              <div className="flex-1 p-4">
                <nav className="space-y-2">
                  {menuItems.map((item) => {
                    if (!item.show) return null;
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.path}
                        variant={item.isDonate ? "default" : "ghost"}
                        className={`w-full justify-start h-12 ${item.isDonate ? 'bg-pink-600 hover:bg-pink-700' : ''}`}
                        onClick={() => handleNavigation(item.path)}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        {item.label}
                      </Button>
                    );
                  })}
                </nav>
              </div>

              {/* Footer Actions */}
              <div className="p-4 border-t space-y-2">
                {/* Theme Toggle */}
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={toggleTheme}
                >
                  {theme === 'dark' ? '☀️' : '🌙'} 
                  <span className="ml-3">
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </span>
                </Button>

                {/* Sign Out */}
                {user && (
                  <Button
                    variant="destructive"
                    className="w-full justify-start"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Sign Out
                  </Button>
                )}

                {/* Sign In */}
                {!user && (
                  <Button
                    className="w-full justify-start"
                    onClick={() => handleNavigation('/auth')}
                  >
                    <User className="h-5 w-5 mr-3" />
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;
