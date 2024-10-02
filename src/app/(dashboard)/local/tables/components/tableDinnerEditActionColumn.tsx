import {Tables} from "@/types/database/database";
import {useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Pencil} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

interface Props {
    row: Tables<'establishment_tables'>;
    onUpdate: (tableId: string, name: string, status: string, locationId: string) => void;
    allLocations: Tables<'establishment_table_location'>[]
}

export function TableDinnerEditActionColumn({row, onUpdate, allLocations}: Props) {
    const [tableDinnerName, setTableDinnerName] = useState<string>(row.name);
    const [tableDinnerLocation, setTableDinnerLocation] = useState<string>(row.location_id);
    const [tableDinnerStatus, setTableDinnerStatus] = useState<string>(row.status);
    return (
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
                            value={tableDinnerName}
                            onChange={(event) => setTableDinnerName(event.target.value)}
                            id="locationName"
                        />
                    </div>
                    <div className={"w-1/3"}>
                        <Select onValueChange={setTableDinnerStatus} value={tableDinnerStatus.toLowerCase()}>
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
                    <div className={"w-1/3"}>
                        <Select onValueChange={setTableDinnerLocation} value={tableDinnerLocation.toLowerCase()}>
                            <SelectTrigger>
                                <SelectValue placeholder={"Editar localización"}/>
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    allLocations.map(location => (
                                        <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
                                    ))
                                }
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        onClick={() => onUpdate(row.id, tableDinnerName, tableDinnerStatus, tableDinnerLocation)}>
                        Guardar cambios
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}