export const matchesReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD':
      return action.payload;
    case 'ADD': {
      const id = state.reduce((max, m) => Math.max(max, m.id), 0) + 1;
      return [...state, { ...action.payload, id }];
    }
    case 'REMOVE':
      return state.filter((m) => m.id !== action.payload);
    case 'SET_GOALS': {
      const { id, homeGoals, awayGoals } = action.payload;
      return state.map((m) => (m.id === id ? { ...m, homeGoals, awayGoals } : m));
    }
    default:
      return state;
  }
};