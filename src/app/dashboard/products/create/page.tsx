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
import React, {ChangeEvent, useEffect} from "react";
import {Tables} from "@/types/database/database";
import {retrieve as categoryRetrieve} from "@/app/actions/category/category.service";
import {Button} from "@/components/ui/button";
import {Switch} from "@/components/ui/switch";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import {format} from "date-fns";
import {es} from 'date-fns/locale'
import {Calendar} from "@/components/ui/calendar";
import {CalendarIcon} from "lucide-react";

export default function CreateProductPage()  {
    const queryClient = useQueryClient();

    const {data: categories, error: categoriesError} = useQuery<Tables<'category'>[]>({
        queryKey: ["categories"],
        queryFn: async () => categoryRetrieve(),
        refetchInterval: 120 * 1000, // Every minutes
        retry: true,
    });

    useEffect(() => {
        if (categoriesError === null) {
            queryClient.invalidateQueries({
                queryKey: ["categories"]
            });
            queryClient.refetchQueries({
                queryKey: ["categories"]
            });
        }
    }, [categoriesError])
    const form = useForm<CreateProductDTO>({
        resolver: zodResolver(createProductSchema),
        defaultValues: {
            name: '',
            description: '',
            images: undefined,
            price: 0,
            category: '',
            subCategory: '',
            offerPrice: 0,
            highlight: false,
            status: '',
            publishDate: undefined,
        }
    });

    const createMutation = useMutation({
        mutationFn: create,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['products']
            });
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
                <Button onClick={form.handleSubmit(onSubmit)}>
                    Publicar
                </Button>
            </section>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} encType={"multipart/form-data"}
                      className={"space-y-5"}>
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
                            control={form.control}
                            name="publishDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="pr-4">Programar publicación</FormLabel>
                                    <Popover
                                    >
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        'w-full pl-3 text-left font-normal',
                                                        !field.value && 'text-muted-foreground',
                                                    )}
                                                >
                                                    {field.value ? (
                                                        `${field.value.toLocaleString([])}`
                                                    ) : (
                                                        <span>01/01/2024, 0:00:00</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <Calendar
                                                locale={es}
                                                className="p-0 capitalize"
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) => date < new Date()}
                                                initialFocus
                                            />
                                            <Input
                                                type="time"
                                                className="mt-2"
                                                // take hours and minutes and update our Date object then change date object to our new value
                                                onChange={(selectedTime) => {
                                                    const currentTime = field.value;
                                                    currentTime?.setHours(
                                                        parseInt(selectedTime.target.value.split(':')[0]),
                                                        parseInt(selectedTime.target.value.split(':')[1]),
                                                        0,
                                                    );
                                                    field.onChange(currentTime);
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                    <FormDescription>
                                        Fecha y hora a partir de la que estará disponible el producto.
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
                        <FormField
                            name={'price'}
                            control={form.control}
                            render={({field}) => (
                                <FormItem
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
                            name={'status'}
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
                                                <SelectItem value={'DRAFT'}>
                                                    Borrador
                                                </SelectItem>
                                                <SelectItem value={'PUBLISHED'}>
                                                    Activo
                                                </SelectItem>
                                                <SelectItem value={'DISCONTINUED'}>
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
                            name={'offerPrice'}
                            control={form.control}
                            render={({field}) => (
                                <FormItem
                                    className={'w-full md:w-1/6'}
                                >
                                    <FormLabel>
                                        Oferta
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            required={false}
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
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        name={"images"}
                        render={({field: {ref, name, onChange, onBlur}}) => (
                            <FormItem>
                                <FormLabel>
                                    Imagen
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        multiple
                                        accept={'image/*'}
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
            {
                JSON.stringify(form.formState.errors) ?? ''
            }
        </div>
    )
}