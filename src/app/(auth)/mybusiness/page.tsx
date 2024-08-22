import React from "react";
import {createClient} from "@/_lib/supabase/server";
import SelectBusinessCard from "@/app/(auth)/mybusiness/selectBusiness";

export const fetchCache = 'force-no-store';

export default async function SelectBusinessPAge() {
    const client = createClient();
    const {data: {user}} = await client.auth.getUser();

    const {data: businessEstablishments, error} = await client
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
            <div className={'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'}>
                {
                    businessEstablishments?.map(establishments => (
                        <React.Fragment key={establishments.id}>
                            {
                                <SelectBusinessCard
                                    businessLocal={establishments}/>
                            }
                        </React.Fragment>
                    ))
                }
            </div>
        </div>
    );
}