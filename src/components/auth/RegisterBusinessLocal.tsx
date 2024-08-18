'use client'
import React from "react";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {useMutation} from "@tanstack/react-query";
import {z} from "zod";
import {registerBusinessLocal} from "@/app/actions/auth/register_actions";
import {Switch} from "@/components/ui/switch";
import useFormData from "@/_lib/_hooks/useFormData";

const registerLocalSchema = z.object({
    businessInfo: z.boolean(),
    abbreviation: z.string().optional(),
    // image: z.instanceof(File).optional(),
    timeZone: z.number()
}).and(
    z.union([
        z.object({
            businessInfo: z.literal(false),
            businessName: z.string({required_error: 'businessName is required'}).min(1),
            address: z.string({required_error: 'address is required'}).min(1),
            postalCode: z.string().min(4),
            province: z.string({required_error: 'province is required'}).min(1),
            town: z.string({required_error: 'town is required'}).min(1),
            country: z.string({required_error: 'country is required'}).min(1),
        }),
        z.object({
            businessInfo: z.literal(true),
        }),
    ])
);

export type RegisterBusinessLocalDto = z.infer<typeof registerLocalSchema>;

export function RegisterBusinessLocalForm() {
    const businessForm = useForm<RegisterBusinessLocalDto>({
        resolver: zodResolver(registerLocalSchema),
        defaultValues: {
            businessName: '',
            abbreviation: '',
            address: '',
            postalCode: '',
            province: '',
            town: '',
            country: '',
            // image: undefined
            timeZone: new Date().getTimezoneOffset() / 60
        }
    });

    const createFormData = useFormData<RegisterBusinessLocalDto>();
    const mutation = useMutation({
        mutationFn: registerBusinessLocal,
        onError: () => {
            toast.error('No se ha podido finalizar el registro', {
                description: 'Si el problema persiste, por favor, ponte en contacto con nosotros'
            });
        }
    })
    const onSubmit: SubmitHandler<RegisterBusinessLocalDto> = async (values: RegisterBusinessLocalDto) => {
        const formData = createFormData(values);
        mutation.mutate(formData)
    }

    const businessInfoValue = businessForm.watch('businessInfo');

    return (
        <div className={"space-y-4"}>
            <Form {...businessForm} >
                <form className={"space-y-3"} encType={"multipart/form-data"}
                      onSubmit={businessForm.handleSubmit(onSubmit)}>
                    <FormField
                        name={'businessInfo'}
                        control={businessForm.control}
                        render={({field}) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Información de Empresa</FormLabel>
                                    <FormDescription>
                                        Usar la información de la empresa para crear el local.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <div className={"flex flex-col xl:flex-row gap-3"}>
                        <FormField
                            name={"businessName"}
                            control={businessForm.control}
                            render={({field}) => (
                                <FormItem className={"w-full xl:w-1/3"}>
                                    <FormLabel>
                                        Nombre empresa
                                    </FormLabel>
                                    <FormControl>
                                        <Input disabled={businessInfoValue}
                                               placeholder={"Mercadona, Primark, CocaCola..."} {...field}/>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            name={'abbreviation'}
                            control={businessForm.control}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        Abreviación
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder={'EMP'} {...field}/>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className={"flex flex-col xl:flex-row gap-3"}>
                        <FormField
                            name={"address"}
                            control={businessForm.control}
                            render={({field}) => (
                                <FormItem className={"w-full xl:w-1/3"}>
                                    <FormLabel>
                                        Dirección
                                    </FormLabel>
                                    <FormControl>
                                        <Input disabled={businessInfoValue}
                                               placeholder={"Dirección empresa"} {...field}/>
                                    </FormControl>
                                </FormItem>
                            )}
                        >
                        </FormField>
                        <FormField
                            name={"postalCode"}
                            control={businessForm.control}
                            render={({field}) => (
                                <FormItem className={"w-full xl:w-1/3"}>
                                    <FormLabel>
                                        Código postal
                                    </FormLabel>
                                    <FormControl>
                                        <Input disabled={businessInfoValue} type={"number"}
                                               placeholder={"012345"} {...field}/>
                                    </FormControl>
                                </FormItem>
                            )}
                        >
                        </FormField>
                        <FormField
                            name={"timeZone"}
                            control={businessForm.control}
                            render={({field}) => (
                                <FormItem className={"w-full xl:w-1/3"}>
                                    <FormLabel>
                                        Zona Horaria
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder={"-2,-1,0,+1,+2,"} {...field}/>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className={"flex flex-col xl:flex-row gap-3"}>
                        <FormField
                            name={"province"}
                            control={businessForm.control}
                            render={({field}) => (
                                <FormItem className={"w-full xl:w-1/3"}>
                                    <FormLabel>
                                        Provincia
                                    </FormLabel>
                                    <FormControl>
                                        <Input disabled={businessInfoValue} placeholder={"Murcia"} {...field}/>
                                    </FormControl>
                                </FormItem>
                            )}
                        >
                        </FormField>
                        <FormField
                            name={"town"}
                            control={businessForm.control}
                            render={({field}) => (
                                <FormItem className={"w-full xl:w-1/3"}>
                                    <FormLabel>
                                        Localidad
                                    </FormLabel>
                                    <FormControl>
                                        <Input disabled={businessInfoValue} placeholder={"Murcia"} {...field}/>
                                    </FormControl>
                                </FormItem>
                            )}
                        >
                        </FormField>
                        <FormField
                            name={"country"}
                            control={businessForm.control}
                            render={({field}) => (
                                <FormItem className={"w-full xl:w-1/3"}>
                                    <FormLabel>
                                        País
                                    </FormLabel>
                                    <FormControl>
                                        <Input disabled={businessInfoValue} placeholder={"España"} {...field}/>
                                    </FormControl>
                                </FormItem>
                            )}
                        >
                        </FormField>
                    </div>
                    {/*<div className={'flex'}>*/}
                    {/*    <FormField*/}
                    {/*        name={"image"}*/}
                    {/*        render={({field: {onChange, ref, onBlur, name}}) => (*/}
                    {/*            <FormItem>*/}
                    {/*                <FormLabel>*/}
                    {/*                    Imagen*/}
                    {/*                </FormLabel>*/}
                    {/*                <FormControl>*/}
                    {/*                    <Input*/}
                    {/*                        onChange={(event) => {*/}
                    {/*                            const fileList = event.target.files;*/}
                    {/*                            if (fileList && fileList.length) {*/}
                    {/*                                onChange(fileList[0])*/}
                    {/*                            }*/}
                    {/*                        }}*/}
                    {/*                        type="file"*/}
                    {/*                        accept="image/*"*/}
                    {/*                        onBlur={onBlur}*/}
                    {/*                        name={name}*/}
                    {/*                        ref={ref}*/}
                    {/*                    />*/}
                    {/*                </FormControl>*/}
                    {/*                <FormMessage/>*/}
                    {/*            </FormItem>*/}
                    {/*        )}*/}
                    {/*    />*/}
                    {/*</div>*/}
                    {
                        !businessForm.formState.isValid &&
                        <FormMessage>* Rellena los campos necesarios</FormMessage>
                    }
                    <Button type={"submit"}>Registrar Local</Button>
                </form>
            </Form>
        </div>
    );
}

export default RegisterBusinessLocalForm;