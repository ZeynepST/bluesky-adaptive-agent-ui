import { useState, useEffect } from "react";
import axios from "axios";
import { createContext } from "react";
import { get_uids } from "../models/fetchUids";

export const UidContext = createContext();
export function UidProvider({ children }) {

    //uidsInfo is the list of uids and some respective information which will first be populated in a useEffect
    const [uidsInfo, setUidsInfo] = useState([]);
    const [uidRefresh, setUidRefresh] = useState(false);


    // This ensures that whenever setUidRefresh is called, UID information is updated 
    useEffect(() => {
        const fetchUidData = async () => {
            try {
                const parsedUids = await get_uids();
                setUidsInfo(parsedUids);
            } catch (err) {
                console.error("Failed to fetch UIDs:", err);
            }
        };

        fetchUidData();
    }, [uidRefresh]);
    
    return (
        <UidContext.Provider value={{ uidRefresh, uidsInfo, get_uids, setUidRefresh}}>
            {children}
        </UidContext.Provider>
    );
}