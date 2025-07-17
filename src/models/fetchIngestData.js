import axios from "axios";

/**
 * the purpose of the functions in fetchIngestData.js is to collect information from Tiled under UID/Ingest/data 
 * If "Ingest" is selected, then the functions in this file will be called. The values returned will be stored in a useState that the 
 * IngestDataPage will access from UidContext.js (this is in the view-model folder)
 */



/**
 * Fetches the cache length for a given UID from the ingest data.
 *
 * @async
 * @function get_cache_len
 * @param {string} uidValue - The UID to fetch data for.
 * @returns {Promise<number[]|null>} An array of cache lengths (usually a single number), or null on failure.
 */
export const get_cache_len = async (uidValue) => {
    try {
        const response = await axios.get(`/api/v1/search/${uidValue}/ingest/data`);
        const rawData = response.data.data;
        const parsedCacheLen = rawData.filter(item => item?.id === "cache_len").map((item) => {
            const cacheLen = item?.attributes?.structure?.shape[0];
            // If the cacheLen cannot be accessed or if there is an error return null for cacheLen
            return cacheLen ?? null;
        });
        return parsedCacheLen;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}


/**
 * Fetches observable values from ingest data for a given UID.
 *
 * @async
 * @function get_observables
 * @param {string} uidValue - The UID to fetch data for.
 * @returns {Promise<Array>} A nested array of observable values, or empty array on failure.
 */
export const get_observables = async (uidValue) => {
    try {
        const response = await axios.get(`/api/v1/array/full/${uidValue}/ingest/data/observable?format=application/json`);
        const nestedArray = response.data;
        return nestedArray;
    }
    catch (error) {
        console.error(error);
        return [];
    }
}


/**
 * Fetches independent variable values from ingest data for a given UID.
 *
 * @async
 * @function get_independent_variables
 * @param {string} uidValue - The UID to fetch data for.
 * @returns {Promise<Array>} A nested array of independent variable values, or empty array on failure.
 */
export const get_independent_variables = async (uidValue) => {
    try {
        const response = await axios.get(`/api/v1/array/full/${uidValue}/ingest/data/independent_variable?format=application/json`);
        const nestedArray = response.data;
        return nestedArray;
    }
    catch (error) {
        console.error(error);
        return [];
    }
}


/**
 * Fetches timestamp values from ingest data for a given UID.
 *
 * @async
 * @function get_ingest_timestamps
 * @param {string} uidValue - The UID to fetch data for.
 * @returns {Promise<Array>} An array of timestamp values, or empty array on failure.
 */
export const get_ingest_timestamps=async(uidValue)=>{
    try{
        const response=await axios.get(`/api/v1/array/full/${uidValue}/ingest/data/time?format=application/json`);
        const timestampArray=response.data;
        return timestampArray;
    }
    catch(error){
        console.error(error);
        return [];
    }
}