import {ColumnDef} from "@tanstack/react-table";
import {Tables} from "@/types/database/database";
import {Badge} from "@/components/ui/badge";
import {LocationActionsColumn} from "@/app/(dashboard)/local/tables/components/locationActionsColumn";

type TablesLocalizationColumnsProps = {
    onDelete: (localization: Tables<'establishment_table_location'>) => void
    onUpdate: ({locationId, name, status}: { locationId: string; name: string; status: string }) => void
}
export const tablesLocalizationColumns = ({
                                       onDelete,
                                       onUpdate
                                   }: TablesLocalizationColumnsProps
): ColumnDef<Tables<'establishment_table_location'>>[] => [
    {
        accessorKey: 'name',
        header: 'Nombre'
    },
    {
        accessorKey: 'status',
        header: 'Estado',
        cell: (cell) => {
            const status = cell.getValue();
            if (status === 'RESERVED') {
                return <Badge className={"bg-indigo-700 hover:bg-indigo-500"}>Reservado</Badge>;
            } else if (status === 'ACTIVE') {
                return <Badge>Activo</Badge>;
            } else {
                return <Badge variant={"destructive"}>No activo</Badge>;
            }
        }
    },
    {
        header: 'Acciones',
        id: 'actions',
        cell: ({row}) => {
            return (
                <LocationActionsColumn onDelete={onDelete} onUpdate={onUpdate} row={row.original}/>
            );
        }
    }
];