'use client'

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import React, {useState} from "react";
import {useMutation} from "@tanstack/react-query";
import {checkOut} from "@/app/actions/stripe/stripe_actions";
import {toast} from "sonner";
import {getStripe} from "@/_lib/stripe/client";
import {CheckIcon} from "lucide-react";
import {logout} from "@/app/actions/auth/login_actions";

type PricePlan = {
    title: string;
    description: string;
    shortDescription?: string;
    benefits: string[];
    price: number;
    priceId: string
}
type PricingProps = {
    products: PricePlan[]
}

export function Pricing({products}: PricingProps) {
    const [buttonClicked, setButtonClicked] = useState<boolean>(false);
    const mutation = useMutation({
        mutationFn: checkOut,
        onSuccess: async (data) => {
            if (!data) {
                toast.error('No ha sido posible inciar el pago.');
                return;
            }
            const stripe = await getStripe()
            await stripe?.redirectToCheckout({
                sessionId: data?.sessionId
            })
        },
        onError: () => {
            toast.error('No ha sido posible inciar el pago.');
        },
        onSettled: () => {
            setButtonClicked(false);
        }
    });
    const logoutMutation = useMutation({
        mutationFn: logout
    })
    const handleClick = (priceId: string, priceQuantity: number) => {
        setButtonClicked(true);
        mutation.mutate({priceId, priceQuantity});
    }
    const handleLogout = () => {
        logoutMutation.mutate();
    }
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">            {
                products?.length && products.map(product => {
                        const priceString = Intl.NumberFormat('en-US', {
                            style: 'currency', currency: "eur",
                            minimumFractionDigits: 0
                        }).format((product.price || 0) / 100);
                        return (
                            <Card key={product.priceId}>
                                <CardHeader>
                                    <CardTitle>
                                        {
                                            product.title
                                        }
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className={'space-y-4'}>
                                    <Button
                                        disabled={buttonClicked}
                                        className="w-full" onClick={() => handleClick(product.priceId, product.price)}
                                    >
                                        Suscribirse
                                    </Button>
                                    <p className="text-muted-foreground">{product.description}</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-bold">{priceString}</span>
                                        <span className="text-muted-foreground">/mes</span>
                                    </div>
                                    {
                                        product.shortDescription &&
                                        <p className="text-muted-foreground">{product.shortDescription}</p>
                                    }
                                    <ul className="space-y-2 text-muted-foreground">
                                        {
                                            product.benefits.map((benefit, index) => (
                                                <li key={index}>
                                                    <CheckIcon className="mr-2 inline-block h-4 w-4 text-primary"/>
                                                    {benefit}
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </CardContent>
                            </Card>
                        )
                    }
                )
            }
            </div>
            <Button variant={'link'} className={'justify-end self-end'} onClick={handleLogout}>
                Cerrar sesión
            </Button>
        </>
    )
}