import React from "react";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label"

type InputType = "text" | "password" | "email" | "number";

interface FormInputProps {
    required?: boolean;
    placeholder: string;
    inputType: InputType;
    inputClassName?: string;
    labelClassName?: string;
    name: string;
    value?: string;
    icon?: React.ReactNode;
    onChange: (value: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FormInputText({
                                          required,
                                          placeholder,
                                          inputType,
                                          name,
                                          value,
                                          onChange,
                                          icon,
                                      }: FormInputProps) {

    if (icon) {
        return (
            <div className={"grid w-full max-w-sm items-center gap-1.5"}>
                <Label htmlFor={name}>
                    {placeholder}
                </Label>
                <Input required={required} id={name} type={inputType} name={name} value={value}
                       placeholder={placeholder} onChange={onChange}/>
            </div>
        )
    }


    return (
        <Input
            required={required}
            type={inputType}
            name={name}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
        />
    )
}