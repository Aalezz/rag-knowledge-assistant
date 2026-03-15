import React, { useState, useRef, useEffect } from 'react';
import { streamMessage, clearSession } from '../api';
import SourceHighlight from './SourceHighlight';

export default function ChatWindow({ sessionId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    if (!input.trim() || loading) return;
    const question = input.trim();
    setInput('');
    setLoading(true);
    setMessages((prev) => [...prev, { role: 'user', content: question }]);
    setMessages((prev) => [...prev, { role: 'assistant', content: '', sources: [] }]);

    streamMessage(
      question, sessionId,
      (token) => setMessages((prev) => {
        const u = [...prev];
        u[u.length - 1].content += token;
        return u;
      }),
      (sources) => {
        setMessages((prev) => {
          const u = [...prev];
          u[u.length - 1].sources = sources;
          return u;
        });
        setLoading(false);
      },
      (err) => {
        setMessages((prev) => {
          const u = [...prev];
          u[u.length - 1].content = `Error: ${err}`;
          return u;
        });
        setLoading(false);
      }
    );
  };

  const s = {
    wrap:    { display: 'flex', flexDirection: 'column', height: '100%' },
    header:  { padding: '12px 16px', borderBottom: '1px solid #30363d', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    title:   { fontSize: '14px', fontWeight: 600, color: '#e6edf3' },
    clearBtn:{ fontSize: '12px', color: '#8b949e', background: 'none', border: '1px solid #30363d', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer' },
    msgs:    { flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' },
    user:    { alignSelf: 'flex-end', background: '#1f6feb', color: '#fff', padding: '10px 14px', borderRadius: '12px 12px 2px 12px', maxWidth: '75%', fontSize: '14px', lineHeight: 1.5 },
    bot:     { alignSelf: 'flex-start', background: '#161b22', border: '1px solid #30363d', color: '#e6edf3', padding: '10px 14px', borderRadius: '2px 12px 12px 12px', maxWidth: '85%', fontSize: '14px', lineHeight: 1.6 },
    empty:   { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#8b949e', gap: '8px' },
    footer:  { padding: '12px 16px', borderTop: '1px solid #30363d', display: 'flex', gap: '8px' },
    input:   { flex: 1, background: '#161b22', border: '1px solid #30363d', borderRadius: '8px', padding: '10px 14px', color: '#e6edf3', fontSize: '14px', outline: 'none' },
    sendBtn: { background: '#238636', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 18px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 },
    cursor:  { display: 'inline-block', width: '8px', height: '14px', background: '#58a6ff', marginLeft: '2px', animation: 'blink 1s infinite' },
  };

  return (
    <div style={s.wrap}>
      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>

      <div style={s.header}>
        <span style={s.title}>💬 AI Knowledge Assistant — Powered by Claude</span>
        <button style={s.clearBtn} onClick={async () => { await clearSession(sessionId); setMessages([]); }}>
          Clear Chat
        </button>
      </div>

      <div style={s.msgs}>
        {messages.length === 0 && (
          <div style={s.empty}>
            <span style={{ fontSize: '36px' }}>🧠</span>
            <p style={{ fontSize: '14px' }}>Upload a document and start asking questions</p>
            <p style={{ fontSize: '12px', color: '#555' }}>Powered by Claude (Anthropic)</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} style={msg.role === 'user' ? s.user : s.bot}>
            <div style={{ whiteSpace: 'pre-wrap' }}>
              {msg.content}
              {msg.role === 'assistant' && loading && i === messages.length - 1 && (
                <span style={s.cursor} />
              )}
            </div>
            {msg.role === 'assistant' && msg.sources?.length > 0 && (
              <SourceHighlight sources={msg.sources} />
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div style={s.footer}>
        <input
          style={s.input}
          placeholder="Ask a question about your documents..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          disabled={loading}
        />
        <button style={s.sendBtn} onClick={send} disabled={loading}>
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
