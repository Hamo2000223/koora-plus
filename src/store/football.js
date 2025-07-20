import { create } from 'zustand';
import { footballApi } from '../axios/axiosConfig';

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

  // Players Search
  playersSearch: null,
  playersSearchLoading: false,
  playersSearchError: null,
  searchPlayers: async (searchTerm) => {
    set({ playersSearchLoading: true, playersSearchError: null });
    try {
      const response = await footballApi.get('/players/profiles', { params: { search: searchTerm } });
      set({ playersSearch: response.data, playersSearchLoading: false });
    } catch (error) {
      set({
        playersSearchError: error.response?.data?.message || error.message || 'حدث خطأ أثناء البحث عن اللاعبين',
        playersSearchLoading: false,
      });
    }
  },

  // Players by Team
  players: null,
  playersLoading: false,
  playersError: null,
  fetchPlayers: async (params = {}) => {
    set({ playersLoading: true, playersError: null });
    try {
      const response = await footballApi.get('/players', { params });
      set({ players: response.data, playersLoading: false });
    } catch (error) {
      set({
        playersError: error.response?.data?.message || error.message || 'حدث خطأ أثناء جلب اللاعبين',
        playersLoading: false,
      });
    }
  },

  // Player Seasons
  playerSeasons: {}, // { [playerId]: { loading, error, seasons } }
  fetchPlayerSeasons: async (playerId) => {
    set((state) => ({
      playerSeasons: {
        ...state.playerSeasons,
        [playerId]: { loading: true, error: null, seasons: null },
      },
    }));
    try {
      const response = await footballApi.get('/players/seasons', { params: { player: playerId } });
      set((state) => ({
        playerSeasons: {
          ...state.playerSeasons,
          [playerId]: { loading: false, error: null, seasons: response.data.response },
        },
      }));
    } catch (error) {
      set((state) => ({
        playerSeasons: {
          ...state.playerSeasons,
          [playerId]: {
            loading: false,
            error: error.response?.data?.message || error.message || 'حدث خطأ أثناء جلب مواسم اللاعب',
            seasons: null,
          },
        },
      }));
    }
  },

  // Player Statistics
  playerStats: {}, // { [playerId]: { loading, error, stats } }
  fetchPlayerStats: async (playerId, season = null, teamId = null) => {
    const key = `${playerId}-${season}-${teamId}`;
    set((state) => ({
      playerStats: {
        ...state.playerStats,
        [key]: { loading: true, error: null, stats: null },
      },
    }));
    try {
      const params = { id: playerId };
      if (season) params.season = season;
      const response = await footballApi.get('/players', { params });
      
      // Filter by team if specified
      let stats = response.data.response[0]?.statistics || [];
      if (teamId) {
        stats = stats.filter(stat => stat.team?.id === parseInt(teamId));
      }
      
      set((state) => ({
        playerStats: {
          ...state.playerStats,
          [key]: { loading: false, error: null, stats },
        },
      }));
    } catch (error) {
      set((state) => ({
        playerStats: {
          ...state.playerStats,
          [key]: {
            loading: false,
            error: error.response?.data?.message || error.message || 'حدث خطأ أثناء جلب إحصائيات اللاعب',
            stats: null,
          },
        },
      }));
    }
  },

  // Team Statistics
  teamStats: {}, // { [teamId]: { loading, error, stats } }
  fetchTeamStats: async (teamId, season = null, league = null) => {
    const key = `${teamId}-${season}-${league}`;
    set((state) => ({
      teamStats: {
        ...state.teamStats,
        [key]: { loading: true, error: null, stats: null },
      },
    }));
    try {
      const params = { team: teamId };
      if (season) params.season = season;
      if (league) params.league = league;
      
      const response = await footballApi.get('/teams/statistics', { params });
      
      set((state) => ({
        teamStats: {
          ...state.teamStats,
          [key]: { loading: false, error: null, stats: response.data.response },
        },
      }));
    } catch (error) {
      set((state) => ({
        teamStats: {
          ...state.teamStats,
          [key]: {
            loading: false,
            error: error.response?.data?.message || error.message || 'حدث خطأ أثناء جلب إحصائيات الفريق',
            stats: null,
          },
        },
      }));
    }
  },

  // Team Players
  teamPlayers: {}, // { [teamId]: { loading, error, players } }
  fetchTeamPlayers: async (teamId) => {
    // Use just teamId as key since /players/squads doesn't need season
    const key = teamId.toString();
    set((state) => ({
      teamPlayers: {
        ...state.teamPlayers,
        [key]: { loading: true, error: null, players: null },
      },
    }));
    try {
      const params = { team: teamId };
      // Don't include season parameter for /players/squads
      
      // Use /players/squads endpoint directly
      const response = await footballApi.get('/players/squads', { params });

      
      set((state) => ({
        teamPlayers: {
          ...state.teamPlayers,
          [key]: { loading: false, error: null, players: response.data.response[0]?.players || [] },
        },
      }));
    } catch (error) {
      set((state) => ({
        teamPlayers: {
          ...state.teamPlayers,
          [key]: {
            loading: false,
            error: error.response?.data?.message || error.message || 'حدث خطأ أثناء جلب لاعبين الفريق',
            players: null,
          },
        },
      }));
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

  // Fixture Events
  fixtureEvents: {}, // { [fixtureId]: { loading, error, events } }
  fetchFixtureEvents: async (fixtureId, playerId = null) => {
    const key = playerId ? `${fixtureId}-${playerId}` : fixtureId;
    set((state) => ({
      fixtureEvents: {
        ...state.fixtureEvents,
        [key]: { loading: true, error: null, events: null },
      },
    }));
    try {
      const params = { fixture: fixtureId };
      if (playerId) {
        params.player = playerId;
      }
      const response = await footballApi.get('/fixtures/events', { params });
      set((state) => ({
        fixtureEvents: {
          ...state.fixtureEvents,
          [key]: { loading: false, error: null, events: response.data.response },
        },
      }));
    } catch (error) {
      set((state) => ({
        fixtureEvents: {
          ...state.fixtureEvents,
          [key]: {
            loading: false,
            error: error.response?.data?.message || error.message || 'حدث خطأ أثناء جلب أحداث المباراة',
            events: null,
          },
        },
      }));
    }
  },

  // Lineups
  lineups: {}, // { [fixtureId]: { loading, error, lineup } }
  fetchLineups: async (fixtureId) => {
    set((state) => ({
      lineups: {
        ...state.lineups,
        [fixtureId]: { loading: true, error: null, lineup: null },
      },
    }));
    try {
      const response = await footballApi.get('/fixtures/lineups', { params: { fixture: fixtureId } });
      set((state) => ({
        lineups: {
          ...state.lineups,
          [fixtureId]: { loading: false, error: null, lineup: response.data.response },
        },
      }));
    } catch (error) {
      set((state) => ({
        lineups: {
          ...state.lineups,
          [fixtureId]: {
            loading: false,
            error: error.response?.data?.message || error.message || 'حدث خطأ أثناء جلب التشكيلة',
            lineup: null,
          },
        },
      }));
    }
  },

  // Player profiles/photos
  playerProfiles: {}, // { [playerId]: { loading, error, profile } }
  fetchPlayerProfile: async (playerId) => {
    const { playerProfiles } = get();
    if (playerProfiles[playerId]?.profile) return playerProfiles[playerId].profile; // Already cached
    set((state) => ({
      playerProfiles: {
        ...state.playerProfiles,
        [playerId]: { loading: true, error: null, profile: null },
      },
    }));
    try {
      const response = await footballApi.get('/players/profiles', { params: { player: playerId } });
      const profile = response.data?.response?.[0]?.player;
      set((state) => ({
        playerProfiles: {
          ...state.playerProfiles,
          [playerId]: { loading: false, error: null, profile },
        },
      }));
      return profile;
    } catch (error) {
      set((state) => ({
        playerProfiles: {
          ...state.playerProfiles,
          [playerId]: {
            loading: false,
            error: error.response?.data?.message || error.message || 'حدث خطأ أثناء جلب بيانات اللاعب',
            profile: null,
          },
        },
      }));
      return null;
    }
  },

  // Standings
  standings: null,
  standingsLoading: false,
  standingsError: null,
  fetchStandings: async (params = {}) => {
    set({ standingsLoading: true, standingsError: null });
    try {
      const response = await footballApi.get('/standings', { params });
      set({ standings: response.data, standingsLoading: false });
    } catch (error) {
      set({
        standingsError: error.response?.data?.message || error.message || 'حدث خطأ أثناء جلب جدول الترتيب',
        standingsLoading: false,
      });
    }
  },
})); 