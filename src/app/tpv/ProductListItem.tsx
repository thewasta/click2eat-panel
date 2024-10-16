'use client'

import {Tables} from "@/types/database/database";
import {Card, CardBody, CardFooter} from "@nextui-org/card";
import {Image} from "@nextui-org/image";
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
        <Card isPressable className="overflow-hidden hover:cursor-pointer">
            <CardBody className="overflow-visible p-0" onClick={() => props.addProduct(props.product)}>
                <Image
                    shadow="sm"
                    radius="lg"
                    width="100%"
                    className="w-full object-cover h-[140px]"
                    src={product.images[0]}
                    alt={product.images[0]}
                />
            </CardBody>
            <CardFooter className={"flex gap-2 flex-col"}>
                <b>{product.name}</b>
                <div className={"flex gap-4 items-center justify-between"}>
                    <span className="font-bold text-lg">
                    ${product.price.toFixed(2)}
                </span>
                    <section className={"flex items-center gap-3 bg-zinc-100 dark:bg-zinc-600 rounded-3xl"}>
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
                </div>
            </CardFooter>
        </Card>
    );
}