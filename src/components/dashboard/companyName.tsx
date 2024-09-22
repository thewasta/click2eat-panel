'use client'

import {Tables} from "@/types/database/database";

type DashboardCompanyNameProps = {
    business: Tables<'business'>
}

export default function DashboardCompanyName({business}: DashboardCompanyNameProps) {
    return (
        <>
            {business.name}, {business.address}
        </>
    )
}