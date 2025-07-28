import { useState, useEffect } from "react";
import { createContext } from "react";
import { get_uids } from "../models/fetchUids";

/**
 * UidContext provides state and refresh logic for UID data used across the application.
 * It fetches UID info from the server and allows child components to trigger a refresh.
 * @context
 * @property {Array} uidsInfo - List of UIDs and related metadata.
 * @property {boolean} uidRefresh - Flag to trigger re-fetching UIDs.
 * @property {Function} setUidRefresh - Function to toggle `uidRefresh`.
 * @property {Function} get_uids - Async function that fetches UID data.
*/
export const UidContext = createContext();


/**
 * UidProvider component wraps children with UID context 
 * @param {Object} props - The component's props. 
 * @param {React.ReactNode} props.children - The components that will consume the context.
 * @returns 
 */
export function UidProvider({ children }) {

    /**
     * List of all avaialble uids and their metadata 
     * @type {string[]}
     */
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
        <UidContext.Provider value={{ uidRefresh, uidsInfo, get_uids, setUidRefresh }}>
            {children}
        </UidContext.Provider>
    );
}