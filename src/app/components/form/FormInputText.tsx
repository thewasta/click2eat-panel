import React from "react";

type InputType = "text" | "password" | "email";

interface FormInputProps {
    placeholder: string;
    inputType: InputType;
    className?: string;
    icon?: React.ReactNode;
    onChange: (value: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FormInputText({placeholder, inputType, className, onChange, icon}: FormInputProps) {
    return (
        <label className="input bg-white input-bordered flex items-center gap-2">
            {icon}
            <input type={inputType} className={className} placeholder={placeholder} onChange={onChange}/>
        </label>
    )
}