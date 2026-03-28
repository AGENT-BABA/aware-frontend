import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend
} from 'recharts';

export const CostGraph = ({ data }) => (
  <div className="h-[350px] w-full bg-card rounded-2xl border border-white/5 p-6 shadow-2xl relative overflow-hidden group hover:border-blue-500/20 transition-all">
    <div className="flex items-center justify-between mb-8 relative z-10">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-1 flex items-center gap-2">
          Cost Analysis
          <span className="text-[10px] px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20 tracking-normal capitalize">Real-time</span>
        </h3>
        <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
          Cloud Billing Over Time
        </p>
      </div>
      <div className="text-right">
        <span className="text-gray-500 text-xs uppercase font-bold tracking-widest block mb-1">Total Period Cost</span>
        <span className="text-2xl font-bold text-white">$1,240.25</span>
      </div>
    </div>

    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[60px] rounded-full group-hover:bg-blue-500/10 transition-all" />

    <ResponsiveContainer width="100%" height="70%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis 
          dataKey="timestamp" 
          stroke="rgba(255,255,255,0.3)" 
          fontSize={10} 
          tickFormatter={(str) => new Date(str).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          axisLine={false}
          tickLine={false}
        />
        <YAxis 
          stroke="rgba(255,255,255,0.3)" 
          fontSize={10} 
          axisLine={false}
          tickLine={false}
          tickFormatter={(val) => `$${val}`}
        />
        <Tooltip 
          contentStyle={{ backgroundColor: '#121216', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
          itemStyle={{ color: '#3b82f6', fontSize: '12px' }}
        />
        <Area 
          type="monotone" 
          dataKey="billing_rate" 
          stroke="#3b82f6" 
          strokeWidth={3}
          fillOpacity={1} 
          fill="url(#colorCost)" 
          animationDuration={2000}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export const CPUGraph = ({ data }) => (
  <div className="h-[350px] w-full bg-card rounded-2xl border border-white/5 p-6 shadow-2xl relative overflow-hidden group hover:border-purple-500/20 transition-all">
    <div className="flex items-center justify-between mb-8 relative z-10">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-1 flex items-center gap-2">
          Infrastructure
          <span className="text-[10px] px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded-full border border-purple-500/20 tracking-normal capitalize">CPU Util</span>
        </h3>
        <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
          Resource Utilization
        </p>
      </div>
      <div className="text-right">
        <span className="text-gray-500 text-xs uppercase font-bold tracking-widest block mb-1">Average Load</span>
        <span className="text-2xl font-bold text-white">42.5%</span>
      </div>
    </div>

    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-[60px] rounded-full group-hover:bg-purple-500/10 transition-all" />

    <ResponsiveContainer width="100%" height="70%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis 
          dataKey="timestamp" 
          stroke="rgba(255,255,255,0.3)" 
          fontSize={10} 
          tickFormatter={(str) => new Date(str).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          axisLine={false}
          tickLine={false}
        />
        <YAxis 
          stroke="rgba(255,255,255,0.3)" 
          fontSize={10} 
          axisLine={false}
          tickLine={false}
          tickFormatter={(val) => `${val}%`}
        />
        <Tooltip 
          contentStyle={{ backgroundColor: '#121216', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
          labelStyle={{ color: '#9ca3af', marginBottom: '4px' }}
        />
        <Line 
          type="monotone" 
          dataKey="cpu_utilization" 
          stroke="#8b5cf6" 
          strokeWidth={4} 
          dot={false}
          activeDot={{ r: 6, strokeWidth: 0 }}
          animationDuration={2500}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);
