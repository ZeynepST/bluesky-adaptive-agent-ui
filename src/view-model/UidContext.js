import { useState, useEffect } from "react";
import axios from "axios";
import { createContext } from "react";
import { useRef } from "react";

export const UidContext = createContext();
export function UidProvider({ children }) {

    //uidsInfo is the list of uids and some respective information which will first be populated in a useEffect
    const [uidsInfo, setUidsInfo] = useState([]);


    const getUids = async () => {
        try {
            const response = await axios.get('/api/v1/search/');
            // This is to access the nested data within the response
            const rawData = response.data.data;

            // This is parsing the nested data 
            const parsedUids = rawData.map((item) => {
                const uidValue = item.id;
                const metadata = item.attributes.metadata;
                // streamNames refers to ingest and report.
                const streamNames = metadata?.summary?.stream_names || [];
                console.log(metadata?.start?.agent_name || null);
                return {
                    uidValue,
                    hasIngest: streamNames.includes("ingest"),
                    hasReport: streamNames.includes("report"),
                    agentName: metadata?.start?.agent_name || null,
                    modelType: metadata?.start?.model_type || null,
                    datetime: metadata?.summary?.datetime || null
                };
            });

            console.log("parsed uids in fetch is ", parsedUids);
            setUidsInfo(parsedUids);
        }
        catch (error) {
            console.error("Failed to get list of uids");
        }
    }

    useEffect(() => {
        getUids();
        
    }, []);


    return (
        <UidContext.Provider value={{uidsInfo}}>
            {children}
        </UidContext.Provider>
    );
}