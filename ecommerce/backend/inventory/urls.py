from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'items', views.InventoryItemViewSet)
router.register(r'transactions', views.InventoryTransactionViewSet)
router.register(r'supplier-orders', views.SupplierOrderViewSet)

app_name = 'inventory'

urlpatterns = [
    path('', include(router.urls)),
]
