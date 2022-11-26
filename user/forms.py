from django import forms

class RegisterForm(forms.Form):
    username = forms.CharField(
        max_length=20, label="Kullanıcı Adı", widget=forms.TextInput(
            attrs={"class": "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "}))
    email = forms.EmailField(widget=forms.EmailInput(attrs={
                             "class": "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "}))
    password = forms.CharField(max_length=20, label="Parola", widget=forms.PasswordInput(
        attrs={"class": "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "}))
    confirmPassword = forms.CharField(max_length=20, label="Parolayı Doğrula", widget=forms.PasswordInput(
        attrs={"class": "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "}))

    def clean(self):
        username = self.cleaned_data.get("username")
        email = self.cleaned_data.get("email")
        password = self.cleaned_data.get("password")
        confirmPassword = self.cleaned_data.get("confirmPassword")

        if password and confirmPassword and password != confirmPassword:
            raise forms.ValidationError("Parolalar Eşleşmiyor")

        values = {
            "username": username,
            "email": email,
            "password": password
        }
        return values


class LoginForm(forms.Form):
    username = forms.CharField(
        max_length=20, label="Kullanıcı Adı", widget=forms.TextInput(
            attrs={"class": "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "}))
    password = forms.CharField(max_length=20, label="Parola", widget=forms.PasswordInput(
        attrs={"class": "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "}))
