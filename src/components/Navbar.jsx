import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, Bell, Cloud, User, LogOut } from 'lucide-react';

const Navbar = ({ onLogout }) => {
  const username = localStorage.getItem('username') || 'Admin';

  return (
    <nav className="fixed top-0 inset-x-0 h-20 bg-background/50 backdrop-blur-xl border-b border-white/5 z-50 px-8 flex items-center justify-between">
      <div className="flex items-center gap-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 primary-gradient rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
            CloudGuard AI
          </span>
        </div>
        
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-500">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `transition-colors ${isActive ? 'text-blue-400' : 'hover:text-white'}`
            }
          >
            Overview
          </NavLink>
          <NavLink
            to="/billing"
            className={({ isActive }) =>
              `transition-colors ${isActive ? 'text-blue-400' : 'hover:text-white'}`
            }
          >
            Billing
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `transition-colors ${isActive ? 'text-blue-400' : 'hover:text-white'}`
            }
          >
            Settings
          </NavLink>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative w-10 h-10 flex items-center justify-center hover:bg-white/5 rounded-xl transition-all">
          <Bell className="w-5 h-5 text-gray-400" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#0a0a0c]" />
        </button>

        <div className="h-8 w-px bg-white/10 mx-2" />

        <div className="flex items-center gap-4 pl-2">
          <div className="flex flex-col items-end">
            <span className="text-sm font-bold text-white uppercase tracking-tight">{username}</span>
            <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1">
              <Cloud className="w-3 h-3" /> System Live
            </span>
          </div>
          <button 
            onClick={onLogout}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all hover:bg-red-500/10 hover:border-red-500/30 group"
          >
            <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
