"use client"

import {Loader} from "lucide-react";

export default function Loading(){
    return (
        <div className={"w-screen h-screen flex justify-center items-center"}>
            <h4 className={"text-5xl font-bold"}>
                Cargando
            </h4>
            <Loader className={'inline animate-spin'}/>
        </div>
    )
}