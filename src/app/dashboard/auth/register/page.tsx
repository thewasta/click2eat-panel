'use client'
import {useRouter} from "next/navigation";
import MiddleLeftSide from "@/app/components/auth/middleLeftSide";
import Link from "next/link";
import React, {useState} from "react";
import FormInputText from "@/app/components/form/FormInputText";
import Image from "next/image";
import MiddleRightSide from "@/app/components/auth/middleRigthSide";
import {MdEmail, MdLock} from "react-icons/md";

export default function AuthRegister() {
    const router = useRouter();
    const [businessName, setBusinessName] = useState<string>('');
    const handleBusinessNameChange = (childData: any) => {
        console.log(childData)
        // setBusinessName(childData);
    }
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
            <MiddleRightSide>
                <div className="flex flex-col w-full mb-2">
                    <h3 className="text-3xl font-semibold mb-3 text-[#060606]">
                        Crear cuenta
                    </h3>
                    <p className="text-base text-gray-600 mb-4">
                        Crea una cuenta para empezar a gestionar tu negocio
                    </p>
                </div>
                <div className="w-full flex flex-col gap-3">
                    <div className="w-full flex gap-3 flex-col">
                        <FormInputText
                            inputType="text"
                            placeholder="Nombre de empresa"
                            onChange={handleBusinessNameChange}
                        />
                        <FormInputText
                            icon={<MdEmail/>}
                            onChange={handleBusinessNameChange}
                            placeholder={"Correo electrónico"}
                            inputType={"text"}
                        />
                        <FormInputText
                            icon={<MdLock/>}
                            inputType="password"
                            placeholder="Contraseña"
                            onChange={handleBusinessNameChange}
                        />
                    </div>
                    <div className="form-control">
                        <label className="label cursor-pointer justify-start gap-3">
                            <input type="checkbox" defaultChecked className="checkbox"/>
                            <span className="label-text">He leído y acepto los términos y condiciones</span>
                        </label>
                    </div>
                    <div className="flex items-center justify-center">
                        <button
                            className="bg-indigo-600 hover:bg-indigo-500 rounded w-1/2 p-3 text-white font-bold mt-4"
                            type="button">
                            Acceder
                        </button>
                    </div>
                </div>
                <div className="w-full flex items-center justify-center">
                    <p className="text-sm font-normal text-[#060606]">¿Ya tienes cuenta?
                        <Link href="/dashboard/auth/login"
                              className="ml-1 font-semibold underline underline-offset-2 cursor-pointer">
                            Inicia sesión
                        </Link>
                    </p>
                </div>
            </MiddleRightSide>
        </>
    );
}