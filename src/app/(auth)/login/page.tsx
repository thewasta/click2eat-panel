import React from "react";
import LoginForm from "@/components/auth/LoginForm";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Acceso'
};

export default function LoginPage() {
    return (
        <>
            <div className="w-full flex flex-col justify-center gap-4">
                <div className="flex flex-col w-full mb-2">
                    <h2 className={"text-center uppercase tracking-wide font-bold text-4xl"}>
                        Click<span className="text-green-500">2Eat</span>
                    </h2>
                    <h3 className="text-xl font-semibold mb-3 text-center">
                        Iniciar Sesión
                    </h3>
                </div>
                <LoginForm/>
            </div>
        </>
    );
}
