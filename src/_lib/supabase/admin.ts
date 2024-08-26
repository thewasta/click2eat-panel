import {createClient} from "@supabase/supabase-js";
import {Database, TablesInsert} from "@/types/database/database";
import Stripe from "stripe";
import {stripe} from "@/_lib/stripe/config";

const supabaseAdmin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const upsertProductRecord = async (product: Stripe.Product) => {
    const productData = {
        id: product.id,
        active: product.active,
        name: product.name,
        description: product.description ?? null,
        image: product.images?.[0] ?? null,
        metadata: product.metadata
    };

    const {error: upsertError} = await supabaseAdmin
        .from('stripe_products')
        .upsert([productData]);
    if (upsertError)
        throw new Error(`Product insert/update failed: ${upsertError.message}`);
    console.log(`Product inserted/updated: ${product.id}`);
};
const deleteProductRecord = async (product: Stripe.Product) => {
    const {error: deletionError} = await supabaseAdmin
        .from('stripe_products')
        .delete()
        .eq('id', product.id);
    if (deletionError)
        throw new Error(`Product deletion failed: ${deletionError.message}`);
    console.log(`Product deleted: ${product.id}`);
};

const upsertPriceRecord = async (
    price: Stripe.Price,
    retryCount = 0,
    maxRetries = 3
) => {
    const priceData = {
        id: price.id,
        product_id: typeof price.product === 'string' ? price.product : '',
        active: price.active,
        currency: price.currency,
        type: price.type,
        unit_amount: price.unit_amount ?? null,
        interval: price.recurring?.interval ?? null,
        interval_count: price.recurring?.interval_count ?? null,
        trial_period_days: price.recurring?.trial_period_days
    };

    const {error: upsertError} = await supabaseAdmin
        .from('stripe_prices')
        .upsert([priceData]);

    if (upsertError?.message.includes('foreign key constraint')) {
        if (retryCount < maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            await upsertPriceRecord(price, retryCount + 1, maxRetries);
        } else {
            throw new Error(
                `Price insert/update failed after ${maxRetries} retries: ${upsertError.message}`
            );
        }
    } else if (upsertError) {
        throw new Error(`Price insert/update failed: ${upsertError.message}`);
    }
};
const deletePriceRecord = async (price: Stripe.Price) => {
    const {error} = await supabaseAdmin.from('stripe_prices').delete().eq('id', price.id);
    if (error) throw new Error(error.message)
}
const toDateTime = (secs: number) => {
    var t = new Date(+0); // Unix epoch start.
    t.setSeconds(secs);
    return t;
};
const manageSubscriptionStatusChange = async (subscriptionId: string, customerId: string, createAction = false) => {
    const {data: customerData, error: noCustomerError} = await supabaseAdmin
        .from('stripe_customer')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single();
    if (noCustomerError) {
        console.error(noCustomerError);
        throw new Error('Customer not found');
    }

    const {id: uid} = customerData;
    const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId, {
        expand: ['default_payment_method']
    });
    const subscriptionData: TablesInsert<'subscriptions'> = {
        id: stripeSubscription.id,
        user_id: uid,
        metadata: stripeSubscription.metadata,
        status: stripeSubscription.status,
        price_id: stripeSubscription.items.data[0].price.id,
        //@ts-ignore
        quantity: stripeSubscription.quantity,
        cancel_at_period_end: stripeSubscription.cancel_at_period_end,
        cancel_at: stripeSubscription.cancel_at
            ? toDateTime(stripeSubscription.cancel_at).toISOString()
            : null,
        canceled_at: stripeSubscription.canceled_at
            ? toDateTime(stripeSubscription.canceled_at).toISOString()
            : null,
        current_period_start: toDateTime(
            stripeSubscription.current_period_start
        ).toISOString(),
        current_period_end: toDateTime(
            stripeSubscription.current_period_end
        ).toISOString(),
        ended_at: stripeSubscription.ended_at
            ? toDateTime(stripeSubscription.ended_at).toISOString()
            : null,
        trial_start: stripeSubscription.trial_start
            ? toDateTime(stripeSubscription.trial_start).toISOString()
            : null,
        trial_end: stripeSubscription.trial_end
            ? toDateTime(stripeSubscription.trial_end).toISOString()
            : null

    }
    if (subscriptionData.status === 'active') {
        await supabaseAdmin.auth.updateUser({
            data: {
                hasActiveSubscription: true
            }
        });
    } else {
        await supabaseAdmin.auth.updateUser({
            data: {
                hasActiveSubscription: false
            }
        });
    }
    const {error: upsertError} = await supabaseAdmin.from('subscriptions').upsert([subscriptionData]);
    if (upsertError) {
        throw new Error(`Insert/Update of subscription ${subscriptionId} failed: ${upsertError.message}`);
    }
}
const updatePaymentTokenStatus = async (sessionId: string) => {
    const {
        error
    } = await supabaseAdmin.from('stripe_payment_token')
        .update({is_pending: false})
        .eq('stripe_session_id', sessionId)
        .single()

    if (error) {
        console.error(`Unable to find payment with session: ${sessionId}`);
        return;
    }
}
const upsertCustomerToSupabase = async (uuid: string, customerId: string) => {
    const {error: upsertError} = await supabaseAdmin
        .from('stripe_customer')
        .upsert([{id: uuid, stripe_customer_id: customerId}]);

    if (upsertError)
        throw new Error(`Supabase customer record creation failed: ${upsertError.message}`);

    return customerId;
};
const createCustomerInStripe = async (uid: string, email: string): Promise<string> => {
    const customerData = {metadata: {supabaseUUID: uid}, email: email};
    const newCustomer = await stripe.customers.create(customerData);
    if (!newCustomer) throw new Error('Stripe customer creation failed.');
    return newCustomer.id;

}
const createOrRetrieveCustomer = async (uid: string, email: string): Promise<string> => {
    const {
        data: existCustomer,
        error: errorExistCustomer
    } = await supabaseAdmin.from('stripe_customer').select().eq('id', uid).maybeSingle()

    if (errorExistCustomer) {
        throw new Error(`Supabase customer lookup failed: ${errorExistCustomer.message}`);
    }

    let stripeCustomerId: string | undefined;

    if (existCustomer?.stripe_customer_id) {
        const stripeCustomer = await stripe.customers.retrieve(existCustomer.stripe_customer_id);

        stripeCustomerId = stripeCustomer.id;
    } else {
        const stripeCustomers = await stripe.customers.list({
            email: email
        });
        stripeCustomerId =
            stripeCustomers.data.length > 0 ? stripeCustomers.data[0].id : undefined;
    }

    const stripeIdToInsert = stripeCustomerId ? stripeCustomerId : await createCustomerInStripe(uid, email);
    if (!stripeIdToInsert) throw new Error('Stripe customer creation failed.');
    if (existCustomer?.stripe_customer_id !== stripeCustomerId) {
        const {error: updateError} = await supabaseAdmin.from('stripe_customer')
            .update({stripe_customer_id: stripeCustomerId})
            .eq('id', uid);

        if (updateError) {
            throw new Error(updateError.message);
        }
        return stripeIdToInsert;
    }
    const upsertedStripeCustomer = await upsertCustomerToSupabase(
        uid,
        stripeIdToInsert
    );
    if (!upsertedStripeCustomer)
        throw new Error('Supabase customer record creation failed.');

    return upsertedStripeCustomer;
}

const businessHasActiveSubscription = async (userUid: string): Promise<boolean> => {
    const {data: ownerSubscription} = await supabaseAdmin.from('subscriptions')
        .select('status')
        .eq('user_id', userUid);

    if (ownerSubscription) {
        return !!ownerSubscription.find(subscription => subscription.status === 'active' || subscription.status === 'trialing');
    }
    const {data: userAssignments} = await supabaseAdmin
        .from('business_user_assignments')
        .select(`
            role,
            business_establishments!inner (
                business!inner (
                    user_id
                )
            )
        `)
        .eq('user_id', userUid);

    if (!userAssignments || userAssignments.length === 0) {
        return false;
    }
    const ownerIds = userAssignments.map(assignment => assignment.business_establishments.business.user_id);

    const {data} = await supabaseAdmin.from('subscriptions').select('status').in('user_id', ownerIds);
    return !!(data && data.length > 0 && data[0].status === 'active');
}

const createPaymentToken = async (token: string, userId: string, sessionId: string | null, priceId: string): Promise<string> => {
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await supabaseAdmin.from('stripe_payment_token').insert({
        token: token,
        user_id: userId,
        stripe_session_id: sessionId as string,
        price_id: priceId,
        expired_at: expiresAt.toUTCString()
    });

    return token;
}

const checkPaymentTokenIsPending = async (token: string, userId: string) => {
    const {data: paymentToken, error} = await supabaseAdmin.from('stripe_payment_token')
        .select()
        .eq('user_id', userId)
        .eq('token', token)
        .maybeSingle();
    if (!error && paymentToken) {
        return paymentToken.is_pending;
    }
    throw new Error(`Unable to find payment with token <${token}> and user <${userId}>`);
}
export {
    upsertProductRecord,
    deleteProductRecord,
    upsertPriceRecord,
    deletePriceRecord,
    createOrRetrieveCustomer,
    manageSubscriptionStatusChange,
    updatePaymentTokenStatus,
    businessHasActiveSubscription,
    createPaymentToken,
    checkPaymentTokenIsPending
}