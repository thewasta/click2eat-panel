'use client'
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {AccordionHeader} from "@radix-ui/react-accordion";
import {SheetTrigger} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {FilePenIcon, Trash2Icon, TrashIcon} from "lucide-react";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {toast} from "sonner";
import {Tables} from "@/types/database/database";
import {Dispatch, SetStateAction} from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {deleteCategoryById} from "@/_request/product/category.service";

type CategoryWithSubCategories = Tables<'categories'> & {
    sub_categories: Tables<'sub_categories'>[]
}
type CategoryItemProps = {
    category: CategoryWithSubCategories,
    handleSheetContent: Dispatch<SetStateAction<string | null>>
}

export function CategoryItem({category, handleSheetContent}: CategoryItemProps) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: deleteCategoryById,
        onSuccess: () => {
            toast.success('Borrado correctamente');
        },
        onError: () => {
            toast.error('Ha falllado el borrado');
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ["categories"]
            });
        }
    });

    const handleClickDelete = (categoryId: string) => {
        mutation.mutate(categoryId);
    }

    return (
        <Accordion type={'single'} collapsible key={category.id}>
            <AccordionItem value={category.id}>
                <AccordionHeader asChild>
                    <AccordionTrigger>
                        <div className="flex items-center gap-4">
                            <h3 className="text-lg font-medium">{category.name}</h3>
                        </div>
                        <div className="flex items-center gap-4">
                            <SheetTrigger asChild>
                                <Button variant={"ghost"} size={"icon"} onClick={() => handleSheetContent('category')}>
                                    <FilePenIcon className="h-4 w-4"/>
                                    <span className="sr-only">Editar</span>
                                </Button>
                            </SheetTrigger>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <Trash2Icon className="h-4 w-4"/>
                                        <span className="sr-only">Delete</span>
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>¿Estás seguro de eliminar la
                                            categoría?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Al eliminar la categoría también se eliminarán las sub
                                            categorías. Ten en cuenta que si una sub categoría pertenece
                                            a otra categoría, esa información se mantendrá. Si por lo
                                            contrario, no tiene categoría padre la sub categoría será
                                            eliminada.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction
                                            asChild>
                                            <Button variant={"destructive"} onClick={event => handleClickDelete(category.id)}>
                                                Continuar
                                            </Button>
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            <div className="h-4 w-4 transition-transform duration-300"/>
                        </div>
                    </AccordionTrigger>
                </AccordionHeader>
                <AccordionContent>
                    <div className={'space-y-2'}>
                        {category.sub_categories.map((subcategory) => (
                            <div key={subcategory.id}
                                 className="bg-muted/20 rounded-md p-4 flex items-center justify-between">
                                <div>{subcategory.name}</div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                    >
                                        <FilePenIcon className="h-5 w-5"/>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                    >
                                        <TrashIcon className="h-5 w-5"/>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </AccordionContent>
                <SheetTrigger asChild>
                    <Button variant={'outline'} className={'m-2'}
                            onClick={() => handleSheetContent('subCategory')}>
                        Crear sub categoría
                    </Button>
                </SheetTrigger>
            </AccordionItem>
        </Accordion>
    );
}