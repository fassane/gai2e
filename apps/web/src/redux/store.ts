import { configureStore } from '@reduxjs/toolkit';
import { BaseApi } from '@/utils/api/base-api';
import { AuthSlice } from './slice/auth.slice';

export const makeStore = () =>
  configureStore({
    reducer: {
      [AuthSlice.name]: AuthSlice.reducer,
      [BaseApi.reducerPath]: BaseApi.reducer,
    },
    devTools: import.meta.env.DEV,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(BaseApi.middleware),
  });

export const store = makeStore();

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export default store;
