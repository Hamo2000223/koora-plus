import { create } from 'zustand';
import { newsApi } from '../axios/axiosConfig';

export const useNewsStore = create((set) => ({
  articles: [],
  totalResults: null,
  loading: false,
  error: null,
  page: 1,

  fetchNews: async (pageNum = 1, append = false) => {
    set({ loading: true, error: null });
    try {
      const url = `${import.meta.env.PROD?`/v2/everything`:""}?q=كرة القدم&language=ar&sortBy=publishedAt&pageSize=8&page=${pageNum}`;
      const res = await newsApi.get(url);
      const data = res.data;
      if (data.status === 'ok') {
        set((state) => ({
          articles: append ? [...state.articles, ...(data.articles || [])] : (data.articles || []),
          totalResults: data.totalResults,
          error: null,
          page: pageNum,
        }));
      } else {
        set({ error: data.message || data.error || 'حدث خطأ أثناء جلب الأخبار / Error fetching news' });
      }
    } catch {
      set({ error: 'حدث خطأ أثناء جلب الأخبار / Error fetching news' });
    } finally {
      set({ loading: false });
    }
  },

  resetNews: () => set({ articles: [], totalResults: null, error: null, page: 1 }),
})); 