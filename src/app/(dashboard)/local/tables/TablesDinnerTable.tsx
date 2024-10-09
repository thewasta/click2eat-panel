'use client'

import {LocalTablesDinnerTable} from "@/app/(dashboard)/local/tables/localeTablesDinnerTable";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {ChangeEvent, useCallback, useEffect, useState} from "react";
import {tableDinnerTableColumns} from "@/app/(dashboard)/local/tables/components/tableDinnerTableColumns";
import {Tables} from "@/types/database/database";
import {useGetTableDinner} from "@/lib/hooks/query/useTableDinner";
import {useGetDinnerLocation} from "@/lib/hooks/query/useDinnerLocation";
import {useCreateDinner, useDeleteDinner, useUpdateDinner} from "@/lib/hooks/mutations/useTableDinner";
import useDebounce from "@/_lib/_hooks/useDebounce";

export function TablesDinnerTable() {
    const [selectRow, setSelectRow] = useState({});
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState(10);
    const [filterStatus, setFilterStatus] = useState<string | null>(null);
    const [filterSearchTerm, setFilterSearchTerm] = useState<string | null>(null);
    const [filterLocation, setFilterLocation] = useState<string | null>(null);
    const debouncedSearchTerm = useDebounce(filterSearchTerm, 300);
    const [isDisableToCreate, setIsDisableToCreate] = useState<boolean>(false);
    const {data: tables, isLoading: tablesStatus} = useGetTableDinner({
        page,
        pageSize,
        filterStatus,
        filterLocation,
        searchTerm: debouncedSearchTerm // Aquí se usa el valor debounced
    });
    useEffect(() => {
        if (tables?.success) {
            if (tables.data.tables.length > 0) {
                setIsDisableToCreate(true)
            } else {
                if (filterLocation) {
                    setIsDisableToCreate(false)

                }
            }
        } else {
            if (filterLocation) {
                setIsDisableToCreate(false)
            }
        }
    }, [filterLocation, tables]);
    const {data: locations} = useGetDinnerLocation({page, pageSize});

    const deleteMutation = useDeleteDinner();
    const updateMutation = useUpdateDinner();
    const createMutation = useCreateDinner();

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

    const handleOnClickCreate = () => {
        if (filterSearchTerm && filterLocation) {
            createMutation.mutate({
                name: filterSearchTerm,
                status: filterStatus ?? undefined,
                locationId: filterLocation
            })
        }
    }
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
                        </SelectContent>
                    </Select>
                    <Button disabled={true}>
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
                    placeholder={"Busca o crea una nueva mesa..."}
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
                <Button onClick={handleOnClickCreate} disabled={isDisableToCreate}>
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