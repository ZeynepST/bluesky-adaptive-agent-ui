import { useEffect, useState } from 'react';
import { IngestViewModel } from './IngestViewModel'
import { ReportViewModel } from './ReportViewModel';
import { remodelFromReportTS } from '../models/sklearn.tsx';

//not sure about the parameter 
export const RemodelViewModel = (uidValue, clusterCenters, recentClusterCenters, independentVars, observables) => {

    const [distances, setDistances] = useState([]);
    const [clusterLabels, setClusterLabels] = useState([]);

    useEffect(() => {

        if (!uidValue || !observables || !Array.isArray(observables) || observables.length === 0 || !Array.isArray(observables[0])) {
            //we return if the data has not yet loaded 
            return;
        }

        if (!recentClusterCenters || !Array.isArray(recentClusterCenters) || recentClusterCenters.length === 0) {
            return;
        }

        const loadData = async () => {
            try {
                const result = await remodelFromReportTS({
                    observables,
                    clusterCenters,
                    recentClusterCenters,
                    model_type: "KMeans"
                });

                setDistances(result.distances);
                setClusterLabels(result.clusterLabels);

                console.log("distances:", result.distances);
                console.log("clusterLabels:", result.clusterLabels);
            } catch (error) {
                console.error("Remodel error:", error);
            }
        };

        loadData();
    }, [uidValue, independentVars, observables, clusterCenters, recentClusterCenters]); //needs further testing

    return {
        distances, clusterLabels
    };

}