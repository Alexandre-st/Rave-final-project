import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Recording {
  // Define the properties of a recording
}

const recordingsSlice = createSlice({
  name: 'recordings',
  initialState: [] as Recording[],
  reducers: {
    addRecording: (state, action: PayloadAction<Recording>) => {
      state.push(action.payload);
    },
    removeRecording: (state, action: PayloadAction<Recording>) => {
      return state.filter((recording) => recording !== action.payload);
    },
  },
});

export const { addRecording, removeRecording } = recordingsSlice.actions;
export default recordingsSlice.reducer;

