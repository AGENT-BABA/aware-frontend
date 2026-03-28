import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, Search } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const AIChat = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'System Intelligence Active. I can provide insights into cost anomalies and utilization trends. How can I assist you today?' }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const newMessages = [...messages, { role: 'user', content: query }];
    setMessages(newMessages);
    setQuery('');
    setLoading(true);

    try {
      const resp = await axios.post('/api/chat', 
        { query },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setMessages([...newMessages, { role: 'bot', content: resp.data.response }]);
    } catch (err) {
      setMessages([...newMessages, { role: 'bot', content: 'Connection to LLM nodes lost. Please try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-card rounded-3xl border border-white/5 mt-10 p-8 shadow-2xl relative overflow-hidden group hover:border-blue-500/20 transition-all mb-20">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] pointer-events-none" />
      
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 primary-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Bot className="w-7 h-7 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            LLM Copilot <Sparkles className="w-4 h-4 text-blue-400" />
          </h3>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-black">AI System Intelligence Interface</p>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="h-[400px] overflow-y-auto mb-6 pr-4 custom-scrollbar space-y-6 flex flex-col pt-4"
      >
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-4 max-w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-secondary/20' : 'bg-primary/20'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-secondary" /> : <Bot className="w-4 h-4 text-primary" />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-secondary/10 border border-secondary/20 text-indigo-100 rounded-tr-none' : 'bg-white/5 border border-white/10 text-gray-300 rounded-tl-none'}`}>
                {msg.content}
              </div>
            </motion.div>
          ))}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 text-blue-400 text-xs font-bold uppercase tracking-widest pl-12">
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing infrastructure nodes...
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <form onSubmit={handleSend} className="relative mt-8">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-32 outline-none focus:border-blue-500/50 transition-all text-white placeholder:text-gray-600 shadow-inner"
          placeholder="Ask system intelligence (e.g., 'Why did cost spike yesterday?')"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2.5 primary-gradient rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:scale-[1.02] transition-all shadow-lg"
          disabled={loading}
        >
          {loading ? 'Thinking...' : 'Analyze'}
          {!loading && <Send className="w-3 h-3" />}
        </button>
      </form>
    </div>
  );
};

export default AIChat;
