"use client"
import {SubmitHandler, useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {ChangeEvent} from "react";
import {Button} from "@/components/ui/button";
import {ChevronLeft} from "lucide-react";
import {useRouter} from "next/navigation";

const editProductSchema = z.object({
    name: z.string({
        required_error: 'Product name is required'
    }).min(1, {
        message: 'Product name is too short'
    }),
    price: z.coerce.number({
        required_error: 'Price is required',
        invalid_type_error: 'Price must be a number',
    }).gt(0, 'Price must greater than 0'),
    category: z.string(),
    description: z.string(),
    image: z.any({
        required_error: 'a Image is required'
    })
});
export default function EditProductPage({params}: { params: { id: string } }) {

    const router = useRouter();
    const pageForm = useForm<z.infer<typeof editProductSchema>>({
        resolver: zodResolver(editProductSchema),
        defaultValues: {
            name: '',
            description: '',
            image: '',
            price: 0,
            category: ''
        }
    });
    const onSubmit: SubmitHandler<z.infer<typeof editProductSchema>> = async (values: z.infer<typeof editProductSchema>) => {

    };

    return (
        <>
            <Button onClick={() => router.back()}>
                <ChevronLeft />
            </Button>
            <Form {...pageForm}>
                <form encType={"multipart/form-data"} className={"space-y-3"}>
                    <FormField
                        name={"name"}
                        control={pageForm.control}
                        render={({field}) => (
                            <FormItem>
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
                        name={"price"}
                        control={pageForm.control}
                        render={({field}) => (
                            <FormItem>
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
                        name={"category"}
                        control={pageForm.control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Categoría
                                </FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={"Selecciona Categoría"}/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value={"1"}>
                                                    Categoría 1
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
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
                            </FormItem>
                        )}
                    />
                    <FormField
                        name={"image"}
                        render={({field: {ref, name, onChange, onBlur}}) => (
                            <FormItem>
                                <FormLabel>
                                    Imagen
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        required
                                        type={"file"}
                                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                            const file = event.target.files?.[0];
                                            onChange(event.target.files?.[0])
                                            //@ts-ignore
                                            setImagePreview(URL.createObjectURL(file));
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
                </form>
            </Form>
        </>
    )
}