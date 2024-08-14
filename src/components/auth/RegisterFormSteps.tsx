'use client'
import React from "react";
import RegisterBusiness from "@/components/auth/RegisterBusiness";
import RegisterOwner from "@/components/auth/RegisterOwner";
import {useRegisterAccountContext} from "@/lib/context/auth/register-account-context";

export default function RegisterFormSteps() {
    const {step} = useRegisterAccountContext();

    const formElements = [
        <RegisterBusiness key={1}/>,
        <RegisterOwner key={2}/>
    ];
    return (
        <div className="form-control w-full">
            {
                formElements[step]
            }
        </div>
    )
}