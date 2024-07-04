"use client"

import React, {ReactNode} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {profileSchema, RegisterProfileDTO} from "@/app/(auth)/register/profile/formValidation";

export default function RegisterProfilePage(): ReactNode {
    const registerForm = useForm<RegisterProfileDTO>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: '',
            lastname: '',
            avatar: ''
        }
    })
    return (
        <div className="w-full flex flex-col justify-center gap-4">
            <div className="flex flex-col w-full mb-2">
                <h2 className={"text-center uppercase tracking-wide font-bold text-4xl"}>
                    Click<span className="text-green-500">2Eat</span>
                </h2>
                <h3 className="text-xl font-semibold mb-3 text-center">
                    Registrar perfil
                </h3>
            </div>
            <Form {...registerForm}>
                <form className={"flex flex-col gap-5"}>
                    <FormField
                        name={'name'}
                        control={registerForm.control}
                        render={({field}) => (
                            <FormItem className={"flex flex-col justify-center items-center"}>
                                <FormLabel>
                                    Nombre
                                </FormLabel>
                                <FormControl>
                                    <Input className={"w-1/2"}
                                           placeholder={"Nombre"} {...field}/>
                                </FormControl>
                                <FormMessage className={"text-xs text-red-500 font-light"}/>
                            </FormItem>
                        )}/>
                </form>
            </Form>
        </div>
    )
}