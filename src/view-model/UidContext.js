import { useState, useEffect } from "react";
import axios from "axios";
import { createContext } from "react";
import { useRef } from "react";

export const UidContext = createContext();
export function UidProvider({ children }) {

    //uidsInfo is the list of uids and some respective information which will first be populated in a useEffect
    const [uidsInfo, setUidsInfo] = useState([]);
    const[uidRefresh, setUidRefresh]=useState(false);

    // When a UID is clicked on, the object containing metadata is set, not just the UID number itself 
    const[chosenUidObject, setChosenUidObject]=useState(null);
    
    //viewMode refers to whether Ingest or Report was selected 
    const [viewMode, setViewMode] = useState(null);


    const get_uids = async () => {
        try {
            const response = await axios.get('/api/v1/search/');
            // This is to access the nested data within the response
            const rawData = response.data.data;

            // This is parsing the nested data 
            const parsedUids = rawData.map((item) => {
                const uidValue = item.id;
                const metadata = item.attributes.metadata;
                const model_params=item.attributes.metadata.start.model_params;
                // streamNames refers to ingest and report.
                const streamNames = metadata?.summary?.stream_names || [];               
              
                return {
                    uidValue,
                    datetime: metadata?.summary?.datetime || null,
                    hasIngest: streamNames.includes("ingest"),
                    hasReport: streamNames.includes("report"),
                    agentName: metadata?.start?.agent_name || null,
                    modelType: metadata?.start?.model_type || null,
                    modelAlgorithm: model_params?.algorithm || null, 
                    maxIter: model_params?.max_iter || null,
                    numberOfClusters: model_params?.n_clusters || null,
                    randomState: model_params?.random_state || null,
                };
            });

            setUidsInfo(parsedUids);
        }
        catch (error) {
            console.error("Failed to get list of uids");
        }
    }

    useEffect(() => {
        get_uids();
    }, [uidRefresh]);




    return (
        <UidContext.Provider value={{uidsInfo, get_uids, setUidRefresh, setChosenUidObject, chosenUidObject, viewMode, setViewMode}}>
            {children}
        </UidContext.Provider>
    );
}