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
import {createProduct, editProduct} from "@/app/actions/dashboard/product.service";
import {LoadingSkeleton} from "@/app/(dashboard)/products/create/loadingSkeleton";
import {formDateFromUtc} from "@/_lib/_hooks/formDateFromUtc";

type SubCategory = Tables<'sub_categories'>
type CategoryWithSubCategories = Tables<'categories'> & {
    sub_categories: SubCategory[]
}

interface IEditProductForm<T> {
    product: Tables<'products'> | null;
    categories: CategoryWithSubCategories[];
    isLoading: boolean;
    isProductLoading?: boolean;
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

export default function ProductForm<T>({product, categories, isLoading, isProductLoading}: IEditProductForm<T>) {
    const createFormData = useFormData<CreateProductDTO>();
    const queryClient = useQueryClient();
    const defaultValues = {
        productName: '',
        description: '',
        images: undefined,
        ingredients: [],
        price: undefined,
        category: undefined,
        subCategory: undefined,
        offerPrice: undefined,
        highlight: false,
        status: ProductStatus.draft,
        publishDate: undefined,
    };
    const isEdit = !!product;
    const [formKey, setFormKey] = useState(0);

    const mutation = useMutation({
        mutationFn: isEdit ? editProduct : createProduct,
        onSuccess: (data) => {
            if (isEdit) {
                const localPublishDate = data.publish_date
                    ? formDateFromUtc(data.publish_date)
                    : undefined;
                form.reset({
                    subCategory: data.sub_category_id || undefined,
                    category: data.category_id,
                    //images: data?.images ?? undefined,
                    description: data.description as string,
                    highlight: data.highlight,
                    productName: data.name,
                    ingredients: [],
                    price: data.price,
                    productId: data.id,
                    offerPrice: data.offer as number,
                    status: data.status as ProductStatus,
                    publishDate: localPublishDate ? new Date(localPublishDate) : undefined,
                    variantGroups: []
                });
                toast.success('Se ha editado correctamente');
            } else {
                form.reset(defaultValues);

                toast.success('Se ha creado correctamente');
            }

        },
        onError: (error) => {
            toast.error('No se ha podido crear', {
                description: `Motivo: ${error.message}`
            })
        },
        onSettled: () => {
            setFormKey(prev => prev + 1);
            setVariantGroups([]);
            queryClient.invalidateQueries({
                queryKey: ["products"],
                refetchType: 'all'
            });
        }
    })

    const submitHandler: SubmitHandler<CreateProductDTO> = async (values: CreateProductDTO, event) => {
        if (values.subCategory === "0") values.subCategory = undefined;
        const formData = createFormData({
            ...values,
            variantGroups: variantGroups,
            productId: product?.id
        });

        if (isEdit && product) {
            mutation.mutate(formData);
        } else {
            mutation.mutate(formData);
        }
    }

    const form = useForm<CreateProductDTO>({
        resolver: zodResolver(createProductSchema),
        defaultValues: product ? {
            productName: product?.name || '',
            description: product?.description || '',
            images: undefined,
            // @ts-ignore
            ingredients: product?.ingredients ? [] : [],
            price: product?.price || undefined,
            category: product?.category_id || undefined,
            subCategory: product?.sub_category_id || undefined,
            offerPrice: product?.offer || undefined,
            highlight: product?.highlight || false,
            status: product?.status ? (product.status as ProductStatus) : ProductStatus.draft,
            publishDate: product?.publish_date ? new Date(product?.publish_date) : undefined,
        } : defaultValues,
    });

    const ingredients = form.watch('ingredients');

    const handleAddIngredient = (newIngredient: string) => {
        if (ingredients === undefined) return;
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

    if (isProductLoading) {
        return <LoadingSkeleton/>
    }
    return (
        <div className={'w-full'}>
            <Form {...form}>
                <form key={formKey} onSubmit={form.handleSubmit(submitHandler)}
                      encType={"multipart/form-data"}
                      className={"space-y-5 p-1 w-full"}>
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
                                        categories={categories}
                                        watch={form.watch}
                                        control={form.control}
                                        setValue={form.setValue}
                                    />
                                </>
                            )
                        }

                    </div>
                    <div className={'flex flex-col xl:flex-row gap-3'}>
                        <FormField
                            name={"description"}
                            render={({field}) => (
                                <FormItem className={'w-full md:w-1/3'}>
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
        </div>
    );
}