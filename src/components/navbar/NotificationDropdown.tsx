'use client'

import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {ScrollArea} from "@/components/ui/scroll-area";
import {useState} from "react";

type Notification = {
    id: number;
    time: Date;
    by: string;
    content: string
}
const notificationsExample: Notification[] = [
    {
        id: 1,
        time: new Date(),
        by: "Mesa 5",
        content: "Solicita servicio"
    },
    {
        id: 2,
        time: new Date(),
        by: "Mesa 3",
        content: "Solicita servicio"
    }
]

export function NotificationDropdown() {

    const [notifications, setNotifications] = useState<Notification[]>(notificationsExample);
    const handleClick = (id: number) => {
        const clicked = notifications.filter(notification => notification.id !== id);
        setNotifications(clicked);
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant={"ghost"} className={"relative"}>
                    <Badge variant="secondary">+{notifications.length}</Badge>
                </Button>
            </PopoverTrigger>
            <PopoverContent align={"end"} className={'p-0'}>
                <ScrollArea className={'h-max-64 p-3'}>
                    {
                        notifications.length === 0 && (
                            <h4>
                                No hay notificaciones pendientes
                            </h4>
                        )
                    }
                    {
                        notifications.map((notification, id) => {
                            return (
                                <div key={id} onClick={_ => handleClick(notification.id)}
                                     className={"hover:bg-accent hover:cursor-pointer p-3 rounded-md"}>
                                    <div className={"flex space-x-2 items-center justify-between"}>
                                        <h4 className={"font-bold text-sm"}>{notification.by}</h4>
                                        <span className={"text-sm"}>18:50h</span>
                                    </div>
                                    <p className={"text-sm"}>
                                        {notification.content}
                                    </p>
                                </div>
                            )
                        })
                    }
                </ScrollArea>
            </PopoverContent>
        </Popover>
    )
}