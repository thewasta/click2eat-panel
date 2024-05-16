import {RiArrowDownSLine, RiCheckboxBlankCircleFill, RiNotification2Line, RiSearchLine} from "react-icons/ri";
import {Input} from "@/components/ui/input";
import {ThemeSwitch} from "@/components/navbar/ThemeSwitch";
import React from "react";
import {UserProfileDropdown} from "@/components/navbar/UserProfileDropdown";
import {NotificationDropdown} from "@/components/navbar/NotificationDropdown";

export function DashboardHeader() {
    return (
        <header className="flex items-center justify-between p-4 h-16 shadow-md w-full border-b">
            <form className="w-[30%] md:w-[50%]">
                <div className="relative">
                    <RiSearchLine className="absolute left-2 top-3"/>
                    <Input className="pl-8 pr-4 py-2 outline-none rounded-lg w-full"
                           placeholder="Buscar..."/>
                </div>
            </form>
            <nav className="sm:w-[70%] w-1/2 flex justify-end">
                <ul className="flex items-center gap-4">
                    <li>
                        <ThemeSwitch/>
                    </li>
                    <li>
                        {/*<a href="#" className="relative">*/}
                        {/*    <RiNotification2Line/>*/}
                        {/*    <RiCheckboxBlankCircleFill*/}
                        {/*        className="absolute -right-[1px] -top-[1px] text-[9px] text-red-500"/>*/}
                        {/*</a>*/}
                        <NotificationDropdown/>
                    </li>
                    <li>
                        <UserProfileDropdown/>
                    </li>
                </ul>
            </nav>
        </header>
    );
}