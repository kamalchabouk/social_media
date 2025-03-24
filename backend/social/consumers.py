import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Notification

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # We don't need user authentication for now, just create a general group
        self.room_group_name = "notifications"

        # Add the WebSocket to the group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        # Accept the WebSocket connection
        await self.accept()

    async def disconnect(self, close_code):
        # Ensure the WebSocket leaves the group when disconnected
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        # Handle incoming messages here (if necessary)
        pass

    async def send_notification(self, notification_data):
        # This method sends a notification to the WebSocket client
        await self.send(text_data=json.dumps(notification_data))

    async def new_notification(self, notification_id):
        try:
            # Retrieve the notification by ID
            notification = Notification.objects.get(pk=notification_id)
        except Notification.DoesNotExist:
            # Log the error and return if the notification doesn't exist
            print(f"Notification {notification_id} does not exist.")
            return

        # Prepare the notification data
        notification_data = {
            'id': notification.id,
            'type': notification.notification_type,
            'from_user': notification.from_user.username,
            'message': notification.comment.comment if notification.comment else 'New notification',
            'timestamp': str(notification.date),
        }

        # Send the notification data to the WebSocket client
        await self.send_notification(notification_data)



class MessageConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        if self.user.is_authenticated:
            self.thread_id = self.scope['url_route']['kwargs']['thread_id']
            self.room_group_name = f"messages_{self.thread_id}"
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        message_data = json.loads(text_data)
        message_text = message_data['message']
        message = MessageModel.objects.create(
            thread_id=self.thread_id,
            sender_user=self.user,
            body=message_text
        )

        # Send the message to the WebSocket
        await self.send(text_data=json.dumps({
            'message': message.body,
            'sender': self.user.username,
            'timestamp': str(message.date),
        }))

    async def new_message(self, message_id):
        message = MessageModel.objects.get(pk=message_id)
        message_data = {
            'id': message.id,
            'body': message.body,
            'sender': message.sender_user.username,
            'timestamp': str(message.date),
        }
        await self.send(text_data=json.dumps(message_data))
