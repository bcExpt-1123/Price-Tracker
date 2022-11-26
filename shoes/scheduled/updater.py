from apscheduler.schedulers.background import BackgroundScheduler
from .functions import main, notify

def start():
	scheduler = BackgroundScheduler()
	scheduler.add_job(main, 'interval', seconds=600, max_instances=3)
	scheduler.add_job(notify, 'interval',seconds = 604800)
	scheduler.start()