importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyAI8tZx3Y6Z8ripS8InGHdVpI47hzns7nw",
    authDomain: "bluefieldoman-web.firebaseapp.com",
    projectId: "bluefieldoman-web",
    storageBucket: "bluefieldoman-web.appspot.com",
    messagingSenderId: "983987095951",
    appId: "1:983987095951:web:3eca468cc76c5f043323fa",
    measurementId: "G-5BZE2QHC49"
});
const messaging = firebase.messaging();

messaging.onBackgroundMessage(async (payload) => {
    console.log(
        '[firebase-messaging-sw.js] Received background message ',
        payload
    );

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.image,
    };
    self.registration.showNotification(notificationTitle, notificationOptions);   

    self.clients.matchAll({ includeUncontrolled: true }).then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ action: 'FETCH_UNREAD_COUNT' });
        });
      });
});
