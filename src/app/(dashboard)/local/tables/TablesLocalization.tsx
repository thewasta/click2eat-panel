'use client'

import {ColumnDef} from "@tanstack/react-table";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Plus, Trash2} from "lucide-react";
import {Tables} from "@/types/database/database";
import {LocalTablesDinnerTable} from "@/app/(dashboard)/local/tables/localeTablesDinnerTable";
import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {retrieveLocations} from "@/app/actions/dashboard/tables.service";
import {Badge} from "@/components/ui/badge";

const tablesLocalizationColumns = (): ColumnDef<Tables<'establishment_table_location'>>[] => [
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
                return <Badge variant={'secondary'} className={"bg-amber-300"}>Reservado</Badge>;
            } else if (status === 'ACTIVE') {
                return <Badge>ACTIVO</Badge>;
            } else {
                return <Badge variant={"destructive"}>No activo</Badge>;
            }
        }
    },
    {
        header: 'Acciones',
        id: 'actions',
        cell: ({row}) => (
            <Button variant={"ghost"} size={"icon"}>
                <Trash2/>
            </Button>
        )
    }
];


export function TablesLocalization() {
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState(5);
    const {data: locations, isPending: locationStatus} = useQuery({
        queryKey: ['tables_locations', page],
        queryFn: async () => retrieveLocations({page, pageSize})
    });
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    }
    if (!locations?.success) {
        return (
            <div>
                <h2 className={"text-xl font-semibold"}>Localizaciones</h2>
                <section className={"flex gap-2"}>
                    <Input
                        placeholder={"Nueva localización"}

                    />
                    <Button>
                        <Plus/>Añadir localización
                    </Button>
                </section>
                <LocalTablesDinnerTable data={[]} columns={tablesLocalizationColumns()}
                                        isLoading={locationStatus}
                                        pagination={{
                                            currentPage: page,
                                            totalPages: Math.ceil(0 / pageSize),
                                            onPageChange: handlePageChange
                                        }}/>
            </div>
        );
    }
    return (
        <div>
            <h2 className={"text-xl font-semibold"}>Localizaciones</h2>
            <section className={"flex gap-2"}>
                <Input
                    placeholder={"Nueva localización"}

                />
                <Button>
                    <Plus/>Añadir localización
                </Button>
            </section>
            <LocalTablesDinnerTable data={locations.data.locations} columns={tablesLocalizationColumns()}
                                    isLoading={locationStatus}
                                    pagination={{
                                        currentPage: page,
                                        totalPages: Math.ceil((locations.data?.totalCount || 0) / pageSize),
                                        onPageChange: handlePageChange
                                    }}/>
        </div>
    );
}