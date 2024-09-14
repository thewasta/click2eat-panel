'use client'
import {useMediaQuery} from "@/_lib/_hooks/useMediaQuery";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {useQuery} from "@tanstack/react-query";
import {Product} from "@/_lib/dto/productDto";
import {productRetriever} from "@/app/actions/dashboard/product.service";
import Image from "next/image";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {FaReceipt} from "react-icons/fa";
import {useUserAppContext} from "@/lib/context/auth/user-context";
import {FaPencil} from "react-icons/fa6";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {useState} from "react";
import {ScrollArea} from "@/components/ui/scroll-area";

const apiURL = 'https://api-dev.click2eat.es/';
type ProductCart = Product & {
    quantity: number;
}
export default function TPVPage() {
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const appContext = useUserAppContext();
    const {data, error, isLoading} = useQuery({
        queryKey: ["products"],
        queryFn: async () => productRetriever({page: 1, pageSize: 1}),
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchIntervalInBackground: false
    });
    const [productsCart, setProductsCart] = useState<ProductCart[]>([]);

    const handleAddToCart = (product: ProductCart) => {
        const index = productsCart.findIndex(productFind => productFind.id === product.id);
        if (index >= 0) {
            productsCart[index].quantity++;
            setProductsCart([...productsCart]);
        }else {
            setProductsCart([...productsCart, product]);
        }
    }
    if (data) {
        return ((
            <div className={'flex'}>
                <div className={"w-2/3 grid grid-cols-[repeat(auto-fit,_150px)] gap-3"}>
                    {
                        // @ts-ignore
                        data.message.response.map((product: Product) => (
                            <Card key={product.id} onClick={event => handleAddToCart({...product, quantity: 1})}>
                                <CardHeader className={'p-1'}>
                                    <div style={{width: '100%', height: '100%', position: 'relative'}}>
                                        <Image
                                            className={'aspect-square rounded'}
                                            alt='Mountains'
                                            src={`${apiURL}${product.image}`}
                                            width={200} height={200}
                                        />
                                    </div>
                                </CardHeader>
                                <CardContent className={'truncate pl-1 space-y-2'}>
                                    <h3>{product.name}</h3>
                                    <div className={'flex justify-between'}>
                                        <Badge>
                                            {product.category}
                                        </Badge>
                                        <span>
                                        {product.price}€
                                    </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    }
                </div>
                {/*LATERAL*/}
                <Card className={'w-1/3 absolute right-3'}>
                    <CardHeader className={'flex-row items-center justify-between'}>
                        <Button variant={'secondary'} disabled>
                            <FaReceipt/>
                        </Button>
                        <CardTitle className={'text-muted-foreground'}>
                            {appContext.user()?.name} {appContext.user()?.lastname}
                            <span className={'text-sm font-light block text-center'}>
                                Pedido #001
                            </span>
                        </CardTitle>
                        <Button variant={'secondary'} disabled>
                            <FaPencil/>
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
                        <ScrollArea className={'grid grid-rows-[1fr_50px] h-[500px]'}>
                            <div className={'w-full h-[30px]'}>
                                {
                                    productsCart.length > 0 && (
                                        productsCart.map(product => (
                                            <div className="flex items-center p-4 border rounded-lg" key={product.id}>
                                                <div className="flex-shrink-0">
                                                    <img src={`${apiURL}${product.image}`} alt={product.name}
                                                         className="w-16 h-16 rounded"/>
                                                </div>
                                                <div className="ml-4 flex-1">
                                                    <h2>{product.name}</h2>
                                                    <p className="text-muted-foreground">{product.price}€</p>
                                                </div>
                                                <div className="flex items-center">
                                                    <Button variant={'secondary'}>
                                                        -
                                                    </Button>
                                                    <span className="mx-2 text-lg">
                                                        {product.quantity}
                                                    </span>
                                                    <Button variant={'secondary'}>
                                                        +
                                                    </Button>
                                                </div>
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
                                    70€
                                </span>
                            </div>
                            <div className={'flex justify-between'}>
                                <span>
                                    IVA 10%
                                </span>
                                <span>
                                    77€
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
        ));
    }
    return (
        <h1>Loading....</h1>
    )
}