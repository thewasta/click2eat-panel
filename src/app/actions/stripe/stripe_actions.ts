'use server'
import {createClient} from "@/_lib/supabase/server";
import {createOrRetrieveCustomer} from "@/_lib/supabase/admin";
import Stripe from "stripe";
import {stripe} from "@/_lib/stripe/config";



export async function checkOut(priceId: string) {
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

    const params: Stripe.Checkout.SessionCreateParams = {
        allow_promotion_codes: false,
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
        success_url: process.env.NEXT_PUBLIC_DOMAIN + '/'
    }

    let session;
    try {
        session = await stripe.checkout.sessions.create(params);
    } catch (e) {
        throw new Error('Unable to create checkout session.');
    }
    if (session) {
        return {
            sessionId: session.id
        }
    }
    throw new Error('Unable to create checkout session.');
}