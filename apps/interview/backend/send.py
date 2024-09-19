import random

import requests


def send_message(url, message):
    data = {"message": {"sender": random.choice(["user", "bot"]), "text": message}}
    response = requests.post(url, json=data)
    if response.status_code != 200:
        raise Exception(f"Failed to send message: {response.text}")


if __name__ == '__main__':
    url = "http://localhost:5000/sendMessage"
    message = "Hello, world!"
    send_message(url, message)
