from django.db import models
from django.contrib.auth import get_user_model

# Create your models here.


class Shoe(models.Model):
    url = models.TextField()
    name= models.CharField(max_length=100)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    updated_date = models.DateTimeField(auto_now_add=True)


class LinkUrlToUser(models.Model):
    url = models.TextField()
    name= models.CharField(max_length=100)
    user_email = models.EmailField()
