import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RecordingsState {
  recordings: string[];
}

const initialState: RecordingsState = {
  recordings: [],
};

const recordingsSlice = createSlice({
  name: 'recordings',
  initialState,
  reducers: {
    addRecording: (state, action: PayloadAction<string>) => {
      state.recordings.push(action.payload);
    },
    removeRecording: (state, action: PayloadAction<string>) => {
      state.recordings = state.recordings.filter((recording) => recording !== action.payload);
    },
  },
});

export const { addRecording, removeRecording } = recordingsSlice.actions;
export default recordingsSlice.reducer;

