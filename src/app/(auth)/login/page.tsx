"use client"
import React, {useState} from "react";
import {login} from '@/_request/auth/auth'
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {SubmitHandler, useForm} from "react-hook-form";
import {Form} from "@/components/ui/form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useUserAppContext} from "@/lib/context/auth/user-context";
import {useRouter} from "next/navigation";
import {useMutation} from "@tanstack/react-query";
import {toast} from "sonner";
import {LoginFormSchema, loginSchema} from "@/types/validation/loginFormValidation";
import {AppFormField} from "@/components/products/app-form-field";

export default function LoginPage() {

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const router = useRouter();
    const userAppContext= useUserAppContext();
    const form = useForm<LoginFormSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: '',
            password: ''
        }
    });
    const loginMutation = useMutation({
        mutationFn: login,
        onSuccess: (response:any) => {
            toast.success('Acceso correcto',{
                description: 'En breve será redirigido'
            })
            userAppContext.setUser({
                id: response.message.user.id,
                email: response.message.user.email,
                lastname: response.message.user.lastname,
                name: response.message.user.name,
                username: response.message.user.username,
                status: response.message.user.status,
                rol: response.message.user.rol,
                business: response.message.business,
            });
            router.replace('/')
        },
        onError: (error, variables, context) => {
            console.log(error)
            form.setError('root.server', {
                message: 'Server error'
            });
            setIsSubmitting(false)
        }
    });
    const onSubmit: SubmitHandler<LoginFormSchema> = async (values: LoginFormSchema) => {
        setIsSubmitting(true);
        const loginDto: LoginFormSchema = {
            username: values.username,
            password: values.password
        };
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
                        <AppFormField
                            name={'username'}
                            formItemStyles={'flex flex-col justify-center items-center'}
                            placeholder={'nombre de usuario'}
                            className={'w-1/2'}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    form.handleSubmit(onSubmit);
                                }
                            }}
                        />
                        <AppFormField
                            name={'password'}
                            label={'Contraseña'}
                            placeholder={'************'}
                            type={'password'}
                            formItemStyles={'flex flex-col justify-center items-center'}
                            className={"w-1/2"}
                            formMessageStyles={'text-xs text-red-500 font-light'}
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
            </div>
            <div className="w-full flex items-center justify-center">
                <p className="text-sm font-normal">¿No tienes cuenta?
                    <Link href={"/register"}
                          className="ml-1 font-semibold underline underline-offset-2 cursor-pointer">
                        Registrate
                    </Link>
                </p>
            </div>
        </>
    );
}
