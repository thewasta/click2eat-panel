import {create} from "zustand";
import {Tables} from "@/types/database/database";
import {persist} from 'zustand/middleware';

type Product = Tables<'products'> & {
    images: string[]
};
type ProductCart = Product & {
    quantity: number;
    comments?: string[];
}

interface CartState {
    cart: ProductCart[];
    addProduct: (product: Product) => void;
    removeProduct: (productId: string) => void;
    clearCart: () => void;
}

export const useCartStore = create<CartState>()(persist((set) => {
    return {
        cart: [],
        addProduct: (product: Product) =>
            set((state) => {
                const existingProduct = state.cart.find((item) => item.id === product.id);

                if (existingProduct) {
                    return {
                        cart: state.cart.map((item) =>
                            item.id === product.id ? {...item, quantity: item.quantity + 1} : item
                        ),
                    };
                }

                return {
                    cart: [...state.cart, {...product, quantity: 1}],
                };
            }),
        removeProduct: (productId: string) =>
            set((state) => {
                const index = state.cart.findIndex(productFind => productFind.id === productId);
                if (index >= 0) {
                    if (state.cart[index].quantity === 1) {
                        const productsFilter = state.cart.filter(productFind => productFind.id !== productId)
                        return {
                            cart: [...productsFilter],
                        }
                    } else {
                        state.cart[index].quantity--;
                        return {
                            cart: [...state.cart],
                        }
                    }
                }
                return {
                    cart: state.cart,
                }
            }),
        clearCart: () =>
            set(() => ({
                cart: [],
            })),
    }
}, {name: 'local'}))