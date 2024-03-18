import React from "react";

export default function Second() {

    const handleSubmit = async (_: React.MouseEvent<HTMLButtonElement>) => {
        console.log("HOLA")
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
                    El Kebab de La Esquina
                </h1>

                <div className="w-full flex flex-col">
                    <div className="flex flex-col w-full mb-2">
                        <h3 className="text-3xl font-semibold mb-3">
                            Login
                        </h3>
                        {/*<p className="text-base mb-4">¡Bienvenido otra vez!</p>*/}
                    </div>
                    <div className="w-full flex flex-col">
                        <input
                            type="email"
                            placeholder="mailexample@gmail.com"
                            className="w-full py-3 my-2 px-6 ring-1 ring-gray-300 rounded-xl placeholder-gray-600 bg-transparent transition disabled:ring-gray-200 disabled:bg-gray-100 disabled:placeholder-gray-400 invalid:ring-red-400 focus:invalid:outline-none"/>
                        <input
                            type="password"
                            placeholder="************"
                            className="w-full my-2 py-3 px-6 ring-1 ring-gray-300 rounded-xl placeholder-gray-600 bg-transparent transition disabled:ring-gray-200 disabled:bg-gray-100 disabled:placeholder-gray-400 invalid:ring-red-400 focus:invalid:outline-none"/>
                    </div>
                    <div className="w-full flex items-center justify-between">
                        <div className="w-full flex items-center">
                            <input type="checkbox" id="remember_me" className="w-4 h-4 mr-2"/>
                            <label htmlFor="remember_me" className="text-sm select-none">Recuérdame</label>
                        </div>
                        <a className="text-sm whitespace-nowrap font-medium underline underline-offset-2 cursor-pointer">¿Problema
                            para acceder?
                        </a>
                    </div>
                    <div className="flex items-center">
                        <button onClick={handleSubmit}
                                className="border bg-indigo-600 hover:bg-indigo-500 rounded w-1/2" type="button">
                            Enviar
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
