'use client'

import {Button} from "@/components/ui/button";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Switch} from "@/components/ui/switch";
import {Input} from "@/components/ui/input";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import {CalendarIcon, SaveIcon} from "lucide-react";
import {Calendar} from "@/components/ui/calendar";
import {es} from "date-fns/locale";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {CategoryItemInput} from "@/app/dashboard/products/components/categoryItemInput";
import {Textarea} from "@/components/ui/textarea";
import React, {ChangeEvent} from "react";
import {Database} from "@/types/database/database";
import {useForm} from "react-hook-form";
import {CreateProductDTO, createProductSchema} from "@/app/dashboard/products/formValidation";
import {zodResolver} from "@hookform/resolvers/zod";
import ImageCropper from "@/components/imageCropper";
import {Card, CardContent} from "@/components/ui/card";

interface IEditProductForm<T> {
    product: Database["public"]["Tables"]["product"]["Row"] | null,
    submitHandler: (values: T) => void,
    isEdit: boolean,
    categories: Database["public"]["Tables"]["category"]["Row"][]
}

export default function ProductForm<T>({product, submitHandler, isEdit, categories}: IEditProductForm<T>) {
    const form = useForm<CreateProductDTO>({
        resolver: zodResolver(createProductSchema),
        defaultValues: {
            name: product?.name,
            description: product?.description,
            images: undefined,
            price: product?.price,
            category: product?.category,
            subCategory: product?.sub_category ?? undefined,
            offerPrice: product?.offer_price ?? undefined,
            highlight: product?.highlight,
            status: product?.status,
            publishDate: product?.publish_date ? new Date(product?.publish_date) : undefined,
        }
    });
    return (
        <div>
            <section className={'flex gap-2 justify-end mb-3'}>
                {
                    isEdit ?
                        (
                            <Button>
                                <SaveIcon className={'mr-3'}/>
                                Guardar Cambios
                            </Button>
                        ) :
                        (
                            <>
                                <Button variant={'ghost'} className={'flex gap-2 items-center'}>
                                    <SaveIcon/>
                                    Guardar borrador
                                </Button>
                                {/*@ts-ignore*/}
                                <Button onClick={form.handleSubmit(submitHandler)}>
                                    Publicar
                                </Button>
                            </>
                        )
                }
            </section>
            <Form {...form}>
                {/*@ts-ignore*/}
                <form onSubmit={form.handleSubmit(submitHandler)} encType={"multipart/form-data"}
                      className={"space-y-5 px-1"}>
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
                            render={({field}) => (
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
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
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
                                    <FormMessage/>
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
                    <ImageCropper/>
                </form>
            </Form>
        </div>
    );
}