"use client"

import {Navbar, NavbarBrand, NavbarContent, NavbarMenuToggle} from "@nextui-org/navbar";
import {NavbarProfile} from "@/components/navbar/NavbarProfile";
import {NavbarMobile} from "@/components/navbar/NavbarMobile";
import {NavbarDesktop} from "@/components/navbar/NavbarDesktop";
import {NavbarNotifications} from "@/components/navbar/NavbarNotifications";
import {ThemeSwitch} from "@/components/navbar/ThemeSwitch";

export default function NavBarComponent() {
    return (
        <Navbar disableAnimation isBordered>
            <NavbarContent className="sm:hidden" justify="start">
                <NavbarMenuToggle/>
            </NavbarContent>
            <NavbarContent className="sm:hidden pr-3" justify="center">
                <NavbarBrand>
                    <p className="font-bold text-inherit">ACME</p>
                </NavbarBrand>
            </NavbarContent>
            <NavbarDesktop/>
            <NavbarContent as={"div"} justify={"end"}>
                <NavbarNotifications/>
                <NavbarProfile/>
                <ThemeSwitch/>
            </NavbarContent>
            <NavbarMobile/>
        </Navbar>
    )
}

