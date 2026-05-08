import React from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, Users, Download as DownloadIcon, BarChart3, Settings, LogOut, ArrowUpRight } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Downloads', value: '128.4K', change: '+12.5%', icon: DownloadIcon },
    { label: 'Active Users', value: '12.2K', change: '+5.2%', icon: Users },
    { label: 'Revenue (AdSense)', value: '$4,290', change: '+8.1%', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 p-6 hidden lg:flex flex-col">
        <div className="flex items-center gap-2 mb-12">
          <div className="w-8 h-8 bg-brand-primary rounded flex items-center justify-center font-bold text-black italic">RR</div>
          <span className="font-bold text-xl tracking-tight">ReelRush Admin</span>
        </div>

        <nav className="space-y-2 flex-1">
          {[
            { label: 'Overview', icon: LayoutDashboard, active: true },
            { label: 'Downloads', icon: DownloadIcon },
            { label: 'Users', icon: Users },
            { label: 'Analytics', icon: BarChart3 },
            { label: 'Settings', icon: Settings },
          ].map((item) => (
            <a 
              key={item.label}
              href="#" 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${item.active ? 'bg-brand-primary/10 text-brand-primary' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </a>
          ))}
        </nav>

        <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors">
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <div className="flex gap-4">
            <div className="glass px-4 py-2 rounded-xl flex items-center gap-2 text-sm text-gray-400">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              API Status: Online
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat) => (
            <div key={stat.label} className="glass p-6 rounded-2xl">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-xl bg-white/5">
                  <stat.icon size={24} className="text-brand-primary" />
                </div>
                <span className="text-green-400 text-xs font-bold bg-green-400/10 px-2 py-1 rounded-lg flex items-center gap-1">
                  {stat.change} <ArrowUpRight size={12} />
                </span>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">{stat.label}</h3>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Recent Downloads Table */}
        <div className="glass rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="font-bold">Recent Downloads</h3>
            <button className="text-brand-primary text-sm font-bold">View all</button>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs uppercase text-gray-500 tracking-wider">
                <th className="px-6 py-4 font-bold">Video</th>
                <th className="px-6 py-4 font-bold">Platform</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold">Time</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="border-t border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/10" />
                    <span className="font-medium">Video title #{i}...</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-white/10 px-2 py-1 rounded-lg text-xs">Instagram</span>
                  </td>
                  <td className="px-6 py-4 text-green-400 font-medium">Success</td>
                  <td className="px-6 py-4 text-gray-500">2 mins ago</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
