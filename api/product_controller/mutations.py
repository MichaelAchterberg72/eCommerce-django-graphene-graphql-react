import graphene
from django.contrib.auth import authenticate
from datetime import datetime
from graphene_file_upload.scalars import Upload

from .models import (
    Category,
    Business,
    Product,
    ProductComment,
    ProductImage,
    Wish,
    Cart,
    RequestCart,
)
from .types import (
    BusinessType,
    ProductType,
    ProductInput,
    ProductImageInput,
    ProductImageType,
    ProductCommentType,
    CartType,
)
from .utils import (
    update_business,
    create_product,
    update_product,
    update_product_image,
    bulk_action_products,
    create_product_comment,
    create_cart_item,
    complete_payment,
)
from .enums import ActionTypeChoicesEnum

from api.permissions import is_authenticated


class CreateBusiness(graphene.Mutation):
    business = graphene.Field(BusinessType)
    
    class Arguments:
        name = graphene.String(required=True)
        
    @is_authenticated
    def mutate(self, info, name):
        buss = Business.objects.create(name=name, user_id=info.context.user.id)
        return CreateBusiness(
            business = buss
        )


class UpdateBusiness(graphene.Mutation):
    """
    Update the users Business  
    """
    business = graphene.Field(BusinessType)
    
    class Arguments:
        name = graphene.String()
        
    @is_authenticated
    def mutate(self, info, name):
        update_buss = update_business(info, name)
        return UpdateBusiness(
            business = update_buss
        )
        
        
class DeleteBusiness(graphene.Mutation):
    """
    Delete the users business
    """
    status = graphene.Boolean()
    
    @is_authenticated
    def mutate(self, info):
        Business.objects.filter(user_id=info.context.user.id).delete()
        return DeleteBusiness(
            status = True
        )


class CreateCategory(graphene.Mutation):
    """
    Create a category
    """
    status = graphene.Boolean()
    
    class Arguments:
        name = graphene.String()
        
    def mutate(self, info, name):
        Category.objects.create(name=name)
        return CreateCategory(
            status = True
        )
        
        
class CreateProduct(graphene.Mutation):
    """
    Create a new product
    """
    product = graphene.Field(ProductType)
    
    class Argumants:
        product_data = ProductInput(required=True)
        total_count = graphene.Int(required=True)
        images = graphene.List(ProductImageInput)
        
    @is_authenticated
    def mutate(self, info, product_data, images, **kwargs):
        product = create_product(info, product_data, images, **kwargs)
        return CreateProduct(
            product=product
        )


class UpdateProduct(graphene.Mutation):
    """
    Update a product
    """
    product = graphene.Field(ProductType)
    
    class Argumants:
        product_data = ProductInput()
        total_available = graphene.Int()
        product_id = graphene.ID(required=True)
        
    @is_authenticated
    def mutate(self, info, product_data, product_id, **kwargs):
        product = update_product(info, product_data, product_id, **kwargs)
        return UpdateProduct(
            product=Product.objects.get(id=product)
        )
        
        
class DeleteProduct(graphene.Mutation):
    """
    Delete a product
    """
    status = graphene.Boolean()
    
    class Arguments:
        product_id = graphene.ID(required=True)
        
    @is_authenticated
    def mutate(self, info, product_id):
        Product.objects.filter(
            id=product_id, business_id=info.context.user.user_business.id
        ).delete()
        return DeleteProduct(
            status=True
        )


class UpdateProductImage(graphene.Mutation):
    """
    Update a product image
    """
    image = graphene.Field(ProductImageType)
    
    class Arguments:
        image_data = ProductImageInput()
        id = graphene.ID(required=True)
        
    @is_authenticated
    def mutate(self, info, image_data, id):
        product = update_product_image(info, image_data, id)
        return UpdateProductImage(
            image = ProductImage.objects.get(id=id)
        )
        

class CreateProductComment(graphene.Mutation):
    """
    Create a product comment
    """
    product_comment = graphene.Field(ProductCommentType)
    
    class Arguments:
        product_id = graphene.String(required=True)
        comment = graphene.String(required=True)
        rate = graphene.Int()
        
    @is_authenticated
    def mutate(self, info, product_id, **kwargs):
        product_comment_item = create_product_comment(info, product_id, **kwargs)
        return CreateProductComment(
            product_comment=product_comment_item
        )


class BulkActionProduct(graphene.Mutation):
    meggase = graphene.String()
    ids = graphene.List(graphene.ID)
    
    class Argument:
        ids = graphene.List(graphene.ID)
        action_type = ActionTypeChoicesEnum()
        
    @is_authenticated
    def mutate(self, info, **kwargs):
        action = bulk_action_products(**kwargs)
        return BulkActionProduct(
            message = action,
            ids = kwargs.get("ids")
        )


class HandleWishList(graphene.Mutation):
    """
    Add product to wishlist
    """
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
    """`
    Create cart item
    """
    cart_item = graphene.Field(CartType)
    
    class Argument:
        product_id = graphene.ID(required=True)
        quantity = graphene.Int()
        
    @is_authenticated
    def mutate(self, info, product_id, **kwargs):
        cart_item = create_cart_item(self, info, product_id, **kwargs)
        return CreateCartItem(
            cart_item=cart_item
        )
        
        
class UpdateCartItem(graphene.Mutation):
    """`
    Update cart item
    """
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
    """`
    Delete cart item
    """
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
    """`
    Complete the payment process to add cart items to payment
    """
    status = graphene.Boolean()
    
    @is_authenticated
    def mutate(self, info):
        payment_item = complete_payment(info)
        return CompletePayment(
            status = True
        )
    

class Mutation(graphene.ObjectType):
    create_business = CreateBusiness.Field()
    update_business = UpdateBusiness.Field()
    delete_business = DeleteBusiness.Field()
    create_category = CreateCategory.Field()
    create_product = CreateProduct.Field()
    update_product = UpdateProduct.Field()
    update_product_image = UpdateProductImage.Field()
    delete_product = DeleteProduct.Field()
    create_product_comment = CreateProductComment.Field()
    handle_wish_list = HandleWishList.Field()
    create_cart_item = CreateCartItem.Field()
    update_cart_item = UpdateCartItem.Field()
    delete_cart_item = DeleteCartItem.Field()
    complete_payment = CompletePayment.Field()