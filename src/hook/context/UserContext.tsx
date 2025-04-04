import { createContext, useEffect, useState } from "react";
import { cipherDecrypt } from "../../utils/encoding/cipher";
import { User } from "../../types/userTypes";

interface UserContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isUserReady, setIsUserReady] = useState(false);

    useEffect(() => {
        const encrypted = localStorage.getItem("user");
        if (encrypted) {
            try {
                const decrypted = cipherDecrypt(encrypted);
                setUser(JSON.parse(decrypted));
            } catch (err) {
                console.error("Failed to parse user:", err);
            }
        }
        setIsUserReady(true); 
    }, []);

    if (!isUserReady) return null; 

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
