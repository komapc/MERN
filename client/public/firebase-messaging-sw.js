importScripts("https://www.gstatic.com/firebasejs/5.9.4/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/5.9.4/firebase-messaging.js");

try
{
  firebase.initializeApp({
    messagingSenderId: "156567484209"
  });
}
catch (e)
{
  console.error(`firebase.initializeApp failed: ${e}`);
}

try
{
  const messaging = firebase.messaging();
  messaging.setBackgroundMessageHandler(function(payload) {
    const promiseChain = clients.matchAll({
      type: "window",
      includeUncontrolled: true
    })
    .then(windowClients => {
      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        windowClient.postMessage(payload);
      }
      return registration.showNotification(payload.data.title, payload.data);
    })
    .catch((err) => {
      console.error(err);
    });
    return promiseChain;
  });
}
catch(err)
{
  console.error(`Something failed, probably setBackgroundMessageHandler: ${err}.`)
}
self.addEventListener('notificationclick', function(event) {
  try
  {
    const target = event.notification.data.click_action || '/';
    event.notification.close();
    event.waitUntil(clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if (client.url === target && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow(target);
    }))
    .catch((err) => {
      console.error(err);
    });
  }
  catch(err)
  {
    console.error(err);
  }
});
