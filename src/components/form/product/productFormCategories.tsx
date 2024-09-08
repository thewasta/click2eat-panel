import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Control, UseFormSetValue} from "react-hook-form";
import {Tables} from "@/types/database/database";
import {CreateProductDTO} from "@/_lib/dto/productFormDto";
import {cn} from "@/lib/utils";

type ProductFormCategoriesProps = {
    name: 'category' | 'subCategory';
    label: string;
    options: Tables<'categories'>[] | Tables<'sub_categories'>[];
    control: Control<CreateProductDTO>;
    setValue: UseFormSetValue<CreateProductDTO>;
    placeholder: string;
    className?: string
}

export function ProductFormCategories({
                                          options,
                                          control,
                                          setValue,
                                          className,
                                          placeholder,
                                          name,
                                          label
                                      }: ProductFormCategoriesProps) {
    return (
        <FormField
            name={"category"}
            control={control}
            render={({field}) => (
                <FormItem
                    className={cn('w-full md:w-2/6', className)}
                >
                    <FormLabel>
                        {label}
                    </FormLabel>
                    <Select onValueChange={(value) => setValue(name, value)}
                            defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={placeholder}/>
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value={"0"}>{placeholder}</SelectItem>
                                {
                                    options &&
                                    options.map((category) => (
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
    );
}