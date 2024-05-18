"use client"
import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {User} from "@/lib/models/Account/User";

export interface UserAppContextProps {
    user: () => User | null,
    setUser: (values: User) => void
}

export const UserAppContext = createContext<UserAppContextProps>({
    user: () => null,
    setUser: (values: User) => null
});
UserAppContext.displayName = "UserAppContext"

interface UserAppContextProviderProps {
    children: ReactNode
}

export function UserAppContextProvider({children}: UserAppContextProviderProps) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const rawUser = localStorage.getItem('user');

        if (rawUser) {
            setUser(JSON.parse(rawUser))
        }
    }, []);
    const getUser = (): User | null => {
        return user;
    }
    const updateUser = (user: User) => {
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
    }
    return (
        <UserAppContext.Provider
            value={{user: getUser, setUser: updateUser}}
        >
            {
                children
            }
        </UserAppContext.Provider>
    )
}

export const useUserAppContext = () => {
    const context = useContext(UserAppContext);
    if (!context) {
        throw new Error('useUserAppContext must be used within a UserAppContext')
    }
    return context;
}