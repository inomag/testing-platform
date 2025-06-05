import React, { useEffect, useState } from 'react';
import { Button } from 'src/@vymo/ui/atoms';
import { Alert, List, Popup } from 'src/@vymo/ui/blocks';
import { ReactComponent as NotificationIcon } from 'src/assets/icons/notification.svg';
import { ReactComponent as NoNotificationImage } from 'src/assets/images/noNotification.svg';
import { NotificationProp, Props } from './types';
import styles from './index.module.scss';

function NotificationList({
  notifications,
  onClearAll,
}: {
  notifications: Array<NotificationProp>;
  onClearAll?: () => void;
}) {
  return (
    <div className={styles.notification__container}>
      {notifications.length > 0 ? (
        <div className={styles.notification__container__list}>
          <List showSelected={false}>
            {notifications.map((notification) => (
              <List.Item className={styles.notification__container__list__item}>
                <Alert
                  key={notification.id}
                  variant={notification.variant}
                  title={notification.title}
                >
                  {notification.message}
                </Alert>
              </List.Item>
            ))}
          </List>

          {onClearAll && (
            <Button type="text" onClick={onClearAll}>
              Clear All
            </Button>
          )}
        </div>
      ) : (
        <NoNotificationImage />
      )}
    </div>
  );
}
function Notification({ buttonVariant, notifications, onClearAll }: Props) {
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    setNotificationCount(notifications.length);
  }, [notifications]);

  return (
    <div className={styles.notification}>
      <Popup
        content={
          <NotificationList
            notifications={notifications}
            onClearAll={onClearAll}
          />
        }
        onClose={() => setNotificationCount(0)}
        closeTrigger="click"
      >
        <Button
          iconProps={{ icon: <NotificationIcon />, iconPosition: 'left' }}
          type="text"
          variant={buttonVariant}
        >
          {notificationCount}
        </Button>
      </Popup>
    </div>
  );
}

export default Notification;
