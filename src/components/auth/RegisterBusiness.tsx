import React from "react";
import {Form} from "@/components/ui/form";
import {useRegisterAccountContext} from "@/lib/context/auth/register-account-context";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button";
import {registerBusinessSchema, RegisterFormSchema} from "@/types/validation/registerBusinessFormValidation";
import {AppFormField} from "@/components/products/app-form-field";

export default function RegisterBusinessForm() {
    const formContext = useRegisterAccountContext();

    const businessForm = useForm<RegisterFormSchema>({
        resolver: zodResolver(registerBusinessSchema),
        defaultValues: {
            businessName: formContext.propertyForm?.businessName,
            document: formContext.propertyForm?.document,
            address: formContext.propertyForm?.address,
            postalCode: formContext.propertyForm?.postalCode,
            province: formContext.propertyForm?.province,
            town: formContext.propertyForm?.town,
            country: formContext.propertyForm?.country,
            timeZone: new Date().getTimezoneOffset() / 60
        }
    });
    const onSubmit: SubmitHandler<RegisterFormSchema> = (values: RegisterFormSchema) => {
        formContext.updatePropertyForm(values);
        formContext.onHandleNext();
    }

    return (
        <div className={"space-y-4"}>
            <Form {...businessForm} >
                <form className={"space-y-3"}>
                    <div className={"flex flex-col xl:flex-row gap-3"}>
                        <AppFormField
                            name={'businessName'}
                            label={'Nombre empresa'}
                            formItemStyles={'w-full xl:w-1/2'}
                            placeholder={'Razón social'}
                        />
                        <AppFormField
                            name={'document'}
                            label={'NIF'}
                            placeholder={'DNI/NIF'}
                            formItemStyles={'w-full xl:w-1/2'}
                        />
                    </div>
                    <div className={"flex flex-col xl:flex-row gap-3"}>
                        <AppFormField
                            name={'address'}
                            label={'Dirección'}
                            formItemStyles={'w-full xl:w-1/3'}
                            placeholder={'Dirección empresa'}
                        />
                        <AppFormField
                            name={'postalCode'}
                            type={'number'}
                            label={'Código postal'}
                            placeholder={'Código postal'}
                            formItemStyles={'w-full xl:w-1/3'}
                        />
                        <AppFormField
                            name={'province'}
                            placeholder={'Provincia'}
                            label={'Provincia'}
                            formItemStyles={'w-full xl:w-1/3'}
                        />
                    </div>
                    <div className={"flex flex-col xl:flex-row gap-3"}>
                        <AppFormField
                            name={'timezone'}
                            label={'Zona Horaria'}
                            formItemStyles={'w-full xl:w-1/3'}
                            defaultValue={businessForm.getValues().timeZone}
                            placeholder={'-2,-1,0,+1,+2,'}
                        />
                        <AppFormField
                            name={'town'}
                            label={'Localidad'}
                            placeholder={'Localidad'}
                            formItemStyles={'w-full xl:w-1/3'}
                        />
                        <AppFormField
                            name={'country'}
                            label={'País'}
                            placeholder={'País'}
                            formItemStyles={'w-full xl:w-1/3'}
                        />
                    </div>
                </form>
            </Form>
            <div className='w-full flex justify-center gap-8'>
                <Button type={"button"} onClick={businessForm.handleSubmit(onSubmit)}>Siguiente</Button>
            </div>
        </div>
    );
}