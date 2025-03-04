import { createSelector } from '@reduxjs/toolkit';

// Auth selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

// Cart selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = createSelector(
  [selectCartItems],
  (items) => items.reduce((total, item) => total + item.price * item.quantity, 0)
);

// Product selectors
export const selectProducts = (state) => state.product.products;
export const selectProductById = (id) => createSelector(
  [selectProducts],
  (products) => products.find(product => product.id === id)
);

// Order selectors
export const selectOrders = (state) => state.order.orders;
export const selectOrderById = (id) => createSelector(
  [selectOrders],
  (orders) => orders.find(order => order.id === id)
);

// Combined selectors
export const selectCartItemCount = createSelector(
  [selectCartItems],
  (items) => items.reduce((count, item) => count + item.quantity, 0)
);
