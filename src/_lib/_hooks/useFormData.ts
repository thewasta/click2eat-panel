import { useCallback } from "react";

type PrimitiveValue = string | number | boolean | File | Date;

type RecursiveObject = {
    [key: string]: PrimitiveValue | PrimitiveValue[] | RecursiveObject | RecursiveObject[];
};

type ComplexValue = PrimitiveValue | PrimitiveValue[] | RecursiveObject | RecursiveObject[];

type DTO = Record<string, ComplexValue>;

type FormDataEntryValue = string | File;

export type TypedFormData<T extends DTO> = FormData & {
    get<K extends keyof T>(key: K): FormDataEntryValue | null;
    getAll<K extends keyof T>(key: K): FormDataEntryValue[];
    append<K extends keyof T>(key: K, value: FormDataEntryValue, fileName?: string): void;
    set<K extends keyof T>(key: K, value: FormDataEntryValue, fileName?: string): void;
};

function isFile(value: any): value is File {
    return value instanceof File;
}

function isDate(value: any): value is Date {
    return value instanceof Date;
}

function appendToFormData<T extends DTO>(formData: TypedFormData<T>, key: string, value: any) {
    if (isFile(value)) {
        formData.append(key, value);
    } else if (Array.isArray(value)) {
        if (value.length > 0 && isFile(value[0])) {
            // Si es un array de archivos, agrégalos individualmente
            value.forEach((file, index) => {
                formData.append(`${key}`, file);
            });
        } else {
            value.forEach((item, index) => {
                appendToFormData(formData, `${key}[${index}]`, item);
            });
        }
    } else if (isDate(value)) {
        formData.append(key, value.toISOString());
    } else if (typeof value === 'object' && value !== null) {
        Object.entries(value).forEach(([subKey, subValue]) => {
            appendToFormData(formData, `${key}[${subKey}]`, subValue);
        });
    } else if (value !== null && value !== undefined) {
        formData.append(key, String(value));
    }
}
export function getComplexFormDataValue<T>(formData: FormData, key: string): T {
    const result: Record<string, any> = {};
    Array.from(formData.entries()).forEach(([formKey, formValue]) => {
        if (formKey.startsWith(`${key}`)) {
            const path = formKey.slice(key.length).split(/[\[\]]+/).filter(Boolean);
            let current = result;
            for (let i = 0; i < path.length - 1; i++) {
                if (!(path[i] in current)) {
                    current[path[i]] = isNaN(Number(path[i + 1])) ? {} : [];
                }
                current = current[path[i]];
            }
            current[path[path.length - 1]] = formValue;
        }
    });

    if (Object.keys(result).every(key => !isNaN(Number(key)))) {
        return Object.values(result) as T;
    }

    return result as T;
}
export default function useFormData<T extends DTO>() {
    return useCallback((values: T): TypedFormData<T> => {
        const formData = new FormData() as TypedFormData<T>;
        Object.entries(values).forEach(([key, value]) => {
            appendToFormData(formData, key, value);
        });
        console.log(formData.get('images'));
        console.log(formData.getAll('images'));
        return formData;
    }, []);
}