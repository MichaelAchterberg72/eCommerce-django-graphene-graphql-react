import graphene
from django.contrib.auth import authenticate
from datetime import datetime
from graphene_file_upload.scalars import Upload

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
from .types import *

from api.permissions import is_authenticated


class CreateBusiness(graphene.Mutation):
    business = graphene.Field(BusinessType)
    
    class Arguments:
        name = graphene.String(required=True)
        
    @is_authenticated
    def mutate(self, info, name):
        buss = Business.objects.create(name=name, user_id=info.xontext.user.id)
        return CreateBusiness(
            business = buss
        )


class UpdateBusiness(graphene.Mutation):
    business = graphene.Field(BusinessType)
    
    class Arguments:
        name = graphene.String()
        
    @is_authenticated
    def mutate(self, info, name):
        try:
            instance = info.context.user.user_business
        except Exception:
            raise Exception("You do not have a business to update")
        
        instance.name = name
        instance.save()
        
        return UpdateBusiness(
            business = instance
        )
        
        
class DeleteBusiness(graphene.Mutation):
    status = graphene.Boolean()
    
    @is_authenticated
    def mutate(self, info):
        Business.objects.filter(user_id=info.context.user.id).delete()
        
        return DeleteBusiness(
            status = True
        )


class CreateProduct(graphene.Mutation):
    product = graphene.Field(ProductType)
    
    class Argumants:
        product_data = ProductInput(required=True)
        total_count = graphene.Int(required=True)
        images = graphene.List(ProductImageInput)
        
    @is_authenticated
    def mutate(self, info, product_data, images, **kwargs):
        try:
            buss_id = info.context.user.user_business.id
        except Exception:
            raise Exception("You do not have a business")
        
        have_product = Product.objects.filter(business_id=buss_id, name=product_data["name"])
        if have_product:
            raise Exception("You already have a product with this name")
        
        product_data["total_available"] = product_data["total_count"]
        
        product = Product.objects.create(**product_data, **kwargs)
        
        ProductImage.objects.objects.bulk_create([
            ProductImage(product_id=product.id, **image_data) for image_data in images
        ])
        
        return CreateProduct(
            product=product
        )


class UpdateProduct(graphene.Mutation):
    product = graphene.Field(ProductType)
    
    class Argumants:
        product_data = ProductInput()
        total_available = graphene.Int()
        product_id = graphene.ID(required=True)
        
    @is_authenticated
    def mutate(self, info, product_data, product_id, **kwargs):
        try:
            buss_id = info.context.user.user_business.id
        except Exception:
            raise Exception("You do not have a business")
        
        if product_data.get("name", None):
            have_product = Product.objects.filter(business_id=buss_id, name=product_data["name"])
            if have_product:
                raise Exception("You already have a product with this name")
            
        Product.objects.filter(id=product_id, business_id=buss_id).update(**product_data, **kwargs)
        
        return UpdateProduct(
            product=Product.objects.get(id=product_id)
        )
        
        
class DeleteProduct(graphene.Mutation):
    status = graphene.Boolean()
    
    class Arguments:
        product_id = graphene.ID(required=True)
        
    @is_authenticated
    def mutate(self, info, product_id):
        Product.objects.filter(id=product_id, business_id=info.context.user.user_business.id).delete()
        return DeleteProduct(
            status=True
        )


class UpdateProductImage(graphene.Mutation):
    image = graphene.Field(ProductImageType)
    
    class Arguments:
        image_data = ProductImageInput()
        id = graphene.ID(required=True)
        
    @is_authenticated
    def mutate(self, info, image_data, id):
        try:
            buss_id = info.context.user.user_business.id
        except Exception:
            raise Exception("You do not have a business, access denied")
        
        my_image = ProductImage.objects.filter(product__business_id=buss_id, id=id)
        if not my_image:
            raise Exception("You do not own this image")
        
        my_image.update(**image_data)
        if image_data.get("is_cover", False):
            ProductImage.objects.filter(product__business_id=buss_id, id=id).exclude(id=id).update(is_cover=False)
            return UpdateProductImage(
                image=  ProductImage.objects.get(id=id)
            )
        

class CreateProductComment(graphene.Mutation):
    product_comment = graphene.Field(ProductCommentType)
    
    class Arguments:
        product_id = graphene.String(required=True)
        comment = graphene.String(required=True)
        rate = graphene.Int()
        
    @is_authenticated
    def mutate(self, info, product_id, **kwargs):
        user_buss_id = None
        try:
            user_buss_id = info.context.user.user_business.id
        except Exception:
            pass
        
        if user_buss_id:
            own_product = Product.objects.filter(business_id=user_buss_id, id=product_id)
            if own_product:
                raise Exception("You cannot comment on your product")
        
        ProductComment.objects.filter(user=info.context.user.id, product_id=product_id).delete()
        
        pc = ProductComment.objects.create(product_id=product_id, **kwargs)
        
        return CreateProductComment(
            product_comment=pc
        )


class HandleWishList(graphene.Mutation):
    status = graphene.Boolean()
    
    class Arguments:
        product_id = graphene.ID(required=True)
        is_check = graphene.Boolean()
        
    @is_authenticated
    def mutate(self, info, product_id, is_check=False):
        try:
            product = Product.objects.get(id=product_id)
        except Exception:
            raise Exception("Product with product_id does not exist")
        
        try:
            user_wish = info.context.user.user_wish
        except Exception:
            user_wish = Wish.objects.create(user_id=info.context.user.id)
            
        has_product = user_wish.products.filter(id=product_id)
        
        if has_product:
            if is_check:
                return HandleWishList(status=True)
            user_wish.products.remove(product)
        else:
            if is_check:
                return HandleWishList(status=False)
            user_wish.products.add()
            
        return HandleWishList(
            status=True
        )
        
        
class CreateCartItem(graphene.Mutation):
    cart_item = graphene.Field(CartType)
    
    class Argument:
        product_id = graphene.ID(required=True)
        quantity = graphene.Int()
        
    @is_authenticated
    def mutate(self, info, product_id, **kwargs):
        Cart.objects.filter(product_id=product_id, user_id=info.context.user.id).delete()
        
        cart_item = Cart.objects.create(product_id=product_id, user_id=info.context.user.id, **kwargs)
        
        return CreateCartItem(
            cart_item=cart_item
        )
        
        
class UpdateCartItem(graphene.Mutation):
    cart_item = graphene.Field(CartType)
    
    class Argument:
        cart_id = graphene.ID(required=True)
        quantity = graphene.Int(required=True)
        
    @is_authenticated
    def mutate(self, info, cart_id, **kwargs):
        Cart.objects.filter(id=cart_id, user_id=info.context.user.id).update(**kwargs)
        
        return UpdateCartItem(
            cart_item = Cart.objects.get(id=cart_id)
        )


class DeleteCartItem(graphene.Mutation):
    status = graphene.Boolean()
    
    class Argument:
        cart_id = graphene.ID(required=True)
        
    @is_authenticated
    def mutate(self, info, cart_id):
        Cart.objects.filter(id=cart_id, user_id=info.context.user.id).delete()
        
        return DeleteCartItem(
            status=True
        )
        
        
class CompletePayment(graphene.Mutation):
    status = graphene.Boolean()
    
    @is_authenticated
    def mutate(self, info):
        user_carts = Cart.objects.filter(user_id=info.context.user.id)
        
        RequestCart.objects.bulk_create({
            RequestCart(
                user_id = info.context.user.id,
                business_id = cart_item.product.business.id,
                product_id = cart_item.product.id,
                quantity = cart_item.quantity,
                price = cart_item.quantity * cart_item.product.price
            ) for cart_item in user_carts
        })
        
        user_carts.delete()
        
        return CompletePayment(
            status = True
        )
    

class Mutation(graphene.ObjectType):
    create_business = CreateBusiness.Field()
    update_business = UpdateBusiness.Field()
    delete_business = DeleteBusiness.Field()
    create_product = CreateProduct.Field()
    update_product = UpdateProduct.Field()
    updae_product_image = UpdateProductImage.Field()
    delete_product = DeleteProduct.Field()
    create_product_comment = CreateProductComment.Field()
    handle_wish_list = HandleWishList.Field()
    create_cart_item = CreateCartItem.Field()
    update_cart_item = UpdateCartItem.Field()
    delete_cart_item = DeleteCartItem.Field()
    complete_payment = CompletePayment.Field()