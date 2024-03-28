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

export default function SidebarComponent() {
    const [activeSidebar, setActiveSidebar] = useState<boolean>(false)

    return (
        <>
            <aside
                className={`${activeSidebar ? '-left-0' : '-left-full'} transition-all ease-in col-span-1 fixed md:static top-0 w-[80%] sm:w-1/3 md:w-full h-full flex flex-col justify-between bg-white border-r border-gray-300 p-4`}>
                <div>
                    <div className="pl-5 mb-3 flex items-center 2xl:justify-start justify-center gap-3">
                        <img src="https://placehold.co/50x50" alt=""/>
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
                                <li>
                                    <a className="text-gray-500 p-4 flex items-center justify-center gap-2 hover:text-blue-600 hover:cursor-pointer transition-colors font-semibold">
                                        <MdDashboard className="h-6"/>
                                        Panel
                                    </a>
                                </li>
                                <li>
                                    <a className="text-gray-500 p-4 flex items-center justify-center  gap-2 hover:text-blue-600 hover:cursor-pointer transition-colors font-semibold">
                                        <BiSolidFoodMenu className="h-6"/>
                                        Menú
                                    </a>
                                </li>
                                <li>
                                    <a className="text-gray-500 p-4 flex items-center justify-center  gap-2 hover:text-blue-600 hover:cursor-pointer transition-colors font-semibold">
                                        <FaBowlFood className="h-6"/>
                                        Pedidos
                                    </a>
                                </li>
                                <li>
                                    <a className="text-gray-500 p-4 flex items-center justify-center  gap-2 hover:text-blue-600 hover:cursor-pointer transition-colors font-semibold">
                                        <FaCalendarDay className="h-6"/>
                                        Reservas
                                    </a>
                                </li>
                                <li>
                                    <a className="text-gray-500 p-4 flex items-center justify-center gap-2 hover:text-blue-600 hover:cursor-pointer transition-colors font-semibold">
                                        <IoPersonSharp className="h-6"/>
                                        Personal
                                    </a>
                                </li>
                                <li>
                                    <a className="text-gray-500 p-4 flex items-center justify-center gap-2 hover:text-blue-600 hover:cursor-pointer transition-colors font-semibold">
                                        <HiDocumentReport className="h-6"/>
                                        Informes
                                    </a>
                                </li>
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