import React, { useState, useRef, useEffect } from 'react';

const Stormy = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hey! I'm Stormy ⛈️ your weather assistant. Ask me anything — weather tips, travel advice, or just chat!",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting right now. Try again!" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(prev => !prev)}
        style={{
          position: 'fixed', bottom: '24px', right: '24px',
          width: '60px', height: '60px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          border: 'none', cursor: 'pointer', fontSize: '28px',
          boxShadow: '0 4px 20px rgba(102,126,234,0.5)',
          zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.2s',
        }}
        onMouseEnter={e => e.target.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.target.style.transform = 'scale(1)'}
      >
        {isOpen ? '✕' : '⛈️'}
      </button>

      {isOpen && (
        <div style={{
          position: 'fixed', bottom: '95px', right: '24px',
          width: '340px', height: '460px', borderRadius: '16px',
          background: 'rgba(15, 15, 35, 0.95)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
          display: 'flex', flexDirection: 'column', zIndex: 999, overflow: 'hidden',
        }}>
          <div style={{
            padding: '14px 16px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <span style={{ fontSize: '22px' }}>⛈️</span>
            <div>
              <p style={{ margin: 0, fontWeight: 'bold', color: 'white', fontSize: '15px' }}>Stormy</p>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>
                {loading ? 'Typing...' : 'Online'}
              </p>
            </div>
          </div>

          <div style={{
            flex: 1, overflowY: 'auto', padding: '12px',
            display: 'flex', flexDirection: 'column', gap: '8px',
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '80%', padding: '9px 13px',
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.role === 'user' ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'rgba(255,255,255,0.08)',
                  color: 'white', fontSize: '13px', lineHeight: '1.5',
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  padding: '9px 13px', borderRadius: '16px 16px 16px 4px',
                  background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', fontSize: '13px',
                }}>
                  Stormy is thinking...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div style={{
            padding: '12px', borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', gap: '8px',
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Stormy anything..."
              style={{
                flex: 1, padding: '9px 13px', borderRadius: '20px',
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.07)',
                color: 'white', fontSize: '13px', outline: 'none',
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                padding: '9px 14px', borderRadius: '20px', border: 'none',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white', cursor: 'pointer', fontSize: '16px',
                opacity: loading || !input.trim() ? 0.5 : 1,
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Stormy;