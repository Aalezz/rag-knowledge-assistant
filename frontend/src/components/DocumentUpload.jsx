import React, { useState, useRef } from 'react';
import { uploadDocument } from '../api';

export default function DocumentUpload({ onUploadSuccess }) {
  const [dragging, setDragging]   = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded]   = useState([]);
  const [error, setError]         = useState('');
  const inputRef = useRef();

  const handleFile = async (file) => {
    setError('');
    setUploading(true);
    try {
      const result = await uploadDocument(file);
      setUploaded((prev) => [...prev, { name: file.name, chunks: result.chunks_indexed }]);
      onUploadSuccess && onUploadSuccess(result);
    } catch (e) {
      setError(e.response?.data?.detail || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const s = {
    container: { padding: '16px', borderBottom: '1px solid #30363d' },
    label:     { fontSize: '12px', color: '#8b949e', marginBottom: '8px', fontWeight: 600, display: 'block' },
    dropzone:  {
      border: `2px dashed ${dragging ? '#58a6ff' : '#30363d'}`,
      borderRadius: '8px', padding: '20px', textAlign: 'center',
      cursor: 'pointer', transition: 'border-color 0.2s',
      background: dragging ? '#161b22' : 'transparent',
    },
    hint:  { fontSize: '13px', color: '#8b949e' },
    btn:   { marginTop: '8px', padding: '6px 14px', background: '#238636', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
    item:  { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', margin: '4px 0', background: '#0d1117', borderRadius: '6px', fontSize: '12px' },
    badge: { background: '#1f6feb', color: '#fff', padding: '2px 6px', borderRadius: '10px', fontSize: '11px' },
    error: { color: '#f85149', fontSize: '12px', marginTop: '6px' },
  };

  return (
    <div style={s.container}>
      <span style={s.label}>DOCUMENTS</span>
      <div
        style={s.dropzone}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current.click()}
      >
        <p style={s.hint}>{uploading ? '⏳ Uploading...' : '📄 Drop PDF, DOCX, or TXT'}</p>
        <button style={s.btn} disabled={uploading}>Browse File</button>
        <input
          ref={inputRef} type="file" accept=".pdf,.docx,.txt"
          style={{ display: 'none' }}
          onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
        />
      </div>
      {error && <p style={s.error}>{error}</p>}
      {uploaded.map((f, i) => (
        <div key={i} style={s.item}>
          <span style={{ color: '#e6edf3' }}>📎 {f.name}</span>
          <span style={s.badge}>{f.chunks} chunks</span>
        </div>
      ))}
    </div>
  );
}
