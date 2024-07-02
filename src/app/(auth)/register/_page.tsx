'use client'
import MiddleLeftSide from "@/components/auth/middleLeftSide";
import React, {Suspense} from "react";
import MiddleRightSide from "@/components/auth/middleRigthSide";
import RegisterBusiness from "@/components/auth/RegisterBusiness";
import RegisterOwner from "@/components/auth/RegisterOwner";
import {useRegisterAccountContext} from "@/lib/context/auth/register-account-context";
import {Loader} from "lucide-react";

export default function RegisterPage() {
    const {step} = useRegisterAccountContext();

    const formElements = [
        <RegisterBusiness key={1}/>,
        <RegisterOwner key={2}/>
    ];

    return (
        <>
            <MiddleLeftSide>
                <Suspense fallback={<Loader/>}>
                    <img
                        alt={"Main login image"}
                        src="/assets/auth_main.avif"
                        width={852}
                        height={520}
                        className="w-full h-full object-cover"
                    />
                </Suspense>
            </MiddleLeftSide>
            <MiddleRightSide customClass="justify-center">
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
                    <p className="text-sm font-normal">¿No eres propietario/a?</p>
                </div>
            </MiddleRightSide>
        </>
    );
}