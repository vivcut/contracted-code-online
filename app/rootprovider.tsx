
"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

type UserContextType = {
    user: any;
    setUser: React.Dispatch<React.SetStateAction<any>>;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const PurchaseContext = createContext<any>("");

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any>(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
