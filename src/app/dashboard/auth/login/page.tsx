'use client'
import React, {useState} from "react";
import {login} from '@/_request/auth/auth'
import {useRouter} from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import MiddleLeftSide from "@/app/components/auth/middleLeftSide";
import MiddleRightSide from "@/app/components/auth/middleRigthSide";

interface FormInputProps {
    name: string;
    password: string;
}

export default function AuthLogin() {
    const [loginError, setLoginError] = useState<string | null>(null)
    const router = useRouter();
    const [formData, setFormData] = useState<FormInputProps>({
        name: '',
        password: ''
    });

    function handle(e: React.ChangeEvent<HTMLInputElement>) {
        const newFormData = {...formData};
        newFormData[e.target.name as keyof FormInputProps] = e.target.value;
        setFormData(newFormData);
    }
    const submit = async () => {
        try {
            await login(formData.name, formData.password);
            router.push('/dashboard/home');
        } catch (error) {
            setLoginError('Something went wrong!');
        }
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
            {/*bg-[#E0E0E0]*/}
            <MiddleRightSide>
                <h1 className="text-xl font-semibold text-[#060606]">
                    [Nombre Empresa]
                </h1>
                <div className="w-full flex flex-col">
                    <div className="flex flex-col w-full mb-2">
                        <h3 className="text-3xl font-semibold mb-3">
                            Iniciar Sesión
                        </h3>
                        <p className="text-base text-gray-600 mb-4">¡Bienvenido otra vez!</p>
                    </div>
                    <div className="w-full flex flex-col">
                        <input
                            type="text"
                            name={"name"}
                            placeholder="mailexample@gmail.com"
                            onChange={event => handle(event)}
                            className="w-full py-3 my-2 px-6 ring-1 ring-gray-300 rounded-xl placeholder-gray-600 bg-transparent transition disabled:ring-gray-200 disabled:bg-gray-100 disabled:placeholder-gray-400 invalid:ring-red-400 focus:invalid:outline-none"/>
                        {loginError === null ? null : <p className="text-xs text-red-500 ml-2">{loginError}</p>}
                        <input
                            type="password"
                            name={"password"}
                            placeholder="************"
                            onChange={event => handle(event)}
                            className="w-full my-2 py-3 px-6 ring-1 ring-gray-300 rounded-xl placeholder-gray-600 bg-transparent transition disabled:ring-gray-200 disabled:bg-gray-100 disabled:placeholder-gray-400 invalid:ring-red-400 focus:invalid:outline-none"/>
                    </div>
                    <div className="w-full flex items-center gap-1 justify-between">
                        <div className="w-full flex items-center">
                            <input type="checkbox" id="remember_me" className="w-4 h-4 mr-2"/>
                            <label htmlFor="remember_me"
                                   className="text-sm select-none cursor-pointer">Recuérdame</label>
                        </div>
                        <a className="text-sm whitespace-nowrap font-medium underline underline-offset-2 cursor-pointer">¿Problema
                            para acceder?
                        </a>
                    </div>
                    <div className="flex items-center justify-center">
                        <button
                            onClick={submit}
                            className="bg-indigo-600 hover:bg-indigo-500 rounded w-1/2 p-3 text-white font-bold mt-4"
                            type="button">
                            Acceder
                        </button>
                    </div>
                </div>
                <div className="w-full flex items-center justify-center">
                    <p className="text-sm font-normal text-[#060606]">¿No tienes cuenta?
                        <Link href="/dashboard/auth/register"
                              className="ml-1 font-semibold underline underline-offset-2 cursor-pointer">
                            Registrate
                        </Link>
                    </p>
                </div>
            </MiddleRightSide>
        </>
    );
}
