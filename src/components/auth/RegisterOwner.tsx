import React from "react";
import {useRegisterAccountContext} from "@/lib/context/auth/register-account-context";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {register} from "@/_request/auth/auth";
import * as localforage from "localforage";
import {useRouter} from "next/navigation";
import {useUserAppContext} from "@/lib/context/auth/user-context";
import {useMutation} from "@tanstack/react-query";
import {toast} from "sonner";
import {RegisterOwnerFormSchema, registerOwnerSchema} from "@/types/validation/registerOwnerFormValidation";

const RegisterOwnerForm = () => {
    const formContext = useRegisterAccountContext();

    const ownerForm = useForm<RegisterOwnerFormSchema>({
        resolver: zodResolver(registerOwnerSchema),
        defaultValues: {
            name: formContext.propertyForm?.name,
            lastName: formContext.propertyForm?.lastName,
            username: formContext.propertyForm?.username,
            email: formContext.propertyForm?.email,
            password: formContext.propertyForm?.password,
            confirmPassword: formContext.propertyForm?.confirmPassword,
        }
    });
    const router = useRouter();
    const userAppContext = useUserAppContext();
    const mutation = useMutation({
        mutationFn: register,
        onSuccess: (response) => {
            userAppContext.setUser({
                id: response.message.user.id,
                email: response.message.user.email,
                lastname: response.message.user.lastname,
                name: response.message.user.name,
                username: response.message.user.username,
                status: response.message.user.status,
                rol: response.message.user.rol,
                business: response.message.business,
            })
            router.push('/');
        },
        onError: (error, variables, context) => {
            ownerForm.setError('username', {
                message: error.message
            });
            toast.error('Ha ocurrido un error.', {
                description: error.message
            })
        }
    })
    const onSubmit: SubmitHandler<RegisterOwnerFormSchema> = async (values: RegisterOwnerFormSchema) => {
        const fcmToken = await localforage.getItem('fcmToken');
        formContext.updatePropertyForm({...values, fcmToken: fcmToken as string});
        if (formContext.propertyForm) {
            mutation.mutate(formContext.propertyForm)
        }
    }
    return (
        <div className={"space-y-4"}>
            <Form {...ownerForm}>
                <form className={"space-y-3"}>
                    <div className="flex md:flex-row flex-col gap-3">
                        <FormField
                            name={"name"}
                            render={({field}) => (
                                <FormItem className={"w-full xl:w-1/2"}>
                                    <FormLabel>
                                        Nombre
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder={"Nombre"} {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            name={"lastName"}
                            render={({field}) => (
                                <FormItem className={"w-full xl:w-1/2"}>
                                    <FormLabel>
                                        Apellido
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder={"Apellido"} {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex md:flex-row flex-col gap-3">
                        <FormField
                            name={"username"}
                            render={({field}) => (
                                <FormItem className={"w-full xl:w-1/2"}>
                                    <FormLabel>
                                        Nombre usuario
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder={"Nombre usuario"} {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            name={"email"}
                            render={({field}) => (
                                <FormItem className={"w-full xl:w-1/2"}>
                                    <FormLabel>
                                        Correo Electrónico
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder={"Correo electrónico"} {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex md:flex-row flex-col gap-3">
                        <FormField
                            name={"password"}
                            render={({field}) => (
                                <FormItem className={"w-full xl:w-1/2"}>
                                    <FormLabel>
                                        Contraseña
                                    </FormLabel>
                                    <FormControl>
                                        <Input type={"password"} placeholder={"Contraseña"} {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            name={"confirmPassword"}
                            render={({field}) => (
                                <FormItem className={"w-full xl:w-1/2"}>
                                    <FormLabel>
                                        Confirmar contraseña
                                    </FormLabel>
                                    <FormControl>
                                        <Input type={"password"} placeholder={"Confirmar contraseña"} {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <p className={"text-center text-xs text-red-500 font-light"}>
                        {/*@ts-ignore/*/}
                        {ownerForm.formState.errors && ownerForm.formState.errors.confirm?.message || ownerForm.formState.errors.root?.server.message}
                    </p>
                </form>
                <div className='w-full flex justify-center gap-8'>
                    <Button type={"button"} onClick={() => {
                        formContext.onHandlePrev();
                    }}>Atrás</Button>
                    <Button type={"button"} onClick={ownerForm.handleSubmit(onSubmit)}>Registrarse</Button>
                </div>
            </Form>
        </div>
    )
}

export default RegisterOwnerForm;