import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import './notifications.css';

const NotificationsContext = createContext(undefined);

const notificationTypes = {
  success: { label: 'Sucesso', icon: CheckCircle },
  error: { label: 'Erro', icon: AlertCircle },
  warning: { label: 'Atenção', icon: AlertTriangle },
  info: { label: 'Informação', icon: Info },
};

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const nextId = useRef(0);
  const timers = useRef(new Map());

  const dismiss = (id) => {
    const timer = timers.current.get(id);
    if (timer) window.clearTimeout(timer);
    timers.current.delete(id);
    setNotifications((current) => current.filter((notification) => notification.id !== id));
  };

  const notify = (message, type = 'info') => {
    const normalizedType = notificationTypes[type] ? type : 'info';
    const notification = {
      id: ++nextId.current,
      message: String(message),
      type: normalizedType,
    };

    setNotifications((current) => [...current, notification].slice(-4));
    const duration = normalizedType === 'error' ? 7000 : 5000;
    const timer = window.setTimeout(() => dismiss(notification.id), duration);
    timers.current.set(notification.id, timer);
  };

  useEffect(() => () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current.clear();
  }, []);

  return (
    <NotificationsContext.Provider value={{ notify }}>
      {children}
      <div className="notifications-region" aria-label="Notificações" aria-live="polite" aria-relevant="additions text">
        {notifications.map((notification) => {
          const { icon: Icon, label } = notificationTypes[notification.type];

          return (
            <div
              key={notification.id}
              className={`app-notification app-notification-${notification.type}`}
              role={notification.type === 'error' ? 'alert' : 'status'}
            >
              <Icon className="app-notification-icon" size={21} aria-hidden="true" />
              <div className="app-notification-content">
                <strong>{label}</strong>
                <p>{notification.message}</p>
              </div>
              <button
                type="button"
                className="app-notification-close"
                onClick={() => dismiss(notification.id)}
                aria-label="Fechar notificação"
              >
                <X size={17} aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications deve ser usado dentro de NotificationsProvider.');
  }
  return context;
}