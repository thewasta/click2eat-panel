'use client'

import {Form, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Input} from "@nextui-org/input";
import React, {useEffect, useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation} from "@tanstack/react-query";
import {login} from "@/app/actions/auth/login_actions";
import useFormData from "@/_lib/_hooks/useFormData";
import {Button} from "@nextui-org/button";
import * as Sentry from "@sentry/nextjs";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import {EyeFilledIcon, EyeSlashFilledIcon} from "@nextui-org/shared-icons";

const isProduction = process.env.NODE_ENV === "production";

const loginSchema = z.object({
    email: z.string({
        required_error: 'Rellena los campos obligatorios'
    }).min(1, {
        message: 'Rellena los campos obligatorios'
    }),
    captchaToken: isProduction ? z.string({
        required_error: 'Por favor, asegurate de completar el captcha'
    }).min(2, {
        message: "Por favor, rellena el captcha"
    }) : z.string().optional(),
    password: z.string({
        required_error: 'Rellena los campos obligatorios'
    }).min(8, {
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
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
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
    const toggleVisibility = () => {
        setPasswordVisible(!passwordVisible);
    }
    return (
        <>
            <Form {...form}>
                <form className={"flex flex-col items-center gap-5"}>
                    <FormField
                        name={"email"}
                        control={form.control}
                        render={({field}) => (
                            <Input
                                isRequired
                                label={"Correo electrónico"}
                                className={"w-full lg:w-1/2"}
                                isInvalid={!!form.formState.errors.email}
                                errorMessage={form.formState.errors.email?.message}
                                {...field}
                            />
                        )}/>
                    <FormField name={"password"} control={form.control} render={({field}) => (
                        <Input
                            isRequired
                            label={"Contaseña"}
                            endContent={
                                <button className="focus:outline-none" type="button" onClick={toggleVisibility}
                                        aria-label="toggle password visibility">
                                    {passwordVisible ? (
                                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none"/>
                                    ) : (
                                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none"/>
                                    )}
                                </button>
                            }
                            type={passwordVisible ? "text" : "password"}
                            className={"w-full lg:w-1/2"}
                            isInvalid={!!form.formState.errors.password}
                            errorMessage={form.formState.errors.password?.message}
                            {...field}
                        />
                    )}/>
                    {
                        process.env.NODE_ENV === "production" && (
                            <FormField
                                name={"captchaToken"}
                                render={({field}) => (
                                    <FormItem className={"flex flex-col justify-center items-center"}>
                                        <HCaptcha
                                            languageOverride={"es"}
                                            sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_TOKEN}
                                            onVerify={(token) => {
                                                setCaptchaToken(token);
                                                field.onChange(token)
                                            }}
                                        />
                                        <FormMessage className={"text-xs text-red-500 font-light"}/>
                                    </FormItem>
                                )}
                            />
                        )
                    }
                </form>
                <p className={"text-center text-xs text-red-500 font-light"}>
                    {form.formState.errors && form.formState.errors.root?.server.message}
                </p>
            </Form>
            <div className="flex items-center justify-center">
                <Button
                    type="button"
                    color={"primary"}
                    disabled={isSubmitting}
                    onClick={form.handleSubmit(onSubmit)}>
                    Acceder
                </Button>
            </div>
        </>
    )
        ;
}