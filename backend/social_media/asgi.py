import os
import django
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import path
from channels.security.websocket import AllowedHostsOriginValidator

# Set the settings module for Django before importing other modules
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'social_media.settings')

# Ensure Django apps are ready before importing any models
django.setup()

# Import your consumers after setting up Django
from social.consumers import NotificationConsumer, MessageConsumer

# Get the default ASGI application
django_asgi_app = get_asgi_application()

# Define the application with WebSocket handling
application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter([
                path('ws/notifications/', NotificationConsumer.as_asgi()),
                path('ws/messages/<str:thread_id>/', MessageConsumer.as_asgi()),
            ])
        )
    ),
})

