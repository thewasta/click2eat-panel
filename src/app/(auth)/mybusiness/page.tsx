import React from "react";
import {createClient} from "@/_lib/supabase/server";
import SelectBusinessCard from "@/app/(auth)/mybusiness/selectBusiness";

export const fetchCache = 'force-no-store';

export default async function SelectBusinessPAge() {
    const client = createClient();
    const {data: {user}} = await client.auth.getUser();

    const {data} = await client
        .from('business')
        .select(`
      *,
      business_local (
        *,
        business_local_user_pivot (
          user_id
        )
      ),
      business_user_pivot (
        user_id
      )
    `)
        .eq('business_user_pivot.user_id', user?.id)
        .eq('business_local.business_local_user_pivot.user_id', user?.id);

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
                    data?.map(business => (
                        <React.Fragment key={business.business_id}>
                            {
                                business.business_local.map((businessLocal: any) => (
                                    <SelectBusinessCard
                                        key={businessLocal.business_local_id}
                                        business={business}
                                        businessLocal={businessLocal}/>
                                ))
                            }
                        </React.Fragment>
                    ))
                }
            </div>
        </div>
    );
}