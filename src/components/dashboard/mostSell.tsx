import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Product} from "@/_request/product/model/product";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";

type DashboardMostSellProps = {
    products: Product[]
}
export default function DashboardMostSell(props: DashboardMostSellProps) {
    const {products} = props;
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Lo más pedido
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className={'space-y-3'}>
                    {
                        !!products.length && products.map((product, index) => (
                            <div className={'flex items-center'} key={index}>
                                <Avatar>
                                    <AvatarFallback>{product.images}</AvatarFallback>
                                </Avatar>
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">{product.name}</p>
                                </div>
                                <div className="ml-auto font-medium">{product.price}€</div>
                            </div>
                        ))
                    }
                </div>
            </CardContent>
        </Card>
    );
}