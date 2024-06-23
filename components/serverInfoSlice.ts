import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ServerInfoState {
  ip: string;
  port: string;
}

const initialState: ServerInfoState = {
  ip: '',
  port: '',
};

const serverInfoSlice = createSlice({
  name: 'serverInfo',
  initialState,
  reducers: {
    setServerInfo: (state, action: PayloadAction<ServerInfoState>) => {
      state.ip = action.payload.ip;
      state.port = action.payload.port;
    },
  },
});

export const { setServerInfo } = serverInfoSlice.actions;
export default serverInfoSlice.reducer;
