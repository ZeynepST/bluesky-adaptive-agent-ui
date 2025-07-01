import { useState, useEffect } from "react";
import { get_cluster_centers } from "../models/fetchReportData";


//uid is the object, not the uid number itself. To access the uid number you need to do uid.uidValue as defined in fetchUids.js
export const ReportViewModel = (uidValue) => {



    const [clusterCenters, setClusterCenters] = useState([]);
    const [recentClusterCenters, setRecentClusterCenter] = useState([]);
    const [loadingReport, setLoadingReport] = useState(false);

    useEffect(() => {

        if (!uidValue) return;

        const loadData = async () => {
            try {
                setLoadingReport(true);
                const clusterCentersResponse = await get_cluster_centers(uidValue);
                setClusterCenters(clusterCentersResponse);
                setRecentClusterCenter(clusterCentersResponse.at(-1));
            }
            catch (error) {
                console.error(error);
            }
            finally {
                setLoadingReport(false);
            }
        }
        loadData();
    }, [uidValue]); //need to check [uidValue]


    return {
        clusterCenters, recentClusterCenters
    };



};