'use client'

import {createClient} from "@/lib/supabase/client";
import {useEffect, useState} from "react";

export default function ShopNameComponent() {
    const supabase = createClient();
    const [business, setBusiness] = useState<null | any>();

    useEffect(() => {
        const business = async () => {
            const {data} = await supabase.from('business')
                .select('*,business_user_pivot!inner(user_id)');
            return data;
        }
        business().then(business => {
            if (business) {
                setBusiness(business[0].name);
            }
        }).catch(console.error);

    }, []);

    return (
        <span className={'underline'}>
            {business ?? '[COMPANY_NAME]'}
        </span>
    )
}