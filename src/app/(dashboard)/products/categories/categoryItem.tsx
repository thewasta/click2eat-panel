'use client'
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {SheetTrigger} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {FilePenIcon, Trash2Icon} from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {Tables} from "@/types/database/database";
import {Dispatch, SetStateAction} from "react";
import {SubCategoryItem} from "@/app/(dashboard)/products/categories/subCategoryItem";
import {ScrollArea} from "@/components/ui/scroll-area";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useDeleteCategory} from "@/lib/hooks/mutations/useCategoryMutation";
import {useAddSubCategory} from "@/lib/hooks/mutations/useSubCategoryMutation";

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
    allSubcategories: Tables<'sub_categories'>[]
    handleSheetContent: Dispatch<SetStateAction<SheetStateForm | null>>
}

export function CategoryItem({category, handleSheetContent, allSubcategories}: CategoryItemProps) {

    const mutation = useDeleteCategory();

    const addSubCategoryMutation = useAddSubCategory();

    const handleClickDelete = () => {
        mutation.mutate(category.id);
    }

    const handleAddSubCategory = (value: string) => {
        addSubCategoryMutation.mutate({
            subCategoryId: value,
            categoryId: category.id
        });
    }
    return (
        <div className={'bg-card shadow-sm border rounded-lg overflow-hidden'}>
            <Accordion type="single" className={'bg-card shadow-sm border rounded-md'} collapsible>
                <AccordionItem value={category.id}>
                    <div className="flex items-center justify-between p-4">
                        <AccordionTrigger className="w-full py-4 px-4 ">
                            <div className="flex items-center gap-4">
                                <h3 className="text-lg font-medium">{category.name}</h3>
                            </div>
                        </AccordionTrigger>
                        <div className="flex items-center gap-4">
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleSheetContent({type: 'category', category})}
                                >
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
                                        <AlertDialogTitle>¿Estás seguro de eliminar la categoría?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Al eliminar la categoría también se eliminarán las sub categorías. Ten en
                                            cuenta que si una sub categoría pertenece a otra categoría, esa información
                                            se mantendrá. Si por lo contrario, no tiene categoría padre la sub categoría
                                            será eliminada.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction asChild>
                                            <Button variant="destructive" onClick={handleClickDelete}>
                                                Continuar
                                            </Button>
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                    <AccordionContent>
                        <div className={"flex flex-col"}>
                            <ScrollArea className={'flex-grow h-[300px]'}>
                                <div className="space-y-2">
                                    {
                                        category.sub_categories &&
                                        category.sub_categories.map((subcategory) => (
                                                <SubCategoryItem
                                                    key={subcategory.id}
                                                    subcategory={subcategory}
                                                    category={category}
                                                    handleSheetContent={handleSheetContent}
                                                />
                                            )
                                        )
                                    }
                                </div>
                            </ScrollArea>
                        </div>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                className="m-2"
                                onClick={() => handleSheetContent({type: 'subCategory', category: category})}
                            >
                                Crear sub categoría
                            </Button>
                        </SheetTrigger>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button>
                                    Añadir Sub Categoría
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Añadir sub categoría
                                    </DialogTitle>
                                    <DialogDescription>
                                        La sub categoría conservará la misma información.
                                    </DialogDescription>
                                </DialogHeader>
                                <div>
                                    <Select onValueChange={handleAddSubCategory}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={'Seleccionar Sub categoría'}/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                allSubcategories.map(subCategory => (
                                                    <SelectItem
                                                        key={subCategory.id}
                                                        value={subCategory.id}>
                                                        {subCategory.name}</SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}