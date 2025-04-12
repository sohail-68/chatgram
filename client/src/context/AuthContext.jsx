// ChatMessagesContext.js
import { createContext, useContext, useState } from 'react';

const ChatMessagesContext = createContext();

export const ChatMessagesProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  return (
    <ChatMessagesContext.Provider value={{ messages, setMessages, socket, setSocket }}>
      {children}
    </ChatMessagesContext.Provider>
  );
};

export const useChatMessages = () => useContext(ChatMessagesContext);
