'use client'

import {MdDashboard} from "react-icons/md";
import {BiSolidFoodMenu} from "react-icons/bi";
import {FaBowlFood} from "react-icons/fa6";
import {FaCalendarDay} from "react-icons/fa";
import {IoPersonSharp} from "react-icons/io5";
import {HiDocumentReport} from "react-icons/hi";
import {usePathname} from "next/navigation";
import {useMediaQuery} from "@/_lib/_hooks/useMediaQuery";
import {MenuIcon} from "lucide-react";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {Separator} from "@/components/ui/separator";
import Link from "next/link";
import {ReactNode} from "react";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";

type SubMenu = Menu & {
    icon: null
}

type Menu = {
    name: string;
    icon: ReactNode
    path: string;
    subMenu?: SubMenu[]
}
const menuItems: Menu[] = [
    {
        name: 'Panel',
        icon: <MdDashboard className="h-6"/>,
        path: '/dashboard/',
    },
    {
        name: 'Menú',
        icon: <BiSolidFoodMenu className="h-6"/>,
        path: '/dashboard/products',
        subMenu: [
            {
                name: 'Productos',
                icon: null,
                path: '/dashboard/products'
            },
            {
                name: 'Categorías',
                icon: null,
                path: '/dashboard/categories'
            },
            // {
            //     name: 'Ingredientes',
            //     icon: null,
            //     path: '/dashboard/ingredients'
            // },
        ]
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

export default function SidebarComponent() {
    const isDesktop = useMediaQuery('(min-width: 768px)');

    const pathname = usePathname();
    const navigationMenu = () => (
        <NavigationMenu>
            <NavigationMenuList>
                <Accordion type={"single"} collapsible>
                    {
                        menuItems.map((menu, index) => {
                            if (menu.subMenu) {
                                return (
                                    <AccordionItem value={menu.name} key={index} className={"border-b-0"}>
                                        <AccordionTrigger
                                            className={'justify-center gap-3'}>{menu.name}</AccordionTrigger>
                                        <AccordionContent>
                                            {menu.subMenu.map((subMenuItem, index) => (
                                                <NavigationMenuItem key={index}>
                                                    <Link href={subMenuItem.path} legacyBehavior passHref>
                                                        <NavigationMenuLink
                                                            className={`p-4 flex items-center justify-center  gap-2 hover:text-primary hover:cursor-pointer transition-colors font-semibold ${pathname == subMenuItem.path ? 'text-primary' : ''}`}
                                                        >
                                                            {subMenuItem.icon}
                                                            {subMenuItem.name}
                                                        </NavigationMenuLink>
                                                    </Link>
                                                </NavigationMenuItem>
                                            ))}
                                        </AccordionContent>
                                    </AccordionItem>
                                );
                            }
                            return (
                                <NavigationMenuItem key={index}>
                                    <Link href={menu.path} legacyBehavior passHref>
                                        <NavigationMenuLink
                                            className={`py-4 flex items-center justify-center  gap-2 hover:text-primary hover:cursor-pointer transition-colors font-semibold ${pathname == menu.path ? 'text-primary' : ''}`}
                                        >
                                            {menu.name}
                                            {menu.icon}
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>
                            );
                        })
                    }
                </Accordion>
            </NavigationMenuList>
        </NavigationMenu>
    );
    return isDesktop ?
        (
            <aside
                className="col-span-1 fixed md:static top-0 w-[80%] sm:w-1/3 md:w-full h-full flex flex-col justify-between border-r">
                <div className="h-16 pl-5 flex items-center 2xl:justify-start justify-center">
                    <h1 className="uppercase font-bold tracking-[4px] cursor-default">
                        TU LOGO
                    </h1>
                </div>
                <Separator/>
                {
                    navigationMenu()
                }
            </aside>
        )
        :
        (
            <Sheet>
                <SheetTrigger asChild
                              className={"z-40 absolute bottom-4 right-4 bg-primary p-3 text-2xl text-white rounded-full hover:bg-primary hover:text-white"}>
                    <Button variant={'ghost'}>
                        <MenuIcon/>
                    </Button>
                </SheetTrigger>
                <SheetContent className={'col-span-1 sm:w-1/3 md:w-full h-full flex flex-col justify-between'}>
                    <SheetHeader>
                        <SheetTitle>
                            TU LOGO
                        </SheetTitle>
                        <SheetDescription>
                            [COMPANY_NAME]
                        </SheetDescription>
                    </SheetHeader>
                    {
                        navigationMenu()
                    }
                </SheetContent>
            </Sheet>
        );
}