'use client'

import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {PlusCircle, Trash2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {ChangeEvent, Dispatch, SetStateAction, useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Switch} from "@/components/ui/switch";
import {Label} from "@/components/ui/label";

type Variant = {
    name: string;
    price: number;
    isRequired: boolean;
}
type VariantGroup = {
    name: string;
    variants: Variant[]
}
type ProductFormVariantsProps = {
    variantGroups: VariantGroup[],
    setVariantGroups: Dispatch<SetStateAction<VariantGroup[]>>,

}

export function ProductFormVariants({variantGroups, setVariantGroups}: ProductFormVariantsProps) {
    const addVariantGroup = () => {
        setVariantGroups(
            [...variantGroups, {name: '', variants: [{name: '', price: 0, isRequired: false}]}]);
    };

    const removeVariantGroup = (groupIndex: number) => {
        setVariantGroups(variantGroups.filter((_, i) => i !== groupIndex));
    };
    const addVariant = (groupIndex: number) => {
        const newGroups = [...variantGroups];
        newGroups[groupIndex].variants.push({name: '', price: 0, isRequired: false});
        setVariantGroups(newGroups);
    };
    const removeVariant = (groupIndex: number, variantIndex: number) => {
        const newGroups = [...variantGroups];
        newGroups[groupIndex].variants = newGroups[groupIndex].variants.filter((_, i) => i !== variantIndex);
        setVariantGroups(newGroups);
    };
    const handleVariantChange = (groupIndex: number, variantIndex: number, field: keyof Variant, value: string | number | boolean) => {
        setVariantGroups(prevGroups => {
            const newGroups = [...prevGroups];
            const variant = newGroups[groupIndex].variants[variantIndex];

            switch (field) {
                case 'name':
                    variant.name = value as string;
                    break;
                case 'price':
                    variant.price = typeof value === 'string' ? parseFloat(value) : value as number;
                    break;
                case 'isRequired':
                    variant.isRequired = value as boolean;
                    break;
            }

            return newGroups;
        });
    };
    const handleGroupChange = (groupIndex: number, e: ChangeEvent<HTMLInputElement>) => {
        const newGroups = [...variantGroups];
        newGroups[groupIndex].name = e.target.value;
        setVariantGroups(newGroups);
    };
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button type={"button"} variant={'ghost'}>
                    <PlusCircle className={'mr-1'}/>
                    Variantes
                </Button>
            </SheetTrigger>
            <SheetContent className={'w-[400px] sm:w-[540px]'}>
                <SheetHeader>
                    <SheetTitle>
                        Creación de variación
                    </SheetTitle>
                    <SheetDescription>
                        Crea una (o varias) variación para tu producto
                    </SheetDescription>
                </SheetHeader>
                <div className={'space-y-3'}>
                    {variantGroups.map((group, groupIndex) => (
                        <Card key={groupIndex}>
                            <CardHeader>
                                <CardTitle>
                                    <Input
                                        value={group.name}
                                        onChange={event => handleGroupChange(groupIndex, event)}
                                        placeholder="Masa, Cocción..."
                                    />
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {group.variants.map((variant, variantIndex) => (
                                    <div key={variantIndex} className="flex space-x-2 mb-2">
                                        <Input
                                            name="name"
                                            value={variant.name}
                                            onChange={event => handleVariantChange(groupIndex, variantIndex, 'name', event.target.value)}
                                            placeholder="Fina, Al punto...."
                                        />
                                        <Input
                                            name="price"
                                            value={variant.price}
                                            onChange={event => handleVariantChange(groupIndex, variantIndex, 'price', event.target.value)}
                                            placeholder="Precio"
                                            type="number"
                                        />
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                checked={variant.isRequired}
                                                onCheckedChange={(checked) => handleVariantChange(groupIndex, variantIndex, 'isRequired', checked)}/>
                                            <Label htmlFor="airplane-mode">Requerido</Label>
                                        </div>
                                        <Button type="button" variant="ghost"
                                                onClick={() => removeVariant(groupIndex, variantIndex)}>
                                            <Trash2 className="h-4 w-4"/>
                                        </Button>
                                    </div>
                                ))}
                                <Button type="button" onClick={() => addVariant(groupIndex)} className="mt-2">
                                    <PlusCircle className="h-4 w-4 mr-2"/> Añadir Variante
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                    <Button type="button" onClick={addVariantGroup} className="mt-2">
                        <PlusCircle className="h-4 w-4 mr-2"/> Añadir Grupo de Variantes
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}