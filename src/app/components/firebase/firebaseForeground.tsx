'use client'

import {getMessaging, onMessage} from 'firebase/messaging';

import {useEffect} from 'react';
import useFcmToken from "@/app/_hooks/firebase/useFcmToken";
import firebaseApp from "@/_lib/firebase";

export default function FcmTokenComp() {
    const {notificationPermissionStatus} = useFcmToken();

    useEffect(() => {
        const channel = new BroadcastChannel('fcm-channel');

        channel.onmessage = (event) => {
            console.log('Received', event);
        };

        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            if (notificationPermissionStatus === 'granted') {
                const messaging = getMessaging(firebaseApp);
                const unsubscribe = onMessage(messaging, (payload) => {
                    console.log('Foreground push notification received:', payload);
                });
                return () => {
                    unsubscribe();
                };
            }
        }
    }, [notificationPermissionStatus]);

    return null;
}