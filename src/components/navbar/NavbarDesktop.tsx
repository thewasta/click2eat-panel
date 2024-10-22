"use client"

import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger,} from "@nextui-org/dropdown";
import {Button} from "@nextui-org/button";
import {NavbarBrand, NavbarContent, NavbarItem} from "@nextui-org/navbar";
import MenuItems from "@/types/constants/MenuItems";
import {ChevronDown} from "lucide-react";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";

export function NavbarDesktop() {
    const pathname = usePathname();
    const router = useRouter()

    const handleDropDownMenuClick = (goTo: string) => {
        router.push(goTo);
    }
    return (
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
            <NavbarBrand>
                <p className="font-bold text-inherit">ACME</p>
            </NavbarBrand>
            {
                MenuItems.map((item, index) => {
                    if (item.subMenu && item.subMenuItems) {
                        return (
                            <Dropdown key={`${item.name}-${index}`}>
                                <DropdownTrigger>
                                    <Button
                                        disableRipple
                                        className="p-0 bg-transparent data-[hover=true]:bg-transparent"
                                        radius="sm"
                                        endContent={<ChevronDown/>}
                                        variant="light"
                                    >{item.name}</Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    className="w-[340px]"
                                    itemClasses={{
                                        base: "gap-4",
                                    }}>
                                    {item.subMenuItems.map((sm, subIndex) => (
                                        <DropdownItem
                                            textValue={sm.name}
                                            onClick={() => handleDropDownMenuClick(sm.path)}
                                            key={`${item.name}-${sm.name}-${subIndex}`}
                                            startContent={sm.icon}
                                            description={sm.description}
                                        >
                                            {
                                                sm.path &&
                                                <Link color="foreground" href={sm.path}>{sm.name}</Link>
                                            }
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </Dropdown>
                        )
                    }
                    if (item.path)
                        return (
                            <NavbarItem key={index} isActive={pathname === item.path}>
                                <Link
                                    color="foreground"
                                    href={item.path}
                                >
                                    {item.name}
                                </Link>
                            </NavbarItem>
                        );
                })
            }
        </NavbarContent>
    );
}