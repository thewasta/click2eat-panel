'use client'
import React from "react";
import RegisterBusiness from "@/components/auth/RegisterBusiness";
import RegisterOwner from "@/components/auth/RegisterOwner";
import Link from "next/link";
import {useRegisterAccountContext} from "@/lib/context/auth/register-account-context";

export default function RegisterPage() {
    const {step} = useRegisterAccountContext();

    const formElements = [
        <RegisterBusiness key={1}/>,
        <RegisterOwner key={2}/>
    ];

    return (
        <>
            <div className="flex flex-col w-full mb-2">
                <h3 className="text-3xl font-semibold mb-3">
                    Crear cuenta
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                    Crea una cuenta para empezar a gestionar tu negocio
                </p>
            </div>
            <div className="w-full flex flex-col gap-3 items-start">
                <div className="form-control w-full">
                    {
                        formElements[step]
                    }
                </div>
            </div>
            <div className="w-full flex items-center justify-center mt-4">
                <p className="text-sm font-normal">¿Ya tienes cuenta?
                    <Link href={"/login"}
                          className="ml-1 font-semibold underline underline-offset-2 cursor-pointer">
                        Incia sesión
                    </Link>
                </p>
            </div>
        </>
    );
}