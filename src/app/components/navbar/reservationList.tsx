import {RiArrowDownSLine, RiCheckboxBlankCircleFill, RiSettings2Fill} from "react-icons/ri";

export default function ReservationComponent() {
    return (
        <div className="col-span-1 flex flex-col gap-7 shadow bg-white rounded-tl-2xl rounded-bl-2xl p-6">
            {/*Header*/}
            <div className="flex flex-row items-center justify-between">
                <h3 className="font-semibold text-lg">
                    Reservas
                </h3>
                <button className="text-gray-400 rounded-md border py-2 px-4 flex items-center gap-2">
                    Hoy
                    <RiArrowDownSLine/>
                </button>
            </div>
            {/*List Reservations*/}
            <div>
                <ul className="flex flex-col gap-2">
                    <li className="flex justify-start items-center gap-8">
                        <span className="text-sm font-semibold text-gray-500">11:00</span>
                        <span
                            className="text-lg flex items-center justify-between w-full font-bold text-gray-600 border py-1 px-3 rounded shadow-sm">
                            Nombre Reserva +3
                            <RiSettings2Fill className="text-gray-400 hover:cursor-pointer"/>
                        </span>
                    </li>
                    <li className="flex justify-between items-center gap-8">
                        <RiCheckboxBlankCircleFill className="text-gray-300 text-xs ml-2"/>
                    </li>
                    <li className="flex justify-between items-center gap-8">
                        <RiCheckboxBlankCircleFill className="text-blue-600 text-xs ml-2"/>
                        <span
                            className="text-lg flex items-center justify-between w-full font-bold text-gray-600 border py-1 px-3 rounded shadow-sm">
                                        Nombre Reserva +3
                                        <RiSettings2Fill className="text-gray-400 hover:cursor-pointer"/>
                                    </span>
                    </li>
                    <li className="flex justify-start items-center gap-8">
                        <span className="text-sm font-semibold text-gray-500">12:00</span>
                        <span
                            className="text-lg flex items-center justify-between w-full font-bold text-gray-600 border py-1 px-3 rounded shadow-sm">
                                        Nombre Reserva +3
                                        <RiSettings2Fill className="text-gray-400 hover:cursor-pointer"/>
                                    </span>
                    </li>
                    <li className="flex justify-between items-center gap-8">
                        <RiCheckboxBlankCircleFill className="text-gray-300 text-xs ml-2"/>
                    </li>
                    <li className="flex justify-between items-center gap-8">
                        <RiCheckboxBlankCircleFill className="text-gray-300 text-xs ml-2"/>
                    </li>
                    <li className="flex justify-start items-center gap-8">
                        <span className="text-sm font-semibold text-gray-500">13:00</span>
                        <span
                            className="text-lg flex items-center justify-between w-full font-bold text-gray-600 border py-1 px-3 rounded shadow-sm">
                            Nombre Reserva +4
                            <RiSettings2Fill className="text-gray-400 hover:cursor-pointer"/>
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    );
}