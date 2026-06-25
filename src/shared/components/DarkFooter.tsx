import React from 'react';
import { Link } from 'react-router-dom';

const DarkFooter: React.FC = () => {
  return (
    <footer className="w-full py-12 bg-[#060d20] border-t border-white/[0.04]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6 md:px-10 max-w-[1200px] mx-auto">
        <div className="space-y-4">
          <span className="text-xl font-bold text-white">SickleConnect</span>
          <p className="text-sm text-white/40">Empowering the sickle cell community through connection and verified knowledge.</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-[#cabeff] mb-4">Platform</h4>
          <div className="space-y-2.5">
            <Link to="/community" className="block text-sm text-white/40 hover:text-[#7bd0ff] transition-colors">Community</Link>
            <Link to="/search" className="block text-sm text-white/40 hover:text-[#7bd0ff] transition-colors">Resources</Link>
            <Link to="/chat" className="block text-sm text-white/40 hover:text-[#7bd0ff] transition-colors">Chat</Link>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-[#cabeff] mb-4">Company</h4>
          <div className="space-y-2.5">
            <Link to="/about" className="block text-sm text-white/40 hover:text-[#7bd0ff] transition-colors">About Us</Link>
            <Link to="/donate" className="block text-sm text-white/40 hover:text-[#7bd0ff] transition-colors">Support Us</Link>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-[#cabeff] mb-4">Legal</h4>
          <div className="space-y-2.5">
            <span className="block text-sm text-white/40">Privacy Policy</span>
            <span className="block text-sm text-white/40">Terms of Service</span>
          </div>
        </div>
      </div>
      <div className="max-w-[1200px] mx-auto mt-10 pt-8 border-t border-white/[0.04] px-6 md:px-10 text-center">
        <p className="text-xs text-white/25">&copy; {new Date().getFullYear()} SickleConnect. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default DarkFooter;
