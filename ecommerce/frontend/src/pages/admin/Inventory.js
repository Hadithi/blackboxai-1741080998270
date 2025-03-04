import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tab,
  Tabs,
  Button,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { fetchInventoryItems, fetchLowStockItems } from '../../redux/slices/inventorySlice';
import InventoryList from '../../components/inventory/InventoryList';
import InventoryEditDialog from '../../components/inventory/InventoryEditDialog';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import CustomSnackbar from '../../components/common/CustomSnackbar';

const Inventory = () => {
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState(0);
  const [editItem, setEditItem] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const { 
    items,
    lowStockItems,
    activeOperation
  } = useSelector((state) => state.inventory);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    if (newValue === 1) {
      dispatch(fetchLowStockItems());
    } else {
      dispatch(fetchInventoryItems());
    }
  };

  const handleRefresh = () => {
    if (currentTab === 1) {
      dispatch(fetchLowStockItems());
    } else {
      dispatch(fetchInventoryItems());
    }
  };

  const handleEditItem = (item) => {
    setEditItem(item);
  };

  const handleCloseEdit = () => {
    setEditItem(null);
    if (activeOperation.success) {
      setShowSnackbar(true);
      handleRefresh();
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Typography variant="h4" component="h1">
            Inventory Management
          </Typography>
          <Box>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              sx={{ mr: 2 }}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {/* TODO: Implement add new product */}}
            >
              Add Product
            </Button>
          </Box>
        </Stack>

        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="All Items" />
            <Tab 
              label="Low Stock Items" 
              icon={<WarningIcon color="warning" />}
              iconPosition="end"
            />
          </Tabs>
        </Paper>

        {currentTab === 0 && (
          <InventoryList
            onEditItem={handleEditItem}
          />
        )}

        {currentTab === 1 && (
          <InventoryList
            onEditItem={handleEditItem}
            items={lowStockItems.data}
            loading={lowStockItems.loading}
            error={lowStockItems.error}
          />
        )}
      </Box>

      {editItem && (
        <InventoryEditDialog
          open={Boolean(editItem)}
          onClose={handleCloseEdit}
          item={editItem}
        />
      )}

      <LoadingOverlay open={items.loading || lowStockItems.loading} />

      <CustomSnackbar
        open={showSnackbar}
        onClose={() => setShowSnackbar(false)}
        message="Inventory updated successfully"
        severity="success"
      />
    </Container>
  );
};

export default Inventory;
