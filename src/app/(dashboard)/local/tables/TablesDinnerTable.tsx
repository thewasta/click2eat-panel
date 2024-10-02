'use client'

import {LocalTablesDinnerTable} from "@/app/(dashboard)/local/tables/localeTablesDinnerTable";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {deleteTable, retrieveLocations, retrieveTables, updateTable} from "@/app/actions/dashboard/tables.service";
import {ChangeEvent, useCallback, useState} from "react";
import useDebounce from "@/_lib/_hooks/useDebounce";
import {tableDinnerTableColumns} from "@/app/(dashboard)/local/tables/components/tableDinnerTableColumns";
import {Tables} from "@/types/database/database";
import {toast} from "sonner";

export function TablesDinnerTable() {
    const queryClient = useQueryClient();
    const [selectRow, setSelectRow] = useState({});
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState(10);
    const [filterStatus, setFilterStatus] = useState<string | null>(null);
    const [filterSearchTerm, setFilterSearchTerm] = useState<string | null>(null);
    const [filterLocation, setFilterLocation] = useState<string | null>(null);
    const debouncedSearchTerm = useDebounce(filterSearchTerm, 300);
    const {data: tables, isPending: tablesStatus} = useQuery({
        queryKey: ['tables', page, filterStatus, filterLocation, debouncedSearchTerm],
        queryFn: async () => retrieveTables({
            page,
            pageSize,
            filterBy: {
                location: filterLocation, status: filterStatus, term: debouncedSearchTerm
            }
        })
    });
    const {data: locations} = useQuery({
        queryKey: ['tables_locations'],
        queryFn: async () => retrieveLocations({page, pageSize: 10}),
        retry: false,
        refetchOnWindowFocus: 'always',
        refetchOnReconnect: true,
        staleTime: 60000 * 3,
        refetchOnMount: false,
        refetchIntervalInBackground: false
    });
    const deleteMutation = useMutation({
        mutationFn: deleteTable,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['tables']
            })
            toast.success('Mesa eliminada correctamente');
        },
        onError: () => {
            toast.error('Ha ocurrido un error inesperado')
        }
    });
    const updateMutation = useMutation({
        mutationKey: ['update_table'],
        mutationFn: updateTable,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['tables']
            })
            toast.success('Mesa actualizada correctamente');
        },
        onError: () => {
            toast.error('Ha ocurrido un error inesperado')
        }
    })
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    }
    const handleSelectLocation = (value: string) => {
        if (value === "all") {
            setFilterLocation(null);
        } else {
            setFilterLocation(value);
        }
    }
    const handleSelectStatus = (value: string) => {
        if (value === "all") {
            setFilterStatus(null);
        } else {
            setFilterStatus(value);
        }
    }
    const handleSearchTerm = (event: ChangeEvent<HTMLInputElement>) => {
        const term = event.target.value;
        if (term.length > 0) {
            setFilterSearchTerm(term);
        } else {
            setFilterSearchTerm(null);
        }
    }

    const handleOnDelete = useCallback((table: Tables<'establishment_tables'>) => {
        deleteMutation.mutate({tableId: table.id});
    }, [deleteMutation]);

    const handleOnUpdate = useCallback((tableId: string, name: string, status: string, locationId: string) => {
        updateMutation.mutate({
            tableId,
            name,
            status,
            locationId
        });
    }, [updateMutation])

    if (!tables?.success) {
        return (
            <div className={"space-y-2"}>
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
                    <Select onValueChange={handleSelectStatus}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Seleccionar estado"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={"all"}>Mostrar todos</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button>
                        <Plus/>Añadir Mesa
                    </Button>
                </section>
                {
                    <LocalTablesDinnerTable
                        data={[]}
                        columns={tableDinnerTableColumns({
                            onDelete: handleOnDelete,
                            onUpdate: handleOnUpdate,
                            allLocations: locations?.success ? locations.data.locations : []
                        })}
                        totalColumns={5}
                        isLoading={tablesStatus}
                        selectedRow={selectRow}
                        setSelectedRow={setSelectRow}
                        pagination={{
                            currentPage: page,
                            totalPages: Math.ceil(0 / pageSize),
                            onPageChange: handlePageChange
                        }}/>
                }
            </div>
        );
    }
    return (
        <div>
            <h2 className={"text-xl font-semibold"}>Mesas</h2>
            <section className={"flex gap-2"}>
                <Input
                    placeholder={"Número de mesa"}
                    onChange={handleSearchTerm}
                />
                <Select onValueChange={handleSelectLocation}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Seleccionar localización"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={"all"}>Mostrar todos</SelectItem>
                        {
                            locations?.success &&
                            locations.data.locations.map((location) => (
                                <SelectItem key={location.id} value={location.id.toString()}>
                                    {location.name}
                                </SelectItem>
                            ))
                        }
                    </SelectContent>
                </Select>
                <Select onValueChange={handleSelectStatus}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Seleccionar estado"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={"all"}>Mostrar todos</SelectItem>
                        <SelectItem value={"active"}>Activo</SelectItem>
                        <SelectItem value={"reserved"}>Reservado</SelectItem>
                        <SelectItem value={"inactive"}>Inactivo</SelectItem>
                    </SelectContent>
                </Select>
                <Button>
                    <Plus/>Añadir Mesa
                </Button>
            </section>
            {
                <LocalTablesDinnerTable
                    data={tables!.data!.tables || []}
                    totalColumns={5}
                    columns={tableDinnerTableColumns({
                        onDelete: handleOnDelete,
                        onUpdate: handleOnUpdate,
                        allLocations: locations?.success ? locations.data.locations : []
                    })}
                    isLoading={tablesStatus}
                    selectedRow={selectRow}
                    setSelectedRow={setSelectRow}
                    pagination={{
                        currentPage: page,
                        totalPages: Math.ceil((tables!.data?.totalCount || 0) / pageSize),
                        onPageChange: handlePageChange
                    }}/>
            }
        </div>
    );
}