'use client'
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {AccordionHeader} from "@radix-ui/react-accordion";
import {SheetTrigger} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {FilePenIcon, Trash2Icon} from "lucide-react";
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
import {deleteCategoryById} from "@/app/actions/dashboard/category.service";
import {SubCategoryItem} from "@/app/(dashboard)/products/categories/subCategoryItem";

type CategoryWithSubCategories = Tables<'categories'> & {
    sub_categories: Tables<'sub_categories'>[]
}
type SheetContentType = 'category' | 'subCategory';

type SheetStateForm = {
    type: SheetContentType;
    category?: Tables<'categories'>
    subCategory?: Tables<'sub_categories'>
}
type CategoryItemProps = {
    category: CategoryWithSubCategories,
    handleSheetContent: Dispatch<SetStateAction<SheetStateForm | null>>
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

    const handleClickDelete = () => {
        mutation.mutate(category.id);
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
                                <Button variant={"ghost"} size={"icon"}
                                        onClick={() => handleSheetContent({type: 'category'})}>
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
                                            <Button variant={"destructive"}
                                                    onClick={handleClickDelete}>
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
                            <SubCategoryItem key={subcategory.id} subcategory={subcategory} categoryId={category.id}/>
                        ))}
                    </div>
                </AccordionContent>
                <SheetTrigger asChild>
                    <Button variant={'outline'} className={'m-2'}
                            onClick={() => handleSheetContent({type: 'subCategory', category: category})}>
                        Crear sub categoría
                    </Button>
                </SheetTrigger>
            </AccordionItem>
        </Accordion>
    );
}