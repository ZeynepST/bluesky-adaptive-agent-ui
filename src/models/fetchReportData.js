import axios from "axios";

/**
 * the purpose of the functions in fetchIngestData.js is to collect information from Tiled under UID/Report/data 
 * If "Report" is selected, then the functions in this file will be called. The values returned will be stored in a useState that the 
 * ReportDataPage will access from UidContext.js (this is in the view-model folder)
 */


/**
 * Fetches the cluster centers array for a given UID.
 *
 * @async
 * @function get_cluster_centers
 * @param {string} uidValue - The UID associated with the report.
 * @returns {Promise<Array|[]>} A nested array of cluster centers, or an empty array on failure.
 */
export const get_cluster_centers = async (uidValue) => {
    try {
        const response = await axios.get(`/api/v1/array/full/${uidValue}/report/data/cluster_centers?format=application/json`);
        const nestedClusters = response.data;
        return nestedClusters;
    }
    catch (error) {
        console.error(error);
        return [];
    }
}

/**
 * Fetches the report cache length for a given UID.
 *
 * @async
 * @function get_reports_cache_length
 * @param {string} uidValue - The UID associated with the report.
 * @returns {Promise<number|[]>} The cache length as a number, or an empty array on failure.
 */
export const get_reports_cache_length= async (uidValue)=>{
    try{
        const response=await axios.get(`/api/v1/array/full/${uidValue}/report/data/cache_len?format=application/json`);
        return response.data;
    }
    catch(error){
        console.error(error);
        return [];
    }
}
