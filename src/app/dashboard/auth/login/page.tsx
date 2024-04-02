'use client'
import React, {useState} from "react";
import {login} from '@/_request/auth/auth'
import {useRouter} from "next/navigation";
import {nonSession} from "@/_lib/api/ApiManager";

export default function Second() {

    const [email, setEmail] = useState<string>('joseluji2235');
    const [password, setPassword] = useState<string>('Masoki13');
    const [loginError, setLoginError] = useState<string | null>(null)
    const router = useRouter();
    const submit = async () => {
        try {
            const r = await nonSession.post('auth/login', {
                username: email,
                password
            });
            router.push('/dashboard/home');
        } catch (error) {
            setLoginError('Something went wrong!');
        }
    }
    return (
        <div className="w-full h-screen flex items-start">
            <div className="sm:w-1/2 hidden relative h-full sm:flex flex-col">
                <div className="absolute hidden md:flex top-[20%] left-[10%] flex-col">
                    <h1 className="text-4xl text-white font-extrabold my-4">
                        Restaurante QR
                    </h1>
                    <p className="text-xl text-white font-normal">
                        Sistema gestión para tu negocio
                    </p>

                </div>
                <img
                    src="https://placehold.co/750x800"
                    alt=""
                    width={750}
                    height={800}
                    className="w-full h-full object-cover"
                />
            </div>
            {/*bg-[#E0E0E0]*/}
            <div className="sm:w-3/4 md:w-1/2 w-full h-full bg-[#F5F5F5] flex flex-col p-20 justify-between">

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
                            placeholder="mailexample@gmail.com"
                            onChange={event => setEmail(event.target.value)}
                            className="w-full py-3 my-2 px-6 ring-1 ring-gray-300 rounded-xl placeholder-gray-600 bg-transparent transition disabled:ring-gray-200 disabled:bg-gray-100 disabled:placeholder-gray-400 invalid:ring-red-400 focus:invalid:outline-none"/>
                        {loginError === null ? null : <p className="text-xs text-red-500 ml-2">{loginError}</p>}
                        <input
                            type="password"
                            placeholder="************"
                            onChange={event => setPassword(event.target.value)}
                            className="w-full my-2 py-3 px-6 ring-1 ring-gray-300 rounded-xl placeholder-gray-600 bg-transparent transition disabled:ring-gray-200 disabled:bg-gray-100 disabled:placeholder-gray-400 invalid:ring-red-400 focus:invalid:outline-none"/>
                    </div>
                    <div className="w-full flex items-center justify-between">
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
                        <a href="#" className="ml-1 font-semibold underline underline-offset-2 cursor-pointer">
                            Contáctanos
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
