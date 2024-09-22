import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {CalendarIcon} from "lucide-react";
import {Calendar} from "@/components/ui/calendar";
import {es} from "date-fns/locale";
import {Input} from "@/components/ui/input";
import {UseFormReturn} from "react-hook-form";
import {CreateProductDTO} from "@/_lib/dto/productFormDto";

type ProductCalendarProps = {
    form: UseFormReturn<CreateProductDTO>
}

export function ProductCalendar({form}: ProductCalendarProps) {
    return (
        <FormField
            control={form.control}
            name="publishDate"
            render={({field}) => (
                <FormItem>
                    <FormLabel className="pr-4">Programar publicación</FormLabel>
                    <Popover
                    >
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        'w-full pl-3 text-left font-normal',
                                        !field.value && 'text-muted-foreground',
                                    )}
                                >
                                    {field.value ? (
                                        `${field.value.toLocaleString([])}`
                                    ) : (
                                        <span>01/01/2024, 0:00:00</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent>
                            <Calendar
                                locale={es}
                                className="p-0 capitalize"
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                            />
                            <Input
                                type="time"
                                className="mt-2"
                                // take hours and minutes and update our Date object then change date object to our new value
                                onChange={(selectedTime) => {
                                    const currentTime = field.value;
                                    currentTime?.setHours(
                                        parseInt(selectedTime.target.value.split(':')[0]),
                                        parseInt(selectedTime.target.value.split(':')[1]),
                                        0,
                                    );
                                    field.onChange(currentTime);
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                    <FormMessage/>
                    <FormDescription>
                        Fecha y hora a partir de la que estará disponible el producto.
                    </FormDescription>
                </FormItem>
            )}
        />
    );
}