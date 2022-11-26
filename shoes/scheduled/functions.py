import requests
from bs4 import BeautifulSoup
from ..models import Shoe, LinkUrlToUser
from email.message import EmailMessage
import smtplib
import re

def get_shoes():
    return Shoe.objects.all()

def get_all_linked_url():
    urls = []
    for url in LinkUrlToUser.objects.all():
         urls.append(url.url)
    return urls

def clear():
    shoes = get_shoes()
    urls = get_all_linked_url()
    for shoe in shoes:
        if( not shoe.url in urls):
            shoe.delete()

def check_url_legit(url):
    pattern = "^https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)$"
    result = re.match(pattern, url)
    return result

def get_shoe_props(url):
    if(not check_url_legit(url)):
        return False
    soup = BeautifulSoup(requests.get(url).content, "html.parser")
    element = soup.find("div", class_="product-price")
    if(not element):
        return False
    price = element.text
    price = price.replace("₺","")
    price = price.replace(".","")
    price = price.replace(",",".")
    price = float(price)

    name = soup.find("h1", id="pdp_product_title").text

    return (price,name)

def scrap():
    shoes = get_shoes()
    for shoe in shoes:
        current_price = get_shoe_props(shoe.url)[0]
        prev_price = float(shoe.price)
        if(not(current_price == prev_price)):
            links = LinkUrlToUser.objects.filter(url=shoe.url)
            op = "Yükseldi" if current_price > prev_price else "Düştü"
            for link in links:
                content = f"{link.name} : {prev_price} -> {current_price} 'e {op}"
                send_email(link.user_email,content)
                shoe.price = current_price
                shoe.save()

def send_email(email,content):
    s = smtplib.SMTP(host='your_host', port=587)
    s.starttls()
    s.login("your_adress", "your_password")
    msg = EmailMessage()
    msg["Subject"] = "Fiyat Değişikliği"
    msg['from'] = "your_adress"
    msg["To"] = email
    msg.set_content(content)
    s.send_message(msg)
    s.quit()
    print("Sent")

def notify():
    send_email("your_adress","Working fine")

def main():
    try:
        clear()
        scrap()
    except Exception as e:
        send_email("your_adress",e)
       


    
            
        