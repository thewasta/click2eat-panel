import React from 'react';
import {createClient} from "@/_lib/supabase/server";
import {Pricing} from "@/app/subscription/Pricing";
import {NotActiveAndNotOwner} from "@/app/subscription/notActiveAndNotOwner";

type PricePlan = {
    title: string;
    description: string;
    shortDescription?: string;
    benefits: string[];
    price: number;
    priceId: string
}
const prices: PricePlan[] = [
    {
        "title": "Básico",
        "description": "Ideal para empresas que empiezan.",
        "shortDescription": "Inicia con:",
        "benefits": [
            "Carta digital QR",
            "Reportes de uso"
        ],
        "price": 0,
        "priceId": "price_1PrO1sFlwSWuWQk7zYE3CpLy",
    },
    {
        "title": "Principiante",
        "description": "Empieza a gestionar tu local",
        "shortDescription": "Todo del plan básico, más:",
        "benefits": [
            "Aplicación TPV",
            "1 comandero"
        ],
        "price": 3250,
        "priceId": "price_1PZMwMFlwSWuWQk7Wo3arweB",
    },
    {
        "title": "Profesional",
        description: "",
        shortDescription: "Todo lo del plan principiante, más:",
        benefits: [
            "Gestión stock",
            "Gestion distribución",
            "5 comanderos"
        ],
        "price": 8000,
        "priceId": "price_1Pr3BDFlwSWuWQk7kmLwn6s1",
    }
];

async function Page() {
    const supabase = createClient();
    const {data: {user}} = await supabase.auth.getUser()
    if (!user) {
        return <h1>Debe iniciar sesión</h1>;
    }
    const {data, error} = await supabase.from('business').select('*').eq('user_id', user.id).maybeSingle()

    if (error || !data) {
        return <NotActiveAndNotOwner/>
    }

    return (
        <div className="flex flex-col h-screen justify-center items-center w-full max-w-6xl mx-auto py-12 px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Nuestros Planes y Servicios</h1>
                <p className="text-muted-foreground text-lg md:text-xl">
                    Parece que no tienes una suscripción activa.
                    Empieza ahora a gestionar tu local.
                </p>
            </div>
            <Pricing products={prices}/>
        </div>
    );
}

export default Page;