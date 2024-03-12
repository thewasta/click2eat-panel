import SidebarComponent from "@/app/components/navbar/sidebar";
import {
    RiArrowDownSLine,
    RiCheckboxBlankCircleFill,
    RiNotification2Line,
    RiSearchLine
} from "react-icons/ri";
import ReservationComponent from "@/app/components/navbar/reservationList";

export default function HomeDashboard() {
    const responsiveBreakpoint: string = "sm:bg-indigo-500 md:bg-red-600 lg:bg-green-300 xl:bg-blue-600 2xl:bg-red-800 bg-violet-600";
    return (
        <div className={"min-h-screen grid grid-cols-1 md:grid-cols-5 lg:grid-cols-7"}>
            <SidebarComponent/>
            <div
                className={"lg:col-span-6 md:col-span-4 col-span-1 md:grid-cols-3 bg-gray-100"}>
                {/* Header   */}
                <header className="bg-white flex items-center justify-between p-4 shadow-md w-full">
                    <form className="sm:w-[30%] w-1/2">
                        <div className="relative">
                            <RiSearchLine className="absolute left-2 top-3"/>
                            <input className="pl-8 pr-4 py-2 outline-none rounded-lg w-full bg-gray-100"
                                   placeholder="Buscar..."/>
                        </div>
                    </form>
                    <nav className="sm:w-[70%] w-1/2 flex justify-end">
                        <ul className="flex items-center gap-4">
                            <li>
                                <a href="#" className="relative">
                                    <RiNotification2Line/>
                                    <RiCheckboxBlankCircleFill
                                        className="absolute -right-[1px] -top-[1px] text-[9px] text-red-500"/>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center gap-2">
                                    [USERNAME]
                                    <RiArrowDownSLine/>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </header>
                {/*Dashboard content*/}
                <div className="grid grid-cols-3 p-12 pr-0 gap-2 bg-gray-100">
                    <div className="col-span-2">
                        <span className="font-bold text-xl">
                            Buenos días, [USERNAME].
                        </span>
                        <p className="text-gray-500 text-sm">
                            Esto es lo que está sucediendo hoy en <span className="underline">[Nombre tienda]</span>
                        </p>
                        <div className="grid grid-cols-3">
                        </div>
                    </div>
                    <ReservationComponent/>
                </div>
            </div>
        </div>
    )
}