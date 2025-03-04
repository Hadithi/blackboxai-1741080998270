from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import F
from django.core.mail import send_mail
from django.conf import settings
from products.models import Product
from orders.models import OrderItem
from .models import InventoryItem, InventoryTransaction

@receiver(post_save, sender=Product)
def create_inventory_item(sender, instance, created, **kwargs):
    """Create inventory item when a new product is created"""
    if created:
        InventoryItem.objects.create(product=instance)

@receiver(post_save, sender=OrderItem)
def update_inventory_on_order(sender, instance, created, **kwargs):
    """Update inventory when an order is placed"""
    if created and instance.order.status == 'pending':
        inventory_item = instance.product.inventory
        
        # Create sale transaction
        InventoryTransaction.objects.create(
            inventory_item=inventory_item,
            transaction_type='sale',
            quantity=-instance.quantity,  # Negative quantity for sales
            reference_number=instance.order.order_number,
            unit_price=instance.price
        )

        # Check if stock is low after the sale
        if inventory_item.quantity <= inventory_item.low_stock_threshold:
            # Send email notification
            subject = f'Low Stock Alert: {inventory_item.product.name}'
            message = f'''
            Low stock alert for {inventory_item.product.name}
            Current stock: {inventory_item.quantity}
            Threshold: {inventory_item.low_stock_threshold}
            SKU: {inventory_item.product.sku}
            
            Please reorder soon.
            '''
            try:
                send_mail(
                    subject,
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                    [settings.INVENTORY_NOTIFICATION_EMAIL],
                    fail_silently=True,
                )
            except Exception as e:
                print(f"Failed to send low stock notification: {str(e)}")

@receiver(post_save, sender=InventoryTransaction)
def update_inventory_on_transaction(sender, instance, created, **kwargs):
    """Update last_restock_date when restocking"""
    if created and instance.transaction_type in ['purchase', 'restock']:
        inventory_item = instance.inventory_item
        inventory_item.last_restock_date = instance.transaction_date
        inventory_item.save()

@receiver([post_save, post_delete], sender=InventoryTransaction)
def update_stock_status(sender, instance, **kwargs):
    """Update stock status after any inventory transaction"""
    inventory_item = instance.inventory_item
    inventory_item.update_stock_status()

    # Check if reorder is needed
    if inventory_item.needs_reorder():
        subject = f'Reorder Alert: {inventory_item.product.name}'
        message = f'''
        Reorder alert for {inventory_item.product.name}
        Current stock: {inventory_item.quantity}
        Reorder point: {inventory_item.reorder_point}
        Suggested reorder quantity: {inventory_item.reorder_quantity}
        SKU: {inventory_item.product.sku}
        
        Please place a new order.
        '''
        try:
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [settings.INVENTORY_NOTIFICATION_EMAIL],
                fail_silently=True,
            )
        except Exception as e:
            print(f"Failed to send reorder notification: {str(e)}")
