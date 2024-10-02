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
import {Pencil, TrashIcon} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Tables} from "@/types/database/database";
import {useState} from "react";

interface Props {
    onDelete: any;
    onUpdate: any;
    row: Tables<'establishment_table_location'>
}

export function LocationActionsColumn({onDelete, onUpdate, row}: Props) {
    const [locationName, setLocationName] = useState<string>(row.name);
    const [locationStatus, setLocationStatus] = useState<string>(row.status);
    return (
        <>
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
                            Asegúrate que esta acción es la que realmente quieres realizar.
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
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                    >
                        <Pencil className="h-5 w-5"/>
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Editar localización: {row.name}
                        </DialogTitle>
                        <DialogDescription>
                            Edita el nombre y/o estado de la localización.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex gap-4 items-center">
                        <div className="w-2/3">
                            <Input
                                value={locationName}
                                onChange={(event) => setLocationName(event.target.value)}
                                id="locationName"
                            />
                        </div>
                        <div className={"w-1/3"}>
                            <Select onValueChange={setLocationStatus} value={locationStatus.toLowerCase()}>
                                <SelectTrigger>
                                    <SelectValue placeholder={"Editar estado"}/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={"active"}>Activo</SelectItem>
                                    <SelectItem value={"reserved"}>Reservado</SelectItem>
                                    <SelectItem value={"inactive"}>Inactivo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => onUpdate({
                            locationId: row.id,
                            name: locationName,
                            status: locationStatus
                        })}>
                            Guardar cambios
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}