import graphene
from graphene_django import DjangoObjectType
from django.conf import settings

from .models import User, ImageUpload, UserProfile, UserAddress


class UserOutput(DjangoObjectType):
    class Meta:
        model = User
        
        
class ImageUploadType(DjangoObjectType):
    image = graphene.String()
    
    class Meta:
        model = ImageUpload
        
    def resolve_image(self, info):
        if (self.image):
            return "{}{}{}",format(settings.S3_BUCKET_URL, settings.MEDIA_URL, self.image)
        return None
        

class UserProfileInput(graphene.InputObjectType):
    profile_picture = graphene.String()
    country_code = graphene.String()
    
    
class UserProfileType(DjangoObjectType):
    class Meta:
        model = UserProfile
        

class AddressInput(graphene.InputObjectType):
    street = graphene.String()
    city = graphene.String()
    state = graphene.String()
    country = graphene.String()
    
    
class UserAddressType(DjangoObjectType):
    class Meta:
        model = UserAddress