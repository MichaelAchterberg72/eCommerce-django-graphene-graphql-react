import graphene
from graphene_django import DjangoObjectType
from api.permissions import is_authenticated, paginate, is_authenticated

from . models import (
    Category,
    Business,
    Product,
    ProductComment,
    ProductImage,
    Wish,
    Cart,
    RequestCart,
)


class CategoryType(DjangoObjectType):
    class Meta:
        model = Category


class BusinessType(DjangoObjectType):
    class Meta:
        model = Business
        
        
class ProductType(DjangoObjectType):
    class Meta:
        model = Product
        
        
class ProductCommentType(DjangoObjectType):
    class Meta:
        model = ProductComment
        
        
class ProductImageType(DjangoObjectType):
    class Meta:
        model = ProductImage
        
        
class WishType(DjangoObjectType):
    class Meta:
        model = Wish
        
        
class CartType(DjangoObjectType):
    class Meta:
        model = Cart
        
        
class RequestsCartType(DjangoObjectType):
    class Meta:
        model = RequestCart
        
        
class ProductInput(graphene.InputObjectType):
    name = graphene.String()
    price = graphene.Float()
    description = graphene.String()
    category_id = graphene.ID()
    
    
class ProductImageInput(graphene.InputObjectType):
    image_id = graphene.ID(required=True)
    is_cover = graphene.Boolean()