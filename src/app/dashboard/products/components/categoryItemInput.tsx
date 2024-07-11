'use client'

import {SelectItem} from "@/components/ui/select";
import {Tables} from "@/types/database/database";


export function CategoryItemInput({name, category_id}: Tables<'category'>) {
    return (
        <SelectItem value={category_id}>
            {name}
        </SelectItem>
    )
}