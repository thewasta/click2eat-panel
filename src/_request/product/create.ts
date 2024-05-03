'use server'

import {requestWithSession} from "@/_request/request";
import {revalidatePath} from "next/cache";

export async function create(form: FormData) {
    const ENDPOINT = 'api/v1/products';
    await requestWithSession(ENDPOINT, 'POST', form);
    revalidatePath('/dashboard/home/menu');
}