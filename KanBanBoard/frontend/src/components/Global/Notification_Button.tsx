import React, { useEffect, useState } from "react";

interface Notification {
  notification_id: string;
  message: string;
  is_read: boolean;
}

const Notification_Button: React.FC = () => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    try {
      const res = await fetch("http://localhost:3000/api/fetch-notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!res.ok) throw new Error("Failed to fetch notifications");
      const data = await res.json();
      console.log("Fetched notifications:", data);  
  
   
      if (Array.isArray(data.notifications)) {
      
        const notificationList = data.notifications.filter((n) => !n.is_read);
        setNotifications(notificationList); 
      } else {
        console.error("Notifications are missing or in an unexpected format", data);
        setNotifications([]); 
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setNotifications([]); 
    }
  };
  const fetchUnreadCount = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    try {
      const res = await fetch("http://localhost:3000/api/unread-notifications-num", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!res.ok) throw new Error("Failed to fetch unread count");
      const data = await res.json();
      console.log("Number of unread Notifications: " + JSON.stringify(data));
      setUnreadCount(data.notiNum || 0);
    } catch (err) {
      console.error("Error fetching unread count:", err);
      setUnreadCount(0);
    }
  };
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); //refreshes every 30s
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (notification_id: string) => {
    console.log("Marking notification as read:", notification_id);
    let notificationId = notification_id;
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token is not available");

      await fetch('http://localhost:3000/api/read-notification', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ notificationId }), 
      });
      fetchUnreadCount();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  useEffect(() => {
    if (isDropdownVisible) {
      fetchNotifications();
    }
  }, [isDropdownVisible]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        padding: "10px",
      }}
    >
      <button
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#D9D9D9",
          border: "none",
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          top: "12.9px",
          right: "120px",
        }}
        onClick={toggleDropdown}
      >
        <img
          src="src/assets/images/Notification Button.png"
          alt="Notifications"
          style={{
            width: "200%",
            height: "150%",
            objectFit: "cover",
          }}
        />
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "5px",
              right: "5px",
              backgroundColor: "red",
              color: "white",
              borderRadius: "50%",
              padding: "2px 6px",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            {unreadCount}
          </span>
        )} 
      </button>

      {isDropdownVisible && (
        <div
          style={{
            position: "absolute",
            top: "80px",
            right: "60px",
            backgroundColor: "#EAEAEA",
            border: "3px solid #CFCFCF",
            padding: "10px",
            borderRadius: "5px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            fontFamily: "Helvetica, Arial, sans-serif",
            zIndex: 1,
            width: "300px",
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          {notifications.length === 0 ? (
            <div>No new notifications</div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.notification_id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                  padding: "5px",
                  backgroundColor: "#fff",
                  borderRadius: "4px",
                }}
              >
                <span style={{ fontSize: "0.9rem", marginRight: "10px" }}>
                  {notification.message}
                </span>
                <input
                  type="checkbox"
                  onChange={() => markAsRead(notification.notification_id)}
                  title="Mark as read"
                />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Notification_Button;
