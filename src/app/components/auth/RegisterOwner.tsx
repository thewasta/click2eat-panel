import React, {useEffect, useState} from "react";
import FormInputText from "@/app/components/form/FormInputText";
import {FaUser, FaUserCircle} from "react-icons/fa";
import {MdEmail, MdLock} from "react-icons/md";

export interface RegisterOwnerData {
    name: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface RegisterOwnerProps {
    data: RegisterOwnerData,
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const RegisterOwnerForm = (props: RegisterOwnerProps) => {
    const {data, handleChange} = props;
    const [passwordIsEqual, setPasswordIsEqual] = useState<boolean>(true);
    useEffect(() => {
        if ((!data.password || !data.confirmPassword) && data.password.length === 0){
            console.log('here');
            setPasswordIsEqual(true);
            return;
        }
        if (data.password !== data.confirmPassword) {
            setPasswordIsEqual(false);
        } else {
            setPasswordIsEqual(true);
        }
    }, [data]);
    return (
        <>
            <div className="flex gap-3 flex-col">
                <div className="flex md:flex-row flex-col gap-3">
                    <FormInputText
                        required={true}
                        icon={<FaUser/>}
                        name={"name"}
                        value={data.name || ''}
                        inputType="text"
                        placeholder="Nombre"
                        labelClassName="w-1/2"
                        onChange={handleChange}
                    />
                    <FormInputText
                        required={true}
                        icon={<FaUser/>}
                        name={"lastName"}
                        value={data.lastName || ''}
                        inputType="text"
                        placeholder="Apellido"
                        labelClassName="w-1/2"
                        onChange={handleChange}
                    />
                </div>
                <div className="flex md:flex-row flex-col gap-3">
                    <FormInputText
                        required={true}
                        icon={<FaUserCircle/>}
                        placeholder="Nombre usuario"
                        inputType={"text"}
                        name={"username"}
                        value={data.username || ''}
                        labelClassName={"w-1/2"}
                        onChange={handleChange}
                    />
                    <FormInputText
                        required={true}
                        name={"email"}
                        value={data.email || ''}
                        icon={<MdEmail/>}
                        onChange={handleChange}
                        labelClassName="w-1/2"
                        placeholder={"Correo electrónico"}
                        inputType={"text"}
                    />
                </div>
                <div className="flex md:flex-row flex-col gap-3">
                    <FormInputText
                        required={true}
                        name={"password"}
                        value={data.password || ''}
                        icon={<MdLock/>}
                        inputType="password"
                        labelClassName={`w-1/2 ${!passwordIsEqual ? 'border-red-500 focus:border-red-500' : ''}`}
                        placeholder="Contraseña"
                        onChange={handleChange}
                    />
                    <FormInputText
                        required={true}
                        name={"confirmPassword"}
                        value={data.confirmPassword || ''}
                        icon={<MdLock/>}
                        inputType="password"
                        labelClassName={`w-1/2 ${!passwordIsEqual ? 'border-red-500 focus:border-red-500' : ''}`}
                        placeholder="Confirmar contraseña"
                        onChange={handleChange}/>
                </div>
            </div>
        </>
    )
}

export default RegisterOwnerForm;