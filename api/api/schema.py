import graphene
from api.permissions import is_authenticated, paginate, get_query
from django.db.models import Q

import user_controller.mutations
import product_controller.mutations

from user_controller.types import UserOutput, ImageUploadType
from product_controller.types import (
    CategoryType,
    BusinessType,
    ProductType,
    ProductCommentType,
    ProductImageType,
    WishType,
    CartType,
    RequestsCartType,
)
from user_controller.models import User, ImageUpload
from product_controller.models import (
    Category,
    Business,
    Product,
    ProductComment,
    ProductImage,
    Wish,
    Cart,
    RequestCart,
)



class Query(graphene.ObjectType):
    users = graphene.Field(paginate(UserOutput), page=graphene.Int())
    user_list = graphene.List(UserOutput)
    # users = graphene.List(UserOutput, email=graphene.String())
    images_uploads = graphene.Field(paginate(ImageUploadType), page=graphene.Int())
    me = graphene.Field(UserOutput)
    
    #product_controller
    categories = graphene.List(CategoryType, name=graphene.String())
    products = graphene.Field(paginate(ProductType), 
                                search=graphene.String(), 
                                min_price=graphene.Float(),
                                max_price=graphene.Float(),
                                category=graphene.String(),
                                business=graphene.String(),
                                sort_by=graphene.String(),
                                is_asc=graphene.Boolean(),
                                mine=graphene.Boolean())
    product = graphene.Field(ProductType, id=graphene.ID(required=True))
    carts = graphene.List(CartType, search_filter=graphene.String())
    request_carts = graphene.List(RequestsCartType, search_filter=graphene.String())
    
    
    # @is_authenticated
    def resolve_users(self, info, **kwargs):
        return User.objects.filter(**kwargs)
    
    def resolve_user_list(self, info, **kwargs):
        return User.objects.filter(**kwargs)
    
    @is_authenticated
    def resolve_images_uploads(self, info, **kwargs):
        return ImageUpload.objects.filter(**kwargs)

    @is_authenticated
    def resolve_me(self, info):
        return info.context.user
    
    def resolve_categories(self, info, name):
        query = Category.objects.prefetch_related("product_categories")
        
        if name:
            query = query.filter(Q(name__icontains=name) | Q(name__iexact=name)).distinct()
            
        return query
    
    def resolve_products(self, info, **kwargs):
        
        mine = kwargs.get("mine", False)
        if mine and not info.context.user:
            raise Exception("User auth required")
        
        query = Product.objects.select_related("category", "business").prefrtch_related(
            "product_images", "product_comments", "products_wished", "product_carts", "product_requests"
        )
        
        if mine:
            query = query.filter(business__user_id=info.context.user.id)
            
        if kwargs.get("search", None):
            qs = kwargs["search"]
            search_fields = (
                "name", "description", "category__name"
            )
            
            search_data = get_query(qs, search_fields)
            query = query.filter(search_data)
            
        if kwargs.get("min_price", None):
             qs = kwargs["min_price"]
             
             query = query.filter(Q(price__gt=qs) | Q(price=qs)).distinct()
             
        if kwargs.get("max_price", None):
             qs = kwargs["max_price"]
             
             query = query.filter(Q(price__lt=qs) | Q(price=qs)).distinct()
             
        if kwargs.get("business", None):
             qs = kwargs["business"]
             
             query = query.filter(Q(business__icontains=qs) | Q(business__nae__iexact=qs)).distinct()

        if kwargs.get("sort_by", None):
             qs = kwargs["sort_by"]
             is_asc = kwargs.get("is_asc", False)
             if not is_asc:
                 qs = f"-{qs}"
             
             query = query.order_by(qs)
             
        return query
    
    def resolve_product(self, info, id):
        query = Product.objects.select_related("category", "business").prefrtch_related(
            "product_images", "product_comments", "products_wished", "product_carts", "product_requests"
        ).get(id=id)
        
        return query
    
    @is_authenticated
    def resolve_carts(self, info, search_filter=None):
        query = Cart.objects.select_related("user", "products").filter(user_id=info.context.user.id)
        
        if search_filter:
            search = (
                Q(product__model__icontains=search_filter) 
                | Q(product__model__iexact=search_filter)
            )
            query = query.filter(search).distinct()
            
        return query
    
    @is_authenticated
    def resolve_request_carts(self, info, search_filter=None):
        query = RequestCart.objects.select_related(
            "user", "products", "business").filter(business__user_id=info.context.user.id)
        
        if search_filter:
            search = (
                Q(product__model__icontains=search_filter) 
                | Q(product__model__iexact=search_filter)
            )
            query = query.filter(search).distinct()
            
        return query


class Mutation(
    user_controller.mutations.Mutation,
    product_controller.mutations.Mutation,
):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)