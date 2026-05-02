import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useActionData } from "react-router";
const DataContext = createContext();
export const DataProvider = ({ children }) => {
    const [showProfile, setShowProfile] = useState(false)
    const [showContacts, setShowContacts] = useState(false)
    return (
        <DataContext.Provider
            value={{
                showProfile,
                showContacts,
                setShowProfile,
                setShowContacts
            }}
        >
            {children}
        </DataContext.Provider>
    );
};
export const useData = () => useContext(DataContext);