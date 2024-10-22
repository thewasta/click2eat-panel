"use client"

import {Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger} from "@nextui-org/dropdown";
import {Avatar} from "@nextui-org/avatar";
import {IconBell, IconBellRinging} from "@tabler/icons-react";
import {useState} from "react";
import {motion} from "framer-motion";

type Notification = {
    id: number;
    location: string;
    time: string;
    message: string;
    isPending: boolean;
}

export function NavbarNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: 1,
            location: "mesa 05",
            time: "15:30",
            message: "Solicitado servicio",
            isPending: true
        },
        {
            id: 2,
            location: "mesa 05",
            time: "15:30",
            message: "Solicitado servicio",
            isPending: true
        },
        {
            id: 3,
            location: "mesa 05",
            time: "15:30",
            message: "Solicitado servicio",
            isPending: true
        },
        {
            id: 4,
            location: "mesa 05",
            time: "15:30",
            message: "Solicitado servicio",
            isPending: true
        },
        {
            id: 5,
            location: "mesa 05",
            time: "15:30",
            message: "Solicitado servicio",
            isPending: true
        },
        {
            id: 6,
            location: "mesa 05",
            time: "15:30",
            message: "Solicitado servicio",
            isPending: true
        },
    ])
    const [clickedNotifications, setClickedNotifications] = useState<boolean>(true);
    const unreadNotifications = notifications.filter(n => n.isPending);
    const readNotifications = notifications.filter(n => !n.isPending);
    const handleClick = () => {
        setClickedNotifications(false);
    }
    const markAsRead = (id: number) => {
        setNotifications(notifications.map(notification =>
            notification.id === id ? {...notification, isPending: false} : notification
        ));
    }
    return (
        <Dropdown placement={"bottom-end"}>
            <DropdownTrigger>
                {
                    clickedNotifications ?
                        <motion.div
                            animate={clickedNotifications ? {
                                scale: [1, 1.1, 1],
                            } : {scale: 1}}
                            transition={{
                                duration: 1.5,
                                ease: "easeInOut",
                                repeat: clickedNotifications ? Infinity : 0,
                                repeatType: "mirror",
                            }}
                            onClick={handleClick}
                        >
                            <IconBellRinging className={"h-6 w-6 hover:cursor-pointer text-destructive"}/>
                        </motion.div>
                        :
                        <IconBell className={"hover:cursor-pointer"}/>
                }
            </DropdownTrigger>
            <DropdownMenu aria-label="Received notifications" variant="faded" disabledKeys={["no-pending"]}>
                <DropdownSection title={"Pending notifications"}>

                    {
                        unreadNotifications.length > 0 ? (
                            <>
                                {
                                    unreadNotifications.map(notification => (
                                        <DropdownItem
                                            key={notification.id}
                                            onClick={() => markAsRead(notification.id)}
                                            startContent={<Avatar
                                                showFallback
                                                name={notification.location}
                                                size={"sm"}
                                            />}
                                        >
                                            {notification.location} {notification.message}
                                        </DropdownItem>
                                    ))
                                }
                            </>
                        ) : (
                            <>
                                <DropdownItem key={'no-pending'}>
                                    NO HAY NOTIFICACIONES
                                </DropdownItem>
                            </>
                        )
                    }
                </DropdownSection>
            </DropdownMenu>
        </Dropdown>
    )
}