import axios from "axios";

/**
 * the purpose of the functions in fetchIngestData.js is to collect information from Tiled under UID/Ingest/data 
 * If "Ingest" is selected, then the functions in this file will be called. The values returned will be stored in a useState that the 
 * IngestDataPage will access from UidContext.js (this is in the view-model folder)
 */

export const get_cache_len = async (uidValue) => {
    try {
        const response = await axios.get(`/api/v1/search/${uidValue}/ingest/data`);
        const rawData = response.data.data;
        const parsedCacheLen=rawData.filter(item => item?.id === "cache_len").map((item) => {
            const cacheLen = item?.attributes?.structure?.shape[0];
            //if the cacheLen cannot be accessed or if there is an error return null for cacheLen
            return cacheLen ?? null;
        });
        return parsedCacheLen;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}