"use client"
import React from "react";
import {login} from '@/_request/auth/auth'
import Link from "next/link";
import Image from "next/image";
import MiddleLeftSide from "@/components/auth/middleLeftSide";
import MiddleRightSide from "@/components/auth/middleRigthSide";
import {Button} from "@/components/ui/button";
import {SubmitHandler, useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import {LoginAccountDto} from "@/types/auth/LoginAccount.types";

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
export default function AuthLogin() {

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
    });
    const onSubmit: SubmitHandler<z.infer<typeof loginSchema>> = async (values: z.infer<typeof loginSchema>) => {
        const loginDto: LoginAccountDto = {
            username: values.username,
            password: values.password
        };
        const response = await login(loginDto);
        if (response.error) {
            form.setError('root.server', {
                message: response.errorDescription as string
            });
        }
    }
    return (
        <>
            <MiddleLeftSide>
                <div className="absolute hidden md:flex top-[20%] left-[10%] flex-col">
                    <h1 className="text-4xl text-white font-extrabold my-4">
                        Click2Eat
                    </h1>
                    <p className="text-xl text-white font-normal">
                        Sistema gestión para tu negocio
                    </p>
                </div>
                <Image
                    src="https://placehold.co/750x800"
                    alt=""
                    width={750}
                    height={800}
                    className="w-full h-full object-cover"
                />
            </MiddleLeftSide>
            {/*bg-[#E0E0E0]*/}
            <MiddleRightSide customClass="justify-center flex gap-5">
                <div className="w-full flex flex-col justify-center gap-4">
                    <div className="flex flex-col w-full mb-2">
                        <h3 className="text-3xl font-semibold mb-3 text-center">
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
                                            Nombre de usuario
                                        </FormLabel>
                                        <FormControl>
                                            <Input className={"w-1/2"} defaultValue={''}
                                                   placeholder={"nombre de usuario"} {...field}/>
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
                                        <Input type={"password"} className={"w-1/2 !focus-visible::ring-orange-400"} defaultValue={''}
                                               placeholder={"contraseña"} {...field}/>
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
            </MiddleRightSide>
        </>
    );
}
