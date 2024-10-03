'use client'

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import React, {useEffect, useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation} from "@tanstack/react-query";
import {login} from "@/app/actions/auth/login_actions";
import useFormData from "@/_lib/_hooks/useFormData";
import {Button} from "@/components/ui/button";
import * as Sentry from "@sentry/nextjs";
import HCaptcha from "@hcaptcha/react-hcaptcha";

const loginSchema = z.object({
    email: z.string({
        required_error: 'Rellena los campos obligatorios'
    }).min(1, {
        message: 'Rellena los campos obligatorios'
    }),
    captchaToken: z.string({
        required_error: 'Por favor, asegurate de completar el captcha'
    }).min(2, {
        message: "Por favor, rellena el captcha"
    }),
    password: z.string({
        required_error: 'Rellena los campos obligatorios'
    }).min(1, {
        message: 'Rellena los campos obligatorios'
    })
});
export default function LoginForm() {
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
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
        onSuccess: (result) => {
            if (result && !result.success) {
                form.setError('root.server', {
                    type: 'manual',
                    message: result.error
                });
            }
        },
        onError: (error) => {
            Sentry.captureException(error, {
                level: 'fatal'
            });
            form.setError('root.server', {
                message: 'Ha ocurrido un error inesperado. Por favor, inténtelo de nuevo'
            });
        },
        onSettled: () => {
            setIsSubmitting(false);
        }
    });
    const onSubmit: SubmitHandler<z.infer<typeof loginSchema>> = async (values: z.infer<typeof loginSchema>) => {
        setIsSubmitting(true);
        if (captchaToken) {
            values.captchaToken = captchaToken;
        }
        const loginDto = createFormData(values);
        loginMutation.mutate(loginDto);
    }
    useEffect(() => {
        return () => {
            setCaptchaToken(null);
        }
    }, []);
    return (
        <>
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
                    <FormField
                        name={"captchaToken"}
                        render={({field}) => (
                            <FormItem className={"flex flex-col justify-center items-center"}>
                                <HCaptcha
                                    sitekey={"60e8b22e-b912-45ee-9dde-589e4f5850be"}
                                    onVerify={(token) => {
                                        setCaptchaToken(token);
                                        field.onChange(token)
                                    }}
                                />
                                <FormMessage className={"text-xs text-red-500 font-light"}/>
                            </FormItem>
                        )}
                    />
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
        </>
    )
        ;
}