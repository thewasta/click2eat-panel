'use client'

import {ProductTable} from "@/components/products/product-table";
import {useMemo} from "react";
import {getCategoryColumns} from "@/components/ui/colums";
import {SubmitHandler, useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {Check, ChevronsUpDown, SaveIcon} from "lucide-react";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createCategory} from "@/_request/product/category.service";
import {toast} from "sonner";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {CategoryFormSchema, categorySchema} from "@/types/validation/categoryFormValidation";

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
    },
];
export default function ProductCategoriesPage() {
    const queryClient = useQueryClient()
    const columns = useMemo(() => getCategoryColumns(), []);
    const form = useForm<CategoryFormSchema>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: ''
        }
    });
    // const {data: categories} = useQuery({
    //     queryKey: ["categories"],
    //     queryFn: retrieveCategories,
    //     staleTime: Infinity,
    //     refetchOnMount: false,
    //     refetchOnReconnect: false,
    //     refetchInterval: false,
    //     refetchOnWindowFocus: false
    // });

    const mutation = useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            toast.success('Creado correctamente', {
                description: 'Categoría creada correctamente'
            })
        },
        onError: () => {
            queryClient.invalidateQueries({
                queryKey: ["categories"]
            })
                .then(_ => toast.error('Error al crear', {
                    description: 'Ha ocurrido un error al crear la categoría.',
                }))
        },
    });
    const handleSubmit: SubmitHandler<CategoryFormSchema> = (values: CategoryFormSchema) => {
        mutation.mutate();
        console.log(values);
    }

    return (
        <Sheet>
            <ProductTable
                columns={columns}
                data={categories}
                isLoading={false}
                entityName={'categoría'}
                searchBy={'name'}
                buttonAction={
                    <SheetTrigger asChild>
                        <Button>
                            Crear Categoría
                        </Button>
                    </SheetTrigger>
                }
            />
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>
                        Creación de categoría
                    </SheetTitle>
                    <SheetDescription>
                        Crea una nueva categoría
                    </SheetDescription>
                </SheetHeader>
                <Form {...form}>
                    <form encType={'multipart/form-data'} className={'space-y-3'}
                          onSubmit={form.handleSubmit(handleSubmit)}>
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
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
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
            </SheetContent>
        </Sheet>
    );
}