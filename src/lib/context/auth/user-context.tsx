"use client"
import {createContext, ReactNode, useContext, useState} from "react";
import {User} from "@/lib/models/Account/User";

export interface UserAppContextProps {
    user: User | null,
    setUser: (values: User) => void
}

export const UserAppContext = createContext<UserAppContextProps>({
    user: null,
    setUser: (values: User) => null
});
UserAppContext.displayName = "UserAppContext"

interface UserAppContextProviderProps {
    children: ReactNode
}

export function UserAppContextProvider({children}: UserAppContextProviderProps) {
    const [user, setUser] = useState<User | null>(null)
    return (
        <UserAppContext.Provider
            value={{user, setUser}}
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