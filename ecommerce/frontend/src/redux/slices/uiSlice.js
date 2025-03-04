import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Snackbar
  snackbar: {
    open: false,
    message: '',
    severity: 'info', // 'success', 'error', 'warning', 'info'
  },
  // Loading overlay
  loading: {
    show: false,
    message: '',
  },
  // Mobile drawer
  mobileDrawer: {
    open: false,
  },
  // Cart drawer
  cartDrawer: {
    open: false,
  },
  // Search modal
  searchModal: {
    open: false,
  },
  // Filter drawer for mobile
  filterDrawer: {
    open: false,
  },
  // Theme
  darkMode: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Snackbar actions
    showSnackbar: (state, action) => {
      state.snackbar = {
        open: true,
        message: action.payload.message,
        severity: action.payload.severity || 'info',
      };
    },
    hideSnackbar: (state) => {
      state.snackbar.open = false;
    },

    // Loading overlay actions
    showLoading: (state, action) => {
      state.loading = {
        show: true,
        message: action.payload || '',
      };
    },
    hideLoading: (state) => {
      state.loading.show = false;
    },

    // Mobile drawer actions
    toggleMobileDrawer: (state) => {
      state.mobileDrawer.open = !state.mobileDrawer.open;
    },
    closeMobileDrawer: (state) => {
      state.mobileDrawer.open = false;
    },

    // Cart drawer actions
    toggleCartDrawer: (state) => {
      state.cartDrawer.open = !state.cartDrawer.open;
    },
    closeCartDrawer: (state) => {
      state.cartDrawer.open = false;
    },

    // Search modal actions
    openSearchModal: (state) => {
      state.searchModal.open = true;
    },
    closeSearchModal: (state) => {
      state.searchModal.open = false;
    },

    // Filter drawer actions
    toggleFilterDrawer: (state) => {
      state.filterDrawer.open = !state.filterDrawer.open;
    },
    closeFilterDrawer: (state) => {
      state.filterDrawer.open = false;
    },

    // Theme actions
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('darkMode', state.darkMode);
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
      localStorage.setItem('darkMode', action.payload);
    },
  },
});

export const {
  showSnackbar,
  hideSnackbar,
  showLoading,
  hideLoading,
  toggleMobileDrawer,
  closeMobileDrawer,
  toggleCartDrawer,
  closeCartDrawer,
  openSearchModal,
  closeSearchModal,
  toggleFilterDrawer,
  closeFilterDrawer,
  toggleDarkMode,
  setDarkMode,
} = uiSlice.actions;

// Selectors
export const selectSnackbar = (state) => state.ui.snackbar;
export const selectLoading = (state) => state.ui.loading;
export const selectMobileDrawer = (state) => state.ui.mobileDrawer;
export const selectCartDrawer = (state) => state.ui.cartDrawer;
export const selectSearchModal = (state) => state.ui.searchModal;
export const selectFilterDrawer = (state) => state.ui.filterDrawer;
export const selectDarkMode = (state) => state.ui.darkMode;

export default uiSlice.reducer;
