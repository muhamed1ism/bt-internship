import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ToastNotification {
  id: string;
  title: string;
  sender: string;
  ticketTitle: string;
  messagePreview: string;
  timestamp: Date;
}

interface ToastNotificationProps {
  notification: ToastNotification;
  onDismiss: (id: string) => void;
  onClick?: (notification: ToastNotification) => void;
}

export const ToastNotificationComponent = ({
  notification,
  onDismiss,
  onClick,
}: ToastNotificationProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger slide-in animation
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    // Wait for animation to complete before removing
    setTimeout(() => onDismiss(notification.id), 300);
  };

  const handleClick = () => {
    if (onClick) {
      onClick(notification);
    }
    handleDismiss();
  };

  return (
    <div
      className={`transform transition-all duration-300 ease-out ${
        isVisible ? 'translate-x-0 scale-100 opacity-100' : 'translate-x-full scale-95 opacity-0'
      }`}
    >
      <div
        onClick={handleClick}
        className="group relative max-w-sm cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white p-4 shadow-lg ring-1 ring-black/5 transition-all duration-200 hover:shadow-xl hover:ring-2 hover:ring-blue-500/20"
      >
        {/* Close button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDismiss();
          }}
          className="absolute top-2 right-2 rounded-full p-1 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Content */}
        <div className="pr-8">
          {/* Header with sender and time */}
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                <span className="text-sm font-medium text-blue-600">💬</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{notification.sender}</p>
                <p className="text-xs text-gray-500">
                  {new Date(notification.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Ticket title */}
          <h4 className="mb-1 truncate text-sm font-medium text-gray-900">
            📋 {notification.ticketTitle}
          </h4>

          {/* Message preview */}
          <p className="line-clamp-2 text-sm text-gray-700">{notification.messagePreview}</p>

          {/* Action hint */}
          <div className="mt-2 flex items-center text-xs text-blue-600">
            <span>Click to view conversation</span>
            <svg className="ml-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Animated pulse border */}
        <div className="absolute inset-0 animate-pulse rounded-lg border-2 border-blue-400 opacity-20"></div>
      </div>
    </div>
  );
};

interface ToastContainerProps {
  notifications: ToastNotification[];
  onDismiss: (id: string) => void;
  onClick?: (notification: ToastNotification) => void;
}

export const ToastContainer = ({ notifications, onDismiss, onClick }: ToastContainerProps) => {
  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-3">
      {notifications.map((notification) => (
        <ToastNotificationComponent
          key={notification.id}
          notification={notification}
          onDismiss={onDismiss}
          onClick={onClick}
        />
      ))}
    </div>
  );
};

export type { ToastNotification };
