import {DeleteActionColumn} from "@/app/(dashboard)/local/tables/components/deleteActionColumn";
import {Tables} from "@/types/database/database";
import {TableDinnerEditActionColumn} from "@/app/(dashboard)/local/tables/components/tableDinnerEditActionColumn";

interface Props {
    row: Tables<'establishment_tables'>;
    onDelete: (row: Tables<'establishment_tables'>) => void;
    onUpdate: (tableId: string, name: string, status: string, locationId: string) => void
    allLocation: Tables<'establishment_table_location'>[]
}

export function TableDinnerActionColumn({row, onDelete, onUpdate, allLocation}: Props) {
    return (
        <>
            <DeleteActionColumn row={row} onDelete={onDelete}/>
            <TableDinnerEditActionColumn row={row} onUpdate={onUpdate} allLocations={allLocation}/>
        </>
    )
}