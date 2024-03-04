import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface TokenState {
  expires: number;
  value: string;
}

const initialState: TokenState = {
  expires: 0,
  value: "",
};

export const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<[number, string]>) => {
      [state.expires, state.value] = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setToken } = tokenSlice.actions;

export const tokenReducer = tokenSlice.reducer;
