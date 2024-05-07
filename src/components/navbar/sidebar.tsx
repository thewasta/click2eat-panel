'use client'

import {MdDashboard} from "react-icons/md";
import {BiSolidFoodMenu} from "react-icons/bi";
import {FaBowlFood} from "react-icons/fa6";
import {FaCalendarDay} from "react-icons/fa";
import {IoPersonSharp} from "react-icons/io5";
import {HiDocumentReport} from "react-icons/hi";
import {LuCopyright} from "react-icons/lu";
import {useState} from "react";
import {RiCloseLine, RiMenu3Fill} from "react-icons/ri";
import {usePathname} from "next/navigation";
import Link from "next/link";
import Image from "next/image";

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
    const [activeSidebar, setActiveSidebar] = useState<boolean>(false)

    const pathname = usePathname();
    return (
        <>
            <aside
                className={`${activeSidebar ? '-left-0' : '-left-full'} transition-all ease-in col-span-1 fixed md:static top-0 w-[80%] sm:w-1/3 md:w-full h-full flex flex-col justify-between bg-white border-r border-gray-300 p-4`}>
                <div>
                    <div className="pl-5 mb-3 flex items-center 2xl:justify-start justify-center gap-3">
                        <Image src="https://placehold.co/50x50" width={50} height={50} alt={'Business Name'}/>
                        <h1 className="uppercase font-bold hidden xl:block tracking-[4px]">
                            TU LOGO
                        </h1>
                    </div>
                    <div className="flex flex-col justify-between">
                        <nav>
                            <h3 className="text-gray-400 mb-4">
                                Menú principal
                            </h3>
                            <ul>
                                {
                                    menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.path}
                                                className={`text-gray-500 p-4 flex items-center justify-center  gap-2 hover:text-blue-600 hover:cursor-pointer transition-colors font-semibold ${pathname == item.path ? activeClassname : ''}`}>
                                                {item.icon}
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))
                                }
                            </ul>
                        </nav>
                    </div>
                </div>
                <span className="p-2 text-nowrap flex items-center gap-2 text-gray-300">
                    <LuCopyright/>
                    2024 - RestaurantQR
                </span>
            </aside>
            {/*Button mymenu mobile*/}
            <button
                onClick={() => {
                    setActiveSidebar(!activeSidebar);
                }}
                className="md:hidden absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-500 p-3 text-2xl text-white rounded-full">
                {activeSidebar ? <RiCloseLine/> : <RiMenu3Fill/>}
            </button>
            {/*Content*/}
        </>
    )
}