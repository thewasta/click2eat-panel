import React from "react";

type InputType = "text" | "password" | "email";

interface FormInputProps {
    placeholder: string;
    inputType: InputType;
    onChange: (value: string | boolean) => void;
}

export default function FormInputText({placeholder, inputType, onChange}: FormInputProps) {
    return (
        <input
            onChange={(event) => onChange(event.target.value)}
            type={inputType}
            placeholder={placeholder}
            className="w-full py-3 my-2 px-6 ring-1 ring-gray-300 rounded-xl placeholder-gray-600 bg-transparent transition disabled:ring-gray-200 disabled:bg-gray-100 disabled:placeholder-gray-400 invalid:ring-red-400 focus:invalid:outline-none"/>
    )
}