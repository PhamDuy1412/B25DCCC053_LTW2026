import { createSlice } from '@reduxjs/toolkit';

const matchesSlice = createSlice({
  name: 'matches',
  initialState: [],
  reducers: {
    setMatches: (state, action) => action.payload,
    addMatch: (state, action) => {
      const id = state.reduce((max, m) => Math.max(max, m.id), 0) + 1;
      state.push({ ...action.payload, id });
    },
    removeMatch: (state, action) => state.filter((m) => m.id !== action.payload),
    setGoals: (state, action) => {
      const { id, homeGoals, awayGoals } = action.payload;
      const match = state.find((m) => m.id === id);
      if (match) {
        match.homeGoals = homeGoals;
        match.awayGoals = awayGoals;
      }
    },
  },
});

export const { setMatches, addMatch, removeMatch, setGoals } = matchesSlice.actions;
export const selectMatches = (state) => state.matches;
export default matchesSlice.reducer;