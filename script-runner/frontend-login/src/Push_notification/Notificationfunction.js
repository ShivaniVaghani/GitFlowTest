import React from 'react'
import axios from 'axios';
import Cookies from 'js-cookie';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export const Notificationfunction = async () => {
    const context = useContext(AppContext);
    const {setNotifications} = context

    const notificationSound = new Audio('/notification.mp3');
    const fetchNotifications = async()=>{
        const token = Cookies.get("accessToken");
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_BASE_BACKEND_API_URL}api/v1/notification/get-all`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.data.body && Array.isArray(response.data.body.value)) {
                setNotifications(response.data.body.value); 
                if(response.data.body.value.length > 0) {
                    notificationSound.play();
                }
            } else {
                console.error(
                    "API response does not contain expected data structure:",
                    response.data
                );
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    }

    const permission = Cookies.get('notificationPermission');
    if (permission === 'granted') {
        console.log("Permission granted. Fetching notifications...");
        await fetchNotifications();
    } else {
        console.warn("Permission not granted. Notifications will not be fetched.");
    }
   
};
