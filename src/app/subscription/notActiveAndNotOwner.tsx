'use client'
import {Button} from "@/components/ui/button";
import {useMutation} from "@tanstack/react-query";
import {logout} from "@/app/actions/auth/login_actions";
import {useState} from "react";

export function NotActiveAndNotOwner() {
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
    const mutation = useMutation({
        mutationFn: logout,
    })
    const handleClick = () => {
        setButtonDisabled(true);
        mutation.mutate()
    }
    return (
        <div
            className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-md text-center">
                <div className="mx-auto h-12 w-12 text-primary"/>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    Tu suscripción ha expirado
                </h1>
                <p className="mt-4 text-muted-foreground">
                    Lo sentimos, pero tu suscripción a nuestros servicios ha expirado. Por favor, comunícate con el
                    propietario de la cuenta para renovar tu suscripción y continuar disfrutando de todas las
                    funcionalidades.
                </p>
                <div className="mt-6">
                    <Button onClick={handleClick} disabled={buttonDisabled}
                    >
                        Cerrar Sesión
                    </Button>
                </div>
            </div>
        </div>
    )
}