'use server'
import {createClient} from "@/_lib/supabase/server";
import {checkPaymentTokenIsPending, createOrRetrieveCustomer, createPaymentToken} from "@/_lib/supabase/admin";
import Stripe from "stripe";
import {stripe} from "@/_lib/stripe/config";

const getURL = (path: string = '') => {
    let url =
        process?.env?.NEXT_PUBLIC_DOMAIN &&
        process.env.NEXT_PUBLIC_DOMAIN.trim() !== ''
            ? process.env.NEXT_PUBLIC_DOMAIN
            :
            process?.env?.NEXT_PUBLIC_VERCEL_URL &&
            process.env.NEXT_PUBLIC_VERCEL_URL.trim() !== ''
                ? process.env.NEXT_PUBLIC_VERCEL_URL
                :
                'http://localhost:3000/';

    url = url.replace(/\/+$/, '');
    url = url.includes('http') ? url : `https://${url}`;
    path = path.replace(/^\/+/, '');

    return path ? `${url}/${path}` : url;
};

export async function checkOut({priceId, priceQuantity}: { priceId: string, priceQuantity: number }) {
    const supabase = createClient();
    const {data: {user}, error: authError} = await supabase.auth.getUser();
    if (authError || !user) {
        throw new Error('Invalid session');
    }

    let customer: string;
    try {
        customer = await createOrRetrieveCustomer(user.id, user?.email || '');
    } catch (error) {
        throw new Error('Unable to access customer record.');
    }

    const generatePaymentToken = crypto.randomUUID();

    const params: Stripe.Checkout.SessionCreateParams = {
        allow_promotion_codes: false,
        automatic_tax: {
            enabled: true
        },
        billing_address_collection: 'required',
        customer,
        customer_update: {
            address: "auto"
        },
        line_items: [
            {
                price: priceId,
                quantity: 1
            }
        ],
        mode: 'subscription',
        success_url: getURL(`/subscription/processing?token=${generatePaymentToken}`),
        subscription_data: {
            trial_period_days: priceQuantity > 30 && priceQuantity < 70 ? 14 : undefined
        }
    }
    let session;
    try {
        session = await stripe.checkout.sessions.create(params);
    } catch (e) {
        throw new Error('Unable to create checkout session.');
    }
    await createPaymentToken(generatePaymentToken, user.id, session.id, priceId);
    if (session) {
        return {
            sessionId: session.id
        }
    }
    throw new Error('Unable to create checkout session.');
}

export async function processingPayment(token: string) {
    const supabase = createClient();
    const {data: {user}, error: authError} = await supabase.auth.getUser();
    if (authError || !user) {
        throw new Error('Invalid session');
    }
    const isPending = await checkPaymentTokenIsPending(token, user.id);
    return {
        isPending
    }
}