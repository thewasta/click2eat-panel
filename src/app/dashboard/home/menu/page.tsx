'use client';

import Image from "next/image";
import {useEffect, useState} from "react";
import {Product} from "@/_request/product/model/product";
import {retrieveProducts} from "@/_request/product/productRetriever";

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    useEffect(() => {
        retrieveProducts()
            .then(response => {
                const newProducts = response.message as Product[];
                setProducts(newProducts);
            });
    }, []);

    return (
        <div className={"col-span-3"}>
            <table className={"table"}>
                <thead className={"text-[#10162499]"}>
                <tr>
                    <th>
                        Imagen
                    </th>
                    <th>
                        Nombre
                    </th>
                    <th>
                        Precio
                    </th>
                    <th>
                        Categoría
                    </th>
                    <th>
                        Acciones
                    </th>
                </tr>
                </thead>
                <tbody className={"text-[#10162499]"}>
                {
                    products.map(product => (
                        <tr key={product.id} className={"hover hover:text-white hover:cursor-pointer"}>
                            <td>
                                <Image src={"https://placehold.co/50x50"} width={50} height={50} alt={"product image"}/>
                            </td>
                            <td>
                                {product.name}
                            </td>
                            <td>
                                {product.price}
                            </td>
                            <td>
                                {product.category}
                            </td>
                            <td>
                                <button className={"btn btn-primary"}>
                                    Editar
                                </button>
                                <button className={"btn btn-danger"}>
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))
                }
                </tbody>
            </table>
        </div>
    );
}