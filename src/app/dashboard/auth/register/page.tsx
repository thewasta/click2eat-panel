'use client'
import Image from "next/image";
import MiddleLeftSide from "@/app/components/auth/middleLeftSide";
import React, {useCallback, useState} from "react";
import MiddleRightSide from "@/app/components/auth/middleRigthSide";
import RegisterBusiness, {RegisterBusinessData} from "@/app/components/auth/RegisterBusiness";
import RegisterOwner, {RegisterOwnerData} from "@/app/components/auth/RegisterOwner";
import Link from "next/link";
import {register} from "@/_request/auth/auth";
import * as localforage from "localforage";

export default function RegisterPage() {
    const [data, setData] = useState<RegisterOwnerData | RegisterBusinessData>({
        name: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [formHasError, setFormHasError] = useState<boolean>(false);

    const [formMessageError, setFormMessageError] =
        useState<string>('* Por favor, rellena todos los campos del formulario')
    const useCall = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setData({
            ...data,
            [name]: value
        });
    }, [data]);

    const validateForm = () => {
        const ownerData = data as RegisterOwnerData;
        const businessData = data as RegisterBusinessData;

        if (ownerData.password !== ownerData.confirmPassword) {
            setFormMessageError('* Las contraseñas no coinciden');
            return true;
        }
        if (ownerData.password.length < 8) {
            setFormMessageError('* La contraseña debe tener al menos 8 caracteres');
            return true;
        }

        return !businessData.businessName || !businessData.document || !businessData.address ||
            !businessData.postalCode || !businessData.province || !businessData.town || !businessData.country ||
            !ownerData.name || !ownerData.lastName || !ownerData.username || !ownerData.email || !ownerData.password ||
            !ownerData.confirmPassword;

    };
    const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validateForm()) {
            setFormHasError(true);
            return;
        }
        setFormHasError(false);
        const fcmToken = await localforage.getItem('fcmToken');
        const ownerData = data as RegisterOwnerData;
        const businessData = data as RegisterBusinessData;
        const owner: RegisterOwnerData = {
            name: ownerData.name,
            lastName: ownerData.lastName,
            username: ownerData.username,
            email: ownerData.email,
            password: ownerData.password,
            confirmPassword: ownerData.confirmPassword
        }
        const business: RegisterBusinessData = {
            businessName: businessData.businessName,
            document: businessData.document,
            address: businessData.address,
            postalCode: businessData.postalCode,
            province: businessData.province,
            town: businessData.town,
            country: businessData.country
        }
        try {
            await register(business, owner, fcmToken as string);
        } catch (e) {
            console.log(e);
            setFormHasError(true);
        }
    };

    const [activeTab, setActiveTab] = useState<number>(0);
    const formElements = [
        <RegisterBusiness key={1} data={data as RegisterBusinessData} handleChange={useCall}/>,
        <RegisterOwner key={2} data={data as RegisterOwnerData} handleChange={useCall}/>
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
                    <h3 className="text-3xl font-semibold mb-3 text-[#060606]">
                        Crear cuenta
                    </h3>
                    <p className="text-base text-gray-600 mb-4">
                        Crea una cuenta para empezar a gestionar tu negocio
                    </p>
                </div>
                <form className="w-full flex flex-col gap-3 items-start" onSubmit={handleSubmitForm}>
                    <div className="form-control w-full">
                        {
                            formElements[activeTab]
                        }
                    </div>
                    <div className='w-full flex justify-center'>
                        <div className="join">
                            <button
                                disabled={activeTab === 0}
                                onClick={() => setActiveTab(prevState => prevState - 1)}
                                className='btn text-white disabled:text-white border-0 join-item bg-primary hover:bg-secondary'>
                                Atrás
                            </button>
                            <button
                                disabled={activeTab === formElements.length - 1}
                                onClick={() => setActiveTab(prevState => prevState + 1)}
                                className='btn text-white disabled:text-white border-0 join-item bg-primary hover:bg-secondary'>
                                Siguiente
                            </button>
                            {
                                activeTab === formElements.length - 1 ?
                                    <button
                                        className='btn text-white disabled:text-white border-0 join-item bg-primary hover:bg-secondary'
                                        type={"submit"}>Registrarse</button> :
                                    null
                            }
                        </div>
                    </div>
                </form>
                {
                    formHasError &&
                    <div className="mt-4">
                        <p className="text-red-400 text-xs">{formMessageError}</p>
                    </div>
                }
                <div className="w-full flex items-center justify-center mt-4">
                    <p className="text-sm font-normal text-[#060606]">¿Ya tienes cuenta?
                        <Link href="/dashboard/auth/login"
                              className="ml-1 font-semibold underline underline-offset-2 cursor-pointer">
                            Incia sesión
                        </Link>
                    </p>
                </div>
            </MiddleRightSide>
        </>
    );
}