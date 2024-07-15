"use client"

import React, {useState} from "react";
import {withGoogleLogin, withPasswordLogin, withPasswordRegister} from '@/_request/auth/auth'
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {SubmitHandler, useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import {LoginAccountDto} from "@/types/auth/LoginAccount.types";
import {useRouter} from "next/navigation";
import {useMutation} from "@tanstack/react-query";
import {toast} from "sonner";

const loginSchema = z.object({
    username: z.string({
        required_error: 'A username is required'
    })
        .min(1, {
            message: 'Please, check your username'
        }),
    password: z.string({
        required_error: 'Password id required'
    })
        .min(1, {
            message: 'Password is required'
        })
});

export type LoginDto = z.infer<typeof loginSchema>;
export default function LoginPage() {

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const router = useRouter();
    const form = useForm<LoginDto>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: '',
            password: ''
        }
    });
    const loginMutation = useMutation({
        mutationFn: withPasswordLogin,
        onSuccess: (response: any) => {
            if (response.error) {
                form.setError('root.server', {
                    message: response.errorDescription as string
                });
            }
            router.push('/')
        },
        onError: () => {
            form.setError('root.server', {
                message: 'Server error'
            });
            setIsSubmitting(false)
        }
    });

    const registerMutation = useMutation({
        mutationFn: withPasswordRegister,
        onSuccess: (response: any) => {
            toast.success('Login correcto');
        },
        onError: () => {
            form.setError('root.server', {
                message: 'Server error'
            });
            setIsSubmitting(false)
        }
    });

    const googleMutation = useMutation({
        mutationFn: withGoogleLogin,
        onError: () => {
            toast.error('Ha ocurrido un error.');
        },
    })
    const onRegister: SubmitHandler<LoginDto> = async (values: LoginDto) => {
        setIsSubmitting(true);
        const loginDto: LoginAccountDto = {
            username: values.username,
            password: values.password
        }

        registerMutation.mutate(loginDto);
    }
    const onSubmit: SubmitHandler<LoginDto> = async (values: LoginDto) => {
        setIsSubmitting(true);
        const loginDto: LoginAccountDto = {
            username: values.username,
            password: values.password
        };
        loginMutation.mutate(loginDto);
    }
    return (
        <>
            <div className="w-full h-full flex flex-col justify-center gap-4">
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
                            name={"username"}
                            control={form.control}
                            render={({field}) => (
                                <FormItem className={"flex flex-col justify-center items-center"}>
                                    <FormLabel>
                                        Correo electrónico
                                    </FormLabel>
                                    <FormControl>
                                        <Input className={"w-full md:w-1/2"}
                                               onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                                                   if (event.key === 'Enter') {
                                                       form.handleSubmit(onSubmit)()
                                                   }
                                               }}
                                               placeholder={"mimail@foo.com"} {...field}/>
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
                                    <Input type={"password"} className={"w-full md:w-1/2"}
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
                <div className="flex gap-2 items-center justify-center">
                    <Button
                        type="button"
                        disabled={loginMutation.isPending}
                        onClick={form.handleSubmit(onSubmit)}>
                        Acceder
                    </Button>
                    <Button
                        type={"button"}
                        disabled={loginMutation.isPending}
                        onClick={form.handleSubmit(onRegister)}
                    >
                        Registrarse
                    </Button>
                    <Button type="button"
                            onClick={() => googleMutation.mutate()}>
                        <svg className="mr-2 -ml-1 w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fab"
                             data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                            <path fill="currentColor"
                                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                        </svg>
                        Acceder con google
                        <div></div>
                    </Button>

                </div>
            </div>
        </>
    );
}
