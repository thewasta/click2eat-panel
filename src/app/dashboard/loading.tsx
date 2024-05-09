"use client"
import {Progress} from "@/components/ui/progress";

export default function Loading(){
    return (
        <div className={"w-screen h-screen flex justify-center items-center"}>
            <h4 className={"text-5xl font-bold"}>
                Cargando...
            </h4>
        </div>
    )
}