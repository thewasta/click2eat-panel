'use client'

import {Tables} from "@/types/database/database";
import {Card, CardContent, CardFooter, CardTitle} from "@/components/ui/card";
import Image from "next/image";
import React from "react";
import {Button} from "@/components/ui/button";
import {IconMinus, IconPlus} from "@tabler/icons-react";

type Product = Tables<'products'>;

type ProductCart = Product & {
    quantity: number;
}
type ProductListItemProps = {
    product: Product;
    addProduct: (product: Product) => void;
    removeProduct: (product: Product) => void;
    productsCart: ProductCart[];
}

export function ProductListItem(props: ProductListItemProps) {
    const {product, productsCart} = props;
    const productInCart = productsCart.filter(productFind => productFind.id === product.id);

    return (
        <Card className="overflow-hidden hover:cursor-pointer">
            <CardContent className="flex p-3 gap-1" onClick={() => props.addProduct(props.product)}>
                <Image
                    width={250}
                    height={250}
                    className="w-24 h-24 object-cover rounded-md"
                    src='https://placehold.co/250x250'
                    alt={product.name}
                />
                <div className="flex flex-col">
                    <CardTitle className="text-lg font-semibold select-none">
                        {product.name}
                    </CardTitle>
                    <p className="text-sm text-wrap text-gray-600 select-none">
                        {product.description}
                    </p>
                </div>
            </CardContent>
            <CardFooter className={"flex justify-between"}>
                <span className="font-bold text-lg">
                    ${product.price?.toFixed(2) || "0.00"}
                </span>
                <section className={"flex items-center gap-3 bg-zinc-100 rounded-3xl"}>
                    <Button size={"icon"} className={"rounded-full"} variant={"outline"}
                            onClick={() => props.removeProduct(product)}>
                        <IconMinus/>
                    </Button>
                    {
                        productInCart.length > 0 ? productInCart[0].quantity : 0
                    }
                    <Button size={"icon"} className={"rounded-full"} onClick={() => props.addProduct(product)}>
                        <IconPlus/>
                    </Button>
                </section>
            </CardFooter>
        </Card>
    );
}