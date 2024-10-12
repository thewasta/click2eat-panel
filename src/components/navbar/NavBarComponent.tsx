"use client"

import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    NavbarMenuToggle
} from "@nextui-org/react";
import {useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import {ChevronDown} from "lucide-react";
import Link from "next/link";
import MenuItems, {type MenuItem} from "@/types/constants/MenuItems";


export default function NavBarComponent() {
    const pathname = usePathname();
    const router = useRouter()

    const handleDropDownMenuClick = (goTo: string) => {
        router.push(goTo);
    }
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

            <NavbarMenu>
                {MenuItems.map((item, index) => (
                    <MobileMenuItem key={index} item={item}/>
                ))}
            </NavbarMenu>
        </Navbar>
    )
}

const MobileMenuItem = ({item}: { item: MenuItem }) => {
    const pathname = usePathname();
    const [subMenuOpen, setSubMenuOpen] = useState(false);
    const toggleSubMenu = () => {
        setSubMenuOpen(!subMenuOpen);
    };

    return (
        <div className="">
            {item.subMenu ? (
                <>
                    <button
                        onClick={toggleSubMenu}
                        className={`flex flex-row items-center p-2 rounded-lg hover-bg-zinc-100 w-full justify-between hover:bg-zinc-100 ${
                            //@ts-ignore
                            pathname.includes(item.path) ? 'bg-zinc-100' : ''
                        }`}
                    >
                        <div className="flex flex-row space-x-4 items-center">
                            {item.icon}
                            <span className="flex">{item.name}</span>
                        </div>

                        <div className={`${subMenuOpen ? 'rotate-180' : ''} flex`}>
                            <ChevronDown/>
                        </div>
                    </button>

                    {subMenuOpen && (
                        <div className="my-2 ml-12 flex flex-col space-y-4">
                            {item.subMenuItems?.map((subItem, idx) => {
                                return (
                                    <Link
                                        key={idx}
                                        href={subItem.path}
                                        className={`${
                                            subItem.path === pathname ? 'font-bold' : ''
                                        }`}
                                    >
                                        <span>{subItem.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </>
            ) : item.path && (
                <Link
                    href={item.path}
                    className={`flex flex-row space-x-4 items-center p-2 rounded-lg hover:bg-zinc-100 ${
                        item.path === pathname ? 'bg-zinc-100' : ''
                    }`}
                >
                    {item.icon}
                    <span className="flex">{item.name}</span>
                </Link>
            )}
        </div>
    );
};