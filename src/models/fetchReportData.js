import axios from "axios";

/**
 * the purpose of the functions in fetchIngestData.js is to collect information from Tiled under UID/Report/data 
 * If "Report" is selected, then the functions in this file will be called. The values returned will be stored in a useState that the 
 * ReportDataPage will access from UidContext.js (this is in the view-model folder)
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
