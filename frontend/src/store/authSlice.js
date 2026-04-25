import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../services/api";

const initialState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  status: "idle",
  error: null,
};

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await api.post(
        "/api/users/logout/",
        {},
        {
          withCredentials: true,
        },
      );

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Ошибка при выходе");
    }
  },
);

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/users/login/", credentials, {
        withCredentials: true,
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Ошибка при входе");
    }
  },
);

export const register = createAsyncThunk(
  "auth/register",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/users/register/", credentials, {});
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Ошибка при регистрации");
    }
  },
);

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/users/me/");
      return response.data;
    } catch (err) {
      console.log(err);
      return rejectWithValue(
        err.response?.data || "Ошибка при получении данных",
      );
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuth(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.accessToken = null;
    },
    setAccessToken(state, action) {
      state.access = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // вход
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.access = action.payload.access;
        state.user = action.payload.user;

        // localStorage.setItem("accessToken", action.payload.accessToken);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // регистрация
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.access = action.payload.access;
        state.user = action.payload.user;

        // localStorage.setItem("accessToken", action.payload.accessToken);
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // получение данных me
      .addCase(checkAuth.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.user = null;
        state.status = "failed";
        state.error = action.payload;
      })
      // Выход из аккаунта
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.access = null;
        state.status = "idle";
        state.error = null;
      });
  },
});

export const { clearAuth, setAccessToken } = authSlice.actions;
export default authSlice.reducer;
