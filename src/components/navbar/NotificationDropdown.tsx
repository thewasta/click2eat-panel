import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";

const notificationsExample = [
    {
        time: new Date(),
        by:"Mesa 5",
        content: "solicita servicio"
    },
    {
        time: new Date(),
        by:"Mesa 5",
        content: "solicita servicio"
    },
    {
        time: new Date(),
        by:"Mesa 5",
        content: "solicita servicio"
    },
    {
        time: new Date(),
        by:"Mesa 5",
        content: "solicita servicio"
    },
    {
        time: new Date(),
        by:"Mesa 5",
        content: "solicita servicio"
    },
    {
        time: new Date(),
        by:"Mesa 5",
        content: "solicita servicio"
    },
    {
        time: new Date(),
        by:"Mesa 5",
        content: "solicita servicio"
    },
]

export async function NotificationDropdown() {

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={"ghost"} className={"relative"}>
                    <Badge variant="secondary">+{notificationsExample.length}</Badge>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={"w-[200px]"}>
                <DropdownMenuLabel>
                    Mis notificaciones
                </DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <ScrollArea className={"h-64"}>
                    <DropdownMenuGroup className={"p-3 flex flex-col"}>
                        {
                            notificationsExample.map((notificatiion, id) => {
                                return (
                                    <div key={id} className={"hover:bg-accent hover:cursor-pointer p-3 rounded-md"}>
                                        <div className={"flex space-x-2 items-center justify-between"}>
                                            <h4 className={"font-bold text-sm"}>{notificatiion.by}</h4>
                                            <span className={"text-sm"}>18:50h</span>
                                        </div>
                                        <p className={"text-sm"}>
                                            {notificatiion.content}
                                        </p>
                                    </div>
                                )
                            })
                        }
                        <ScrollBar orientation={"vertical"}/>
                    </DropdownMenuGroup>
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}