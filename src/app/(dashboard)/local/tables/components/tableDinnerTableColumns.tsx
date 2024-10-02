import {ColumnDef} from "@tanstack/react-table";
import {Checkbox} from "@/components/ui/checkbox";
import {Badge} from "@/components/ui/badge";
import {Tables} from "@/types/database/database";
import {TableDinnerActionColumn} from "@/app/(dashboard)/local/tables/components/tableDinnerActionColumn";

type EstablishmentTablesWithLocation = Tables<'establishment_tables'> & {
    establishment_table_location: {
        id: string;
        name: string;
    }
}

interface Props {
    onDelete: (table: Tables<'establishment_tables'>) => void;
    onUpdate: (tableId: string, name: string, status: string, locationId: string) => void
    allLocations: Tables<'establishment_table_location'>[]
}

export const tableDinnerTableColumns = ({
                                            onDelete,
                                            onUpdate,
                                            allLocations
                                        }: Props): ColumnDef<EstablishmentTablesWithLocation>[] => [
    {
        id: "select",
        header: ({table}) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({row}) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'name',
        header: 'Nombre'
    },
    {
        accessorKey: "status",
        header: "Estado",
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
        accessorKey: 'establishment_table_location.name',
        header: 'Localización'
    },
    {
        header: 'Acciones',
        id: 'actions',
        cell: ({row}) => (
            <TableDinnerActionColumn row={row.original} onDelete={onDelete} onUpdate={onUpdate}
                                     allLocation={allLocations}/>
        )
    }
];