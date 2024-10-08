'use client'

import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {SaveIcon} from "lucide-react";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {editCategory} from "@/app/actions/dashboard/category.service";
import {toast} from "sonner";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import useFormData from "@/_lib/_hooks/useFormData";
import {SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {Tables} from "@/types/database/database";
import {useCreateCategory} from "@/lib/hooks/query/useCategory";

enum CategoryStatus {
    draft = "DRAFT",
    published = "PUBLISHED",
    discontinued = "DISCONTINUED"
}

const categorySchema = z.object({
    id: z.string().optional(),
    name: z.string().min(3, {message: 'El nombre debe contener al menos 3 caracteres'}),
    description: z.string().optional(),
    status: z.nativeEnum(CategoryStatus),
    offer: z.string().optional(),
})

export type CategorySchemaDTO = z.infer<typeof categorySchema>;
type CategoryFormProps = {
    category?: Tables<'categories'>
}

export function CreateCategoryForm(props: CategoryFormProps) {
    const queryClient = useQueryClient();
    const createFormData = useFormData<CategorySchemaDTO>();
    const form = useForm<CategorySchemaDTO>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            id: props.category?.id,
            name: props.category?.name,
            description: props.category?.description || '',
            status: props.category ? (props.category.status as CategoryStatus) : CategoryStatus.draft,
            //@ts-ignore
            offer: props.category?.offer ?? ""
        }
    });
    const mutation = useCreateCategory({form});

    const editMutation = useMutation({
        mutationFn: editCategory,
        onError: () => {
            queryClient.invalidateQueries({
                queryKey: ["categories"]
            });
            toast.error('Categoría no editada', {
                description: 'Ha ocurrido un error la editar, si el problema persiste contáctanos.'
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["categories"]
            });
            toast.success('Categoría editada correctamente');
            form.reset();
        }
    })

    const handleSubmit: SubmitHandler<CategorySchemaDTO> = (values: CategorySchemaDTO) => {
        const formData = createFormData(values);
        if (values.id) {
            editMutation.mutate(formData)
        } else {
            mutation.mutate(formData);
        }
    }
    const options = [
        [CategoryStatus.draft, 'Borrador'],
        [CategoryStatus.published, 'Publicado'],
        [CategoryStatus.discontinued, 'Inactivo'],
    ];
    return (
        <>
            <SheetHeader>
                <SheetTitle>
                    Creación de Categoría
                </SheetTitle>
                <SheetDescription>
                    Crea una nueva categoría
                </SheetDescription>
            </SheetHeader>
            <Form {...form}>
                <form encType={'multipart/form-data'} className={'space-y-3 flex flex-col'}
                      onSubmit={form.handleSubmit(handleSubmit)}>
                    <FormField
                        name={'id'}
                        control={form.control}
                        render={({field}) => (
                            <FormItem>
                                <Input className={"hidden"} disabled {...field}/>
                            </FormItem>
                        )}/>
                    <FormField
                        control={form.control}
                        name={'status'}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Estado</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder={'Borrador'}/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {
                                            options.map(([value, text], i) => (
                                                <SelectItem key={i} value={value}
                                                            className={'capitalize'}>{text}</SelectItem>
                                            ))
                                        }

                                    </SelectContent>
                                </Select>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Nombre
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder={'Entrantes, Destacados...'}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                        name={'name'}
                    />
                    <FormField control={form.control} name={'description'} render={({field}) => (
                        <FormItem>
                            <FormLabel>
                                Descripción
                            </FormLabel>
                            <FormControl>
                                <Textarea placeholder={'Disfruta de nuestras bebidas...'} {...field}/>
                            </FormControl>
                        </FormItem>
                    )}/>
                    <FormField
                        name={'offer'}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Oferta
                                </FormLabel>
                                <FormDescription>
                                    El valor es calculado en porcentaje
                                </FormDescription>
                                <FormControl>
                                    <Input
                                        type={"number"}
                                        placeholder={'10, 50'}
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <Button type={"submit"} className={'space-x-3'}>
                        <span>Guardar</span>
                        <SaveIcon/>
                    </Button>
                </form>
            </Form>
        </>
    )
        ;
}