'use client'
import React, {useState} from "react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {z} from "zod";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {registerBusinessLocal} from "@/_request/auth/register";
import {useMutation} from "@tanstack/react-query";

const registerLocalSchema = z.object({
    businessName: z.string({required_error: 'businessName is required'}).min(1),
    abbreviation: z.string().optional(),
    address: z.string({required_error: 'address is required'}).min(1),
    postalCode: z.string().min(4),
    province: z.string({required_error: 'province is required'}).min(1),
    town: z.string({required_error: 'town is required'}).min(1),
    country: z.string({required_error: 'country is required'}).min(1),
    image: z.any()
});

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
            image: undefined
        }
    });
    const [image, setImage] = useState<File | null>(null);

    const createMutation = useMutation({
        mutationFn: registerBusinessLocal,
        onSuccess: async () => {
            toast.success('Registro completado',{
                description: 'En breves segundos serás redirigido a tu panel'
            });
        },
        onError: async (error, variables, context) => {
            toast.success('Error de registro',{
                description: 'Este error ha sido reportado'
            });
        }
    })
    const onSubmit: SubmitHandler<RegisterBusinessLocalDto> = async (values: RegisterBusinessLocalDto) => {
        try {
            const formData = new FormData();
            if (image) {
                formData.append('image', image as File);
            }
            formData.append('businessName', values.businessName)
            formData.append('abbreviation', values.abbreviation || '')
            formData.append('address', values.address)
            formData.append('postalCode', values.postalCode.toString())
            formData.append('province', values.province)
            formData.append('town', values.town)
            formData.append('country', values.country)
            formData.append('image', values.image)

            createMutation.mutate(formData);
        } catch (e) {
            toast.error('Ha ocurrido un error al registrar el usuario');
        }
    }

    return (
        <div className={"space-y-4"}>
            <Form {...businessForm} >
                <form className={"space-y-3"} encType={"multipart/form-data"}
                      onSubmit={businessForm.handleSubmit(onSubmit)}>
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
                                        <Input placeholder={"Mercadona, Primark, CocaCola..."} {...field}/>
                                    </FormControl>
                                    <FormMessage/>
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
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className={"flex flex-col xl:flex-row gap-3"}>
                        <FormField
                            name={"address"}
                            control={businessForm.control}
                            render={({field}) => (
                                <FormItem className={"w-full xl:w-1/2"}>
                                    <FormLabel>
                                        Dirección
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder={"Dirección empresa"} {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        >
                        </FormField>
                        <FormField
                            name={"postalCode"}
                            control={businessForm.control}
                            render={({field}) => (
                                <FormItem className={"w-full xl:w-1/2"}>
                                    <FormLabel>
                                        Código postal
                                    </FormLabel>
                                    <FormControl>
                                        <Input type={"number"} placeholder={"012345"} {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        >
                        </FormField>
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
                                        <Input placeholder={"Murcia"} {...field}/>
                                    </FormControl>
                                    <FormMessage/>
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
                                        <Input placeholder={"Murcia"} {...field}/>
                                    </FormControl>
                                    <FormMessage/>
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
                                        <Input placeholder={"España"} {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        >
                        </FormField>
                    </div>
                    <div className={'flex'}>
                        <FormField
                            name={"image"}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        Imagen
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            onChange={(event) => {
                                                const fileList = event.target.files;
                                                if (fileList && fileList.length) {
                                                    setImage(fileList[0]);
                                                }

                                            }}
                                            type="file"
                                            accept="image/*"
                                            onBlur={field.onBlur}
                                            name={field.name}
                                            ref={field.ref}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button type={"submit"}>Guardar</Button>
                </form>
            </Form>
            <div className='w-full flex justify-center gap-8'>
            </div>
        </div>
    );
}

export default RegisterBusinessLocalForm;