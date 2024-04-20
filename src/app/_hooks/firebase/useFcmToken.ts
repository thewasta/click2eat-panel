'use client'
import { useEffect, useState } from 'react';
import { getMessaging, getToken } from 'firebase/messaging';
import firebaseApp from "@/_lib/firebase";
import * as localforage from "localforage";

const useFcmToken = () => {
    const [token, setToken] = useState('');
    const [notificationPermissionStatus, setNotificationPermissionStatus] = useState('');

    useEffect(() => {
        const retrieveToken = async () => {
            try {
                if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                    const messaging = getMessaging(firebaseApp);

                    // Request notification permission
                    const permission = await Notification.requestPermission();
                    setNotificationPermissionStatus(permission);

                    if (permission === 'granted') {
                        const currentToken = await getToken(messaging, {
                            vapidKey: process.env.NEXT_PUBLIC_FCM_VAPID_KEY
                        });
                        if (currentToken) {
                            await localforage.setItem('fcmToken',currentToken);
                            setToken(currentToken);
                        } else {
                            console.log('No registration token available. Request permission to generate one.');
                        }
                    }
                }
            } catch (error) {
                console.log('Error retrieving token:', error);
            }
        };

        retrieveToken();
    }, []);

    return { token, notificationPermissionStatus };
};

export default useFcmToken;