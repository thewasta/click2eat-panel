'use client'

import {MdDashboard} from "react-icons/md";
import {BiSolidFoodMenu} from "react-icons/bi";
import {FaBowlFood} from "react-icons/fa6";
import {FaCalendarDay} from "react-icons/fa";
import {IoPersonSharp} from "react-icons/io5";
import {HiDocumentReport} from "react-icons/hi";
import {usePathname} from "next/navigation";
import {useMediaQuery} from "@/_lib/_hooks/useMediaQuery";
import {Drawer, DrawerContent, DrawerTrigger} from "@/components/ui/drawer";
import {MenuIcon} from "lucide-react";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {Separator} from "@/components/ui/separator";
import Link from "next/link";

const menuItems = [
    {
        name: 'Panel',
        icon: <MdDashboard className="h-6"/>,
        path: '/dashboard/',
    },
    {
        name: 'Menú',
        icon: <BiSolidFoodMenu className="h-6"/>,
        path: '/dashboard/menu',
    },
    {
        name: 'Pedidos',
        icon: <FaBowlFood className="h-6"/>,
        path: '/dashboard/orders',
    },
    {
        name: 'Reservas',
        icon: <FaCalendarDay className="h-6"/>,
        path: '/dashboard/reservations',
    },
    {
        name: 'Personal',
        icon: <IoPersonSharp className="h-6"/>,
        path: '/dashboard/personal',
    },
    {
        name: 'Informes',
        icon: <HiDocumentReport className="h-6"/>,
        path: '/dashboard/reports',
    },
];
const activeClassname = 'text-red-400';
export default function SidebarComponent() {
    const isDesktop = useMediaQuery('(min-width: 768px)');

    const pathname = usePathname();
    return isDesktop ?
        (<aside
                className="col-span-1 fixed md:static top-0 w-[80%] sm:w-1/3 md:w-full h-full flex flex-col justify-between border-r">
                <div className="h-16 pl-5 flex items-center 2xl:justify-start justify-center">
                    <h1 className="uppercase font-bold tracking-[4px] cursor-default">
                        TU LOGO
                    </h1>
                </div>
                <Separator/>
                <NavigationMenu className={"hola-example"}>
                    <NavigationMenuList className={"flex-col gap-3"} aria-orientation={"vertical"}>
                        {
                            menuItems.map((item, index) => (
                                <NavigationMenuItem key={index}>
                                    <Link href={item.path} legacyBehavior passHref>
                                        <NavigationMenuLink
                                            className={`p-4 flex items-center justify-center  gap-2 hover:text-blue-600 hover:cursor-pointer transition-colors font-semibold ${pathname == item.path ? activeClassname : ''}`}
                                        >
                                            {item.icon}
                                            {item.name}
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>
                            ))
                        }
                    </NavigationMenuList>
                </NavigationMenu>
            </aside>
        )
        :
        (
            <Drawer direction={"left"}>
                <DrawerTrigger className={"z-40 absolute bottom-4 right-4 bg-primary p-3 text-2xl text-white rounded-full"}>
                    <MenuIcon/>
                </DrawerTrigger>
                <DrawerContent>
                    <aside
                        className="col-span-1 fixed md:static top-0 w-[80%] sm:w-1/3 md:w-full h-full flex flex-col justify-between">
                        <div className="h-16 pl-5 flex items-center 2xl:justify-start justify-center">
                            <h1 className="uppercase font-bold tracking-[4px] cursor-default">
                                TU LOGO
                            </h1>
                        </div>
                        <NavigationMenu className={"hola-example"}>
                            <NavigationMenuList className={"flex-col gap-3"} aria-orientation={"vertical"}>
                                {
                                    menuItems.map((item, index) => (
                                        <NavigationMenuItem key={index}>
                                            <Link href={item.path} passHref>
                                                <NavigationMenuLink
                                                    className={`text-gray-500 p-4 flex items-center justify-center  gap-2 hover:text-blue-600 hover:cursor-pointer transition-colors font-semibold ${pathname == item.path ? activeClassname : ''}`}
                                                >
                                                    {item.icon}
                                                    {item.name}
                                                </NavigationMenuLink>
                                            </Link>
                                        </NavigationMenuItem>
                                    ))
                                }
                            </NavigationMenuList>
                        </NavigationMenu>
                    </aside>
                </DrawerContent>
            </Drawer>
        );
}