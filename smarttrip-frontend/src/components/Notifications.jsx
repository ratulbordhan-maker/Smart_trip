import React, { useEffect } from 'react';
import toast, { Toaster, Toast } from 'react-hot-toast';
import { useNotificationStore } from '../store';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, ExclamationIcon } from '@heroicons/react/solid';
import clsx from 'clsx';

export const Notification = ({ id, type, message, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(id), 3000);
    return () => clearTimeout(timer);
  }, [id, onRemove]);

  const icons = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    info: InformationCircleIcon,
    warning: ExclamationIcon,
  };

  const colors = {
    success: 'bg-green-100 text-green-800 border-green-300',
    error: 'bg-red-100 text-red-800 border-red-300',
    info: 'bg-blue-100 text-blue-800 border-blue-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  };

  const Icon = icons[type];

  return (
    <div className={clsx(
      'flex items-center gap-3 px-4 py-3 rounded-lg border-2 animate-slide-up',
      colors[type]
    )}>
      {Icon && <Icon size={24} />}
      <span className="flex-1">{message}</span>
      <button
        onClick={() => onRemove(id)}
        className="text-gray-400 hover:text-gray-600"
      >
        ✕
      </button>
    </div>
  );
};

export const NotificationCenter = () => {
  const { notifications, removeNotification } = useNotificationStore();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {notifications.map((notif) => (
        <Notification
          key={notif.id}
          {...notif}
          onRemove={removeNotification}
        />
      ))}
    </div>
  );
};

export const useToast = () => {
  const notify = useNotificationStore();
  return {
    success: (message) => toast.success(message),
    error: (message) => toast.error(message),
    loading: (message) => toast.loading(message),
    promise: (promise, messages) => toast.promise(promise, messages),
  };
};
