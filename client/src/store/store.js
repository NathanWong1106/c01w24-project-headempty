import { configureStore } from '@reduxjs/toolkit';
import currentUserReducer from './slices/currentUserSlice';

export default configureStore({
    reducer: {
        currentUser: currentUserReducer
    }
})