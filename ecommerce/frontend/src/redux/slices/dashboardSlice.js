import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const fetchDashboardSummary = createAsyncThunk(
  'dashboard/fetchSummary',
  async (_, { getState }) => {
    const { auth } = getState();
    const response = await axios.get('/api/dashboard/dashboard/summary/', {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    return response.data;
  }
);

export const fetchInventoryAnalytics = createAsyncThunk(
  'dashboard/fetchInventory',
  async (_, { getState }) => {
    const { auth } = getState();
    const response = await axios.get('/api/dashboard/dashboard/inventory-analytics/', {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    return response.data;
  }
);

export const fetchInventoryAlerts = createAsyncThunk(
  'dashboard/fetchAlerts',
  async (_, { getState }) => {
    const { auth } = getState();
    const response = await axios.get('/api/dashboard/inventory-alerts/', {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    return response.data;
  }
);

export const resolveInventoryAlert = createAsyncThunk(
  'dashboard/resolveAlert',
  async (alertId, { getState }) => {
    const { auth } = getState();
    await axios.post(`/api/dashboard/inventory-alerts/${alertId}/resolve/`, null, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    return alertId;
  }
);

const initialState = {
  summary: {
    data: null,
    loading: false,
    error: null,
  },
  inventory: {
    data: [],
    loading: false,
    error: null,
  },
  alerts: {
    data: [],
    loading: false,
    error: null,
  },
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboardData: (state) => {
      state.summary.data = null;
      state.inventory.data = [];
      state.alerts.data = [];
    },
  },
  extraReducers: (builder) => {
    // Summary
    builder
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.summary.loading = true;
        state.summary.error = null;
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.summary.loading = false;
        state.summary.data = action.payload;
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.summary.loading = false;
        state.summary.error = action.error.message;
      });

    // Inventory
    builder
      .addCase(fetchInventoryAnalytics.pending, (state) => {
        state.inventory.loading = true;
        state.inventory.error = null;
      })
      .addCase(fetchInventoryAnalytics.fulfilled, (state, action) => {
        state.inventory.loading = false;
        state.inventory.data = action.payload;
      })
      .addCase(fetchInventoryAnalytics.rejected, (state, action) => {
        state.inventory.loading = false;
        state.inventory.error = action.error.message;
      });

    // Alerts
    builder
      .addCase(fetchInventoryAlerts.pending, (state) => {
        state.alerts.loading = true;
        state.alerts.error = null;
      })
      .addCase(fetchInventoryAlerts.fulfilled, (state, action) => {
        state.alerts.loading = false;
        state.alerts.data = action.payload;
      })
      .addCase(fetchInventoryAlerts.rejected, (state, action) => {
        state.alerts.loading = false;
        state.alerts.error = action.error.message;
      })
      .addCase(resolveInventoryAlert.fulfilled, (state, action) => {
        state.alerts.data = state.alerts.data.filter(
          (alert) => alert.id !== action.payload
        );
      });
  },
});

export const { clearDashboardData } = dashboardSlice.actions;

// Selectors
export const selectDashboardSummary = (state) => state.dashboard.summary;
export const selectInventoryAnalytics = (state) => state.dashboard.inventory;
export const selectInventoryAlerts = (state) => state.dashboard.alerts;

export default dashboardSlice.reducer;
