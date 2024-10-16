import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createTable, deleteTable, updateTable} from "@/app/actions/dashboard/tables.service";
import {toast} from "sonner";

export function useDeleteDinner() {
    const queryClient = useQueryClient();
    const {mutate, status, error} = useMutation({
        mutationFn: deleteTable,
        onSuccess: () => {
            toast.success('Mesa eliminada correctamente');
        },
        onError: () => {
            toast.error('Ha ocurrido un error inesperado')
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ['tables']
            })
        }
    });
    return {
        mutate,
        isLoading: status === "pending",
        error
    }
}

export function useUpdateDinner() {
    const queryClient = useQueryClient();

    const {mutate, status, error} = useMutation({
        mutationKey: ['update_table'],
        mutationFn: updateTable,
        onSuccess: () => {
            toast.success('Mesa actualizada correctamente');
        },
        onError: () => {
            toast.error('Ha ocurrido un error inesperado')
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ['tables'],
                type: "all"
            })
        }
    });
    return {
        mutate,
        isLoading: status === "pending",
        error
    }
}

export function useCreateDinner() {
    const queryClient = useQueryClient();
    const {mutate, data, error, status} = useMutation({
        mutationKey: ["create_table"],
        mutationFn: createTable,
        onSuccess: (data) => {
            if (data.success) {
                toast.success('Mesa creada correctamente');
            } else {
                toast.warning('No ha sido posible actualizar la mesa');
            }
        },
        onError: () => {
            toast.error('Ha ocurrido un error inesperado')
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ['tables'],
                type: "all"
            })
        }
    });
    return {
        mutate,
        data,
        error,
        isLoading: status === "pending"
    }
}