import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createLocation, deleteLocation, updateLocation} from "@/app/actions/dashboard/tables.service";
import {toast} from "sonner";

export function useCreateDinnerLocation() {
    const queryClient = useQueryClient();
    const {mutate, status, data, error} = useMutation({
        mutationFn: createLocation,
        onSuccess: (data) => {
            if (data.success) {
                toast.success('Localización creada correctamente');
            } else {
                toast.warning('Error al crear localización');
            }
        },
        onError: () => {
            toast.error('Ha ocurrido un error inesperado', {
                description: 'Si el error persiste, por favor, escríbenos'
            })
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ["tables_locations"]
            });
        }
    });
    return {
        mutate,
        isLoading: status === "pending",
        data,
        error
    }
}

export function useDeleteDinnerLocation() {
    const queryClient = useQueryClient();
    const {mutate, data, error, status} = useMutation({
        mutationFn: deleteLocation,
        onSuccess: (data) => {
            if (data.success) {

                toast.success('Localización eliminada correctamente');
            } else {
                toast.warning(data.error);
            }
        },
        onError: () => {
            toast.error('Ha ocurrido un error inesperado', {
                description: 'Si el error persiste, por favor, escríbenos'
            })
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ["tables_locations"]
            });
        }
    });

    return {
        mutate,
        data,
        error,
        isLoading: status === "pending"
    };
}

export function useUpdateDinnerLocation() {
    const queryClient = useQueryClient();
    const updateMutations = useMutation({
        mutationFn: updateLocation,
        onSuccess: (data) => {
            if (data.success) {
                toast.success('Localización actualizada correctamente');
            } else {
                toast.warning(data.error);
            }
        },
        onError: () => {
            toast.error('Ha ocurrido un error inesperado', {
                description: 'Si el error persiste, por favor, escríbenos'
            })
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ["tables_locations"]
            });
        }
    });

    return {
        ...updateMutations,
        isLoading: updateMutations.status === "pending"
    }
}
