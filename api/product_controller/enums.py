import graphene
from django.db import models


class PriceTermChoices(models.IntegerChoices):
    SELECT_PRICE_TERM = 0
    TWELVE_MONTHS = 1
    TWENTY_FOUR_MONTHS = 2
    THIRTY_SIX_MONTHS = 3
    MONTH_TO_MONTH = 4
    ONCE_OFF = 5


class ActionTypeChoices(models.TextChoices):
    PUBLISH = "PUBLISH"
    UNPUBLISH = "UNPUBLISH"
    DUPLICATE = "DUPLICATE"
    DELETE = "DELETE" 
    
    
PriceTermEnum = graphene.Enum.from_enum(PriceTermChoices)
ActionTypeChoicesEnum = graphene.Enum.from_enum(ActionTypeChoices)