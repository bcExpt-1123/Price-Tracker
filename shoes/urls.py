from django.contrib import admin
from django.urls import path
from . import views

app_name = "shoes"

urlpatterns = [path("", views.index, name="index"),
               path("watch", views.watch, name="watch"),
               path("unwatch", views.unwatch, name="unwatch")]
