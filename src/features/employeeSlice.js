import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://jsonplaceholder.typicode.com/users';

export const fetchEmployees = createAsyncThunk('employees/fetch', async () => {
  const response = await axios.get(API_URL);
  return response.data;
});

const employeeSlice = createSlice({
  name: 'employees',
  initialState: { list: [], status: 'idle', search: '' },
  reducers: {
    setSearch: (state, action) => { state.search = action.payload; },
    deleteEmployee: (state, action) => {
      state.list = state.list.filter(emp => emp.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      });
  }
});

export const { setSearch, deleteEmployee } = employeeSlice.actions;
export default employeeSlice.reducer;