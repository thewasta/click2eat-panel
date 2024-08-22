import RegisterBusinessLocalForm from "@/components/auth/RegisterBusinessLocal";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Registrar Local'
}

export default function RegisterBusinessLocal() {
    return (
        <>
            <div className="flex flex-col w-full mb-7">
                <h3 className="text-3xl font-semibold mb-3">
                    Registrar local
                </h3>
                <p className="text-xs text-muted-foreground">
                    Ahora vamos a registrar tu primer local.
                </p>
            </div>
            <div className="w-full flex flex-col gap-3 items-start">
                <div className="form-control w-full">
                    <RegisterBusinessLocalForm/>
                </div>
            </div>
        </>
    )
}