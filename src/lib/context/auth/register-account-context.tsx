"use client"
import {createContext, ReactNode, useContext, useState} from "react";
import {RegisterAccount} from "@/lib/models/Account/RegisterAccount";

export interface RegisterAccountContextProps {
    propertyForm: RegisterAccount | null;
    onHandleNext: () => void,
    onHandlePrev: () => void,
    step: number,
    updatePropertyForm: (property: Partial<RegisterAccount>) => void;
}

export const RegisterAccountContext = createContext<RegisterAccountContextProps | null>({
    propertyForm: null,
    onHandleNext: () => null,
    onHandlePrev: () => null,
    step: 0,
    updatePropertyForm: () => null
})
RegisterAccountContext.displayName = "RegisterAccountFormContext"

interface RegisterAccountContextProviderProps {
    children: ReactNode
}

export function RegisterAccountContextProvider({children}: RegisterAccountContextProviderProps) {
    const [account, setAccount] = useState<RegisterAccount | null>(null);
    const [step, setStep] = useState<number>(0)
    const updateRegisterData = (values: Partial<RegisterAccount>) => {
        setAccount({...account, ...values});
    }

    function onHandleNext() {
        setStep((prevState) => prevState + 1);
    }

    function onHandlePrev() {
        setStep((prevState) => prevState - 1);
    }

    return (
        <RegisterAccountContext.Provider
            value={
                {
                    propertyForm: account,
                    step,
                    onHandleNext,
                    onHandlePrev,
                    updatePropertyForm: updateRegisterData
                }
            }>
            {children}
        </RegisterAccountContext.Provider>
    );
}

export const useRegisterAccountContext = () => {
    const context = useContext(RegisterAccountContext);
    if (!context) {
        throw new Error('useRegisterAccountContext must be used within a RegisterAccountContextProvider')
    }
    return context;
}