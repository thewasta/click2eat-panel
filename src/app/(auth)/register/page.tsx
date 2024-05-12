'use client'
import Image from "next/image";
import MiddleLeftSide from "@/components/auth/middleLeftSide";
import React from "react";
import MiddleRightSide from "@/components/auth/middleRigthSide";
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
            <MiddleLeftSide>
                <div className="absolute hidden md:flex top-[20%] left-[10%] flex-col">
                    <h1 className="text-4xl text-white font-extrabold my-4">
                        Click2Eat
                    </h1>
                    <p className="text-xl text-white font-normal">
                        Sistema gestión para tu negocio
                    </p>
                </div>
                <Image
                    src="https://placehold.co/750x800"
                    alt=""
                    width={750}
                    height={800}
                    className="w-full h-full object-cover"
                />
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
                    <p className="text-sm font-normal">¿Ya tienes cuenta?
                        <Link href={"/login"}
                              className="ml-1 font-semibold underline underline-offset-2 cursor-pointer">
                            Incia sesión
                        </Link>
                    </p>
                </div>
            </MiddleRightSide>
        </>
    );
}