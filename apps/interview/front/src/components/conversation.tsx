import React, { useState, useEffect, useRef } from 'react';
import './conversation.css';

const Conversation = () => {
    const [messages, setMessages] = useState([
        { id: 1, sender: 'bot', text: 'Hi! How can I help you?' },
        { id: 2, sender: 'user', text: 'nothing' }
    ]);
    const endOfMessagesRef = useRef<null|HTMLDivElement>(null); // Reference to scroll to
    useEffect(() => {
        // Initialize WebSocket connection
        const socket = window.io('ws://127.0.0.1:5000', {
            reconnection: true,               // Enable reconnections
            reconnectionAttempts: 5,          // Attempt to reconnect 5 times
            reconnectionDelay: 1000,          // Wait 1 second before each attempt
            reconnectionDelayMax: 5000,       // Max wait time is 5 seconds
            timeout: 20000                    // Connection timeout of 20 seconds
        });

        socket.on('connect', () => {
            console.log('Connected to server');
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        // Listen for messages from the server
        socket.on('message_from_server', function (data: any) {
            setMessages((prevMessages)=>[...prevMessages, { ...data.message, id: messages.length + 1}]);
        });

        return () => {
            socket.disconnect();
        };

    }, []);

    useEffect(() => {
        // Scroll to the bottom of the messages container whenever messages update
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages.length]); 

    return (
        <div className="conversation-container">
            <div className="messages">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
                    >
                        {message.text}
                    </div>
                ))}
                <div ref={endOfMessagesRef} />
            </div>
        </div>
    );
};

export default Conversation;