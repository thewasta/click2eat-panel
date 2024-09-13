'use client'

import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {SaveIcon} from "lucide-react";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {CreateProductDTO, createProductSchema} from "@/_lib/dto/productFormDto";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {ChangeEvent, useState} from "react";
import {Switch} from "@/components/ui/switch";
import {toast} from "sonner";
import {Tables} from "@/types/database/database";
import {ProductCalendar} from "@/components/form/product/productCalendar";
import {ProductFormVariants} from "@/components/form/product/productFormVariants";
import useFormData from "@/_lib/_hooks/useFormData";
import {ProductFormIngredients} from "@/components/form/product/productFormIngredients";
import {ProductFormCategories} from "@/components/form/product/productFormCategories";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createProduct} from "@/app/actions/dashboard/product.service";
import {LoadingSkeleton} from "@/app/(dashboard)/products/create/loadingSkeleton";

type SubCategory = Tables<'sub_categories'>
type CategoryWithSubCategories = Tables<'categories'> & {
    sub_categories: SubCategory[]
}

interface IEditProductForm<T> {
    product: Tables<'products'> | null,
    categories: CategoryWithSubCategories[],
    subcategories: Tables<'sub_categories'>[],
    isLoading: boolean
}

enum ProductStatus {
    draft = "DRAFT",
    published = "PUBLISHED",
    discontinued = "DISCONTINUED"
}

type Variant = {
    name: string;
    price: number | undefined;
    isRequired: boolean;
}
type VariantGroup = {
    name: string;
    variants: Variant[]
}

export default function ProductForm<T>({product, categories, subcategories, isLoading}: IEditProductForm<T>) {
    const createFormData = useFormData<CreateProductDTO>();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            toast.success('Se ha creado correctamente');
        },
        onError: (error) => {
            toast.error('No se ha podido crear', {
                description: `Motivo: ${error.message}`
            })
        },
        onSettled: () => {
            form.reset();
            setVariantGroups([]);
            queryClient.invalidateQueries({
                queryKey: ["products"],
                refetchType: 'all'
            });
        }
    })

    const submitHandler: SubmitHandler<CreateProductDTO> = async (values: CreateProductDTO, event) => {
        const formData = createFormData({
            ...values,
            variantGroups: variantGroups
        });

        mutation.mutate(formData);
    }

    const form = useForm<CreateProductDTO>({
        resolver: zodResolver(createProductSchema),
        defaultValues: {
            productName: product?.name || '',
            description: product?.description || '',
            images: undefined,
            // @ts-ignore
            ingredients: product?.ingredients ? [] : [],
            price: product?.price || 0,
            category: product?.category_id || undefined,
            subCategory: product?.sub_category_id || undefined,
            offerPrice: product?.offer || undefined,
            highlight: product?.highlight || false,
            status: product?.status ? (product.status as ProductStatus) : ProductStatus.draft,
            publishDate: product?.publish_date ? new Date(product?.publish_date) : undefined,
        },
    });
    const ingredients = form.watch('ingredients');

    const handleAddIngredient = (newIngredient: string) => {
        if (ingredients === undefined) return;
        console.log(ingredients, newIngredient);
        if (ingredients.length >= 6) {
            toast.warning('Máximo de ingredientes alcanzado', {
                description: 'No es posible añadir más de 6 ingredientes por producto. Si requieres más, contacta con soporte',
            });
            return;
        }
        if (newIngredient && !ingredients.includes(newIngredient.toLowerCase())) {
            form.setValue('ingredients', [...ingredients, newIngredient]);
        } else if (newIngredient) {
            toast.warning('Ingrediente ya existe para este producto');
        }
    };

    const handleRemoveIngredient = (ingredientToRemove: string) => {
        form.setValue('ingredients', ingredients?.filter((i) => i !== ingredientToRemove));
    }

    const options = [
        [ProductStatus.discontinued, 'Inactivo'],
        [ProductStatus.published, 'Publicado'],
        [ProductStatus.draft, 'Borrador'],
    ];

    const [variantGroups, setVariantGroups] = useState<VariantGroup[]>([]);

    const productSaveActions = () => {
        return product ?
            (
                <div className={'space-x-2 flex items-center'}>
                    <ProductFormVariants variantGroups={variantGroups} setVariantGroups={setVariantGroups}/>
                    <Button type={"submit"} disabled={isLoading}>
                        Guardar Cambios
                    </Button>
                </div>
            ) :
            (
                <div className={'space-x-2 flex items-center'}>
                    <ProductFormVariants variantGroups={variantGroups} setVariantGroups={setVariantGroups}/>
                    <Button name={'draft'} variant={'ghost'} type={"submit"} disabled={isLoading}>
                        <SaveIcon className={'mr-1'}/>
                        Guardar borrador
                    </Button>
                    <Button type={"submit"} name={'publish'} disabled={isLoading}>
                        Publicar
                    </Button>
                </div>
            )

    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(submitHandler)}
                  encType={"multipart/form-data"}
                  className={"space-y-5 p-1"}>
                <section className={'flex justify-end mb-3'}>
                    {productSaveActions()}
                </section>
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
                        name={"productName"}
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
                    <ProductCalendar form={form}/>
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
                                <Select required
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder={"Seleccionar Estado"}/>
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
                    {
                        isLoading ? (
                            <LoadingSkeleton/>
                        ) : (
                            <>
                                <ProductFormCategories
                                    options={categories}
                                    label={'Categorías'}
                                    name={'category'}
                                    placeholder={'Selecciona categoría'}
                                    control={form.control}
                                    setValue={form.setValue}
                                />
                                <ProductFormCategories name={'subCategory'} label={'Sub categoría'}
                                                       options={subcategories}
                                                       control={form.control} setValue={form.setValue}
                                                       placeholder={'Seleccionar sub categoría'}/>
                            </>
                        )
                    }

                </div>
                <div className={'flex flex-col xl:flex-row gap-3'}>
                    <FormField
                        name={"description"}
                        render={({field}) => (
                            <FormItem className={'w-1/3'}>
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
                    <ProductFormIngredients handleAddIngredient={handleAddIngredient}
                                            handleRemoveIngredient={handleRemoveIngredient}/>
                </div>
                <FormField
                    name={"images"}
                    render={({field: {ref, name, onChange, onBlur}, fieldState: {error}}) => (
                        <FormItem>
                            <FormLabel>
                                Imagen
                            </FormLabel>
                            <FormDescription>
                                El archivo debe ser inferior a 100KB
                            </FormDescription>
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
                            {error && Array.isArray(error) ? (
                                error.map((err, index) => (
                                    <p key={index} className={'text-destructive'}>{err.message}</p>
                                ))
                            ) : error ? (
                                <p className={'text-destructive'}>{error.message}</p>
                            ) : null}
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
}