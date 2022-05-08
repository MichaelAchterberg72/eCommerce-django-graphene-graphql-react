from django.db import models
from user_controller.models import ImageUpload, User

from .enums import PriceTermChoices

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name


class Business(models.Model):
    user = models.OneToOneField(User, related_name="user_business", on_delete=models.CASCADE)
    name = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
    
class PublishProduct(models.Model):
    is_published = models.BooleanField(default=False)
    publish = models.BooleanField(default=False)
    publish_date = models.DateTimeField(blank=True, default=None)
    unpublish_date = models.DateTimeField(blank=True, default=None)
    
    def __str__(self):
        return self.is_published
    
    
class ProductPrice(models.Model):
    once_off_price = models.DecimalField(
        max_digits=7, decimal_places=2, blank=True, default=0.0
    )
    add_promotional_price = models.BooleanField(default=False)
    promotion_price = models.DecimalField(
        max_digits=7, decimal_places=2, blank=True, default=0.0
    )
    contract_monthly_price = models.DecimalField(
        max_digits=7, decimal_places=2, blank=True, default=0.0
    )
    price_term = models.PositiveSmallIntegerField(
        choices=PriceTermChoices.choices,
        default=PriceTermChoices.SELECT_PRICE_TERM,
        blank=True
    )
    
    
class Product(models.Model):
    category = models.ForeignKey(
        Category, related_name="product_categories", on_delete=models.CASCADE
    )
    business = models.ForeignKey(
        Business, related_name="business_products", on_delete=models.CASCADE
    )
    name = models.CharField(max_length=100, unique=True)
    price = models.OneToOneField(
        ProductPrice, on_delete=models.CASCADE, blank=True, null=True
    )
    total_available = models.PositiveBigIntegerField()
    total_count = models.PositiveBigIntegerField()
    description = models.TextField()
    publish = models.OneToOneField(
        PublishProduct, on_delete=models.SET_NULL, blank=True, null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.business.name} - {self.name}"
    
    class Meta:
        ordering = ("-created_at",)
    
    
class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name="product_images", on_delete=models.CASCADE)
    image = models.ForeignKey(ImageUpload, related_name="image_product", on_delete=models.CASCADE)
    is_cover = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.product.business.name} - {self.product.name} - {self.image}"
    
    
class ProductComment(models.Model):
    product = models.ForeignKey(Product, related_name="product_comments", on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name="user_comments", on_delete=models.CASCADE)
    comment = models.TextField()
    rate = models.IntegerField(default=3)
    created_at = models.DateTimeField(auto_now_add=True)
    
    
class Wish(models.Model):
    user = models.OneToOneField(User, related_name="user_wish", on_delete=models.CASCADE)
    products = models.ManyToManyField(Product, related_name="products_wished")
    created_at = models.DateTimeField(auto_now_add=True)
    
    
class Cart(models.Model):
    product = models.ForeignKey(Product, related_name="product_carts", on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name="user_carts", on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.product.name} - {self.user.email}"
    
    class Meta:
        ordering = ("-created_at",)
        
        
class RequestCart(models.Model):
    user = models.ForeignKey(User, related_name="user_requests", on_delete=models.CASCADE)
    business = models.ForeignKey(Business, related_name="business_requests", on_delete=models.CASCADE)
    roduct = models.ForeignKey(Product, related_name="product_requests", on_delete=models.CASCADE)
    auantity = models.IntegerField()
    price = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ("-created_at",)
        