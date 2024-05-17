"use client"
import {SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {Input} from "@/components/ui/input";
import {SubmitHandler, useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {ChangeEvent, useEffect, useState} from "react";
import Image from "next/image";
import {create} from "@/_request/product/create";
import {useUserAppContext} from "@/lib/context/auth/user-context";
import {User} from "@/lib/models/Account/User";

const MAX_FILE_SIZE = 1024 * 1024 * 10;
const ACCEPTED_IMAGE_MIME_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];
const createProductSchema = z.object({
    name: z.string({
        required_error: 'Product name is required'
    }).min(1, {
        message: 'Product name is too short'
    }),
    price: z.coerce.number({
        required_error: 'Price is required',
        invalid_type_error: 'Price must be a number',
    }).gt(0),
    category: z.string(),
    description: z.string(),
    image: z.any({
        required_error: 'a Image is required'
    })
});

export function CreateProductSheet() {
    const form = useForm<z.infer<typeof createProductSchema>>({
        resolver: zodResolver(createProductSchema),
        defaultValues: {
            name: '',
            description: '',
            image: '',
            price: 0,
            category: ''
        }
    });
    const onSubmit: SubmitHandler<z.infer<typeof createProductSchema>> = async (values: z.infer<typeof createProductSchema>) => {
        const userRaw = localStorage.getItem('user');
        let user: User | null;
        if (userRaw) {
            user = JSON.parse(userRaw);
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('price', values.price.toString());
            formData.append('category', values.category);
            formData.append('description', values.description);
            formData.append('status', "1");
            formData.append('businessUuid', user?.business.businessUuid as string);
            formData.append('image', values.image);
            form.reset();
            setImagePreview(null);
            try {
                await create(formData);
            }catch (e) {
                console.error(e);
            }
        }
    }

    const [imagePreview, setImagePreview] = useState<string | null>()

    return (
        <SheetContent side={"right"} onCloseAutoFocus={() => form.clearErrors()}>
            <SheetHeader>
                <SheetTitle>Crear Producto</SheetTitle>
                <SheetDescription>
                    Creación de un nuevo producto
                </SheetDescription>
            </SheetHeader>
            <div>
                <Form {...form}>
                    <form encType={"multipart/form-data"} className={"space-y-3"}>
                        <FormField
                            name={"name"}
                            control={form.control}
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
                            control={form.control}
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
                            control={form.control}
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
            </div>
            <SheetFooter className={"mt-4 space-y-4 flex flex-col"}>
                {imagePreview && <Image width={40} height={50} src={imagePreview} alt={"product image"}/>}
                <SheetClose asChild>
                    <Button
                        className={"float-right"}
                        type={"button"}
                        onClick={form.handleSubmit(onSubmit)}
                    >
                        Crear
                    </Button>
                </SheetClose>
            </SheetFooter>
        </SheetContent>
    )
}