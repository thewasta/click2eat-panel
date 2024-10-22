import {FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Control, UseFormSetValue, UseFormWatch} from "react-hook-form";
import {Tables} from "@/types/database/database";
import {CreateProductDTO} from "@/_lib/dto/productFormDto";
import {cn} from "@/lib/utils";
import {Select, SelectItem} from "@nextui-org/select";

type SubCategory = Tables<'sub_categories'>
type CategoryWithSubCategories = Tables<'categories'> & {
    sub_categories: SubCategory[]
}
type ProductFormCategoriesProps = {
    categories: CategoryWithSubCategories[];
    control: Control<CreateProductDTO>;
    setValue: UseFormSetValue<CreateProductDTO>;
    watch: UseFormWatch<CreateProductDTO>;
    className?: string;
}

export function ProductFormCategories({
                                          categories,
                                          control,
                                          watch,
                                          className
                                      }: ProductFormCategoriesProps) {
    const selectedCategory = watch('category');
    const getSubcategories = () => {
        const category = categories.find(cat => cat.id === selectedCategory);
        return category ? category.sub_categories : [];
    };

    return (
        <>
            <FormField
                name={"category"}
                control={control}
                render={({field}) => (
                    <FormItem
                        className={cn('col-span-1', className)}
                    >
                        <Select
                            isRequired
                            label="Categoría"
                            variant="flat"
                            selectedKeys={field.value ? [field.value] : undefined}
                            errorMessage={control._formState.errors.category ? control._formState.errors.category.message : ''}
                            isInvalid={!!control._formState.errors.category}
                            onSelectionChange={(value) => field.onChange(value.currentKey as string)}
                            placeholder="Selecciona una categoría"
                        >
                            {
                                categories && categories.map(category => (
                                    <SelectItem key={category.id}>
                                        {category.name}
                                    </SelectItem>
                                ))
                            }
                        </Select>
                    </FormItem>
                )}
            />
            <FormField
                name={"subCategory"}
                control={control}
                render={({field}) => (
                    <FormItem
                        className={cn('col-span-1', className)}
                    >
                        <Select
                            isDisabled={getSubcategories().length === 0}
                            label="Sub categoría"
                            variant="flat"
                            selectedKeys={field.value ? [field.value] : undefined}
                            errorMessage={control._formState.errors.subCategory ? control._formState.errors.subCategory.message : ''}
                            isInvalid={!!control._formState.errors.subCategory}
                            onSelectionChange={(value) => field.onChange(value.currentKey as string)}
                            placeholder={getSubcategories().length > 0 ? "Selecciona una categoría" : "No existen sub categorías"}
                        >
                            {
                                getSubcategories().map(category => (
                                    <SelectItem key={category.id}>
                                        {category.name}
                                    </SelectItem>
                                ))
                            }
                        </Select>
                        <FormMessage/>
                    </FormItem>
                )}
            />
        </>
    );
}