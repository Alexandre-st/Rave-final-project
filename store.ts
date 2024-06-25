import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import logger from 'redux-logger';
import { persistReducer, persistStore } from 'redux-persist';
import recordingsReducer from './components/recordingSlice';
import serverInfoReducer from './components/serverInfoSlice';

// Configuration of redux-persist
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

// Combine the reducers
const rootReducer = combineReducers({
  recordings: recordingsReducer,
  serverInfo: serverInfoReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(logger),
});

const persistor = persistStore(store);

export { persistor, store };
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

