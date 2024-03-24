import {NextRequest, NextResponse} from "next/server";

interface ExampleParams {
    params: Record<'node', string>
}

const GET = async (req: NextRequest, res: NextResponse) => {
    console.log('NUEVA REQUEST');
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const restaurantNode = searchParams.get('node');
    if (null === restaurantNode) {
        return NextResponse.json({"message": "NODE_REQUIRED"});
    }
    try {
        const request = await fetch(`${process.env.BASE_PRODUCTS}/api/products`);
        const response = await request.json()
        const parseResponse = [];
        for (const product of response.products) {
            parseResponse.push({
                title: product.title,
                description: product.description,
                price: product.price,
                image: product.thumbnail,
                category: product.category
            });
        }

        return NextResponse.json(parseResponse);
    } catch (error) {
        console.error(error)
        return NextResponse.json({"error": true})
    }
}

export {GET};