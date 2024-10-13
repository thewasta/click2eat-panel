"use client"

import {Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from "@nextui-org/react";
import {useMutation} from "@tanstack/react-query";
import {logout} from "@/app/actions/auth/login_actions";

export function NavbarProfile() {
    const mutation = useMutation({
        mutationFn: logout
    });

    const handleClick = () => {
        mutation.mutate()
    }
    return (
        <Dropdown placement={"bottom-end"}>
            <DropdownTrigger>
                <Avatar
                    isBordered
                    as="button"
                    className="transition-transform"
                    color="secondary"
                    name="Jason Hughes"
                    size="sm"
                    src="https://placehold.co/150x150"
                >
                </Avatar>
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                    <p className="font-semibold">Signed in as</p>
                    <p className="font-semibold">zoey@example.com</p>
                </DropdownItem>
                <DropdownItem key="settings">My Settings</DropdownItem>
                <DropdownItem key="team_settings">Team Settings</DropdownItem>
                <DropdownItem key="analytics">Analytics</DropdownItem>
                <DropdownItem key="system">System</DropdownItem>
                <DropdownItem key="configurations">Configurations</DropdownItem>
                <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
                <DropdownItem key="logout" color="danger" onClick={handleClick}>
                    Log Out
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    )
}