import React from "react";

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
                                          inputClassName,
                                          labelClassName,
                                          name,
                                          value,
                                          onChange,
                                          icon,
                                      }: FormInputProps) {
    let customLabelClassName = `input bg-white input-bordered flex items-center gap-2 ${labelClassName}`;
    let customInputClassName = `input input-bordered w-full ${inputClassName}`;

    if (icon) {
        return (
            <label className={customLabelClassName}>
                {icon}
                <input required={required} type={inputType} className='grow' name={name} value={value} placeholder={placeholder} onChange={onChange}/>
            </label>
        )
    }
    customLabelClassName = `input bg-white input-bordered flex items-center gap-2 ${labelClassName}`;
    customInputClassName = `grow ${inputClassName}`;
    return (
        <label className={customLabelClassName}>
            <input required={required} type={inputType} name={name} className={customInputClassName} value={value} placeholder={placeholder} onChange={onChange}/>
        </label>
    )
}