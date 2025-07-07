import { useEffect, useState } from 'react';
import { IngestViewModel } from './IngestViewModel'
import { ReportViewModel } from './ReportViewModel';
import { remodelFromReportTS } from '../models/sklearn.tsx';

//not sure about the parameter 
export const RemodelViewModel = (uidValue) => {

    const [distances, setDistances] = useState([]);
    const [clusters, setClusters] = useState([]);

    const { clusterCenters, recentClusterCenters } = ReportViewModel(uidValue);

    const { independentVars, observables } = IngestViewModel(uidValue);

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
                    independentVars,
                    model_type: "KMeans"
                });

                setDistances(result.distances);
                setClusters(result.clusters);

                console.log("distances:", result.distances);
                console.log("clusters:", result.clusters);
            } catch (error) {
                console.error("Remodel error:", error);
            }
        };

        loadData();
    }, [uidValue, independentVars, observables, clusterCenters, recentClusterCenters]); //needs further testing

    return {
        distances, clusters
    };

}