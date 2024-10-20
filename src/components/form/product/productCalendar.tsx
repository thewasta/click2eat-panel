import {FormField, FormItem} from "@/components/ui/form";
import {UseFormReturn} from "react-hook-form";
import {CreateProductDTO} from "@/_lib/dto/productFormDto";
import {DatePicker} from "@nextui-org/date-picker";
import {getLocalTimeZone, parseAbsoluteToLocal, today} from "@internationalized/date"

type ProductCalendarProps = {
    form: UseFormReturn<CreateProductDTO>
}

export function ProductCalendar({form}: ProductCalendarProps) {
    return (
        <FormField
            control={form.control}
            name="publishDate"
            render={({field: {onChange, value}}) => (
                <FormItem className={"col-span-2"}>
                    <DatePicker
                        isDisabled
                        hourCycle={24}
                        granularity={"minute"}
                        minValue={today(getLocalTimeZone())}
                        description={"No funcionando actualmente"}
                        label={"Progamar publicación"}
                        isInvalid={!!form.formState.errors.publishDate}
                        errorMessage={form.formState.errors.publishDate ? form.formState.errors.publishDate.message : null}
                        value={value && parseAbsoluteToLocal(value.toISOString())}
                        showMonthAndYearPickers
                        //@ts-ignore
                        onChange={date => onChange(new Date(date.year, date.month - 1, date.day, date.hour, date.minute))}
                        hideTimeZone
                    />
                </FormItem>
            )}
        />
    );
}