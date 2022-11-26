from django.apps import AppConfig


class ShoesConfig(AppConfig):
    name = 'shoes'

    def ready(self):
        from .scheduled import updater
        updater.start()
