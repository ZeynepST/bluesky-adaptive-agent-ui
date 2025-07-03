import { useEffect, useState } from 'react';
import { IngestViewModel } from './IngestViewModel'
import { ReportViewModel } from './ReportViewModel';
import { remodelFromReportTS } from '../models/sklearn.tsx';

//not sure about the parameter 
export const RemodelViewModel = (uidValue) => {

    const [distances, setDistances] = useState([]);
    const [clusters, setClusters] = useState([]);

    const { cluster_centers, recentClusterCenters } = ReportViewModel(uidValue);

    const { independent_vars, observables } = IngestViewModel(uidValue);

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
                    cluster_centers,
                    recentClusterCenters,
                    independent_vars,
                    model_type: "KMeans"
                });

                setDistances(result.distances);
                setClusters(result.clusters);

                console.log("distances:", result.distances);
                console.log("c lusters:", result.clusters);
            } catch (error) {
                console.error("Remodel error:", error);
            }
        };

        loadData();
    }, [uidValue, independent_vars, observables, cluster_centers, recentClusterCenters]); //needs further testing

    return {
        distances, clusters
    };

}