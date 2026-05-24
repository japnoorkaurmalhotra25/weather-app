import React, { useState, useRef, useEffect } from 'react';

const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

const Stormy = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hello! I'm Stormy ⛈️ — your smart weather assistant.\n\nI can help you with:\n• Weather forecasts\n• Travel suggestions\n• Clothing recommendations\n• Weather explanations\n• General questions",
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      content: input,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          messages: updatedMessages,
        }),
      });

      const data = await response.json();

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content:
            data.reply ||
            "I'm unable to respond right now.",
        },
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content:
            "⚠️ I'm having trouble connecting right now.\nPlease try again in a few moments.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleOpen = () => {
    setIsOpen(prev => {
      if (prev) setIsExpanded(false);
      return !prev;
    });
  };

  const chatWindowStyle = isExpanded
    ? {
        top: '24px',
        right: '24px',
        bottom: '96px',
        left: 'auto',
        width: 'min(720px, calc(100vw - 48px))',
        height: 'auto',
        maxWidth: 'none',
        maxHeight: 'none',
      }
    : {
        top: 'auto',
        bottom: '100px',
        right: '24px',
        left: 'auto',
        width: '360px',
        height: 'min(520px, calc(100vh - 120px))',
        maxWidth: 'min(360px, calc(100vw - 48px))',
        maxHeight: 'calc(100vh - 120px)',
      };

  return (
    <>
      {/* FLOATING BUTTON */}
      <button
        onClick={toggleOpen}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',

          width: '64px',
          height: '64px',

          borderRadius: '50%',
          border: 'none',

          background:
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',

          color: 'white',
          fontSize: '30px',

          cursor: 'pointer',

          zIndex: 1000,

          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',

          boxShadow:
            '0 10px 30px rgba(102,126,234,0.45)',

          transition: '0.25s ease',
        }}
      >
        {isOpen ? '✕' : '⛈️'}
      </button>

      {/* CHAT WINDOW */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            ...chatWindowStyle,

            borderRadius: '22px',

            overflow: 'hidden',

            background: 'rgba(10, 12, 30, 0.96)',

            border: '1px solid rgba(255,255,255,0.08)',

            backdropFilter: 'blur(20px)',

            boxShadow:
              '0 20px 60px rgba(0,0,0,0.45)',

            display: 'flex',
            flexDirection: 'column',

            zIndex: 999,

            transition:
              'top 0.3s ease, right 0.3s ease, bottom 0.3s ease, width 0.3s ease, height 0.3s ease',
          }}
        >
          {/* HEADER */}
          <div
            style={{
              padding: '16px 18px',

              background:
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',

              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',

              gap: '12px',

              minHeight: '82px',

              flexShrink: 0,
            }}
          >
            {/* LEFT SIDE */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',

                gap: '12px',

                flex: 1,

                minWidth: 0,

                height: '100%',
              }}
            >
              {/* ICON */}
              <div
                style={{
                  width: '42px',
                  height: '42px',

                  borderRadius: '12px',

                  background:
                    'rgba(255,255,255,0.15)',

                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',

                  flexShrink: 0,

                  fontSize: '22px',
                }}
              >
                ⛈️
              </div>

              {/* TEXT */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',

                  minWidth: 0,

                  flex: 1,
                }}
              >
                <div
                  style={{
                    color: 'white',

                    fontWeight: '700',

                    fontSize: '18px',

                    lineHeight: '1.2',
                  }}
                >
                  Stormy
                </div>

                <div
                  style={{
                    color:
                      'rgba(255,255,255,0.78)',

                    fontSize: '12px',

                    marginTop: '4px',

                    lineHeight: '1',
                  }}
                >
                  {loading
                    ? 'Thinking...'
                    : 'Weather Assistant Online'}
                </div>
              </div>
            </div>

            {/* RIGHT BUTTONS */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',

                flexShrink: 0,
              }}
            >
              {/* EXPAND */}
              <button
                onClick={() =>
                  setIsExpanded(prev => !prev)
                }
                title={
                  isExpanded
                    ? 'Minimize'
                    : 'Expand'
                }

                style={{
                  width: '38px',
                  height: '38px',

                  borderRadius: '10px',

                  border: 'none',

                  background:
                    'rgba(255,255,255,0.18)',

                  color: 'white',

                  cursor: 'pointer',

                  fontSize: '16px',

                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',

                  transition: '0.2s ease',
                }}
              >
                {isExpanded ? '🗕' : '🗖'}
              </button>

              {/* CLOSE */}
              <button
                onClick={() => setIsOpen(false)}
                title="Close"

                style={{
                  width: '38px',
                  height: '38px',

                  borderRadius: '10px',

                  border: 'none',

                  background:
                    'rgba(255,255,255,0.18)',

                  color: 'white',

                  cursor: 'pointer',

                  fontSize: '18px',

                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* MESSAGES */}
          <div
            style={{
              flex: 1,
              minHeight: 0,

              overflowY: 'auto',

              padding: '18px',

              display: 'flex',
              flexDirection: 'column',

              gap: '14px',

              background:
                'linear-gradient(to bottom, rgba(5,10,30,0.95), rgba(2,5,18,0.98))',
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',

                  justifyContent:
                    msg.role === 'user'
                      ? 'flex-end'
                      : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '85%',

                    padding: '14px 16px',

                    borderRadius:
                      msg.role === 'user'
                        ? '18px 18px 6px 18px'
                        : '18px 18px 18px 6px',

                    background:
                      msg.role === 'user'
                        ? 'linear-gradient(135deg,#667eea,#764ba2)'
                        : 'rgba(255,255,255,0.07)',

                    border:
                      msg.role === 'assistant'
                        ? '1px solid rgba(255,255,255,0.06)'
                        : 'none',

                    color: 'white',

                    lineHeight: '1.8',

                    fontSize: isExpanded
                      ? '15px'
                      : '14px',

                    whiteSpace: 'pre-wrap',

                    backdropFilter: 'blur(12px)',
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                }}
              >
                <div
                  style={{
                    padding: '12px 15px',

                    borderRadius: '18px',

                    background:
                      'rgba(255,255,255,0.07)',

                    color:
                      'rgba(255,255,255,0.7)',

                    fontSize: '14px',
                  }}
                >
                  Stormy is thinking...
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* INPUT */}
          <div
            style={{
              padding: '14px',

              borderTop:
                '1px solid rgba(255,255,255,0.06)',

              display: 'flex',
              alignItems: 'center',

              gap: '10px',

              flexShrink: 0,

              background: 'rgba(8,10,25,0.95)',
            }}
          >
            <input
              value={input}
              onChange={e =>
                setInput(e.target.value)
              }

              onKeyDown={handleKeyDown}

              placeholder="Ask Stormy anything..."

              style={{
                flex: 1,

                padding: '13px 16px',

                borderRadius: '16px',

                border:
                  '1px solid rgba(255,255,255,0.1)',

                background:
                  'rgba(255,255,255,0.06)',

                color: 'white',

                outline: 'none',

                fontSize: '14px',
              }}
            />

            <button
              onClick={sendMessage}
              disabled={
                loading || !input.trim()
              }

              style={{
                width: '50px',
                height: '50px',

                borderRadius: '14px',

                border: 'none',

                background:
                  'linear-gradient(135deg,#667eea,#764ba2)',

                color: 'white',

                fontSize: '18px',

                cursor: 'pointer',

                opacity:
                  loading || !input.trim()
                    ? 0.5
                    : 1,

                transition: '0.2s ease',
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