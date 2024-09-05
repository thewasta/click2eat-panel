import {Button} from "@/components/ui/button";
import {FilePenIcon, TrashIcon} from "lucide-react";
import {Tables} from "@/types/database/database";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {deleteSubCategoryById} from "@/app/actions/dashboard/category.service";
import {toast} from "sonner";
import {Dispatch, SetStateAction} from "react";
import {SheetTrigger} from "@/components/ui/sheet";

type SheetContentType = 'category' | 'subCategory';

type SheetStateForm = {
    type: SheetContentType;
    category?: Tables<'categories'>
    subCategory?: Tables<'sub_categories'>
}
type SubCategoryItemProps = {
    subcategory: Tables<'sub_categories'>,
    category: Tables<'categories'>
    handleSheetContent: Dispatch<SetStateAction<SheetStateForm | null>>
}

export function SubCategoryItem({subcategory, category, handleSheetContent}: SubCategoryItemProps) {

    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: deleteSubCategoryById,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["categories"]});
            toast.success('SubCategoria borrada correctamente')
        },
        onError: () => {
            queryClient.invalidateQueries({queryKey: ["categories"]});
            toast.error('Ha ocurrido un error al eliminar la sub categoría', {
                description: 'Por favor, envíanos un ticket.'
            })
        }
    });
    const handleDelete = () => {
        const data = {
            subCategoryId: subcategory.id,
            categoryId: category.id,
        }
        mutation.mutate(data);
    }
    return (
        <div
            className="bg-muted/20 rounded-md p-4 flex items-center justify-between">
            <div>{subcategory.name}</div>
            <div className="flex items-center gap-2">
                <SheetTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                            handleSheetContent({type: "subCategory", subCategory: subcategory, category: category})
                        }}
                    >
                        <FilePenIcon className="h-5 w-5"/>
                    </Button>
                </SheetTrigger>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                        >
                            <TrashIcon className="h-5 w-5"/>
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro de eliminar la
                                categoría?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Estas borrando esta sub categoría dentro de esta categoría.
                                Si esta sub categoría no tiene categoría, será eliminado automaticamente.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                                asChild>
                                <Button variant={"destructive"} onClick={handleDelete}>
                                    Continuar
                                </Button>
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </div>
        </div>
    )
}