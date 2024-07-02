import React from "react";
import RegisterBusinessForm from "@/components/auth/RegisterBusiness";

export default async function RegisterBusinessPage() {
    return (
        <>
            <div className="flex flex-col w-full mb-7">
                <h3 className="text-3xl font-semibold mb-3">
                    Registrar empresa
                </h3>
                <p className="text-xs text-muted-foreground">
                    Vamos a registrar tu primera empresa, para esto vamos a necesitar
                    que rellenes el siguiente formulario.
                </p>
                <p className="text-xs text-muted-foreground">
                    Si no eres propietario/a, solícita mail de invitación.
                </p>
            </div>
            <div className="w-full flex flex-col gap-3 items-start">
                <div className="form-control w-full">
                    <RegisterBusinessForm/>
                </div>
            </div>
        </>
    )
}