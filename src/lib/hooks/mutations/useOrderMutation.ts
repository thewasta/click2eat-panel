import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createOrder} from "@/app/actions/dashboard/order.service";
import {toast} from "sonner";
import {useCartStore} from "@/lib/context/store/cart";

export function useCreateOrder() {
    const queryClient = useQueryClient();
    const clearCart = useCartStore(state => state.clearCart)
    const mutation = useMutation({
        mutationKey: ["create_order"],
        mutationFn: createOrder,
        onSuccess: (data) => {
            if (data.success) {
                clearCart()
                toast.success("Pedido creado correctamente");
            } else {
                toast.warning("No se ha podido crear");
            }
        },
        onError: () => {
            toast.warning("No se ha podido crear correctamente");
        },
        onSettled: () => {
            queryClient.invalidateQueries({queryKey: ['orders'], type: "all"});
        }
    });
    return {
        ...mutation
    }
}