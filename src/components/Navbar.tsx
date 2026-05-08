import React from 'react';
import { motion } from 'motion/react';
import { Download, Link as LinkIcon, Chrome, Instagram, Youtube, Facebook, Twitter, Ghost, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { authService } from '../services/authService';
import { User } from 'firebase/auth';

export const Navbar = () => {
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    const unsubscribe = authService.onAuthChange((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      await authService.signInWithGoogle();
    } catch (error) {
      console.error("Sign in failed", error);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
  };

  return (
    <nav className="fixed top-4 left-4 right-4 sm:top-6 sm:left-1/2 sm:-translate-x-1/2 z-50 w-auto sm:w-[90%] sm:max-w-4xl">
        <div className="flex items-center justify-between bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-4 sm:px-6 py-2 sm:py-3">
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="w-6 sm:w-8 h-6 sm:h-8 bg-gradient-to-tr from-indigo-500 to-fuchsia-500 rounded-lg flex items-center justify-center font-bold text-white uppercase italic text-xs sm:text-base">
              R
            </div>
            <span className="text-base sm:text-xl font-bold tracking-tighter text-white hidden xs:inline">ReelRush</span>
          </div>
          
          <div className="hidden md:flex items-center gap-4 lg:gap-8 text-xs sm:text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">Process</a>
            {user && <a href="/admin" className="hover:text-white transition-colors">Dashboard</a>}
          </div>

          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-full overflow-hidden border border-white/20">
                <img src={user.photoURL || ''} alt={user.displayName || ''} className="w-full h-full object-cover" />
              </div>
              <button 
                onClick={handleLogout}
                className="text-slate-400 hover:text-white transition-colors"
                title="Sign Out"
              >
                <LogOut size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-4">
              <button onClick={handleSignIn} className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold hover:text-white transition-colors">Login</button>
              <button 
                onClick={handleSignIn}
                className="px-3 sm:px-5 py-1.5 sm:py-2 bg-white text-black rounded-full text-xs sm:text-sm font-bold hover:bg-slate-200 transition-all shadow-lg"
              >
                Start
              </button>
            </div>
          )}
        </div>
    </nav>
  );
};
