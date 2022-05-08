from product_controller.enums import ActionTypeChoices
from .models import (
    Product,
    ProductPrice,
    ProductImage,
    ProductComment,
    Cart,
    RequestCart,
)
from .handle import (
    handle_price,
    handle_publish,
    handle_duplicate_product
)


def update_business(info, name):
    try:
        instance = info.context.user.user_business
    except Exception:
        raise Exception("You do not have a business to update")
    
    instance.name = name
    instance.save()
    
    return instance


def create_product(info, product_data, images, **kwargs):
    price = product_data.get("price", None)
    publish = product_data.get("publish", None)
    if "price" in product_data.key():
        del product_data["price"]
    if "publish" in product_data.key():
        del product_data["publish"]
        
    try:
        buss_id = info.context.user.user_business.id
    except Exception:
        raise Exception("You do not have a business")
    
    have_product = Product.objects.filter(business_id=buss_id, name=product_data["name"])
    if have_product:
        raise Exception("You already have a product with this name")
    
    product_data["total_available"] = product_data["total_count"]
    
    product_obj = Product.objects.create(**product_data, **kwargs)
    
    #Handle price
    if price is not None:
        product_obj = handle_price(product_obj, price)
    #Handle publish
    if publish is not None:
        product_obj = handle_publish(product_obj, publish)
    
    ProductImage.objects.objects.bulk_create([
        ProductImage(product_id=product_obj.id, **image_data) for image_data in images
    ])
    
    return product_obj


def update_product(info, product_data, product_id, **kwargs):
    price = product_data.get("price", None)
    publish = product_data.get("publish", None)
    if "price" in product_data.key():
        del product_data["price"]
    if "publish" in product_data.key():
        del product_data["publish"]
        
    try:
        buss_id = info.context.user.user_business.id
    except Exception:
        raise Exception("You do not have a business")
    
    if product_data.get("name", None):
        have_product = Product.objects.filter(business_id=buss_id, name=product_data["name"])
        if have_product:
            raise Exception("You already have a product with this name")
        
    product_obj = Product.objects.filter(id=product_id, business_id=buss_id).update(**product_data, **kwargs)
    
    #Handle price
    if price is not None:
        product_obj = handle_price(product_obj, price)
    #Handle publish
    if publish is not None:
        product_obj = handle_publish(product_obj, publish)
    
    return product_id


def update_product_image(info, image_data, id):
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
    
    return id


def create_product_comment(info, product_id, **kwargs):
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
    
    return pc


def bulk_action_products(**data):
    ids = data.get("ids", None)
    action_type = data.get("action_type", None)
    
    if ids is not None:
        raise Exception (
            f"Please select the products you want to {action_type.title()}"
        )
        
    for id in ids:
        product_obj = Product.objects.get(id=id)   
        if action_type == ActionTypeChoices.DELETE:
            product_obj.delete()
        if action_type == ActionTypeChoices.PUBLISH:
            product_obj.handle_publish(
                product_obj,
                product_obj.publish,
                to_published=True
            )
        if action_type == ActionTypeChoices.UNPUBLISH:
            product_obj.handle_unpublish(
                product_obj,
                product_obj.publish,
                to_published=False
            )
        if action_type == ActionTypeChoices.DUPLICATE:
            product_obj = handle_duplicate_product(product_obj)
            
    return "Bulk action successful"


def create_cart_item(self, info, product_id, **kwargs):
    Cart.objects.filter(product_id=product_id, user_id=info.context.user.id).delete()
    
    cart_item = Cart.objects.create(product_id=product_id, user_id=info.context.user.id, **kwargs)
    
    return cart_item


def complete_payment(info):
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
        