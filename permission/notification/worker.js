// this === self

// this.registration.showNotification(...)
// this.registration.getNotifications(...)

self.addEventListener("notificationclick", function(e) {
    console.log("notificationclick")
    console.log(e.action)
    e.notification.close();
});

self.addEventListener("notificationclose", function(e) {
    console.log("notificationclose")
});