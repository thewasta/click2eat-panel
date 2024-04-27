import React from "react";
import FormInputText from "@/app/components/form/FormInputText";

export interface RegisterBusinessData {
    businessName: string;
    document: string;
    address: string;
    postalCode: string;
    province: string;
    town: string;
    country: string;
}

interface RegisterBusinessProps {
    data: RegisterBusinessData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RegisterBusinessForm = (props: RegisterBusinessProps) => {
    const {data, handleChange} = props

    return (
        <>
            <div className="flex gap-3 flex-col">
                <div className="flex flex-col xl:flex-row gap-3">
                    <FormInputText
                        required={true}
                        placeholder={"Nombre empresa"}
                        inputType={"text"}
                        name={"businessName"}
                        onChange={handleChange}
                        value={data.businessName || ''}
                        labelClassName="w-full xl:w-1/2"
                    />
                    <FormInputText
                        required={true}
                        placeholder={"NIF"}
                        inputType={"text"}
                        name={"document"}
                        value={data.document || ''}
                        onChange={handleChange}
                        labelClassName="w-full xl:w-1/2"
                    />
                </div>
                <div className="flex flex-col xl:flex-row gap-3">
                    <FormInputText
                        placeholder={"Dirección"}
                        inputType={"text"}
                        name={"address"}
                        value={data.address || ''}
                        labelClassName={"w-full xl:w-2/3"}
                        onChange={handleChange}
                    />
                    <FormInputText
                        required={true}
                        placeholder={"Código postal"}
                        inputType={"text"}
                        name={"postalCode"}
                        value={data.postalCode || ''}
                        onChange={handleChange}
                        labelClassName={"w-full xl:w-1/3"}
                    />
                </div>
                <div className="flex flex-col xl:flex-row gap-3">
                    <FormInputText
                        required={true}
                        placeholder={"Provincia"}
                        inputType={"text"}
                        name={"province"}
                        value={data.province || ''}
                        onChange={handleChange}
                        labelClassName="w-full xl:w-1/3"
                    />
                    <FormInputText
                        required={true}
                        placeholder={"Localidad"}
                        inputType={"text"}
                        name={"town"}
                        value={data.town || ''}
                        onChange={handleChange}
                        labelClassName="w-full xl:w-1/3"
                    />
                    <FormInputText
                        required={true}
                        placeholder={"País"}
                        inputType={"text"}
                        name={"country"}
                        value={data.country || ''}
                        onChange={handleChange}
                        labelClassName="w-full xl:w-1/3"
                    />
                </div>
            </div>
        </>
    )
}

export default RegisterBusinessForm;