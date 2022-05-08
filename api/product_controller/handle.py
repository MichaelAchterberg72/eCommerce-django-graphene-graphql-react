from .models import (
    Product,
    PublishProduct,
    ProductPrice,
    ProductImage,
)
from .enums import PriceTermChoices

from datetime import date
import random
import string


def code_generator(size, chars=string.digits):
    return "".join(random.choice(chars) for _ in range(size))
    

def handle_price(obj_model, price):
    if obj_model.price is not None:
        price_obj = ProductPrice.objects.get(
            id=price.id or obj_model.price.id,
        )
        if (price.add_promotional_price == True and price.promotional_price == 0):
            if price_obj.add_promotional_price == True and price.promotional_price == 0:
                raise Exception(
                    "Please provide a promotional price as you have marked add promotional; price as true"
                )
            if price_obj.promotional_price == 0 and price.add_promotional_price == True:
                raise Exception(
                    "Please provide a promotional price as you have marked add promotional price as true"
                )
                
        price_obj.once_off_price = (
            price.once_off_price
            if price.once_off_price is not None
            else price_obj.once_off_price
        )
        price_obj.add_promotional_price = (
            price.add_promotional_price
            if price.add_promotional_price is not None
            else price_obj.add_promotional_price
        )
        price_obj.promotion_price = (
            price.promotion_price
            if price.promotion_price is not None
            else price_obj.promotion_price
        )
        price_obj.contract_monthly_price = (
            price.contract_monthly_price
            if price.contract_monthly_price is not None
            else price_obj.contract_monthly_price
        )
        price_obj.price_term = (
            price.price_term
            if price.price_term is not None
            else price_obj.price_term
        )
        price_obj.save()
    else:
        if price.promotional_price == 0 and price.add_promotional_price == True:
                raise Exception(
                    "Please provide a promotional price as you have marked add promotional price as true and it cannot be zero"
                )
        price_obj = ProductPrice.objects.create(
            once_off_price = price.once_off_price
            if price.once_off_price is not None 
            else 0.0,
            add_promotional_price = price.add_promotional_price
            if price.add_promotional_price is not None
            else False,
            promotion_price = price.promotion_price
            if price.promotion_price is not None
            else 0.0,
            contract_monthly_price = price.contract_monthly_price
            if price.contract_monthly_price is not None
            else 0.0,
            price_term = price.price_term
            if price.price_term is not None
            else PriceTermChoices.SELECT_PRICE_TERM
        )
    obj_model.price = price_obj
    obj_model.save()
    
    return obj_model


def handle_publish(obj_model, publish, to_published=None):
    if obj_model.publish is not None:
        publish_obj = PublishProduct.objects.get(
            id=publish.id or obj_model.publish.id,
        )
        publish_obj.is_published = (
            to_published if to_published is not None
            else (
                publish.publish
                if publish.publish is not None
                else publish_obj.publish
            )
        )
        publish_obj.publish = (
            publish.publish
            if publish.publish is not None
            else publish_obj.publish
        )
        publish_obj.publish_date = (
            publish.publish_date
            if publish.publish_date is not None
            else None
        )
        publish_obj.unpublish_date = (
            publish.unpublish_date
            if publish.unpublish_date is not None
            else None
        )
    else:
        publish_obj = PublishProduct.objects.create(
            is_published = to_published if to_published is not None
            else (
                publish.is_published
                if publish is not None and publish.is_published is not None
                else None
            ),
            publish = publish.publish 
            if publish is not None and publish.published is not None
            else False,
            publish_date = date.today()
            if to_published == True
            else None,
            unpublish_date = date.today()
            if to_published == False 
            else None
        )
    obj_model.publish = publish_obj
    obj_model.save()
    
    return obj_model


def handle_duplicate_product_image(obj_model):
    product = obj_model.product
    image = obj_model.image
    is_cover = obj_model.is_cover
    
    new_image = ProductImage.objects.create(
        product = product,
        image = image,
        is_cover = is_cover
    )
    return new_image


def handle_duplicate_product(obj_model):
    price = obj_model.price
    publish = obj_model.publish
    name = obj_model.name
    new_code = code_generator(size=8)
    new_name = f"{new_code}-{name}"
    
    product_obj = Product.objects.create(
        category = obj_model.category,
        business = obj_model.business,
        name = new_name,
        total_available = obj_model.total_available,
        total_count = obj_model.total_count,
        description = obj_model.description
    )
    #Handle price
    if price is not None:
        product_obj = handle_price(product_obj, price)
    #Handle publish
    if publish is not None:
        product_obj = handle_publish(product_obj, publish)
    #Handle images
    images = ProductImage.objects.filter(product=obj_model.id)
    for image_obj in images:
        product_obj = handle_duplicate_product_image(image_obj)
    product_obj.save()
    
    return product_obj