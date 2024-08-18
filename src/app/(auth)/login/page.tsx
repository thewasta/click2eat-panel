"use client"

import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {SubmitHandler, useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import {useMutation} from "@tanstack/react-query";
import {login} from "@/app/actions/auth/login_actions";
import useFormData from "@/_lib/_hooks/useFormData";

const loginSchema = z.object({
    email: z.string({
        required_error: 'Rellena los campos obligatorios'
    }).min(1, {
        message: 'Rellena los campos obligatorios'
    }),
    password: z.string({
        required_error: 'Rellena los campos obligatorios'
    }).min(1, {
        message: 'Rellena los campos obligatorios'
    })
});
export default function LoginPage() {

    const createFormData = useFormData();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    });
    const loginMutation = useMutation({
        mutationFn: login,
        onError: (error) => {
            form.setError('root.server', {
                message: error.message
            });
        },
        onSettled: () => {
            setIsSubmitting(false);
        }
    });
    const onSubmit: SubmitHandler<z.infer<typeof loginSchema>> = async (values: z.infer<typeof loginSchema>) => {
        setIsSubmitting(true);
        const loginDto = createFormData(values);
        loginMutation.mutate(loginDto);
    }
    return (
        <>
            <div className="w-full flex flex-col justify-center gap-4">
                <div className="flex flex-col w-full mb-2">
                    <h2 className={"text-center uppercase tracking-wide font-bold text-4xl"}>
                        Click<span className="text-green-500">2Eat</span>
                    </h2>
                    <h3 className="text-xl font-semibold mb-3 text-center">
                        Iniciar Sesión
                    </h3>
                </div>
                <Form {...form}>
                    <form className={"flex flex-col gap-5"}>
                        <FormField
                            name={"email"}
                            control={form.control}
                            render={({field}) => (
                                <FormItem className={"flex flex-col justify-center items-center"}>
                                    <FormLabel>
                                        Correo Electrónico
                                    </FormLabel>
                                    <FormControl>
                                        <Input type={'email'} className={"w-1/2"}
                                               onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                                                   if (event.key === 'Enter') {
                                                       form.handleSubmit(onSubmit)()
                                                   }
                                               }}
                                               placeholder={"info@click2eat.es"} {...field}/>
                                    </FormControl>
                                    <FormMessage className={"text-xs text-red-500 font-light"}/>
                                </FormItem>
                            )}/>
                        <FormField name={"password"} control={form.control} render={({field}) => (
                            <FormItem className={"flex flex-col justify-center items-center"}>
                                <FormLabel>
                                    Contraseña
                                </FormLabel>
                                <FormControl>
                                    <Input type={"password"} className={"w-1/2"}
                                           onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                                               if (event.key === 'Enter') {
                                                   form.handleSubmit(onSubmit)()
                                               }
                                           }}
                                           placeholder={"************"} {...field}/>
                                </FormControl>
                                <FormMessage className={"text-xs text-red-500 font-light"}/>
                            </FormItem>
                        )}/>
                    </form>
                    <p className={"text-center text-xs text-red-500 font-light"}>
                        {form.formState.errors && form.formState.errors.root?.server.message}
                    </p>
                </Form>
                <div className="flex items-center justify-center">
                    <Button
                        type="button"
                        disabled={isSubmitting}
                        onClick={form.handleSubmit(onSubmit)}>
                        Acceder
                    </Button>
                </div>
            </div>
        </>
    );
}
