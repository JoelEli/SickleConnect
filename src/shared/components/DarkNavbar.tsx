import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, LogOut, Menu, X, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const navLinks = [
  { path: '/home', label: 'Home' },
  { path: '/community', label: 'Community', auth: true },
  { path: '/search', label: 'Resources' },
  { path: '/about', label: 'About' },
  { path: '/donate', label: 'Donate' },
];

const DarkNavbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleNav = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 w-full z-50 bg-[#0b1326]/80 backdrop-blur-xl border-b border-white/[0.06]"
      >
        <div className="flex justify-between items-center h-16 px-6 md:px-10 max-w-[1200px] mx-auto">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2 group">
            <Heart className="h-5 w-5 text-rose-500 fill-rose-500/30 group-hover:fill-rose-500/50 transition-colors" />
            <span className="text-xl font-bold tracking-tight">
              <span className="text-white">Sickle</span>
              <span className="text-[#cabeff]">Connect</span>
            </span>
          </Link>

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex items-center justify-center h-10 w-10 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </motion.header>

      {/* Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed right-0 top-0 h-full w-80 max-w-[85vw] z-[70] bg-[#0d1528] border-l border-white/[0.06] shadow-2xl"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
                  <span className="text-lg font-bold text-white">Menu</span>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="h-9 w-9 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* User Info */}
                {user && (
                  <div className="p-5 border-b border-white/[0.06] bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white text-sm font-bold border border-white/10">
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{user.fullName}</p>
                        <p className="text-xs text-white/40 capitalize">{user.role}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Nav Links */}
                <div className="flex-1 p-4 space-y-1 overflow-y-auto">
                  {navLinks
                    .filter(link => !link.auth || user)
                    .map((link, i) => (
                      <motion.button
                        key={link.path}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.25 }}
                        onClick={() => handleNav(link.path)}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                          isActive(link.path)
                            ? 'bg-[#cabeff]/10 text-[#cabeff]'
                            : 'text-white/50 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {link.label}
                      </motion.button>
                    ))}

                  {user && (
                    <>
                      <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: navLinks.length * 0.05, duration: 0.25 }}
                        onClick={() => handleNav('/profile')}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                          isActive('/profile')
                            ? 'bg-[#cabeff]/10 text-[#cabeff]'
                            : 'text-white/50 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <User className="h-4 w-4" />
                        Profile
                      </motion.button>

                      <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (navLinks.length + 1) * 0.05, duration: 0.25 }}
                        onClick={() => handleNav('/chat')}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                          isActive('/chat')
                            ? 'bg-[#cabeff]/10 text-[#cabeff]'
                            : 'text-white/50 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        Chat
                      </motion.button>
                    </>
                  )}
                </div>

                {/* Bottom */}
                <div className="p-4 border-t border-white/[0.06] space-y-2">
                  {user ? (
                    <button
                      onClick={() => { signOut(); setMobileOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  ) : (
                    <button
                      onClick={() => handleNav('/auth')}
                      className="w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#937dff] to-[#00a6e0] shadow-lg shadow-[#937dff]/20"
                    >
                      Join Now
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default DarkNavbar;
