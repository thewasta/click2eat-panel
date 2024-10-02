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
    // {
    //     id: "select",
    //     header: ({table}) => (
    //         <Checkbox
    //             checked={
    //                 table.getIsAllPageRowsSelected() ||
    //                 (table.getIsSomePageRowsSelected() && "indeterminate")
    //             }
    //             onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //             aria-label="Select all"
    //         />
    //     ),
    //     cell: ({row}) => (
    //         <Checkbox
    //             checked={row.getIsSelected()}
    //             onCheckedChange={(value) => row.toggleSelected(!!value)}
    //             aria-label="Select row"
    //         />
    //     ),
    //     enableSorting: false,
    //     enableHiding: false,
    // },
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
                return <Badge variant={'secondary'} className={"bg-amber-300 hover:bg-amber-200"}>Reservado</Badge>;
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