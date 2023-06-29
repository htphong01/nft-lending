import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  address: "",
  balance: 0
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAccount: (state, action) => {
      state = action.payload;
      return state;
    },
  },
});

export const { setAccount } = accountSlice.actions;
export default accountSlice.reducer;
