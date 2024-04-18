// eslint-disable-next-line no-undef
importScripts("https://www.gstatic.com/firebasejs/8.8.0/firebase-app.js");
// eslint-disable-next-line no-undef
importScripts("https://www.gstatic.com/firebasejs/8.8.0/firebase-messaging.js");

const firebaseConfig = {
    apiKey: "AIzaSyA45Jffx3B3m3EpH0C3lWSa8v9DIvCffas",
    authDomain: "click2eat-f1473.firebaseapp.com",
    projectId: "click2eat-f1473",
    storageBucket: "click2eat-f1473.appspot.com",
    messagingSenderId: "737424143838",
    appId: "1:737424143838:web:621cb5cb52757f3338994f",
    measurementId: "G-ZXE4FDGHCB",
};
// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);
// eslint-disable-next-line no-undef
const messaging = firebase.messaging();

messaging.onBackgroundMessage((_) => {
    // const notificationTitle = payload.notification.title;
    // const notificationOptions = {
    //     body: payload.notification.body,
    //     icon: "/favicon.ico",
    // };
    const channel = new BroadcastChannel('fcm-channel');
    channel.postMessage('Hello from service worker!');
    //self.registration.showNotification(notificationTitle, notificationOptions);
});