'use client'
import {MdDashboard} from "react-icons/md";
import {RiCloseLine, RiMenu3Fill} from "react-icons/ri";
import {useState} from "react";

export default function HomeSecond() {
    const [activeSidebar, setActiveSidebar] = useState<boolean>(false)
    const responsiveBreakpoint: string = "bg-violet-600 sm:bg-yellow-500 md:bg-red-600 lg:bg-green-300 xl:bg-blue-600 2xl:bg-red-800";

    return (
        <div className="min-h-screen grid md:grid-cols-[25%_auto] lg:grid-cols-[12%_auto] grid-cols-1">
            <aside
                className={`${activeSidebar? '-left-0'  : '-left-full'} fixed top-0 w-[70%] sm:w-1/3 md:w-full md:static h-screen flex flex-col items-start justify-start gap-8 py-8 px-4 shadow-2xl bg-[#22222c]`}>
                <div className="flex gap-2 items-center justify-center">
                    <h2 className="text-2xl text-nowrap text-white uppercase font-bold">
                        {/*MAX 7 CHAR*/}
                        RQR.
                    </h2>
                </div>
                <div className="w-full">
                    <nav className="text-white">
                        <ul className="list-none p-0 flex flex-col gap-4 justify-center">
                            <li className="">
                                <a href="#"
                                   className="flex items-center gap-3 text-lg text-center font-medium px-8 py-2 hover:bg-[#8c4af2] rounded-full">
                                    <MdDashboard/>
                                    Panel
                                </a>
                            </li>
                            <li className="">
                                <a href="#"
                                   className="flex items-center gap-3 text-lg text-center font-medium px-8 py-2 hover:bg-[#8c4af2] rounded-full">
                                    <MdDashboard/>
                                    Panel
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </aside>
            <button
                onClick={() => {
                    setActiveSidebar(!activeSidebar)
                }}
                className="md:hidden absolute text-white bottom-4 right-4 rounded-full bg-[#22222c] p-4">
                {activeSidebar ? <RiCloseLine/> : <RiMenu3Fill/>}
            </button>
            {/*"bg-[#3C2649]*/}
            <div className={responsiveBreakpoint + " p-4"}>
                HOLA
            </div>
        </div>
    );
}