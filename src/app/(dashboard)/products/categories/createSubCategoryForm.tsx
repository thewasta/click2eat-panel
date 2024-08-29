import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {SaveIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import useFormData from "@/_lib/_hooks/useFormData";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createSubCategory, deleteSubCategoryById} from "@/_request/product/category.service";
import {toast} from "sonner";

enum CategoryStatus {
    draft = "DRAFT",
    published = "PUBLISHED",
    discontinued = "DISCONTINUED"
}

const subCategorySchema = z.object({
    name: z.string().min(3, {message: 'El nombre debe contener al menos 3 caracteres'}),
    description: z.string().optional(),
    status: z.nativeEnum(CategoryStatus),
    offer: z.string().optional(),
    categoryId: z.string()
});
export type SubCategoryDTO = z.infer<typeof subCategorySchema>;
const options = [
    [CategoryStatus.draft, 'Borrador'],
    [CategoryStatus.published, 'Publicado'],
    [CategoryStatus.discontinued, 'Inactivo'],
];

type CreateSubCategoryFormProps = {
    categoryId: string;
}

export function CreateSubCategoryForm({categoryId}: CreateSubCategoryFormProps) {
    const queryClient = useQueryClient();
    const createFormData = useFormData<SubCategoryDTO>();
    const form = useForm<SubCategoryDTO>({
        resolver: zodResolver(subCategorySchema),
        defaultValues: {
            name: '',
            description: '',
            status: CategoryStatus.draft,
            offer: '',
            categoryId: categoryId
        }
    });
    const mutation = useMutation({
        mutationFn: createSubCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["categories"]
            });
            toast.success('Categoría creada');
            form.reset();
        },
        onError: () => {
            queryClient
                .invalidateQueries({
                    queryKey: ["categories"]
                });
            toast.error('Categoría no creada', {
                description: 'Ha ocurrido un error al crear la categoría.',
            });
        },
    })
    const handleSubmit: SubmitHandler<SubCategoryDTO> = (values: SubCategoryDTO) => {
        form.setValue('categoryId',categoryId);
        const formData = createFormData(values);
        mutation.mutate(formData);
    }
    return (
        <Form {...form}>
            <form className={'space-y-3 flex flex-col'} onSubmit={form.handleSubmit(handleSubmit)}>
                <FormField
                    control={form.control}
                    name={'status'}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Estado</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder={'Borrador'}/>
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
                <FormField
                    control={form.control}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>
                                Nombre
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder={'Ensaladas, Vegano...'}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    name={'name'}
                />
                <FormField control={form.control} name={'description'} render={({field}) => (
                    <FormItem>
                        <FormLabel>
                            Descripción
                        </FormLabel>
                        <FormControl>
                            <Textarea placeholder={'...'} {...field}/>
                        </FormControl>
                    </FormItem>
                )}/>
                <FormField
                    name={'offer'}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>
                                Oferta
                            </FormLabel>
                            <FormDescription>
                                El valor es calculado en porcentaje
                            </FormDescription>
                            <FormControl>
                                <Input
                                    type={"number"}
                                    placeholder={'10, 50'}
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type={"submit"} className={'space-x-3'}>
                    <span>Guardar</span>
                    <SaveIcon/>
                </Button>
            </form>
        </Form>
    )
}