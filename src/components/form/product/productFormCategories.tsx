import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Control, UseFormSetValue, UseFormWatch} from "react-hook-form";
import {Tables} from "@/types/database/database";
import {CreateProductDTO} from "@/_lib/dto/productFormDto";
import {cn} from "@/lib/utils";

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
                                          setValue,
                                          watch,
                                          className
                                      }: ProductFormCategoriesProps) {
    const selectedCategory = watch('category');
    const handleCategoryChange = (value: string) => {
        setValue('category', value);
        setValue('subCategory', undefined); // Reset subcategory when category changes
    };
    const getSubcategories = () => {
        const category = categories.find(cat => cat.id === selectedCategory);
        return category ? category.sub_categories : [];
    };
    const isValidCategory = selectedCategory && selectedCategory !== "0";

    return (
        <>
            <FormField
                name={"category"}
                control={control}
                render={({field}) => (
                    <FormItem
                        className={cn('w-full md:w-2/6', className)}
                    >
                        <FormLabel>
                            Categoría
                        </FormLabel>
                        <Select onValueChange={handleCategoryChange}
                                defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder={"Seleccionar Categoría"}/>
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectGroup>
                                    {
                                        categories &&
                                        categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id}>
                                                {category.name}
                                            </SelectItem>
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
                name={"subCategory"}
                control={control}
                render={({field}) => (
                    <FormItem
                        className={cn('w-full md:w-2/6', className)}
                    >
                        <FormLabel>
                            Sub Categoría
                        </FormLabel>
                        <Select onValueChange={field.onChange}
                                defaultValue={field.value}
                                disabled={!isValidCategory}
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder={"Seleccionar Sub Categoría"}/>
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value={"0"}>Seleccionar Sub Categoría</SelectItem>
                                    {getSubcategories().map((subCategory) => (
                                        <SelectItem key={subCategory.id} value={subCategory.id}>
                                            {subCategory.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <FormMessage/>
                    </FormItem>
                )}
            />
        </>
    );
}