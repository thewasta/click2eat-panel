import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import React, {ComponentProps} from "react";
import {Input} from "@/components/ui/input";

type ProductFormFieldProps = ComponentProps<'input'> & {
    name: string;
    label?: string;
    placeholder?: string;
    formItemStyles?: string;
    formMessageStyles?: string
}

export function AppFormField({
                                 name,
                                 label,
                                 placeholder,
                                 formItemStyles,
                                 formMessageStyles,
                                 ...inputProps
                             }: ProductFormFieldProps) {

    return <FormField
        name={name}
        render={({field}) => (
            <FormItem
                className={formItemStyles}
            >
                {
                    label && <FormLabel>{label}</FormLabel>
                }
                <FormControl>
                    <Input
                        placeholder={placeholder}
                        {...inputProps}
                        {...field}
                    />
                </FormControl>
                <FormMessage className={formMessageStyles}/>
            </FormItem>
        )}
    />
}