import React from "react";

type InputType = "text" | "password" | "email";

interface FormInputProps {
    placeholder: string;
    inputType: InputType;
    inputClassName?: string;
    labelClassName?: string;
    name: string;
    icon?: React.ReactNode;
    onChange: (value: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FormInputText({
                                          placeholder,
                                          inputType,
                                          inputClassName,
                                          labelClassName,
                                          name,
                                          onChange,
                                          icon,
                                      }: FormInputProps) {
    let customLabelClassName = `input bg-white input-bordered flex items-center gap-2 ${labelClassName}`;
    let customInputClassName = `input input-bordered w-full ${inputClassName}`;

    if (icon) {
        return (
            <label className={customLabelClassName}>
                {icon}
                <input type={inputType} className='grow' name={name} placeholder={placeholder} onChange={onChange}/>
            </label>
        )
    }
    customLabelClassName = `input bg-white input-bordered flex items-center gap-2 ${labelClassName}`;
    customInputClassName = `grow ${inputClassName}`;
    return (
        <label className={customLabelClassName}>
            {name}
            <input type="text" className={customInputClassName} placeholder={placeholder}/>
        </label>
    )
}