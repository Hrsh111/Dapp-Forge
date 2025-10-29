import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  account: '',
  totalSupply: '0',
  token: null,
  loading: false,
  error: null,
};

const blockchainSlice = createSlice({
  name: 'blockchain',
  initialState,
  reducers: {
    setAccount: (state, action) => {
      state.account = action.payload;
    },
    setTotalSupply: (state, action) => {
      state.totalSupply = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setAccount, setTotalSupply, setToken, setLoading, setError } = blockchainSlice.actions;
export default blockchainSlice.reducer;
