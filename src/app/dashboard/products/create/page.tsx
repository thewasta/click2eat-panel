'use client'

import {SubmitHandler, useForm} from "react-hook-form";
import {type CreateProductDTO, createProductSchema} from "@/app/dashboard/products/formValidation";
import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {create} from "@/app/actions/product/product.service";
import {toast} from "sonner";
import useFormData from "@/_lib/_hooks/useFormData";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {CategoryItemInput} from "@/app/dashboard/products/components/categoryItemInput";
import {Textarea} from "@/components/ui/textarea";
import {ChangeEvent} from "react";
import {Tables} from "@/types/database/database";
import {retrieve as categoryRetrieve} from "@/app/actions/category/category.service";
import {Button} from "@/components/ui/button";
import {Switch} from "@/components/ui/switch";

export default function CreateProductPage()  {
    const queryClient = useQueryClient();

    const {data: categories, error: categoriesError} = useQuery<Tables<'category'>[]>({
        queryKey: ["categories"],
        queryFn: async () => categoryRetrieve(),
        refetchInterval: 120 * 1000, // Every minutes
        retry: true,
    });

    const form = useForm<CreateProductDTO>({
        resolver: zodResolver(createProductSchema),
        defaultValues: {
            name: '',
            description: '',
            image: undefined,
            price: 0,
            category: '',
            subCategory: '',
            offerPrice: 0,
            highlight: false,
            status: ''
        }
    });

    const createMutation = useMutation({
        mutationFn: create,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['products']
            });
            form.reset({}, {keepValues: false});

            toast.success("Creado correctamente");
        },
        onError: (error, variables, context) => {
            toast.error("No ha sido posible crear el producto.", {
                description: error.message
            });
        },
    });

    const createFormData = useFormData<CreateProductDTO>();

    const onSubmit: SubmitHandler<CreateProductDTO> = async (values: CreateProductDTO) => {
        const formData = createFormData(values);
        createMutation.mutate(formData);
    }

    return (
        <div>
            <section className={'flex justify-end mb-3'}>
                <Button variant={'ghost'}>
                    Guardar borrador
                </Button>
                <Button>
                    Publicar
                </Button>
            </section>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} encType={"multipart/form-data"}
                      className={"space-y-3"}>
                    <FormField
                        name={'highlight'}
                        control={form.control}
                        render={({field}) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Destacado 0/4</FormLabel>
                                    <FormDescription>
                                        Este producto se mostrará entre los primeros
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
                    <div className={'flex flex-col xl:flex-row gap-3'}>
                        <FormField
                            name={"name"}
                            control={form.control}
                            render={({field}) => (
                                <FormItem
                                    className={'w-full md:w-2/6'}
                                >
                                    <FormLabel>
                                        Nombre
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={"Nombre"}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            name={"category"}
                            control={form.control}
                            render={({field}) => (
                                <FormItem
                                    className={'w-full md:w-2/6'}
                                >
                                    <FormLabel>
                                        Categoría
                                    </FormLabel>
                                    <Select required onValueChange={(value) => form.setValue('category', value)}
                                            defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={"Selecciona Categoría"}/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value={"0"}>Seleccionar categoría</SelectItem>
                                                {
                                                    categories &&
                                                    categories.map((category, index) => (
                                                        <CategoryItemInput {...category} key={index}/>
                                                    ))
                                                }
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            name={"status"}
                            control={form.control}
                            render={({field}) => (
                                <FormItem
                                    className={'w-full md:w-2/6'}
                                >
                                    <FormLabel>
                                        Estado
                                    </FormLabel>
                                    <Select required onValueChange={(value) => form.setValue('status', value)}
                                            defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={"Selecciona estado"}/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value={"0"}>Seleccionar Estado</SelectItem>
                                                <SelectItem value={'1'}>
                                                    Borrador
                                                </SelectItem>
                                                <SelectItem value={'2'}>
                                                    Activo
                                                </SelectItem>
                                                <SelectItem value={'3'}>
                                                    Descatalogado
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className={'flex flex-col xl:flex-row gap-3'}>
                        <FormField
                            name={"price"}
                            control={form.control}
                            render={({field}) => (
                                <FormItem
                                    className={'w-full md:w-1/6'}
                                >
                                    <FormLabel>
                                        Precio
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            autoComplete={"off"}
                                            type={"number"}
                                            placeholder={"Precio"}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            name={"subCategory"}
                            control={form.control}
                            render={({field}) => (
                                <FormItem
                                    className={'w-full md:w-2/6'}
                                >
                                    <FormLabel>
                                        Sub-Categoría
                                    </FormLabel>
                                    <Select required onValueChange={(value) => form.setValue('category', value)}
                                            defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={"Selecciona Sub-Categoría"}/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value={"0"}>Seleccionar categoría</SelectItem>
                                                {
                                                    categories &&
                                                    categories.map((category, index) => (
                                                        <CategoryItemInput {...category} key={index}/>
                                                    ))
                                                }
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        name={"description"}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Descripción
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Breve descripción de producto"
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        name={"image"}
                        render={({field: {ref, name, onChange, onBlur}}) => (
                            <FormItem>
                                <FormLabel>
                                    Imagen
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        multiple
                                        accept={'image/*'}
                                        required
                                        type={"file"}
                                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                            const filesArray = Array.from(event.target.files || []);
                                            onChange(filesArray)
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
                </form>
            </Form>
        </div>
    )
}