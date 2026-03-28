import React from 'react';
import { AlertTriangle, ShieldCheck, Clock, Zap, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AnomalyTable = ({ anomalies }) => (
  <div className="w-full bg-card rounded-2xl border border-white/5 p-6 mt-8 overflow-hidden shadow-2xl transition-all hover:border-warning/10">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center border border-warning/20">
        <AlertTriangle className="w-6 h-6 text-warning" />
      </div>
      <div>
        <h3 className="text-xl font-bold">Anomaly Detection</h3>
        <p className="text-gray-500 text-sm tracking-wide uppercase font-bold">Real-time Intelligence Engine</p>
      </div>
    </div>

    <div className="overflow-x-auto custom-scrollbar">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-white/10">
            <th className="py-4 text-xs font-bold uppercase tracking-widest text-gray-500 pl-4">Timestamp</th>
            <th className="py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Utilization</th>
            <th className="py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Error Rate</th>
            <th className="py-4 text-xs font-bold uppercase tracking-widest text-gray-500 text-center">Severity</th>
            <th className="py-4 text-xs font-bold uppercase tracking-widest text-gray-500 pr-4">Cost Spike</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          <AnimatePresence>
            {anomalies.map((anom, idx) => (
              <motion.tr 
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group hover:bg-white/5 transition-all text-sm"
              >
                <td className="py-5 pl-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span className="text-gray-300 font-medium">
                    {new Date(anom.timestamp).toLocaleString()}
                  </span>
                </td>
                <td className="py-5 font-mono text-purple-400 font-bold">{parseFloat(anom.cpu_utilization).toFixed(2)}%</td>
                <td className="py-5 font-mono text-red-400 font-bold">{parseFloat(anom.error_rate).toFixed(2)}%</td>
                <td className="py-5 text-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-500/20 bg-red-500/10 text-red-500`}>
                    CRITICAL
                  </span>
                </td>
                <td className="py-5 pr-4 text-right">
                  <span className="text-gray-300 font-bold tracking-tight">+${(parseFloat(anom.billing_rate) * 2).toFixed(2)}/hr</span>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  </div>
);

export const ActionsTable = ({ actions }) => (
  <div className="w-full bg-card rounded-2xl border border-white/5 p-6 mt-8 shadow-2xl transition-all hover:border-success/10">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center border border-success/20">
        <ShieldCheck className="w-6 h-6 text-success" />
      </div>
      <div>
        <h3 className="text-xl font-bold">Automated Remediation</h3>
        <p className="text-gray-500 text-sm tracking-wide uppercase font-bold">Execution History</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {actions.map((act, idx) => (
        <motion.div 
          key={idx}
          whileHover={{ y: -5 }}
          className="p-5 rounded-2xl bg-white/5 border border-white/5 border-l-2 border-l-success group transition-all"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="bg-success/10 p-2 rounded-lg">
              <Zap className="w-5 h-5 text-success fill-success/20" />
            </div>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              {new Date(act.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <h4 className="font-bold text-white mb-2 leading-tight group-hover:text-success transition-colors">{act.action}</h4>
          <p className="text-xs text-gray-500 mb-4 flex items-start gap-2">
            <Target className="w-4 h-4 mt-0.5 shrink-0" />
            {act.reason}
          </p>
          <div className="pt-3 border-t border-white/5 flex items-center justify-between">
            <span className="text-[10px] text-success font-black uppercase tracking-widest flex items-center gap-1">
              Impact Generated
            </span>
            <span className="text-xs font-bold text-white px-2 py-1 bg-white/5 rounded-md">{act.impact}</span>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);
