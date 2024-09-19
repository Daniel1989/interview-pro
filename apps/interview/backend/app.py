from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'

# Force WebSocket transport by disabling polling or other protocols
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')

# Dictionary to keep track of clients
clients = {}


# HTTP POST route to receive a message
@app.route('/sendMessage', methods=['POST'])
def send_message():
    data = request.json
    message = data.get('message')

    if not message:
        return jsonify({'error': 'Message is required!'}), 400

    # Send the message via WebSocket to all connected clients
    socketio.emit('message_from_server', {'message': message})

    return jsonify({'status': 'Message sent to WebSocket clients successfully'}), 200


# WebSocket connection handler
@socketio.on('connect')
def handle_connect():
    print(f'Client connected: {request.sid}')
    clients[request.sid] = request.sid


# WebSocket disconnection handler
@socketio.on('disconnect')
def handle_disconnect():
    print(f'Client disconnected: {request.sid}')
    clients.pop(request.sid, None)


# Optional: Handle WebSocket messages from clients
@socketio.on('message_from_client')
def handle_client_message(data):
    print(f'Received message from WebSocket client {request.sid}: {data["message"]}')
    emit('message_from_server', {'message': data['message']}, broadcast=True)


if __name__ == '__main__':
    socketio.run(app, debug=True)
