from .models import UserAddress


def create_user_address(info, address_data, is_default):
    try:
        user_profile_id = info.context.user.user_profile.id
    except Exception:
        raise Exception("You meed a profile to create an address")
    
    existing_address = UserAddress.objects.filter(user_profile=user_profile_id)
    
    if is_default:
        existing_address.update(is_default=False)
        
    address = UserAddress.objects.create(
        user_profile_id=user_profile_id,
        is_default=is_default,
        **address_data
    )
    
    return address


def update_user_address(info, address_data, address_id, is_default=False):
    profile_id = info.context.user.user_profile.id
    address = UserAddress.objects.filter(
        user_profile_id = profile_id,
        id = address_id
    ).update(is_default=is_default, **address_data)
    
    if is_default:
        address.objects.filter(
            uer_profile_id = profile_id
        ).exclude(
            id=address_id
        ).update(is_default=False)