import React, { useState } from 'react';

export default function SourceHighlight({ sources }) {
  const [expanded, setExpanded] = useState(null);
  if (!sources || sources.length === 0) return null;

  const s = {
    wrap:    { marginTop: '8px' },
    title:   { fontSize: '11px', color: '#8b949e', marginBottom: '4px', fontWeight: 600 },
    card:    { background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', marginBottom: '4px', overflow: 'hidden' },
    header:  { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', cursor: 'pointer' },
    name:    { fontSize: '12px', color: '#58a6ff' },
    page:    { fontSize: '11px', color: '#8b949e' },
    body:    { padding: '8px 10px', fontSize: '12px', color: '#8b949e', borderTop: '1px solid #30363d', lineHeight: 1.5 },
  };

  return (
    <div style={s.wrap}>
      <p style={s.title}>📚 SOURCES ({sources.length})</p>
      {sources.map((src, i) => (
        <div key={i} style={s.card}>
          <div style={s.header} onClick={() => setExpanded(expanded === i ? null : i)}>
            <span style={s.name}>📄 {src.source}</span>
            <span style={s.page}>{src.page > 0 ? `Page ${src.page}` : 'Page 1'} {expanded === i ? '▲' : '▼'}</span>
          </div>
          {expanded === i && (
            <div style={s.body}><em>"{src.content}..."</em></div>
          )}
        </div>
      ))}
    </div>
  );
}
