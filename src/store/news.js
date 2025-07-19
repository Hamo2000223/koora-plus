import { create } from 'zustand';
import { newsApi } from '../axios/axiosConfig';

export const useNewsStore = create((set) => ({
  articles: [],
  totalArticles: null,
  loading: false,
  error: null,
  visibleCount: 8,

  fetchNews: async () => {
    set({ loading: true, error: null });
    try {
      // نستخدم المسار 'news' لأن axiosConfig يوجه للـ '/api'
      const url = `?q=كرة القدم&lang=ar&sortby=publishedAt&country=eg&max=100`;
      const res = await newsApi.get(url);
      const data = res.data;
      if (data.articles) {
        set({
          articles: data.articles,
          totalArticles: data.totalArticles,
          error: null,
          visibleCount: 8,
        });
      } else {
        set({ error: data.message || data.error || 'حدث خطأ أثناء جلب الأخبار / Error fetching news' });
      }
    } catch {
      set({ error: 'حدث خطأ أثناء جلب الأخبار / Error fetching news' });
    } finally {
      set({ loading: false });
    }
  },

  loadMore: () => set((state) => ({
    visibleCount: Math.min(state.visibleCount + 8, state.articles.length),
  })),

  resetNews: () => set({ articles: [], totalArticles: null, error: null, visibleCount: 8 }),
}));
