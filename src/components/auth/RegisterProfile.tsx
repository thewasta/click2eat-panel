'use client'
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {ChangeEvent} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {useMutation} from "@tanstack/react-query";
import {registerProfile} from "@/app/actions/auth/register_actions";
import useFormData from "@/_lib/_hooks/useFormData";
import {Button} from "@/components/ui/button";

const profileSchema = z.object({
    name: z.string({
        required_error: 'Name is required'
    }).min(1, {
        message: 'Name is required'
    }),
    lastname: z.string({
        required_error: 'Name is required'
    }).min(1, {
        message: 'Name is required'
    }),
    // image: z.array(z.instanceof(File)),
    avatar: z.instanceof(File).optional(),
})

export type RegisterProfileDTO = z.infer<typeof profileSchema>;
export default function RegisterProfile() {
    const createFormData = useFormData<RegisterProfileDTO>();
    const mutation = useMutation({
        mutationFn: registerProfile
    })
    const registerForm = useForm<RegisterProfileDTO>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: '',
            lastname: '',
            avatar: undefined
        }
    })

    const onSubmit: SubmitHandler<RegisterProfileDTO> = (values: RegisterProfileDTO) => {
        const formData = createFormData(values);
        mutation.mutate(formData);
    }

    return <Form {...registerForm}>
        <form onSubmit={registerForm.handleSubmit(onSubmit)} className={"flex flex-col gap-5"}>
            <div className={"flex flex-col xl:flex-row gap-3"}>
                <FormField
                    name={'name'}
                    control={registerForm.control}
                    render={({field}) => (
                        <FormItem className={"w-full xl:w-1/2"}>
                            <FormLabel>
                                Nombre
                            </FormLabel>
                            <FormControl>
                                <Input placeholder={"María"} {...field}/>
                            </FormControl>
                            <FormMessage className={"text-xs text-red-500 font-light"}/>
                        </FormItem>
                    )}/>
                <FormField
                    name={'lastname'}
                    control={registerForm.control}
                    render={({field}) => (
                        <FormItem className={"w-full xl:w-1/2"}>
                            <FormLabel>
                                Apellido
                            </FormLabel>
                            <FormControl>
                                <Input placeholder={"Domingo"} {...field}/>
                            </FormControl>
                            <FormMessage className={"text-xs text-red-500 font-light"}/>
                        </FormItem>
                    )}/>
            </div>
            <FormField
                name={"avatar"}
                render={({field: {ref, name, onChange, onBlur}}) => (
                    <FormItem>
                        <FormLabel>
                            Avatar
                        </FormLabel>
                        <FormControl>
                            <Input
                                accept={'image/*'}
                                type={"file"}
                                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                    const filesArray = event.target.files?.[0];
                                    if (filesArray) {
                                        onChange(filesArray)
                                    }
                                }}
                                ref={ref}
                                name={name}
                                onBlur={onBlur}
                            />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
            />
            <Button type={'submit'}>
                Crear perfil
            </Button>
        </form>
    </Form>
}