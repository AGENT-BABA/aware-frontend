import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, User, Mail, Lock, Key, ArrowRight } from 'lucide-react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const maskValue = (value) => {
  if (!value) return 'Not configured';
  return `${value.slice(0, 4)}...${value.slice(-4)}`;
};

const Settings = ({ onLogout }) => {
  const [name, setName] = useState(localStorage.getItem('username') || 'Admin');
  const [email, setEmail] = useState(localStorage.getItem('email') || 'admin@example.com');
  const [accessKey, setAccessKey] = useState(localStorage.getItem('awsAccessKey') || '');
  const [secretKey, setSecretKey] = useState(localStorage.getItem('awsSecretKey') || '');
  const [profileMessage, setProfileMessage] = useState('');
  const [awsMessage, setAwsMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [savingKeys, setSavingKeys] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const handleProfileSave = (e) => {
    e.preventDefault();
    localStorage.setItem('username', name);
    localStorage.setItem('email', email);
    setProfileMessage('Profile details updated successfully.');
    window.setTimeout(() => setProfileMessage(''), 3200);
  };

  const handleChangePassword = async () => {
    const nextPassword = window.prompt('Enter your new password');
    if (!nextPassword) return;

    setChangingPassword(true);
    setPasswordMessage('');
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/change-password',
        { password: nextPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPasswordMessage('Password updated successfully.');
    } catch (err) {
      setPasswordMessage('Unable to change password at this time.');
    } finally {
      setChangingPassword(false);
      window.setTimeout(() => setPasswordMessage(''), 3200);
    }
  };

  const handleKeysSubmit = async (e) => {
    e.preventDefault();
    setSavingKeys(true);
    setAwsMessage('');
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/aws-keys',
        { accessKey, secretKey },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.setItem('awsAccessKey', accessKey);
      localStorage.setItem('awsSecretKey', secretKey);
      setAwsMessage('AWS credentials saved successfully.');
    } catch (err) {
      setAwsMessage('Failed to save AWS keys.');
    } finally {
      setSavingKeys(false);
      window.setTimeout(() => setAwsMessage(''), 3200);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onLogout={onLogout} />
      <main className="pt-28 pb-20 px-4 md:px-8 max-w-[1200px] mx-auto">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
              Settings
            </h1>
            <p className="text-gray-500 mt-2 text-sm">View and update your profile and AWS key configuration.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <NavLink
              to="/dashboard"
              className="px-5 py-3 rounded-2xl border border-white/10 bg-white/5 text-sm font-semibold text-gray-300 hover:bg-white/10 transition"
            >
              Back to Dashboard
            </NavLink>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-3xl border border-white/10 p-8 shadow-2xl shadow-black/20"
          >
            <div className="flex items-center justify-between gap-4 mb-8">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-gray-500 mb-2">Account</p>
                <h2 className="text-2xl font-bold">Profile Information</h2>
              </div>
              <div className="flex items-center gap-2 text-blue-300 text-sm font-semibold">
                <ShieldCheck className="h-5 w-5" /> Secure account settings
              </div>
            </div>

            <form onSubmit={handleProfileSave} className="grid gap-6">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-gray-300">
                  <span className="flex items-center gap-2 font-semibold uppercase tracking-[0.2em] text-gray-400">
                    <User className="h-4 w-4" /> Name
                  </span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-blue-400 transition"
                    placeholder="Your name"
                  />
                </label>
                <label className="space-y-2 text-sm text-gray-300">
                  <span className="flex items-center gap-2 font-semibold uppercase tracking-[0.2em] text-gray-400">
                    <Mail className="h-4 w-4" /> Email
                  </span>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-blue-400 transition"
                    placeholder="you@example.com"
                  />
                </label>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-2xl bg-blue-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-blue-400"
                >
                  Save Profile
                </button>
                <button
                  type="button"
                  onClick={handleChangePassword}
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-gray-200 transition hover:bg-white/10"
                  disabled={changingPassword}
                >
                  {changingPassword ? 'Updating...' : 'Change Password'}
                </button>
              </div>

              {profileMessage && <p className="text-sm text-emerald-300">{profileMessage}</p>}
              {passwordMessage && <p className="text-sm text-yellow-300">{passwordMessage}</p>}
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-card rounded-3xl border border-white/10 p-8 shadow-2xl shadow-black/20"
          >
            <div className="flex items-center justify-between gap-4 mb-8">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-gray-500 mb-2">AWS Credentials</p>
                <h2 className="text-2xl font-bold">Cloud Access Keys</h2>
              </div>
              <div className="flex items-center gap-2 text-purple-300 text-sm font-semibold">
                <Key className="h-5 w-5" /> Manage keys
              </div>
            </div>

            <form onSubmit={handleKeysSubmit} className="grid gap-6">
              <label className="space-y-2 text-sm text-gray-300">
                <span className="font-semibold uppercase tracking-[0.2em] text-gray-400">AWS Access Key</span>
                <input
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-purple-400 transition"
                  placeholder="AKIA..."
                  required
                />
              </label>

              <label className="space-y-2 text-sm text-gray-300">
                <span className="font-semibold uppercase tracking-[0.2em] text-gray-400">AWS Secret Key</span>
                <input
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  type="password"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-purple-400 transition"
                  placeholder="Secret access key"
                  required
                />
              </label>

              <div className="flex items-center justify-between gap-4 flex-wrap">
                <button
                  type="submit"
                  disabled={savingKeys}
                  className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:opacity-90 disabled:opacity-50"
                >
                  {savingKeys ? 'Saving...' : 'Update Keys'}
                  {!savingKeys && <ArrowRight className="ml-2 h-4 w-4" />}
                </button>
                <span className="text-sm text-gray-400">Current key: {maskValue(accessKey)}</span>
              </div>

              {awsMessage && <p className="text-sm text-emerald-300">{awsMessage}</p>}
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
