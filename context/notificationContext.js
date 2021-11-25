/* eslint-disable no-unused-vars */
import { createContext, useEffect, useState } from 'react';

const NotificationContext = createContext({
  activeNotification: {},
  isShowNotification: false,
  showNotification: ({ message, status }) => {},
  hideNotification: () => {},
  status: {},
});

export const NotificationContextProvider = ({ children }) => {
  const [activeNotification, setActiveNotification] = useState({ message: '', status: '' });
  const [isShowNotification, setIsShowNotification] = useState(false);
  const status = {
    SUCCESS: 'SUCCESS',
    DANGER: 'DANGER',
  };

  const showNotification = ({ message, status: statusNotification }) => {
    setActiveNotification({ message, status: statusNotification });
    setIsShowNotification(true);
  };

  function hideNotification() {
    setActiveNotification({ title: '', status: '' });
    setIsShowNotification(false);
  }

  useEffect(() => {
    let timer = null;
    if (isShowNotification) {
      timer = setInterval(() => {
        hideNotification();
      }, 5000); // 5 seconds
    }

    return () => {
      clearInterval(timer);
    };
  }, [isShowNotification]);

  const context = {
    activeNotification,
    isShowNotification,
    showNotification,
    hideNotification,
    status,
  };

  return (
    <NotificationContext.Provider value={context}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
