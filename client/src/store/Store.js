import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from './userSlice.js';

// Persist configuration for auth
const persistConfigAuth = {
    key: 'user',
    storage,
};

const persistedAuthReducer = persistReducer(persistConfigAuth, userReducer);


const Store = configureStore({
    reducer: {
        users: persistedAuthReducer,
          // Now persistedPostReducer is defined
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
    devTools: true,
});

export const persistor = persistStore(Store);
export default Store;
