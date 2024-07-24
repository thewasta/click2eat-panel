
'use client'

import {SelectItem} from "@/components/ui/select";

type ICategoryItemInput = {
    name: string;
    category_id: string;
}

export function CategoryItemInput({name, category_id}: ICategoryItemInput) {
    return (
        <SelectItem value={category_id}>
            {name}
        </SelectItem>
    )
}