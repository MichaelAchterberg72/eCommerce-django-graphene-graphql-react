import graphene
from graphene_django import DjangoObjectType
from api.permissions import is_authenticated, paginate, is_authenticated

from .enums import PriceTermChoices, PriceTermEnum
from . models import (
    Category,
    Business,
    Product,
    ProductPrice,
    PublishProduct,
    ProductComment,
    ProductImage,
    Wish,
    Cart,
    RequestCart,
)


class CategoryType(DjangoObjectType):
    count = graphene.Int()
    
    class Meta:
        model = Category
        
    def resolve_count(self, info):
        return self.product_categories.name.count()


class BusinessType(DjangoObjectType):
    class Meta:
        model = Business


class ProductPriceType(DjangoObjectType):
    class Meta:
        model = ProductPrice


class PublishProductType(DjangoObjectType):
    class Meta:
        model = PublishProduct

        
class ProductType(DjangoObjectType):
    price = graphene.Field(ProductPriceType)
    publish = graphene.Field(PublishProductType)
    
    @staticmethod
    def resolve_price(parent, info):
        return parent.price
    
    @staticmethod
    def resolve_publish(parent, info):
        return parent.publish
    
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
    
    
class ProductPriceInput(graphene.InputObjectType):
    id = graphene.ID()
    once_off_price = graphene.Float()
    add_promotional_price = graphene.Boolean()
    promotion_price = graphene.Float()
    contract_monthly_price = graphene.Float()
    price_term = PriceTermEnum()
    
        
class PublishProductInput(graphene.InputObjectType):
    id = graphene.ID()
    is_published = graphene.Boolean()
    publish = graphene.Boolean()
    publish_date = graphene.DateTime()
    unpublish_date = graphene.DateTime()
       
        
class ProductInput(graphene.InputObjectType):
    name = graphene.String()
    price = ProductPriceInput(name="price")
    description = graphene.String()
    publish = PublishProductInput(name="publish")
    category_id = graphene.ID()
    
    
class ProductImageInput(graphene.InputObjectType):
    image_id = graphene.ID(required=True)
    is_cover = graphene.Boolean()