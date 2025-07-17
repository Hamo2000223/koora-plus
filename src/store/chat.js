import axios from 'axios';
import { create } from 'zustand';

export const useChatStore = create((set, get) => ({
  messages: [
    { role: 'assistant', content: 'مرحباً بك في كورة بلس! كيف يمكنني مساعدتك اليوم؟' }
  ],
  loading: false,
  error: null,
  input: '',
  setInput: (input) => set({ input }),
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  setError: (error) => set({ error }),
  setLoading: (loading) => set({ loading }),
  clearInput: () => set({ input: '' }),
  async sendMessage() {
    const { input, messages, addMessage, setError, setLoading, clearInput } = get();
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    addMessage({ role: 'user', content: input });
    clearInput();
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o-mini',
          store: false,
          messages: [
            { role: 'system', content: 'أنت مساعد ذكي وودود.' },
            ...messages,
            { role: 'user', content: input }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
        }
      );
      const data = response.data;
      if (data.choices && data.choices[0]?.message?.content) {
        addMessage({ role: 'assistant', content: data.choices[0].message.content });
      } else {
        setError('لم يتم الحصول على رد من الذكاء الاصطناعي');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError(error.message || 'حدث خطأ أثناء الاتصال بـ OpenAI');
      }
    }
    setLoading(false);
  }
})); 