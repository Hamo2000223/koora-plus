import { create } from 'zustand';
import { newsApi } from '../axios/axiosConfig';

export const useNewsStore = create((set, get) => ({
  articles: [],
  totalArticles: null,
  loading: false,
  error: null,
  visibleCount: 8,
  page: 1, // Track current page

  fetchNews: async (page = 1, append = false) => {
    set({ loading: true, error: null });
    try {
      const url = `?page=${page}`;
      const res = await newsApi.get(url);
      const data = res.data;
      if (data.articles) {
        set((state) => ({
          articles: append ? [...state.articles, ...data.articles] : data.articles,
          totalArticles: data.totalResults,
          error: null,
          visibleCount: append ? state.visibleCount + data.articles.length : 8,
          page,
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

  loadMore: () => {
    const { page, fetchNews } = get();
    fetchNews(page + 1, true); // Load next page and append
  },

  resetNews: () => set({ articles: [], totalArticles: null, error: null, visibleCount: 8, page: 1 }),
}));
