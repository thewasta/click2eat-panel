'use server'
import {revalidatePath} from "next/cache";

export async function revalidateContent(path: string) {
    revalidatePath(path);
}