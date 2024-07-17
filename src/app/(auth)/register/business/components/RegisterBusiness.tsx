'use client'

import React, {ReactNode} from "react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {registerBusiness as actionRegisterBusiness} from "@/_request/auth/register";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {useMutation} from "@tanstack/react-query";
import {registerBusiness, RegisterBusinessDto} from "@/app/(auth)/register/business/formValidation";

export function RegisterBusinessForm(): ReactNode {
    const {push} = useRouter();
    const businessForm = useForm<RegisterBusinessDto>({
        resolver: zodResolver(registerBusiness),
        defaultValues: {
            businessName: '',
            document: '',
            address: '',
            postalCode: '',
            province: '',
            town: '',
            country: '',
        }
    });

    const mutation = useMutation({
        mutationFn: actionRegisterBusiness,
        onSuccess: async () => {
            toast.success('Registrado correctamente');
            push('/register/local');
        },
        onError: (error) => {
            console.log(error);
            toast.error('Error al registrar');
        }
    });
    const onSubmit: SubmitHandler<RegisterBusinessDto> = async (values: RegisterBusinessDto) => {
        try {
            mutation.mutate(values);
        } catch (e) {
            toast.error('Ha ocurrido un error al registrar el usuario');
        }
    }

    return (
        <div className={"space-y-4"}>
            <Form {...businessForm} >
                <form className={"space-y-3"} onSubmit={businessForm.handleSubmit(onSubmit)}>
                    <div className={"flex flex-col xl:flex-row gap-3"}>
                        <FormField
                            name={"businessName"}
                            control={businessForm.control}
                            render={({field}) => (
                                <FormItem className={"w-full xl:w-1/2"}>
                                    <FormLabel>
                                        Nombre
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder={"Mercadona, Primark, CocaCola..."} {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            name={"document"}
                            control={businessForm.control}
                            render={({field}) => (
                                <FormItem className={"w-full xl:w-1/2"}>
                                    <FormLabel>
                                        NIF
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder={"01234567A"} {...field}/>
                                    </FormControl>
                                    <FormMessage/>
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
                                <FormItem className={"w-full xl:w-1/2"}>
                                    <FormLabel>
                                        Dirección
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder={"Dirección empresa"} {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        >
                        </FormField>
                        <FormField
                            name={"postalCode"}
                            control={businessForm.control}
                            render={({field}) => (
                                <FormItem className={"w-full xl:w-1/2"}>
                                    <FormLabel>
                                        Código postal
                                    </FormLabel>
                                    <FormControl>
                                        <Input type={"number"} placeholder={"012345"} {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        >
                        </FormField>
                    </div>
                    <div className={"flex flex-col xl:flex-row gap-3"}>
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
                                    <FormMessage/>
                                </FormItem>
                            )}
                        >
                        </FormField>
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
                                    <FormMessage/>
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
                                    <FormMessage/>
                                </FormItem>
                            )}
                        >
                        </FormField>
                    </div>
                    <Button type={"submit"}>Guardar</Button>
                </form>
            </Form>
            <div className='w-full flex justify-center gap-8'>
            </div>
        </div>
    );
}

export default RegisterBusinessForm;