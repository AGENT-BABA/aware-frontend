import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Navbar from '../components/Navbar';
import { CreditCard, TrendingUp, BarChart3, ArrowLeft, ShieldCheck } from 'lucide-react';

const Billing = ({ onLogout }) => {
  const [data, setData] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadBilling = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      try {
        const [dataRes, anomaliesRes] = await Promise.all([
          axios.get('/api/data', { headers }),
          axios.get('/api/anomalies', { headers }),
        ]);
        setData(dataRes.data || []);
        setAnomalies(anomaliesRes.data || []);
      } catch (err) {
        setError('Unable to fetch billing insights right now.');
      } finally {
        setLoading(false);
      }
    };

    loadBilling();
  }, []);

  const totalBill = data.reduce((sum, item) => sum + Number(item.billing_rate || 0), 0);
  const utilizedBill = data.reduce(
    (sum, item) => sum + Number(item.billing_rate || 0) * (Number(item.cpu_utilization || 0) / 100),
    0
  );

  const topUsage = [...data]
    .sort((a, b) => Number(b.billing_rate || 0) - Number(a.billing_rate || 0))
    .slice(0, 3)
    .map((item) => ({
      label: item.resource || item.service_name || item.type || 'Unknown',
      value: Number(item.billing_rate || 0),
    }));

  const billingData = data.length
    ? data.map((item) => ({
        timestamp: item.timestamp || item.date || 'Unknown',
        total: Number(item.billing_rate || 0),
        utilized: Number(item.billing_rate || 0) * (Number(item.cpu_utilization || 0) / 100),
      }))
    : [
        { timestamp: '00:00', total: 20, utilized: 12 },
        { timestamp: '06:00', total: 80, utilized: 42 },
        { timestamp: '12:00', total: 140, utilized: 90 },
        { timestamp: '18:00', total: 110, utilized: 75 },
        { timestamp: '24:00', total: 95, utilized: 60 },
      ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar onLogout={onLogout} />
      <main className="pt-28 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between mb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-gray-500 mb-2">Billing</p>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
              Total bills & usage
            </h1>
            <p className="text-gray-500 mt-2 text-sm">Analyze spend, utilization, and the most expensive services in your cloud environment.</p>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-gray-300 hover:bg-white/10 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <section className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-3xl border border-white/10 p-8 shadow-2xl shadow-black/20"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-white/5 p-6 border border-white/10">
                  <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Total Bill</p>
                  <p className="mt-4 text-4xl font-bold text-white">${totalBill.toFixed(2)}</p>
                  <p className="mt-3 text-sm text-gray-400">Total spending over captured period.</p>
                </div>
                <div className="rounded-3xl bg-white/5 p-6 border border-white/10">
                  <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Utilized Bill</p>
                  <p className="mt-4 text-4xl font-bold text-white">${utilizedBill.toFixed(2)}</p>
                  <p className="mt-3 text-sm text-gray-400">Estimated billed spend tied to actual resource utilization.</p>
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-white/5 p-6 border border-white/10">
                  <div className="flex items-center gap-3 text-sm text-teal-300 uppercase tracking-[0.3em] font-semibold mb-3">
                    <CreditCard className="w-4 h-4" /> Top spend
                  </div>
                  <p className="text-3xl font-bold text-white">{topUsage[0]?.label || 'No usage yet'}</p>
                  <p className="mt-3 text-sm text-gray-400">Highest billed service or resource.</p>
                </div>
                <div className="rounded-3xl bg-white/5 p-6 border border-white/10">
                  <div className="flex items-center gap-3 text-sm text-blue-300 uppercase tracking-[0.3em] font-semibold mb-3">
                    <TrendingUp className="w-4 h-4" /> Usage insight
                  </div>
                  <p className="text-3xl font-bold text-white">{data.length ? `${data.length} entries` : 'No data'}</p>
                  <p className="mt-3 text-sm text-gray-400">Records analyzed for billing and utilization.</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-card rounded-3xl border border-white/10 p-8 shadow-2xl shadow-black/20"
            >
              <div className="flex items-center justify-between gap-4 mb-8">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-gray-500 mb-2">Trend</p>
                  <h2 className="text-2xl font-bold">Total vs Utilized Spend</h2>
                </div>
                <div className="flex items-center gap-2 text-blue-300 text-sm font-semibold">
                  <BarChart3 className="w-5 h-5" /> Dual line trend
                </div>
              </div>

              <div className="h-[360px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={billingData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="totalBill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.45} />
                        <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="utilizedBill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#34d399" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
                    <XAxis dataKey="timestamp" stroke="rgba(255,255,255,0.35)" axisLine={false} tickLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.35)" axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0b0c11', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px' }}
                    />
                    <Area type="monotone" dataKey="total" stroke="#60a5fa" strokeWidth={3} fill="url(#totalBill)" />
                    <Area type="monotone" dataKey="utilized" stroke="#34d399" strokeWidth={3} fill="url(#utilizedBill)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </section>

          <aside className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-3xl border border-white/10 p-8 shadow-2xl shadow-black/20"
            >
              <div className="flex items-center justify-between gap-4 mb-8">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-gray-500 mb-2">Usage Summary</p>
                  <h2 className="text-2xl font-bold">Top Billing Resources</h2>
                </div>
                <ShieldCheck className="w-5 h-5 text-purple-300" />
              </div>

              <div className="space-y-4">
                {topUsage.length ? (
                  topUsage.map((item, index) => (
                    <div key={index} className="rounded-3xl bg-white/5 p-4 border border-white/10">
                      <p className="text-sm text-gray-400 uppercase tracking-[0.2em]">Rank {index + 1}</p>
                      <p className="mt-2 font-semibold text-white">{item.label}</p>
                      <p className="text-sm text-gray-400">${item.value.toFixed(2)} billed</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No billing usage data available yet.</p>
                )}
              </div>
            </motion.div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Billing;
