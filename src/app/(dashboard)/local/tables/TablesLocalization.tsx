'use client'

import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {Tables} from "@/types/database/database";
import {LocalTablesDinnerTable} from "@/app/(dashboard)/local/tables/localeTablesDinnerTable";
import {ChangeEvent, useCallback, useEffect, useState} from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
    createLocation,
    deleteLocation,
    retrieveLocations,
    updateLocation
} from "@/app/actions/dashboard/tables.service";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import useDebounce from "@/_lib/_hooks/useDebounce";
import {toast} from "sonner";
import {tablesLocalizationColumns} from "@/app/(dashboard)/local/tables/components/locationTableColumns";

export function TablesLocalization() {
    const queryClient = useQueryClient();
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState(5);
    const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState<string>()
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const [isDisableCreate, setIsDisableCreate] = useState<boolean>(false)

    const {data: locations, isPending: locationStatus} = useQuery({
        queryKey: ['tables_locations', page, pageSize, filterStatus, debouncedSearchTerm],
        queryFn: async () => retrieveLocations({page, pageSize, filterStatus, searchTerm: debouncedSearchTerm}),
        retry: false,
        refetchOnWindowFocus: 'always',
        refetchOnReconnect: true,
        staleTime: 60000 * 3,
        refetchOnMount: false,
        refetchIntervalInBackground: false
    });

    const createMutation = useMutation({
        mutationFn: createLocation,
        onSuccess: (data) => {
            if (data.success) {
                queryClient.invalidateQueries({
                    queryKey: ["tables_locations"]
                });
                toast.success('Localización creada correctamente');
            } else {
                toast.warning('Error al crear localización');
            }
        },
        onError: () => {
            toast.error('Ha ocurrido un error inesperado', {
                description: 'Si el error persiste, por favor, escríbenos'
            })
        }
    });
    const deleteMutation = useMutation({
        mutationFn: deleteLocation,
        onSuccess: (data) => {
            if (data.success) {
                queryClient.invalidateQueries({
                    queryKey: ["tables_locations"]
                });
                toast.success('Localización eliminada correctamente');
            } else {
                toast.warning(data.error);
            }
        },
        onError: () => {
            toast.error('Ha ocurrido un error inesperado', {
                description: 'Si el error persiste, por favor, escríbenos'
            })
        }
    });
    const updateMutations = useMutation({
        mutationFn: updateLocation,
        onSuccess: (data) => {
            if (data.success) {
                queryClient.invalidateQueries({
                    queryKey: ["tables_locations"]
                });
                toast.success('Localización actualizada correctamente');
            } else {
                toast.warning(data.error);
            }
        },
        onError: () => {
            toast.error('Ha ocurrido un error inesperado', {
                description: 'Si el error persiste, por favor, escríbenos'
            })
        }
    });

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
                    <Button>
                        <Plus/>Añadir localización
                    </Button>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder={"Estado"}/>
                        </SelectTrigger>
                    </Select>
                </section>
                <LocalTablesDinnerTable
                    data={[]}
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
                <Button
                    onClick={handleClick}
                    disabled={isDisableCreate}>
                    <Plus/>Añadir localización
                </Button>
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
            </section>
            <LocalTablesDinnerTable
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