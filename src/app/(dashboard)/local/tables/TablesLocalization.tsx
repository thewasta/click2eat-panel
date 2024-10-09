'use client'

import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {Tables} from "@/types/database/database";
import {LocalTablesDinnerTable} from "@/app/(dashboard)/local/tables/localeTablesDinnerTable";
import {ChangeEvent, useCallback, useEffect, useState} from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import useDebounce from "@/_lib/_hooks/useDebounce";
import {tablesLocalizationColumns} from "@/app/(dashboard)/local/tables/components/locationTableColumns";
import {useGetDinnerLocation} from "@/lib/hooks/query/useDinnerLocation";
import {
    useCreateDinnerLocation,
    useDeleteDinnerLocation,
    useUpdateDinnerLocation
} from "@/lib/hooks/mutations/useDinnerLocationMutation";

export function TablesLocalization() {
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState(5);
    const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState<string>()
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const [isDisableCreate, setIsDisableCreate] = useState<boolean>(false)

    const {data: locations, isLoading: locationStatus} = useGetDinnerLocation({
        page,
        pageSize,
        filterStatus,
        searchTerm: debouncedSearchTerm
    });

    const createMutation = useCreateDinnerLocation();

    const deleteMutation = useDeleteDinnerLocation();
    const updateMutations = useUpdateDinnerLocation();

    useEffect(() => {
        if (locations?.success) {
            const found = locations.data.locations.filter(location => location.name.toLowerCase() === debouncedSearchTerm?.toLowerCase());
            setIsDisableCreate(found.length > 0);
        }
    }, [locations, debouncedSearchTerm]);

    const handleSearchTerm = (event: ChangeEvent<HTMLInputElement>) => {
        const term = event.target.value;

        setSearchTerm(term);
    }

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    }

    const handleSelectStatusChange = (value: string) => {
        if (value === "all") {
            setFilterStatus(undefined)
        } else {
            setFilterStatus(value);
        }
    }

    const handleClick = () => {
        if (searchTerm) {
            createMutation.mutate({
                locationName: searchTerm,
                locationStatus: filterStatus
            });
        }
    }

    const onDelete = useCallback((location: Tables<'establishment_table_location'>) => {
        deleteMutation.mutate({
            locationId: location.id
        });
    }, [deleteMutation]);

    const onUpdate = useCallback(({locationId, name, status}: { locationId: string; name: string; status: string }) => {
        updateMutations.mutate({
            locationId,
            name,
            status
        });
    }, [updateMutations]);

    if (!locations?.success) {
        return (
            <div className={"space-y-2"}>
                <h2 className={"text-xl font-semibold"}>Localizaciones</h2>
                <section className={"flex gap-2"}>
                    <Input
                        placeholder={"Busca o crea localización..."}
                    />
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder={"Estado"}/>
                        </SelectTrigger>
                    </Select>
                    <Button>
                        <Plus/>Añadir localización
                    </Button>
                </section>
                <LocalTablesDinnerTable
                    data={[]}
                    totalColumns={3}
                    columns={tablesLocalizationColumns({onDelete, onUpdate})}
                    isLoading={locationStatus}
                    pagination={{
                        currentPage: page,
                        totalPages: Math.ceil(0 / pageSize),
                        onPageChange: handlePageChange
                    }}
                />
            </div>
        );
    }
    return (
        <div className={"space-y-2"}>
            <h2 className={"text-xl font-semibold"}>Localizaciones</h2>
            <section className={"flex gap-2"}>
                <Input
                    placeholder={"Busca o crea localización..."}
                    onChange={handleSearchTerm}
                />
                <Select onValueChange={handleSelectStatusChange}>
                    <SelectTrigger>
                        <SelectValue placeholder={"Estado"}/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={"all"}>Mostrar todos</SelectItem>
                        <SelectItem value={"active"}>Activo</SelectItem>
                        <SelectItem value={"reserved"}>Reservado</SelectItem>
                        <SelectItem value={"inactive"}>Inactivo</SelectItem>
                    </SelectContent>
                </Select>
                <Button
                    onClick={handleClick}
                    disabled={isDisableCreate}>
                    <Plus/>Añadir localización
                </Button>
            </section>
            <LocalTablesDinnerTable
                totalColumns={3}
                data={locations.data.locations}
                columns={tablesLocalizationColumns({onDelete, onUpdate})}
                isLoading={locationStatus}
                pagination={{
                    currentPage: page,
                    totalPages: Math.ceil((locations.data?.totalCount || 0) / pageSize),
                    onPageChange: handlePageChange
                }}
            />
        </div>
    );
}