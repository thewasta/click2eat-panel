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
import {logout} from "@/_request/auth/auth";
import {useRouter} from "next/navigation";

export function UserProfileDropdown() {
    const router = useRouter()
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
              <DropdownMenuItem onClick={async () => {
                  await logout()
                  router.replace('/');
              }}>
                  Salir
              </DropdownMenuItem>
          </DropdownMenuContent>
      </DropdownMenu>
    );
}