'use client'
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {User} from "lucide-react";
import {useMutation} from "@tanstack/react-query";
import {logout} from "@/app/actions/auth/login_actions";

export function UserProfileDropdown() {
    const mutation = useMutation({
        mutationFn: logout
    });

    const handleClick = () => {
        mutation.mutate()
    }
    return (
      <DropdownMenu>
          <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                  <User />
              </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
              <DropdownMenuLabel>Perfil</DropdownMenuLabel>
              <DropdownMenuSeparator/>
              <DropdownMenuGroup>
                  <DropdownMenuItem>
                      Ajustes
                  </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator/>
              <DropdownMenuItem onClick={handleClick}>
                  Salir
              </DropdownMenuItem>
          </DropdownMenuContent>
      </DropdownMenu>
    );
}