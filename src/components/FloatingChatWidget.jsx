import React, { useState, useEffect, useRef } from 'react';
import { Bot, MessageCircle, Send, X, Loader2, Search } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ right: 32, bottom: 32 });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content:
        'System Intelligence Active. Ask a business question or type logic to analyze your cloud telemetry.',
    },
  ]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const pointerDownRef = useRef(false);
  const draggedRef = useRef(false);
  const startPointerRef = useRef({ x: 0, y: 0 });
  const offsetRef = useRef({ x: 0, y: 0 });
  const iconRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem('floatingChatPosition');
    if (stored) {
      try {
        setPosition(JSON.parse(stored));
      } catch {
        // ignore invalid saved position
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('floatingChatPosition', JSON.stringify(position));
  }, [position]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleMove = (event) => {
      if (!pointerDownRef.current) return;
      event.preventDefault();

      const dx = event.clientX - startPointerRef.current.x;
      const dy = event.clientY - startPointerRef.current.y;
      const distance = Math.hypot(dx, dy);
      if (distance > 6) {
        draggedRef.current = true;
      }

      const iconWidth = 72;
      const iconHeight = 72;
      const left = event.clientX - offsetRef.current.x;
      const top = event.clientY - offsetRef.current.y;
      const clampedLeft = Math.min(Math.max(12, left), window.innerWidth - iconWidth - 12);
      const clampedTop = Math.min(Math.max(12, top), window.innerHeight - iconHeight - 12);

      setPosition({
        right: Math.round(window.innerWidth - clampedLeft - iconWidth),
        bottom: Math.round(window.innerHeight - clampedTop - iconHeight),
      });
    };

    const handleUp = () => {
      if (!pointerDownRef.current) return;
      if (!draggedRef.current) {
        setOpen((prev) => !prev);
      }
      pointerDownRef.current = false;
      draggedRef.current = false;
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('pointercancel', handleUp);

    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', handleUp);
    };
  }, []);

  const handlePointerDown = (event) => {
    event.preventDefault();
    pointerDownRef.current = true;
    draggedRef.current = false;
    startPointerRef.current = { x: event.clientX, y: event.clientY };

    const rect = iconRef.current?.getBoundingClientRect();
    offsetRef.current = {
      x: event.clientX - (rect?.left ?? 0),
      y: event.clientY - (rect?.top ?? 0),
    };
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const nextMessages = [...messages, { role: 'user', content: query }];
    setMessages(nextMessages);
    setQuery('');
    setLoading(true);

    try {
      const response = await axios.post(
        '/api/chat',
        { query },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setMessages([...nextMessages, { role: 'bot', content: response.data.response }]);
    } catch (error) {
      setMessages([
        ...nextMessages,
        { role: 'bot', content: 'Connection error. Please try again later.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const iconTop = windowSize.height - position.bottom - 72;
  const panelStyle = iconTop > 220
    ? { right: position.right, bottom: position.bottom + 96 }
    : { right: position.right, top: Math.max(12, iconTop + 96) };

  return (
    <>
      <div
        ref={iconRef}
        onPointerDown={handlePointerDown}
        style={{ right: position.right, bottom: position.bottom, touchAction: 'none' }}
        className="fixed z-50 flex h-18 w-18 items-center justify-center rounded-full bg-blue-500 text-white shadow-2xl shadow-blue-500/30 border border-white/10 cursor-grab transition-transform hover:scale-[1.04]"
      >
        <MessageCircle className="h-7 w-7" />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            style={panelStyle}
            className="fixed z-50 w-[320px] max-w-[calc(100vw-24px)] bg-[#090b10]/95 border border-white/10 rounded-3xl shadow-2xl shadow-black/40 backdrop-blur-xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-blue-500/15 flex items-center justify-center text-blue-300">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold">AI Business Copilot</p>
                  <p className="text-[11px] text-gray-400">Drag the icon, then tap to chat.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-2 text-gray-400 hover:bg-white/5 hover:text-white transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[320px] overflow-y-auto px-4 py-4 space-y-4 custom-scrollbar">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${msg.role === 'user' ? 'bg-blue-500/10 text-blue-300' : 'bg-white/10 text-white/80'}`}>
                    {msg.role === 'user' ? 'U' : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={`rounded-2xl p-3 text-sm leading-6 ${msg.role === 'user' ? 'bg-blue-500/10 text-blue-100' : 'bg-white/5 text-gray-200'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-blue-300 text-xs uppercase tracking-[0.2em]">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  thinking through your business logic...
                </div>
              )}
            </div>

            <form onSubmit={handleSend} className="relative px-4 pb-4">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type business logic or questions..."
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-24 text-sm text-white outline-none transition focus:border-blue-400/70"
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-xl bg-blue-500 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Sending' : 'Send'}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingChatWidget;
