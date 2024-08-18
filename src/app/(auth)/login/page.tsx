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
                <LoginForm/>
            </div>
        </>
    );
}
