import { useContext } from 'react';
import NotificationContext from '@context/notificationContext';

export default function Notification() {
  const notificationCtx = useContext(NotificationContext);

  let displayShow = '';
  if (notificationCtx.isShowNotification) {
    displayShow = 'flex';
  } else {
    displayShow = 'hidden';
  }

  let bgColor = '';
  let textColor = '';
  let btnColor = '';
  if (notificationCtx.activeNotification.status === notificationCtx.status.SUCCESS) {
    bgColor = 'bg-green-200';
    textColor = 'text-green-600';
    btnColor = 'bg-green-100 text-green-600';
  } else if (notificationCtx.activeNotification.status === notificationCtx.status.DANGER) {
    bgColor = 'bg-red-200';
    textColor = 'text-red-600';
    btnColor = 'bg-red-100 text-red-600';
  }

  const handleDismiss = () => {
    notificationCtx.hideNotification();
  };

  return (
    <div className={`fixed ${displayShow} top-3 left-1/2 sm:left-auto sm:right-3 transform sm:transform-none -translate-x-1/2 sm:translate-x-0 z-50 w-11/12 sm:w-80 ${bgColor} rounded-md p-3 flex-col gap-4 transition-all duration-500 ease-in-out`}>
      <p className={`${textColor} font-bold`}>
        {notificationCtx.activeNotification?.message}
      </p>

      <button
        className={`${btnColor} py-1 px-2 rounded-sm self-end`}
        onClick={handleDismiss}
      >
        Dismiss
      </button>
    </div>
  );
}
