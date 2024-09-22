'use client'

import React from "react";
import SelectBusinessCard from "@/app/(auth)/mybusiness/selectBusinessCard";
import {Tables} from "@/types/database/database";
import {Button} from "@/components/ui/button";
import {useMutation} from "@tanstack/react-query";
import {logout} from "@/app/actions/auth/login_actions";

type SelectBusinessProps = {
    businessEstablishments: Tables<'business_establishments'>[]
}

export function SelectBusiness({businessEstablishments}: SelectBusinessProps) {
    const mutation = useMutation({
        mutationFn: logout
    });

    const handleLogout = () => {
        mutation.mutate();
    }

    return (
        <>
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
            <Button variant={'link'} className={'justify-end self-end'} onClick={handleLogout}>
                Cerrar sesión
            </Button>
        </>
    );
}