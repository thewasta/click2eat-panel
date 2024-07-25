import {useCallback} from "react";

type FormDataValue = string | number | boolean | File | File[] | Date;

type DTO = Record<string, FormDataValue>;

export type TypedFormData<T extends DTO> = FormData & {
    get(key: keyof T): string | File | null;
    getAll(key: keyof T): string[] | File[];
    append(key: keyof T, value: string | Blob, fileName?: string): void;
    set(key: keyof T, value: string | Blob, fileName?: string): void;
};

export default function useFormData<T extends DTO>() {
    return useCallback((values: T): TypedFormData<T> => {
        const formData = new FormData() as TypedFormData<T>;
        Object.entries(values).forEach(([key, value]) => {
            if (value instanceof File) {
                formData.append(key as keyof T, value);
            } else if (Array.isArray(value) && value[0] instanceof File) {
                value.forEach(file => formData.append(key as keyof T, file));
            } else if (value !== null && value !== undefined) {
                formData.append(key as keyof T, String(value));
            }
        });
        return formData;
    }, []);
}