'use client'

import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

function NotFoundPage() {
    const router = useRouter();
    return (
        <div className={"w-full h-screen bg-slate-50 flex flex-col gap-4 justify-center items-center"}>
            <h1 className={"text-3xl font-bold"}>
                Parece que te has perdido.
            </h1>
            <span className={"font-sans text-sm text-muted-foreground"}>
                Deberías de volver a un lugar seguro
            </span>
            <section className={'flex gap-2'}>
                <Button onClick={() => router.back()}>
                    Volver atrás
                </Button>
                <Button onClick={() => router.replace('/')}>
                    Volver a inicio
                </Button>
            </section>
        </div>
    )
}

export default NotFoundPage