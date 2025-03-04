import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingSpinner from './components/common/LoadingSpinner';

// Lazy load components
const Layout = lazy(() => import('./components/layout/Layout'));
const AdminLayout = lazy(() => import('./components/layout/AdminLayout'));
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const Orders = lazy(() => import('./pages/Orders'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Inventory = lazy(() => import('./pages/admin/Inventory'));
const PrivateRoute = lazy(() => import('./components/auth/PrivateRoute'));
const AdminRoute = lazy(() => import('./components/auth/AdminRoute'));

function App() {
  return (
    <ErrorBoundary>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="orders" element={<Orders />} />
              </Route>
            </Route>

            {/* Public and Protected Routes */}
            <Route path="/" element={<Layout />}>
              {/* Public Routes */}
              <Route index element={<Home />} />
              <Route path="products" element={<Products />} />
              <Route path="products/:id" element={<ProductDetail />} />
              <Route path="cart" element={<Cart />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />

              {/* Protected Routes */}
              <Route element={<PrivateRoute />}>
                <Route path="checkout" element={<Checkout />} />
                <Route path="profile" element={<Profile />} />
                <Route path="orders" element={<Orders />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </Box>
    </ErrorBoundary>
  );
}

export default App;
