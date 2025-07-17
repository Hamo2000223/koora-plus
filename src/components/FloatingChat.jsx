import { X } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { useChatStore } from "../store/chat";

const FloatingChat = ({ onClose }) => {
  const {
    messages,
    input,
    setInput,
    loading,
    error,
    sendMessage,
  } = useChatStore();

  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div style={{ position: 'fixed', bottom: 100, left: 32, zIndex: 99999, width: 350, maxWidth: '95vw', fontFamily: 'Cairo, sans-serif' }}
      className="rounded-2xl shadow-2xl border-2 bg-white border-gray-200 animate-fade-in">
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gradient-to-r from-indigo-700 to-pink-500 rounded-t-2xl">
        <span className="font-bold text-white text-lg">دردشة كورة بلس</span>
        <button onClick={onClose} className="text-white hover:text-red-400 text-2xl"> <X size={24} /></button>
      </div>
      <div ref={chatRef} className="h-64 overflow-y-auto p-3" style={{ background: '#f9f9f9' }}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-2 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <span className={`block px-4 py-2 rounded-2xl shadow ${msg.role === 'user' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-900'} max-w-[80%] whitespace-pre-line`}>
              {msg.content}
            </span>
          </div>
        ))}
        {loading && <div className="text-gray-400 text-center">...جاري التفكير</div>}
      </div>
      {error && <div className="text-red-500 mb-2 text-center font-bold">{error}</div>}
      <div className="flex gap-2 p-3 border-t border-gray-200 bg-gray-100 rounded-b-2xl">
        <input
          type="text"
          className="flex-1 p-2 rounded-lg bg-gray-200 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-md"
          placeholder="اكتب رسالتك..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          className="bg-gradient-to-r from-indigo-700 to-pink-500 text-white px-5 py-2 rounded-lg hover:from-pink-600 hover:to-indigo-600 font-bold text-md disabled:opacity-50"
          disabled={loading}
        >
          إرسال
        </button>
      </div>
    </div>
  );
};

export default FloatingChat; 