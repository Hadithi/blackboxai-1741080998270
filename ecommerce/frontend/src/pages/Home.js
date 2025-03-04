import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Skeleton,
  Paper,
  Stack,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { fetchProducts, selectProducts, selectProductsLoading } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { showSnackbar } from '../redux/slices/uiSlice';

const Home = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const isLoading = useSelector(selectProductsLoading);

  useEffect(() => {
    dispatch(fetchProducts({ filters: { is_featured: true } }));
  }, [dispatch]);

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

  const renderHero = () => (
    <Paper
      sx={{
        position: 'relative',
        backgroundColor: 'grey.800',
        color: '#fff',
        mb: 4,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: 'url(https://source.unsplash.com/random?shopping)',
        minHeight: 400,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          backgroundColor: 'rgba(0,0,0,.5)',
        }}
      />
      <Grid container>
        <Grid item md={6}>
          <Box
            sx={{
              position: 'relative',
              p: { xs: 3, md: 6 },
              pr: { md: 0 },
              minHeight: 400,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Typography component="h1" variant="h3" color="inherit" gutterBottom>
              Welcome to Our Store
            </Typography>
            <Typography variant="h5" color="inherit" paragraph>
              Discover our amazing collection of products at great prices.
            </Typography>
            <Button
              component={RouterLink}
              to="/products"
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{ mt: 2, alignSelf: 'flex-start' }}
            >
              Shop Now
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );

  const renderFeaturedProducts = () => (
    <Box sx={{ py: 6 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Featured Products
      </Typography>
      <Grid container spacing={4}>
        {isLoading
          ? Array.from(new Array(4)).map((_, index) => (
              <Grid item key={index} xs={12} sm={6} md={3}>
                <Card>
                  <Skeleton variant="rectangular" height={200} />
                  <CardContent>
                    <Skeleton variant="text" />
                    <Skeleton variant="text" width="60%" />
                  </CardContent>
                  <CardActions>
                    <Skeleton variant="rectangular" width={100} height={36} />
                  </CardActions>
                </Card>
              </Grid>
            ))
          : products.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.images?.[0]?.image || 'https://via.placeholder.com/200'}
                    alt={product.name}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="h3">
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
                      component={RouterLink}
                      to={`/products/${product.id}`}
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
      <Stack
        direction="row"
        justifyContent="center"
        sx={{ mt: 4 }}
      >
        <Button
          component={RouterLink}
          to="/products"
          variant="outlined"
          size="large"
          endIcon={<ArrowForwardIcon />}
        >
          View All Products
        </Button>
      </Stack>
    </Box>
  );

  return (
    <Container maxWidth="lg">
      {renderHero()}
      {renderFeaturedProducts()}
    </Container>
  );
};

export default Home;
