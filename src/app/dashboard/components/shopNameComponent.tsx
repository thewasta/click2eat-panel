'use client'

import {useGlobalState} from "@/lib/store/state";

export default function ShopNameComponent() {
    const {data} = useGlobalState();

    return (
        <span className={'underline'}>
            {data?.name ?? '[COMPANY_NAME]'}
        </span>
    )
}