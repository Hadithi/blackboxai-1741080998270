import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Drawer,
  useTheme,
  useMediaQuery,
  IconButton,
  Slider,
  Chip,
  Stack,
} from '@mui/material';
import {
  FilterList as FilterIcon,
  ShoppingCart as CartIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import {
  fetchProducts,
  fetchCategories,
  selectProducts,
  selectCategories,
  selectProductsLoading,
  selectCurrentPage,
  selectTotalPages,
  setCurrentPage,
  setFilters,
  selectProductFilters,
} from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { showSnackbar } from '../redux/slices/uiSlice';
import LoadingOverlay from '../components/common/LoadingOverlay';

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const products = useSelector(selectProducts);
  const categories = useSelector(selectCategories);
  const isLoading = useSelector(selectProductsLoading);
  const currentPage = useSelector(selectCurrentPage);
  const totalPages = useSelector(selectTotalPages);
  const filters = useSelector(selectProductFilters);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    // Parse URL search params
    const searchParams = new URLSearchParams(location.search);
    const urlFilters = {
      category: searchParams.get('category') || '',
      search: searchParams.get('search') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      sort: searchParams.get('sort') || '',
    };

    dispatch(setFilters(urlFilters));
    setLocalFilters(urlFilters);
    
    if (searchParams.get('minPrice') && searchParams.get('maxPrice')) {
      setPriceRange([
        Number(searchParams.get('minPrice')),
        Number(searchParams.get('maxPrice')),
      ]);
    }
  }, [location.search, dispatch]);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts({ page: currentPage, filters }));
  }, [dispatch, currentPage, filters]);

  const handleFilterChange = (field, value) => {
    setLocalFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handlePriceRangeChange = (event, newValue) => {
    setPriceRange(newValue);
    setLocalFilters((prev) => ({
      ...prev,
      minPrice: newValue[0],
      maxPrice: newValue[1],
    }));
  };

  const applyFilters = () => {
    dispatch(setFilters(localFilters));
    dispatch(setCurrentPage(1));
    setDrawerOpen(false);

    // Update URL with filters
    const searchParams = new URLSearchParams();
    Object.entries(localFilters).forEach(([key, value]) => {
      if (value) searchParams.append(key, value);
    });
    navigate({ search: searchParams.toString() });
  };

  const handleAddToCart = async (productId) => {
    try {
      await dispatch(addToCart({ productId, quantity: 1 })).unwrap();
      dispatch(showSnackbar({
        message: 'Product added to cart',
        severity: 'success',
      }));
    } catch (error) {
      dispatch(showSnackbar({
        message: error.message || 'Failed to add product to cart',
        severity: 'error',
      }));
    }
  };

  const renderFilters = () => (
    <Stack spacing={3}>
      <Typography variant="h6">Filters</Typography>
      
      <FormControl fullWidth>
        <InputLabel>Category</InputLabel>
        <Select
          value={localFilters.category}
          label="Category"
          onChange={(e) => handleFilterChange('category', e.target.value)}
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box>
        <Typography gutterBottom>Price Range</Typography>
        <Slider
          value={priceRange}
          onChange={handlePriceRangeChange}
          valueLabelDisplay="auto"
          min={0}
          max={1000}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2">${priceRange[0]}</Typography>
          <Typography variant="body2">${priceRange[1]}</Typography>
        </Box>
      </Box>

      <FormControl fullWidth>
        <InputLabel>Sort By</InputLabel>
        <Select
          value={localFilters.sort}
          label="Sort By"
          onChange={(e) => handleFilterChange('sort', e.target.value)}
        >
          <MenuItem value="">Default</MenuItem>
          <MenuItem value="price_asc">Price: Low to High</MenuItem>
          <MenuItem value="price_desc">Price: High to Low</MenuItem>
          <MenuItem value="name_asc">Name: A to Z</MenuItem>
          <MenuItem value="name_desc">Name: Z to A</MenuItem>
        </Select>
      </FormControl>

      {isMobile && (
        <Button
          variant="contained"
          onClick={applyFilters}
          fullWidth
        >
          Apply Filters
        </Button>
      )}
    </Stack>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Filters - Desktop */}
        {!isMobile && (
          <Grid item xs={12} md={3}>
            {renderFilters()}
          </Grid>
        )}

        {/* Products Grid */}
        <Grid item xs={12} md={isMobile ? 12 : 9}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4">Products</Typography>
            {isMobile && (
              <Button
                startIcon={<FilterIcon />}
                onClick={() => setDrawerOpen(true)}
              >
                Filters
              </Button>
            )}
          </Box>

          {/* Active Filters */}
          {Object.entries(filters).some(([key, value]) => value) && (
            <Box sx={{ mb: 2 }}>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {Object.entries(filters).map(([key, value]) => {
                  if (!value) return null;
                  return (
                    <Chip
                      key={key}
                      label={`${key}: ${value}`}
                      onDelete={() => {
                        const newFilters = { ...filters, [key]: '' };
                        dispatch(setFilters(newFilters));
                        dispatch(setCurrentPage(1));
                      }}
                      sx={{ m: 0.5 }}
                    />
                  );
                })}
              </Stack>
            </Box>
          )}

          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={4}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.images?.[0]?.image || 'https://via.placeholder.com/200'}
                    alt={product.name}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="h2">
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.description?.slice(0, 100)}...
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                      ${product.price}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => navigate(`/products/${product.id}`)}
                    >
                      View Details
                    </Button>
                    <Button
                      size="small"
                      startIcon={<CartIcon />}
                      onClick={() => handleAddToCart(product.id)}
                    >
                      Add to Cart
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(_, page) => dispatch(setCurrentPage(page))}
                color="primary"
              />
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Mobile Filters Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { width: 280, p: 2 },
        }}
      >
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Filters</Typography>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        {renderFilters()}
      </Drawer>

      {isLoading && <LoadingOverlay />}
    </Container>
  );
};

export default Products;
