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
import {useMutation} from "@tanstack/react-query";

export function UserProfileDropdown() {
    const router = useRouter()
    const mutation = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            router.refresh();
        }
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