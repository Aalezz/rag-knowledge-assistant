import axios from 'axios';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

const API = axios.create({ baseURL: BASE });

export const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await API.post('/ingest', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const sendMessage = async (question, sessionId) => {
  const res = await API.post('/chat', { question, session_id: sessionId });
  return res.data;
};

export const streamMessage = (question, sessionId, onToken, onSources, onError) => {
  fetch(`${BASE}/chat/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, session_id: sessionId }),
  }).then((response) => {
    const reader  = response.body.getReader();
    const decoder = new TextDecoder();
    const read = () => {
      reader.read().then(({ done, value }) => {
        if (done) return;
        const lines = decoder.decode(value).split('\n');
        lines.forEach((line) => {
          if (!line.startsWith('data: ')) return;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.token)   onToken(data.token);
            if (data.sources) onSources(data.sources);
            if (data.error)   onError(data.error);
          } catch {}
        });
        read();
      });
    };
    read();
  }).catch(onError);
};

export const clearSession = async (sessionId) => {
  await API.delete(`/chat/${sessionId}`);
};
