'use client'

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInitializer = async () => {
      await fetch('/api/socket');
      const newSocket = io();
      setSocket(newSocket); // 用 setSocket 更新 state 触发重新渲染
    };

    socketInitializer();

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
