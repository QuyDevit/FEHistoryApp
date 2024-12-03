import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import questionReducer from './QuestionSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    questions: questionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
      immutableCheck: false, 
    }),
});

export default store;
