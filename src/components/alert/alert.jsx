

import { ReactNotifications, Store } from 'react-notifications-component';

export function addNotification(notificationType, notificationTitle, notificationMessage, notificationPosition, duration, icon,notificationContent) {									
    Store.addNotification({
        title: notificationTitle,
        message: (					
            <div>				
              <i className={icon} style={{ fontSize: '25px', marginRight: '10px' }}></i> {notificationMessage}
            </div>
          ),
        type: notificationType,
        insert: "top",
        container: notificationPosition,
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: {
            duration: 8000,			
        },
        content: notificationContent
    });
}