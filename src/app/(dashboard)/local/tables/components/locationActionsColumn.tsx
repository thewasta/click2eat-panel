import {Tables} from "@/types/database/database";
import {LocationEditActionColumn} from "@/app/(dashboard)/local/tables/components/locationEditActionColumn";
import {DeleteActionColumn} from "@/app/(dashboard)/local/tables/components/deleteActionColumn";

interface Props {
    onDelete: any;
    onUpdate: any;
    row: Tables<'establishment_table_location'>
}

export function LocationActionsColumn({onDelete, onUpdate, row}: Props) {

    return (
        <>
            <DeleteActionColumn row={row} onDelete={onDelete}/>
            <LocationEditActionColumn row={row} onUpdate={onUpdate}/>
        </>
    );
}