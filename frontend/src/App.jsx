import React, { useState } from 'react';
import DocumentUpload from './components/DocumentUpload';
import ChatWindow from './components/ChatWindow';

const SESSION_ID = `session_${Date.now()}`;

export default function App() {
  const [docsReady, setDocsReady] = useState(false);

  const s = {
    app:     { display: 'flex', height: '100vh', background: '#0d1117', color: '#e6edf3' },
    sidebar: { width: '280px', borderRight: '1px solid #30363d', display: 'flex', flexDirection: 'column', background: '#161b22' },
    head:    { padding: '16px', borderBottom: '1px solid #30363d' },
    logo:    { fontSize: '16px', fontWeight: 700, color: '#58a6ff' },
    sub:     { fontSize: '11px', color: '#8b949e', marginTop: '2px' },
    main:    { flex: 1, display: 'flex', flexDirection: 'column' },
    tip:     { padding: '12px 16px', fontSize: '12px', color: '#8b949e', borderTop: '1px solid #30363d', marginTop: 'auto' },
    powered: { padding: '10px 16px', fontSize: '11px', color: '#555', borderTop: '1px solid #21262d', textAlign: 'center' },
  };

  return (
    <div style={s.app}>
      <div style={s.sidebar}>
        <div style={s.head}>
          <div style={s.logo}>🧠 RAG Assistant</div>
          <div style={s.sub}>Powered by Claude · Anthropic</div>
        </div>

        <DocumentUpload onUploadSuccess={() => setDocsReady(true)} />

        <div style={s.tip}>
          <p><strong>💡 Tips</strong></p>
          <p style={{ marginTop: '6px' }}>• Upload multiple documents</p>
          <p>• Ask specific questions</p>
          <p>• Click sources to see context</p>
          <p>• Claude handles large docs well</p>
        </div>

        <div style={s.powered}>
          Built by Alezz Aldumaini
        </div>
      </div>

      <div style={s.main}>
        <ChatWindow sessionId={SESSION_ID} />
      </div>
    </div>
  );
}
