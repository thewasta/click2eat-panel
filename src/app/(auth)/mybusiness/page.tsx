import React from "react";
import {createClient} from "@/_lib/supabase/server";
import {SelectBusiness} from "@/app/(auth)/mybusiness/selectBusiness";

export const fetchCache = 'force-no-store';

export default async function SelectBusinessPage() {
    const client = createClient();

    const {data: businessEstablishments} = await client
        .from('business_establishments')
        .select('*,business(*)');

    return (
        <div className="w-full flex flex-col justify-center gap-4">
            <div className="flex flex-col w-full mb-2 items-center">
                <h2 className={"text-center uppercase tracking-wide font-bold text-4xl"}>
                    Click<span className="text-green-500">2Eat</span>
                </h2>
                <p className="text-xs text-muted-foreground">
                    Selecciona el local que quieres gestionar.
                </p>
            </div>
            {
                businessEstablishments &&
                <SelectBusiness businessEstablishments={businessEstablishments}/>
            }
        </div>
    );
}