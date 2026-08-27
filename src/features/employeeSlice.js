import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const EMP_API = 'https://669b3f09276e45187d34eb4e.mockapi.io/api/v1/employee';
const COUNTRY_API = 'https://669b3f09276e45187d34eb4e.mockapi.io/api/v1/country';

export const fetchCountries = createAsyncThunk('employee/fetchCountries', async () => {
  const res = await fetch(COUNTRY_API);
  if (!res.ok) return ['India', 'USA', 'UK', 'Canada'];
  return await res.json();
});

export const fetchEmployees = createAsyncThunk('employee/fetchEmployees', async () => {
  const res = await fetch(EMP_API);
  if (!res.ok) throw new Error('Failed to fetch employees');
  return await res.json();
});

export const addEmployeeAsync = createAsyncThunk('employee/addEmployeeAsync', async (data) => {
  const res = await fetch(EMP_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await res.json();
});

export const updateEmployeeAsync = createAsyncThunk('employee/updateEmployeeAsync', async (data) => {
  const res = await fetch(`${EMP_API}/${data.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await res.json();
});

export const deleteEmployeeAsync = createAsyncThunk('employee/deleteEmployeeAsync', async (id) => {
  await fetch(`${EMP_API}/${id}`, { method: 'DELETE' });
  return id;
});

const employeeSlice = createSlice({
  name: 'employee',
  initialState: {
    list: [],
    countries: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error fetching employees';
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.countries = action.payload;
      })
      .addCase(addEmployeeAsync.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(updateEmployeeAsync.fulfilled, (state, action) => {
        const idx = state.list.findIndex((e) => String(e.id) === String(action.payload.id));
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(deleteEmployeeAsync.fulfilled, (state, action) => {
        state.list = state.list.filter((e) => String(e.id) !== String(action.payload));
      });
  },
});

export default employeeSlice.reducer;