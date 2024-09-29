'use client'

import {LocalTablesDinnerTable} from "@/app/(dashboard)/local/tables/localeTablesDinnerTable";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {ColumnDef} from "@tanstack/react-table";
import {Tables} from "@/types/database/database";
import {useQuery} from "@tanstack/react-query";
import {retrieveTables} from "@/app/actions/dashboard/tables.service";
import {useState} from "react";
import {Badge} from "@/components/ui/badge";

type EstablishmentTablesWithLocation = Tables<'establishment_tables'> & {
    establishment_table_location: {
        id: string;
        name: string;
    }
}
type TablesDinnerTableProps = {
    data: EstablishmentTablesWithLocation[];
    isLoading: boolean;
}

const columns = (): ColumnDef<EstablishmentTablesWithLocation>[] => [
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
                return <Badge variant={'secondary'} className={"bg-amber-300"}>Reservado</Badge>;
            } else if (status === 'ACTIVE') {
                return <Badge>ACTIVO</Badge>;
            } else {
                return <Badge variant={"destructive"}>No activo</Badge>;
            }
        }
    },
    {
        accessorKey: 'establishment_table_location.name',
        header: 'Localización'
    }
];

export function TablesDinnerTable() {
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState(10);

    const {data: tables, isPending: tablesStatus} = useQuery({
        queryKey: ['tables', page],
        queryFn: async () => retrieveTables({page, pageSize})
    });

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    }
    if (!tables?.success) {
        return (
            <div>
                <h2 className={"text-xl font-semibold"}>Mesas</h2>
                <section className={"flex gap-2"}>
                    <Input
                        placeholder={"Número de mesa"}

                    />
                    <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Seleccionar localización"/>
                        </SelectTrigger>
                    </Select>
                    <Button>
                        <Plus/>Añadir Mesa
                    </Button>
                </section>
                {
                    <LocalTablesDinnerTable data={[]} columns={columns()}
                                            isLoading={tablesStatus}
                                            pagination={{
                                                currentPage: page,
                                                totalPages: Math.ceil(0 / pageSize),
                                                onPageChange: handlePageChange
                                            }}/>
                }
            </div>
        );
    }

    const allLocations = tables.data.tables.map(item => item.establishment_table_location);
    const uniqueLocations = Array.from(new Set(allLocations.map(loc => loc.id)))
        .map(id => allLocations.find(loc => loc.id === id));
    return (
        <div>
            <h2 className={"text-xl font-semibold"}>Mesas</h2>
            <section className={"flex gap-2"}>
                <Input
                    placeholder={"Número de mesa"}

                />
                <Select>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Seleccionar localización"/>
                    </SelectTrigger>
                    <SelectContent>
                        {
                            uniqueLocations.map((location) => (
                                location &&
                                <SelectItem key={location.id} value={location.id.toString()}>
                                    {location.name}
                                </SelectItem>
                            ))
                        }
                    </SelectContent>
                </Select>
                <Button>
                    <Plus/>Añadir Mesa
                </Button>
            </section>
            {
                <LocalTablesDinnerTable data={tables!.data!.tables || []} columns={columns()} isLoading={tablesStatus}
                                        pagination={{
                                            currentPage: page,
                                            totalPages: Math.ceil((tables!.data?.totalCount || 0) / pageSize),
                                            onPageChange: handlePageChange
                                        }}/>
            }
        </div>
    );
}