import {Card, CardContent} from "@/components/ui/card";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {ArrowRight, Minus} from "lucide-react";
import {Fragment} from "react";
import {Separator} from "@/components/ui/separator";

type ProductFormIngredientsProps = {
    handleAddIngredient: (value: string) => void,
    handleRemoveIngredient: (value: string) => void
}

export function ProductFormIngredients({handleAddIngredient, handleRemoveIngredient}: ProductFormIngredientsProps) {
    return (
        <Card className={'pt-3 w-full bg-background'}>
            <CardContent>
                <FormField
                    name={'ingredients'}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>
                                Ingredientes
                            </FormLabel>
                            <FormMessage/>
                            <div className={'flex gap-2'}>
                                <FormControl>
                                    <Input
                                        className={'w-1/3'}
                                        placeholder={'Cebolla, pimiento, bacon...'}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter') {
                                                event.preventDefault();
                                                handleAddIngredient(event.currentTarget.value);
                                                event.currentTarget.value = '';
                                            }
                                        }}
                                    />
                                </FormControl>
                                <Button type={"button"} variant={'ghost'} size={'icon'}
                                        onClick={() => {
                                            const input = document.querySelector('input[placeholder="Cebolla, pimiento, bacon..."]') as HTMLInputElement;
                                            handleAddIngredient(input.value);
                                            input.value = '';
                                        }}>
                                    <ArrowRight className={'h-4 w-4'}/>
                                </Button>
                                <section className={'w-2/3'}>
                                    <ul className={'list-decimal flex flex-col gap-1'}>
                                        {
                                            field.value.map((ing: string, index: number) => (
                                                <Fragment key={index}>
                                                    <li className={'flex items-center justify-between gap-3 capitalize'}
                                                        key={index}>
                                                                                <span>
                                                                                    {ing}
                                                                                </span>
                                                        <Button type={'button'} size={'icon'}
                                                                variant="destructive"
                                                                className={'h-4 w-4'}
                                                                onClick={() => handleRemoveIngredient(ing)}
                                                        >
                                                            <Minus className={'h-4 w-4'}/>
                                                        </Button>
                                                    </li>
                                                    <Separator/>
                                                </Fragment>
                                            ))
                                        }

                                    </ul>
                                </section>
                            </div>
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>
    )
}