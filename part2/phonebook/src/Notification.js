const Notification = ({ notification }) => {
  if (!notification || (notification && !Object.keys(notification).length)) {
    return null
  }

  return (
    <div className={notification.type}>
      {notification.message}
    </div>
  )
}

export default Notification;
