import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import logger from 'redux-logger';
import { persistReducer, persistStore } from 'redux-persist';
import recordingsReducer from './components/recordingSlice';

// Configuration de redux-persist
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

// Combiner les réducteurs
const rootReducer = combineReducers({
  recordings: recordingsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configuration du store
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

