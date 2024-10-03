import {ThemeSwitch} from "@/components/navbar/ThemeSwitch";
import React from "react";
import {UserProfileDropdown} from "@/components/navbar/UserProfileDropdown";
import {NotificationDropdown} from "@/components/navbar/NotificationDropdown";

export function DashboardHeader() {
    return (
        <header className="relative p-4 h-16 shadow-md w-full border-b">
            <nav className="absolute right-0 top-1/2 -translate-y-1/2">
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