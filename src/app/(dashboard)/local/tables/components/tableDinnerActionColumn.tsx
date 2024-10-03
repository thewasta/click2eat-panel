import {DeleteActionColumn} from "@/app/(dashboard)/local/tables/components/deleteActionColumn";
import {Tables} from "@/types/database/database";
import {TableDinnerEditActionColumn} from "@/app/(dashboard)/local/tables/components/tableDinnerEditActionColumn";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Download} from "lucide-react";

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
            <Button asChild variant={"link"}>
                <Link
                    href={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://app.phrodise.com/${row.id}`}
                    download
                    target="_blank"
                >
                <Download className="w-5 h-5"/> {/* Tamaño personalizado del icono */}
                </Link>
            </Button>
        </>
    )
}