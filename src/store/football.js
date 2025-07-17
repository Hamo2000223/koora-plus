import { create } from 'zustand';
import footballApi from '../axios/axiosConfig';

export const useFootballStore = create((set, get) => ({
  // Leagues
  leagues: null,
  leaguesLoading: false,
  leaguesError: null,
  fetchLeagues: async (params = {}) => {
    set({ leaguesLoading: true, leaguesError: null });
    try {
      const response = await footballApi.get('/leagues', { params });
      set({ leagues: response.data, leaguesLoading: false });
    } catch (error) {
      set({
        leaguesError: error.response?.data?.message || error.message || 'حدث خطأ أثناء جلب البطولات',
        leaguesLoading: false,
      });
    }
  },

  // Teams
  teams: null,
  teamsLoading: false,
  teamsError: null,
  fetchTeams: async (params = {}) => {
    set({ teamsLoading: true, teamsError: null });
    try {
      const response = await footballApi.get('/teams', { params });
      set({ teams: response.data, teamsLoading: false });
    } catch (error) {
      set({
        teamsError: error.response?.data?.message || error.message || 'حدث خطأ أثناء جلب الفرق',
        teamsLoading: false,
      });
    }
  },

  // Fixtures
  fixtures: null,
  fixturesLoading: false,
  fixturesError: null,
  fetchFixtures: async (params = {}) => {
    set({ fixturesLoading: true, fixturesError: null });
    try {
      const response = await footballApi.get('/fixtures', { params });
      set({ fixtures: response.data, fixturesLoading: false });
    } catch (error) {
      set({
        fixturesError: error.response?.data?.message || error.message || 'حدث خطأ أثناء جلب المباريات',
        fixturesLoading: false,
      });
    }
  },

  // Countries
  countries: null,
  countriesLoading: false,
  countriesError: null,
  fetchCountries: async (params = {}) => {
    set({ countriesLoading: true, countriesError: null });
    try {
      const response = await footballApi.get('/countries', { params });
      set({ countries: response.data, countriesLoading: false });
    } catch (error) {
      set({
        countriesError: error.response?.data?.message || error.message || 'حدث خطأ أثناء جلب الدول',
        countriesLoading: false,
      });
    }
  },

  leagueDetails: {}, // { [leagueName]: { logo, country, flag } }

  fetchLeagueDetails: async (leagueName) => {
    const { leagueDetails } = get();
    if (leagueDetails[leagueName]) return leagueDetails[leagueName]; // Use cache

    try {
      const response = await footballApi.get('/leagues', { params: { name: leagueName } });
      const league = response.data.response[0]?.league;
      const country = response.data.response[0]?.country;
      if (league && country) {
        const details = {
          logo: league.logo,
          country: country.name,
          flag: country.flag,
        };
        set((state) => ({
          leagueDetails: { ...state.leagueDetails, [leagueName]: details }
        }));
        return details;
      }
    } catch {
      // handle error if needed
    }
    return null;
  },
})); 