import { configureStore } from '@reduxjs/toolkit';

const initialState = {
  angle: 45,
  velocity: 10,
  projectile: null,
  target: null,
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_ANGLE':
      return { ...state, angle: action.payload };
    case 'UPDATE_VELOCITY':
      return { ...state, velocity: action.payload };
    case 'UPDATE_PROJECTILE':
      return { ...state, projectile: action.payload };
    case 'UPDATE_TARGET':
      return { ...state, target: action.payload };
    default:
      return state;
  }
}

const store = configureStore({
  reducer: rootReducer,
});

export default store;