from django.shortcuts import render, redirect
from .models import LinkUrlToUser, Shoe
from .scheduled.functions import get_shoe_props
from django.contrib.auth.decorators import login_required
from django.contrib import messages
# Create your views here.


def index(request):
    current_user = request.user
    context = {
        "watching": None
    }
    if(hasattr(current_user, "email")):
        all = LinkUrlToUser.objects.filter(user_email=current_user.email)
        context["watching"] = all
    return render(request, "index.html",context)

@login_required
def watch(request):
    if(request.method == "POST"):
        user_email = request.POST["user_email"]
        url = request.POST["url"]
        response = get_shoe_props(url)
        if not response:
            messages.info(request,"Sadece aşağıdaki markalara ait ürünleri ekleyebilirsiniz")
            return redirect("index")
        price, name = response
        shoe = Shoe.objects.filter(url=url).first()
        if not shoe:
            shoe = Shoe.objects.create(url=url, price = price,name=name)
            shoe.save()


        if not LinkUrlToUser.objects.filter(url=url,user_email=user_email).first():
            watch = LinkUrlToUser.objects.create(url=url,name=name ,user_email=user_email)
            watch.save()

        
    return redirect("index")

@login_required
def unwatch(requst):
    if(requst.method == "POST"):
        id = requst.POST["id"]
        LinkUrlToUser.objects.filter(id=id).delete()

    
    return redirect("index")