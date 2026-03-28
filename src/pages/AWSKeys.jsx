import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Key, ShieldCheck, Cpu, Info, ArrowRight, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const AWSKeys = ({ onKeysSet }) => {
  const navigate = useNavigate();
  const [accessKey, setAccessKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    const token = localStorage.getItem('token');
    try {
      await axios.post('/api/aws-keys',
        { accessKey, secretKey },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.setItem('awsAccessKey', accessKey);
      localStorage.setItem('awsSecretKey', secretKey);
      onKeysSet();
      setSuccess('AWS keys updated successfully. Redirecting to dashboard...');
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to update keys. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0a0a0c]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[50%] bg-blue-600/5 rounded-full blur-[150px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl glass p-10 rounded-3xl relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10"
      >
        <div>
          <h2 className="text-3xl font-bold mb-6">Cloud Setup</h2>
          <p className="text-gray-400 mb-8">
            To begin monitoring real-time metrics, connect your cloud infrastructure using an IAM user with read-only access to Billing & CloudWatch.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all group">
              <ShieldCheck className="w-6 h-6 text-blue-400 mt-1 shrink-0" />
              <div>
                <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors">Secure Storage</h4>
                <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Your keys are encrypted and never stored in plain text.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-purple-500/30 transition-all group">
              <Cpu className="w-6 h-6 text-purple-400 mt-1 shrink-0" />
              <div>
                <h4 className="font-semibold text-white group-hover:text-purple-400 transition-colors">Live Telemetry</h4>
                <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Enable real-time monitoring of CPU, Network, and Costs.</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-400 px-1 flex items-center gap-2">
                <Key className="w-4 h-4" /> AWS Access Key
              </label>
              <input
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 outline-none focus:border-blue-500 transition-all text-sm font-mono tracking-wider"
                placeholder="AKIA..."
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-400 px-1 flex items-center gap-2">
                <Lock className="w-4 h-4" /> AWS Secret Key
              </label>
              <input
                type="password"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 outline-none focus:border-blue-500 transition-all text-sm font-mono"
                placeholder="Required secret key"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                required
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs text-center">{error}</p>}

          <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl flex items-center gap-3">
            <Info className="w-5 h-5 text-yellow-500 shrink-0" />
            <p className="text-[11px] text-yellow-500 uppercase font-bold tracking-widest leading-relaxed">
              We recommend using a limited IAM role for security.
            </p>
          </div>

          {error && <p className="text-red-500 text-xs text-center">{error}</p>}
          {success && <p className="text-emerald-300 text-xs text-center">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full primary-gradient py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all"
          >
            {loading ? 'Validating...' : 'Initialize Pipeline'}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AWSKeys;
