from django.shortcuts import render, redirect
from . import forms
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required

# Create your views here.

def registerUser(request):
    form = forms.RegisterForm(request.POST or None)
    if form.is_valid():
        username = form.cleaned_data.get("username")
        email = form.cleaned_data.get("email")
        password = form.cleaned_data.get("password")

        newUser = User(username=username, email=email)
        newUser.set_password(password)
        newUser.save()
        login(request, newUser)
        return redirect("index")

    context = {
        "form": form
    }
    return render(request, "register.html", context)


def loginUser(request):
    form = forms.LoginForm(request.POST or None)

    context = {
        "form": form
    }

    if form.is_valid():
        username = form.cleaned_data.get("username")
        password = form.cleaned_data.get("password")
        user = authenticate(username=username, password=password)
        if(user is None):
            messages.info(request, "Kullanici Adi veya Parola Hatali")
            return render(request, "login.html", context)
        login(request, user)
        return redirect("index")
    return render(request, "login.html", context)

@login_required
def logoutUser(request):
    logout(request)
    return redirect("index")
