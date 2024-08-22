'use client'

import React from "react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {z} from "zod";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import useFormData from "@/_lib/_hooks/useFormData";
import {useMutation} from "@tanstack/react-query";
import {registerBusiness} from "@/app/actions/auth/register_actions";
import {toast} from "sonner";

const registerSchema = z.object({
    businessName: z.string({required_error: 'Rellena los campos obligatorios'})
        .min(5, {
            message: 'Rellena los campos obligatorios'
        }),
    document: z.string({required_error: 'Rellena los campos obligatorios'})
        .min(5, {
            message: 'Rellena los campos obligatorios'
        }),
    phone: z.string()
        .min(6, {
            message: 'Rellena los campos obligatorios'
        }),
    address: z.string({required_error: 'Rellena los campos obligatorios'})
        .min(5, {
            message: 'Rellena los campos obligatorios'
        }),
    postalCode: z.coerce.number({
        required_error: 'Rellena los campos obligatorios',
        invalid_type_error: 'Rellena los campos obligatorios'
    }).min(1000),
    province: z.string({required_error: 'Rellena los campos obligatorios'})
        .min(3, {
            message: 'Rellena los campos obligatorios'
        }),
    town: z.string({required_error: 'Rellena los campos obligatorios'})
        .min(3, {
            message: 'Rellena los campos obligatorios'
        }),
    country: z.string({required_error: 'Rellena los campos obligatorios'})
        .min(5, {
            message: 'Rellena los campos obligatorios'
        }),
    timeZone: z.number()
});
export type RegisterFormDTO = z.infer<typeof registerSchema>;
export default function RegisterBusinessForm() {
    const mutation = useMutation({
        mutationFn: registerBusiness,
        onError: (error) => {
            console.error(error);
            toast.error(error.message)
        }
    })
    const createFormData = useFormData<RegisterFormDTO>();
    const businessForm = useForm<RegisterFormDTO>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            businessName: '',
            document: '',
            phone: '',
            address: '',
            postalCode: undefined,
            province: '',
            town: '',
            country: '',
            timeZone: new Date().getTimezoneOffset() / 60
        }
    });

    const onSubmit: SubmitHandler<RegisterFormDTO> = (values: RegisterFormDTO) => {
        const formData = createFormData(values);
        mutation.mutate(formData);
    }

    return (
        <div className={"space-y-4"}>
            <Form {...businessForm} >
                <form onSubmit={businessForm.handleSubmit(onSubmit)} className={"space-y-3"}>
                    <FormField
                        name={"businessName"}
                        control={businessForm.control}
                        render={({field}) => (
                            <FormItem className={"w-full"}>
                                <FormLabel>
                                    Nombre empresa
                                </FormLabel>
                                <FormControl>
                                    <Input required placeholder={"Tagliatella, 100Montaditos..."} {...field}/>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <div className={"flex flex-col xl:flex-row gap-3"}>
                        <FormField
                            name={"document"}
                            control={businessForm.control}
                            render={({field}) => (
                                <FormItem className={"w-full xl:w-1/3"}>
                                    <FormLabel>
                                        NIF
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder={"12345678D"} {...field}/>
                                    </FormControl>
                                </FormItem>
                            )}
                        >
                        </FormField>
                        <FormField
                            name={"phone"}
                            control={businessForm.control}
                            render={({field}) => (
                                <FormItem className={"w-full xl:w-1/3"}>
                                    <FormLabel>
                                        Contacto
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder={"+34612345678"} {...field}/>
                                    </FormControl>
                                </FormItem>
                            )}
                        >
                        </FormField>
                    </div>
                    <div className={"flex flex-col xl:flex-row gap-3"}>
                        <FormField
                            name={"address"}
                            control={businessForm.control}
                            render={({field}) => (
                                <FormItem className={"w-full xl:w-1/3"}>
                                    <FormLabel>
                                        Dirección
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder={"Calle, Lugar, Vía..."} {...field}/>
                                    </FormControl>
                                </FormItem>
                            )}
                        >
                        </FormField>
                        <FormField
                            name={"postalCode"}
                            control={businessForm.control}
                            render={({field}) => (
                                <FormItem className={"w-full xl:w-1/3"}>
                                    <FormLabel>
                                        Código postal
                                    </FormLabel>
                                    <FormControl>
                                        <Input type={"number"} placeholder={"30001"} {...field}/>
                                    </FormControl>
                                </FormItem>
                            )}
                        >
                        </FormField>
                        <FormField
                            name={"province"}
                            control={businessForm.control}
                            render={({field}) => (
                                <FormItem className={"w-full xl:w-1/3"}>
                                    <FormLabel>
                                        Provincia
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder={"Murcia"} {...field}/>
                                    </FormControl>
                                </FormItem>
                            )}
                        >
                        </FormField>
                    </div>
                    <div className={"flex flex-col xl:flex-row gap-3"}>
                        <FormField
                            name={"town"}
                            control={businessForm.control}
                            render={({field}) => (
                                <FormItem className={"w-full xl:w-1/3"}>
                                    <FormLabel>
                                        Localidad
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder={"Murcia"} {...field}/>
                                    </FormControl>
                                </FormItem>
                            )}
                        >
                        </FormField>
                        <FormField
                            name={"country"}
                            control={businessForm.control}
                            render={({field}) => (
                                <FormItem className={"w-full xl:w-1/3"}>
                                    <FormLabel>
                                        País
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder={"España"} {...field}/>
                                    </FormControl>
                                </FormItem>
                            )}
                        >
                        </FormField>
                        <FormField
                            name={"timeZone"}
                            control={businessForm.control}
                            render={({field}) => (
                                <FormItem className={"w-full xl:w-1/3"}>
                                    <FormLabel>
                                        Zona Horaria
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder={"-2,-1,0,+1,+2,"} {...field}/>
                                    </FormControl>
                                </FormItem>
                            )}
                        >
                        </FormField>
                    </div>
                    {
                        !businessForm.formState.isValid &&
                        <FormMessage>* Rellena los campos necesarios</FormMessage>
                    }

                    <div className='w-full flex justify-center gap-8'>
                        <Button type={"submit"}>Registrar</Button>
                    </div>
                </form>
            </Form>

        </div>
    );
}