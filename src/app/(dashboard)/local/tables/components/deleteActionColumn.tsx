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
import {Button} from "@/components/ui/button";
import {TrashIcon} from "lucide-react";

interface Props<T> {
    row: T;
    onDelete: (row: any) => void
}

export function DeleteActionColumn<T>({row, onDelete}: Props<T>) {
    return (
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
                    <AlertDialogTitle>¿Estás seguro de eliminar esta localización?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Estás borrando la localización y todas las mesas de este.
                        Asegúrate de asignar las mesas a otra localización antes de proceder.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        asChild>
                        <Button variant={"outline"} onClick={() => onDelete(row)}>
                            Continuar
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}