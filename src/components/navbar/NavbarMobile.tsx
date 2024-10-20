import MenuItems, {type MenuItem} from "@/types/constants/MenuItems";
import {NavbarMenu} from "@nextui-org/navbar";
import {usePathname} from "next/navigation";
import {useState} from "react";
import {ChevronDown} from "lucide-react";
import Link from "next/link";

export function NavbarMobile() {
    return (
        <NavbarMenu>
            {MenuItems.map((item, index) => (
                <MobileMenuItem key={index} item={item}/>
            ))}
        </NavbarMenu>
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
                        className={`flex flex-row items-center p-2 rounded-lg hover-bg-zinc-100 dark:hover:bg-zinc-600 w-full justify-between hover:bg-zinc-100 ${
                            //@ts-ignore
                            pathname.includes(item.path) ? 'bg-zinc-100 dark:hover:bg-zinc-600' : ''
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
                    className={`flex flex-row space-x-4 items-center p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-600 ${
                        item.path === pathname ? 'bg-zinc-100 dark:bg-zinc-600' : ''
                    }`}
                >
                    {item.icon}
                    <span className="flex">{item.name}</span>
                </Link>
            )}
        </div>
    );
};
