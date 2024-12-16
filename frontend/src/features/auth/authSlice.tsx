import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";

const api: string = "https://dromic.csalvadora.com/api/";
const cookies = new Cookies();
interface Credential {
  username: string;
  password: string;
}

interface LoginResponse {
  user: string;
  access: string;
  refresh: string;
}

interface AuthState {
  user: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (payload: Credential, { rejectWithValue }) => {
    try {
      const response = await axios.post<LoginResponse>(api + "token/", payload);
      cookies.set("accessToken", response.data.access, {
        path: "/",
        maxAge: 3600,
      });
      cookies.set("refreshToken", response.data.refresh, {
        path: "/",
        maxAge: 3600,
      });
      cookies.set("user", response.data.user, { path: "/", maxAge: 3600 });
      return { ...response.data, user: payload.username };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<LoginResponse>) {
      state.accessToken = action.payload.access;
      state.refreshToken = action.payload.refresh;
      state.user = action.payload.user;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.loading = false;
          state.accessToken = action.payload.access;
          state.refreshToken = action.payload.refresh;
          state.user = action.payload.user;
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export reducer
export const { setAuth } = authSlice.actions;
export default authSlice.reducer;
