'use client'
import FormInputText from "@/app/components/form/FormInputText";
import React, {useState} from "react";
import {create} from "@/_request/product/create";
import {useRouter} from "next/navigation";


interface AutoCompleteProps {
    items: string[];
    setValue: (value: any) => void,
    formValue: any
}

const AutoComplete = ({items, setValue, formValue}: AutoCompleteProps) => {
    const [inputVal, setInputVal] = useState<string>('');
    const onItemClicked = (item: string) => {
        setInputVal(item);
        setValue({
            ...formValue,
            category: item
        });
    };

    const filteredItems = items.filter((item) =>
        item.toLowerCase().includes(inputVal.toLowerCase())
    );

    return (
        <div className="dropdown">
            <input
                className="input bg-background input-bordered"
                placeholder="Seleccionar categoría"
                value={inputVal}
                name={"category"}
                onChange={(e) => setInputVal(e.target.value)}
            />
            <ul className="dropdown-content z-[1] menu p-2 shadow bg-background rounded-box w-52 max-h-80 flex-nowrap overflow-auto">
                {
                    filteredItems.map((item) => (
                            <li key={item}>
                                {/*onItemClicked(item)*/}
                                <button type={"button"} onClick={() => onItemClicked(item)}>{item}</button>
                            </li>
                        )
                    )
                }
            </ul>
        </div>
    );
};

interface FormInputProps {
    name: string;
    description: string;
    price: number;
    category: string;
    image: File | null;
}

export default function CreateProductPage() {

    const router = useRouter();
    const [formData, setFormData] = useState<FormInputProps>({
        name: '',
        description: '',
        price: 0,
        category: '',
        image: null
    });
    const items = [
        "1",
        "2",
        "3"
    ];

    function handle(e: React.ChangeEvent<HTMLInputElement>) {
        const newFormData = {...formData};
        if (e.target.name === 'image' && e.target.files) {
            newFormData['image'] = e.target.files[0];
        } else {
            //@ts-ignore
            newFormData[e.target.name as keyof FormInputProps] = e.target.value;
        }
        setFormData(newFormData);
    }

    function handleTextArea(e: React.ChangeEvent<HTMLTextAreaElement>) {
        const newFormData = {...formData};
        newFormData["description"] = e.target.value;
        setFormData(newFormData);
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = new FormData();
        Object.keys(formData).map(property => {
            //@ts-ignore
            form.append(property, formData[property]);
        });
        form.append('status','1');
        form.append('businessUuid','fcd16dea-1642-4536-98ff-fa811984c568');
        try {
            await create(form);
            router.back();
        } catch (e) {
        }
    }

    return (
        <div className={"col-span-3"}>
            <form
                className={"w-full flex flex-col gap-3 items-start shadow-md p-4 bg-background rounded-sm"}
                onSubmit={handleSubmit}
            >
                <div className="flex flex-col xl:flex-row gap-3">
                    <FormInputText placeholder={"Nombre producto"} inputType={"text"} name={"name"}
                                   onChange={handle}/>
                    <FormInputText placeholder={"Precio"} inputType={"number"} name={"price"}
                                   onChange={handle}/>
                    <AutoComplete items={items} setValue={setFormData} formValue={formData}/>
                    <textarea className="textarea bg-background" name={"description"}
                              placeholder="Descripción producto..." onChange={handleTextArea}></textarea>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text">Selecciona imagen</span>
                        </div>
                        <input type="file"
                               className="file-input file-input-info bg-background file-input-bordered w-full max-w-xs"
                               name={"image"}
                               onChange={handle}
                        />
                    </label>

                </div>
                <div>
                    <button
                        className={"btn disabled:text-black hover:cursor-pointer"} disabled={false}>
                        Crear
                    </button>
                </div>
            </form>
        </div>
    )
}