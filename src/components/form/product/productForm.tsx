'use client'

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {ChevronDown, SaveIcon} from "lucide-react";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {CreateProductDTO, createProductSchema} from "@/_lib/dto/productFormDto";
import {Textarea} from "@/components/ui/textarea";
import {useState} from "react";
import {Switch} from "@nextui-org/switch";
import {toast} from "sonner";
import {ProductCalendar} from "@/components/form/product/productCalendar";
import {ProductFormVariants} from "@/components/form/product/productFormVariants";
import useFormData from "@/_lib/_hooks/useFormData";
import {ProductFormIngredients} from "@/components/form/product/productFormIngredients";
import {ProductFormCategories} from "@/components/form/product/productFormCategories";
import {LoadingSkeleton} from "@/app/(dashboard)/products/create/loadingSkeleton";
import {useEditCreateProduct} from "@/lib/hooks/mutations/useProductMutation";
import {Input as NextUiInput} from "@nextui-org/input";
import {cn} from "@/lib/utils";
import {Button, ButtonGroup} from "@nextui-org/button";
import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from "@nextui-org/dropdown";
import {Card, CardBody} from "@nextui-org/card";
import ImageUploaderWithEditor from "@/components/form/product/FileUploadCropper";
import {Skeleton} from "@/components/ui/skeleton";
import {useGetProduct} from "@/lib/hooks/query/useProduct";
import {useGetCategories} from "@/lib/hooks/query/useCategory";
import {Alert, AlertDescription} from "@/components/ui/alert";

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

export default function ProductForm({id}: { id?: string }) {
    const {data: product, error: productError, isLoading: isProductLoading} = useGetProduct({productId: id || ''});
    const {data: categories, isLoading: isCategoriesLoading} = useGetCategories()
    const createFormData = useFormData<CreateProductDTO>();
    const [formKey, setFormKey] = useState(0);
    const [variantGroups, setVariantGroups] = useState<VariantGroup[]>([]);
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
    const {mutate} = useEditCreateProduct(isEdit, form, defaultValues, setFormKey, setVariantGroups);

    const ingredients = form.watch('ingredients');
    const submitHandler: SubmitHandler<CreateProductDTO> = async (values: CreateProductDTO, event) => {
        if (values.subCategory === "0") values.subCategory = undefined;
        const formData = createFormData({
            ...values,
            variantGroups: variantGroups,
            productId: product?.id
        });

        if (isEdit && product) {
            mutate(formData);
        } else {
            mutate(formData);
        }
    }
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
        [ProductStatus.published, 'Publicado', 'El producto estará como activo y podrá verse'],
        [ProductStatus.draft, 'Borrador', 'Si no estás seguro de los cambios. Puedes continuar luego. El producto no se mostrará'],
        [ProductStatus.discontinued, 'Inactivo',],
    ];


    const productSaveActions = () => {
        return product ?
            (
                <div className={'space-x-2 flex items-center'}>
                    <ProductFormVariants variantGroups={variantGroups} setVariantGroups={setVariantGroups}/>
                    <Button variant={"flat"} type={"submit"} disabled={isCategoriesLoading}>
                        <SaveIcon className={'mr-1'}/>
                        Guardar Cambios
                    </Button>
                </div>
            ) :
            (
                <div className={'space-x-2 flex items-center'}>
                    <ProductFormVariants variantGroups={variantGroups} setVariantGroups={setVariantGroups}/>
                    <FormField
                        name={"status"}
                        control={form.control}
                        render={({field}) => (
                            <ButtonGroup variant={"flat"}>
                                <Button type={"submit"}>
                                    <SaveIcon className={'mr-1'}/>
                                    {options.filter(opt => opt[0] === form.getValues().status)[0][1]}
                                </Button>
                                <Dropdown placement={"bottom-end"}>
                                    <DropdownTrigger>
                                        <Button isIconOnly>
                                            <ChevronDown/>
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu
                                        disallowEmptySelection
                                        aria-label="Save options"
                                        selectionMode="single"
                                        className="max-w-[300px]"
                                        onSelectionChange={value => form.setValue('status', options.filter(opt => opt[1] === value.currentKey)[0][0] as ProductStatus)}
                                    >
                                        {options.map(option => (
                                            <DropdownItem key={option[1]} description={option[2]}>
                                                {option[1]}
                                            </DropdownItem>
                                        ))}
                                    </DropdownMenu>
                                </Dropdown>
                            </ButtonGroup>
                        )}/>
                </div>
            )

    }

    if (productError && isEdit) {
        return (
            <Alert variant="destructive" className={'w-full md:w-1/3'}>
                <AlertDescription>
                    El producto no existe o ha sido eliminado.
                </AlertDescription>
            </Alert>
        );
    }
    if (isProductLoading && isCategoriesLoading) {
        return <LoadingSkeleton/>
    }

    const handleImageChange = (file: File | null, index: number) => {
        const currentImages = form.getValues('images') || [];
        if (file) {
            currentImages[index] = file;
        } else {
            currentImages.splice(index, 1);
        }
        form.setValue('images', currentImages);
    };
    return (
        <Card shadow={"sm"} className={'w-full'}>
            <CardBody>
                <Form {...form}>
                    <form key={formKey} onSubmit={form.handleSubmit(submitHandler)}
                          encType={"multipart/form-data"}
                          className={"grid grid-cols-2 items-center md:grid-cols-4 space-y-5 p-1 gap-3"}>
                        <section className={'col-span-2 md:col-span-4 flex justify-end mb-3'}>
                            {productSaveActions()}
                        </section>
                        <FormField
                            name={"highlight"}
                            render={({field}) => (
                                <FormItem className={"col-span-2 md:col-span-1"}>
                                    <Switch
                                        onValueChange={field.onChange}
                                        classNames={{
                                            base: cn(
                                                "inline-flex flex-row-reverse w-full max-w-md bg-content1 hover:bg-content2 items-center",
                                                "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2",
                                                "data-[selected=true]:border-primary",
                                            ),
                                            wrapper: "p-0 h-4 overflow-visible",
                                            thumb: cn("w-6 h-6 border-2 shadow-lg",
                                                "group-data-[hover=true]:border-primary",
                                                "group-data-[selected=true]:ml-6",
                                                "group-data-[pressed=true]:w-7",
                                                "group-data-[selected]:group-data-[pressed]:ml-4",
                                            ),
                                        }}
                                    >
                                        <div className="flex flex-col gap-1">
                                            <p className="text-medium">Destacar producto 0/4</p>
                                            <p className="text-tiny text-default-400">
                                                Haz que este producto aparezca entre los 4 primeros.
                                            </p>
                                        </div>
                                    </Switch>
                                </FormItem>
                            )}
                        />
                        <FormField
                            name={"productName"}
                            control={form.control}
                            render={({field}) => (
                                <NextUiInput
                                    isRequired
                                    isInvalid={!!form.formState.errors.productName}
                                    errorMessage={form.formState.errors.productName?.message}
                                    className={"col-span-2 md:col-span-3"}
                                    label={"Nombre"}
                                    {...field}
                                />
                            )}
                        />
                        {
                            isCategoriesLoading && categories ? (
                                <LoadingSkeleton/>
                            ) : (
                                <>
                                    <ProductFormCategories
                                        categories={categories || []}
                                        watch={form.watch}
                                        control={form.control}
                                        setValue={form.setValue}
                                    />
                                </>
                            )
                        }
                        <FormField
                            name={'price'}
                            control={form.control}
                            render={({field}) => (
                                //@ts-ignore
                                <NextUiInput
                                    isRequired
                                    type={"number"}
                                    isInvalid={!!form.formState.errors.price}
                                    errorMessage={form.formState.errors.price?.message}
                                    className={"col-span-1"}
                                    label={"Precio"}
                                    {...field}
                                />
                            )}
                        />
                        <FormField
                            name={'offerPrice'}
                            control={form.control}
                            render={({field}) => (
                                //@ts-ignore
                                <NextUiInput
                                    isRequired
                                    type={"number"}
                                    isInvalid={!!form.formState.errors.offerPrice}
                                    errorMessage={form.formState.errors.offerPrice?.message}
                                    className={"col-span-1"}
                                    label={"Oferta"}
                                    {...field}
                                />
                            )}
                        />
                        <ProductCalendar form={form}/>
                        <FormField
                            name={"description"}
                            render={({field}) => (
                                <FormItem className={'col-span-2'}>
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
                        <div className={'col-span-2'} onDragEnter={() => null}>
                            <ProductFormIngredients handleAddIngredient={handleAddIngredient}
                                                    handleRemoveIngredient={handleRemoveIngredient}/>
                        </div>
                        <Skeleton className={"col-span-2 w-full h-[150px]"}></Skeleton>
                        {
                            [...Array(3)].map((_, index) => (
                                <ImageUploaderWithEditor
                                    className={{wrapper: "col-span-2 lg:col-span-1"}}
                                    key={index}
                                    name={"images"}
                                    onChange={file => {
                                        handleImageChange(file, index);
                                    }}/>
                            ))
                        }
                    </form>
                </Form>
            </CardBody>
        </Card>
    );
}