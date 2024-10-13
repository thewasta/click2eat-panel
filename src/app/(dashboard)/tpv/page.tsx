'use client'
import {useMediaQuery} from "@/_lib/_hooks/useMediaQuery";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {FaReceipt} from "react-icons/fa";
import {useUserAppContext} from "@/lib/context/auth/user-context";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import React, {useState} from "react";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Tables} from "@/types/database/database";
import {RiSearchLine} from "react-icons/ri";
import {Input} from "@/components/ui/input";
import {IconPencil} from "@tabler/icons-react";
import {ProductListItem} from "@/app/(dashboard)/tpv/ProductListItem";
import {useGetProducts} from "@/lib/hooks/query/useProduct";
import {useGetCategories} from "@/lib/hooks/query/useCategory";

type Product = Tables<'products'> & {
    categories: {
        name: string
    };
    images: string[];
    sub_categories: {
        name: string
    };
}
type ProductCart = Product & {
    quantity: number;
}
export default function TPVPage() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>('');
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const appContext = useUserAppContext();
    const {data: products, error: productsError, isLoading: productsIsLoading} = useGetProducts({
        page: 1,
        pageSize: 20
    });

    const {data: categories} = useGetCategories();

    const [productsCart, setProductsCart] = useState<ProductCart[]>([]);

    const handleAddToCart = (product: Product) => {
        console.log('add to cart');
        const index = productsCart.findIndex(productFind => productFind.id === product.id);
        if (index >= 0) {
            productsCart[index].quantity++;
            setProductsCart([...productsCart]);
        } else {
            setProductsCart([...productsCart, {...product, quantity: 1}]);
        }
    }

    const handleRemoveToCart = (product: Product) => {
        const index = productsCart.findIndex(productFind => productFind.id === product.id);
        if (index >= 0) {
            if (productsCart[index].quantity === 1) {
                const productsFilter = productsCart.filter(productFind => productFind.id !== product.id)
                setProductsCart([...productsFilter]);
            } else {
                productsCart[index].quantity--;
                setProductsCart([...productsCart]);
            }
        }
    }

    const total = productsCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (products && categories) {
        const filteredProducts = selectedCategory
            ? products.products.filter(p => p.categories.name === selectedCategory)
            : products.products;
        return (
            <div className={'flex gap-3'}>
                <div className={'flex-1 space-y-2'}>
                    <form className="w-[30%] md:w-[50%]">
                        <div className="relative">
                            <RiSearchLine className="absolute left-2 top-3"/>
                            <Input className="pl-8 pr-4 py-2 outline-none rounded-lg w-full"
                                   placeholder="Busca el menú.."/>
                        </div>
                    </form>
                    <div className="flex space-x-2 mb-4">
                        <Button
                            variant={selectedCategory === null ? "default" : "outline"}
                            onClick={() => setSelectedCategory(null)}
                        >
                            Todos
                        </Button>
                        {categories.map(category => (
                            <Button
                                key={category.id}
                                variant={selectedCategory === category.name ? "default" : "outline"}
                                onClick={() => setSelectedCategory(category.name)}
                            >
                                {category.name}
                            </Button>
                        ))}
                    </div>
                    <div className="grid grid-cols-auto-fit-minmax gap-2">
                        {filteredProducts.map(product => (
                            <ProductListItem product={product} key={product.id} addProduct={handleAddToCart}
                                             removeProduct={handleRemoveToCart} productsCart={productsCart}/>
                        ))}
                    </div>
                </div>
                <Card className={'w-1/3 right-3 hidden lg:block'}>
                    <CardHeader className={'flex-row items-center justify-between'}>
                        <Button variant={'secondary'} disabled>
                            <FaReceipt/>
                        </Button>
                        <CardTitle className={'text-muted-foreground'}>
                            {appContext.user()?.name} {appContext.user()?.lastname}
                            <span className={'text-sm font-light block text-center'}>
                                Pedido #003
                            </span>
                        </CardTitle>
                        <Button variant={'secondary'} disabled>
                            <IconPencil/>
                        </Button>
                    </CardHeader>
                    <CardContent className={'grid grid-cols-[1fr,150px space-y-2'}>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder={'Selecciona mesa'}/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Ubicación</SelectLabel>
                                    <SelectItem value="apple">Mesa 1</SelectItem>
                                    <SelectItem value="banana">Mesa 2</SelectItem>
                                    <SelectItem value="blueberry">Mesa 3</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <ScrollArea className={'grid grid-rows-[1fr_50px] h-[500px] p-3'}>
                            <div className={'w-full space-y-2 h-[30px]'}>
                                {
                                    productsCart.length > 0 && (
                                        productsCart.map(product => (
                                            <div className="flex items-center p-4 border rounded-lg" key={product.id}>
                                                <div className="flex-shrink-0">
                                                    <Image width={100} height={100}
                                                           src={product.images[0] ?? 'https://placehold.co/250x250'}
                                                           alt={product.name}
                                                           className="w-16 h-16 rounded"/>
                                                </div>
                                                <div className="ml-4 flex-1">
                                                    <h2 className={"font-bold"}>{product.name}</h2>
                                                    <span className={"text-muted-foreground"}>x{product.quantity}</span>
                                                </div>
                                                <p>
                                                    <span className={"text-muted-foreground text-sm"}>
                                                        €
                                                    </span>
                                                    <span className={"font-bold"}>
                                                        {product.price}
                                                    </span>
                                                </p>
                                            </div>
                                        ))
                                    )
                                }
                            </div>
                        </ScrollArea>
                        <div className={'flex flex-col'}>
                            <div className={'flex justify-between'}>
                                <span>
                                    SubTotal
                                </span>
                                <span>
                                    {total.toFixed(2)}
                                </span>
                            </div>
                            <div className={'flex justify-between'}>
                                <span>
                                    IVA 10%
                                </span>
                                <span>
                                    {(total * 1.10).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="p-0">
                        <Button className={'w-full rounded-none rounded-bl-lg rounded-br-lg uppercase'}>
                            Realizar pedido
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }
    return (
        <h1>Loading....</h1>
    )
}