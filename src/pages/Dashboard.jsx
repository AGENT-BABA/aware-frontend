import React, { useState, useEffect } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';
import { CostGraph, CPUGraph } from '../components/Visuals';
import { AnomalyTable, ActionsTable } from '../components/Tables';
import FloatingChatWidget from '../components/FloatingChatWidget';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCcw } from 'lucide-react';

const Dashboard = ({ onLogout }) => {
  const [data, setData] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [dataRes, anomRes, actRes] = await Promise.all([
        api.get('/api/data', { headers }),
        api.get('/api/anomalies', { headers }),
        api.get('/api/actions', { headers })
      ]);
      setData(dataRes.data);
      setAnomalies(anomRes.data);
      setActions(actRes.data);
      setError('');
    } catch (err) {
      setError('Teleportation of telemetry data failed. Check connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Polling every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-blue-400 font-bold uppercase tracking-[0.3em] text-xs">Initializing Secure Stream</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar onLogout={onLogout} />
      
      <main className="pt-28 pb-20 px-4 md:px-8 max-w-[1600px] mx-auto">
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
              Operations Center
            </h1>
            <p className="text-gray-500 mt-1 uppercase tracking-widest font-black text-xs">Live Infrastructure Intelligence</p>
          </div>
          <button 
            onClick={fetchData}
            className="flex items-center gap-2 px-6 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all font-bold text-xs uppercase tracking-widest text-blue-400 border-blue-400/20"
          >
            <RefreshCcw className="w-4 h-4" /> Sync Metrics
          </button>
        </div>

        {/* Side-by-Side Containers for Graphs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <CostGraph data={data} />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <CPUGraph data={data} />
          </motion.div>
        </div>

        {/* Anomaly Details Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <AnomalyTable anomalies={anomalies} />
        </motion.div>

        {/* Remediation Actions History */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <ActionsTable actions={actions} />
        </motion.div>

        {/* Floating AI chat widget lives on top of the dashboard */}
      </main>
      <FloatingChatWidget />
    </div>
  );
};

export default Dashboard;
