import graphene
from django.contrib.auth import authenticate
from datetime import datetime
from graphene_file_upload.scalars import Upload

from .models import ImageUpload, User, UserProfile, UserAddress
from .types import UserAddressType, UserOutput, ImageUploadType, UserProfileInput, UserProfileType, AddressInput

from api.authentication import TokenManager
from api.permissions import is_authenticated


class RegisterUser(graphene.Mutation):
    status = graphene.Boolean()
    message = graphene.String()
    
    class Arguments:
        email = graphene.String(required=True)
        password = graphene.String(required=True)
        first_name = graphene.String(required=True)
        last_name = graphene.String(required=True)
        
    def mutate(self, info, email, password, **kwargs):
        User.objects.create_user(email, password, **kwargs)
        return RegisterUser(
            status = True,
            message = "User has been created successfully"
        )


class LoginUser(graphene.Mutation):
    access = graphene.String()
    refresh = graphene.String()
    user = graphene.Field(UserOutput)
    
    class Arguments:
        email = graphene.String()
        password = graphene.String()
            
    def mutate(self, info, email, password):
        user = authenticate(username=email, password=password)
        
        if not user:
            raise Exception("invalid credentils")
        
        user.last_login = datetime.now()
        user.save()
        
        access = TokenManager.get_access({"user_id": user.id})
        refresh = TokenManager.get_refresh({"user_id": user.id})
    
        return LoginUser(
                access = access,
                refresh = refresh,
                user = user,
            )
    
    
class GetAccess(graphene.Mutation):
    access = graphene.String()
    
    class Arguments:
        refresh = graphene.String(required=True)
        
    def mutate(self, info, refresh):
        token = TokenManager.decode_token(refresh)
        
        if not token or token["type"] != "refresh":
            raise Exception("Invalid token or has expired")
        
        access = TokenManager.get_access({"user_id": token("user_id")})
        
        return GetAccess(
            access = access
        )
        

class ImageUploadMain(graphene.Mutation):
    image = graphene.Field(ImageUploadType)
    
    class Arguments:
        image = Upload(required=True)
        
    def mutate(self, info, image):
        image = ImageUpload.objects.create(image=image)
        return ImageUploadMain(
            image=image
        )
    
    
class CreateUserProfile(graphene.Mutation):
    user_profile = graphene.Field(UserProfileType)
    
    class Arguments:
        profile_data = UserProfileInput()
        dob = graphene.Date(required=True)
        phone = graphene.Int(required=True)
        
    @is_authenticated
    def mutate(self, info, profile_data, **kwargs):
        user_profile = UserProfile.objects.create(
            user_id = info.context.user.id,
            **profile_data, **kwargs
        )
        return CreateUserProfile(
            user_profile=user_profile
        )


class UpdateUserProfile(graphene.Mutation):
    user_profile = graphene.Field(UserProfileType)
    
    class Arguments:
        profile_data = UserProfileInput()
        dob = graphene.Date()
        phone = graphene.Int()
        
    @is_authenticated
    def mutate(self, info, profile_data, **kwargs):
        try:
            info.context.user.user_profile
        except Exception:
            raise Exception("You dont have a profile to update")
        
        UserProfile.objects.filter(
            user_id = info.context.user.id,
        ).update(**profile_data, **kwargs)
        return UpdateUserProfile(
            user_profile=info.context.user.user_profile
        )


class CreateUserAddress(graphene.Mutation):
    address = graphene.Field(UserAddressType)
    
    class Arguments:
        address_data = AddressInput(required=True)
        is_default = graphene.Boolean()
        
    @is_authenticated
    def mutate(self, info, address_data, is_default):
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
        
        return CreateUserAddress(
            address=address
        )
    
    
class UpdateUserAddress(graphene.Mutation):
    address = graphene.Field(UserAddressType)

    class Arguments:
        address_data = AddressInput()
        is_default = graphene.Boolean()
        address_id = graphene.ID(required=True)
    
    @is_authenticated
    def mutate(self, info, address_data, address_id, is_default=False):
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
            
        return UpdateUserAddress(
            address = UserAddress.objects.get(id=address_id)
        )


class DeleteUserAddress(graphene.Mutation):
    status = graphene.Boolean()
    
    class Arguments:
        profile_id = graphene.ID(required=True)
    
    @is_authenticated
    def mutate(self, info, address_id):
        address = UserAddress.objects.filter(
            user_profile_id = profile_id,
            id = address_id
        ).delete()
        
        return DeleteUserAddress(
            status = True
        )
        
        
class Mutation(graphene.ObjectType):
    register_user = RegisterUser.Field()
    login_user = LoginUser.Field()
    get_access = GetAccess.Field()
    image_upload = ImageUploadMain.Field()
    create_user_profile = CreateUserProfile.Field()
    update_user_profile = UpdateUserProfile.Field()
    create_user_address = CreateUserAddress.Field()
    update_user_address = UpdateUserAddress.Field()
    delete_user_address = DeleteUserAddress.Field()