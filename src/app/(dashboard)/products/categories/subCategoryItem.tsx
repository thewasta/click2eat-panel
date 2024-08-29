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

type SubCategoryItemProps = {
    subcategory: Tables<'sub_categories'>,
    categoryId: string
}

export function SubCategoryItem({subcategory, categoryId}: SubCategoryItemProps) {

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
            categoryId: categoryId,
        }
        mutation.mutate(data);
    }
    return (
        <div
            className="bg-muted/20 rounded-md p-4 flex items-center justify-between">
            <div>{subcategory.name}</div>
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                >
                    <FilePenIcon className="h-5 w-5"/>
                </Button>
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