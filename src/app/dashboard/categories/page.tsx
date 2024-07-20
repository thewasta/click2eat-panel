'use client'

import {ProductTable} from "@/components/products/product-table";
import {useMemo} from "react";
import {getCategoriesColumns} from "@/components/ui/colums";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Check, ChevronsUpDown, SaveIcon} from "lucide-react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";


const categorySchema = z.object({
    name: z.string().min(3),
    subCategory: z.string()
})

type CategorySchemaDTO = z.infer<typeof categorySchema>;

const subCategories: any[] = [
    {
        label: 'Ensalada',
        value: 'ensalada',
    },
    {
        label: 'Bebida',
        value: 'bebida'
    },
    {
        label: 'Categoría 1',
        value: 'categoría_1'
    }
];
const categories: any[] = [
    {
        id: 1,
        name: 'Categoría 1',
        status: true
    },
    {
        id: 1,
        name: 'Categoría 2',
        status: false
    }
];
export default function CategoriesPage() {

    const columns = useMemo(() => getCategoriesColumns(), []);
    const form = useForm<CategorySchemaDTO>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: ''
        }
    });
    return (
        <div className={'grid gap-4 md:grid-cols-2 lg:grid-cols-3'}>
            <div className={'col-span-2'}>
                <ProductTable
                    columns={columns}
                    data={categories}
                    isLoading={false}
                    entityName={'categoría'}
                    searchBy={'name'}
                />
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>
                        Categoría seleccionada
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form encType={'multipart/form-data'} className={'space-y-3'}>
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
                            <FormField
                                name={'subCategory'}
                                control={form.control}
                                render={({field}) => (
                                    <FormItem className={'flex flex-col'}>
                                        <FormLabel>
                                            Sub Categoría
                                        </FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={'outline'}
                                                        role={'combobox'}
                                                        className={cn(
                                                            "w-[200px] justify-between",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value
                                                            ? subCategories.find(
                                                                (subCategory) => subCategory.value === field.value
                                                            )?.label
                                                            : "Select language"}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className={'w-[200px] p-0'}>
                                                <Command>
                                                    <CommandInput placeholder={'Sub categoría'}/>
                                                    <CommandList>
                                                        <CommandEmpty>{field.value}</CommandEmpty>
                                                        <CommandGroup>
                                                            {subCategories.map(subCategory => (
                                                                    <CommandItem
                                                                        key={subCategory.value}
                                                                        value={subCategory.value}
                                                                        onSelect={() => {
                                                                            form.setValue("subCategory", subCategory.value);
                                                                        }}
                                                                    >
                                                                        <Check className={cn(
                                                                            'mr-2 h-4 w-4',
                                                                            subCategory.value === field.value ?
                                                                                'opacity-100' :
                                                                                'opacity-0'
                                                                        )}
                                                                        />
                                                                        {subCategory.label}
                                                                    </CommandItem>
                                                                ))
                                                            }
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <Button type={"submit"}>
                                <SaveIcon/> Guardar
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}