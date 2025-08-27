import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token") || null,
  name: localStorage.getItem("name") || "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
    logout: (state, action) => {
      state.token = null;
      //   localStorage.setItem("token", null);
      localStorage.removeItem("token");
    },
    userinfo: (state, action) => {
      state.name = action.payload;
      localStorage.setItem("name", action.payload);
    },
  },
});

export const { login, logout, userinfo } = userSlice.actions;
export default userSlice.reducer;
