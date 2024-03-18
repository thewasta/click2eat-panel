'use client'
import Image from "next/image";
import * as Icons from "react-icons/pi";
import React from "react";
import {FaShoppingCart} from "react-icons/fa";

/* Your icon name from database data can now be passed as prop */


const products = [
    {
        image: '/250.svg',
        price: 28,
        name: 'product name'
    }, {
        image: '/250.svg',
        price: 28,
        name: 'product name'
    }, {
        image: '/250.svg',
        price: 28,
        name: 'product name'
    }, {
        image: '/250.svg',
        price: 28,
        name: 'product name'
    }, {
        image: '/250.svg',
        price: 28,
        name: 'product name'
    }, {
        image: '/250.svg',
        price: 28,
        name: 'product name'
    }, {
        image: '/250.svg',
        price: 28,
        name: 'product name'
    }, {
        image: '/250.svg',
        price: 28,
        name: 'product name'
    }, {
        image: '/250.svg',
        price: 28,
        name: 'product name'
    }, {
        image: '/250.svg',
        price: 28,
        name: 'product name'
    }, {
        image: '/250.svg',
        price: 28,
        name: 'product name'
    }, {
        image: '/250.svg',
        price: 28,
        name: 'product name'
    }, {
        image: '/250.svg',
        price: 28,
        name: 'product name'
    }, {
        image: '/250.svg',
        price: 28,
        name: 'product name'
    },
];
export default function TableDiningPage() {
    return (
        <>

            <main className="grid grid-cols-2 gap-4 mt-4 p-3 mb-7">
                {products.map((product, i) => (
                    <div key={i} className="flex flex-col items-start">
                        <Image src={product.image} alt="Product Image" width={100} height={100}
                               className="size-fit rounded-md"
                        />
                        <p className="flex flex-col">
                            <span className="font-medium capitalize">
                                {product.name}
                            </span>
                            <span className="text-gray-600">
                                {product.price}€
                            </span>
                        </p>
                    </div>
                ))}
            </main>
            <footer className="fixed flex items-center justify-between bottom-0 left-0 rounded-t-3xl bg-blue-500 w-full h-12 p-2 px-6">
                <p className="text-white font-medium">
                    Mi pedido
                </p>
                <FaShoppingCart className="text-white" />
            </footer>
        </>
    )
}