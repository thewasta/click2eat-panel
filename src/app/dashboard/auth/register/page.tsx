'use client'
import {useRouter} from "next/navigation";
import MiddleLeftSide from "@/app/components/auth/middleLeftSide";
import Link from "next/link";
import React, {useState} from "react";
import FormInputText from "@/app/components/form/FormInputText";
import Image from "next/image";
import MiddleRightSide from "@/app/components/auth/middleRigthSide";
import {MdEmail, MdLock} from "react-icons/md";
import {register} from "@/_request/auth/auth";

interface FormInputProps {
    name: string;
    password: string;
    email: string;
}

export default function AuthRegister() {
    const router = useRouter();
    const [formError, setFormError] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormInputProps>({
        name: '',
        password: '',
        email: ''
    });

    function handle(e: React.ChangeEvent<HTMLInputElement>) {
        const newFormData = {...formData};
        newFormData[e.target.name as keyof FormInputProps] = e.target.value;
        setFormData(newFormData);
    }

    const submit = async () => {
        try {
            await register('', '', '', '', '');
            router.push('/dashboard/home');
        } catch (error) {
            //@ts-ignore
            setFormError(error.description);
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
                        <div className="flex gap-3">
                            <FormInputText
                                name={"name"}
                                inputType="text"
                                placeholder="Nombre"
                                labelClassName="w-1/2"
                                onChange={handle}
                            />
                            <FormInputText
                                name={"lastName"}
                                inputType="text"
                                placeholder="Apellido"
                                labelClassName="w-1/2"
                                onChange={handle}
                            />
                        </div>
                        <div className="flex justify-evenly">
                            <FormInputText
                                name={"businessName"}
                                inputType="text"
                                labelClassName="w-1/2"
                                placeholder="Nombre de empresa"
                                onChange={handle}
                            />
                            <FormInputText
                                name={"email"}
                                icon={<MdEmail/>}
                                onChange={handle}
                                labelClassName="w-1/2"
                                placeholder={"Correo electrónico"}
                                inputType={"text"}
                            />
                        </div>
                        <div className="flex justify-evenly">
                            <FormInputText
                                name={"password"}
                                icon={<MdLock/>}
                                inputType="password"
                                labelClassName="w-1/2"
                                placeholder="Contraseña"
                                onChange={handle}
                            />
                            <FormInputText
                                name={"confirmPassword"}
                                icon={<MdLock/>}
                                inputType="password"
                                labelClassName="w-1/2"
                                placeholder="Confirmar contraseña"
                                onChange={handle}/>
                        </div>
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
                            onClick={submit}
                            type="button">
                            Registrarse
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