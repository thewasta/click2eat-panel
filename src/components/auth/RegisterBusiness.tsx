import React from "react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useRegisterAccountContext} from "@/lib/context/auth/register-account-context";
import {z} from "zod";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

const RegisterBusinessForm = () => {
    const formContext = useRegisterAccountContext();
    const registerBusiness = z.object({
        businessName: z.string({required_error: 'businessName is required'}).min(1),
        document: z.string({required_error: 'document is required'}).min(1),
        address: z.string({required_error: 'address is required'}).min(1),
        postalCode: z.number({required_error: 'postalCode is required'}).min(4),
        province: z.string({required_error: 'province is required'}).min(1),
        town: z.string({required_error: 'town is required'}).min(1),
        country: z.string({required_error: 'country is required'}).min(1),
    });

    const businessForm = useForm<z.infer<typeof registerBusiness>>({
        resolver: zodResolver(registerBusiness),
        defaultValues: {
            businessName: formContext.propertyForm?.businessName,
            document: formContext.propertyForm?.document,
            address: formContext.propertyForm?.address,
            postalCode: formContext.propertyForm?.postalCode,
            province: formContext.propertyForm?.province,
            town: formContext.propertyForm?.town,
            country: formContext.propertyForm?.country,
        }
    });
    const onSubmit: SubmitHandler<z.infer<typeof registerBusiness>> = (values: z.infer<typeof registerBusiness>) => {
        formContext.updatePropertyForm(values);
        formContext.onHandleNext();
    }

    return (
        <div className={"space-y-4"}>
            <Form {...businessForm} >
                <form className={"space-y-3"}>
                    <div className={"flex flex-col xl:flex-row gap-3"}>
                        <FormField
                            name={"businessName"}
                            control={businessForm.control}
                            render={({field}) => (
                                <FormItem className={"w-full xl:w-1/2"}>
                                    <FormLabel>
                                        Nombre empresa
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder={"Razón social"} {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            name={"document"}
                            control={businessForm.control}
                            render={({field}) => (
                                <FormItem className={"w-full xl:w-1/2"}>
                                    <FormLabel>
                                        NIF
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder={"DNI/NIF"} {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        >
                        </FormField>
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
                                        <Input type={"number"} placeholder={"Código postal"} {...field}/>
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
                                        <Input placeholder={"Provincia"} {...field}/>
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
                                        <Input placeholder={"Localidad"} {...field}/>
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
                                        <Input placeholder={"País"} {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        >
                        </FormField>
                    </div>
                </form>
            </Form>
            <div className='w-full flex justify-center gap-8'>
                <Button type={"button"} onClick={businessForm.handleSubmit(onSubmit)}>Siguiente</Button>
            </div>
        </div>
    );
}

export default RegisterBusinessForm;