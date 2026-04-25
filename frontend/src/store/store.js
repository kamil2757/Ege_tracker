import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import subjectsReducer from "./subjectsSlice";
import { setAccessTokenGetter, setStoreDispatch } from "../services/api";

const store = configureStore({
    reducer:{
        auth: authReducer,
        subjects: subjectsReducer
    }
})

export default store
